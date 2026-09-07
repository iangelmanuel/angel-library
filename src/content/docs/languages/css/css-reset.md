---
title: CSS Reset — Referencia rápida
description: Reset moderno y mínimo para arrancar cualquier proyecto sin los estilos por defecto del navegador.
type: snippets
language: css
tags: [css, reset]
updatedAt: 2026-08-16
---

Reset mínimo para pegar al inicio de cualquier proyecto nuevo, antes de cualquier otro estilo. Cubre lo que realmente molesta (`box-sizing`, márgenes, imágenes que se desbordan) sin normalizar cosas que rara vez importan.

```css title="styles/reset.css"
*,
*::before,
*::after {
  box-sizing: border-box;
}

* {
  margin: 0;
}

html {
  -webkit-text-size-adjust: 100%;
}

body {
  min-height: 100dvh;
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
}

img,
picture,
video,
canvas,
svg {
  display: block;
  max-width: 100%;
}

input,
button,
textarea,
select {
  font: inherit;
}

p,
h1,
h2,
h3,
h4,
h5,
h6 {
  overflow-wrap: break-word;
}

ul[role="list"],
ol[role="list"] {
  list-style: none;
  padding: 0;
}

#root,
#__next {
  isolation: isolate;
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

## Qué hace cada regla

| Regla                                                           | Por qué                                                                                                                                                                            |
| --------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `box-sizing: border-box` en todo                                | Padding y border no suman al ancho declarado                                                                                                                                       |
| `margin: 0` universal                                           | Sin márgenes sorpresa entre `h1`, `p`, `ul`... que hay que ir pisando                                                                                                              |
| `min-height: 100dvh` en `body`                                  | `dvh` respeta la barra de direcciones en mobile, `vh` no                                                                                                                           |
| `img, picture, video...` a `display: block` + `max-width: 100%` | Las imágenes no se desbordan del contenedor ni dejan espacio fantasma abajo (`display: inline` por defecto)                                                                        |
| `font: inherit` en inputs/botones                               | Los form controls no usan la tipografía del sistema por defecto, heredan la del sitio                                                                                              |
| `ul[role='list']` en vez de `ul` a secas                        | Quita los bullets solo donde tú decides, y mantiene la semántica de lista para lectores de pantalla (quitar `list-style` sin más hace que VoiceOver deje de anunciarlo como lista) |
| `#root, #__next` con `isolation: isolate`                       | Crea un nuevo stacking context, evita que `z-index` de librerías externas (modales, tooltips) rompa el layout                                                                      |
| Bloque `prefers-reduced-motion`                                 | Respeta la preferencia de accesibilidad del sistema operativo, forzando animaciones casi instantáneas                                                                              |

## Consideraciones

- Este reset no toca tipografía (`font-family`, tamaños) ni colores — eso va en tus propios tokens, no en el reset.
- `ul[role='list']` requiere que agregues `role="list"` al HTML: `<ul role="list">`. Si no lo haces, `list-style: none` se aplica igual pero pierdes la ventaja de accesibilidad.
- Si usas Next.js, reemplaza `#__next` según corresponda; en Astro sin un contenedor raíz, esa regla no aplica y puedes quitarla.
- El bloque de `prefers-reduced-motion` es el mismo patrón que ya usa este sitio — ver `global.css`.
