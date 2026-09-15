---
title: daisyUI
description: Plugin de Tailwind CSS que agrega clases de componentes semánticas (btn, card, modal) sin JavaScript, en HTML puro.
tags: [html, tailwindcss, css]
sidebar:
  order: 3
draft: false
resourceCategory: Documentación del paquete
website: https://daisyui.com
github: https://github.com/saadeghi/daisyui
updatedAt: 2026-09-07
---

En vez de armar un botón a golpe de `px-4 py-2 rounded bg-blue-600...`, daisyUI da la clase `btn btn-primary`. Sigue siendo Tailwind por debajo (se puede combinar con utilidades normales), no agrega JS ni depende de ningún framework.

## Configuración inicial

Este ejemplo usa **daisyUI 5 y Tailwind CSS 4**. Necesitas Tailwind ya integrado en tu bundler y una hoja global importada por la aplicación.

```bash
pnpm add -D daisyui@5
```

```css title="global.css"
@import "tailwindcss";
@plugin "daisyui" {
  themes: light --default, dark --prefersdark;
}
```

## Ejemplo y resultado

```html
<article class="card bg-base-100 shadow-sm">
  <div class="card-body">
    <h2 class="card-title">Primera tarea</h2>
    <p>Practica los estados de una interfaz.</p>
    <button type="button" class="btn btn-primary">Marcar como lista</button>
  </div>
</article>
```

Debes ver una tarjeta con un botón de estilo primario. El botón todavía no modifica tareas: las clases aportan apariencia; tu aplicación implementa la acción y el feedback.

## Recomendaciones y límites

- `data-theme="dark"` selecciona un tema habilitado. Prueba foco y contraste en cada tema que publiques.
- En v5, `themes` se configura dentro de `@plugin`. La configuración JavaScript de Tailwind 3 corresponde a daisyUI 4 y no se mezcla con este ejemplo.
- Comprueba que la hoja global se cargue antes de diagnosticar clases sin estilo. Un modal necesita también comportamiento, foco y cierre; una clase CSS no completa la interacción.

## Fuentes

- [daisyUI: configuración](https://daisyui.com/docs/config/)
