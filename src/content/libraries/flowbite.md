---
title: Flowbite
description: Componentes UI en HTML listos sobre Tailwind CSS, con plugin oficial y versiones para React, Vue, Svelte y Angular.
category: ui-ux
stack: html
order: 2
tags: [html, tailwindcss, components]
website: https://flowbite.com
github: https://github.com/themesberg/flowbite
install: npm install flowbite
updatedAt: 2026-08-17
---

Componentes en HTML plano con clases de Tailwind (dropdowns, modales, carousels, datepicker) más un plugin de JS propio para la interactividad — no requiere React ni ningún framework.

## Configuración inicial

Agregar el plugin y que Tailwind escanee las clases que usa Flowbite:

```js title="tailwind.config.js"
module.exports = {
  content: ['./node_modules/flowbite/**/*.js', /* ...resto del content */],
  plugins: [require('flowbite/plugin')],
};
```

Importar el JS (una sola vez, ej. en el layout base) para que dropdowns/modales funcionen:

```html
<script src="node_modules/flowbite/dist/flowbite.min.js"></script>
```

## Tips

- Los componentes se activan por atributos `data-*` (`data-modal-toggle`, `data-dropdown-trigger`), sin escribir JS propio para lo básico.
- Existe `flowbite-react` si el mismo proyecto también usa React — mismo diseño, API de componentes en vez de HTML+atributos.
