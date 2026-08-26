---
title: Eventos del DOM y EventTarget
description: Tipos de eventos, propagación, delegación, teclado, pointer, formularios, eventos personalizados y limpieza de listeners.
category: languages
stack: javascript
order: 23
tags: [javascript, events, eventtarget, bubbling, delegation]
scope: navegador
website: https://developer.mozilla.org/es/docs/Web/API/EventTarget
related:
  - guides/javascript-dom-events
  - guides/javascript-runtime-event-loop
  - guides/accessibility-semantics-keyboard-focus
updatedAt: 2026-08-25
---

## Para recordar

Un evento viaja por captura, target y burbujeo. `preventDefault()` cancela la acción nativa si el evento lo permite; `stopPropagation()` detiene el recorrido y no son equivalentes. La delegación escucha en un ancestro y resuelve el objetivo con `closest`. Usa `AbortSignal` para retirar listeners como parte del ciclo de vida.

## Modelo mental

Un evento comunica que algo ocurrió: una interacción, un cambio de estado, una respuesta del navegador o una señal creada por la aplicación. Los objetos capaces de emitir eventos implementan `EventTarget`, como `window`, `document`, elementos, `AbortSignal`, `MediaQueryList`, workers y conexiones de red.

```js
button instanceof EventTarget // true

function handleClick(event) {
  event.type          // 'click'
  event.target        // nodo donde se originó
  event.currentTarget // button mientras corre este listener
}

button.addEventListener('click', handleClick)    // undefined
button.removeEventListener('click', handleClick) // undefined
```

## Formas de escuchar

| Forma | Cantidad de handlers | Recomendación |
| --- | ---: | --- |
| `addEventListener()` | varios por tipo | opción habitual |
| propiedad `onclick` | uno | integración simple o legado |
| atributo `onclick="..."` | uno y código mezclado con HTML | evitar |

Para retirar un listener manualmente necesitas la misma función y el mismo valor de `capture`.

```js
const handle = event => console.log(event.type)

button.addEventListener('click', handle)
button.removeEventListener('click', handle) // sí lo elimina

button.addEventListener('click', () => console.log('otro'))
button.removeEventListener('click', () => console.log('otro'))
// no lo elimina: es una función distinta
```

## Opciones de `addEventListener`

| Opción | Efecto | Caso de uso |
| --- | --- | --- |
| `capture: true` | escucha al bajar hacia el target | infraestructura o interceptación temprana |
| `once: true` | se elimina después de ejecutarse | inicialización única |
| `passive: true` | promete no cancelar la acción | eventos de scroll/touch observados |
| `signal` | se elimina cuando la señal se aborta | ciclo de vida de componentes |

```js
const controller = new AbortController()

window.addEventListener('resize', updateLayout, {
  passive: true,
  signal: controller.signal,
})

controller.abort()
controller.signal.aborted // true; el listener fue retirado
```

## Propagación: captura, target y burbujeo

Un evento propagable recorre tres momentos:

1. **Captura:** baja desde `window` y `document` hacia el elemento objetivo.
2. **Target:** llega al elemento donde se originó.
3. **Burbujeo:** vuelve desde el target hacia sus ancestros.

Los listeners normales escuchan durante el burbujeo. No todos los eventos burbujean: `focus` y `blur`, por ejemplo, tienen las alternativas `focusin` y `focusout`.

```html
<div id="card">
  <button id="save">Guardar</button>
</div>
```

```js
const log = []

card.addEventListener('click', () => log.push('card capture'), {
  capture: true,
})
save.addEventListener('click', () => log.push('button'))
card.addEventListener('click', () => log.push('card bubble'))

save.click()

log
// ['card capture', 'button', 'card bubble']
```

| Propiedad | Significado |
| --- | --- |
| `target` | objeto donde comenzó el evento |
| `currentTarget` | objeto cuyo listener se está ejecutando |
| `eventPhase` | captura, target o burbujeo |
| `bubbles` | si puede subir por ancestros |
| `cancelable` | si `preventDefault` puede cancelar la acción |
| `defaultPrevented` | si la acción ya fue cancelada |
| `composed` | si puede cruzar un límite de Shadow DOM |
| `composedPath()` | ruta real de propagación permitida |

## Acción predeterminada y propagación

`preventDefault()` cancela una acción nativa —seguir un enlace, enviar un formulario— si `cancelable` es `true`. No detiene la propagación.

`stopPropagation()` impide continuar hacia otros elementos. `stopImmediatePropagation()` también evita los listeners restantes del mismo elemento. Úsalos solo cuando el componente realmente deba aislar el evento; pueden romper delegación, analítica y accesibilidad.

```js
link.addEventListener('click', event => {
  if (!canNavigate()) {
    event.preventDefault()
  }

  event.defaultPrevented // true si se canceló
})
```

Un listener pasivo no puede cancelar la acción. El navegador puede ignorar `preventDefault()` y mostrar una advertencia.

## Delegación de eventos

La delegación instala un listener en un ancestro y aprovecha el burbujeo. Funciona también para descendientes agregados después.

```js
list.addEventListener('click', event => {
  const target = event.target
  if (!(target instanceof Element)) return

  const button = target.closest('button[data-delete]')
  if (!button || !list.contains(button)) return

  const id = button.dataset.delete
  if (id) deleteItem(id)
})
```

`closest` es importante porque el clic puede originarse en un ícono o texto dentro del botón. La comprobación con `contains` evita aceptar un botón encontrado fuera del contenedor esperado.

## Familias de eventos

| Familia | Eventos comunes | Cuándo usarlos |
| --- | --- | --- |
| activación | `click`, `dblclick`, `contextmenu` | acciones de controles |
| pointer | `pointerdown/up/move/enter/leave/cancel` | mouse, táctil y lápiz con una API |
| teclado | `keydown`, `keyup` | atajos y controles accesibles |
| texto | `beforeinput`, `input`, `change` | edición y cambios de controles |
| composición | `compositionstart/update/end` | IME, dictado y texto compuesto |
| foco | `focus`, `blur`, `focusin`, `focusout` | entrada o salida de una zona |
| formularios | `submit`, `reset`, `invalid`, `formdata` | validación y envío |
| drag and drop | `dragstart`, `dragover`, `drop`, `dragend` | arrastre como mejora adicional |
| portapapeles | `copy`, `cut`, `paste` | transformar o validar pegado |
| carga | `DOMContentLoaded`, `load`, `error`, `pageshow`, `pagehide` | ciclo del documento y recursos |
| visibilidad/red | `visibilitychange`, `online`, `offline` | pausar o reintentar con cautela |
| media | `play`, `pause`, `timeupdate`, `ended`, `volumechange` | audio y video |
| CSS | `transitionend`, `animationend`, `animationcancel` | sincronizar tras una animación |

No todos los eventos están disponibles en todos los objetos. Consulta la interfaz del elemento o API que los emite.

## Pointer Events

Pointer Events unifica mouse, toque y lápiz. `pointerType` indica `mouse`, `touch` o `pen`; `pointerId` identifica el contacto; `pressure` representa presión cuando el dispositivo la ofrece.

```js
canvas.addEventListener('pointerdown', event => {
  canvas.setPointerCapture(event.pointerId)

  event.pointerType // 'mouse', 'touch' o 'pen'
  event.button      // 0 para botón principal habitual
  event.clientX     // posición horizontal en viewport
  event.clientY     // posición vertical en viewport
})

canvas.addEventListener('pointerup', event => {
  canvas.releasePointerCapture(event.pointerId)
})
```

La captura mantiene los eventos asociados al elemento aunque el puntero salga mientras arrastra. Conserva también una alternativa de teclado cuando la interacción representa una acción de interfaz.

## Teclado

| Propiedad | Representa | Ejemplo |
| --- | --- | --- |
| `key` | valor interpretado según layout | `'a'`, `'Enter'`, `'Escape'` |
| `code` | posición física de la tecla | `'KeyA'`, `'Space'` |
| `repeat` | pulsación sostenida | `true` o `false` |
| `ctrlKey`, `altKey`, `shiftKey`, `metaKey` | modificadores | booleanos |

```js
document.addEventListener('keydown', event => {
  const commandKey = event.ctrlKey || event.metaKey

  if (commandKey && event.key.toLowerCase() === 'k') {
    event.preventDefault()
    openSearch()
  }

  if (event.key === 'Escape') closeActiveOverlay()
})
```

No recrees con `div` el comportamiento que ya ofrece un `<button>`: el elemento nativo incluye foco, activación por teclado y semántica. Evita interceptar atajos del navegador o del sistema sin una razón clara.

## Entrada de texto, `input` y `change`

`input` se dispara mientras cambia el valor. `change` suele hacerlo al confirmar o perder foco, según el control. `beforeinput` ocurre antes de la edición y puede ser cancelable. Los eventos de composición evitan procesar prematuramente texto escrito con IME.

```js
searchInput.addEventListener('input', event => {
  const input = event.currentTarget
  if (!(input instanceof HTMLInputElement)) return

  input.value // valor actualizado
  updatePreview(input.value)
})

searchInput.addEventListener('compositionstart', () => {
  isComposing = true
})

searchInput.addEventListener('compositionend', event => {
  isComposing = false
  updatePreview(event.currentTarget.value)
})
```

## Formularios

Escucha `submit` en el formulario, no solo `click` en el botón: el envío también puede ocurrir con Enter o desde otros controles.

```js
form.addEventListener('submit', async event => {
  event.preventDefault()

  if (!form.reportValidity()) return

  const submitter = event.submitter
  const data = new FormData(form, submitter)

  submitter // botón que inició el envío o null
  data.get('email') // valor enviado

  await save(data)
})
```

El evento `invalid` no burbujea. Puedes escucharlo en captura desde el formulario si necesitas resumir errores. `formdata` permite añadir campos justo después de construir los datos.

## Foco

`focus` y `blur` no burbujean; `focusin` y `focusout` sí. Para saber si el foco salió de todo un componente, revisa `relatedTarget`.

```js
menu.addEventListener('focusout', event => {
  const next = event.relatedTarget
  const focusStayedInside = next instanceof Node && menu.contains(next)

  if (!focusStayedInside) closeMenu()
})
```

## Eventos personalizados

`CustomEvent` transporta datos en `detail`. Define nombres específicos del dominio y documenta la forma del detalle.

```js
const event = new CustomEvent('cart:item-added', {
  detail: { id: 42, quantity: 1 },
  bubbles: true,
  composed: true,
  cancelable: true,
})

const accepted = cart.dispatchEvent(event)

accepted // true si ningún listener llamó preventDefault(); false si se canceló
event.detail // { id: 42, quantity: 1 }
```

```js
document.addEventListener('cart:item-added', event => {
  updateCartCounter(event.detail.quantity)
})
```

Usa eventos para comunicación desacoplada entre fronteras claras. Para una llamada local directa, una función suele ser más fácil de seguir y tipar.

## Eventos y Shadow DOM

Un evento con `composed: true` puede cruzar el shadow root. Al salir, `target` puede ser redirigido al host para proteger detalles internos. `composedPath()` muestra la ruta visible para ese contexto.

Los eventos nativos de interacción suelen estar compuestos; un `CustomEvent` no lo está a menos que lo configures. Esto importa al construir Web Components reutilizables.

## Eventos del ciclo de la página

| Evento | Momento | Nota |
| --- | --- | --- |
| `DOMContentLoaded` | HTML parseado y scripts diferidos ejecutados | no espera todas las imágenes |
| `load` | documento y recursos dependientes cargados | suele ser demasiado tarde para iniciar la app |
| `pageshow` | página visible, incluso restaurada de bfcache | revisa `event.persisted` |
| `pagehide` | página deja de mostrarse | compatible con bfcache |
| `visibilitychange` | cambia visibilidad de la pestaña | pausar media o telemetría |
| `beforeunload` | intento de abandonar | usar solo con cambios realmente sin guardar |

Evita listeners permanentes de `beforeunload`: molestan al usuario y pueden afectar optimizaciones de navegación.

## Errores frecuentes

- Confundir `target` con `currentTarget` en delegación.
- Usar `preventDefault` sin comprobar si reemplazas correctamente la acción nativa.
- Crear listeners anónimos que luego no pueden retirarse.
- Escuchar `scroll` o `pointermove` y hacer trabajo costoso en cada evento.
- Suponer que un listener `async` hace que `dispatchEvent` espere su Promise.
- Duplicar listeners cada vez que un componente vuelve a conectarse.
- Depender solo de mouse y olvidar teclado, táctil o tecnologías de asistencia.

## Caso de uso: listener con ciclo de vida

```js
function mountSearchDialog(dialog) {
  const controller = new AbortController()
  const { signal } = controller

  dialog.addEventListener('click', event => {
    if (event.target === dialog) dialog.close()
  }, { signal })

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && dialog.open) dialog.close()
  }, { signal })

  return () => controller.abort()
}

const unmount = mountSearchDialog(dialog)
unmount() // elimina todos los listeners vinculados a la señal
```
