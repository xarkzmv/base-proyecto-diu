import { Link } from "@tanstack/react-router";
import { CalendarDays, UtensilsCrossed, Clock3, User } from "lucide-react";
import type { ReactNode } from "react";
import { HORA_CORTE } from "@/lib/casino-data";
import { useCasino } from "@/lib/casino-store";

const nav = [
  { to: "/", label: "Disponibilidad" },
  { to: "/mis-compromisos", label: "Mis compromisos" },
  { to: "/suscripcion", label: "Suscripción" },
  { to: "/reservar", label: "Reserva puntual" },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const { usuario, suscripcion } = useCasino();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-brand text-brand-foreground">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-4 px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-md bg-brand-foreground/15">
              <UtensilsCrossed className="h-5 w-5" />
            </span>
            <div>
              <p className="font-[family-name:var(--font-display)] text-lg leading-tight font-semibold">
                Casino USM
              </p>
              <p className="text-xs text-brand-foreground/70">
                Gestión de almuerzos para funcionarios y docentes
              </p>
            </div>
          </div>
          <div className="ml-auto flex items-center gap-4 text-sm">
            <span className="hidden items-center gap-2 rounded-md bg-brand-foreground/10 px-3 py-1.5 sm:flex">
              <Clock3 className="h-4 w-4" />
              Corte diario {HORA_CORTE} hrs del día anterior
            </span>
            <span className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="text-left">
                <span className="block leading-tight">{usuario.nombre}</span>
                <span className="block text-xs text-brand-foreground/70">
                  {suscripcion ? `Suscrito ${suscripcion.modalidad}` : "Sin suscripción activa"}
                </span>
              </span>
            </span>
          </div>
        </div>
        <nav className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              activeOptions={{ exact: n.to === "/" }}
              className="rounded-t-md px-4 py-2.5 text-sm font-medium whitespace-nowrap text-brand-foreground/75 transition-colors hover:bg-brand-foreground/10"
              activeProps={{ className: "bg-background !text-foreground" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
      <footer className="mx-auto max-w-6xl px-6 pb-10 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <CalendarDays className="h-3.5 w-3.5" />
          Prototipo de demostración con datos simulados. Los cambios se pierden al recargar la página.
        </span>
      </footer>
    </div>
  );
}
