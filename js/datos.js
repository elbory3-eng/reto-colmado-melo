/* ==========================================================
   datos.js — información del negocio compartida por el
   catálogo, el cotizador y el asistente virtual.
   Precios de referencia en pesos dominicanos (RD$).
   ========================================================== */

const NEGOCIO = {
  nombre: "Colmado Melo 1",
  telefono: "8093630033",
  telefonoVisible: "809-363-0033",
  whatsapp: "https://wa.me/18093630033",
  direccion: "Calle Biblioteca Nacional esquina Centro Olímpico, sector El Millón, Santo Domingo",
  horario: "todos los días de 6:00 a.m. a 11:00 p.m.",
  coordenadas: [18.4596, -69.95386]
};

const PRODUCTOS = [
  { id: "agua", nombre: "Botellón de agua (recarga)", categoria: "Bebidas", precio: 80, icono: "💧" },
  { id: "refresco", nombre: "Refresco 2 litros", categoria: "Bebidas", precio: 120, icono: "🥤" },
  { id: "jugo-natural", nombre: "Jugo natural (vaso)", categoria: "Bebidas", precio: 75, icono: "🍹" },
  { id: "leche", nombre: "Leche entera 1 litro", categoria: "Lácteos", precio: 95, icono: "🥛" },
  { id: "jugo-caja", nombre: "Jugo de caja 1 litro", categoria: "Lácteos", precio: 110, icono: "🧃" },
  { id: "queso", nombre: "Queso de freír (libra)", categoria: "Lácteos", precio: 230, icono: "🧀" },
  { id: "arroz", nombre: "Arroz (libra)", categoria: "Víveres", precio: 45, icono: "🍚" },
  { id: "habichuelas", nombre: "Habichuelas rojas (libra)", categoria: "Víveres", precio: 95, icono: "🫘" },
  { id: "aceite", nombre: "Aceite vegetal 1 litro", categoria: "Víveres", precio: 210, icono: "🫒" },
  { id: "platano", nombre: "Plátano (unidad)", categoria: "Víveres", precio: 25, icono: "🍌" },
  { id: "huevo", nombre: "Huevo (unidad)", categoria: "Víveres", precio: 10, icono: "🥚" },
  { id: "salami", nombre: "Salami (libra)", categoria: "Embutidos", precio: 190, icono: "🥓" },
  { id: "jamon", nombre: "Jamón picado (libra)", categoria: "Embutidos", precio: 220, icono: "🍖" },
  { id: "detergente", nombre: "Detergente en polvo 500 g", categoria: "Limpieza", precio: 85, icono: "🧼" },
  { id: "cloro", nombre: "Cloro (galón)", categoria: "Limpieza", precio: 120, icono: "🧴" },
  { id: "desayuno", nombre: "Desayuno: mangú con los tres golpes", categoria: "Comida", precio: 200, icono: "🍳" },
  { id: "plato-dia", nombre: "Plato del día", categoria: "Comida", precio: 250, icono: "🍛" }
];

const formatoPeso = (n) => "RD$ " + n.toLocaleString("es-DO");
