---
title: Bootstrap
description: Framework CSS clásico con componentes HTML, JS propio y sistema de grid, sin depender de Tailwind.
category: ui-ux
stack: ui-css
order: 6
tags: [html, css, components]
website: https://getbootstrap.com
github: https://github.com/twbs/bootstrap
install: npm install bootstrap
updatedAt: 2026-08-17
---

El framework CSS más veterano y todavía el más usado fuera del mundo Tailwind: clases utilitarias propias, sistema de grid de 12 columnas, y componentes JS (modal, tooltip, carousel) sin dependencias externas desde la v5 (dejó jQuery).

## Configuración inicial

```ts title="main.ts"
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
```

O vía CDN, sin build step:

```html
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" />
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
```

## Tips

- Personalizar variables Sass propias (`$primary`, `$border-radius`) requiere compilar desde el `.scss` fuente, no solo el `.css` compilado.
- Mezclarlo con Tailwind en el mismo proyecto genera conflictos de reset — elegir uno de los dos por proyecto.
