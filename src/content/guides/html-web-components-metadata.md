---
title: Template, slot y Web Components
description: Crear componentes nativos encapsulados con template, custom elements y slots, entendiendo cuándo aportan valor.
category: general
stack: html
order: 4
tags: [html, web-components, shadow-dom, components]
scope: componentes nativos
related:
  - technologies/html
  - guides/frontend-rendering-state-data-flow
updatedAt: 2026-08-18
---

## `template` no se renderiza solo

Un `template` guarda una estructura inerte. Su `content` es un `DocumentFragment` que puedes clonar cuando necesitas repetir una vista sin construir cada nodo manualmente.

```html
<template id="user-card-template">
  <article class="user-card">
    <h2 data-name></h2>
  </article>
</template>
```

El contenido de un template no aparece en el árbol visible ni ejecuta su flujo como una instancia normal hasta que lo clonas. Esto lo hace útil para componentes pequeños, listas o fragments controlados por una librería.

## Custom elements y ciclo de vida

Un custom element debe tener un nombre con guion y puede reaccionar a `connectedCallback`, `disconnectedCallback` y cambios de atributos declarados en `observedAttributes`. Define una API pequeña y evita hacer trabajo costoso en cada cambio.

```js
class UserBadge extends HTMLElement {
  static observedAttributes = ['name']

  connectedCallback() {
    this.render()
  }

  attributeChangedCallback() {
    this.render()
  }

  render() {
    this.textContent = this.getAttribute('name') ?? 'Sin nombre'
  }
}

customElements.define('user-badge', UserBadge)
```

Escapa o asigna texto con `textContent` cuando el valor viene de usuarios. Un custom element no debe asumir que existe `window` si también se usa en SSR.

## Shadow DOM y slots

`attachShadow({ mode: 'open' })` encapsula estructura y estilos; `slot` permite que el consumidor entregue contenido dentro del componente. El encapsulamiento ayuda a evitar colisiones, pero también cambia cómo se heredan estilos, cómo se prueban los elementos y cómo se exponen partes internas.

Usa Web Components cuando el componente deba vivir entre frameworks o distribuirse como elemento independiente. En una aplicación de un solo framework, un componente nativo puede añadir complejidad innecesaria frente al sistema de componentes que ya existe.

## Metadatos útiles

`meta name="theme-color"`, `color-scheme`, `link rel="preconnect"`, `link rel="canonical"` y `link rel="alternate"` comunican contexto al navegador y a crawlers. Cada página debe tener un propósito claro para sus metadatos; copiar tags sin entenderlos puede producir previews, canonicalización o preferencias de color incorrectas.
