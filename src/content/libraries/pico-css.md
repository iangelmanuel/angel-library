---
title: Pico CSS
description: Framework CSS "classless" que estiliza HTML semántico directamente, sin agregar clases a cada elemento.
category: ui-ux
stack: html
order: 8
tags: [html, css, minimal]
website: https://picocss.com
github: https://github.com/picocss/pico
install: npm install @picocss/pico
updatedAt: 2026-08-17
---

Apunta HTML semántico plano (`<button>`, `<article>`, `<nav>`, `<table>`) y ya se ve prolijo, sin agregar una sola clase. Útil para prototipos, formularios internos o documentación donde no vale la pena montar un design system.

## Configuración inicial

```ts title="main.ts"
import '@picocss/pico/css/pico.min.css';
```

O vía CDN:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@picocss/pico@2/css/pico.min.css" />
```

## Tips

- Trae variantes de color (`pico.amber.min.css`, etc.) y clases utilitarias mínimas (`.grid`, `.container`) para los casos donde el HTML semántico no alcanza.
- No compite con Tailwind/Bootstrap en flexibilidad — la propuesta es justamente no tener que decidir clases.
