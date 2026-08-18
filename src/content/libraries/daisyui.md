---
title: daisyUI
description: Plugin de Tailwind CSS que agrega clases de componentes semánticas (btn, card, modal) sin JavaScript, en HTML puro.
category: ui-ux
stack: html
order: 3
tags: [html, tailwindcss, css]
website: https://daisyui.com
github: https://github.com/saadeghi/daisyui
install: npm install -D daisyui
updatedAt: 2026-08-17
---

En vez de armar un botón a golpe de `px-4 py-2 rounded bg-blue-600...`, daisyUI da la clase `btn btn-primary`. Sigue siendo Tailwind por debajo (se puede combinar con utilidades normales), no agrega JS ni depende de ningún framework.

## Configuración inicial

Tailwind v4 (CSS-first, sin `tailwind.config`):

```css title="global.css"
@import 'tailwindcss';
@plugin "daisyui";
```

Tailwind v3:

```js title="tailwind.config.js"
module.exports = { plugins: [require('daisyui')] };
```

## Tips

- Los temas (`data-theme="dark"` en el `<html>`) son la forma de cambiar toda la paleta sin tocar clases — trae ~30 temas incluidos.
- `daisyui.themes` en la config limita qué temas se compilan (menos CSS final).
