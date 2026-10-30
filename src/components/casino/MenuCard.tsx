import { cn } from "@/lib/utils";
import { ETIQUETA_ESTADO, estadoDe, nombreTipo, type Estado, type Plato } from "@/lib/casino-data";

const estilos: Record<Estado, { punto: string; chip: string; barra: string; borde: string }> = {
  disponible: {
    punto: "bg-success",
    chip: "bg-success-soft text-success",
    barra: "bg-success",
    borde: "border-border",
  },
  "por-agotar": {
    punto: "bg-warning",
    chip: "bg-warning-soft text-warning-foreground",
    barra: "bg-warning",
    borde: "border-warning/60",
  },
  agotado: {
    punto: "bg-danger",
    chip: "bg-danger-soft text-danger",
    barra: "bg-danger",
    borde: "border-danger/50",
  },
};

export function EstadoChip({ estado, className }: { estado: Estado; className?: string }) {
  const s = estilos[estado];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
        s.chip,
        className,
      )}
    >
      <span className={cn("h-2 w-2 rounded-full", s.punto)} />
      {ETIQUETA_ESTADO[estado]}
    </span>
  );
}

export function MenuCard({
  plato,
  comprometido,
  compacto,
}: {
  plato: Plato;
  comprometido?: string | undefined;
  compacto?: boolean | undefined;
}) {
  const estado = estadoDe(plato);
  const s = estilos[estado];
  const restantes = Math.max(0, plato.producidas - plato.canjeadas);
  const pct = Math.round((restantes / plato.producidas) * 100);

  return (
    <article
      className={cn(
        "flex flex-col gap-3 rounded-lg border bg-surface p-4 shadow-sm",
        s.borde,
        estado === "agotado" && "opacity-90",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            {nombreTipo(plato.tipo)}
          </p>
          {!compacto && <p className="mt-1 font-medium text-foreground">{plato.nombre}</p>}
        </div>
        <EstadoChip estado={estado} />
      </div>

      <div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
          <div className={cn("h-full rounded-full transition-all", s.barra)} style={{ width: `${pct}%` }} />
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{restantes}</span> de {plato.producidas} raciones
          disponibles · {plato.canjeadas} canjeadas
        </p>
      </div>

      {comprometido && (
        <p className="rounded-md bg-brand-soft px-2.5 py-1.5 text-xs font-medium text-brand">
          {comprometido}
        </p>
      )}
    </article>
  );
}
