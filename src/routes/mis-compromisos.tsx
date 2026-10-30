import { createFileRoute, Link } from "@tanstack/react-router";
import { BadgeCheck, CalendarRange, Clock3, Ticket, TriangleAlert } from "lucide-react";
import { AppShell } from "@/components/casino/AppShell";
import { EstadoChip } from "@/components/casino/MenuCard";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  DIAS,
  HORA_CORTE,
  estadoDe,
  fechaDia,
  nombreComedor,
  nombreDia,
  nombreTipo,
} from "@/lib/casino-data";
import { useCasino } from "@/lib/casino-store";

export const Route = createFileRoute("/mis-compromisos")({
  head: () => ({
    meta: [
      { title: "Mis compromisos de almuerzo | Casino USM" },
      {
        name: "description",
        content:
          "Revisa tu suscripción activa, libera días puntuales y administra tus reservas confirmadas del casino universitario.",
      },
      { property: "og:title", content: "Mis compromisos de almuerzo | Casino USM" },
      {
        property: "og:description",
        content: "Suscripción y reservas puntuales, claramente separadas, con su hora de corte.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Compromisos,
});

function Compromisos() {
  const { suscripcion, reservas, platoDe, alternarDiaSuscripcion, cancelarSuscripcion, confirmarReserva, liberarReserva } =
    useCasino();

  return (
    <AppShell>
      <h1 className="font-[family-name:var(--font-display)] text-3xl font-semibold">Mis compromisos</h1>
      <p className="mt-1 text-muted-foreground">
        Dos cosas distintas: tu suscripción recurrente y tus reservas para un día puntual.
      </p>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* Bloque A: suscripción */}
        <section className="rounded-xl border-2 border-brand/40 bg-brand-soft/40 p-5">
          <header className="flex items-center gap-2">
            <CalendarRange className="h-5 w-5 text-brand" />
            <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-brand">
              A · Mi suscripción
            </h2>
          </header>
          <p className="mt-1 text-sm text-muted-foreground">Compromiso recurrente, se repite cada semana.</p>

          {!suscripcion ? (
            <div className="mt-5 rounded-lg border border-dashed border-border bg-surface p-5 text-center">
              <p className="text-sm text-muted-foreground">No tienes una suscripción activa.</p>
              <Button asChild className="mt-3">
                <Link to="/suscripcion">Crear suscripción</Link>
              </Button>
            </div>
          ) : (
            <>
              <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-md bg-surface p-3">
                  <dt className="text-xs text-muted-foreground">Modalidad</dt>
                  <dd className="font-semibold capitalize">{suscripcion.modalidad}</dd>
                </div>
                <div className="rounded-md bg-surface p-3">
                  <dt className="text-xs text-muted-foreground">Comedor habitual</dt>
                  <dd className="font-semibold">{nombreComedor(suscripcion.comedor)}</dd>
                </div>
                <div className="col-span-2 rounded-md bg-surface p-3">
                  <dt className="text-xs text-muted-foreground">Vigencia</dt>
                  <dd className="font-semibold">
                    Rige hasta el {suscripcion.vigenciaHasta} · puedes modificarla hasta las {HORA_CORTE} hrs
                    del día anterior
                  </dd>
                </div>
              </dl>

              <ul className="mt-4 space-y-2">
                {suscripcion.dias.map((d) => {
                  const plato = platoDe(d.dia, suscripcion.comedor, d.tipo);
                  return (
                    <li
                      key={d.dia}
                      className={cn(
                        "flex flex-wrap items-center gap-3 rounded-lg border bg-surface p-3",
                        d.liberado ? "border-dashed border-border opacity-70" : "border-border",
                      )}
                    >
                      <div className="min-w-40 flex-1">
                        <p className="font-medium">
                          {nombreDia(d.dia)} · {nombreTipo(d.tipo)}
                        </p>
                        <p className="text-xs text-muted-foreground">{plato.nombre}</p>
                      </div>
                      {d.liberado ? (
                        <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-semibold text-muted-foreground">
                          Cupo liberado
                        </span>
                      ) : (
                        <EstadoChip estado={estadoDe(plato)} />
                      )}
                      <Button
                        size="sm"
                        variant={d.liberado ? "secondary" : "outline"}
                        onClick={() => alternarDiaSuscripcion(d.dia)}
                      >
                        {d.liberado ? "Retomar día" : "Liberar este día"}
                      </Button>
                    </li>
                  );
                })}
              </ul>

              <div className="mt-4 flex gap-2">
                <Button asChild variant="outline" size="sm">
                  <Link to="/suscripcion">Editar suscripción</Link>
                </Button>
                <Button variant="ghost" size="sm" onClick={cancelarSuscripcion}>
                  Cancelar suscripción
                </Button>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                Liberar un día no cancela tu suscripción: solo cedes ese almuerzo y el cupo queda disponible
                para otra persona.
              </p>
            </>
          )}
        </section>

        {/* Bloque B: reservas puntuales */}
        <section className="rounded-xl border-2 border-dashed border-warning/70 bg-warning-soft/40 p-5">
          <header className="flex items-center gap-2">
            <Ticket className="h-5 w-5 text-warning-foreground" />
            <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-warning-foreground">
              B · Reservas puntuales
            </h2>
          </header>
          <p className="mt-1 text-sm text-muted-foreground">
            Compromisos para un día específico, no se repiten.
          </p>

          {reservas.length === 0 ? (
            <div className="mt-5 rounded-lg border border-dashed border-border bg-surface p-5 text-center">
              <p className="text-sm text-muted-foreground">No tienes reservas puntuales.</p>
              <Button asChild className="mt-3">
                <Link to="/reservar">Reservar un almuerzo</Link>
              </Button>
            </div>
          ) : (
            <ul className="mt-4 space-y-3">
              {reservas.map((r) => {
                const plato = platoDe(r.dia, r.comedor, r.tipo);
                return (
                  <li key={r.id} className="rounded-lg border border-border bg-surface p-4">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <p className="font-medium">
                          {nombreDia(r.dia)} {fechaDia(r.dia)} · {nombreTipo(r.tipo)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {plato.nombre} — {nombreComedor(r.comedor)}
                        </p>
                      </div>
                      {r.confirmada ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-success-soft px-2.5 py-1 text-xs font-semibold text-success">
                          <BadgeCheck className="h-3.5 w-3.5" /> Reservado y confirmado
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-warning-soft px-2.5 py-1 text-xs font-semibold text-warning-foreground">
                          <TriangleAlert className="h-3.5 w-3.5" /> Pendiente de confirmar
                        </span>
                      )}
                    </div>
                    <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Clock3 className="h-3.5 w-3.5" />
                      Puedes liberar este cupo hasta las {HORA_CORTE} hrs del día anterior.
                    </p>
                    <div className="mt-3 flex gap-2">
                      {!r.confirmada && (
                        <Button size="sm" onClick={() => confirmarReserva(r.id)}>
                          Confirmar mi reserva
                        </Button>
                      )}
                      <Button size="sm" variant="outline" onClick={() => liberarReserva(r.id)}>
                        Liberar cupo
                      </Button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}

          <div className="mt-4">
            <Button asChild variant="outline" size="sm">
              <Link to="/reservar">Nueva reserva puntual</Link>
            </Button>
          </div>
        </section>
      </div>

      <p className="mt-6 text-xs text-muted-foreground">
        Semana mostrada: {DIAS[0]!.fecha} al {DIAS[DIAS.length - 1]!.fecha}.
      </p>
    </AppShell>
  );
}
