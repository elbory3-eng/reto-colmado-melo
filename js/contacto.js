/* ==========================================================
   contacto.js — mapa (API de OpenStreetMap con Leaflet)
   y formulario de contacto que se envía por WhatsApp
   ========================================================== */

(() => {
  /* ---------- Mapa ---------- */
  const contenedorMapa = document.getElementById("mapa");

  if (window.L && contenedorMapa) {
    const mapa = L.map(contenedorMapa, { scrollWheelZoom: false }).setView(NEGOCIO.coordenadas, 17);

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(mapa);

    // Marcador con el logo del colmado
    const icono = L.divIcon({
      className: "",
      html: '<div style="width:44px;height:44px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);background:#ff2e88;border:3px solid #1a1033;display:grid;place-items:center;box-shadow:3px 3px 0 #1a1033"><span style="transform:rotate(45deg);color:#fff;font:700 14px Space Mono,monospace">M1</span></div>',
      iconSize: [44, 44],
      iconAnchor: [6, 44],
      popupAnchor: [16, -40]
    });

    L.marker(NEGOCIO.coordenadas, { icon: icono, alt: "Colmado Melo 1" })
      .addTo(mapa)
      .bindPopup("<strong>Colmado Melo 1</strong><br>Biblioteca Nacional esq. Centro Olímpico<br>Abierto 6:00 a.m. – 11:00 p.m.")
      .openPopup();

    // Recalcula el tamaño cuando terminan de cargar fuentes e imágenes
    window.addEventListener("load", () => mapa.invalidateSize());
  } else if (contenedorMapa) {
    // Si el mapa no carga (sin internet), se muestra la dirección
    contenedorMapa.innerHTML = '<p style="padding:20px">No se pudo cargar el mapa. Estamos en la calle Biblioteca Nacional esquina Centro Olímpico, El Millón.</p>';
  }

  /* ---------- Formulario de contacto ---------- */
  const form = document.getElementById("form-contacto");
  const campos = {
    nombre: { el: document.getElementById("nombre"), error: document.getElementById("error-nombre"), mensaje: "Escribe tu nombre (mínimo 2 letras)." },
    mensaje: { el: document.getElementById("mensaje"), error: document.getElementById("error-mensaje"), mensaje: "Cuéntanos un poco más (mínimo 10 caracteres)." }
  };

  function validar(campo) {
    const valido = campo.el.value.trim().length >= Number(campo.el.getAttribute("minlength"));
    campo.el.setAttribute("aria-invalid", String(!valido));
    campo.error.textContent = valido ? "" : campo.mensaje;
    return valido;
  }

  Object.values(campos).forEach((campo) =>
    campo.el.addEventListener("blur", () => validar(campo))
  );

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const resultados = Object.values(campos).map(validar);
    if (resultados.includes(false)) {
      Object.values(campos).find((c) => c.el.getAttribute("aria-invalid") === "true").el.focus();
      return;
    }

    const texto = [
      `Hola, Colmado Melo 1. Soy ${campos.nombre.el.value.trim()}.`,
      `Motivo: ${document.getElementById("motivo").value}`,
      campos.mensaje.el.value.trim(),
      "(Mensaje enviado desde la página web)"
    ].join("\n");

    window.open(`${NEGOCIO.whatsapp}?text=${encodeURIComponent(texto)}`, "_blank", "noopener");
    form.reset();
  });
})();
