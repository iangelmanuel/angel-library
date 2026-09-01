---
title: Scroll en CSS — Referencia rápida
description: Scrollbar personalizado, scroll-snap para carruseles y scroll suave, sin JavaScript.
type: snippets
language: css
tags: [css, scroll, scrollbar]
related:
  - languages/css/css-animations
updatedAt: 2026-08-16
---

Cómo se ve y se comporta el scroll, no cómo animar según él — para eso ver [Animaciones CSS](/languages/css/css-animations).

## Scroll suave

Una sola propiedad para que cualquier salto a un ancla (`href="#seccion"`) o `scrollIntoView()` se anime en vez de saltar de golpe.

```css
html {
  scroll-behavior: smooth;
}
```

## Scrollbar personalizado

`scrollbar-color`/`scrollbar-width` cubren Firefox y navegadores basados en Chromium recientes con dos líneas. Los pseudo-elementos `::-webkit-scrollbar-*` dan más control (grosor, radio, hover) pero solo aplican en Chromium/Safari.

```css title="styles/scrollbar.css"
html {
  scrollbar-color: #26262c transparent;
  scrollbar-width: thin;
}

::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: #26262c;
  border: 2px solid var(--background, #0a0a0b);
  border-radius: 999px;
}
::-webkit-scrollbar-thumb:hover {
  background: #3f3f46;
}
```

## Carrusel con scroll-snap

`scroll-snap-type` en el contenedor y `scroll-snap-align` en cada hijo hacen que el scroll "encaje" en cada elemento — un carrusel horizontal sin JavaScript ni librería.

```css
.snap-container {
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  gap: 1rem;
}

.snap-item {
  flex: 0 0 85%;
  scroll-snap-align: start;
}
```

```html
<div class="snap-container">
  <div class="snap-item">1</div>
  <div class="snap-item">2</div>
  <div class="snap-item">3</div>
</div>
```

## Resumen

| Técnica | Cuándo usarla |
| --- | --- |
| `scroll-behavior: smooth` | Cualquier salto a anclas o `scrollIntoView()` |
| `scrollbar-color` / `::-webkit-scrollbar-*` | Scrollbar a tono con el diseño, en vez del del sistema operativo |
| `scroll-snap-type` + `scroll-snap-align` | Carruseles y galerías horizontales sin JS |

## Consideraciones

- `scroll-behavior: smooth` debería ir siempre junto al bloque de `prefers-reduced-motion` que fuerza `scroll-behavior: auto` — ver [CSS Reset](/languages/css/css-reset), que ya lo incluye.
- Este mismo sitio usa exactamente el scrollbar de arriba — ver `global.css`.
- `::-webkit-scrollbar-*` no es estándar (no está en ninguna spec del W3C) pero lo soportan todos los navegadores basados en Chromium más Safari — en la práctica cubre casi todo el tráfico real, Firefox solo respeta `scrollbar-color`/`scrollbar-width`.
