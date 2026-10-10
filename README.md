# Reto: Hackeando el Futuro de una Pyme — Colmado Melo 1 (Reiniciado)

**Estudiante:** Jose Peña · **Matrícula:** DE0659 · **Asignatura:** Programación 3, UASD

## La historia

Una noche, el Colmado Melo 1 (calle Biblioteca Nacional esquina Centro Olímpico, El Millón) desapareció de internet: página, redes y ficha del mapa. Solo quedó un USB con un mensaje:

> "Tu negocio ha sido borrado de la existencia digital. Si quieres recuperarlo, deberás reinventarlo."

Este sitio es esa reinvención. Mensaje de la resurrección: **"Nos borraron de internet. Volvimos."**

## Páginas

| Página | Contenido |
|---|---|
| `index.html` — Historia del misterio | Pantalla de error 404 inicial, mensaje del USB, línea de tiempo del incidente, funciones nuevas, galería del local |
| `servicios.html` — Servicios reinventados | Servicios, catálogo con filtros y **cotizador en línea**, verificador anti-estafas |
| `contacto.html` — Contacto y pruebas del incidente | Formulario validado que se envía por WhatsApp, **mapa** (OpenStreetMap), expediente con las pruebas del incidente |

## Cómo se cumple cada requisito

**HTML**
- Estructura semántica: `header`, `nav`, `main`, `section`, `article`, `aside`, `figure`, `blockquote`, `time`, `footer`, enlace para saltar al contenido y textos alternativos en las imágenes.
- Tres páginas: historia del misterio, servicios reinventados y contacto con pruebas del incidente.

**CSS** (`css/estilos.css`)
- Identidad visual propia: magenta "rótulo de colmado", cian y amarillo plátano, bordes gruesos con sombra desplazada y tipografías Space Grotesk y Space Mono.
- Efectos glitch en los títulos, líneas de escaneo, barrido sobre las fotos, marquesina, parpadeo de señal y aparición al hacer scroll.
- Responsive, con menú móvil, y respeta `prefers-reduced-motion`.

**JavaScript**
- **Pantalla de error inicial** que se recupera con un clic en "Restaurar sistema" (`js/main.js`). Se puede repetir desde el pie de página.
- **Easter egg** con tres formas de activarlo: el código Konami (↑ ↑ ↓ ↓ ← → ← → B A), escribir `melo` en la página o tocar el logo cinco veces. La pista está en la Prueba D del expediente.
- **Chatbot "Melo-Bot"** (`js/chatbot.js`): responde horario (con estado abierto/cerrado en hora de Santo Domingo), precios por producto, ubicación, delivery, la historia y estafas. También cambia el tema y reconoce el código secreto `TIGUERE-404`.

**Extras**
- **API de mapas:** Leaflet + OpenStreetMap con la ubicación real de la esquina (`js/contacto.js`).
- **Cotización en línea:** catálogo con total en vivo, guardado en el navegador y enviado por WhatsApp (`js/servicios.js`).
- **Modo oscuro ("modo apagón"):** botón 🌙/☀️ que recuerda la preferencia del usuario.

**"Más resistente a futuros ataques"**
- Funciona sin conexión gracias a un service worker (`sw.js`) y un manifiesto instalable (`manifest.webmanifest`).
- Verificador anti-estafas que distingue el número y el enlace oficiales.
- Un solo canal oficial, y el código vive en un repositorio con historial para restaurarlo si lo borran.

## Cómo verlo

Abre `index.html` en el navegador. Para probar el modo sin conexión hace falta servirlo por HTTP, por ejemplo:

```bash
python -m http.server 8000
```

y luego abrir `http://localhost:8000`.

> Los precios del catálogo son de referencia, con fines académicos.
