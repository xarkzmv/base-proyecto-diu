import { COMEDORES, keyDe, type DiaId, type Plato } from "./casino-data";

export type CategoriaMenu = "sopa" | "ensalada" | "fondo-a" | "fondo-b" | "postres" | "vegetariano" | "hipocalorico";
export const CATEGORIAS_MENU: { id: CategoriaMenu; nombre: string }[] = [
  { id: "sopa", nombre: "Sopa" },
  { id: "ensalada", nombre: "Ensalada" },
  { id: "fondo-a", nombre: "Fondo A" },
  { id: "fondo-b", nombre: "Fondo B" },
  { id: "postres", nombre: "Postres" },
  { id: "vegetariano", nombre: "Vegetariano" },
  { id: "hipocalorico", nombre: "Hipocalórico" },
];

type Receta = { nombre: string; alergenos: string[] };
export type PlatoDiario = Receta & {
  id: string;
  categoria: CategoriaMenu;
  disponibilidad: { ubicacion: string; plato: Plato }[];
};

const receta = (nombre: string, ...alergenos: string[]): Receta => ({ nombre, alergenos });
// Minuta ficticia: los alérgenos son ilustrativos, no una certificación de cocina.
const COMPLEMENTOS: Record<DiaId, { sopa: Receta; ensalada: Receta; fondoB: Receta; postres: Receta[] }> = {
  lun: { sopa: receta("Crema de zapallo", "Leche"), ensalada: receta("Ensalada de tomate y pepino"), fondoB: receta("Tallarines con salsa boloñesa", "Trigo (gluten)", "Huevo"), postres: [receta("Arroz con leche", "Leche"), receta("Manzana")] },
  mar: { sopa: receta("Sopa de verduras"), ensalada: receta("Ensalada de repollo y zanahoria"), fondoB: receta("Pollo al horno con arroz"), postres: [receta("Flan de vainilla", "Leche", "Huevo"), receta("Naranja")] },
  mie: { sopa: receta("Sopa de fideos", "Trigo (gluten)", "Huevo"), ensalada: receta("Ensalada de lechuga y palta"), fondoB: receta("Merluza al horno con papas", "Pescado"), postres: [receta("Yogur natural", "Leche"), receta("Pera")] },
  jue: { sopa: receta("Crema de champiñones", "Leche"), ensalada: receta("Ensalada de betarraga"), fondoB: receta("Carne al jugo con puré", "Leche"), postres: [receta("Sémola con leche", "Trigo (gluten)", "Leche"), receta("Mandarina")] },
  vie: { sopa: receta("Sopa de lentejas"), ensalada: receta("Ensalada de hojas verdes"), fondoB: receta("Pastel de papas", "Leche", "Huevo"), postres: [receta("Compota de manzana"), receta("Plátano")] },
};
const ALERGENOS_FONDOS: Record<DiaId, { comun: string[]; vegetariano: string[]; hipocalorico: string[] }> = {
  lun: { comun: [], vegetariano: [], hipocalorico: [] },
  mar: { comun: ["Leche", "Huevo"], vegetariano: ["Trigo (gluten)", "Leche", "Huevo"], hipocalorico: ["Pescado"] },
  mie: { comun: ["Huevo"], vegetariano: [], hipocalorico: [] },
  jue: { comun: ["Trigo (gluten)"], vegetariano: ["Huevo"], hipocalorico: ["Pescado"] },
  vie: { comun: ["Pescado", "Trigo (gluten)", "Leche"], vegetariano: ["Leche"], hipocalorico: [] },
};
const STOCK_FONDO_B: Record<DiaId, [number, number]> = {
  lun: [34, 76], mar: [50, 10], mie: [100, 90], jue: [20, 35], vie: [140, 70],
};

export function menuDelDia(dia: DiaId, platos: Plato[]): PlatoDiario[] {
  const extras = COMPLEMENTOS[dia];
  const simple = (categoria: CategoriaMenu, r: Receta, indice = 0): PlatoDiario => ({
    ...r, id: `${dia}-${categoria}-${indice}`, categoria, disponibilidad: [],
  });
  const fondo = (categoria: CategoriaMenu, tipo: "comun" | "vegetariano" | "hipocalorico"): PlatoDiario => {
    const disponibles = COMEDORES.flatMap((c) => {
      const plato = platos.find((p) => p.key === keyDe(dia, c.id, tipo));
      return plato ? [{ ubicacion: c.id === "edificio-p" ? "Casino P" : "Patio central", plato }] : [];
    });
    return { id: `${dia}-${categoria}`, categoria, nombre: disponibles[0]?.plato.nombre ?? "Menú no publicado", alergenos: ALERGENOS_FONDOS[dia][tipo], disponibilidad: disponibles };
  };
  const fondoB: PlatoDiario = {
    ...simple("fondo-b", extras.fondoB),
    disponibilidad: COMEDORES.map((c, i) => ({
      ubicacion: c.id === "edificio-p" ? "Casino P" : "Patio central",
      plato: { key: `${dia}|${c.id}|fondo-b`, dia, comedor: c.id, tipo: "comun", nombre: extras.fondoB.nombre,
        producidas: i === 0 ? 140 : 90, canjeadas: STOCK_FONDO_B[dia][i] ?? 0 },
    })),
  };
  return [simple("sopa", extras.sopa), simple("ensalada", extras.ensalada), fondo("fondo-a", "comun"), fondoB,
    ...extras.postres.map((r, i) => simple("postres", r, i)), fondo("vegetariano", "vegetariano"), fondo("hipocalorico", "hipocalorico")];
}