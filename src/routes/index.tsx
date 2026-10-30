import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AlertTriangle, CalendarClock } from "lucide-react";
import { AppShell } from "@/components/casino/AppShell";
import { PlatoExpandible } from "@/components/casino/PlatoExpandible";
import { Accordion } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { CATEGORIAS_MENU, menuDelDia } from "@/lib/menu-diario";
import { cn } from "@/lib/utils";
import {
  DIAS,
  HORA_CORTE,
  estadoDe,
  fechaDia,
  keyDe,
  nombreComedor,
  nombreDia,
  nombreTipo,
  type DiaId,
} from "@/lib/casino-data";
import { useCasino } from "@/lib/casino-store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Menú del día y disponibilidad | Casino USM" },
      {
        name: "description",
        content:
           "Consulta el menú completo del día, sus alérgenos y la disponibilidad de los fondos en Casino P y Patio central.",
      },
      { property: "og:title", content: "Menú del día y disponibilidad | Casino USM" },
      {
        property: "og:description",
        content: "Menú completo, alérgenos y disponibilidad de platos por ubicación en Casino USM.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Panel,
});

function Panel() {
  const { platoDe, platos, suscripcion, reservas } = useCasino();
  const [dia, setDia] = useState<DiaId>("lun");
  const menu = useMemo(() => menuDelDia(dia, platos), [dia, platos]);

  const comprometidos = useMemo(() => {
    const map = new Map<string, string>();
    reservas.forEach((r) =>
      map.set(
        keyDe(r.dia, r.comedor, r.tipo),
        r.confirmada ? "Tu reserva puntual confirmada" : "Tu reserva puntual pendiente de confirmar",
      ),
    );
    suscripcion?.dias
      .filter((d) => !d.liberado)
      .forEach((d) => map.set(keyDe(d.dia, suscripcion.comedor, d.tipo), "Incluido en tu suscripción"));
    return map;
  }, [reservas, suscripcion]);

  const alertas = useMemo(() => {
    const out: { texto: string; estado: "por-agotar" | "agotado" }[] = [];
    comprometidos.forEach((detalle, key) => {
      const [d, c, t] = key.split("|") as [DiaId, never, never];
      const plato = platoDe(d, c, t);
      const estado = estadoDe(plato);
      if (estado === "disponible") return;
      out.push({
        estado,
        texto: `${nombreTipo(t)} del ${nombreDia(d).toLowerCase()} en ${nombreComedor(c)} — ${detalle.toLowerCase()}`,
      });
    });
    return out;
  }, [comprometidos, platoDe]);

  return (
    <AppShell>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-3xl font-semibold text-foreground">
            Menú del día
          </h1>
          <p className="mt-1 text-muted-foreground">
            Casino USM · {nombreDia(dia)} {fechaDia(dia)}
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-md border border-brand/30 bg-brand-soft px-3 py-2 text-sm text-brand">
          <CalendarClock className="h-4 w-4" />
          Puedes reservar, modificar o liberar hasta las <strong>{HORA_CORTE} hrs</strong> del día anterior.
        </div>
      </div>

      {alertas.length > 0 && (
        <div className="mt-6 space-y-2">
          {alertas.map((a, i) => (
            <div
              key={i}
              className={cn(
                "flex items-start gap-3 rounded-lg border p-3 text-sm",
                a.estado === "agotado"
                  ? "border-danger/50 bg-danger-soft text-danger"
                  : "border-warning/60 bg-warning-soft text-warning-foreground",
              )}
            >
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              <p>
                <strong>{a.estado === "agotado" ? "Menú agotado: " : "Quedan pocas raciones: "}</strong>
                {a.texto}.{" "}
                <Link to="/mis-compromisos" className="underline underline-offset-2">
                  Revisar mis compromisos
                </Link>
              </p>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 flex flex-wrap gap-2">
        {DIAS.map((d) => (
          <Button
            key={d.id}
             variant="outline"
             aria-pressed={dia === d.id}
            onClick={() => setDia(d.id)}
            className={cn(
              "rounded-md border px-4 py-2 text-sm font-medium transition-colors",
              dia === d.id
                ? "border-brand bg-brand text-brand-foreground"
                : "border-border bg-surface text-foreground hover:bg-secondary",
            )}
          >
            {d.nombre}
            <span className="ml-2 text-xs opacity-70">{d.fecha.split(" de ")[0]}</span>
          </Button>
        ))}
      </div>

      <Accordion key={dia} type="multiple" className="mt-6 grid items-start gap-x-6 gap-y-5 md:grid-cols-2">
        {CATEGORIAS_MENU.map((categoria) => (
          <section key={categoria.id} aria-labelledby={`categoria-${categoria.id}`} className="min-w-0">
            <h2 id={`categoria-${categoria.id}`} className="mb-2 font-[family-name:var(--font-display)] text-lg font-semibold">{categoria.nombre}</h2>
            <div className="space-y-2">
              {menu.filter((p) => p.categoria === categoria.id).map((p) => (
                <PlatoExpandible key={p.id} plato={p} compromiso={p.disponibilidad.map((d) => comprometidos.get(d.plato.key)).find(Boolean)} />
              ))}
            </div>
          </section>
        ))}
      </Accordion>
    </AppShell>
  );
}
