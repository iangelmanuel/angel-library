---
version: 1
slug: "src-styles-global-css"
primary_target: "src/styles/global.css"
related_targets: ["src/layouts/BaseLayout.astro","src/layouts/DocsLayout.astro","src/pages/index.astro","src/features/landing","src/features/terminal"]
---

Alcance: todo el sitio (tokens, docs, sidebar, listados, tags, búsqueda, landing). Modo: Read.
Intocable como función: sidebar de 3 niveles, Ctrl+K, densidad, acentos por categoría/tipo.

## Direction contract

THESIS: la biblioteca es un muro de esmalte: campos de color sobre negro. Rechaza el sitio de docs oscuro con acento único y tarjetas de borde gris.

OWN-WORLD: negro #000000 de lienzo. El color rellena campos (cards de contenido, cabecera de entrada, fila activa); el canto de color queda para las piezas de fondo negro (categorías). Letras blancas, descripciones en gris neutro, títulos y subtítulos en la escala azul; iconos en el color de su categoría. Scrollbars grises. Radios 2–6px. Sin degradados, glow, sombra difusa ni cristal.

STORY: el lector reconoce la sección por su campo de color antes de leer una palabra, y encuentra la entrada sin perder densidad.

FIRST VIEWPORT: cabecera baja; el título de la entrada dentro de su campo esmaltado, con la ruta y el tipo dentro; prosa a 68ch a la izquierda, TOC a la derecha. Ctrl+K abre una terminal moderna: panel centrado, cantos finos, entrada abajo, historial arriba (decisión del autor, 6 sept 2026, sustituye al «campo anclado» anterior).

FORM: El Esmalte (azulejo/cloisonné), candidato 7 de la lista propia; seed a4f90c3b.

RAISES: estado por materia, no por tono. Jerarquía por celdas, no por tamaño de letra. Profundidad por luminosidad, no por borde. Medida fija; se recortan márgenes. Lo reciente encima.

DECISIONES DEL AUTOR que mandan sobre cualquier crítica: los 23 esmaltes de categoría se quedan como están, aunque tres salgan del anillo azul estricto; las cards de contenido no llevan borde; los bloques de código van sobre negro puro; los apartados de cierre muestran las cards al aire, sin fondo.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
