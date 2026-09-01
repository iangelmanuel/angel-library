---
title: Constructores nativos y patrón new
description: Cuándo usar new, qué constructores existen en el lenguaje y el navegador, qué devuelven y cuáles no deben instanciarse.
type: guides
order: 28
tags: [javascript, constructors, new, web-api, reference]
scope: mapa de referencia
related:
  - languages/javascript/javascript-built-ins
  - languages/javascript/javascript-prototypes-classes
  - languages/javascript/javascript-binary-data
  - languages/javascript/javascript-url-web-apis
  - languages/javascript/javascript-dom-events
  - languages/javascript/javascript-media-devices
updatedAt: 2026-08-25
---

## Para recordar

`new` crea una instancia y conecta su prototype. No toda función es construible: `Symbol`, `BigInt`, `Math` y `JSON` no admiten `new`. Antes de usar un constructor del navegador, comprueba soporte, contexto seguro, permisos y método de limpieza.

## Qué hace `new`

`new Constructor(arguments)` crea un objeto, conecta su prototipo, ejecuta el constructor con ese objeto como `this` y devuelve el objeto resultante, salvo que el constructor retorne explícitamente otro objeto.

```js
function User(name) {
  this.name = name
}

User.prototype.greet = function () {
  return `Hola, ${this.name}`
}

const user = new User('Ana')

user.name            // 'Ana'
user.greet()         // 'Hola, Ana'
user instanceof User // true
```

Las clases exigen `new`; muchas funciones incorporadas se comportan de manera distinta con y sin `new`; otras no se pueden instanciar.

## Qué no conviene construir con `new`

| Expresión | Resultado | Recomendación |
| --- | --- | --- |
| `String(42)` | string primitivo `'42'` | sí, para conversión |
| `new String(42)` | objeto wrapper | evitar |
| `Number('4')` | number primitivo `4` | sí, para conversión |
| `new Number(4)` | objeto wrapper truthy | evitar |
| `Boolean(0)` | boolean primitivo `false` | sí, para conversión explícita |
| `new Boolean(false)` | objeto truthy | evitar |
| `Symbol('id')` | symbol | correcto; `new Symbol()` falla |
| `BigInt('42')` | bigint | correcto; `new BigInt()` falla |

```js
Boolean(false)             // false
Boolean(new Boolean(false)) // true: es un objeto

typeof String('a')     // 'string'
typeof new String('a') // 'object'
```

## Constructores del lenguaje

### `new Date(value?)`

Crea una fecha mutable que representa un instante. Sin argumentos usa el momento actual.

```js
const date = new Date('2026-08-18T00:00:00Z')

date instanceof Date // true
date.toISOString()   // '2026-08-18T00:00:00.000Z'
```

### `new RegExp(pattern, flags?)`

Úsalo cuando el patrón o sus banderas se construyen dinámicamente. Para un patrón fijo, `/pattern/gi` suele ser más legible.

```js
const term = 'javascript'
const expression = new RegExp(term, 'i')

expression.test('JavaScript moderno') // true
```

Escapa texto externo con `RegExp.escape` antes de convertirlo en parte de una expresión regular si debe tratarse literalmente. Comprueba compatibilidad en runtimes anteriores a ECMAScript 2025.

### `new Map(entries?)` y `new Set(values?)`

```js
const map = new Map([['theme', 'dark']])
const set = new Set(['js', 'js', 'css'])

map.get('theme') // 'dark'
;[...set]        // ['js', 'css']
```

### `new WeakMap()` y `new WeakSet()`

Asocian datos débilmente a objetos. No se pueden recorrer ni exponen `size`.

```js
const privateData = new WeakMap()
const element = document.querySelector('button')

privateData.set(element, { clicks: 0 })
privateData.get(element) // { clicks: 0 }
```

### `new Error()` y subclases

```js
const error = new TypeError('Se esperaba un número')

error.name              // 'TypeError'
error.message           // 'Se esperaba un número'
error instanceof Error  // true
```

También existen `RangeError`, `SyntaxError`, `ReferenceError`, `URIError` y `AggregateError`. Usa una clase propia cuando consumidores necesiten distinguir una causa por algo más estable que el mensaje.

### `new Promise(executor)`

Envuelve una API callback o una operación que resolverás más tarde. No envuelvas una Promise que ya existe.

```js
const delay = milliseconds => new Promise(resolve => {
  setTimeout(resolve, milliseconds)
})

await delay(100)
// continúa después de al menos 100 ms
```

## Constructores de URL y red

### `new URL(input, base?)`

```js
const url = new URL('../api?q=js', 'https://example.com/docs/')

url.href // 'https://example.com/api?q=js'
```

### `new URLSearchParams(init?)`

```js
const params = new URLSearchParams({ page: '2', q: 'web api' })

params.toString() // 'page=2&q=web+api'
```

### `new Headers(init?)`

```js
const headers = new Headers({ Accept: 'application/json' })

headers.get('accept') // 'application/json'
```

### `new Request(input, init?)`

```js
const request = new Request('/api/projects', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'Biblioteca' }),
})

request.method   // 'POST'
request.bodyUsed // false
```

### `new Response(body?, init?)`

```js
const response = new Response('Creado', { status: 201 })

response.status // 201
await response.text() // 'Creado'
```

### `new WebSocket(url, protocols?)`

Abre comunicación bidireccional persistente. Valida mensajes, implementa reconexión con límites y cierra la conexión al desmontar.

```js
const socket = new WebSocket('wss://example.com/live')

socket.readyState // 0: CONNECTING inicialmente
socket.addEventListener('open', () => socket.send('hola'))
socket.close(1000, 'Vista cerrada')
```

### `new EventSource(url, options?)`

Recibe Server-Sent Events sobre HTTP. Es unidireccional servidor → cliente y reconecta automáticamente.

```js
const source = new EventSource('/api/events')

source.addEventListener('message', event => {
  console.log(event.data)
})

source.close()
```

## Constructores de datos y archivos

### `new FormData(form?, submitter?)`

```js
const data = new FormData(form)

data.get('email') // string, File o null
```

### `new Blob(parts?, options?)` y `new File(parts, name, options?)`

```js
const blob = new Blob(['Hola'], { type: 'text/plain' })
const file = new File([blob], 'saludo.txt', { type: blob.type })

blob.size // 4
file.name // 'saludo.txt'
```

### `new ArrayBuffer(length)`

Reserva bytes sin tipo. Se manipula mediante una vista.

```js
const buffer = new ArrayBuffer(4)
const bytes = new Uint8Array(buffer)
bytes.set([10, 20, 30, 40])

;[...bytes]      // [10, 20, 30, 40]
buffer.byteLength // 4
```

### Typed arrays y `new DataView(buffer)`

`Uint8Array`, `Int16Array`, `Float32Array` y sus variantes interpretan un buffer con un tipo. `DataView` permite controlar offset y endianness.

```js
const buffer = new ArrayBuffer(4)
const view = new DataView(buffer)

view.setUint16(0, 500, false)
view.getUint16(0, false) // 500
```

### `new TextEncoder()` y `new TextDecoder()`

```js
const bytes = new TextEncoder().encode('ABC')
const text = new TextDecoder().decode(bytes)

bytes // Uint8Array(3) [65, 66, 67]
text  // 'ABC'
```

## Constructores de DOM y eventos

### `new DOMParser()` y `new XMLSerializer()`

```js
const parser = new DOMParser()
const xml = parser.parseFromString('<item>JS</item>', 'application/xml')

xml.querySelector('item').textContent // 'JS'
new XMLSerializer().serializeToString(xml)
// '<item>JS</item>' o una serialización XML equivalente
```

Analizar HTML no lo sanitiza.

### `new Event()` y `new CustomEvent()`

```js
const change = new Event('change', { bubbles: true })
const update = new CustomEvent('profile:update', {
  detail: { id: 7 },
  bubbles: true,
})

input.dispatchEvent(change) // true si no se canceló
update.detail               // { id: 7 }
```

### `new AbortController()`

```js
const controller = new AbortController()

controller.signal.aborted // false
controller.abort('cerrado')
controller.signal.aborted // true
controller.signal.reason  // 'cerrado'
```

## Constructores de observación

Cada observer recibe un callback y comienza a trabajar después de llamar `observe`.

### `new IntersectionObserver(callback, options?)`

```js
const observer = new IntersectionObserver(entries => {
  for (const entry of entries) {
    entry.isIntersecting // booleano
  }
}, { threshold: 0.5 })

observer.observe(card)
observer.unobserve(card)
observer.disconnect()
```

### `new ResizeObserver(callback)`

```js
const observer = new ResizeObserver(entries => {
  const width = entries[0].contentRect.width
  console.log(width)
})

observer.observe(panel)
```

### `new MutationObserver(callback)`

```js
const observer = new MutationObserver(records => {
  records.length // cantidad de cambios agrupados
})

observer.observe(list, { childList: true, subtree: true })
observer.disconnect()
```

### `new PerformanceObserver(callback)`

```js
const observer = new PerformanceObserver(list => {
  const entries = list.getEntries()
  entries // métricas recibidas
})

observer.observe({ type: 'longtask', buffered: true })
```

Comprueba tipos soportados antes de observar métricas opcionales.

## Constructores de comunicación y trabajo

### `new BroadcastChannel(name)`

Comunica contextos del mismo origen, como pestañas y workers.

```js
const channel = new BroadcastChannel('settings')

channel.postMessage({ theme: 'dark' })
channel.close()
```

### `new MessageChannel()`

```js
const channel = new MessageChannel()

channel.port1.onmessage = event => console.log(event.data)
channel.port2.postMessage('hola')
// port1 recibe 'hola'
```

### `new Worker(url, options?)`

Ejecuta JavaScript fuera del hilo principal. No tiene acceso directo al DOM.

```js
const worker = new Worker(
  new URL('./processor.worker.js', import.meta.url),
  { type: 'module' },
)

worker.postMessage({ values: [1, 2, 3] })
worker.terminate()
```

## Constructores de medios y plataforma

Estos constructores tienen documentos dedicados porque requieren permisos, eventos, limpieza o compatibilidad específica:

| Constructor o entrada | Documento |
| --- | --- |
| `new Audio()` y `new AudioContext()` | Audio, análisis y grabación |
| `new MediaRecorder(stream)` | Audio, análisis y grabación |
| `navigator.mediaDevices` | Cámara, micrófono y dispositivos |
| `new Notification()` | Permisos y notificaciones |
| `new SpeechSynthesisUtterance()` | Audio, análisis y grabación |
| `new HTMLElement` mediante una subclase | Web Components |

No existe un catálogo cerrado para siempre: cada runtime puede añadir APIs. Antes de usar un constructor, confirma si pertenece al lenguaje o al host, su compatibilidad, si requiere HTTPS y cómo libera sus recursos.
