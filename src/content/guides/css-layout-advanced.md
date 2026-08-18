---
title: "Layout CSS avanzado: grid, subgrid y contextos"
description: Entender sizing, minmax, subgrid, containing blocks, stacking contexts y patrones de layout que suelen causar bugs.
category: general
stack: css
order: 2
tags: [css, grid, layout, subgrid, stacking-context]
scope: layout avanzado
related:
  - snippets/css-layout-tricks
  - tricks/css-full-bleed
  - guides/css-cascade-layers-container
updatedAt: 2026-08-18
---

## Grid que no se rompe

`minmax(0, 1fr)` evita que el contenido mínimo de una celda fuerce overflow. `auto-fit` colapsa columnas vacías y `auto-fill` conserva sus tracks; elige según si quieres que las tarjetas crezcan o que la grilla reserve columnas.

```css
.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 18rem), 1fr));
  gap: 1rem;
}

.article-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(14rem, 20rem);
}
```

El `min()` evita que el track de una card sea más ancho que el viewport en pantallas pequeñas. Prueba contenido largo, URLs sin espacios, traducciones y zoom; ahí aparecen las restricciones mínimas ocultas.

## `subgrid`

`subgrid` permite que una grilla hija use los tracks de su padre. Es útil para alinear títulos, metadatos y botones de varias cards sin fijar alturas artificiales.

```css
.cards { display: grid; grid-template-columns: repeat(3, 1fr); }
.card { display: grid; grid-template-rows: subgrid; grid-row: span 3; }
```

No lo uses para compensar una estructura de contenido incoherente. Si una card tiene acciones opcionales, define una jerarquía que siga siendo comprensible cuando una fila quede vacía.

## Containing blocks y posicionamiento

`position: absolute` se calcula contra el ancestro posicionado más cercano; `position: fixed` suele usar el viewport, pero transformaciones, filtros o ciertos contextos pueden crear un containing block distinto. Cuando un tooltip aparece desplazado, inspecciona qué ancestro establece el contexto antes de cambiar offsets al azar.

## Stacking contexts

`z-index` solo compara elementos dentro del mismo stacking context. `transform`, `opacity` menor que 1, `filter`, `isolation: isolate`, algunos `contain` y elementos posicionados pueden crear contextos nuevos. Un `z-index: 9999` dentro de un contexto detrás no puede superar un hermano de otro contexto.

```css
.app-shell { isolation: isolate; }
.modal-layer { position: fixed; z-index: 10; }
.tooltip { position: absolute; z-index: 20; }
```

Define capas semánticas —base, dropdown, modal, toast— en vez de subir números indefinidamente. La solución suele ser corregir el árbol de stacking, no usar `999999`.

## Subir de nivel

Combina Grid para macro layout, Flexbox para distribución de una dimensión, `clamp()` para escalas fluidas y container queries para componentes reusables. Mantén una fuente clara de verdad para el tamaño: mezclar alturas fijas, `aspect-ratio`, contenido variable y overflow oculto produce recortes difíciles de detectar.
