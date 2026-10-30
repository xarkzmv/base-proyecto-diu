import { describe, test } from "node:test";
import { deepStrictEqual, strictEqual } from "node:assert";
import { DIAS, estadoDe, platosIniciales } from "./casino-data";
import { CATEGORIAS_MENU, menuDelDia } from "./menu-diario";

describe("Menú diario", () => {
  test("cada día incluye las siete categorías solicitadas", () => {
    deepStrictEqual(CATEGORIAS_MENU.map((c) => c.id), ["sopa", "ensalada", "fondo-a", "fondo-b", "postres", "vegetariano", "hipocalorico"]);
    for (const dia of DIAS) {
      strictEqual(new Set(menuDelDia(dia.id, platosIniciales()).map((p) => p.categoria)).size, 7);
    }
  });
  test("solo los cuatro fondos tienen disponibilidad para las dos ubicaciones", () => {
    for (const p of menuDelDia("lun", platosIniciales())) {
      const esFondo = ["fondo-a", "fondo-b", "vegetariano", "hipocalorico"].includes(p.categoria);
      deepStrictEqual(p.disponibilidad.map((d) => d.ubicacion), esFondo ? ["Patio central", "Casino P"] : []);
    }
  });
  test("el estado del fondo B es independiente por ubicación y del fondo A", () => {
    const menu = menuDelDia("lun", platosIniciales());
    const b = menu.find((p) => p.categoria === "fondo-b");
    const a = menu.find((p) => p.categoria === "fondo-a");
    deepStrictEqual(b?.disponibilidad.map((d) => estadoDe(d.plato)), ["disponible", "por-agotar"]);
    deepStrictEqual(a?.disponibilidad.map((d) => estadoDe(d.plato)), ["disponible", "disponible"]);
  });
  test("un cambio en stock compartido se refleja únicamente en la ubicación afectada", () => {
    const platos = platosIniciales().map((p) => p.key === "lun|edificio-p|comun" ? { ...p, canjeadas: p.producidas } : p);
    const a = menuDelDia("lun", platos).find((p) => p.categoria === "fondo-a");
    deepStrictEqual(a?.disponibilidad.map((d) => estadoDe(d.plato)), ["disponible", "agotado"]);
  });
});