---
title: Iterables, iteradores y generators
description: Protocolos de iteración, generators síncronos y asíncronos, for await, Iterator helpers y procesamiento bajo demanda.
category: languages
stack: javascript
order: 16
tags: [javascript, iterables, iterators, generators, lazy]
scope: protocolos del lenguaje
website: https://developer.mozilla.org/es/docs/Web/JavaScript/Guide/Iterators_and_generators
related:
  - guides/javascript-loops-iteration
  - guides/javascript-async-promises
  - guides/javascript-advanced-language
updatedAt: 2026-08-25
---

## En 30 segundos

- Un **iterable** sabe crear un iterador mediante `Symbol.iterator`.
- Un **iterador** entrega `{ value, done }` cada vez que llamas `next()`.
- Un **generator** (`function*`) crea iteradores con una sintaxis más sencilla y pausa en `yield`.
- Un **async iterable** entrega Promises y se consume con `for await...of`.
- Los Iterator helpers modernos permiten `map`, `filter`, `take` y otras operaciones de forma lazy, sin construir arrays intermedios.

## Iterable no significa array

Arrays, strings, `Map`, `Set`, typed arrays y muchos objetos del navegador son iterables. Por eso funcionan con `for...of`, spread, desestructuración y `Array.from`.

```js
const tags = new Set(['js', 'web'])

for (const tag of tags) {
  console.log(tag)
}
// 'js'
// 'web'

[...tags]               // ['js', 'web']
const [first] = tags    // first = 'js'
Array.from(tags)        // ['js', 'web']
```

Un objeto normal no es iterable por defecto:

```js
const user = { name: 'Ana', role: 'editor' }

// [...user] // TypeError: user is not iterable
Object.entries(user)
// [['name', 'Ana'], ['role', 'editor']]
```

## Protocolo del iterador

`next()` devuelve un **iteration result**. Mientras `done` sea `false`, `value` contiene el siguiente dato.

```js
const iterator = ['a', 'b'].values()

iterator.next() // { value: 'a', done: false }
iterator.next() // { value: 'b', done: false }
iterator.next() // { value: undefined, done: true }
```

Un iterador es consumible: después de avanzar no vuelve al inicio. El iterable puede crear un iterador nuevo cada vez.

```js
const values = ['a', 'b']

values[Symbol.iterator]() !== values[Symbol.iterator]() // true
```

## Crear un iterable manual

```js
function createRange(start, end, step = 1) {
  return {
    [Symbol.iterator]() {
      let current = start

      return {
        next() {
          if (current > end) {
            return { value: undefined, done: true }
          }

          const value = current
          current += step
          return { value, done: false }
        },
      }
    },
  }
}

[...createRange(2, 8, 2)] // [2, 4, 6, 8]
```

El estado `current` queda encapsulado en cada iterador. Para la mayoría de casos, un generator expresa este protocolo con menos código.

## Generator functions

Una función declarada con `function*` no ejecuta inmediatamente su body. Devuelve un generator que comienza al llamar `next()`.

```js
function* range(start, end, step = 1) {
  for (let value = start; value <= end; value += step) {
    yield value
  }
}

const numbers = range(2, 8, 2)

numbers.next() // { value: 2, done: false }
numbers.next() // { value: 4, done: false }
;[...numbers]  // [6, 8]: continúa desde su estado actual
```

`yield` entrega un valor y pausa. `return` termina el generator y su valor final aparece en `next()`, pero `for...of` no incluye ese valor final.

### Delegar con `yield*`

```js
function* navigation() {
  yield 'home'
  yield* ['docs', 'search']
  yield 'settings'
}

[...navigation()]
// ['home', 'docs', 'search', 'settings']
```

`yield*` delega en otro iterable. Es útil para componer recorridos sin crear arrays temporales.

## Flujo bidireccional de un generator

El argumento de `next(value)` se convierte en el resultado de la expresión `yield` que estaba pausada.

```js
function* conversation() {
  const name = yield '¿Cómo te llamas?'
  return `Hola, ${name}`
}

const chat = conversation()

chat.next()      // { value: '¿Cómo te llamas?', done: false }
chat.next('Ana') // { value: 'Hola, Ana', done: true }
```

Esta capacidad sirve para coordinadores y máquinas de estado, pero puede ser difícil de seguir. Para producir secuencias, el flujo de una sola dirección suele bastar.

## Operaciones lazy con Iterator helpers

Los helpers de iteradores de ECMAScript 2025 permiten transformar sin consumir toda la fuente al inicio. Verifica compatibilidad del runtime objetivo.

| Helper | Devuelve | Detiene temprano |
| --- | --- | --- |
| `Iterator.from(value)` | iterador estándar | no aplica |
| `Iterator.concat(...iterables)` | iterador que recorre cada fuente en orden | sí, según consumidor |
| `.map(fn)` | iterador transformado | sí, según consumidor |
| `.filter(fn)` | iterador filtrado | sí |
| `.take(n)` | primeros `n` valores | sí |
| `.drop(n)` | omite `n` valores | no por sí solo |
| `.flatMap(fn)` | iterador aplanado | sí |
| `.find(fn)` | valor o `undefined` | sí |
| `.some(fn)` | booleano | sí |
| `.every(fn)` | booleano | sí |
| `.reduce(fn, initial)` | acumulador | no |
| `.toArray()` | array | consume el iterador |

```js
function* ids() {
  let id = 1
  while (true) yield id++
}

const result = ids()
  .filter(id => id % 2 === 0)
  .map(id => ({ id }))
  .take(3)
  .toArray()

result // [{ id: 2 }, { id: 4 }, { id: 6 }]
```

La fuente es infinita, pero `take(3)` detiene el consumo. Convertir primero con spread nunca terminaría.

### Unir fuentes sin crear un array

ECMAScript 2026 añadió `Iterator.concat`. Recibe cero o más iterables y los recorre uno después de otro de forma lazy. A diferencia de `[...a, ...b]`, no materializa todas las entradas antes de comenzar a consumirlas.

```js
const local = ['html', 'css']
const remote = new Set(['javascript', 'http'])

const topics = Iterator.concat(local, remote)
  .map(topic => topic.toUpperCase())
  .take(3)
  .toArray()

topics // ['HTML', 'CSS', 'JAVASCRIPT']
```

Los argumentos deben ser iterables, no iteradores arbitrarios que carezcan de `Symbol.iterator`. Si una fuente falla, el consumo lanza en ese punto; la concatenación no ejecuta las fuentes por adelantado ni añade concurrencia.

## Iteración asíncrona

Un async iterable implementa `Symbol.asyncIterator`. Cada `next()` produce una Promise. `for await...of` espera cada resultado.

```js
async function* paginate(firstURL) {
  let nextURL = firstURL

  while (nextURL) {
    const response = await fetch(nextURL)
    if (!response.ok) throw new Error(`HTTP ${response.status}`)

    const page = await response.json()
    yield page.items
    nextURL = page.next ?? null
  }
}

for await (const items of paginate('/api/projects')) {
  renderProjects(items)
}
```

Cada página se procesa antes de solicitar o entregar la siguiente. Esto reduce memoria y permite mostrar progreso.

`for await...of` también acepta iterables síncronos, pero no convierte operaciones internas en concurrentes. Si cada elemento es independiente y debe comenzar a la vez, usa una estrategia explícita como `Promise.all` con límite de concurrencia.

## Cerrar un iterador

Los iteradores pueden implementar `return()` para limpiar recursos cuando el consumidor sale antes con `break`, `return` o una excepción. Los generators ejecutan bloques `finally` al cerrarse.

```js
function* session() {
  try {
    yield 'connected'
    yield 'working'
  } finally {
    console.log('session closed')
  }
}

for (const state of session()) {
  console.log(state)
  break
}
// 'connected'
// 'session closed'
```

No dependas del recolector de basura para liberar un recurso externo en un momento concreto.

## Elegir la herramienta

| Necesidad | Herramienta |
| --- | --- |
| ya tienes todos los datos y son pocos | métodos de Array |
| quieres producir valores bajo demanda | generator |
| fuente grande o infinita | iterador lazy |
| cada valor llega de forma asíncrona | async generator |
| necesitas emitir eventos en momentos arbitrarios | EventTarget, stream u observable |

## Errores frecuentes

- Intentar recorrer un objeto normal con `for...of`.
- Reutilizar un iterador ya consumido.
- Convertir una fuente grande a array antes de filtrarla.
- Confundir lazy con concurrente.
- Olvidar limpieza cuando el consumidor termina antes.
- usar `for await...of` esperando paralelismo automático.

## Caso de uso: leer por lotes

```js
function* chunks(values, size) {
  if (!Number.isInteger(size) || size < 1) {
    throw new RangeError('size debe ser un entero positivo')
  }

  for (let index = 0; index < values.length; index += size) {
    yield values.slice(index, index + size)
  }
}

[...chunks([1, 2, 3, 4, 5], 2)]
// [[1, 2], [3, 4], [5]]
```

El consumer puede procesar un lote, ceder al navegador o esperar una operación antes de solicitar el siguiente.
