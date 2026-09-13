---
name: Angel Library
description: Tema de editor — la biblioteca técnica se ve como el editor donde se usa lo copiado, en oscuro y en claro.
colors:
  fondo: "#131318"
  panel: "#17171e"
  elevado: "#1e1e27"
  activo: "#272238"
  codigo: "#18181f"
  codigo-cromo: "#1f1f29"
  linea-suave: "#1f1f28"
  linea: "#2a2a35"
  linea-fuerte: "#3b3b49"
  texto-fuerte: "#f2f2f7"
  texto: "#cfcfdb"
  texto-apagado: "#a3a3b4"
  texto-tenue: "#858598"
  violeta-keyword: "#b49cff"
  verde-string: "#7fdcb4"
  ambar-funcion: "#f2c97d"
  coral-error: "#ff9090"
  cian-tipo: "#80d0e6"
  rosa-constante: "#f0a7d8"
  acento-fuerte: "#d6c9ff"
  acento-hover: "#c7b5ff"
  acento-contraste: "#16121f"
  fondo-claro: "#fbfbfd"
  panel-claro: "#f5f5f9"
  elevado-claro: "#ededf3"
  activo-claro: "#ece7ff"
  codigo-claro: "#f4f4f8"
  codigo-cromo-claro: "#eaeaf1"
  linea-suave-claro: "#ececf2"
  linea-claro: "#e0e0e9"
  linea-fuerte-claro: "#c9c9d6"
  texto-fuerte-claro: "#15151d"
  texto-claro: "#34343f"
  texto-apagado-claro: "#555566"
  texto-tenue-claro: "#6b6b7e"
  violeta-keyword-claro: "#5b3fd1"
  verde-string-claro: "#16714f"
  ambar-funcion-claro: "#8a5600"
  coral-error-claro: "#b8283f"
  cian-tipo-claro: "#0a6f8c"
  rosa-constante-claro: "#a3317a"
  acento-fuerte-claro: "#3d27a3"
  acento-hover-claro: "#4a30bd"
  acento-contraste-claro: "#ffffff"
typography:
  display:
    fontFamily: "Onest Variable, ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "clamp(2.25rem, 5.6vw, 4.75rem)"
    fontWeight: 680
    lineHeight: 1.02
    letterSpacing: "-0.04em"
  section:
    fontFamily: "Onest Variable, ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "clamp(1.6rem, 3vw, 2.25rem)"
    fontWeight: 650
    lineHeight: 1.12
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "Onest Variable, ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "2.5rem"
    fontWeight: 650
    lineHeight: 1.12
    letterSpacing: "-0.032em"
  title:
    fontFamily: "Onest Variable, ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "1.625rem"
    fontWeight: 650
    lineHeight: 1.2
    letterSpacing: "-0.024em"
  subtitle:
    fontFamily: "Onest Variable, ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.016em"
  body:
    fontFamily: "Onest Variable, ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.75
    letterSpacing: "normal"
    fontFeature: "ss01"
  body-ui:
    fontFamily: "Onest Variable, ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "0.84rem"
    fontWeight: 400
    lineHeight: 1.45
    letterSpacing: "normal"
  label:
    fontFamily: "Onest Variable, ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 650
    lineHeight: 1.4
    letterSpacing: "-0.005em"
  mono:
    fontFamily: "JetBrains Mono Variable, ui-monospace, SF Mono, Menlo, Consolas, monospace"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.7
    letterSpacing: "normal"
    fontFeature: "tabular-nums"
rounded:
  sm: "4px"
  md: "6px"
  lg: "8px"
  xl: "12px"
spacing:
  xs: "0.35rem"
  sm: "0.6rem"
  md: "0.85rem"
  lg: "1.1rem"
  xl: "1.5rem"
  section: "5.5rem"
components:
  button-primary:
    backgroundColor: "{colors.violeta-keyword}"
    textColor: "{colors.acento-contraste}"
    rounded: "{rounded.md}"
    padding: "0 1.1rem"
    height: "2.6rem"
  button-primary-hover:
    backgroundColor: "{colors.acento-hover}"
    textColor: "{colors.acento-contraste}"
  button-secondary:
    backgroundColor: "{colors.elevado}"
    textColor: "{colors.texto-fuerte}"
    rounded: "{rounded.md}"
    padding: "0 1.1rem"
    height: "2.6rem"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.texto}"
    rounded: "{rounded.md}"
    padding: "0 1.1rem"
    height: "2.6rem"
  button-outline-hover:
    backgroundColor: "{colors.elevado}"
    textColor: "{colors.texto-fuerte}"
  button-link:
    backgroundColor: "transparent"
    textColor: "{colors.violeta-keyword}"
    padding: "0"
  search-button:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.texto-tenue}"
    rounded: "{rounded.md}"
    padding: "0 0.35rem 0 0.7rem"
    height: "2.25rem"
    width: "15rem"
  icon-button:
    backgroundColor: "transparent"
    textColor: "{colors.texto-apagado}"
    rounded: "{rounded.md}"
    size: "2rem"
  icon-button-hover:
    backgroundColor: "{colors.elevado}"
    textColor: "{colors.texto-fuerte}"
  command-palette:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.texto-tenue}"
    rounded: "{rounded.xl}"
    padding: "0 0.7rem 0 1.05rem"
    height: "3.5rem"
    width: "34rem"
  search-modal:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.texto}"
    rounded: "{rounded.xl}"
    padding: "0.85rem"
    width: "44rem"
  kbd:
    backgroundColor: "{colors.fondo}"
    textColor: "{colors.texto-apagado}"
    rounded: "{rounded.sm}"
    padding: "0.1rem 0.4rem"
    typography: "{typography.mono}"
  sidebar-entry:
    backgroundColor: "transparent"
    textColor: "{colors.texto-apagado}"
    rounded: "{rounded.md}"
    padding: "0.26rem 0.5rem 0.26rem 0.35rem"
    typography: "{typography.body-ui}"
  sidebar-entry-hover:
    backgroundColor: "{colors.elevado}"
    textColor: "{colors.texto-fuerte}"
  sidebar-entry-active:
    backgroundColor: "{colors.activo}"
    textColor: "{colors.acento-fuerte}"
  code-block:
    backgroundColor: "{colors.codigo}"
    rounded: "{rounded.lg}"
    typography: "{typography.mono}"
  code-tab-bar:
    backgroundColor: "{colors.codigo-cromo}"
    textColor: "{colors.texto-tenue}"
    padding: "0.45rem 0.95rem"
  code-tab-active:
    backgroundColor: "{colors.codigo}"
    textColor: "{colors.texto-fuerte}"
  inline-code:
    backgroundColor: "{colors.elevado}"
    textColor: "{colors.verde-string}"
    rounded: "{rounded.sm}"
    padding: "0.08em 0.36em"
  entry-command:
    backgroundColor: "{colors.codigo}"
    textColor: "{colors.verde-string}"
    rounded: "{rounded.lg}"
    padding: "0.6rem 0.8rem"
  entry-panel:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.texto}"
    rounded: "{rounded.lg}"
    padding: "0.9rem 1.1rem"
  table-header:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.texto-apagado}"
    padding: "0.6rem 0.95rem"
  recent-panel:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.texto}"
    rounded: "{rounded.xl}"
    padding: "0.35rem"
  status-bar:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.texto-fuerte}"
    rounded: "{rounded.xl}"
    padding: "1.35rem 1.5rem"
  category-line:
    backgroundColor: "{colors.codigo}"
    textColor: "{colors.texto}"
    rounded: "{rounded.xl}"
    padding: "1.75rem 2rem"
    typography: "{typography.mono}"
---

# Design System: Angel Library

## Overview

**Creative North Star: "Tema de editor"**

La biblioteca se ve como el editor donde se usa lo que se copia. Los roles de resaltado de sintaxis son los roles de la interfaz: el violeta de keyword navega y enlaza; el verde de string marca lo literal y copiable; el ámbar, el coral, el cian y el rosa nombran estados y categorías. Quien llega reconoce su propio editor —explorador de archivos a la izquierda, pestañas sobre el código, paleta de comandos con Ctrl K, barra de estado con cifras— y entiende sin instrucciones que todo lo que ve está para copiarse.

La estructura es la de Starlight y no se toca: cabecera, menú, contenido y tabla de contenidos, como en la referencia que eligió el autor. La identidad vive en la piel: dos temas completos —carbón violáceo de noche, papel frío de día— que cambian con un solo botón, líneas de 1px que enmarcan igual que en un editor, tipografía Onest para leer y JetBrains Mono para todo lo medido. La densidad es de herramienta de trabajo: menú compacto y numerado, tablas con celdas, paneles con canto fino; la portada abre más aire (5.5rem entre secciones) pero habla el mismo idioma.

Rechazos confirmados por el autor: el azul como color de base, el negro puro, la familia Geist, un selector de tema en lugar de un botón, el fondo propio del tema de código y Dracula (ilegible en claro) y cualquier navegación con JavaScript (ClientRouter). El sistema anterior («El Esmalte»: lienzo negro con campos azules) queda descartado por completo.

**Key Characteristics:**

- Dos temas completos definidos token a token; el oscuro es el predeterminado y el claro se activa con `data-theme="light"`.
- Superficies en escalones de luz sobre un carbón violáceo, nunca negro puro; en claro, papel frío, nunca blanco puro.
- Seis roles de sintaxis como color de letra y de marca; el relleno de color solo aparece como tinte suave o en el botón primario.
- Líneas de 1px que separan y enmarcan: tablas, paneles, código, cabecera y menú.
- Onest para interfaz y prosa; JetBrains Mono para código, teclas, fechas, cifras y la numeración del menú.
- Estructura intacta de Starlight; transiciones entre páginas solo con CSS.

## Colors

Una paleta de editor: neutros violáceos en cuatro escalones de superficie y cuatro de texto, más seis roles de sintaxis que se reajustan por tema para seguir siendo letra legible.

Cada token existe dos veces: la clave sin sufijo es el tema oscuro (`:root`) y la clave `-claro` es su valor en `:root[data-theme="light"]`. Los componentes solo leen las variables (`--bg`, `--text`, `--syn-violet`…), nunca los hex.

### Primary

- **Violeta keyword** (`--syn-violet`, que es `--accent`): el único acento de navegación. Enlaces de prosa, entrada activa del menú y su número, sección actual del TOC, enlace de cabecera actual, botón primario, anillo de foco, caret, marca superior de la pestaña activa de código, icono de la paleta de comandos y título de los avisos de nota. En claro baja a un violeta hondo para mantener 6.6:1 sobre el fondo.
- **Acento fuerte / hover / contraste** (`--accent-strong`, `--accent-hover`, `--accent-contrast`): el texto de la entrada activa del menú en oscuro, el hover del botón primario y la letra sobre el violeta lleno (8:1 en oscuro, 6.8:1 en claro).

### Secondary

Los otros cinco roles de sintaxis. Son color de letra seguro en su tema (todos ≥ 5.5:1 sobre `--bg`):

- **Verde string** (`--syn-green`): lo literal y copiable — código en línea, línea de comando de la cabecera de entrada, visto de «copiado» del botón de copiar. Avisos de consejo.
- **Ámbar función** (`--syn-amber`): avisos de cuidado.
- **Coral error** (`--syn-coral`): avisos de peligro y la lista de advertencias de una entrada.
- **Cian tipo** (`--syn-cyan`) y **rosa constante** (`--syn-pink`): sin estado propio; existen para dar voz a las categorías.

### Tertiary

- **Color de categoría** (`--cat-*`, 23 tokens): cada categoría toma uno de los seis roles de sintaxis, agrupadas por afinidad (backend, terminal, testing y SEO en verde; git, seguridad y benchmarks en coral…). Se pintan como letra (palabras del índice de la portada, línea de ruta de la entrada) o como marca pequeña (el cuadradito de «Lo último»), nunca como relleno.

### Neutral

- **Fondo** (`--bg`): el lienzo de página, cabecera, menú y barra lateral de Starlight.
- **Panel** (`--bg-panel`): paneles con canto — cabecera de tabla, cita, panel de la entrada, modal de búsqueda, paneles de la portada, pie.
- **Elevado** (`--bg-raised`): hover de filas, enlaces y botones de icono; relleno del botón secundario y del código en línea.
- **Activo** (`--bg-active`): exclusivamente la entrada abierta del menú, un carbón (o lavanda en claro) teñido de violeta.
- **Código** (`--bg-code`) y **cromo de código** (`--bg-code-chrome`): cuerpo y barra de pestañas de todo bloque de código, pestañas de gestor de paquetes, comando de entrada, índice de categorías y cabecera de cada resultado de búsqueda.
- **Líneas** (`--line-soft`, `--line`, `--line-strong`): `--line` es la línea de trabajo; `--line-soft` separa subresultados de búsqueda; `--line-strong` es el canto de lo que flota (modal, paleta de comandos), el hover de un canto y el pulgar de las barras de desplazamiento.
- **Texto** (`--text-strong`, `--text`, `--text-muted`, `--text-faint`): títulos y énfasis; prosa; interfaz secundaria y menú; micro-datos (fechas, números de línea, placeholders). `--text-faint` es el suelo: 5.1:1 en oscuro, 5.0:1 en claro.
- **Tintes derivados** (`--accent-soft` 14%, `--accent-line` 45%, `--selection` 32%): mezclas en oklab del acento con `--bg` que se resuelven solas en cada tema. Halo de foco, `mark`, canto de hover de tarjetas y resultados, selección de texto.

### Named Rules

**The Syntax-Roles Rule.** Un color de sintaxis significa lo mismo en toda la interfaz: violeta navega, verde es literal, ámbar advierte, coral es peligro. Un color nuevo no se inventa; se elige el rol que ya lo dice.

**The Letter-Not-Fill Rule.** Los roles de sintaxis se usan como letra, marca o canto. El único relleno pleno de color es el botón primario violeta; todo lo demás es un tinte mezclado con `--bg` en oklab (7% en avisos, 8% en advertencias, 14% en `--accent-soft`).

**The Two-Themes Rule.** Todo token de color se define en los dos temas. Un componente que escribe un hex, o que solo se comprueba en oscuro, está roto.

**The No-Pure-Black Rule.** El fondo más hondo es `#131318` en oscuro y `#fbfbfd` en claro. Ni `#000` ni `#fff` como superficie.

## Typography

**Display Font:** Onest Variable (con `ui-sans-serif`, `system-ui`, `-apple-system`, `Segoe UI`)
**Body Font:** Onest Variable — la misma familia, con `font-feature-settings: "ss01"` en la documentación.
**Label/Mono Font:** JetBrains Mono Variable (con `ui-monospace`, `SF Mono`, `Menlo`, `Consolas`)

**Character:** Onest es una sans humanista y cálida, apretada en los titulares (hasta `-0.04em`) y neutra en la prosa; JetBrains Mono es la letra del propio editor y aparece solo donde el dato es código o medida. Los pesos intermedios de la fuente variable (450, 550, 620, 650, 680) afinan la jerarquía sin saltos bruscos.

### Hierarchy

- **Display** (680, `clamp(2.25rem, 5.6vw, 4.75rem)`, 1.02): el titular de la portada, en dos líneas; la segunda en violeta. El cierre de la portada usa la misma voz algo menor (`clamp(2.1rem, 4.4vw, 3.5rem)`).
- **Section** (650, `clamp(1.6rem, 3vw, 2.25rem)`, 1.12): títulos de sección de la portada.
- **Headline** (650, 2.5rem desde 50em, 1.12): el `h1` de cada entrada.
- **Title** (650, 1.625rem) y **Subtitle** (600, 1.25rem): `h2` y `h3` de la prosa, siempre en `--text-strong` con `text-wrap: balance`; `h4` a 1.0625rem.
- **Body** (400, 1rem, 1.75): prosa de entrada, medida de 47rem de columna (`--sl-content-width`).
- **Body UI** (400–500, 0.84rem): menú, TOC, facts, resultados de búsqueda, buscador de cabecera.
- **Label** (650, 0.8125rem): rótulos de bloque del menú, título del TOC, cabecera de tabla (600), rótulos de las cifras (550).
- **Mono** (400, 0.875rem en bloques de código; 0.68–0.8rem en datos): código, teclas, fechas, contadores, numeración del menú y cifras de la barra de estado (500, `clamp(1.6rem, 3vw, 2.25rem)`), siempre con `tabular-nums` cuando son números.

### Named Rules

**The Measured-Data Rule.** El mono es para lo que se copia o se mide: código, comandos, teclas, fechas, cifras y números de línea. Nunca para títulos ni prosa.

**The Upright-Code Rule.** El código se lee recto. Night Owl y Night Owl Light traen comentarios y keywords en cursiva; el CSS la anula (`font-style: normal`) y ningún bloque la recupera.

**The Tabular Rule.** Tablas, `time`, `[data-numeric]`, fechas y numeración van en `tabular-nums`.

## Layout

La estructura es la de Starlight: cabecera fija de 3.75rem, menú a la izquierda de 19rem, columna de contenido de 47rem y TOC a la derecha. A partir de 87.5rem el conjunto se centra: menú y TOC toman el mismo margen que la cabecera (`--shell-gutter`) para que los tres bordes coincidan, y el TOC se limita a 17.5rem. Cabecera, menú y TOC se separan del contenido con una línea de 1px. Por debajo de 50rem desaparece la navegación de cabecera, el buscador ocupa el ancho libre y las redes pasan al menú móvil.

La portada usa un contenedor de 78rem con 1.5rem de margen lateral (1rem bajo 640px). El hero ocupa `calc(100svh - 3.75rem)`: titular, paleta de comandos y acciones a la izquierda; desde 1024px, el panel «Lo último» en una columna de 27rem a la derecha, y debajo la barra de estado de tres cifras. Las secciones siguientes se abren con una línea superior y 5.5rem de aire, en dos columnas (22rem de título + contenido) desde 1024px.

Ritmo observado: 0.35 / 0.6 / 0.85 / 1.1 / 1.5rem dentro de las piezas; 2.6rem antes de un título de prosa y 0.75rem después; 5.5rem entre secciones de portada. Puntos de corte reales: 640px, 767px (modal de búsqueda a pantalla casi completa), 50rem (Starlight y cabecera), 1024px y 87.5rem.

### Named Rules

**The Starlight-Skeleton Rule.** No se añade ni se quita estructura a la documentación: cabecera, menú, contenido y TOC son los de Starlight. El sistema cambia la piel, no el armazón.

**The Full-Column Table Rule.** Una tabla ocupa todo el ancho de la columna en escritorio (`display: table; width: 100%`), con celdas separadas por líneas y cabecera en `--bg-panel`. Solo bajo 50rem vuelve a ser un bloque desplazable.

**The Learning-Order Rule.** Las entradas del menú se numeran como líneas de código (`01`, `02`…) con un contador CSS que sigue `sidebar.order`, el orden de aprendizaje de la subcategoría. El número es orden de lectura, no decoración.

## Elevation & Depth

El sistema es plano y la profundidad la hacen los escalones de superficie (`--bg` → `--bg-panel` → `--bg-raised` → `--bg-active`) y las líneas de 1px. Las tarjetas y la paginación de Starlight tienen `box-shadow: none`; su hover cambia el canto a `--accent-line`. Las sombras quedan para lo que flota de verdad o para el objeto principal de la portada, y cada tema tiene las suyas: negras y densas en oscuro, violáceas y muy tenues en claro.

### Shadow Vocabulary

- **Pequeña** (`--shadow-sm`, oscuro `0 1px 2px rgb(0 0 0 / 0.35)`): mapeada a `--sl-shadow-sm` para piezas de Starlight.
- **Media** (`--shadow-md`, oscuro `0 1px 2px rgb(0 0 0 / 0.4), 0 14px 32px -14px rgb(0 0 0 / 0.65)`): la paleta de comandos y el panel «Lo último» del hero.
- **Grande** (`--shadow-lg`, oscuro `0 2px 6px rgb(0 0 0 / 0.45), 0 32px 72px -24px rgb(0 0 0 / 0.75)`): el modal de búsqueda, sobre `--backdrop`.
- **Halo de foco** (`0 0 0 3px var(--accent-soft)`): el campo del buscador enfocado y la paleta de comandos en hover. No es elevación: es estado.

### Named Rules

**The Line-First Rule.** Una pieza se separa del fondo con una línea de 1px y un escalón de superficie. La sombra no sustituye a la línea: solo se suma cuando el objeto flota sobre la página.

## Shapes

Cuatro radios: 4px (`--radius-sm`) para piezas pequeñas — código en línea, teclas, badges, anillo de foco de la portada; 6px (`--radius`) para controles — botones, buscador, botones de icono, filas del menú, pestañas del botón de copiar; 8px (`--radius-lg`) para paneles de la documentación — bloques de código, tablas, avisos, citas, panel de entrada, tarjetas, paginación, imágenes, resultados de búsqueda; 12px (`--radius-xl`) para los objetos grandes — modal de búsqueda y paneles de la portada (paleta, «Lo último», cifras, índice, recorrido).

La forma es de ventana de editor: rectángulos de esquina suave con canto de 1px y, cuando hay cromo, una barra superior en `--bg-code-chrome` separada por una línea. Las teclas ganan un borde inferior de 2px en la prosa. La pestaña activa se marca con `box-shadow: inset 0 2px 0 var(--accent)`, una raya violeta arriba. Los círculos solo aparecen en cromo (pulgar de scrollbar, punto del rótulo «Lo último»).

## Components

### Buttons

Cuatro variantes y ninguna más, compartidas por portada y documentación.

- **Shape:** esquinas de control (6px), canto de 1px (transparente en el primario), peso 550, icono opcional.
- **Tamaños:** sm 2.25rem, md 2.6rem, lg 2.9rem de alto mínimo.
- **Primary:** violeta lleno con letra de contraste; hover a `--accent-hover`. Una sola acción principal por grupo (p. ej. «Abrir el recurso»).
- **Secondary:** panel `--bg-raised` con canto `--line`; el hover solo refuerza el canto (`--line-strong`). Para la acción de apoyo (p. ej. «Repositorio»).
- **Outline:** solo canto; al pasar gana `--bg-raised` y letra fuerte. Acompaña al primario en el hero.
- **Link:** enlace violeta con forma de botón solo en el foco; hover a `--text-strong`.
- **Hover / Focus:** transiciones de 140ms con `--ease-out`; foco global `outline: 2px solid var(--ring)` con 2px de separación.

### Buscador de cabecera y botón de tema

- **Buscador** (`SearchButton`): un único botón, idéntico en portada y documentación. Panel `--bg-panel`, canto `--line`, 2.25rem de alto y 15rem de ancho (flexible en móvil), lupa, «Buscar» en `--text-faint` y la tecla `Ctrl K`. Hover: canto `--line-strong` y letra `--text-muted`. No busca: abre el modal de Pagefind.
- **Botón de tema** (`ThemeToggle`): un botón de icono de 2rem que muestra la luna en oscuro y el sol en claro, igual en portada, cabecera de documentación y menú móvil (el override `ThemeSelect` de Starlight lo renderiza). Guarda la preferencia en `starlight-theme`.

### Navigation

- **Cabecera:** fondo `--bg`, línea inferior, 3.75rem. Enlaces de 0.875rem/500 en `--text-muted` con radio de 6px; hover `--bg-raised`; el actual en violeta. Redes separadas por una línea vertical.
- **Menú (explorador):** bloques separados por una línea; rótulo de bloque en 0.8125rem/650 `--text-strong`, fijo. Categoría 0.875rem/500 y subcategoría 0.84rem/450 como carpetas con flecha que gira 90°; al abrirse su letra pasa a `--text-strong`. Todo lo que cuelga de una carpeta abierta lleva una guía de sangría de 1px (`--line`). Solo una categoría abierta a la vez (`<details name>`).
- **Entrada:** rejilla de 1.55rem de número + título en una línea; número mono 0.68rem en `--text-faint`. Hover `--bg-raised`.
- **Entrada activa:** el archivo abierto — fondo `--bg-active`, letra `--accent-strong` (violeta `--accent` en claro), peso 550 y número en violeta.
- **TOC:** 0.84rem en `--text-muted`; la sección actual en violeta 550.

### Bloques de código

- **Colores de letra:** temas `night-owl` (oscuro) y `night-owl-light` (claro) de Expressive Code, solo para los tokens; Expressive Code cambia de uno a otro con `data-theme`.
- **Superficie:** del sistema — cuerpo `--bg-code`, barra de pestañas y título de terminal `--bg-code-chrome`, canto `--line`, radio 8px, sin sombra. Se adapta a los dos temas.
- **Pestaña activa:** fondo `--bg-code`, letra `--text-strong`, raya violeta superior.
- **Botón de copiar:** icono de copiar sobre un velo de `--text-strong` al 6% (14% hover, 22% activo), radio 6px, sin canto. Al copiar, el icono pasa a un visto verde durante 0.9s y vuelve; no hay globo flotante, el aviso queda en la región `aria-live`.
- **Pestañas de gestor de paquetes** (`pm-tabs`): el mismo panel de editor — barra `--bg-code-chrome`, pestañas mono 0.75rem separadas por líneas, la activa con la raya violeta; el bloque de terminal va soldado debajo sin su propia barra.
- **Código en línea:** verde string sobre `--bg-raised`, canto `--line`, radio 4px, 0.86em.

### Cabecera de entrada (`PageTitle`)

Bajo el `h1`, en este orden y con 0.85rem entre piezas:

- **Línea de ruta:** `Categoría / Subcategoría · fecha` en 0.85rem; categoría en 600, subcategoría en `--text`, separadores en `--line-strong`, fecha mono en `--text-faint`.
- **Comando:** si la entrada declara `command`, una línea `pre` en `--bg-code` con canto, radio 8px, mono 0.8rem en verde string.
- **Panel de datos y acciones:** un único panel `--bg-panel` con canto `--line` y radio 8px que aparece cuando la entrada tiene facts o enlaces, idéntico para todas las categorías. Facts a la izquierda en rejilla (`dt` 0.75rem/600 `--text-faint`, `dd` 0.85rem `--text`); botones primario y secundario a la derecha.
- **Relacionado:** rótulo en `--text-faint` y enlaces violeta a otras entradas.
- **Advertencias:** lista sobre coral al 8% con canto coral al 32%, radio 8px.

### Lectura

- **Tablas:** a toda la columna, canto `--line`, radio 8px, celdas con líneas verticales y horizontales, cabecera `--bg-panel` 0.8125rem/600 en `--text-muted`, cuerpo 0.9rem.
- **Avisos:** panel teñido de su rol al 7% con canto al 30%, radio 8px; título en el color del rol (nota violeta, consejo verde, cuidado ámbar, peligro coral).
- **Enlaces de prosa:** violeta con subrayado de 1px al 38% que se vuelve pleno en hover.
- **Citas:** panel `--bg-panel` con canto y radio 8px, letra `--text-muted`.

### Búsqueda (Ctrl/Cmd K) — componente insignia

La paleta de comandos del editor. Modal de 44rem a 4.5rem del borde superior, `--bg-panel`, canto `--line-strong`, radio 12px, `--shadow-lg` sobre `--backdrop`. Campo de 3rem sobre `--bg` con radio 8px; al enfocar, canto violeta y halo `--accent-soft`. Cada resultado es un panel con barra superior `--bg-code-chrome` (título 0.925rem/600) y subresultados marcados con `#` mono en `--text-faint`, separados por `--line-soft`; hover del resultado con canto `--accent-line`. Coincidencias con `mark` en `--accent-soft`. Teclas (`.kbd`): tapa mono 0.68rem sobre `--bg` con canto y radio 4px.

### Portada

- **Paleta de comandos del hero:** el objeto principal. Panel `--bg-panel`, canto `--line-strong`, radio 12px, 3.5rem de alto y hasta 34rem de ancho, `--shadow-md`, lupa violeta y tecla `Ctrl K`. Hover: canto `--accent-line` y halo de 3px.
- **«Lo último»:** panel de radio 12px con barra `--bg-code-chrome` (punto violeta + rótulo); filas de título en una línea, marca de 0.5rem en el color de su categoría y fecha mono.
- **Barra de estado:** tres cifras mono en un panel de radio 12px, separadas por líneas verticales (horizontales en móvil).
- **Índice de categorías:** una línea de código resaltada — lista mono 0.95rem sobre `--bg-code` con canto y radio 12px; cada categoría en su color de sintaxis, todas al mismo peso, separadas solo por aire (1.75rem) y centradas por filas, con `flex-wrap: balance` donde el navegador lo soporta. Sin puntos separadores: quedaban sueltos al inicio de una fila. No son enlaces.
- **Recorrido:** pasos numerados en mono violeta dentro de un panel de radio 12px, separados por líneas.

### Movimiento

Una curva (`--ease-out`: `cubic-bezier(0.16, 1, 0.3, 1)`) y dos duraciones: 140ms (`--dur-fast`) para estados y 280ms (`--dur-slow`) para lo que se despega. Entre páginas, `@view-transition { navigation: auto }` funde el contenido en 280ms mientras la cabecera (`cabecera`) y el menú (`menu`) conservan su propio nombre de transición y se quedan quietos. Cada navegación sigue siendo una carga completa. Con `prefers-reduced-motion` la transición entre páginas se desactiva y las animaciones se reducen a 0.01ms.

### Tema de código por tema del sitio

Cada tema del sitio tiene su tema de código: Night Owl en oscuro y Night Owl Light en claro. Dracula, One Dark Pro y Monokai se probaron y se descartaron. Dracula, además, tiene letras pensadas para fondo oscuro y sobre `--bg-code` claro (`#f4f4f8`) daban contrastes de 1.0–2.9:1. Cualquier tema de código nuevo se elige en pareja y se comprueba en los dos temas antes de adoptarlo.

## Do's and Don'ts

### Do:

- **Do** leer siempre variables de tema (`--bg`, `--text`, `--syn-*`, `--accent`) y comprobar cada pieza nueva en oscuro y en claro.
- **Do** usar el violeta keyword para navegar y enlazar, y el resto de roles de sintaxis solo para su significado (literal, cuidado, peligro) o para la categoría.
- **Do** separar y enmarcar con líneas de 1px (`--line`) y escalones de superficie antes de pensar en una sombra.
- **Do** tomar los radios de la escala: 4px piezas pequeñas, 6px controles, 8px paneles de documentación, 12px modal y paneles de portada.
- **Do** poner en mono (JetBrains Mono) código, comandos, teclas, fechas, cifras y números de línea, con `tabular-nums`.
- **Do** dejar que las tablas ocupen toda la columna, con celdas y cabecera en `--bg-panel`.
- **Do** mostrar el mismo panel de datos y acciones en la cabecera de entrada para cualquier categoría.
- **Do** pintar el código con las letras de Night Owl / Night Owl Light sobre `--bg-code` y `--bg-code-chrome`, en recto.
- **Do** usar el `SearchButton` y el `ThemeToggle` compartidos en cualquier cabecera nueva.
- **Do** mantener `--text-faint` como el texto más tenue: 5:1 sobre el fondo en los dos temas.

### Don't:

- **Don't** usar azul como color de base ni de superficie.
- **Don't** usar negro puro (`#000`) como fondo ni blanco puro como superficie clara.
- **Don't** usar Geist ni ninguna otra familia fuera de Onest Variable y JetBrains Mono Variable.
- **Don't** reemplazar el botón de tema por un selector, ni dejar una superficie con un solo tema.
- **Don't** usar el fondo propio del tema de código, ni recuperar sus cursivas, ni un tema de código que solo se lea en oscuro.
- **Don't** rellenar una pieza con un color de sintaxis o de categoría; el único relleno pleno es el botón primario.
- **Don't** variar la forma o el color del panel de la cabecera de entrada según la categoría.
- **Don't** añadir `ClientRouter` ni navegación con JavaScript; las transiciones entre páginas son solo CSS.
- **Don't** reestructurar el armazón de Starlight (cabecera, menú, contenido, TOC).
- **Don't** escribir hex en un componente; si falta un color, falta un token en los dos temas.
