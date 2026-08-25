---
title: Código asíncrono, Promises y cancelación
description: Entender callbacks, Promises, async/await, concurrencia, reintentos, errores y AbortController sin crear carreras.
category: general
stack: javascript
order: 19
tags: [javascript, async, promises, await, abort-controller]
scope: asincronía
related:
  - guides/javascript-runtime-event-loop
  - utilities/promise
  - tricks/abort-signal-timeout
updatedAt: 2026-08-25
---

## Para recordar

- `async` garantiza que una función devuelva una Promise.
- `await` pausa esa función hasta que la Promise termina; no bloquea todo el runtime.
- **Secuencia** espera antes de iniciar lo siguiente; **concurrencia** mantiene varias tareas en progreso; **paralelismo** ejecuta trabajo simultáneamente en más de un agente o núcleo.
- Una Promise no incluye cancelación: la operación debe aceptar un mecanismo como `AbortSignal`.
- `fetch` puede cumplir con estado 404 o 500; debes comprobar `response.ok`.

## Qué representa una Promise

Una Promise tiene estado pendiente, cumplida o rechazada. `then` transforma el resultado, `catch` maneja un rechazo y `finally` ejecuta limpieza. `async` hace que una función devuelva Promise; `await` pausa esa función, no bloquea el hilo completo.

| Método | Devuelve | ¿Muta la Promise original? | Caso de uso |
| --- | --- | --- | --- |
| `promise.then(onFulfilled, onRejected?)` | Promise nueva | no | transformar o encadenar |
| `promise.catch(onRejected)` | Promise nueva | no | recuperar o volver a lanzar un error |
| `promise.finally(onFinally)` | Promise nueva | no | liberar recursos sin cambiar el valor |
| `Promise.resolve(value)` | Promise cumplida o normalizada | no | aceptar valor o Promise |
| `Promise.reject(reason)` | Promise rechazada | no | representar un fallo inmediato |

```js
const result = await Promise.resolve(5)
  .then(value => value * 2)
  .then(value => ({ value }))

result // { value: 10 }
```

`then`, `catch` y `finally` no cambian la Promise anterior: forman otra etapa. Si un callback devuelve una Promise, la cadena espera su resultado; si lanza un error, la siguiente etapa de rechazo lo recibe.

```js
const messages = []

const value = await Promise.reject(new Error('Falló'))
  .catch(error => {
    messages.push(error.message)
    return 'recuperado'
  })
  .finally(() => messages.push('limpieza'))

value    // 'recuperado'
messages // ['Falló', 'limpieza']
```

```js
async function loadProfile(id) {
  const response = await fetch(`/api/users/${id}`)
  if (!response.ok) throw new Error(`HTTP ${response.status}`)
  return response.json()
}

loadProfile(7) // Promise pendiente; luego entrega el perfil o rechaza
```

Si una función async falla y nadie espera o captura su Promise, puedes tener un rechazo no manejado. Define el límite de error en cada evento, request o job.

## Secuencia o concurrencia

Si dos tareas son independientes, inícialas juntas y espera ambas:

```js
const userPromise = getUser()
const settingsPromise = getSettings()
const [user, settings] = await Promise.all([userPromise, settingsPromise])

user     // resultado de getUser()
settings // resultado de getSettings()
```

`Promise.all` falla al primer rechazo; `Promise.allSettled` espera todo y devuelve el resultado individual; `Promise.race` devuelve la primera settled; `Promise.any` devuelve la primera fulfilled y rechaza con `AggregateError` si todas fallan.

| Combinador | Cuándo se resuelve | Cuándo rechaza | Resultado |
| --- | --- | --- | --- |
| `Promise.all` | todas cumplen | la primera que rechaza | array ordenado como la entrada |
| `Promise.allSettled` | todas terminan | nunca por una Promise de entrada | array de `{ status, value/reason }` |
| `Promise.race` | la primera termina | si la primera termina rechazada | valor o error de la primera |
| `Promise.any` | la primera cumple | todas rechazan | primer valor o `AggregateError` |

```js
await Promise.all([
  Promise.resolve('usuario'),
  Promise.resolve('configuración'),
])
// ['usuario', 'configuración']

await Promise.allSettled([
  Promise.resolve(10),
  Promise.reject(new Error('Sin conexión')),
])
// [
//   { status: 'fulfilled', value: 10 },
//   { status: 'rejected', reason: Error('Sin conexión') }
// ]

await Promise.any([
  Promise.reject(new Error('Proveedor A falló')),
  Promise.resolve('respuesta B'),
])
// 'respuesta B'
```

Usa `all` cuando el resultado completo sea necesario, `allSettled` para tareas independientes donde quieres reportar éxitos y fallos, `race` para timeout con cancelación y `any` para varios proveedores equivalentes.

`Promise.resolve(value)` normaliza un valor o Promise a una Promise; `Promise.reject(error)` crea una rechazada. Son útiles al construir adapters que deben devolver siempre la misma forma asíncrona. `Promise.withResolvers()` —cuando está disponible en el runtime objetivo— separa la creación de `promise`, `resolve` y `reject`; úsalo con cuidado porque permite resolver desde fuera y puede hacer más difícil seguir el flujo.

## `Promise.withResolvers` y `Promise.try`

`Promise.withResolvers()` devuelve las tres piezas de una Promise pendiente. Es útil al adaptar una API basada en eventos; no debe convertirse en estado global resoluble desde cualquier lugar.

```js
function once(target, eventName, signal) {
  const { promise, resolve, reject } = Promise.withResolvers()

  function cleanup() {
    target.removeEventListener(eventName, handleEvent)
    signal?.removeEventListener('abort', handleAbort)
  }

  function handleEvent(event) {
    cleanup()
    resolve(event)
  }

  function handleAbort() {
    cleanup()
    reject(signal.reason)
  }

  if (signal?.aborted) {
    reject(signal.reason)
    return promise
  }

  target.addEventListener(eventName, handleEvent, { once: true })
  signal?.addEventListener('abort', handleAbort, { once: true })

  return promise
}

const event = await once(button, 'click', controller.signal)
event.type // 'click'
```

`Promise.try(callback, ...args)` normaliza una función que podría devolver un valor, una Promise o lanzar de forma síncrona.

```js
function loadMaybeAsync(loader) {
  return Promise.try(loader)
}

await loadMaybeAsync(() => 42)
// 42

await loadMaybeAsync(async () => fetch('/api/config'))
// Response

await loadMaybeAsync(() => {
  throw new Error('Configuración inválida')
})
// Promise rechazada con ese Error
```

Sin `Promise.try`, una alternativa compatible es iniciar la llamada dentro de un callback de `Promise.resolve().then(() => loader())`. `Promise.try` pertenece a ECMAScript 2025; verifica el runtime objetivo.

## Iterar tareas asíncronas

`forEach` ignora la Promise que devuelve su callback. Elige secuencia o concurrencia de forma explícita.

```js
// Secuencia: cada operación espera la anterior.
const saved = []
for (const item of items) {
  saved.push(await saveItem(item))
}

// Concurrencia: todas se inician antes de esperar.
const results = await Promise.all(items.map(item => saveItem(item)))
```

La secuencia sirve cuando hay dependencia, límite estricto o importa el orden de efectos. La concurrencia reduce el tiempo total, pero debe respetar límites del servicio; para cientos de tareas usa un pool con concurrencia limitada.

## Errores y reintentos

No reintentes cualquier excepción. Un `400` por input inválido no se arregla repitiendo; un timeout o `503` podría ser transitorio. Limita intentos, usa backoff exponencial con jitter y respeta idempotencia.

```js
async function retry(fn, attempts = 3) {
  for (let attempt = 1; attempt <= attempts; attempt++) {
    try { return await fn() }
    catch (error) {
      if (attempt === attempts) throw error
      await new Promise((resolve) => setTimeout(resolve, 2 ** attempt * 100))
    }
  }
}

await retry(() => loadSettings(), 3)
// devuelve settings al primer éxito o lanza el último error
```

En producción añade una clasificación de errores y una señal para no ocultar que el servicio está fallando.

## Cancelar trabajo obsoleto

`AbortController` produce un signal que Fetch y otras APIs pueden escuchar. Cancela una búsqueda anterior cuando el usuario escribe otra, una carga cuando el componente desaparece o una operación al vencer un timeout.

```js
const controller = new AbortController()
const request = fetch('/api/search', { signal: controller.signal })
controller.abort(new Error('Consulta reemplazada'))

controller.signal.aborted // true
await request              // rechaza con el motivo de cancelación del runtime
```

Cancelar la espera del cliente no garantiza que el servidor deje de trabajar. El backend también necesita timeout, cancelación de DB, límites de recursos y una operación idempotente.

## Carreras

Dos respuestas pueden terminar en un orden distinto al que iniciaron. Usa un contador de request, un AbortSignal o comprueba que el resultado todavía corresponde a la consulta activa antes de actualizar la UI. Nunca confíes solo en que “la última respuesta debería llegar al final”.

```js
let activeController

async function search(query) {
  activeController?.abort()
  activeController = new AbortController()
  const { signal } = activeController

  try {
    const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`, {
      signal,
    })
    if (!response.ok) throw new Error(`HTTP ${response.status}`)

    const results = await response.json()
    if (!signal.aborted) renderResults(results)
  } catch (error) {
    if (!signal.aborted) showError(error)
  }
}
```

Aquí cada búsqueda invalida la anterior. El chequeo final evita renderizar un resultado que dejó de ser relevante aunque la operación haya avanzado demasiado para cancelarse a tiempo.
