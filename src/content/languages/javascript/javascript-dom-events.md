---
title: DOM y manipulación de documentos
description: Árbol DOM, selección, recorrido, creación, atributos, contenido, formularios, foco y rendimiento con resultados visibles.
type: guides
order: 22
tags: [javascript, dom, document, elements, forms]
scope: navegador
website: https://developer.mozilla.org/es/docs/Web/API/Document_Object_Model
related:
  - languages/javascript/javascript-events
  - languages/javascript/javascript-web-components
  - accessibility/a11y-interaccion/accessibility-semantics-keyboard-focus
  - general/utils/dom
updatedAt: 2026-08-25
---

## Para recordar

El DOM es una API del navegador que representa el documento como nodos. `querySelector` devuelve un elemento o `null`; `querySelectorAll` devuelve una NodeList estática. Prefiere `textContent` para texto no confiable, propiedades para estado actual y `DocumentFragment` o `<template>` para construir estructuras antes de insertarlas.

## Modelo mental del DOM

El navegador convierte el HTML en un árbol de objetos llamado **Document Object Model**. `document` es la entrada al documento; `Node` es la base del árbol; `Element` representa etiquetas; y clases como `HTMLElement`, `HTMLInputElement` o `HTMLVideoElement` añaden capacidades específicas.

```js
document instanceof Document          // true
document.body instanceof HTMLElement // true
document.body.nodeType                // 1: ELEMENT_NODE
document.nodeType                     // 9: DOCUMENT_NODE
```

| Tipo | Puede representar | Ejemplo |
| --- | --- | --- |
| `Node` | elemento, texto, comentario o documento | `element.childNodes[0]` |
| `Element` | una etiqueta con atributos | `<article>` |
| `HTMLElement` | elemento HTML con propiedades comunes | `hidden`, `dataset`, `style` |
| elemento especializado | comportamiento propio de una etiqueta | `input.value`, `video.play()` |
| `DocumentFragment` | árbol temporal que no se muestra por sí mismo | inserción por lotes |

El DOM es una representación viva. Cambiar un objeto conectado modifica la página; eliminarlo o moverlo cambia su posición real, no crea una copia.

## Cuándo está disponible el DOM

Un script clásico sin `defer` puede ejecutarse antes de que el parser haya creado los elementos posteriores. Los scripts con `defer` y los módulos se ejecutan después del parseo del HTML, antes de `DOMContentLoaded`.

```html
<script type="module" src="/app.js"></script>
```

```js
document.readyState // 'loading', 'interactive' o 'complete'

function start() {
  const app = document.querySelector('#app')
  if (app) app.textContent = 'Aplicación lista'
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', start, { once: true })
} else {
  start()
}
```

En un módulo colocado normalmente en el documento rara vez necesitas este patrón; es útil en scripts que pueden cargarse de varias formas.

## Seleccionar elementos

| API | Devuelve | Colección viva | Caso de uso |
| --- | --- | --- | --- |
| `getElementById(id)` | `Element` o `null` | no aplica | id conocido |
| `querySelector(selector)` | primer `Element` o `null` | no aplica | selector CSS flexible |
| `querySelectorAll(selector)` | `NodeList` | no, es una foto estática | varias coincidencias |
| `getElementsByClassName(name)` | `HTMLCollection` | **sí** | integración con código antiguo |
| `getElementsByTagName(name)` | `HTMLCollection` | **sí** | colección viva por etiqueta |

```js
const main = document.getElementById('main')
const firstCard = document.querySelector('[data-card]')
const cards = document.querySelectorAll('[data-card]')

main      // HTMLElement o null
firstCard // Element o null
cards     // NodeList; cards.length puede ser 0
;[...cards] // Array de elementos
```

Prefiere seleccionar desde el contenedor más cercano para reducir alcance y acoplamiento:

```js
const panel = document.querySelector('[data-panel]')
const panelButtons = panel?.querySelectorAll('button') ?? []

panelButtons.length // cantidad de botones dentro de ese panel
```

`querySelector` lanza `SyntaxError` si recibe un selector inválido. Escapa identificadores externos con `CSS.escape()` antes de usarlos como parte de un selector.

```js
const unsafeId = 'item:42'
document.querySelector(`#${CSS.escape(unsafeId)}`)
// encuentra id="item:42" sin romper el selector
```

## Recorrer y comprobar relaciones

| Propiedad o método | Devuelve | Incluye texto/comentarios |
| --- | --- | --- |
| `parentElement` | elemento padre o `null` | no aplica |
| `children` | `HTMLCollection` viva | no |
| `childNodes` | `NodeList` viva | **sí** |
| `firstElementChild` / `lastElementChild` | elemento o `null` | no |
| `nextElementSibling` / `previousElementSibling` | elemento o `null` | no |
| `closest(selector)` | ancestro más cercano, incluido el propio elemento | no |
| `matches(selector)` | booleano | no |
| `contains(node)` | booleano | sí |

```js
const button = document.querySelector('[data-save]')
const form = button?.closest('form')

button?.matches('button[data-save]') // true si coincide
form?.contains(button)               // true
form?.children.length                // cantidad de elementos hijos directos
```

Usa las propiedades terminadas en `Element` cuando solo te interesan etiquetas. Los saltos de línea del HTML también pueden convertirse en nodos de texto dentro de `childNodes`.

## Crear, copiar e insertar

| API | Devuelve | ¿Muta el documento? | Nota |
| --- | --- | --- | --- |
| `createElement(tag)` | elemento desconectado | no | crea una etiqueta |
| `createTextNode(text)` | nodo de texto | no | texto explícito |
| `cloneNode(deep)` | nodo nuevo | no | no copia listeners agregados con JS |
| `append(...nodes)` / `prepend(...)` | `undefined` | **sí** | acepta nodos y strings |
| `appendChild(node)` | el nodo insertado | **sí** | acepta un solo Node |
| `before(...)` / `after(...)` | `undefined` | **sí** | inserta como hermano |
| `replaceChildren(...)` | `undefined` | **sí** | reemplaza todos los hijos |
| `replaceWith(...)` | `undefined` | **sí** | reemplaza el nodo |
| `remove()` | `undefined` | **sí** | desconecta el nodo |

```js
const item = document.createElement('li')
item.className = 'result'
item.textContent = 'JavaScript'

const inserted = list.appendChild(item)

inserted === item // true
list.lastElementChild === item // true

const copy = item.cloneNode(true)
copy === item      // false
copy.textContent   // 'JavaScript'
```

Insertar un nodo que ya está conectado lo **mueve**; no queda en los dos lugares.

```js
secondList.append(item)

secondList.contains(item) // true
list.contains(item)       // false
```

### `DocumentFragment` y `<template>`

Un fragmento permite preparar varios nodos fuera del documento. Al insertarlo, sus hijos se mueven al destino y el fragmento queda vacío.

```js
const fragment = document.createDocumentFragment()

for (const product of products) {
  const item = document.createElement('li')
  item.textContent = product.name
  fragment.append(item)
}

list.replaceChildren(fragment)
fragment.childNodes.length // 0
list.children.length       // products.length
```

`<template>` conserva HTML inerte y reutilizable. Sus hijos viven en `template.content`.

```html
<template id="product-template">
  <article class="product">
    <h2 data-name></h2>
  </article>
</template>
```

```js
const template = document.querySelector('#product-template')
const clone = template.content.cloneNode(true)

clone.querySelector('[data-name]').textContent = 'Teclado'
container.append(clone)
```

## Texto, HTML y seguridad

| API | Interpreta HTML | Considera estilos visuales | Uso adecuado |
| --- | --- | --- | --- |
| `textContent` | no | no | leer o escribir texto de forma segura |
| `innerText` | no | **sí** | texto visible; puede forzar cálculo de layout |
| `innerHTML` | **sí** | no | plantilla completamente controlada |
| `insertAdjacentHTML(position, html)` | **sí** | no | insertar HTML controlado sin reemplazar todo |
| `insertAdjacentText(position, text)` | no | no | insertar texto junto al elemento |

```js
const untrusted = '<img src=x onerror=alert(1)>'

output.textContent = untrusted
// se muestra literalmente; no crea una imagen
```

No pases datos externos a `innerHTML` ni a `insertAdjacentHTML` sin una sanitización diseñada para HTML. Escapar una URL o usar `JSON.stringify` no evita XSS en un contexto HTML.

## Atributos, propiedades, clases y `dataset`

Los atributos pertenecen al HTML serializado; las propiedades representan el estado actual del objeto. Algunas se reflejan entre sí, pero no siempre tienen el mismo tipo o comportamiento.

| API | Devuelve | ¿Muta? |
| --- | --- | --- |
| `getAttribute(name)` | string o `null` | no |
| `hasAttribute(name)` | booleano | no |
| `setAttribute(name, value)` | `undefined` | **sí** |
| `toggleAttribute(name, force?)` | booleano final | **sí** |
| `removeAttribute(name)` | `undefined` | **sí** |
| `classList.add/remove(...)` | `undefined` | **sí** |
| `classList.toggle(name, force?)` | booleano final | **sí** |
| `classList.contains(name)` | booleano | no |

```js
button.disabled = true

button.disabled                 // true: propiedad booleana
button.hasAttribute('disabled') // true
button.getAttribute('disabled') // normalmente ''

panel.classList.toggle('is-open', true) // true
panel.dataset.projectId = '42'
panel.dataset.projectId                 // '42'
panel.getAttribute('data-project-id')   // '42'
```

Todo valor de `dataset` es texto. No guardes secretos, objetos grandes ni estado que deba ser privado.

## Estilos y medidas

`element.style` representa estilos inline. `getComputedStyle` devuelve valores calculados. Para estados visuales, cambiar una clase suele separar mejor comportamiento y presentación.

```js
panel.style.setProperty('--progress', '60%')
panel.style.getPropertyValue('--progress') // '60%'

const styles = getComputedStyle(panel)
styles.display // por ejemplo: 'block'
```

| Medida | Incluye | Caso de uso |
| --- | --- | --- |
| `getBoundingClientRect()` | posición y tamaño respecto al viewport | overlays y geometría visible |
| `clientWidth/Height` | contenido + padding | espacio interior visible |
| `offsetWidth/Height` | padding + borde + scrollbar | tamaño de la caja |
| `scrollWidth/Height` | contenido total, incluso oculto por scroll | detectar overflow |
| `scrollTop/Left` | desplazamiento actual | leer o cambiar scroll |

```js
const rect = panel.getBoundingClientRect()

rect.width  // ancho en píxeles CSS
rect.top    // distancia al borde superior del viewport
panel.scrollHeight > panel.clientHeight // true si hay overflow vertical
```

Agrupa primero lecturas y después escrituras. Alternar medidas con cambios de estilo puede forzar layout repetidamente.

## Formularios y controles

```js
const form = document.querySelector('form')
const email = form.elements.namedItem('email')

email instanceof HTMLInputElement // true, si es un input
email.value                        // valor actual como string
email.validity.valid               // resultado de restricciones HTML
form.checkValidity()               // booleano
```

| API | Devuelve | Efecto |
| --- | --- | --- |
| `new FormData(form)` | pares de controles con `name` | no modifica el formulario |
| `checkValidity()` | booleano | dispara `invalid` en controles inválidos |
| `reportValidity()` | booleano | además muestra mensajes nativos |
| `setCustomValidity(message)` | `undefined` | define o limpia error personalizado |
| `requestSubmit(button?)` | `undefined` | valida y dispara `submit` |
| `submit()` | `undefined` | envía sin validación ni evento `submit`; suele evitarse |
| `reset()` | `undefined` | vuelve a valores iniciales |

```js
const data = new FormData(form)

data.get('email')       // string, File o null
data.getAll('interest') // todos los valores repetidos
Object.fromEntries(data) // objeto simple; pierde claves repetidas
```

La validación del navegador mejora la experiencia, pero el servidor siempre debe validar de nuevo.

## Foco, scroll y visibilidad

```js
dialogButton.focus({ preventScroll: true })
document.activeElement === dialogButton // true

section.scrollIntoView({
  behavior: 'smooth',
  block: 'start',
})
```

No muevas el foco por cada actualización. Hazlo cuando ayude a conservar el contexto: abrir un diálogo, mostrar un error relevante o devolver el foco al control que cerró una interfaz.

## Caso de uso: renderizar sin `innerHTML`

```js
function renderProducts(container, products) {
  const fragment = document.createDocumentFragment()

  for (const product of products) {
    const article = document.createElement('article')
    const title = document.createElement('h2')
    const price = document.createElement('p')

    title.textContent = product.name
    price.textContent = product.price.toLocaleString('es-CO', {
      style: 'currency',
      currency: 'COP',
    })

    article.dataset.productId = String(product.id)
    article.append(title, price)
    fragment.append(article)
  }

  container.replaceChildren(fragment)
}

renderProducts(document.querySelector('#products'), [
  { id: 1, name: 'Teclado', price: 120000 },
])
// #products queda con un article, un h2 y un párrafo
```

Este enfoque trata el nombre como texto, conserva una estructura semántica y realiza una sustitución principal del contenido.
