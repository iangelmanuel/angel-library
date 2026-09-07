---
title: Arrays y métodos de Array
description: Referencia visual de Array con retorno, mutación, ejemplos y casos de uso para transformar colecciones.
type: guides
order: 10
tags: [javascript, arrays, methods, mutation, data]
scope: arrays
related:
  - languages/javascript/javascript-strings
  - languages/javascript/javascript-objects
  - general/utils/array
updatedAt: 2026-08-25
---

## Para recordar

Un array es ordenado, usa índices desde cero y es mutable. Métodos como `push`, `splice`, `sort` y `reverse` cambian el original; `map`, `filter`, `slice` y los métodos modernos `to...` crean otro array. Las copias son superficiales.

## Qué es un array

Un array es una colección ordenada. Su primer índice es `0` y `length` indica cuántos elementos contiene.

```js
const colors = ["red", "green", "blue"]

colors[0] // 'red'
colors.at(-1) // 'blue'
colors.length // 3
```

## Crear y reconocer arrays

| API                                 | Retorna                 | ¿Muta? | Caso de uso                               |
| ----------------------------------- | ----------------------- | ------ | ----------------------------------------- |
| `Array.isArray(value)`              | booleano                | no     | distinguir arrays de objetos              |
| `Array.from(iterable, mapFn?)`      | array nuevo             | no     | convertir iterables o array-like          |
| `Array.fromAsync(iterable, mapFn?)` | Promise con array nuevo | no     | consumir un iterable asíncrono            |
| `Array.of(...values)`               | array nuevo             | no     | crear un array con los argumentos exactos |

```js
Array.isArray([]) // true
Array.isArray({ 0: "a" }) // false
Array.from("web") // ['w', 'e', 'b']
Array.from({ length: 3 }, (_, index) => index + 1)
// [1, 2, 3]

Array.of(3) // [3]
new Array(3) // [vacío × 3]

await Array.fromAsync([Promise.resolve(1), Promise.resolve(2)])
// [1, 2]
```

`Array.fromAsync` requiere un runtime compatible. Es útil con iterables asíncronos, pero acumula todo el resultado en memoria; usa `for await...of` si quieres procesar elemento por elemento.

## Mapa para elegir un método

| Intención            | Métodos habituales                                       | Retorno                                |
| -------------------- | -------------------------------------------------------- | -------------------------------------- |
| agregar o quitar     | `push`, `pop`, `unshift`, `shift`, `splice`, `toSpliced` | longitud, elemento, eliminados o copia |
| leer por posición    | `at`, corchetes                                          | elemento o `undefined`                 |
| transformar          | `map`, `flat`, `flatMap`                                 | array nuevo                            |
| seleccionar          | `filter`                                                 | array nuevo                            |
| buscar               | `find`, `findLast`, `findIndex`, `includes`, `indexOf`   | elemento, índice o booleano            |
| comprobar            | `some`, `every`                                          | booleano                               |
| ordenar o invertir   | `sort`, `reverse`, `toSorted`, `toReversed`              | mismo array o array nuevo              |
| acumular             | `reduce`, `reduceRight`                                  | cualquier valor                        |
| combinar o presentar | `concat`, `join`                                         | array nuevo o string                   |
| recorrer             | `forEach`, `keys`, `values`, `entries`                   | `undefined` o iterador                 |

El mapa indica por dónde empezar. Las tablas siguientes muestran exactamente qué devuelve cada método y si cambia el array original.

### Leer con `at` o corchetes

```js
const steps = ["install", "configure", "run"]

steps[0] // 'install'
steps.at(0) // 'install'
steps.at(-1) // 'run'
steps[-1] // undefined: -1 es una propiedad, no un índice desde el final
```

Ambas formas devuelven `undefined` fuera de rango. `at` comunica mejor índices negativos calculados.

## Agregar y eliminar

| Método              | Retorna                       | ¿Muta? | Caso de uso       |
| ------------------- | ----------------------------- | ------ | ----------------- |
| `push(...items)`    | nueva longitud                | **sí** | agregar al final  |
| `pop()`             | último elemento o `undefined` | **sí** | quitar el último  |
| `unshift(...items)` | nueva longitud                | **sí** | agregar al inicio |
| `shift()`           | primer elemento o `undefined` | **sí** | quitar el primero |

```js
const items = ["a", "b"]

items.push("c") // retorna 3
console.log(items) // ['a', 'b', 'c']

items.pop() // retorna 'c'
console.log(items) // ['a', 'b']

items.unshift("z") // retorna 3
console.log(items) // ['z', 'a', 'b']

items.shift() // retorna 'z'
console.log(items) // ['a', 'b']
```

**Caso de uso:** `push`/`pop` forman una pila. `shift`/`unshift` sirven para colas pequeñas, pero mover todos los índices puede ser costoso en colecciones grandes.

## `slice`, `splice` y `toSpliced`

| Método                                     | Retorna              | ¿Muta? | Caso de uso                     |
| ------------------------------------------ | -------------------- | ------ | ------------------------------- |
| `slice(start?, end?)`                      | array nuevo          | no     | copiar un rango                 |
| `splice(start, deleteCount?, ...items)`    | elementos eliminados | **sí** | insertar, reemplazar o eliminar |
| `toSpliced(start, deleteCount?, ...items)` | array nuevo editado  | no     | actualizar estado inmutable     |

```js
const letters = ["a", "b", "c", "d"]

letters.slice(1, 3) // ['b', 'c']
console.log(letters) // ['a', 'b', 'c', 'd']

letters.splice(1, 2, "x") // retorna ['b', 'c']
console.log(letters) // ['a', 'x', 'd']

const original = ["a", "b", "c"]
const changed = original.toSpliced(1, 1, "x")
console.log(changed) // ['a', 'x', 'c']
console.log(original) // ['a', 'b', 'c']
```

**Caso de uso:** usa `slice` para paginar o copiar. Usa `toSpliced` cuando trabajas con estado inmutable. Usa `splice` cuando controlas una estructura mutable local.

## Transformar: `map`, `filter`, `flat` y `flatMap`

| Método              | Retorna                        | ¿Muta? | Mantiene cantidad   |
| ------------------- | ------------------------------ | ------ | ------------------- |
| `map(callback)`     | array nuevo                    | no     | sí                  |
| `filter(callback)`  | array nuevo                    | no     | no; puede reducirla |
| `flat(depth?)`      | array nuevo                    | no     | no necesariamente   |
| `flatMap(callback)` | array nuevo, aplanado un nivel | no     | no necesariamente   |

```js
const numbers = [1, 2, 3, 4]

numbers.map((number) => number * 2)
// [2, 4, 6, 8]

numbers
  .filter((number) => number % 2 === 0)
  [
    // [2, 4]

    (1, [2, [3]])
  ].flat(2)
  [
    // [1, 2, 3]

    ("hola mundo", "javascript moderno")
  ].flatMap((text) => text.split(" "))
// ['hola', 'mundo', 'javascript', 'moderno']
```

`map` mantiene la cantidad de elementos. `filter` puede reducirla. `flatMap` transforma cada elemento y aplana un nivel.

Los callbacks reciben `(value, index, array)`. Verifica la firma antes de pasar una función existente:

```js
;["10", "11", "12"].map(Number.parseInt)[
  // [10, NaN, 1]: el índice se usó accidentalmente como radix

  ("10", "11", "12")
].map((value) => Number.parseInt(value, 10))
// [10, 11, 12]
```

## Buscar y comprobar

| Método                    | Retorna                       | ¿Muta? | Detiene temprano         |
| ------------------------- | ----------------------------- | ------ | ------------------------ |
| `find(callback)`          | primer elemento o `undefined` | no     | sí                       |
| `findLast(callback)`      | último elemento o `undefined` | no     | sí                       |
| `findIndex(callback)`     | primer índice o `-1`          | no     | sí                       |
| `findLastIndex(callback)` | último índice o `-1`          | no     | sí                       |
| `some(callback)`          | booleano                      | no     | sí, al encontrar `true`  |
| `every(callback)`         | booleano                      | no     | sí, al encontrar `false` |

```js
const users = [
  { id: 1, active: false },
  { id: 2, active: true },
  { id: 3, active: true }
]

users.find((user) => user.active)
// { id: 2, active: true }

users.findLast((user) => user.active)
// { id: 3, active: true }

users.findIndex((user) => user.id === 2)
// 1

users.findLastIndex((user) => user.active)
// 2

users.some((user) => user.active)
// true

users.every((user) => user.active)
// false
```

`find` devuelve el elemento; `findIndex` devuelve la posición. `some` y `every` terminan tan pronto conocen la respuesta.

## `includes`, `indexOf` y `lastIndexOf`

| Método                           | Retorna              | ¿Muta? | Diferencia                            |
| -------------------------------- | -------------------- | ------ | ------------------------------------- |
| `includes(value, fromIndex?)`    | booleano             | no     | encuentra `NaN` y expresa pertenencia |
| `indexOf(value, fromIndex?)`     | primer índice o `-1` | no     | usa igualdad estricta                 |
| `lastIndexOf(value, fromIndex?)` | último índice o `-1` | no     | busca desde el final                  |

```js
const tags = ["css", "js", "css"]

tags.includes("js") // true
tags.indexOf("css") // 0
tags.lastIndexOf("css") // 2
tags
  .indexOf("html") // -1
  [NaN].includes(NaN) // true
  [NaN].indexOf(NaN) // -1
```

Para buscar objetos por una propiedad usa `find`, porque `includes({ id: 1 })` compara referencias.

## Ordenar sin errores

| Método                 | Retorna                  | ¿Muta? | Caso de uso                       |
| ---------------------- | ------------------------ | ------ | --------------------------------- |
| `sort(compareFn?)`     | el mismo array ordenado  | **sí** | estructura mutable local          |
| `toSorted(compareFn?)` | array nuevo ordenado     | no     | props, estado y datos compartidos |
| `reverse()`            | el mismo array invertido | **sí** | estructura mutable local          |
| `toReversed()`         | array nuevo invertido    | no     | inversión inmutable               |

```js
;[10, 2, 30].sort()[
  // [10, 2, 30]: sort convierte a string por defecto

  (10, 2, 30)
].toSorted((a, b) => a - b)
// [2, 10, 30]

const names = ["Ángel", "Ana", "Érika"]
names.toSorted((a, b) => a.localeCompare(b, "es"))
// ['Ana', 'Ángel', 'Érika']

const original = [3, 1, 2]
const sorted = original.toSorted((a, b) => a - b)

sorted // [1, 2, 3]
original // [3, 1, 2]
```

**Caso de uso:** `toSorted` es preferible para props o estado porque conserva el array original. `sort` es adecuado en un array local creado para ese cálculo.

## Reducir

| Método                                | Recorre             | Retorna          | ¿Muta?         |
| ------------------------------------- | ------------------- | ---------------- | -------------- |
| `reduce(callback, initialValue)`      | izquierda a derecha | acumulador final | no por sí solo |
| `reduceRight(callback, initialValue)` | derecha a izquierda | acumulador final | no por sí solo |

```js
const prices = [10, 20, 5]
prices.reduce((total, price) => total + price, 0)
// 35

const words = ["css", "js", "css"]
words
  .reduce((counts, word) => {
    counts[word] = (counts[word] ?? 0) + 1
    return counts
  }, {})
  [
    // { css: 2, js: 1 }

    ("a", "b", "c")
  ].reduceRight((text, value) => text + value, "")
// 'cba'
```

Siempre proporciona un valor inicial. Si el callback se vuelve difícil de leer, un `for...of` puede expresar mejor el algoritmo.

## Copias modernas

| Método               | Retorna                                  | ¿Muta? | Caso de uso                 |
| -------------------- | ---------------------------------------- | ------ | --------------------------- |
| `toReversed()`       | array nuevo invertido                    | no     | invertir estado             |
| `with(index, value)` | array nuevo con una posición reemplazada | no     | actualización por índice    |
| `concat(...values)`  | array nuevo combinado                    | no     | unir colecciones            |
| `toSpliced(...)`     | array nuevo editado                      | no     | insertar o quitar sin mutar |

```js
const source = [1, 2, 3]

source.toReversed() // [3, 2, 1]
source.with(1, 99) // [1, 99, 3]
source.concat([4, 5]) // [1, 2, 3, 4, 5]
console.log(source) // [1, 2, 3]
```

Estas APIs son útiles al actualizar estado: producen otra referencia sin cambiar la colección recibida.

## Rellenar, copiar y presentar

| Método                               | Retorna                   | ¿Muta? | Caso de uso                             |
| ------------------------------------ | ------------------------- | ------ | --------------------------------------- |
| `fill(value, start?, end?)`          | el mismo array            | **sí** | rellenar un rango                       |
| `copyWithin(target, start, end?)`    | el mismo array            | **sí** | copiar un rango dentro del array        |
| `join(separator?)`                   | string                    | no     | presentar o serializar una lista simple |
| `toString()`                         | string separado por comas | no     | conversión básica; poco configurable    |
| `toLocaleString(locales?, options?)` | string localizado         | no     | presentar números o fechas del array    |

```js
const slots = Array(4).fill(null)
slots // [null, null, null, null]

const values = [1, 2, 3, 4]
values.copyWithin(1, 2)
values[("HTML", "CSS", "JS")] // [1, 3, 4, 4]
  .join(" · ")
  [
    // 'HTML · CSS · JS'

    (1_000, new Date("2026-01-02T00:00:00Z"))
  ].toLocaleString("es-CO", {
    timeZone: "UTC"
  })
// representación localizada; los detalles dependen del runtime
```

`fill` reutiliza la misma referencia cuando recibe un objeto:

```js
const rows = Array(2).fill({ selected: false })
rows[0].selected = true

rows // [{ selected: true }, { selected: true }]

const independentRows = Array.from({ length: 2 }, () => ({ selected: false }))
```

## Iteración

| Método              | Retorna                      | ¿Muta?         | Caso de uso                    |
| ------------------- | ---------------------------- | -------------- | ------------------------------ |
| `keys()`            | iterador de índices          | no             | recorrer posiciones            |
| `values()`          | iterador de valores          | no             | consumo explícito de valores   |
| `entries()`         | iterador de `[index, value]` | no             | necesitar posición y valor     |
| `forEach(callback)` | `undefined`                  | no por sí solo | efectos síncronos por elemento |

```js
const values = ["a", "b"]

;[...values.keys()] // [0, 1]
;[...values.values()] // ['a', 'b']
;[...values.entries()] // [[0, 'a'], [1, 'b']]

values.forEach((value, index) => console.log(index, value))
// 0 'a'
// 1 'b'
```

`forEach` retorna `undefined` y no espera callbacks async. Para secuencia asíncrona usa `for...of`; para concurrencia usa `map` + `Promise.all`.

## Arrays dispersos y copias superficiales

`new Array(3)` crea huecos, no tres valores `undefined`. Algunos métodos omiten esos huecos. Prefiere `Array.from({ length: 3 })` o `fill` cuando realmente necesitas posiciones inicializadas.

Todas las operaciones de copia de esta página son superficiales: un objeto interno continúa compartiendo referencia.

```js
const original = [{ done: false }]
const copy = original.slice()

copy[0].done = true

original[0].done // true
copy !== original // true
copy[0] === original[0] // true
```
