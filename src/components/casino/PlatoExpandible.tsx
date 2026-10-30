import { MapPin, ShieldAlert } from "lucide-react";
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { EstadoChip } from "./MenuCard";
import { estadoDe } from "@/lib/casino-data";
import type { PlatoDiario } from "@/lib/menu-diario";

export function PlatoExpandible({ plato, compromiso }: { plato: PlatoDiario; compromiso?: string | undefined }) {
  return (
    <AccordionItem value={plato.id} className="overflow-hidden rounded-lg border bg-surface shadow-sm">
      <AccordionTrigger className="gap-4 px-4 py-4 text-base hover:bg-secondary/50 hover:no-underline">
        <span className="min-w-0">
          <span className="block font-medium text-foreground">{plato.nombre}</span>
          {compromiso && <span className="mt-1 block text-xs font-medium text-brand">{compromiso}</span>}
        </span>
      </AccordionTrigger>
      <AccordionContent className="px-4 pb-4">
        <div className="border-t border-border pt-3">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground"><ShieldAlert className="h-4 w-4 text-muted-foreground" />Alérgenos</h3>
          {plato.alergenos.length ? (
            <ul className="mt-2 flex flex-wrap gap-2">
              {plato.alergenos.map((a) => <li key={a} className="rounded-md bg-warning-soft px-2.5 py-1 text-xs font-medium text-warning-foreground">{a}</li>)}
            </ul>
          ) : <p className="mt-2 text-sm text-muted-foreground">Sin alérgenos declarados.</p>}
          <p className="mt-2 text-xs text-muted-foreground">Información simulada. Confirma los ingredientes y la posible contaminación cruzada con cocina.</p>
        </div>
        {plato.disponibilidad.length > 0 && (
          <div className="mt-4 border-t border-border pt-3">
            <h3 className="mb-2 text-sm font-semibold text-foreground">Disponibilidad por ubicación</h3>
            <ul className="divide-y divide-border">
              {plato.disponibilidad.map(({ ubicacion, plato: stock }) => (
                <li key={stock.key} className="flex flex-wrap items-center justify-between gap-2 py-3">
                  <div>
                    <p className="flex items-center gap-1.5 font-medium"><MapPin className="h-3.5 w-3.5 text-muted-foreground" />{ubicacion}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{Math.max(0, stock.producidas - stock.canjeadas)} de {stock.producidas} raciones disponibles</p>
                  </div>
                  <EstadoChip estado={estadoDe(stock)} />
                </li>
              ))}
            </ul>
          </div>
        )}
      </AccordionContent>
    </AccordionItem>
  );
}