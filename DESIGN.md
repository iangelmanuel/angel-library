---
name: Angel Library
description: Un muro de esmalte: campos de color sobre negro para una biblioteca técnica personal en español.
colors:
  lienzo-negro: "#000000"
  blanco-letra: "#ffffff"
  azul-hielo: "#fcffff"
  azul-titulo: "#c4dafa"
  azul-vivo: "#84b6f4"
  azul-medio: "#699fe0"
  azul-hondo: "#4d82bc"
  azul-esmalte-pleno: "#005187"
  esmalte-950: "#030a11"
  esmalte-900: "#05121d"
  esmalte-800: "#071b2b"
  esmalte-700: "#0a2438"
  esmalte-600: "#0d2e46"
  gris-prosa: "#d4d4d8"
  gris-apagado: "#a1a1aa"
  gris-legible: "#8e8e99"
  gris-cromo: "#27272a"
  gris-tecla: "#18181b"
  hilo: "color-mix(in srgb, #84b6f4 16%, transparent)"
  hilo-fuerte: "color-mix(in srgb, #84b6f4 34%, transparent)"
  hilo-claro: "color-mix(in srgb, #a9cbf8 58%, transparent)"
  texto-lectura: "#ededf0"
  codigo-fondo: "color-mix(in oklab, #005187 20%, #000000)"
  codigo-rotulo: "color-mix(in oklab, #005187 32%, #000000)"
  destructivo: "#ffb3ba"
typography:
  display:
    fontFamily: "Geist Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.6rem, 5.4vw, 4.875rem)"
    fontWeight: 600
    lineHeight: 1.02
    letterSpacing: "-0.045em"
  headline:
    fontFamily: "Geist Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.85rem"
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Geist Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.4rem"
    fontWeight: 600
    lineHeight: 1.35
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Geist Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.02rem"
    fontWeight: 400
    lineHeight: 1.75
    letterSpacing: "normal"
  body-ui:
    fontFamily: "Geist Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.85rem"
    fontWeight: 400
    lineHeight: 1.65
    letterSpacing: "normal"
  label:
    fontFamily: "Geist Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.7rem"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "0.11em"
  mono:
    fontFamily: "Geist Mono, ui-monospace, SF Mono, Menlo, monospace"
    fontSize: "0.72rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
    fontFeature: "tabular-nums"
rounded:
  thin: "2px"
  md: "4px"
  field: "6px"
spacing:
  xs: "0.25rem"
  sm: "0.5rem"
  md: "0.85rem"
  lg: "1rem"
  xl: "1.5rem"
  section: "6rem"
components:
  card-field:
    backgroundColor: "{colors.lienzo-negro}"
    textColor: "{colors.blanco-letra}"
    rounded: "{rounded.field}"
    padding: "1rem"
  card-field-hover:
    backgroundColor: "{colors.lienzo-negro}"
    textColor: "{colors.blanco-letra}"
  tesela-categoria:
    backgroundColor: "{colors.lienzo-negro}"
    textColor: "{colors.blanco-letra}"
    rounded: "{rounded.field}"
    padding: "0.75rem 0.9rem"
  badge:
    backgroundColor: "{colors.esmalte-800}"
    textColor: "{colors.gris-prosa}"
    rounded: "{rounded.thin}"
    padding: "0.25rem 0.55rem"
    typography: "{typography.mono}"
  badge-hover:
    backgroundColor: "{colors.esmalte-600}"
    textColor: "{colors.blanco-letra}"
  tag:
    backgroundColor: "transparent"
    textColor: "{colors.azul-vivo}"
    rounded: "0"
    padding: "0"
  tag-tile:
    backgroundColor: "{colors.esmalte-900}"
    textColor: "{colors.azul-titulo}"
    rounded: "{rounded.md}"
    padding: "0.6rem 0.7rem"
  nav-link:
    backgroundColor: "transparent"
    textColor: "{colors.gris-apagado}"
    rounded: "{rounded.thin}"
    padding: "0.28rem 0.45rem"
  nav-link-active:
    backgroundColor: "{colors.lienzo-negro}"
    textColor: "{colors.blanco-letra}"
  button-cta:
    backgroundColor: "{colors.azul-esmalte-pleno}"
    textColor: "{colors.blanco-letra}"
    rounded: "{rounded.field}"
    padding: "0 1.25rem"
    height: "3rem"
  field-index:
    backgroundColor: "{colors.lienzo-negro}"
    textColor: "{colors.gris-apagado}"
    rounded: "{rounded.field}"
    padding: "0 0.875rem 0 1.125rem"
    height: "3.875rem"
  chrome-search:
    backgroundColor: "{colors.lienzo-negro}"
    textColor: "{colors.gris-legible}"
    rounded: "{rounded.field}"
    padding: "0.4rem 0.5rem 0.4rem 0.75rem"
  input-filter:
    backgroundColor: "{colors.esmalte-800}"
    textColor: "{colors.blanco-letra}"
    rounded: "{rounded.md}"
    padding: "0 0.85rem"
    height: "2.75rem"
  code-block:
    backgroundColor: "{colors.codigo-fondo}"
    textColor: "{colors.texto-lectura}"
    rounded: "{rounded.field}"
    padding: "0.95rem 1.1rem 1.05rem"
  code-block-header:
    backgroundColor: "{colors.codigo-rotulo}"
    textColor: "{colors.azul-titulo}"
    rounded: "0"
    padding: "0.4rem 0.5rem 0.4rem 1.1rem"
  kbd:
    backgroundColor: "{colors.gris-tecla}"
    textColor: "{colors.gris-prosa}"
    rounded: "{rounded.thin}"
    padding: "0.15rem 0.4rem"
---

# Design System: Angel Library

## Overview

**Creative North Star: "El Esmalte"**

Azulejo / cloisonné. La biblioteca es un muro de esmalte: campos de color sobre un lienzo negro, y el hilo fino solo separa — nunca lleva el color por sí solo. El lector reconoce la sección por su campo de color antes de leer una palabra, y encuentra la entrada sin perder densidad. El negro no es «tema oscuro»: es el barro bajo el vidriado, el material contra el que cada azul se quema.

El sitio tiene dos registros. En las superficies de trabajo —barra lateral de tres niveles, listados, resultados del índice— la densidad es alta y deliberada: campos contiguos separados por 2–8px y nada que respire por decoración. La portada es el otro registro: ahí manda la luz —un halo azul tras el titular y otro en el horizonte del cierre— y las secciones se separan con un hilo y 6rem de aire, porque quien llega a la portada todavía no sabe qué busca.

La paleta es monocroma por convicción: veintitrés esmaltes de categoría, todos de la misma familia azul, separados por tono **y** por luz para que dos campos vecinos nunca se confundan. El vidriado es bajo a propósito (20% en reposo, 30% encendido): con veintitrés colores en pantalla, la saturación es el enemigo. Los grises no son parte del esmalte — son el contrapeso: prosa secundaria, scrollbars y separadores neutros, jamás un relleno de campo.

Anti-referencia confirmada, sustituida por completo: el sitio anterior era negro con bordes grises de 1px, cero relleno, titulares en Geist Pixel, sombras duras desplazadas (`4px 4px 0`), scanlines de CRT y glifos de shell (`❯ $ ~/ _`). Nada de eso sobrevive. Tampoco entran degradados, glow de color, cristal ni sombra difusa coloreada.

**Key Characteristics:**

- Campos rellenos sobre negro puro; el color rellena, la línea solo separa.
- **Ninguna tarjeta lleva canto.** Ni en reposo ni al encenderse: el estado sube el vidriado y nada más. El hilo de 1px queda para separar, no para cercar.
- Un único hilo, azul a baja alfa, nunca gris.
- Jerarquía por celdas y luminosidad, no por tamaño de letra ni por bordes apilados.
- Monocromía azul con veintitrés esmaltes de categoría dentro de la misma familia, todos rebajados contra el negro.
- Medida de lectura fija en 68ch; los márgenes ceden, la medida no.
- Cantos finos (2/4/6px) en la UI; 10px solo en la ventana flotante de la terminal. Nunca cero, nunca píldora.

## Colors

Una sola familia azul quemada contra el negro, con grises neutros como contrapeso de prosa y cromo.

### Primary

- **Esmalte pleno** (`--primary` / `--blue-800`): el relleno saturado de la marca. Aparece en el botón del índice de la portada, en el pie de la ruta ilustrada de la landing, en el filtro seleccionado (`[aria-pressed="true"]`) y en la pestaña activa de gestor de paquetes. Es el único azul que se usa como fondo pleno de una acción.
- **Azul vivo** (`--blue-400`): el azul de trabajo. Anillo de foco, caret, barra de progreso de lectura, hilo del TOC activo, enlaces de prosa, acento por defecto de cualquier campo (`--card-accent`).
- **Azul de título** (`--blue-200`) y **azul medio** (`--blue-500`): los otros dos escalones de la rampa de títulos y de los estados hover del texto azul.

### Secondary

- **Esmaltes de superficie** (`--enamel-950` → `--enamel-600`): azules quemados hacia el negro. No son «fondos de tarjeta»: son rellenos que definen profundidad por luminosidad. `--enamel-950` es el campo más hondo (panel del índice, consola de tags), `--enamel-800` el chrome de UI (badges, código inline, barra de filtro, botón de copiar), `--enamel-600` el escalón encendido en hover.
- **Esmaltes de categoría** (23 tokens `--cat-*`, de `#7fd4ff` a `#4f7fd0`): el **origen** del relleno de cada campo. Son valores vivos a propósito porque se mezclan contra negro antes de pintarse. Tres de ellos salen del anillo azul estricto y se quedan así por decisión del autor.
- **Acentos de tipo de contenido** (11 tokens `--accent-*`): apuntan a la misma escala azul; solo tiñen badges e iconos de tipo, nunca títulos.

### Neutral

- **Blanco de letra** (`#ffffff`): todo texto principal — títulos de card, etiquetas de tesela, fila activa, `<strong>` de prosa.
- **Gris de prosa** (`--gray-300`): texto de segundo nivel dentro de un campo (barra de ruta de la card, cita, etiqueta de bloque de código).
- **Gris apagado** (`--gray-400` / `--muted-foreground`): descripciones, contadores, metadatos. No compite con los azules.
- **Gris legible** (`--gray-450`, `#8e8e99`): el gris más apagado del sistema — micro-rótulos, fechas, notas al pie de una sección, pie de la terminal. Da **5.9:1** sobre negro, por encima del 4.5:1 que pide la AA para texto pequeño; ningún texto baja de aquí.
- **Gris cromo** (`--gray-800`, hover `#3f3f46`): scrollbars y separadores neutros del cromo del navegador.
- **Texto de lectura** (`--reading-text`, `#ededf0`): el cuerpo del markdown, un blanco levemente rebajado para tramos largos.

### Named Rules

**The Enamel Fill Rule.** Un campo se rellena mezclando su acento contra el negro **en oklab**: `background: color-mix(in oklab, var(--card-accent) var(--glaze), #000000)`, y al encenderse sube a `var(--glaze-lit)` — **20% → 30%**. El espacio de mezcla no es opcional: en sRGB la misma fórmula da pizarra gris y la croma se pierde. Todo campo nuevo se pinta así.

**The Low-Glaze Rule.** El vidriado se mide por lo que se ve junto, no por una pieza aislada. Una rejilla de veintitrés categorías, un listado de tarjetas o un cierre de relaciones bajan del valor por defecto: 18% en las teselas de `/categories`, 16% en las tarjetas de relación (26% encendidas). Si una pantalla se ve «colorida», el número a bajar es el vidriado, nunca el color.

**The Thread Rule.** El sistema tiene una sola línea: el hilo (`--thread`, `--thread-strong`, `--thread-bright`), un azul claro a baja alfa. Un separador nunca es gris salvo en el cromo del navegador. El hilo separa; jamás sustituye al relleno como portador del color.

**The Grey-Never-Fills Rule.** Ningún gris entra a un campo. Los grises viven en prosa secundaria, scrollbars y separadores neutros. Un fondo gris es siempre un error de material.

**The No-Border Rule.** Ninguna tarjeta, tesela, bloque de código o panel dibuja un canto: solo el fondo. Los bordes que quedan son separadores estructurales —cabeceras pegajosas, hilo de la barra lateral, `hr`, la raya que abre cada sección de la portada— y los anillos de foco. Si una pieza necesita destacar, sube su vidriado.

## Typography

**Display Font:** Geist Sans (con `ui-sans-serif`, `system-ui`, `sans-serif`)
**Body Font:** Geist Sans — la misma familia; `--font-display` y `--font-sans` apuntan al mismo stack.
**Label/Mono Font:** Geist Mono (con `ui-monospace`, `SF Mono`, `Menlo`) — solo código, rutas y datos medidos.

**Character:** Una sola voz geométrica y neutra, apretada en los títulos (`letter-spacing: -0.018em` global, `-0.02em` en markdown, `-0.035em` en el wordmark) y suelta en los micro-rótulos (`0.11em` en mayúsculas). El mono no decora: aparece únicamente donde el dato es una ruta, una cifra o un comando.

### Hierarchy

- **Display** (600, `clamp(2.6rem, 5.4vw, 4.875rem)`, line-height 1.02, `-0.045em`): el titular de la portada, partido en dos líneas. Es el único texto de ese tamaño en todo el sitio.
- **Section** (600, `clamp(1.8rem, 3.2vw, 2.5rem)`, `-0.03em`): los títulos de sección de la portada, en azul de título. Van solos: sin rótulo, sin numeración, sin antetítulo.
- **Headline** (700, 1.85rem, `text-wrap: balance`): `h1` del markdown, en azul de título.
- **Title** (600, 1.4rem / 1.1rem / 0.9rem): `h2` / `h3` / `h4` del markdown, bajando por la rampa de azul (`--heading-secondary` → `--heading-tertiary` → gris de prosa en `h4`).
- **Body** (400, 1.02rem, line-height 1.75): prosa de entrada, limitada a `--reading-measure` (68ch).
- **Body UI** (400, 0.85rem, line-height 1.65): descripciones de card y de listado.
- **Label** (600, 0.7rem, `letter-spacing: 0.11em`, mayúsculas): `.section-label`, cabecera de relaciones, meta de resultados del índice.
- **Mono** (400, 0.66–0.82rem, `tabular-nums`): rutas de entrada, contadores, fechas, bloques de código.

### Named Rules

**The Two-Sizes Rule.** La jerarquía dentro de un listado la hace el tamaño del campo, no el de la letra: dos tamaños de texto (≈1rem para el título de la pieza, ≈0.85rem para su descripción) sostienen casi toda la UI. Si una pantalla necesita un tercer tamaño para dejarse leer, el problema es la cuadrícula.

**The Tabular Rule.** Toda cifra tabulada — `table`, `time`, `[data-numeric]`, contadores, fechas — va en `tabular-nums`. Las columnas de números no bailan.

**The Blue-Headings Rule.** Los títulos de prosa bajan por una única rampa azul; los títulos dentro de un campo esmaltado son blancos. Un título nunca toma el color de su categoría: ese color ya está en el relleno y en el icono.

## Layout

Contenedor máximo de 1440px para el armazón documental (sidebar + contenido + TOC) y de 78rem (`max-width: 78rem`) para las secciones de la portada. La cabecera es baja: 3.5rem en el layout de docs, 4.25rem en la portada, siempre pegajosa y cerrada por un hilo.

El layout de lectura es de tres columnas: barra lateral de 18rem (`w-72`, `sticky top-14`, alto `calc(100svh - 3.5rem)`, borde derecho de hilo) visible desde `lg`; el artículo centrado a `max-w-3xl` con la prosa recortada a 68ch; el TOC en el `aside` derecho. Padding del contenido: 1rem → 1.5rem (`sm`) → 2.5rem (`lg`).

La portada tiene su propio armazón: hero a `calc(100svh - 4.25rem)` —el buscador y las cifras caben enteros sobre el pliegue— y, debajo, secciones de dos columnas (`23.75rem` de título + resto de contenido) desde `lg`, cada una abierta por un hilo de 1px al ancho del contenido.

Cuadrículas observadas:

- **Muro de categorías** (`/categories`): 6 columnas, `gap: 4px`. Las teselas ocupan 3 / 2 / 1 columnas según el volumen de la categoría. Bajo 768px: 2 columnas, y la tesela grande ocupa las dos.
- **Índice de la portada**: `repeat(auto-fill, minmax(12.5rem, 1fr))`, `gap: 0.5rem` — las veintitrés categorías más la salida al listado completo.
- **Tipos de la portada** y **relaciones de una entrada**: `repeat(auto-fill, minmax(15rem, 1fr))` y `minmax(17rem, 1fr)`, ambos con `gap: 0.5rem`.
- **Rejilla de tags**: `repeat(auto-fill, minmax(10rem, 1fr))`, `gap: 0.5rem`.
- **Listas de renglones** (recientes de la portada, resultados del índice): columna de filas separadas por un hilo tenue, no tarjetas sueltas.

Ritmo: 0.25 / 0.5 / 0.85 / 1 / 1.5rem dentro de las piezas; **6rem** arriba y abajo en cada sección de la portada; 4.5rem antes del cierre de relaciones de una entrada. Breakpoints reales: 639px (móvil), 767px, 1023px, 1024px (`lg`, aparece la barra lateral y la portada pasa a dos columnas).

**The Fixed Measure Rule.** La medida de lectura es 68ch y no se negocia. En pantallas angostas se recortan los márgenes y el padding del campo (`.entry-head` baja de 1.6rem a 1.1rem), nunca la medida.

**The Recency-On-Top Rule.** Lo último editado va arriba, nunca en un pie: «Lo último» comparte el hero con el titular, a su derecha, y el índice de categorías viene después.

**The One-Rule-Per-Section Rule.** Cada sección de la portada se abre con un hilo al ancho del contenido y su título. Ese hilo es toda la separación que hay: ni cajas, ni fondos alternos, ni antetítulos numerados, ni ilustraciones de relleno.

**The Cell-Hierarchy Rule.** El peso de un elemento se dice en cuántas celdas ocupa. Una categoría con mucho contenido abarca 3 columnas y 5.5rem de alto; una pequeña, 2 columnas y 3.6rem. El tipo de letra apenas cambia (0.9rem → 1rem).

## Elevation & Depth

Este sistema es plano y la profundidad la hace la **luminosidad sobre un único negro**. Tres niveles de luz (`--surface`, `--surface-raised`, `--surface-active` = enamel 900 / 800 / 700) y el propio porcentaje del vidriado (34% en reposo, 50% encendido) construyen todo el relieve. No hay bordes apilados, no hay cristal, no hay glow.

Las sombras se usan poco y solo donde algo flota de verdad: el buscador del hero, el botón blanco del cierre y la ventana de la terminal. Todas son desplazamiento + desenfoque suave sobre negro; el único color admitido es un azul muy abierto y sin contorno bajo la ventana flotante.

### Shadow Vocabulary

- **Campo** (`--shadow-field`: `0 1px 2px rgb(0 0 0 / 0.6), 0 12px 32px -18px rgb(0 0 0 / 0.9)`): un campo que se despega apenas.
- **Elevado** (`--shadow-lifted`: `0 2px 4px rgb(0 0 0 / 0.5), 0 24px 56px -28px rgb(0 0 0 / 0.95)`): lo que flota sobre el muro.
- **Ventana** (terminal de búsqueda): `inset 0 1px 0` de blanco al 8% como reflejo del canto superior, más `0 2px 6px`, `0 42px 90px -32px` en negro y `0 0 120px -60px` del esmalte pleno. Sin anillo: la ventana se sostiene por sombra, no por borde.
- **Buscador del hero**: `--shadow-field` con una segunda capa azul (`0 24px 56px -28px` del esmalte pleno al 90%) que lo separa del halo del fondo.

### Named Rules

**The Material-State Rule.** El estado se dice con materia, no con tono: al encender, el campo sube de vidriado (`--glaze` → `--glaze-lit`) y esa subida es el estado. Nada de cantos que aparecen, nada de cambiar solo la opacidad.

**The No-Colored-Halo Rule.** Jamás un halo de color ni un bloque sin desenfoque. Si una pieza necesita destacar, sube su vidriado o gana su hilo; no gana una sombra.

## Shapes

Cantos finos y consistentes: 2px (`--radius-thin`) para piezas pequeñas — badges, teclas, código inline, enlaces de nav, viñetas de lista; 4px (`--radius`) para piezas medias — teselas, callouts, citas, barra de filtro, botón de copiar; 6px (`--radius-field`) para campos completos — cards, cabecera de entrada, bloque de código, panel del índice. Nunca 0, nunca píldora — la única excepción son los pulgares de scrollbar y el punto de categoría de la lista de recientes (`999px`), que son cromo y no forma.

Cuando algo sí necesita un canto de 1px —el anillo de foco, el reflejo superior de la ventana de la terminal— se pinta con `box-shadow: inset 0 0 0 1px` y no con `border`, para que caiga dentro de la pieza y no altere su caja. `border` de 1px se reserva para separadores reales: cabeceras pegajosas, `nav-children`, `hr`, la raya que abre cada sección de la portada y las filas de una lista rayada.

Las viñetas de lista del markdown son cuadraditos de 0.34rem con radio de 2px, no círculos: el mismo canto del sistema, en miniatura.

## Components

### Card de contenido (rellena, sin borde)

Es la pieza matriz. Campo de esmalte lleno, sin canto — el relleno ya la separa del lienzo.

- **Forma:** canto de campo (6px), `overflow: hidden`, `isolation: isolate`.
- **Color:** `color-mix(in oklab, var(--card-accent) var(--glaze), #000000)`, donde `--card-accent` lo inyecta el markup con el token de tipo de contenido o de categoría.
- **Estructura:** barra de ruta arriba (mono 0.68rem, gris de prosa, fondo `color-mix(… 12%, transparent)`), cuerpo con badge de tipo, título blanco 1rem/600, descripción gris 0.85rem a tres líneas, y los tags al fondo (máximo 3 + contador `+N`).
- **Hover/focus:** sube a `--glaze-lit` en 140ms `--ease-enamel`. Nada más: sin canto.
- **Padding:** 1rem; alto mínimo 12.5rem en la variante de entrada.

### Tesela de categoría (rellena, sin canto)

La misma materia que la card, con el vidriado más bajo del sistema: en `/categories` hay veintitrés colores a la vez y cualquier valor más alto satura.

- **Fondo:** `color-mix(in oklab, var(--card-accent) 18%, #000000)`, radio de campo (6px). Ningún borde en ningún estado.
- **Contenido:** icono suelto en el color de la categoría, etiqueta blanca, contador en mono **gris** a la derecha — el color ya está dicho dos veces, no hace falta una tercera.
- **Hover:** sube a 30%.
- **Peso:** `--lg` (3 columnas, 5.5rem), `--md` (2 columnas, 4.5rem), base (2 columnas, 3.6rem).

### Tarjetas de relación (rejilla, esmalte rebajado)

Cierre de entrada: la misma tarjeta de un listado, pero un paso más apagada — es el pie de la lectura, no su contenido.

- **Rejilla:** `repeat(auto-fill, minmax(17rem, 1fr))`, `gap: 0.5rem`.
- **Fondo:** `color-mix(in oklab, var(--card-accent) 16%, #000000)`; 26% al pasar. Sin canto.
- **Barra de ruta:** el mismo tinte, al 12%.
- Precedida por el rótulo de la relación (`Seguir leyendo`, `Recetas que lo usan`…) en 0.95rem/600, azul de relación.

### Badges y tags

- **Badge de tipo:** campo esmaltado tenue (`--enamel-800`), radio 2px, 0.68rem/500, texto gris de prosa. Hover: `--enamel-600` y letra blanca.
- **Badge de categoría:** `color-mix(in srgb, var(--card-accent) 16%, var(--enamel-900))` con la letra en el color de la categoría; el color va en CSS y no inline, porque un estilo inline gana siempre sobre `:hover`.
- **Tag suelto:** solo texto azul (`--reading-link`) con un `#` al 55% de opacidad; sin campo propio. Hover: blanco.
- **Tag tesela** (en `/tags`): ahí sí es un campo pulsable — fondo `--enamel-900`, radio 4px, letra azul de título, contador en mono empujado a la derecha.

### Barra lateral (tres niveles)

Categoría → subcategoría → entrada. La jerarquía la dan el tamaño y la luz, nunca la sangría ni un filete de color.

- **Categoría:** 0.83rem/500, blanca, icono en el color de la categoría, chevron que rota 90° al abrir.
- **Subcategoría:** 0.75rem/400, gris de prosa; blanca al abrirse.
- **Entrada:** 0.78rem, gris apagado, hasta tres líneas (`-webkit-line-clamp: 3`) — truncar escondía lo que distingue cada entrada.
- **Hover:** un vidriado mínimo, `color-mix(in srgb, var(--cat-accent) 10–12%, transparent)`.
- **Activa:** campo pleno del color de su categoría, `color-mix(in oklab, var(--cat-accent) var(--glaze-lit), #000000)`, letra blanca, peso 500.
- **Anidamiento:** un hilo cae bajo el icono del padre, `border-left: 1px solid color-mix(in srgb, var(--cat-accent) 20%, transparent)`.

### Campos de entrada

- **Barra de filtro:** fondo `--enamel-800`, radio 4px, alto 2.75rem, sin borde. `:focus-within` pinta `inset 0 0 0 1px var(--blue-400)`; el contador de resultados vive dentro, en mono.
- **Toggle de filtro:** fondo `--enamel-800`, radio 2px. Seleccionado (`[aria-pressed="true"]`) se esmalta pleno con `--primary` y peso 600 — el estado es materia, no matiz.
- **Foco global:** `outline: 2px solid var(--ring)` con `outline-offset: 2px` y radio 2px.
- **Vacío:** un campo apenas vidriado (`--enamel-950`), sin canto, con el mensaje centrado en gris apagado.
- **Buscador del cromo** (`.chrome-search`, cabecera de portada y de docs, y menú móvil): `color-mix(in oklab, var(--blue-800) 10%, #000000)`, 20% al pasar, con la tecla `ctrl K` en azul al 10%. Vive junto al logo: no debe pesar más que él.

### Bloque de código

Dos alturas del mismo azul, nunca dos colores.

- **Cuerpo:** `--code-bg` = `color-mix(in oklab, var(--blue-800) 20%, #000000)`. Se lee azul, pero rebajado: no compite con la prosa que lo rodea. Sin canto.
- **Rótulo:** `--code-chrome` = el mismo azul al 32% — un solo escalón por encima del cuerpo. Nombre de archivo en mono 0.72rem azul de título, alineado a la sangría del código (1.1rem), y el botón de copiar como pastilla de blanco al 7% (16% al pasar).
- **Pestañas pnpm/Bun/npm:** viven en ese rótulo, en mono; la activa se rellena con blanco al 12%, no con el esmalte pleno.
- **Cuerpo tipográfico:** Shiki `tokyo-night`, mono 0.82rem, line-height 1.7, padding `0.95rem 1.1rem 1.05rem`.
- **Realce de líneas:** `color-mix(in srgb, var(--blue-400) 12%)`; diff añadido 16%; diff eliminado por opacidad 0.42.
- **Código inline** en prosa: el mismo `--code-chrome`, radio 2px.

### Índice (Ctrl/Cmd + K) — componente insignia

Una terminal **moderna**, no un emulador de CRT: sin scanlines, sin pixel art, sin cursor parpadeante. Es una ventana de verdad, con la materia de un emulador actual.

- **Ventana:** `top: 10vh`, ancho `min(92vw, 58rem)`, radio **10px** —la única excepción a los cantos de 2/4/6— y la sombra de ventana descrita arriba. Sin anillo.
- **Centrado:** el `translate: -50% 0` va en su propia propiedad, no en `transform`, para que la animación de entrada pueda mover la ventana en vertical sin perder el centro. Entra **desde arriba** (`slide-in-from-top`), nunca de lado.
- **Barra de título:** tres puntos apagados en azul (30 / 22 / 14%, dibujados con una sola pieza y su sombra), el nombre de la sesión y el modo como pastilla redonda.
- **Alto de sesión:** la pantalla mide `min(64vh, 32rem)` con suelo de `20rem` — la ventana no se encoge con el contenido; el texto crece hacia abajo, como en una terminal abierta.
- **Tipografía:** monoespaciada en todo, títulos de resultado incluidos.
- **Renglón de entrada:** un campo propio dentro de la ventana (radio 8px, azul al 8%, 14% al enfocar) con el `›` en color de acento.
- **Resultado:** rejilla `1rem / 1fr / auto`, radio 4px. Seleccionado u hover: `color-mix(in srgb, var(--result-accent) 22%, var(--field-panel))` y letra blanca — campo lleno, sin filete lateral.
- **Cinco paletas** (`data-terminal-theme`): `angel` (negro pleno), `esmalte` (el azul del sitio), `tinta` (negro y un solo azul vivo), `niebla` (grises neutros, el azul solo marca lo activo), `hielo` (el extremo claro sobre azul muy hondo). Las cinco viven dentro del mundo: negro, escala azul, grises.

### Hero de la portada

- **Buscador:** el único objeto grande del hero. `color-mix(in oklab, var(--blue-800) 16%, #000000)` (28% al pasar), radio de campo, alto 3.875rem, sin borde, con la sombra azul que lo separa del halo.
- **CTA:** botón de esmalte pleno (`--primary`) con «Leer la documentación», alto 3rem; al encender pasa a `color-mix(in srgb, var(--blue-700) 82%, var(--blue-500))`.
- **Acción secundaria:** enlace azul medio con flecha, sin campo.
- **Fondo:** solo el halo. Ninguna retícula, ningún cuadro, ninguna ilustración.
- **Sin antetítulo:** el hero abre directamente con el titular. Ni rótulo en mayúsculas ni numeración.

### Movimiento

Una sola curva (`--ease-enamel`: `cubic-bezier(0.16, 1, 0.3, 1)`) y dos duraciones: 140ms para estado (`--dur-fast`) y 320ms para lo que se despega (`--dur-slow`). Las view transitions duran 140ms. `prefers-reduced-motion` reduce todo a 0.01ms.

## Do's and Don'ts

### Do:

- **Do** rellenar todo campo nuevo con `color-mix(in oklab, var(--card-accent) var(--glaze), #000000)` y encenderlo a `--glaze-lit` en hover. El espacio oklab es el material.
- **Do** bajar el vidriado cuando muchas piezas de color comparten pantalla (18% en `/categories`, 16% en las relaciones): el número a mover es el vidriado, no el color.
- **Do** decir el estado subiendo el vidriado, y solo eso.
- **Do** ordenar la jerarquía por celdas — cuántas columnas ocupa una pieza — y dejar el tamaño de letra en dos escalones.
- **Do** mantener la medida de lectura en 68ch y recortar los márgenes cuando falte espacio.
- **Do** poner el color de categoría en el relleno y en el icono, y dejar los títulos en blanco o en la rampa azul.
- **Do** separar las secciones de la portada con un hilo al ancho del contenido y 6rem de aire.
- **Do** poner lo reciente arriba, en el hero, nunca en un pie.
- **Do** usar mono solo para rutas, cifras, fechas y código, con `tabular-nums` — y en toda la terminal de búsqueda.
- **Do** dejar el bloque de código en azul rebajado con su rótulo un escalón por encima.
- **Do** mantener el texto más apagado en `--gray-450` o por encima: 4.5:1 es el suelo.

### Don't:

- **Don't** mezclar el vidriado en sRGB: da pizarra gris y mata la croma. Siempre `in oklab`.
- **Don't** rellenar un campo con gris. Los grises son prosa secundaria, scrollbars y separadores neutros.
- **Don't** ponerle canto a una tarjeta, tesela, bloque de código o panel — ni en reposo ni en hover. El relleno ya la separa del lienzo.
- **Don't** teñir de azul una scrollbar; el cromo del navegador es gris oscuro (`--gray-800` / `#3f3f46`).
- **Don't** usar degradados de relleno, glow de color, cristal ni bloques de sombra sin desenfoque. Los dos halos de la portada y el resplandor bajo la ventana de la terminal son la excepción tasada: radiales muy abiertos, sin contorno.
- **Don't** volver a los titulares en fuente de píxeles, las scanlines de CRT ni los glifos de shell (`❯ $ ~/ _`): son la anti-referencia sustituida. La terminal es moderna, no retro.
- **Don't** usar radio 0 ni radio de píldora en una superficie; los cantos son 2 / 4 / 6px, y 10px solo en la ventana flotante.
- **Don't** poner el color de un campo en un estilo inline si necesita `:hover` — un inline gana siempre sobre la regla de estado.
- **Don't** apilar bordes para simular profundidad; la profundidad es luminosidad sobre un solo negro.
- **Don't** centrar un diálogo con `transform` si va a animarse: el centrado vive en `translate`, o la animación lo empuja de lado.
- **Don't** escribir reglas de componente fuera de `@layer components`: lo no-capado gana a las utilidades de Tailwind y rompe el orden de especificidad del sitio.
