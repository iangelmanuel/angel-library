---
title: Preline UI
description: Componentes HTML sobre Tailwind CSS con un plugin de JavaScript propio (sin jQuery ni Alpine) para la interactividad.
type: libraries
order: 4
tags: [html, tailwindcss, components]
website: https://preline.co
github: https://github.com/htmlstreamofficial/preline
install: npm install preline
updatedAt: 2026-08-17
---

Alternativa a Flowbite con más componentes de tipo "aplicación" (sidebars, steps, file upload) además de los básicos. El JS es un solo paquete propio, sin dependencias externas.

## Configuración inicial

```js title="tailwind.config.js"
module.exports = {
  content: ["./node_modules/preline/dist/*.js" /* ...resto del content */],
  plugins: [require("preline/plugin")]
}
```

```ts title="main.ts"
import "preline/preline.js"
```

Con navegación tipo SPA (Astro view transitions, React Router) hay que re-inicializar los componentes tras cada cambio de página:

```ts
window.HSStaticMethods.autoInit()
```

## Tips

- Los ejemplos de la doc son copiables directo en HTML — no requieren componente ni build step propio.
- `data-hs-*` es el prefijo de los atributos que controlan cada componente (equivalente a los `data-*` de Flowbite).
