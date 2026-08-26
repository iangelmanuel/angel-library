---
title: "JavaScript avanzado: this, Symbols y metaprogramación"
description: Reglas de this, call/apply/bind, Symbols, conversión personalizada, Proxy y Reflect sin ocultar el flujo del programa.
category: languages
stack: javascript
order: 18
tags: [javascript, this, symbols, proxy, reflect, metaprogramming]
scope: lenguaje avanzado
website: https://developer.mozilla.org/es/docs/Web/JavaScript/Guide/Meta_programming
related:
  - guides/javascript-prototypes-classes
  - guides/javascript-iterators-generators
  - guides/javascript-objects
  - patterns/proxy
updatedAt: 2026-08-25
---

## Cuándo estudiar esta página

Aprende primero funciones, objetos, prototypes y clases. Este documento explica mecanismos que permiten cambiar cómo se enlaza una llamada o cómo responde un objeto a operaciones del lenguaje. Son herramientas potentes para infraestructura, pero innecesarias en la mayoría de la lógica de negocio.

Para recordar rápidamente:

- `this` lo determina la forma de llamada; una arrow lo hereda.
- un `Symbol` es una identidad única, no una string secreta;
- `Proxy` intercepta operaciones y `Reflect` ejecuta su comportamiento base;
- metaprogramación significa que el código observa o modifica el comportamiento de otras operaciones del programa.

## Las reglas de `this`

El mismo cuerpo de función puede recibir valores distintos de `this`.

| Forma de llamada | Valor habitual de `this` |
| --- | --- |
| `object.method()` | `object`, el receptor |
| `fn()` | `undefined` en strict mode |
| `new Constructor()` | la instancia nueva |
| `fn.call(value)` | `value` indicado |
| `boundFn()` | valor fijado mediante `bind` |
| arrow function | heredado del scope exterior |

```js
function describe(prefix) {
  return `${prefix}: ${this.name}`
}

const user = { name: 'Ana', describe }

user.describe('Usuario') // 'Usuario: Ana'

const detached = user.describe
// detached('Usuario')   // TypeError en strict mode
```

El punto no “pertenece” permanentemente a la función. En `user.describe()`, el receptor situado antes del punto establece `this` para esa llamada.

## `call`, `apply` y `bind`

| Método | Ejecuta ahora | Argumentos | Devuelve |
| --- | --- | --- | --- |
| `fn.call(thisArg, ...args)` | sí | separados | resultado de `fn` |
| `fn.apply(thisArg, args)` | sí | array o array-like | resultado de `fn` |
| `fn.bind(thisArg, ...args)` | no | permite aplicación parcial | función nueva |

```js
function greet(greeting, punctuation = '!') {
  return `${greeting}, ${this.name}${punctuation}`
}

greet.call({ name: 'Ana' }, 'Hola', '.')
// 'Hola, Ana.'

greet.apply({ name: 'Leo' }, ['Buen día', '!'])
// 'Buen día, Leo!'

const greetAna = greet.bind({ name: 'Ana' }, 'Hola')
greetAna('?')
// 'Hola, Ana?'
```

`bind` no cambia la función original. Crea otra función y también puede fijar argumentos iniciales.

## Arrow functions y callbacks

Una arrow no crea `this`, `arguments`, `super` ni `new.target` propios. Tampoco puede llamarse con `new`.

```js
class Timer {
  seconds = 0

  start() {
    this.id = setInterval(() => {
      this.seconds += 1 // hereda this de start()
    }, 1_000)
  }

  stop() {
    clearInterval(this.id)
  }
}
```

No conviertas todo método en un campo arrow para “arreglar this” sin evaluar el costo: cada instancia obtiene otra función. Usa `bind`, un callback arrow local o una API que preserve receptor según el caso.

## Symbols como claves únicas

Cada llamada a `Symbol()` crea una identidad diferente aunque use la misma descripción.

```js
const first = Symbol('id')
const second = Symbol('id')

first === second // false

const record = {
  [first]: 42,
  name: 'demo',
}

record[first]                        // 42
Object.keys(record)                  // ['name']
Object.getOwnPropertySymbols(record) // [Symbol(id)]
Reflect.ownKeys(record)              // ['name', Symbol(id)]
```

Un Symbol evita colisiones accidentales, pero no protege información. Cualquier código con la referencia al objeto puede obtener sus symbols mediante reflexión.

`Symbol.for(key)` consulta un registro global por realm y puede devolver la misma identidad:

```js
Symbol.for('app.trace') === Symbol.for('app.trace') // true
Symbol.keyFor(Symbol.for('app.trace'))              // 'app.trace'
Symbol.keyFor(Symbol('local'))                      // undefined
```

## Well-known symbols

ECMAScript usa symbols conocidos como puntos de extensión:

| Symbol | Personaliza |
| --- | --- |
| `Symbol.iterator` | recorrido síncrono |
| `Symbol.asyncIterator` | recorrido asíncrono |
| `Symbol.toPrimitive` | conversión a primitivo |
| `Symbol.toStringTag` | etiqueta de `Object.prototype.toString` |
| `Symbol.hasInstance` | comportamiento de `instanceof` |
| `Symbol.dispose` | limpieza síncrona con `using` |
| `Symbol.asyncDispose` | limpieza asíncrona con `await using` |

`Symbol.dispose`, `Symbol.asyncDispose`, `using` y `await using` están previstos para ECMAScript 2027. Comprueba soporte de sintaxis y runtime; no pertenecen a la edición ECMAScript 2026.

### Conversión personalizada

```js
const money = {
  cents: 2_500,

  [Symbol.toPrimitive](hint) {
    if (hint === 'number') return this.cents
    return `$${(this.cents / 100).toFixed(2)}`
  },
}

Number(money) // 2500
String(money) // '$25.00'
```

La conversión implícita personalizada puede sorprender. Úsala en tipos de infraestructura con semántica inequívoca; un método explícito como `toCents()` suele ser más fácil de descubrir.

## `Proxy`: interceptar operaciones

Un Proxy envuelve un target y define **traps** para operaciones como leer, escribir, comprobar, enumerar, llamar o construir.

```js
const state = new Proxy({ count: 0 }, {
  get(target, key, receiver) {
    console.log(`read:${String(key)}`)
    return Reflect.get(target, key, receiver)
  },

  set(target, key, value, receiver) {
    if (key === 'count' && !Number.isInteger(value)) {
      throw new TypeError('count debe ser entero')
    }
    return Reflect.set(target, key, value, receiver)
  },
})

state.count       // registra 'read:count' y devuelve 0
state.count = 2   // true
// state.count = 2.5 // TypeError
```

| Trap | Intercepta |
| --- | --- |
| `get`, `set` | lectura y escritura |
| `has` | operador `in` |
| `deleteProperty` | `delete` |
| `ownKeys` | enumeración y reflexión |
| `getOwnPropertyDescriptor` | descriptor de propiedad |
| `apply` | llamada a función |
| `construct` | llamada con `new` |

El Proxy debe respetar **invariants** del lenguaje. Por ejemplo, no puede ocultar una propiedad propia no configurable. El runtime lanza `TypeError` cuando un trap contradice esas reglas.

## `Reflect`: operaciones como funciones

`Reflect` agrupa operaciones que reflejan sintaxis del lenguaje y devuelve resultados útiles para delegar desde traps.

```js
const target = { name: 'Ana' }

Reflect.get(target, 'name')            // 'Ana'
Reflect.set(target, 'role', 'editor')  // true
Reflect.has(target, 'role')            // true
Reflect.deleteProperty(target, 'role') // true
Reflect.ownKeys(target)                 // ['name']
```

`Reflect.set` devuelve booleano; una asignación normal devuelve el valor asignado. `Reflect.deleteProperty` evita necesitar sintaxis dinámica alrededor de `delete`. `Reflect.construct` y `Reflect.apply` permiten invocar constructores y funciones con argumentos programáticos.

```js
Math.max.apply(null, [4, 8, 2])
Reflect.apply(Math.max, null, [4, 8, 2])
// ambas devuelven 8
```

## Proxy revocable

`Proxy.revocable` permite invalidar acceso a una capacidad entregada temporalmente.

```js
const { proxy, revoke } = Proxy.revocable(
  { token: 'temporary' },
  {},
)

proxy.token // 'temporary'
revoke()
// proxy.token // TypeError: proxy revocado
```

No convierte el contenido en secreto si fue copiado antes de revocar. Sirve para cortar futuras operaciones a través de esa referencia.

## Cuándo no usar metaprogramación

Evita un Proxy cuando una función, getter, clase o validación en la frontera expresa el contrato directamente. Los traps afectan cada operación, complican stack traces, identidad, serialización y rendimiento.

Buenos candidatos:

- sistemas de reactividad;
- membranes entre contextos;
- mocks y herramientas de diagnóstico;
- adapters dinámicos;
- validación de una API genérica.

Malos candidatos:

- ocultar requests de red detrás de una lectura de propiedad;
- corregir silenciosamente datos inválidos;
- reemplazar un modelo de dominio explícito;
- interceptar todo “por si acaso”.

## Caso de uso: configuración de solo lectura

```js
function readonly(value, path = 'config') {
  return new Proxy(value, {
    get(target, key, receiver) {
      const result = Reflect.get(target, key, receiver)
      return result && typeof result === 'object'
        ? readonly(result, `${path}.${String(key)}`)
        : result
    },
    set(_target, key) {
      throw new TypeError(`No se puede modificar ${path}.${String(key)}`)
    },
    deleteProperty(_target, key) {
      throw new TypeError(`No se puede eliminar ${path}.${String(key)}`)
    },
  })
}

const config = readonly({ api: { timeout: 5_000 } })

config.api.timeout // 5000
// config.api.timeout = 1000 // TypeError con ruta
```

Este wrapper crea proxies anidados cada vez que se lee un objeto. En producción convendría cachearlos con `WeakMap` para conservar identidad y evitar trabajo repetido.
