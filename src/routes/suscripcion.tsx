import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { CalendarRange, Check, ChevronLeft, ChevronRight } from "lucide-react";
import { AppShell } from "@/components/casino/AppShell";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  COMEDORES,
  DIAS,
  HORA_CORTE,
  TIPOS,
  nombreComedor,
  nombreDia,
  nombreTipo,
  type ComedorId,
  type DiaId,
  type TipoMenu,
} from "@/lib/casino-data";
import { useCasino } from "@/lib/casino-store";

export const Route = createFileRoute("/suscripcion")({
  head: () => ({
    meta: [
      { title: "Suscripción de almuerzos | Casino USM" },
      {
        name: "description",
        content:
          "Configura tu suscripción semanal o mensual al casino: elige los días que asistirás y tu menú preferido para cada uno.",
      },
      { property: "og:title", content: "Suscripción de almuerzos | Casino USM" },
      {
        property: "og:description",
        content: "Modalidad, días de asistencia y menú por defecto en tres pasos.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: SuscripcionWizard,
});

const PASOS = ["Modalidad", "Días y comedor", "Menú por día"];

function SuscripcionWizard() {
  const { suscripcion, guardarSuscripcion } = useCasino();
  const navigate = useNavigate();
  const [paso, setPaso] = useState(0);
  const [modalidad, setModalidad] = useState<"semanal" | "mensual">(suscripcion?.modalidad ?? "mensual");
  const [comedor, setComedor] = useState<ComedorId>(suscripcion?.comedor ?? "casa-central");
  const [dias, setDias] = useState<Record<string, TipoMenu | null>>(() => {
    const base: Record<string, TipoMenu | null> = {};
    DIAS.forEach((d) => (base[d.id] = null));
    suscripcion?.dias.forEach((d) => (base[d.dia] = d.tipo));
    return base;
  });

  const seleccionados = DIAS.filter((d) => dias[d.id] !== null);
  const vigencia = modalidad === "mensual" ? "30 de septiembre" : "11 de septiembre";

  const guardar = () => {
    guardarSuscripcion({
      modalidad,
      comedor,
      vigenciaHasta: vigencia,
      dias: seleccionados.map((d) => ({ dia: d.id as DiaId, tipo: dias[d.id] as TipoMenu, liberado: false })),
    });
    navigate({ to: "/mis-compromisos" });
  };

  return (
    <AppShell>
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center gap-2 text-brand">
          <CalendarRange className="h-5 w-5" />
          <span className="text-sm font-semibold tracking-wide uppercase">Caso A · Usuario suscrito</span>
        </div>
        <h1 className="mt-1 font-[family-name:var(--font-display)] text-3xl font-semibold">
          {suscripcion ? "Editar mi suscripción" : "Crear mi suscripción"}
        </h1>
        <p className="mt-1 text-muted-foreground">
          Tu suscripción reserva automáticamente los días que marques. Puedes liberar días puntuales después
          sin perder el beneficio.
        </p>

        <ol className="mt-6 flex gap-2">
          {PASOS.map((p, i) => (
            <li
              key={p}
              className={cn(
                "flex flex-1 items-center gap-2 rounded-md border px-3 py-2 text-sm",
                i === paso
                  ? "border-brand bg-brand text-brand-foreground"
                  : i < paso
                    ? "border-success/50 bg-success-soft text-success"
                    : "border-border bg-surface text-muted-foreground",
              )}
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-black/10 text-xs">
                {i < paso ? <Check className="h-3 w-3" /> : i + 1}
              </span>
              {p}
            </li>
          ))}
        </ol>

        <section className="mt-6 rounded-xl border border-border bg-surface p-6">
          {paso === 0 && (
            <div className="space-y-3">
              <h2 className="font-semibold">¿Qué modalidad necesitas?</h2>
              {(
                [
                  {
                    id: "semanal" as const,
                    titulo: "Suscripción semanal",
                    detalle: "Rige de lunes 7 a viernes 11 de septiembre. Se renueva cada viernes.",
                  },
                  {
                    id: "mensual" as const,
                    titulo: "Suscripción mensual",
                    detalle: "Rige hasta el 30 de septiembre. Precio preferente para funcionarios.",
                  },
                ]
              ).map((m) => (
                <button
                  key={m.id}
                  onClick={() => setModalidad(m.id)}
                  className={cn(
                    "w-full rounded-lg border p-4 text-left transition-colors",
                    modalidad === m.id ? "border-brand bg-brand-soft" : "border-border hover:bg-secondary",
                  )}
                >
                  <p className="font-medium">{m.titulo}</p>
                  <p className="text-sm text-muted-foreground">{m.detalle}</p>
                </button>
              ))}
            </div>
          )}

          {paso === 1 && (
            <div className="space-y-5">
              <div>
                <h2 className="font-semibold">¿Qué días vas a almorzar?</h2>
                <p className="text-sm text-muted-foreground">
                  Marca solo los días que asistirás. No asumimos que comes todos los días.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {DIAS.map((d) => {
                    const activo = dias[d.id] !== null;
                    return (
                      <label
                        key={d.id}
                        className={cn(
                          "flex cursor-pointer items-center gap-2 rounded-md border px-4 py-2.5 text-sm font-medium",
                          activo ? "border-brand bg-brand text-brand-foreground" : "border-border bg-surface",
                        )}
                      >
                        <input
                          type="checkbox"
                          className="accent-current"
                          checked={activo}
                          onChange={() =>
                            setDias((prev) => ({ ...prev, [d.id]: activo ? null : "comun" }))
                          }
                        />
                        {d.nombre}
                      </label>
                    );
                  })}
                </div>
              </div>
              <div>
                <h2 className="font-semibold">¿En qué comedor?</h2>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {COMEDORES.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setComedor(c.id)}
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
            </div>
          )}

          {paso === 2 && (
            <div className="space-y-4">
              <h2 className="font-semibold">Menú por defecto para cada día</h2>
              {seleccionados.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  Vuelve al paso anterior y marca al menos un día.
                </p>
              )}
              {seleccionados.map((d) => (
                <div key={d.id} className="flex flex-wrap items-center gap-3 rounded-lg border border-border p-3">
                  <span className="w-28 font-medium">{d.nombre}</span>
                  <div className="flex flex-wrap gap-2">
                    {TIPOS.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => setDias((prev) => ({ ...prev, [d.id]: t.id }))}
                        className={cn(
                          "rounded-md border px-3 py-1.5 text-sm",
                          dias[d.id] === t.id
                            ? "border-brand bg-brand text-brand-foreground"
                            : "border-border hover:bg-secondary",
                        )}
                      >
                        {t.nombre}
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              {seleccionados.length > 0 && (
                <div className="rounded-lg bg-brand-soft p-4 text-sm text-brand">
                  <p className="font-semibold">Resumen</p>
                  <p className="mt-1">
                    Suscripción {modalidad} en {nombreComedor(comedor)}, vigente hasta el {vigencia}.
                  </p>
                  <ul className="mt-2 list-inside list-disc">
                    {seleccionados.map((d) => (
                      <li key={d.id}>
                        {nombreDia(d.id)}: {nombreTipo(dias[d.id] as TipoMenu)}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-2 text-xs">
                    Podrás liberar días puntuales hasta las {HORA_CORTE} hrs del día anterior.
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="mt-6 flex justify-between">
            <Button variant="ghost" disabled={paso === 0} onClick={() => setPaso((p) => p - 1)}>
              <ChevronLeft className="mr-1 h-4 w-4" /> Atrás
            </Button>
            {paso < 2 ? (
              <Button
                onClick={() => setPaso((p) => p + 1)}
                disabled={paso === 1 && seleccionados.length === 0}
              >
                Continuar <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={guardar} disabled={seleccionados.length === 0}>
                Guardar suscripción
              </Button>
            )}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
