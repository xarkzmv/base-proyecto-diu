import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AlertTriangle, ChevronLeft, ShieldCheck, Ticket } from "lucide-react";
import { AppShell } from "@/components/casino/AppShell";
import { EstadoChip } from "@/components/casino/MenuCard";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  COMEDORES,
  DIAS,
  HORA_CORTE,
  TIPOS,
  estadoDe,
  fechaDia,
  nombreComedor,
  nombreDia,
  nombreTipo,
  type ComedorId,
  type DiaId,
  type TipoMenu,
} from "@/lib/casino-data";
import { useCasino } from "@/lib/casino-store";
import { toast } from "sonner";

export const Route = createFileRoute("/reservar")({
  head: () => ({
    meta: [
      { title: "Reservar un almuerzo puntual | Casino USM" },
      {
        name: "description",
        content:
          "Elige día, comedor y menú, y confirma tu compromiso de asistencia para que cocina prepare tu plato en el casino universitario.",
      },
      { property: "og:title", content: "Reservar un almuerzo puntual | Casino USM" },
      {
        property: "og:description",
        content: "Reserva puntual con confirmación explícita y plazo claro para liberar el cupo.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ReservaPuntual,
});

function ReservaPuntual() {
  const { platoDe, crearReserva, confirmarReserva } = useCasino();
  const navigate = useNavigate();
  const [paso, setPaso] = useState<1 | 2>(1);
  const [dia, setDia] = useState<DiaId>("mar");
  const [comedor, setComedor] = useState<ComedorId>("casa-central");
  const [tipo, setTipo] = useState<TipoMenu | null>(null);
  const [acepta, setAcepta] = useState(false);

  const plato = tipo ? platoDe(dia, comedor, tipo) : null;

  const confirmar = () => {
    if (!tipo) return;
    const id = crearReserva({ dia, comedor, tipo, confirmada: false });
    confirmarReserva(id);
    toast.success("Reserva confirmada", {
      description: `Cocina preparará tu ${nombreTipo(tipo).toLowerCase()} del ${nombreDia(dia).toLowerCase()}.`,
    });
    navigate({ to: "/mis-compromisos" });
  };

  const guardarPendiente = () => {
    if (!tipo) return;
    crearReserva({ dia, comedor, tipo, confirmada: false });
    toast.info("Reserva guardada como pendiente", {
      description: "Aún no está confirmada: cocina no la considerará hasta que la confirmes.",
    });
    navigate({ to: "/mis-compromisos" });
  };

  return (
    <AppShell>
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center gap-2 text-warning-foreground">
          <Ticket className="h-5 w-5" />
          <span className="text-sm font-semibold tracking-wide uppercase">
            Caso B · Usuario sin suscripción
          </span>
        </div>
        <h1 className="mt-1 font-[family-name:var(--font-display)] text-3xl font-semibold">
          Reservar un almuerzo puntual
        </h1>
        <p className="mt-1 text-muted-foreground">
          Cada almuerzo es una decisión para un día específico y requiere tu confirmación explícita.
        </p>

        {paso === 1 && (
          <section className="mt-6 space-y-6 rounded-xl border border-border bg-surface p-6">
            <div>
              <h2 className="font-semibold">1. Día</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {DIAS.map((d) => (
                  <button
                    key={d.id}
                    onClick={() => {
                      setDia(d.id);
                      setTipo(null);
                    }}
                    className={cn(
                      "rounded-md border px-4 py-2 text-sm font-medium",
                      dia === d.id ? "border-brand bg-brand text-brand-foreground" : "border-border",
                    )}
                  >
                    {d.nombre} <span className="text-xs opacity-70">{d.fecha.split(" de ")[0]}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h2 className="font-semibold">2. Comedor</h2>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {COMEDORES.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      setComedor(c.id);
                      setTipo(null);
                    }}
                    className={cn(
                      "rounded-lg border p-4 text-left",
                      comedor === c.id ? "border-brand bg-brand-soft" : "border-border hover:bg-secondary",
                    )}
                  >
                    <p className="font-medium">{c.nombre}</p>
                    <p className="text-sm text-muted-foreground">{c.ubicacion}</p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h2 className="font-semibold">3. Menú</h2>
              <div className="mt-3 grid gap-3 md:grid-cols-3">
                {TIPOS.map((t) => {
                  const p = platoDe(dia, comedor, t.id);
                  const estado = estadoDe(p);
                  const agotado = estado === "agotado";
                  return (
                    <button
                      key={t.id}
                      disabled={agotado}
                      onClick={() => setTipo(t.id)}
                      className={cn(
                        "rounded-lg border p-4 text-left transition-colors",
                        agotado && "cursor-not-allowed opacity-60",
                        tipo === t.id ? "border-brand bg-brand-soft" : "border-border hover:bg-secondary",
                      )}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-medium">{t.nombre}</p>
                        <EstadoChip estado={estado} />
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">{p.nombre}</p>
                      <p className="mt-2 text-xs text-muted-foreground">
                        Quedan {Math.max(0, p.producidas - p.canjeadas)} de {p.producidas} raciones
                      </p>
                      {estado === "por-agotar" && (
                        <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-warning-foreground">
                          <AlertTriangle className="h-3.5 w-3.5" /> Quedan pocas raciones, confirma pronto
                        </p>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-end">
              <Button disabled={!tipo} onClick={() => setPaso(2)}>
                Continuar al compromiso
              </Button>
            </div>
          </section>
        )}

        {paso === 2 && plato && tipo && (
          <section className="mt-6 rounded-xl border-2 border-brand/50 bg-surface p-6">
            <div className="flex items-center gap-2 text-brand">
              <ShieldCheck className="h-5 w-5" />
              <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold">
                Confirma tu compromiso
              </h2>
            </div>

            <dl className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-md bg-secondary p-3">
                <dt className="text-xs text-muted-foreground">Día</dt>
                <dd className="font-semibold">
                  {nombreDia(dia)} {fechaDia(dia)}
                </dd>
              </div>
              <div className="rounded-md bg-secondary p-3">
                <dt className="text-xs text-muted-foreground">Comedor</dt>
                <dd className="font-semibold">{nombreComedor(comedor)}</dd>
              </div>
              <div className="rounded-md bg-secondary p-3 sm:col-span-2">
                <dt className="text-xs text-muted-foreground">Menú</dt>
                <dd className="font-semibold">
                  {nombreTipo(tipo)} — {plato.nombre}
                </dd>
              </div>
            </dl>

            <div className="mt-4 rounded-lg border border-warning/60 bg-warning-soft p-4 text-sm text-warning-foreground">
              <p>
                <strong>Al confirmar, cocina preparará tu plato.</strong> Si no vas a asistir, libera tu cupo
                antes de las {HORA_CORTE} hrs del día anterior para que otra persona pueda
                usarlo.
              </p>
            </div>

            <label className="mt-4 flex items-start gap-3 text-sm">
              <input
                type="checkbox"
                className="mt-1"
                checked={acepta}
                onChange={(e) => setAcepta(e.target.checked)}
              />
              <span>
                Me comprometo a asistir el {nombreDia(dia).toLowerCase()} y consumir el menú{" "}
                {nombreTipo(tipo).toLowerCase()}.
              </span>
            </label>

            <div className="mt-6 flex flex-wrap justify-between gap-2">
              <Button variant="ghost" onClick={() => setPaso(1)}>
                <ChevronLeft className="mr-1 h-4 w-4" /> Cambiar selección
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" onClick={guardarPendiente}>
                  Guardar como pendiente
                </Button>
                <Button disabled={!acepta} onClick={confirmar}>
                  Confirmar mi reserva
                </Button>
              </div>
            </div>
          </section>
        )}
      </div>
    </AppShell>
  );
}
