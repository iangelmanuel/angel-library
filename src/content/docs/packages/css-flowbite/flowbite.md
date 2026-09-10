---
title: Flowbite
description: Componentes UI en HTML listos sobre Tailwind CSS, con plugin oficial y versiones para React, Vue, Svelte y Angular.
type: libraries
order: 2
tags: [html, tailwindcss, components]
website: https://flowbite.com
github: https://github.com/themesberg/flowbite
updatedAt: 2026-09-07
---

Componentes en HTML plano con clases de Tailwind (dropdowns, modales, carousels, datepicker) más un plugin de JS propio para la interactividad — no requiere React ni ningún framework.

## Instalación

```bash
pnpm add flowbite
```

## Configuración inicial

La siguiente configuración corresponde a **Tailwind 3**. Fija una versión de Flowbite compatible con ese proyecto. En Tailwind 4, utiliza la configuración CSS descrita en la documentación de Flowbite; no crees un `tailwind.config.js` solo para copiar este bloque.

```js title="tailwind.config.js"
module.exports = {
  content: ["./node_modules/flowbite/**/*.js" /* ...resto del content */],
  plugins: [require("flowbite/plugin")]
}
```

Importar el JS (una sola vez, ej. en el layout base) para que dropdowns/modales funcionen:

```js title="src/main.js (entrada de navegador procesada por el bundler)"
import "flowbite"
```

`node_modules/` no suele publicarse como ruta del sitio. El bundler resuelve el import y genera el archivo que recibirá el navegador. En Astro, coloca el import dentro de un `<script>` procesado de tu layout.

## Comprobación

Monta un dropdown de la documentación correspondiente a tu versión. Comprueba que se abra, cierre y responda al teclado. Si aparece estilizado pero no responde, revisa el JavaScript; si responde sin estilos, revisa el escaneo de clases y la hoja CSS. En navegación cliente, verifica la reinicialización de componentes.

## Recomendaciones

- Los componentes se activan por atributos `data-*` (`data-modal-toggle`, `data-dropdown-trigger`), sin escribir JS propio para lo básico.
- Existe `flowbite-react` si el mismo proyecto también usa React — mismo diseño, API de componentes en vez de HTML+atributos.
