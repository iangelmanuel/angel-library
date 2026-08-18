---
title: Fundamentos de JavaScript
description: Valores, tipos, variables, conversión y operadores explicados con resultados visibles y casos de uso.
category: general
stack: javascript
order: 2
tags: [javascript, basics, variables, types, operators]
scope: fundamentos del lenguaje
related:
  - technologies/javascript
  - guides/javascript-control-functions
  - guides/javascript-built-ins
updatedAt: 2026-08-18
---

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
