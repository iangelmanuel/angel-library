---
title: Web Components y etiquetas personalizadas
description: Crear componentes con script, custom elements, lifecycle, Shadow DOM, templates, slots, atributos y eventos personalizados.
category: languages
stack: javascript
order: 29
tags: [javascript, web-components, custom-elements, shadow-dom, components]
scope: plataforma web
website: https://developer.mozilla.org/es/docs/Web/API/Web_components
related:
  - guides/javascript-dom-events
  - guides/javascript-events
  - guides/html-web-components-metadata
updatedAt: 2026-08-25
---

## Para recordar

Un Web Component combina un custom element, ciclo de vida y, opcionalmente, Shadow DOM. El nombre debe contener un guion. El constructor prepara estado interno; el trabajo dependiente del documento suele comenzar en `connectedCallback`; `disconnectedCallback` libera listeners y recursos.

## Qué resuelve un Web Component

Un Web Component permite crear una etiqueta reutilizable con APIs nativas del navegador. No requiere React, Vue ni otro framework. Sus tres piezas principales son:

| Pieza | Responsabilidad |
| --- | --- |
| Custom Elements | registrar una etiqueta y su clase |
| Shadow DOM | encapsular estructura y estilos internos |
| `<template>` y `<slot>` | reutilizar estructura y recibir contenido |

Una etiqueta personalizada autónoma debe incluir un guion: `<nueva-etiqueta>` es válida; `<nuevaetiqueta>` no lo es. El guion evita colisiones con etiquetas que HTML pueda incorporar en el futuro.

## Componente mínimo creado con un script

```html
<nueva-etiqueta nombre="Ángel"></nueva-etiqueta>

<script type="module" src="/components/nueva-etiqueta.js"></script>
```

```js
// /components/nueva-etiqueta.js
class NuevaEtiqueta extends HTMLElement {
  connectedCallback() {
    const name = this.getAttribute('nombre') ?? 'Visitante'
    this.textContent = `Hola, ${name}`
  }
}

if (!customElements.get('nueva-etiqueta')) {
  customElements.define('nueva-etiqueta', NuevaEtiqueta)
}
```

Después de registrar la clase:

```js
const component = document.querySelector('nueva-etiqueta')

component instanceof NuevaEtiqueta // true
component.textContent               // 'Hola, Ángel'
customElements.get('nueva-etiqueta') === NuevaEtiqueta // true
```

`customElements.define()` devuelve `undefined` y lanza si el nombre o constructor ya fue registrado. La comprobación con `get` ayuda durante hot reload, pruebas o scripts que podrían evaluarse más de una vez.

## Constructor y ciclo de vida

| Callback | Cuándo se ejecuta | Uso adecuado |
| --- | --- | --- |
| `constructor()` | al crear o actualizar el elemento | estado interno, `super()`, shadow root |
| `connectedCallback()` | cada vez que entra al documento | render, listeners y recursos |
| `disconnectedCallback()` | cada vez que sale | cancelar listeners, timers y requests |
| `attributeChangedCallback()` | cambia un atributo observado | sincronizar atributo con UI |
| `adoptedCallback()` | se mueve a otro documento | casos avanzados |
| `connectedMoveCallback()` | movimiento preservando estado en APIs compatibles | evitar desmontaje al reordenar |

El constructor debe llamar primero a `super()`. La inicialización que depende de atributos, hijos o conexión al documento pertenece normalmente a `connectedCallback()`.

```js
class UserBadge extends HTMLElement {
  static observedAttributes = ['name', 'status']

  #controller

  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
  }

  connectedCallback() {
    this.#controller?.abort()
    this.#controller = new AbortController()

    this.render()
    this.shadowRoot.addEventListener('click', this.handleClick, {
      signal: this.#controller.signal,
    })
  }

  disconnectedCallback() {
    this.#controller?.abort()
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue && this.isConnected) this.render()
  }

  handleClick = () => {
    this.dispatchEvent(new CustomEvent('badge:open', {
      detail: { name: this.getAttribute('name') },
      bubbles: true,
      composed: true,
    }))
  }

  render() {
    const name = this.getAttribute('name') ?? 'Sin nombre'
    const status = this.getAttribute('status') ?? 'offline'

    this.shadowRoot.innerHTML = `
      <style>
        button { font: inherit; }
        .online { color: green; }
      </style>
      <button type="button">
        <span data-name></span>
        <span class="${status === 'online' ? 'online' : ''}"></span>
      </button>
    `

    this.shadowRoot.querySelector('[data-name]').textContent = name
  }
}

customElements.define('user-badge', UserBadge)
```

La plantilla de `innerHTML` anterior solo contiene texto estático y una clase controlada; el nombre externo se asigna con `textContent` para no interpretarlo como HTML.

## Atributos, propiedades y estado

Los atributos son strings y forman parte del HTML. Las propiedades pueden conservar números, objetos o funciones. Define una regla clara de reflexión cuando ambos representen el mismo estado.

```js
class ProgressRing extends HTMLElement {
  static observedAttributes = ['value']

  get value() {
    return Number(this.getAttribute('value') ?? 0)
  }

  set value(nextValue) {
    const safeValue = Math.min(Math.max(Number(nextValue), 0), 100)
    this.setAttribute('value', String(safeValue))
  }
}

const ring = document.querySelector('progress-ring')
ring.value = 120

ring.value                 // 100
ring.getAttribute('value') // '100'
```

Evita reflejar objetos grandes en atributos mediante JSON. Exponlos como propiedades y documenta si el componente conserva o copia la referencia.

## Shadow DOM

Un shadow root crea una frontera de DOM y estilos. `mode: 'open'` permite leer `element.shadowRoot`; con `closed`, esa propiedad devuelve `null`, pero no convierte el contenido en un límite de seguridad.

```js
const root = this.attachShadow({ mode: 'open' })

root instanceof ShadowRoot // true
this.shadowRoot === root   // true
root.host === this         // true
```

Los selectores externos normales no entran en el shadow tree. Para permitir personalización controlada usa:

- propiedades CSS personalizadas, como `--badge-color`;
- `::part(name)` para elementos marcados con `part`;
- `:host` y `:host([variant="danger"])` dentro del componente;
- slots para contenido proporcionado por el consumidor.

```css
/* Dentro del shadow root */
:host {
  display: inline-block;
  color: var(--badge-color, currentColor);
}

[part="icon"] {
  flex: none;
}
```

```css
/* En la página consumidora */
user-badge {
  --badge-color: rebeccapurple;
}

user-badge::part(icon) {
  inline-size: 1.25rem;
}
```

## Templates y slots

```html
<template id="alert-template">
  <style>
    :host { display: block; }
    .alert { border-inline-start: 4px solid currentColor; padding: 1rem; }
  </style>
  <section class="alert" part="container">
    <strong><slot name="title">Aviso</slot></strong>
    <div><slot></slot></div>
  </section>
</template>

<app-alert>
  <span slot="title">Sin conexión</span>
  Los cambios se guardarán cuando vuelva la red.
</app-alert>
```

```js
class AppAlert extends HTMLElement {
  constructor() {
    super()
    const template = document.querySelector('#alert-template')
    const root = this.attachShadow({ mode: 'open' })
    root.append(template.content.cloneNode(true))
  }
}

customElements.define('app-alert', AppAlert)
```

El contenido asignado a un slot permanece en el light DOM; el slot controla dónde se presenta. `slotchange` avisa cuando cambia el conjunto de nodos asignados.

```js
const slot = component.shadowRoot.querySelector('slot')

slot.addEventListener('slotchange', () => {
  slot.assignedElements({ flatten: true })
  // array de elementos asignados
})
```

## Eventos públicos del componente

Un componente debe emitir eventos que describan intención o resultado, no detalles internos como “se hizo clic en el tercer span”.

```js
this.dispatchEvent(new CustomEvent('quantity:change', {
  detail: { value: 3 },
  bubbles: true,
  composed: true,
}))
```

```js
counter.addEventListener('quantity:change', event => {
  event.detail.value // 3
})
```

`composed: true` permite cruzar el Shadow DOM; `bubbles: true` permite delegación en ancestros.

## Componente asociado a formularios

Para un control personalizado avanzado, `static formAssociated = true` y `attachInternals()` permiten participar en formularios, validación y accesibilidad. No reemplaces un `<input>` nativo si solo necesitas cambiar su apariencia.

```js
class RatingInput extends HTMLElement {
  static formAssociated = true

  #internals = this.attachInternals()
  #value = '0'

  set value(nextValue) {
    this.#value = String(nextValue)
    this.#internals.setFormValue(this.#value)
  }

  get value() {
    return this.#value
  }
}

customElements.define('rating-input', RatingInput)
```

Revisa compatibilidad y prueba con teclado y tecnologías de asistencia antes de crear controles de formulario personalizados.

## Estado antes de la definición

El navegador puede encontrar `<nueva-etiqueta>` antes de cargar su clase. Al ejecutar `define`, actualiza esas instancias existentes.

```js
customElements.whenDefined('nueva-etiqueta').then(() => {
  console.log('Componente disponible')
})
```

```css
nueva-etiqueta:not(:defined) {
  visibility: hidden;
}
```

Ocultar contenido indefinido puede causar espacios vacíos o retrasar información. Cuando sea posible, incluye HTML útil como contenido inicial y mejora progresivamente.

## Errores frecuentes

- Registrar una etiqueta sin guion.
- Añadir listeners en cada `connectedCallback` sin retirarlos.
- Sobrescribir contenido proporcionado por el consumidor inesperadamente.
- Creer que Shadow DOM reemplaza sanitización o seguridad.
- Usar `innerHTML` con atributos no confiables.
- Crear un botón personalizado que pierde teclado, foco y nombre accesible.
- Emitir eventos que no cruzan el shadow root cuando forman parte de la API pública.
- Depender de un orden de carga sin `type="module"`, `defer` o `whenDefined()`.
