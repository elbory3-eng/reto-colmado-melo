/* ==========================================================
   main.js — funciones comunes a las tres páginas
   - Modo oscuro / claro
   - Menú móvil
   - Pantalla de error inicial que se "recupera" con un clic
   - Animación de aparición al hacer scroll
   - Easter egg (secreto oculto)
   - Funcionamiento sin conexión (service worker)
   ========================================================== */

const Melo = (() => {
  const raiz = document.documentElement;
  const menosMovimiento = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Utilidades de almacenamiento seguras ---------- */
  const guardar = (clave, valor, sesion = false) => {
    try { (sesion ? sessionStorage : localStorage).setItem(clave, valor); } catch (e) { /* modo privado */ }
  };
  const leer = (clave, sesion = false) => {
    try { return (sesion ? sessionStorage : localStorage).getItem(clave); } catch (e) { return null; }
  };

  /* ---------- 1. Modo oscuro ("modo apagón") ---------- */
  const botonTema = document.getElementById("boton-tema");

  function pintarBotonTema() {
    const oscuro = raiz.dataset.tema === "oscuro";
    botonTema.textContent = oscuro ? "☀️" : "🌙";
    botonTema.setAttribute("aria-pressed", String(oscuro));
    botonTema.setAttribute("aria-label", oscuro ? "Activar modo claro" : "Activar modo oscuro");
  }

  function alternarTema(forzar) {
    const nuevo = forzar || (raiz.dataset.tema === "oscuro" ? "claro" : "oscuro");
    raiz.dataset.tema = nuevo;
    guardar("melo-tema", nuevo);
    pintarBotonTema();
    return nuevo;
  }

  if (botonTema) {
    pintarBotonTema();
    botonTema.addEventListener("click", () => alternarTema());
  }

  /* ---------- 2. Menú móvil ---------- */
  const botonMenu = document.getElementById("boton-menu");
  const menu = document.getElementById("menu");
  if (botonMenu && menu) {
    botonMenu.addEventListener("click", () => {
      const abierto = menu.classList.toggle("abierto");
      botonMenu.setAttribute("aria-expanded", String(abierto));
      botonMenu.textContent = abierto ? "✕" : "☰";
      botonMenu.setAttribute("aria-label", abierto ? "Cerrar menú" : "Abrir menú");
    });
  }

  /* ---------- 3. Pantalla de error inicial ---------- */
  const pantalla = document.getElementById("pantalla-error");

  function mostrarIncidente() {
    if (!pantalla) {
      // En servicios/contacto el enlace lleva a la portada para ver el incidente
      location.href = "index.html?incidente";
      return;
    }
    pantalla.hidden = false;
    pantalla.classList.remove("fuera", "recuperando");
    document.body.style.overflow = "hidden";
    const boton = document.getElementById("boton-restaurar");
    boton.disabled = false;
    boton.textContent = "⚡ Restaurar sistema";
    document.getElementById("barra-progreso").style.width = "0";
    boton.focus();
  }

  function restaurar() {
    const boton = document.getElementById("boton-restaurar");
    const consola = document.getElementById("consola");
    const barra = document.getElementById("barra-progreso");
    const pasos = [
      "&gt; localizando respaldo escondido...",
      "&gt; reconstruyendo identidad visual...",
      "&gt; reinstalando catálogo y cotizador...",
      "&gt; despertando a Melo-Bot...",
      '&gt; <span style="color:#3ef0a0">SISTEMA RESTAURADO ✔</span>'
    ];
    const pausa = menosMovimiento ? 60 : 480;

    boton.disabled = true;
    boton.textContent = "Restaurando...";
    pantalla.classList.add("recuperando");

    pasos.forEach((texto, i) => {
      setTimeout(() => {
        const linea = document.createElement("p");
        linea.innerHTML = texto;
        consola.appendChild(linea);
        barra.style.width = ((i + 1) / pasos.length) * 100 + "%";
      }, pausa * (i + 1));
    });

    setTimeout(() => {
      pantalla.classList.add("fuera");
      guardar("melo-restaurado", "si", true);
      setTimeout(() => {
        pantalla.hidden = true;
        document.body.style.overflow = "";
        // Deja la consola como al principio por si se repite
        consola.innerHTML = consola.innerHTML.split("</p>").slice(0, 3).join("</p>") + "</p>";
        document.getElementById("titulo-portada")?.setAttribute("tabindex", "-1");
        document.getElementById("titulo-portada")?.focus({ preventScroll: true });
      }, menosMovimiento ? 50 : 800);
    }, pausa * (pasos.length + 1.5));
  }

  if (pantalla) {
    document.getElementById("boton-restaurar").addEventListener("click", restaurar);
    const pidioIncidente = new URLSearchParams(location.search).has("incidente");
    if (pidioIncidente || leer("melo-restaurado", true) !== "si") mostrarIncidente();
  }

  document.querySelectorAll("[data-repetir-incidente]").forEach((b) =>
    b.addEventListener("click", mostrarIncidente)
  );

  /* ---------- 4. Aparición al hacer scroll ---------- */
  const revelables = document.querySelectorAll(".revelar");
  if ("IntersectionObserver" in window && !menosMovimiento) {
    const observador = new IntersectionObserver((entradas) => {
      entradas.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          observador.unobserve(e.target);
        }
      });
    }, { threshold: 0.15 });
    revelables.forEach((el) => observador.observe(el));
  } else {
    revelables.forEach((el) => el.classList.add("visible"));
  }

  /* ---------- 5. Easter egg ---------- */
  function abrirSecreto() {
    if (document.querySelector(".secreto")) return;
    const capa = document.createElement("div");
    capa.className = "secreto";
    capa.setAttribute("role", "dialog");
    capa.setAttribute("aria-modal", "true");
    capa.setAttribute("aria-labelledby", "titulo-secreto");
    capa.innerHTML = `
      <div class="lluvia" aria-hidden="true"></div>
      <div class="caja">
        <p style="color:#22e4ff;margin:0 0 6px">&gt; ARCHIVO_OCULTO.txt desbloqueado</p>
        <h2 id="titulo-secreto">🔓 Sabemos quién fue</h2>
        <p>El USB no lo dejó un hacker. Lo dejó <strong>El Apagón</strong>, el villano de todo dominicano.
        Se llevó la página, las redes y el mapa... pero no contó con que la planta del colmado nunca se apaga.</p>
        <p>Como premio por encontrar esto, eres oficialmente <strong>cliente fiel nivel tíguere</strong>.
        Dile a Melo-Bot el código <strong style="color:#ffd23f">TIGUERE-404</strong>.</p>
        <button class="boton" type="button" id="cerrar-secreto">Cerrar el archivo</button>
      </div>`;
    document.body.appendChild(capa);

    // Lluvia de cosas del colmado
    if (!menosMovimiento) {
      const lluvia = capa.querySelector(".lluvia");
      const cosas = ["🍌", "🥑", "🧃", "💾", "🥖", "🧀", "💧", "🛵"];
      for (let i = 0; i < 40; i++) {
        const s = document.createElement("span");
        s.textContent = cosas[i % cosas.length];
        s.style.left = Math.random() * 100 + "vw";
        s.style.animationDuration = 2.5 + Math.random() * 3 + "s";
        s.style.animationDelay = Math.random() * 2 + "s";
        lluvia.appendChild(s);
      }
    }

    const cerrar = () => { capa.remove(); document.removeEventListener("keydown", conEscape); };
    const conEscape = (e) => { if (e.key === "Escape") cerrar(); };
    document.addEventListener("keydown", conEscape);
    capa.querySelector("#cerrar-secreto").addEventListener("click", cerrar);
    capa.querySelector("#cerrar-secreto").focus();
    guardar("melo-secreto", "si");
  }

  // a) Código Konami: ↑ ↑ ↓ ↓ ← → ← → B A
  const konami = ["arrowup", "arrowup", "arrowdown", "arrowdown", "arrowleft", "arrowright", "arrowleft", "arrowright", "b", "a"];
  let posicion = 0;
  // b) Escribir la palabra "melo" fuera de un campo de texto
  let tecleado = "";

  document.addEventListener("keydown", (e) => {
    const enCampo = /input|textarea|select/i.test(e.target.tagName);
    const tecla = e.key.toLowerCase();

    posicion = tecla === konami[posicion] ? posicion + 1 : (tecla === konami[0] ? 1 : 0);
    if (posicion === konami.length) { posicion = 0; abrirSecreto(); }

    if (!enCampo && tecla.length === 1) {
      tecleado = (tecleado + tecla).slice(-4);
      if (tecleado === "melo") abrirSecreto();
    }
  });

  // c) Tocar el logo cinco veces seguidas (pensado para celulares)
  const logo = document.getElementById("logo");
  if (logo) {
    let toques = 0;
    let temporizador;
    logo.addEventListener("click", (e) => {
      e.preventDefault();
      toques++;
      clearTimeout(temporizador);
      if (toques >= 5) {
        toques = 0;
        abrirSecreto();
        return;
      }
      temporizador = setTimeout(() => {
        // Si no completó los cinco toques, el logo funciona como un enlace normal
        const destino = logo.getAttribute("href");
        const paginaActual = location.pathname.split("/").pop() || "index.html";
        if (paginaActual !== destino) location.href = destino;
        toques = 0;
      }, 700);
    });
  }

  /* ---------- 6. ¿Está abierto ahora? (hora de Santo Domingo) ---------- */
  function estaAbierto(fecha = new Date()) {
    const hora = Number(new Intl.DateTimeFormat("es-DO", { hour: "numeric", hour12: false, timeZone: "America/Santo_Domingo" }).format(fecha));
    return hora >= 6 && hora < 23;
  }

  const estado = document.getElementById("estado-abierto");
  if (estado) {
    const abierto = estaAbierto();
    estado.textContent = abierto ? "abierto ahora" : "cerrado ahora";
    estado.style.color = abierto ? "var(--ok)" : "var(--mag)";
  }

  /* ---------- 7. Funcionamiento sin conexión ---------- */
  if ("serviceWorker" in navigator && /^https?:$/.test(location.protocol)) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("sw.js").catch(() => { /* sin soporte: no pasa nada */ });
    });
  }

  // Funciones que usa el chatbot
  return { alternarTema, abrirSecreto, estaAbierto, leer, guardar };
})();
