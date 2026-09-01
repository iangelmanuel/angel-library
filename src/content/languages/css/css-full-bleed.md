---
title: Sección full-bleed dentro de un container
description: Hacer que una sección ocupe todo el viewport aunque viva dentro de un contenedor centrado, sin wrappers extra.
type: tricks
tags: [css, layout, responsive]
problem: Un banner o imagen debe escapar del max-width del contenido y tocar ambos bordes del viewport.
related:
  - languages/css/css-layout-tricks
updatedAt: 2026-08-18
---

```css
.full-bleed {
  width: 100vw;
  margin-inline: calc(50% - 50vw);
}
```

El elemento mide el viewport y compensa la mitad de la diferencia entre su contenedor y la pantalla.

Si aparece scroll horizontal por el ancho de la scrollbar, prefiere unidades dinámicas disponibles en tu matriz de soporte o un layout Grid de tres columnas:

```css
.page {
  display: grid;
  grid-template-columns: 1fr min(65ch, calc(100% - 2rem)) 1fr;
}

.page > * { grid-column: 2; }
.page > .full-bleed { grid-column: 1 / -1; width: auto; margin: 0; }
```

El patrón con Grid es más robusto cuando controlas el layout padre; el truco con `100vw` sirve para contenido Markdown donde solo puedes agregar una clase al bloque puntual.
