/* ==========================================================
   sw.js — service worker: guarda la página en el teléfono
   para que funcione sin conexión ("resistente a ataques").
   ========================================================== */

const CACHE = "melo-v1";
const ARCHIVOS = [
  "./", "index.html", "servicios.html", "contacto.html",
  "css/estilos.css",
  "js/datos.js", "js/main.js", "js/servicios.js", "js/contacto.js", "js/chatbot.js",
  "img/logo.svg", "img/negocio-fachada.jpg", "img/negocio-interior.jpg",
  "manifest.webmanifest"
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ARCHIVOS)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((claves) => Promise.all(claves.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Primero intenta la red (para ver cambios); si no hay conexión, usa la copia guardada
self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== "GET" || url.origin !== location.origin) return;
  e.respondWith(
    fetch(e.request)
      .then((resp) => {
        const copia = resp.clone();
        caches.open(CACHE).then((c) => c.put(e.request, copia));
        return resp;
      })
      .catch(() => caches.match(e.request, { ignoreSearch: true }).then((r) => r || caches.match("index.html")))
  );
});
