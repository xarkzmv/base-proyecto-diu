export type TipoMenu = "comun" | "vegetariano" | "hipocalorico";
export type ComedorId = "casa-central" | "edificio-p";
export type DiaId = "lun" | "mar" | "mie" | "jue" | "vie";

export const TIPOS: { id: TipoMenu; nombre: string }[] = [
  { id: "comun", nombre: "Común" },
  { id: "vegetariano", nombre: "Vegetariano" },
  { id: "hipocalorico", nombre: "Hipocalórico" },
];

export const COMEDORES: { id: ComedorId; nombre: string; ubicacion: string }[] = [
  { id: "casa-central", nombre: "Casino Casa Central", ubicacion: "patio central" },
  { id: "edificio-p", nombre: "Casino Edificio P", ubicacion: "Edificio P, Cuarto piso" },
];

export const DIAS: { id: DiaId; nombre: string; corto: string; fecha: string }[] = [
  { id: "lun", nombre: "Lunes", corto: "L", fecha: "7 de septiembre" },
  { id: "mar", nombre: "Martes", corto: "M", fecha: "8 de septiembre" },
  { id: "mie", nombre: "Miércoles", corto: "M", fecha: "9 de septiembre" },
  { id: "jue", nombre: "Jueves", corto: "J", fecha: "10 de septiembre" },
  { id: "vie", nombre: "Viernes", corto: "V", fecha: "11 de septiembre" },
];

export const HORA_CORTE = "16:00";

export type Plato = {
  key: string;
  dia: DiaId;
  comedor: ComedorId;
  tipo: TipoMenu;
  nombre: string;
  producidas: number;
  canjeadas: number;
};

export const keyDe = (dia: DiaId, comedor: ComedorId, tipo: TipoMenu) => `${dia}|${comedor}|${tipo}`;

const MINUTA: Record<DiaId, Record<TipoMenu, string>> = {
  lun: {
    comun: "Cazuela de vacuno con arroz",
    vegetariano: "Charquicán de zapallo y porotos verdes",
    hipocalorico: "Pollo al vapor con ensalada surtida",
  },
  mar: {
    comun: "Pastel de choclo con ensalada chilena",
    vegetariano: "Lasaña de berenjena y ricotta",
    hipocalorico: "Merluza al horno con quinoa",
  },
  mie: {
    comun: "Lomo a lo pobre con papas doradas",
    vegetariano: "Curry de garbanzos con arroz integral",
    hipocalorico: "Pavo grillado con verduras salteadas",
  },
  jue: {
    comun: "Porotos con riendas y longaniza",
    vegetariano: "Tortilla de acelga con ensalada de betarraga",
    hipocalorico: "Salmón al vapor con ensalada verde",
  },
  vie: {
    comun: "Pescado frito con puré rústico",
    vegetariano: "Risotto de champiñones",
    hipocalorico: "Pechuga de pollo con brócoli al vapor",
  },
};

const PRODUCCION: Record<ComedorId, Record<TipoMenu, number>> = {
  "casa-central": { comun: 220, vegetariano: 80, hipocalorico: 60 },
  "edificio-p": { comun: 150, vegetariano: 60, hipocalorico: 45 },
};

// Canjes iniciales pensados para que hoy (lunes) se vean los tres estados.
const CANJES_INICIALES: Record<string, number> = {
  "lun|casa-central|comun": 96,
  "lun|casa-central|vegetariano": 71,
  "lun|casa-central|hipocalorico": 60,
  "lun|edificio-p|comun": 61,
  "lun|edificio-p|vegetariano": 52,
  "lun|edificio-p|hipocalorico": 39,
  "mar|casa-central|hipocalorico": 44,
  "mar|edificio-p|vegetariano": 31,
  "mie|casa-central|vegetariano": 18,
  "jue|casa-central|hipocalorico": 22,
};

export function platosIniciales(): Plato[] {
  const out: Plato[] = [];
  for (const d of DIAS) {
    for (const c of COMEDORES) {
      for (const t of TIPOS) {
        const key = keyDe(d.id, c.id, t.id);
        out.push({
          key,
          dia: d.id,
          comedor: c.id,
          tipo: t.id,
          nombre: MINUTA[d.id][t.id],
          producidas: PRODUCCION[c.id][t.id],
          canjeadas: CANJES_INICIALES[key] ?? 0,
        });
      }
    }
  }
  return out;
}

export type Estado = "disponible" | "por-agotar" | "agotado";

export function estadoDe(plato: Plato): Estado {
  const restantes = plato.producidas - plato.canjeadas;
  if (restantes <= 0) return "agotado";
  if (restantes / plato.producidas <= 0.2) return "por-agotar";
  return "disponible";
}

export const ETIQUETA_ESTADO: Record<Estado, string> = {
  disponible: "Disponible",
  "por-agotar": "Por agotar",
  agotado: "Agotado",
};

export const nombreTipo = (t: TipoMenu) => TIPOS.find((x) => x.id === t)!.nombre;
export const nombreComedor = (c: ComedorId) => COMEDORES.find((x) => x.id === c)!.nombre;
export const nombreDia = (d: DiaId) => DIAS.find((x) => x.id === d)!.nombre;
export const fechaDia = (d: DiaId) => DIAS.find((x) => x.id === d)!.fecha;
