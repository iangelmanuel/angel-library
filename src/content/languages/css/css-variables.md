---
title: CSS Variables — Referencia rápida
description: Custom properties para tokens de diseño, fallbacks, overrides por scope y theming sin preprocesador.
type: snippets
language: css
tags: [css, variables, theming]
related:
  - general/utils/dom
updatedAt: 2026-08-16
---

Custom properties (`--variable`) nativas de CSS. Reemplazan lo que antes hacía Sass con `$variables`, pero con una ventaja clave: son valores reales en el DOM, se pueden leer y sobreescribir desde JS y cambian en tiempo real sin recompilar nada.

## Declarar tokens

Declara los tokens en `:root` para que estén disponibles en toda la página. Agrúpalos por lo que representan (color, espaciado, radios), no por dónde se usan.

```css title="styles/tokens.css"
:root {
  --color-primary: #f5f5f5;
  --color-muted: #9c9ca5;
  --spacing-unit: 0.25rem;
  --radius: 0.5rem;
}
```

```css
.card {
  padding: calc(var(--spacing-unit) * 4);
  border-radius: var(--radius);
  color: var(--color-primary);
}
```

## Fallback

`var()` acepta un segundo argumento como valor por defecto, para cuando la variable no está definida (o el navegador no la soporta). Útil en componentes que se reusan en proyectos donde el token puede no existir.

```css
.badge {
  color: var(--accent-color, #60a5fa);
}
```

## Override por scope

Una variable declarada en un selector más específico pisa la de `:root` solo dentro de ese elemento y sus hijos — así funciona el theming sin duplicar reglas.

```css
.theme-danger {
  --color-primary: #ef4444;
}
```

```html
<div class="card theme-danger">
  <!-- .card usa var(--color-primary), aquí sale rojo -->
</div>
```

## Leer y escribir desde JS

Las variables viven en el DOM, así que se leen con `getComputedStyle` y se escriben con `.style.setProperty`. Para leerlas, este sitio ya tiene [`getCssVar()`](/general/utils/dom) en DOM Utils.

```ts
document.documentElement.style.setProperty('--color-primary', '#22c55e');
```

## Resumen

| Técnica | Cuándo usarla |
| --- | --- |
| Declarar en `:root` | Tokens globales: colores, spacing, radios |
| `var(--x, fallback)` | Componentes reusables entre proyectos con distintos tokens |
| Override por selector | Theming (variantes de color, dark/light) sin duplicar reglas |
| `setProperty` desde JS | Cambiar un token en tiempo real (ej. color picker, tema dinámico) |

## Consideraciones

- Las variables son heredables como cualquier propiedad CSS: un override en un padre afecta a todos los hijos que no lo pisen de nuevo.
- No funcionan dentro de media queries como valores de breakpoint (`@media (min-width: var(--bp))` no es válido) — los breakpoints van como valores fijos.
- `calc()` combina variables sin problema, pero necesita unidades consistentes: `calc(var(--spacing-unit) * 4)` funciona, mezclar `%` con `px` sin cuidado puede dar resultados raros.
