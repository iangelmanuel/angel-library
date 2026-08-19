---
title: Bulma
description: Framework CSS basado en Flexbox, solo clases (sin JS), para maquetar componentes en HTML puro.
category: ui-ux
stack: ui-css
order: 7
tags: [html, css]
website: https://bulma.io
github: https://github.com/jgthms/bulma
install: npm install bulma
updatedAt: 2026-08-17
---

Solo CSS: cero JavaScript propio, así que interactividad (dropdowns, modales, navbar burger) hay que cablearla a mano con unas pocas líneas. A cambio, el HTML queda muy legible (`box`, `card`, `notification`, `tag`).

## Configuración inicial

```ts title="main.ts"
import 'bulma/css/bulma.min.css';
```

Para personalizar variables (colores, tipografía) hace falta compilar desde el Sass fuente en vez de importar el `.css` ya compilado:

```scss title="custom.scss"
@use 'bulma/sass' with (
  $primary: #7c3aed
);
```

## Tips

- El componente `navbar-burger` (menú móvil) necesita el `toggle` de la clase `is-active` escrito a mano — no viene con JS incluido.
- Buena opción cuando se quiere evitar Tailwind pero tampoco se quiere el peso de Bootstrap con su JS.
