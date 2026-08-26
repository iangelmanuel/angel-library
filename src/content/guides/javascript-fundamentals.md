---
title: Fundamentos de JavaScript
description: Valores, tipos, variables, conversión y operadores explicados con resultados visibles y casos de uso.
category: languages
stack: javascript
order: 3
tags: [javascript, basics, variables, types, operators]
scope: fundamentos del lenguaje
related:
  - technologies/javascript
  - guides/javascript-getting-started
  - guides/javascript-expressions-operators
  - guides/javascript-control-functions
  - guides/javascript-built-ins
updatedAt: 2026-08-25
---

## Para recordar

JavaScript tiene siete tipos primitivos y objetos. Los primitivos se copian y comparan por valor; los objetos se comparten y comparan por identidad. Usa `const` por defecto, `let` cuando reasignas, conversión explícita en fronteras y `??` cuando `0`, `false` o `''` son válidos.

## Modelo mental

JavaScript trabaja con **valores**. Cada valor tiene un tipo y puede guardarse en una variable, enviarse a una función o formar parte de un objeto. Los primitivos se comparan por valor; los objetos se comparan por referencia.

## Tipos de datos

| Tipo | Ejemplo | Descripción | Caso de uso |
| --- | --- | --- | --- |
| `string` | `'Hola'` | texto inmutable | nombres, mensajes, URLs |
| `number` | `42`, `3.14`, `NaN` | enteros y decimales IEEE-754 | cantidades y cálculos |
| `bigint` | `9007199254740993n` | enteros fuera del rango seguro de Number | ids o enteros muy grandes |
| `boolean` | `true`, `false` | condición lógica | permisos y estados |
| `undefined` | `undefined` | valor no asignado o propiedad ausente | ausencia implícita |
| `null` | `null` | ausencia intencional | resultado vacío conocido |
| `symbol` | `Symbol('id')` | identificador único | claves internas y protocolos |
| `object` | `{}`, `[]`, `new Date()` | colección de propiedades | entidades y estructuras |

```js
typeof 'Hola'        // 'string'
typeof 42            // 'number'
typeof true          // 'boolean'
typeof undefined     // 'undefined'
typeof 10n           // 'bigint'
typeof Symbol('id')  // 'symbol'
typeof {}            // 'object'
typeof null          // 'object' ← particularidad histórica

Array.isArray([])    // true
Number.isNaN(NaN)    // true
```

**Caso de uso:** al validar una respuesta externa, `typeof` permite descartar tipos imposibles, pero para objetos complejos necesitas comprobar su estructura o usar un schema.

## `const`, `let` y `var`

| Declaración | Alcance | ¿Reasignable? | Recomendación |
| --- | --- | --- | --- |
| `const` | bloque | no | opción por defecto |
| `let` | bloque | sí | contadores y estado que cambia |
| `var` | función | sí | evitar en código moderno |

```js
const user = { name: 'Ana' }
user.name = 'Luis'      // válido: muta el objeto
// user = {}            // TypeError: const no se reasigna

let attempts = 0
attempts += 1
console.log(attempts)   // 1
```

`const` protege la variable, no vuelve inmutable el objeto. Si varias partes comparten la misma referencia, una mutación será visible para todas.

## Valores primitivos y referencias

```js
let first = 10
let second = first
second = 20

console.log(first)  // 10
console.log(second) // 20

const original = { count: 1 }
const alias = original
alias.count = 2

console.log(original.count) // 2
```

**Caso de uso:** al actualizar estado de UI suele convenir crear otro objeto con spread para no modificar la referencia compartida: `{ ...user, active: false }`.

## Conversión explícita

```js
Number('42')        // 42
Number('')          // 0
Number('hola')      // NaN
String(42)          // '42'
Boolean(0)          // false
Boolean('false')    // true: es una string no vacía
```

Los valores falsy son `false`, `0`, `-0`, `0n`, `''`, `null`, `undefined` y `NaN`. Los arrays y objetos vacíos son truthy.

## Truthy, falsy y nullish

Estos términos describen cómo JavaScript interpreta un valor dentro de una condición o un operador lógico:

- **Truthy:** valor que se comporta como `true` al convertirlo a booleano.
- **Falsy:** valor que se comporta como `false` al convertirlo a booleano.
- **Nullish:** valor que representa ausencia y es exactamente `null` o `undefined`.

Nullish no es sinónimo de falsy. Todos los valores nullish son falsy, pero `0`, `false`, `''`, `-0`, `0n` y `NaN` también son falsy sin representar necesariamente ausencia.

### Todos los valores falsy habituales

| Valor | `Boolean(valor)` | Puede representar |
| --- | --- | --- |
| `false` | `false` | opción desactivada |
| `0` | `false` | cantidad válida igual a cero |
| `-0` | `false` | cero con signo en cálculos especiales |
| `0n` | `false` | BigInt igual a cero |
| `''` | `false` | texto vacío permitido |
| `null` | `false` | ausencia intencional |
| `undefined` | `false` | valor no proporcionado o propiedad ausente |
| `NaN` | `false` | cálculo numérico inválido |

```js
Boolean(false)     // false
Boolean(0)         // false
Boolean('')        // false
Boolean(null)      // false
Boolean(undefined) // false
Boolean(NaN)       // false

Boolean('0')       // true: es un string no vacío
Boolean('false')   // true: es un string no vacío
Boolean([])        // true: es un objeto
Boolean({})        // true: es un objeto
```

Existe una excepción histórica del navegador: `document.all` se comporta como falsy aunque parece un objeto. Es una compatibilidad heredada y no debe usarse para lógica de aplicación.

### `null` y `undefined`

`undefined` suele indicar que JavaScript o una API no recibió o no encontró un valor. `null` suele utilizarse cuando la aplicación quiere expresar explícitamente “no hay valor”. La diferencia depende del contrato que definas.

```js
let pending
pending // undefined: nunca recibió un valor

const user = {
  middleName: null, // ausencia conocida e intencional
}

user.middleName // null
user.avatar     // undefined: la propiedad no existe
```

| Comprobación | Resultado | Qué detecta |
| --- | --- | --- |
| `value === null` | booleano | solo `null` |
| `value === undefined` | booleano | solo `undefined` |
| `value == null` | booleano | `null` o `undefined` |
| `value === null || value === undefined` | booleano | `null` o `undefined`, de forma explícita |

```js
null == undefined  // true
null === undefined // false

function isNullish(value) {
  return value == null
}

isNullish(null)      // true
isNullish(undefined) // true
isNullish(0)         // false
isNullish('')        // false
```

Usar `== null` es uno de los pocos usos intencionales y conocidos de igualdad flexible: comprueba únicamente `null` y `undefined`. Si el equipo evita `==` por convención, escribe la comparación explícita.

## Valores predeterminados: `||` frente a `??`

El operador OR lógico `||` devuelve el primer operando truthy. El operador de coalescencia nula `??` devuelve el primer operando que no sea nullish.

| Valor recibido | `value || 'default'` | `value ?? 'default'` |
| --- | --- | --- |
| `undefined` | `'default'` | `'default'` |
| `null` | `'default'` | `'default'` |
| `false` | `'default'` | `false` |
| `0` | `'default'` | `0` |
| `''` | `'default'` | `''` |
| `NaN` | `'default'` | `NaN` |
| `'dark'` | `'dark'` | `'dark'` |

```js
const volume = 0
const autoplay = false
const nickname = ''

volume || 50       // 50: reemplaza el cero
volume ?? 50       // 0: conserva un cero válido

autoplay || true   // true: reemplaza false
autoplay ?? true   // false: conserva la decisión

nickname || 'Ana'  // 'Ana': reemplaza el string vacío
nickname ?? 'Ana'  // '': conserva el string vacío
```

Usa `||` cuando cualquier valor falsy significa “usar alternativa”. Usa `??` cuando solamente la ausencia (`null` o `undefined`) debe activar el valor predeterminado.

### Evaluación de cortocircuito

Los operadores lógicos evalúan el lado derecho solo cuando lo necesitan. Esta conducta se llama **short-circuit evaluation** o evaluación de cortocircuito.

```js
let calls = 0

function createDefault() {
  calls += 1
  return 'created'
}

'saved' ?? createDefault() // 'saved'
calls                      // 0: no se llamó la función

null ?? createDefault()    // 'created'
calls                      // 1
```

Evita esconder efectos importantes en el lado derecho. El lector debe poder entender fácilmente cuándo se ejecutará.

## Asignación lógica: `??=`, `||=` y `&&=`

Estos operadores combinan una comprobación lógica con una asignación. Solo escriben el nuevo valor cuando se cumple su condición.

| Operador | Asigna cuando el valor actual es | Conserva |
| --- | --- | --- |
| `target ??= value` | `null` o `undefined` | `false`, `0`, `''`, `NaN` y valores truthy |
| `target ||= value` | cualquier valor falsy | únicamente valores truthy |
| `target &&= value` | cualquier valor truthy | valores falsy |

Los tres mutan la variable o propiedad del lado izquierdo cuando realizan la asignación y devuelven el valor final.

### `??=`: asignar solo si falta

```js
const settings = {
  volume: 0,
  theme: null,
}

settings.volume ??= 50
settings.theme ??= 'system'
settings.language ??= 'es'

settings
// {
//   volume: 0,
//   theme: 'system',
//   language: 'es'
// }
```

`volume` conserva `0` porque existe. `theme` cambia porque era `null`; `language` cambia porque la propiedad ausente produce `undefined`.

Un caso común es inicializar estructuras o configuración sin reemplazar decisiones válidas:

```js
function normalizeOptions(options) {
  options.timeout ??= 5_000
  options.retries ??= 2
  options.cache ??= true
  return options
}

normalizeOptions({ timeout: 0, cache: false })
// { timeout: 0, retries: 2, cache: false }
```

La función muta el objeto recibido. Si eso no forma parte del contrato, crea una copia:

```js
function withDefaults(options = {}) {
  return {
    timeout: 5_000,
    retries: 2,
    cache: true,
    ...options,
  }
}

const original = { timeout: 0 }
const normalized = withDefaults(original)

original   // { timeout: 0 }
normalized // { timeout: 0, retries: 2, cache: true }
```

### `||=`: asignar si el valor es falsy

```js
const profile = {
  displayName: '',
  score: 0,
  role: null,
}

profile.displayName ||= 'Usuario'
profile.score ||= 10
profile.role ||= 'reader'

profile
// { displayName: 'Usuario', score: 10, role: 'reader' }
```

Aquí el string vacío, cero y `null` son reemplazados. Esto es correcto solo si todos representan una configuración inválida o no utilizable.

```js
let heading = 'Documentación'
heading ||= 'Sin título'
heading // 'Documentación'

let emptyHeading = ''
emptyHeading ||= 'Sin título'
emptyHeading // 'Sin título'
```

### `&&=`: asignar si ya existe un valor truthy

`&&=` es útil para transformar algo únicamente cuando está activo o presente como valor truthy.

```js
let label = '  JavaScript  '
label &&= label.trim()
label // 'JavaScript'

let emptyLabel = ''
emptyLabel &&= emptyLabel.trim()
emptyLabel // '': no evaluó el lado derecho
```

```js
const feature = { enabled: true }
feature.enabled &&= userHasPermission()

// Si enabled era true, ahora contiene el resultado de userHasPermission().
// Si era false, la función no se ejecuta y permanece false.
```

### No son exactamente una abreviación textual

`object.property ??= value` se parece a `object.property ?? (object.property = value)`, pero el lado izquierdo se evalúa una sola vez. Esto importa cuando acceder a la referencia tiene costo o efectos.

```js
let accesses = 0

function getSettings() {
  accesses += 1
  return settings
}

getSettings().theme ??= 'system'
accesses // 1
```

## Parámetros y desestructuración predeterminados

Los valores predeterminados de parámetros y desestructuración se aplican únicamente ante `undefined`, no ante `null`, `false`, `0` o `''`.

```js
function greet(name = 'Visitante') {
  return `Hola, ${name}`
}

greet()          // 'Hola, Visitante'
greet(undefined) // 'Hola, Visitante'
greet(null)      // 'Hola, null'
greet('')        // 'Hola, '

const { theme = 'system' } = { theme: null }
theme // null
```

Si `null` también debe activar el valor predeterminado, normaliza con `??` dentro de la función.

## Optional chaining y ausencia segura

El encadenamiento opcional `?.` detiene el acceso cuando el valor anterior es `null` o `undefined`. Devuelve `undefined` en lugar de lanzar un `TypeError`.

```js
const user = {
  profile: {
    social: null,
  },
}

user.profile?.name                   // undefined
user.profile?.social?.website        // undefined
user.permissions?.includes('admin')  // undefined
user.onLogin?.()                     // undefined si no es función presente
```

| Sintaxis | Uso |
| --- | --- |
| `object?.property` | propiedad opcional conocida |
| `object?.[dynamicKey]` | propiedad opcional dinámica |
| `functionValue?.()` | llamada opcional |

```js
const field = 'city'
const city = user.address?.[field] ?? 'Sin ciudad'

city // 'Sin ciudad'
```

`?.` solo protege el tramo donde aparece. Si una propiedad es obligatoria, usarlo indiscriminadamente puede ocultar datos incorrectos; valida y lanza un error útil en la frontera adecuada.

## Combinación y precedencia

JavaScript no permite mezclar `??` directamente con `||` o `&&` sin paréntesis, porque la intención sería ambigua.

```js
// null || undefined ?? 'fallback' // SyntaxError

(null || undefined) ?? 'fallback' // 'fallback'
null || (undefined ?? 'fallback') // 'fallback'
```

Cuando una expresión lógica necesita varios paréntesis para entenderse, extrae nombres intermedios o una función. La claridad vale más que reducir una línea.

## Operadores aritméticos

| Operador | Ejemplo | Resultado |
| --- | --- | --- |
| `+` | `5 + 2` | `7` |
| `-` | `5 - 2` | `3` |
| `*` | `5 * 2` | `10` |
| `/` | `5 / 2` | `2.5` |
| `%` | `5 % 2` | `1` |
| `**` | `5 ** 2` | `25` |

```js
1 + '2'       // '12': concatena porque hay una string
Number('1') + 2 // 3
10 % 2        // 0: útil para saber si es par
2 ** 3        // 8
```

## Comparación y operadores lógicos

```js
5 === 5       // true
5 === '5'     // false
5 == '5'      // true: aplica coerción, normalmente se evita
5 !== 4       // true
10 > 5        // true

true && 'ok'  // 'ok'
false && 'ok' // false
0 || 10       // 10
0 ?? 10       // 0
null ?? 10    // 10
!true         // false
```

`&&` y `||` devuelven operandos, no necesariamente booleanos. `??` solo reemplaza `null` o `undefined`, por eso conserva valores válidos como `0`, `false` y `''`.

## Acceso opcional y asignación

```js
const city = user.address?.city ?? 'Sin ciudad'
settings.theme ??= 'system'
count += 1
```

**Caso de uso:** `?.` evita un error al recorrer propiedades opcionales. No debe ocultar que una propiedad obligatoria falta; en ese caso conviene validar y fallar con un mensaje claro.
