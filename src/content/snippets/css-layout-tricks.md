---
title: Trucos de Layout CSS — Referencia rápida
description: Centrado, grillas responsivas sin media queries, truncar texto y aspect-ratio para media, listos para copiar.
category: languages
stack: css
language: css
tags: [css, layout, grid, flexbox]
updatedAt: 2026-08-16
---

Soluciones cortas a problemas de layout que se repiten en cualquier proyecto — la sintaxis exacta es la que siempre se olvida.

## Centrado perfecto

Un solo `display: grid` con `place-items: center` centra en ambos ejes, sin flexbox ni `position: absolute` con `transform`.

```css
.center {
  display: grid;
  place-items: center;
}
```

## Grilla responsiva sin media queries

`repeat(auto-fit, minmax(220px, 1fr))` crea tantas columnas como entren, cada una de al menos `220px`, y las estira para llenar el espacio sobrante. Cambia de 1 a N columnas solo, sin un solo `@media`.

```css
.auto-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
}
```

## Truncar texto en una línea

El combo de siempre para "..." al final de un texto que no entra. Las tres propiedades son necesarias, ninguna funciona sola.

```css
.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
```

## Truncar texto en varias líneas

Igual que arriba, pero cortando después de N líneas en vez directamente. Sigue necesitando el prefijo `-webkit-` para soporte amplio, aunque la versión sin prefijo ya funciona en navegadores recientes.

```css
.clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
```

## Media responsiva sin deformar

`aspect-ratio` reserva el espacio antes de que la imagen cargue (evita layout shift) y `object-fit: cover` recorta sin deformar el contenido, igual que `background-size: cover` pero para `<img>`/`<video>`.

```css
.media-16-9 {
  aspect-ratio: 16 / 9;
  width: 100%;
  object-fit: cover;
}
```

```html
<img src="/portada.jpg" alt="…" class="media-16-9" />
```

## Resumen

| Técnica | Cuándo usarla |
| --- | --- |
| `place-items: center` | Centrar cualquier cosa en ambos ejes |
| `repeat(auto-fit, minmax(...))` | Grillas de tarjetas que se acomodan solas al ancho disponible |
| `text-overflow: ellipsis` | Truncar texto a una línea |
| `-webkit-line-clamp` | Truncar texto a varias líneas |
| `aspect-ratio` + `object-fit: cover` | Imágenes/video responsivos sin layout shift ni deformación |

## Consideraciones

- `auto-fit` vs `auto-fill`: `auto-fit` colapsa las columnas vacías y estira las que tienen contenido; `auto-fill` las deja como columnas vacías del mismo ancho. Para tarjetas casi siempre quieres `auto-fit`.
- `line-clamp` (sin prefijo) todavía no es universal — si necesitas soporte amplio hoy, quedate con `-webkit-line-clamp`, que funciona en todos los navegadores relevantes pese al nombre.
- `aspect-ratio` no reemplaza `width`/`height` en el HTML si te importa el SEO de imágenes o el CLS antes de que cargue el CSS — usalos juntos cuando puedas.
