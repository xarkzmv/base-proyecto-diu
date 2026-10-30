import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from "react";
import { toast } from "sonner";
import {
  DIAS,
  estadoDe,
  keyDe,
  nombreDia,
  nombreTipo,
  platosIniciales,
  type ComedorId,
  type DiaId,
  type Plato,
  type TipoMenu,
} from "./casino-data";

export type Suscripcion = {
  modalidad: "semanal" | "mensual";
  comedor: ComedorId;
  vigenciaHasta: string;
  dias: { dia: DiaId; tipo: TipoMenu; liberado: boolean }[];
} | null;

export type Reserva = {
  id: string;
  dia: DiaId;
  comedor: ComedorId;
  tipo: TipoMenu;
  confirmada: boolean;
};

type Ctx = {
  usuario: { nombre: string; cargo: string };
  platos: Plato[];
  suscripcion: Suscripcion;
  reservas: Reserva[];
  platoDe: (dia: DiaId, comedor: ComedorId, tipo: TipoMenu) => Plato;
  simularCanjes: (cantidad: number, dia: DiaId) => void;
  reiniciarStock: () => void;
  guardarSuscripcion: (s: NonNullable<Suscripcion>) => void;
  cancelarSuscripcion: () => void;
  alternarDiaSuscripcion: (dia: DiaId) => void;
  crearReserva: (r: Omit<Reserva, "id">) => string;
  confirmarReserva: (id: string) => void;
  liberarReserva: (id: string) => void;
};

const CasinoContext = createContext<Ctx | null>(null);

export function CasinoProvider({ children }: { children: ReactNode }) {
  const [platos, setPlatos] = useState<Plato[]>(() => platosIniciales());
  const [suscripcion, setSuscripcion] = useState<Suscripcion>({
    modalidad: "mensual",
    comedor: "casa-central",
    vigenciaHasta: "30 de septiembre",
    dias: [
      { dia: "lun", tipo: "hipocalorico", liberado: false },
      { dia: "mar", tipo: "comun", liberado: false },
      { dia: "jue", tipo: "vegetariano", liberado: false },
    ],
  });
  const [reservas, setReservas] = useState<Reserva[]>([
    { id: "r-1", dia: "mie", comedor: "edificio-p", tipo: "vegetariano", confirmada: false },
  ]);

  const avisados = useRef<Record<string, string>>({});

  const platoDe = useCallback(
    (dia: DiaId, comedor: ComedorId, tipo: TipoMenu) =>
      platos.find((p) => p.key === keyDe(dia, comedor, tipo))!,
    [platos],
  );

  const comprometidos = useMemo(() => {
    const set = new Set<string>();
    reservas.forEach((r) => set.add(keyDe(r.dia, r.comedor, r.tipo)));
    suscripcion?.dias
      .filter((d) => !d.liberado)
      .forEach((d) => set.add(keyDe(d.dia, suscripcion.comedor, d.tipo)));
    return set;
  }, [reservas, suscripcion]);

  const avisar = useCallback(
    (nuevos: Plato[]) => {
      nuevos.forEach((p) => {
        if (!comprometidos.has(p.key)) return;
        const estado = estadoDe(p);
        if (estado === "disponible") return;
        if (avisados.current[p.key] === estado) return;
        avisados.current[p.key] = estado;
        const donde = `${nombreTipo(p.tipo)} · ${nombreDia(p.dia)}`;
        if (estado === "agotado") {
          toast.error(`Tu menú reservado se agotó: ${donde}`, {
            description: "Cocina ya no tiene raciones de este menú. Revisa alternativas o libera tu cupo.",
          });
        } else {
          toast.warning(`Quedan pocas raciones: ${donde}`, {
            description: "Tu menú reservado está por agotarse. Confirma que asistirás a tiempo.",
          });
        }
      });
    },
    [comprometidos],
  );

  const simularCanjes = useCallback(
    (cantidad: number, dia: DiaId) => {
      setPlatos((prev) => {
        const next = prev.map((p) =>
          p.dia === dia ? { ...p, canjeadas: Math.min(p.producidas, p.canjeadas + cantidad) } : p,
        );
        setTimeout(() => avisar(next.filter((p) => p.dia === dia)), 0);
        return next;
      });
    },
    [avisar],
  );

  const reiniciarStock = useCallback(() => {
    avisados.current = {};
    setPlatos(platosIniciales());
    toast.success("Stock de demostración reiniciado");
  }, []);

  const descontar = useCallback((dia: DiaId, comedor: ComedorId, tipo: TipoMenu, n: number) => {
    setPlatos((prev) =>
      prev.map((p) =>
        p.key === keyDe(dia, comedor, tipo)
          ? { ...p, canjeadas: Math.max(0, Math.min(p.producidas, p.canjeadas + n)) }
          : p,
      ),
    );
  }, []);

  const value: Ctx = {
    usuario: { nombre: "Pedro Gonzales", cargo: "Dirección de Asuntos Docentes · Casa Central" },
    platos,
    suscripcion,
    reservas,
    platoDe,
    simularCanjes,
    reiniciarStock,
    guardarSuscripcion: (s) => {
      setSuscripcion(s);
      toast.success("Suscripción guardada", {
        description: `${s.dias.length} día(s) a la semana, vigente hasta el ${s.vigenciaHasta}.`,
      });
    },
    cancelarSuscripcion: () => {
      setSuscripcion(null);
      toast.success("Suscripción cancelada");
    },
    alternarDiaSuscripcion: (dia) => {
      setSuscripcion((prev) => {
        if (!prev) return prev;
        const dias = prev.dias.map((d) => (d.dia === dia ? { ...d, liberado: !d.liberado } : d));
        const target = dias.find((d) => d.dia === dia)!;
        toast[target.liberado ? "success" : "info"](
          target.liberado
            ? `Liberaste tu cupo del ${nombreDia(dia).toLowerCase()}`
            : `Retomaste tu cupo del ${nombreDia(dia).toLowerCase()}`,
          { description: "Tu suscripción sigue activa." },
        );
        return { ...prev, dias };
      });
    },
    crearReserva: (r) => {
      const id = `r-${Date.now()}`;
      setReservas((prev) => [...prev, { ...r, id }]);
      return id;
    },
    confirmarReserva: (id) => {
      setReservas((prev) =>
        prev.map((r) => {
          if (r.id !== id || r.confirmada) return r;
          descontar(r.dia, r.comedor, r.tipo, 1);
          return { ...r, confirmada: true };
        }),
      );
    },
    liberarReserva: (id) => {
      setReservas((prev) => {
        const r = prev.find((x) => x.id === id);
        if (r?.confirmada) descontar(r.dia, r.comedor, r.tipo, -1);
        return prev.filter((x) => x.id !== id);
      });
      toast.success("Cupo liberado", { description: "Cocina no preparará ese plato para ti." });
    },
  };

  return <CasinoContext.Provider value={value}>{children}</CasinoContext.Provider>;
}

export function useCasino() {
  const ctx = useContext(CasinoContext);
  if (!ctx) throw new Error("useCasino debe usarse dentro de CasinoProvider");
  return ctx;
}

export const DIAS_SEMANA = DIAS;
