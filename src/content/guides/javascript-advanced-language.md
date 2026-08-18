---
title: "JavaScript avanzado: prototypes, clases e iteradores"
description: Entender this, prototypes, class, errores, iteradores, generators, symbols, Proxy y Reflect para completar el modelo del lenguaje.
category: general
stack: javascript
order: 23
tags: [javascript, prototypes, classes, iterators, generators, proxy]
scope: lenguaje avanzado
related:
  - guides/javascript-built-ins
  - guides/javascript-modules
  - patterns/proxy
updatedAt: 2026-08-18
---

## `this` y funciones

`this` depende de cómo se invoca una función, no de dónde se declara. En `obj.method()`, suele ser `obj`; en una función normal separada puede ser `undefined` en strict mode; en una arrow function se hereda del scope exterior. `call`, `apply` y `bind` permiten fijar o pasar un receiver.

| Método | Ejecuta de inmediato | Argumentos | Devuelve |
| --- | --- | --- | --- |
| `fn.call(thisArg, ...args)` | sí | separados | resultado de la función |
| `fn.apply(thisArg, args)` | sí | array o array-like | resultado de la función |
| `fn.bind(thisArg, ...args)` | no | permite argumentos parciales | función nueva |

```js
function greet(prefix) {
  return `${prefix}, ${this.name}`
}

greet.call({ name: 'Ana' }, 'Hola')
// 'Hola, Ana'

greet.apply({ name: 'Leo' }, ['Buen día'])
// 'Buen día, Leo'

const greetAna = greet.bind({ name: 'Ana' })
greetAna('Hola') // 'Hola, Ana'
```

En componentes y callbacks, una arrow suele evitar perder el contexto, pero no convierte automáticamente una función en método. Entiende primero quién debe ser el dueño de la operación.

## Prototypes y clases

Los objetos pueden delegar propiedades a un prototype. `class` es una sintaxis más legible sobre ese modelo; no crea un sistema de clases completamente separado.

```js
class Money {
  constructor(cents) { this.cents = cents }
  add(other) { return new Money(this.cents + other.cents) }
}

const total = new Money(500).add(new Money(250))

total               // Money { cents: 750 }
total.cents         // 750
total instanceof Money // true
```

`extends` y `super` sirven para herencia, pero composición suele permitir cambiar comportamiento con menos acoplamiento. Los métodos de una clase viven en su prototype y las propiedades privadas `#value` no pueden leerse desde fuera.

```js
Object.hasOwn(total, 'add')                    // false
Money.prototype.hasOwnProperty('add')          // true
Object.getPrototypeOf(total) === Money.prototype // true
```

### Campos privados

```js
class Counter {
  #value = 0

  increment() {
    this.#value += 1
    return this.#value
  }
}

const counter = new Counter()
counter.increment() // 1
counter.increment() // 2
// counter.#value   // SyntaxError: campo privado
```

## Errores

Usa `Error` y subclases para distinguir causas sin devolver strings ambiguos. `cause` conserva el error original:

| Clase | Señala normalmente |
| --- | --- |
| `Error` | fallo general de la aplicación |
| `TypeError` | valor de tipo o forma incorrecta |
| `RangeError` | valor fuera del rango permitido |
| `SyntaxError` | texto o código con sintaxis inválida |
| `AggregateError` | varios errores reunidos, por ejemplo en `Promise.any` |

```js
try {
  await readConfig()
} catch (error) {
  throw new Error('No se pudo cargar la configuración', { cause: error })
}
```

Una clase propia puede exponer datos operativos sin obligar a comparar mensajes:

```js
class HTTPError extends Error {
  constructor(status, message, options) {
    super(message, options)
    this.name = 'HTTPError'
    this.status = status
  }
}

const error = new HTTPError(404, 'Proyecto no encontrado')

error.name       // 'HTTPError'
error.status     // 404
error instanceof Error // true
```

No captures un error para ignorarlo. Agrega contexto, clasifica si es recuperable y deja que una frontera superior decida respuesta, logging o reintento. `finally` sirve para liberar recursos aunque haya retorno o excepción.

## Iterables e iteradores

Un iterable implementa `Symbol.iterator` y puede usarse con `for...of`, spread y desestructuración. Arrays, strings, Map y Set son iterables. Un iterador devuelve objetos `{ value, done }`.

```js
const range = {
  *[Symbol.iterator]() {
    yield 1
    yield 2
    yield 3
  },
}

for (const value of range) console.log(value)
// 1
// 2
// 3

[...range] // [1, 2, 3]
```

Los generators (`function*`) pausan en `yield` y sirven para producir datos bajo demanda. Son útiles para streams, paginación o recorridos grandes cuando no quieres construir todo el array en memoria.

```js
function* ids() {
  let current = 1
  while (true) yield current++
}

const iterator = ids()
iterator.next() // { value: 1, done: false }
iterator.next() // { value: 2, done: false }
iterator.next() // { value: 3, done: false }
```

## Symbols

`Symbol()` crea claves únicas que no colisionan con strings. `Symbol.iterator`, `Symbol.toPrimitive`, `Symbol.toStringTag` y otros well-known symbols permiten integrar objetos con el lenguaje.

```js
const internalId = Symbol('internalId')
const record = { [internalId]: 42, name: 'demo' }
Object.keys(record) // ['name']
Object.getOwnPropertySymbols(record) // [Symbol(internalId)]
record[internalId] // 42
```

Una symbol no es una forma de seguridad: si una referencia al objeto existe, el código puede inspeccionar sus symbols con `Object.getOwnPropertySymbols`.

## Proxy y Reflect

`Proxy` intercepta operaciones como lectura, escritura, `in` o enumeración. `Reflect` ofrece operaciones base para delegar el comportamiento original:

```js
const state = new Proxy({ count: 0 }, {
  set(target, key, value, receiver) {
    if (key === 'count' && !Number.isInteger(value)) return false
    return Reflect.set(target, key, value, receiver)
  },
})

state.count = 2
state.count // 2

Reflect.set(state, 'count', 2.5) // false
state.count                      // 2
```

Úsalo para infraestructura —reactividad, validación dinámica, adapters— y no para ocultar el flujo normal de una aplicación. Cada acceso pasa por un trap y puede complicar debugging y performance.

## Caso de uso: iterable de páginas

Un async generator permite consumir páginas bajo demanda sin cargar toda la colección al inicio.

```js
async function* paginate(firstURL) {
  let nextURL = firstURL

  while (nextURL) {
    const response = await fetch(nextURL)
    if (!response.ok) throw new HTTPError(response.status, 'Falló la página')

    const page = await response.json()
    yield page.items
    nextURL = page.next ?? null
  }
}

for await (const items of paginate('/api/projects')) {
  renderProjects(items) // se ejecuta una vez por página
}
```
