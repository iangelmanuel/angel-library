---
title: Ciclos e iteración en JavaScript
description: for, while, do while, for of, for in, for await, break y continue con resultados, decisiones y errores frecuentes.
category: general
stack: javascript
order: 4
tags: [javascript, loops, iteration, for, while]
scope: fundamentos del lenguaje
website: https://developer.mozilla.org/es/docs/Web/JavaScript/Guide/Loops_and_iteration
related:
  - guides/javascript-control-functions
  - guides/javascript-arrays-objects
  - guides/javascript-async-promises
updatedAt: 2026-08-18
---

## Qué es un ciclo

Un ciclo repite un bloque mientras exista trabajo o se cumpla una condición. La elección depende de si conoces la cantidad de iteraciones, recorres un iterable, necesitas propiedades de un objeto o esperas valores asíncronos.

| Estructura | Recorre o controla | Caso de uso |
| --- | --- | --- |
| `for` | contador y condición explícitos | índices, rangos y pasos |
| `while` | condición evaluada antes | cantidad desconocida |
| `do...while` | condición evaluada después | ejecutar al menos una vez |
| `for...of` | valores de un iterable | Array, String, Map, Set, NodeList |
| `for...in` | claves enumerables | objetos simples con comprobación propia |
| `for await...of` | valores de iterable async o Promises | streams y paginación asíncrona |

Los ciclos son sentencias: no retornan una colección. Para transformar un array y obtener otro, `map` o `filter` suelen comunicar mejor el resultado.

## Ciclo `for`

Tiene inicialización, condición y actualización. Cualquiera puede omitirse, pero una forma demasiado libre puede ser difícil de leer.

```js
const values = []

for (let index = 0; index < 4; index += 1) {
  values.push(index * 2)
}

values // [0, 2, 4, 6]
```

### Recorrer hacia atrás o con otro paso

```js
const reverseIndexes = []

for (let index = 5; index >= 1; index -= 2) {
  reverseIndexes.push(index)
}

reverseIndexes // [5, 3, 1]
```

Usa `let` para el contador. Cada iteración obtiene su binding de bloque, lo que evita el problema histórico de capturar una única variable `var` en callbacks.

```js
const callbacks = []

for (let index = 0; index < 3; index += 1) {
  callbacks.push(() => index)
}

callbacks.map(callback => callback()) // [0, 1, 2]
```

## `while`

Evalúa la condición antes de cada vuelta, por lo que puede ejecutarse cero veces. Es apropiado cuando el final depende de un estado y no de un rango conocido.

```js
let remaining = 13
let attempts = 0

while (remaining > 1) {
  remaining = Math.ceil(remaining / 2)
  attempts += 1
}

remaining // 1
attempts  // 4
```

Mantén visible qué hace que la condición llegue a ser falsa. Un `while (true)` necesita una salida clara con `break`, retorno o excepción.

## `do...while`

Ejecuta el cuerpo antes de comprobar la condición, así que siempre corre al menos una vez.

```js
let page = 1
const visited = []

do {
  visited.push(page)
  page += 1
} while (page <= 3)

visited // [1, 2, 3]
```

Es útil para menús, reintentos o lectura inicial, siempre que la primera operación deba ocurrir incluso si la condición empieza siendo falsa.

## `for...of`: valores iterables

```js
const totalByTag = new Map([
  ['javascript', 12],
  ['css', 8],
])

const rows = []

for (const [tag, total] of totalByTag) {
  rows.push(`${tag}: ${total}`)
}

rows // ['javascript: 12', 'css: 8']
```

Strings, arrays, typed arrays, Map, Set, NodeList, generators y muchos objetos del navegador son iterables. Un objeto simple no lo es automáticamente.

```js
for (const character of 'A😀B') {
  console.log(character)
}
// 'A'
// '😀'
// 'B'
```

### Necesitar índice y valor

```js
const names = ['Ana', 'Leo']

for (const [index, name] of names.entries()) {
  console.log(index, name)
}
// 0 'Ana'
// 1 'Leo'
```

## `for...in`: claves enumerables

`for...in` recorre nombres de propiedades enumerables, incluidas las heredadas. Para un objeto de datos, filtra con `Object.hasOwn`.

```js
const settings = { theme: 'dark', compact: true }
const result = []

for (const key in settings) {
  if (!Object.hasOwn(settings, key)) continue
  result.push([key, settings[key]])
}

result
// [['theme', 'dark'], ['compact', true]]
```

No uses `for...in` para valores de un array: entrega índices como strings y puede incluir propiedades adicionales.

```js
const numbers = [10, 20]
numbers.extra = 30

Object.keys(numbers) // ['0', '1', 'extra']

for (const key in numbers) console.log(key)
// '0', '1', 'extra'

for (const value of numbers) console.log(value)
// 10, 20
```

Para objetos, `Object.keys`, `Object.values` y `Object.entries` suelen producir recorridos más explícitos.

## `break` y `continue`

`break` termina el ciclo actual. `continue` omite el resto de la vuelta y continúa con la siguiente.

```js
const input = [3, -1, 4, 0, 8]
const positives = []

for (const number of input) {
  if (number === 0) break
  if (number < 0) continue
  positives.push(number)
}

positives // [3, 4]
```

Las etiquetas permiten salir de ciclos anidados, pero suelen indicar que conviene extraer una función y usar `return`.

```js
function findPosition(matrix, expected) {
  for (let row = 0; row < matrix.length; row += 1) {
    for (let column = 0; column < matrix[row].length; column += 1) {
      if (matrix[row][column] === expected) return { row, column }
    }
  }
  return null
}

findPosition([[1, 2], [3, 4]], 3) // { row: 1, column: 0 }
```

## Métodos de Array o ciclo

| Necesidad | Opción expresiva |
| --- | --- |
| transformar todos | `map` |
| seleccionar algunos | `filter` |
| encontrar uno | `find` |
| comprobar alguno/todos | `some` / `every` |
| producir un acumulador | `reduce` o `for...of` |
| efectos síncronos simples | `forEach` |
| salida temprana o varias reglas | `for...of` |
| `await` secuencial | `for...of` |

```js
const prices = [10, 20, 30]

prices.map(price => price * 2)
// [20, 40, 60]

const doubled = []
for (const price of prices) {
  doubled.push(price * 2)
}
// mismo resultado; más líneas, pero permite control adicional
```

## Ciclos asíncronos

### Secuencia

```js
const saved = []

for (const item of items) {
  saved.push(await saveItem(item))
}

saved // resultados en orden, una operación después de otra
```

### Concurrencia

```js
const saved = await Promise.all(
  items.map(item => saveItem(item)),
)

saved // resultados en orden de entrada; operaciones iniciadas juntas
```

`forEach(async () => ...)` no espera las Promises del callback. Elige secuencia, concurrencia total o un límite de concurrencia según el servicio.

### `for await...of`

```js
async function* pages() {
  yield Promise.resolve(['a', 'b'])
  yield Promise.resolve(['c'])
}

const items = []

for await (const page of pages()) {
  items.push(...page)
}

items // ['a', 'b', 'c']
```

Es especialmente útil con streams, async generators y fuentes paginadas que producen datos gradualmente.

## Mutar mientras recorres

Eliminar o agregar elementos al mismo array durante la iteración puede saltar valores o extender el ciclo. Si necesitas filtrar, crea otra colección.

```js
const original = [1, 2, 3, 4]
const odd = original.filter(number => number % 2 !== 0)

odd      // [1, 3]
original // [1, 2, 3, 4]
```

Cuando la mutación local sea intencional, recorre de atrás hacia delante al eliminar por índice para no desplazar elementos pendientes.

## Evitar ciclos infinitos y bloquear la interfaz

- Comprueba que el contador o estado avance hacia la salida.
- Define un máximo de intentos para datos externos.
- No recorras estructuras que pueden crecer sin límite dentro del mismo ciclo.
- Divide trabajo grande en lotes o muévelo a un worker.
- Añade cancelación a procesos asíncronos largos.

```js
function findWithLimit(next, maximum = 1_000) {
  for (let attempt = 0; attempt < maximum; attempt += 1) {
    const value = next()
    if (value.done) return value.value
  }

  throw new RangeError('Se alcanzó el límite de iteraciones')
}
```
