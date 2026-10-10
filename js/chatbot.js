/* ==========================================================
   chatbot.js — Melo-Bot, asistente virtual del colmado
   Funciona con reglas: busca palabras clave en lo que
   escribe el cliente y responde con la información del negocio.
   ========================================================== */

(() => {
  /* ---------- Interfaz ---------- */
  const lanzador = document.createElement("button");
  lanzador.className = "bot-lanzador";
  lanzador.type = "button";
  lanzador.setAttribute("aria-label", "Abrir el asistente Melo-Bot");
  lanzador.setAttribute("aria-expanded", "false");
  lanzador.setAttribute("aria-controls", "melo-bot");
  lanzador.innerHTML = '🤖<span class="punto" aria-hidden="true"></span>';

  const ventana = document.createElement("section");
  ventana.className = "bot-ventana";
  ventana.id = "melo-bot";
  ventana.hidden = true;
  ventana.setAttribute("aria-label", "Asistente virtual Melo-Bot");
  ventana.innerHTML = `
    <div class="bot-cabecera">
      <span aria-hidden="true" style="font-size:1.6rem">🤖</span>
      <div><strong>Melo-Bot</strong><small>asistente del colmado · en línea</small></div>
      <button type="button" aria-label="Cerrar el asistente">✕</button>
    </div>
    <div class="bot-mensajes" role="log" aria-live="polite"></div>
    <div class="bot-sugerencias"></div>
    <form class="bot-form">
      <label for="bot-entrada" class="salto">Escribe tu pregunta</label>
      <input id="bot-entrada" type="text" placeholder="Pregúntame algo..." autocomplete="off" maxlength="200">
      <button type="submit" aria-label="Enviar">➤</button>
    </form>`;

  document.body.append(lanzador, ventana);

  const mensajes = ventana.querySelector(".bot-mensajes");
  const sugerencias = ventana.querySelector(".bot-sugerencias");
  const form = ventana.querySelector(".bot-form");
  const entrada = ventana.querySelector("#bot-entrada");
  let saludado = false;

  function abrir() {
    ventana.hidden = false;
    lanzador.setAttribute("aria-expanded", "true");
    lanzador.querySelector(".punto")?.remove();
    if (!saludado) {
      saludado = true;
      responder(saludoInicial());
    }
    entrada.focus();
  }

  function cerrar() {
    ventana.hidden = true;
    lanzador.setAttribute("aria-expanded", "false");
    lanzador.focus();
  }

  lanzador.addEventListener("click", () => (ventana.hidden ? abrir() : cerrar()));
  ventana.querySelector(".bot-cabecera button").addEventListener("click", cerrar);
  ventana.addEventListener("keydown", (e) => { if (e.key === "Escape") cerrar(); });

  /* ---------- Mensajes ---------- */
  function agregar(texto, quien) {
    const burbuja = document.createElement("div");
    burbuja.className = "msg " + quien;
    // El texto del cliente se inserta como texto plano (nunca como HTML)
    if (quien === "usuario") burbuja.textContent = texto;
    else burbuja.innerHTML = texto;
    mensajes.appendChild(burbuja);
    mensajes.scrollTop = mensajes.scrollHeight;
    return burbuja;
  }

  function responder(respuesta) {
    const escribiendo = agregar("• • •", "bot escribiendo");
    setTimeout(() => {
      escribiendo.remove();
      agregar(respuesta.texto, "bot");
      if (respuesta.accion) respuesta.accion();
      pintarSugerencias(respuesta.sugerencias || ["¿Horario?", "Precios", "¿Dónde quedan?", "¿Qué pasó?"]);
    }, 550);
  }

  function pintarSugerencias(lista) {
    sugerencias.innerHTML = "";
    lista.forEach((s) => {
      const b = document.createElement("button");
      b.type = "button";
      b.textContent = s;
      b.addEventListener("click", () => enviar(s));
      sugerencias.appendChild(b);
    });
  }

  function enviar(texto) {
    const limpio = texto.trim();
    if (!limpio) return;
    agregar(limpio, "usuario");
    responder(entender(limpio));
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    enviar(entrada.value);
    entrada.value = "";
  });

  /* ---------- "Cerebro" del bot ---------- */
  const normalizar = (t) => t.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  const contiene = (texto, palabras) => palabras.some((p) => texto.includes(p));

  // Palabras con las que el cliente puede preguntar por cada producto
  const palabrasProducto = {
    agua: ["agua", "botellon"], refresco: ["refresco", "soda", "coca"], "jugo-natural": ["jugo natural", "natural"],
    leche: ["leche"], "jugo-caja": ["jugo de caja", "jugo"], queso: ["queso"], arroz: ["arroz"],
    habichuelas: ["habichuela"], aceite: ["aceite"], platano: ["platano", "guineo"], huevo: ["huevo"],
    salami: ["salami"], jamon: ["jamon"], detergente: ["detergente", "fab"], cloro: ["cloro"],
    desayuno: ["desayuno", "mangu"], "plato-dia": ["plato del dia", "almuerzo", "plato"]
  };

  function saludoInicial() {
    const pagina = location.pathname.split("/").pop() || "index.html";
    const extra = {
      "index.html": "Estás en la historia del misterio. ¿Quieres saber qué nos pasó?",
      "servicios.html": "Estás en los servicios: puedo decirte precios o ayudarte a cotizar.",
      "contacto.html": "Estás en contacto. Puedo darte la dirección o el WhatsApp oficial."
    }[pagina] || "";
    return {
      texto: `¡Klk! Soy <strong>Melo-Bot</strong> 🤖, el asistente del Colmado Melo 1. Sobreviví al borrado para guiarte en esta nueva etapa. ${extra}`,
      sugerencias: ["¿Horario?", "Precios", "¿Dónde quedan?", "¿Qué pasó?", "Delivery"]
    };
  }

  function entender(original) {
    const t = normalizar(original);

    // Código del easter egg
    if (t.replace(/\s/g, "").includes("tiguere-404") || t.replace(/[\s-]/g, "").includes("tiguere404")) {
      return {
        texto: "🔓 Código aceptado. Bienvenido al club de <strong>clientes fieles nivel tíguere</strong>. Encontraste el archivo que ni el hacker sabía que existía. Dile a David que Melo-Bot te mandó 😉",
        sugerencias: ["¿Quién fue?", "Precios", "Gracias"]
      };
    }

    if (contiene(t, ["quien fue", "culpable", "secreto", "easter", "sorpresa", "oculto"])) {
      return {
        texto: "🤫 No puedo decirlo directamente... pero en la <a href=\"contacto.html#expediente\">prueba D del expediente</a> hay unas flechas rayadas. Y dicen que el logo esconde algo si lo tocas varias veces.",
        sugerencias: ["Ver el expediente", "¿Qué pasó?"]
      };
    }

    if (contiene(t, ["oscuro", "apagon", "modo claro", "tema", "noche"])) {
      const tema = Melo.alternarTema();
      return { texto: tema === "oscuro" ? "🌙 Listo, activé el <strong>modo apagón</strong>. Más misterioso, ¿verdad?" : "☀️ Listo, volvimos al modo día." };
    }

    // Solo saludos cortos; "hola, ¿cuánto vale el salami?" debe llegar a los precios
    if (contiene(t, ["hola", "buenas", "saludos", "klk", "que lo que", "hey"]) && t.split(/\s+/).length <= 3) {
      return { texto: "¡Saludos! ¿En qué te ayudo? Puedo darte el horario, precios, la ubicación o contarte qué nos pasó." };
    }

    if (contiene(t, ["gracias", "thank", "chevere", "nitido"])) {
      return { texto: "¡A la orden! Aquí estamos, ahora sí imposibles de borrar. 💪" };
    }

    if (contiene(t, ["que paso", "hack", "borr", "misterio", "usb", "desaparec", "ataque", "incidente", "historia"])) {
      return {
        texto: "Una noche, a las 11:47 p.m., alguien borró nuestra página, redes y ficha del mapa. Solo dejó un USB con un mensaje: <em>\"si quieres recuperarlo, deberás reinventarlo\"</em>. Y eso hicimos. Lee la <a href=\"index.html#historia\">historia completa</a> o mira las <a href=\"contacto.html#expediente\">pruebas</a>.",
        sugerencias: ["¿Quién fue?", "Ver el expediente", "¿Cómo se protegieron?"]
      };
    }

    if (contiene(t, ["ver el expediente", "expediente", "prueba", "evidencia"])) {
      return { texto: "📁 El expediente está en <a href=\"contacto.html#expediente\">Contacto y pruebas</a>: el USB, el registro del servidor, la búsqueda vacía y una pista misteriosa." };
    }

    if (contiene(t, ["estafa", "falso", "falsa", "verific", "segur", "proteg", "impostor"])) {
      return {
        texto: "🛡️ Nuestro único número es <strong>809-363-0033</strong>. Nunca pedimos pagos por adelantado a cuentas personales. Puedes comprobar cualquier contacto en el <a href=\"servicios.html#escudo\">verificador oficial</a>.",
        sugerencias: ["Verificar un contacto", "WhatsApp"]
      };
    }

    if (contiene(t, ["horario", "hora", "abren", "abre", "cierran", "cierra", "abierto"])) {
      const abierto = Melo.estaAbierto();
      return {
        texto: `🕕 Abrimos <strong>${NEGOCIO.horario}</strong> y ahora mismo estamos <strong>${abierto ? "abiertos ✅" : "cerrados 💤"}</strong>.`,
        sugerencias: ["Delivery", "Precios", "¿Dónde quedan?"]
      };
    }

    if (contiene(t, ["donde", "direccion", "ubicacion", "mapa", "llegar", "queda"])) {
      return {
        texto: `📍 ${NEGOCIO.direccion}. Mira el <a href="contacto.html#mapa">mapa</a> o pide <a href="https://www.google.com/maps/dir/?api=1&destination=${NEGOCIO.coordenadas.join(",")}" target="_blank" rel="noopener">cómo llegar</a>.`,
        sugerencias: ["¿Horario?", "Delivery"]
      };
    }

    if (contiene(t, ["delivery", "domicilio", "envio", "llevan", "mandan"])) {
      return {
        texto: "🛵 ¡Sí! Hacemos delivery en El Millón. Arma tu pedido en el <a href=\"servicios.html#catalogo\">cotizador</a>, elige \"Delivery\" y envíalo por WhatsApp. Te confirmamos el tiempo de entrega.",
        sugerencias: ["Cotizar", "WhatsApp"]
      };
    }

    // ¿Preguntó por un producto específico?
    const encontrados = PRODUCTOS.filter((p) => contiene(t, palabrasProducto[p.id] || []));
    if (encontrados.length) {
      const lista = encontrados.slice(0, 4).map((p) => `${p.icono} ${p.nombre}: <strong>${formatoPeso(p.precio)}</strong>`).join("<br>");
      return {
        texto: `${lista}<br><small>Precios de referencia; el colmado confirma el final por WhatsApp.</small>`,
        sugerencias: ["Cotizar", "Delivery", "Otro precio"]
      };
    }

    if (contiene(t, ["precio", "cuanto", "cuesta", "vale", "catalogo", "producto", "venden", "tienen", "otro precio"])) {
      return {
        texto: "Tenemos bebidas, lácteos, víveres, embutidos, limpieza y comida. Pregúntame por uno (por ejemplo: <em>\"¿cuánto vale el salami?\"</em>) o mira el <a href=\"servicios.html#catalogo\">catálogo completo</a>.",
        sugerencias: ["Salami", "Agua", "Plato del día", "Cotizar"]
      };
    }

    if (contiene(t, ["cotiz", "pedido", "pedir", "comprar", "orden"])) {
      return { texto: "🧾 Ve al <a href=\"servicios.html#catalogo\">cotizador</a>, suma productos con + y −, y envía la lista por WhatsApp con un toque." };
    }

    if (contiene(t, ["whatsapp", "telefono", "llamar", "numero", "contacto", "escribir"])) {
      return { texto: `📞 Llámanos al <a href="tel:+1${NEGOCIO.telefono}">${NEGOCIO.telefonoVisible}</a> o escríbenos por <a href="${NEGOCIO.whatsapp}" target="_blank" rel="noopener">WhatsApp</a>.` };
    }

    return {
      texto: "Hmm, esa parte de mi memoria también la borraron 😅. Prueba preguntando por el <strong>horario</strong>, un <strong>precio</strong>, la <strong>ubicación</strong> o el <strong>delivery</strong>. Si es otra cosa, escríbenos por <a href=\"" + NEGOCIO.whatsapp + "\" target=\"_blank\" rel=\"noopener\">WhatsApp</a>.",
      sugerencias: ["¿Horario?", "Precios", "¿Dónde quedan?", "WhatsApp"]
    };
  }
})();
