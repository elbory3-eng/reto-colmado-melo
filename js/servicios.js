/* ==========================================================
   servicios.js — catálogo con filtros, cotizador en línea
   y verificador anti-estafas
   ========================================================== */

(() => {
  const lista = document.getElementById("lista-productos");
  const filtros = document.getElementById("filtros");
  const listaCotizacion = document.getElementById("lista-cotizacion");
  const totalSalida = document.getElementById("total-cotizacion");
  const botonEnviar = document.getElementById("enviar-cotizacion");
  const botonVaciar = document.getElementById("vaciar-cotizacion");
  const entrega = document.getElementById("entrega");

  // Cantidades elegidas: { idProducto: cantidad }. Se guardan para no perderlas al recargar.
  let carrito = {};
  try { carrito = JSON.parse(Melo.leer("melo-cotizacion")) || {}; } catch (e) { carrito = {}; }

  let categoriaActiva = "Todos";

  /* ---------- Filtros por categoría ---------- */
  const categorias = ["Todos", ...new Set(PRODUCTOS.map((p) => p.categoria))];
  categorias.forEach((cat) => {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "chip";
    chip.textContent = cat;
    chip.setAttribute("aria-pressed", String(cat === categoriaActiva));
    chip.addEventListener("click", () => {
      categoriaActiva = cat;
      filtros.querySelectorAll(".chip").forEach((c) => c.setAttribute("aria-pressed", String(c.textContent === cat)));
      pintarProductos();
    });
    filtros.appendChild(chip);
  });

  /* ---------- Tarjetas de productos ---------- */
  function pintarProductos() {
    lista.innerHTML = "";
    PRODUCTOS
      .filter((p) => categoriaActiva === "Todos" || p.categoria === categoriaActiva)
      .forEach((p) => {
        const tarjeta = document.createElement("article");
        tarjeta.className = "tarjeta producto";
        tarjeta.innerHTML = `
          <div class="icono" aria-hidden="true">${p.icono}</div>
          <span class="categoria">${p.categoria}</span>
          <h3>${p.nombre}</h3>
          <div class="fila">
            <span class="precio">${formatoPeso(p.precio)}</span>
            <div class="contador" role="group" aria-label="Cantidad de ${p.nombre}">
              <button type="button" data-accion="menos" aria-label="Quitar ${p.nombre}">−</button>
              <output aria-live="polite">${carrito[p.id] || 0}</output>
              <button type="button" data-accion="mas" aria-label="Agregar ${p.nombre}">+</button>
            </div>
          </div>`;
        tarjeta.querySelectorAll("button").forEach((b) =>
          b.addEventListener("click", () => cambiarCantidad(p.id, b.dataset.accion === "mas" ? 1 : -1, tarjeta))
        );
        lista.appendChild(tarjeta);
      });
  }

  function cambiarCantidad(id, cambio, tarjeta) {
    const nueva = Math.max(0, Math.min(99, (carrito[id] || 0) + cambio));
    if (nueva === 0) delete carrito[id];
    else carrito[id] = nueva;
    if (tarjeta) tarjeta.querySelector("output").textContent = nueva;
    actualizarCotizacion();
  }

  /* ---------- Resumen de la cotización ---------- */
  function lineasCotizacion() {
    return Object.entries(carrito).map(([id, cantidad]) => {
      const p = PRODUCTOS.find((x) => x.id === id);
      return p ? { ...p, cantidad, subtotal: p.precio * cantidad } : null;
    }).filter(Boolean);
  }

  function actualizarCotizacion() {
    Melo.guardar("melo-cotizacion", JSON.stringify(carrito));
    const lineas = lineasCotizacion();
    listaCotizacion.innerHTML = "";

    if (lineas.length === 0) {
      listaCotizacion.innerHTML = '<li class="vacio">Todavía no has agregado productos.</li>';
    } else {
      lineas.forEach((l) => {
        const li = document.createElement("li");
        li.innerHTML = `<span>${l.cantidad} × ${l.nombre}</span><strong>${formatoPeso(l.subtotal)}</strong>`;
        listaCotizacion.appendChild(li);
      });
    }

    const total = lineas.reduce((suma, l) => suma + l.subtotal, 0);
    totalSalida.textContent = formatoPeso(total);
    botonEnviar.disabled = lineas.length === 0;
  }

  /* ---------- Enviar la cotización por WhatsApp ---------- */
  botonEnviar.addEventListener("click", () => {
    const lineas = lineasCotizacion();
    const total = lineas.reduce((suma, l) => suma + l.subtotal, 0);
    const texto = [
      "Hola, Colmado Melo 1. Quiero hacer este pedido:",
      ...lineas.map((l) => `• ${l.cantidad} × ${l.nombre} (${formatoPeso(l.subtotal)})`),
      `Total de referencia: ${formatoPeso(total)}`,
      `Entrega: ${entrega.value}`,
      "(Cotización hecha en la página web)"
    ].join("\n");
    window.open(`${NEGOCIO.whatsapp}?text=${encodeURIComponent(texto)}`, "_blank", "noopener");
  });

  botonVaciar.addEventListener("click", () => {
    carrito = {};
    pintarProductos();
    actualizarCotizacion();
  });

  pintarProductos();
  actualizarCotizacion();

  /* ---------- Verificador anti-estafas ---------- */
  const formVerificar = document.getElementById("form-verificar");
  const campo = document.getElementById("dato-verificar");
  const resultado = document.getElementById("resultado-verificacion");

  formVerificar.addEventListener("submit", (e) => {
    e.preventDefault();
    const dato = campo.value.trim();
    resultado.className = "";
    if (!dato) {
      resultado.textContent = "Escribe un número o un enlace para verificarlo.";
      return;
    }

    const soloDigitos = dato.replace(/\D/g, "").replace(/^1(?=\d{10}$)/, "");
    const pareceEnlace = /[a-z]\.[a-z]/i.test(dato);
    let esOficial = false;

    if (pareceEnlace) {
      // Es oficial solo si el dominio coincide con el de esta página o con el WhatsApp oficial
      try {
        const url = new URL(/^https?:\/\//i.test(dato) ? dato : "https://" + dato);
        const dominio = url.hostname.replace(/^www\./, "");
        esOficial = (location.hostname && dominio === location.hostname) ||
          (dominio === "wa.me" && url.pathname.replace(/\D/g, "").endsWith(NEGOCIO.telefono));
      } catch (err) { esOficial = false; }
    } else {
      esOficial = soloDigitos === NEGOCIO.telefono;
    }

    resultado.classList.add("resultado-verificacion", esOficial ? "ok" : "alerta");
    resultado.textContent = esOficial
      ? "✔ Es oficial. Este contacto pertenece al Colmado Melo 1."
      : "⚠ No es oficial. No envíes dinero ni datos. Repórtalo desde la página de contacto o escríbenos al 809-363-0033.";
  });
})();
