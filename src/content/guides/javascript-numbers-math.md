---
title: Number, BigInt y Math
description: Conversión, validación, precisión, formato y operaciones matemáticas con resultados visibles y casos de uso seguros.
category: general
stack: javascript
order: 7
tags: [javascript, number, bigint, math, precision]
scope: tipos y métodos
related:
  - guides/javascript-built-ins
  - guides/javascript-date-regexp-intl
  - guides/javascript-collections
updatedAt: 2026-08-18
---

## Modelo mental de `Number`

JavaScript usa números de punto flotante IEEE-754 para enteros y decimales. Esto ofrece un rango amplio, pero algunos decimales no se representan de forma exacta y los enteros dejan de ser seguros fuera de `Number.MIN_SAFE_INTEGER` y `Number.MAX_SAFE_INTEGER`.

```js
0.1 + 0.2                    // 0.30000000000000004
Number.MAX_SAFE_INTEGER      // 9007199254740991
Number.isSafeInteger(9007199254740991) // true
Number.isSafeInteger(9007199254740992) // false
```

Para dinero, trabaja en unidades mínimas enteras —centavos— o usa una librería decimal cuando el dominio exija precisión contable.

## Separadores numéricos con `_`

El guion bajo puede separar grupos dentro de un **literal numérico** para hacer visible su magnitud. No cambia el valor y JavaScript lo ignora al evaluar.

```js
const oneMillion = 1_000_000
const creditLimit = 25_000_000
const millisecondsPerDay = 86_400_000

oneMillion          // 1000000
creditLimit         // 25000000
millisecondsPerDay  // 86400000

1_000_000 === 1000000 // true
```

También funciona en decimales, exponentes, otras bases y BigInt:

```js
const precise = 1_234.567_89
const scientific = 1.5e1_0
const permissions = 0b1111_0000
const color = 0xff_88_00
const mask = 0o755
const largeId = 9_007_199_254_740_993n

precise     // 1234.56789
scientific  // 15000000000
permissions // 240
color       // 16746496
mask        // 493
largeId     // 9007199254740993n
```

Reglas importantes:

- debe aparecer entre dígitos; no al inicio ni al final;
- no puede quedar junto al punto decimal, `e`, signo del exponente ni prefijo de base;
- evita agrupaciones ambiguas como `1_00_00`; sigue grupos conocidos del dominio;
- funciona en código, no en JSON ni en texto recibido de un formulario.

```js
Number('1_000')          // NaN
Number.parseInt('1_000', 10) // 1: se detiene en el guion bajo
JSON.parse('{"total": 1_000}') // SyntaxError
```

Para mostrar separadores al usuario usa `Intl.NumberFormat` o `toLocaleString`; el guion bajo solo mejora la lectura del código fuente.

```js
(1_000_000).toLocaleString('es-CO')
// '1.000.000'
```

## Convertir y validar

| Función o método | Devuelve | Muta | Caso de uso |
| --- | --- | --- | --- |
| `Number(value)` | número o `NaN` | no | convertir el valor completo |
| `Number.parseInt(text, radix)` | entero o `NaN` | no | leer una parte entera |
| `Number.parseFloat(text)` | decimal o `NaN` | no | leer una parte decimal |
| `Number.isNaN(value)` | booleano | no | detectar exactamente `NaN` |
| `Number.isFinite(value)` | booleano | no | aceptar solo números finitos |
| `Number.isInteger(value)` | booleano | no | validar enteros |
| `Number.isSafeInteger(value)` | booleano | no | validar enteros representables sin pérdida |

```js
Number('42')              // 42
Number('42px')            // NaN
Number('')                // 0
Number.parseInt('42px', 10) // 42
Number.parseFloat('3.14rem') // 3.14

Number.isNaN(NaN)         // true
Number.isNaN('no')        // false
Number.isFinite(20)       // true
Number.isFinite('20')     // false
Number.isInteger(4.0)     // true
Number.isInteger(4.2)     // false
```

Evita la función global `isNaN()` cuando no quieres coerción: `isNaN('texto')` es `true`, mientras `Number.isNaN('texto')` es `false`.

## Formatear y representar

| Método | Devuelve | Muta | Caso de uso |
| --- | --- | --- | --- |
| `toFixed(digits)` | string con decimales fijos | no | visualización simple |
| `toPrecision(digits)` | string con cifras significativas | no | mediciones y notación científica |
| `toString(radix?)` | string; admite bases 2–36 | no | binario, hexadecimal o ids cortos |
| `toLocaleString(locale, options)` | string localizado | no | moneda, porcentajes y unidades |

```js
const value = 1234.567

value.toFixed(2)                  // '1234.57'
value.toPrecision(4)              // '1235'
(255).toString(16)                // 'ff'
(10).toString(2)                  // '1010'

(1234.5).toLocaleString('es-CO', {
  style: 'currency',
  currency: 'COP',
})
// resultado localizado, por ejemplo: '$ 1.234,50'
```

`toFixed` devuelve texto y redondea para presentar; no corrige la precisión interna ni debe reutilizarse silenciosamente como número de negocio.

## Métodos de `Math`

`Math` es un objeto estático: no se instancia con `new`. Sus métodos no mutan los argumentos.

| Método | Devuelve | Caso de uso |
| --- | --- | --- |
| `Math.abs(x)` | valor absoluto | distancia o diferencia sin signo |
| `Math.sign(x)` | `-1`, `0`, `-0`, `1` o `NaN` | conocer dirección |
| `Math.min(...values)` | menor valor | límites y estadísticas |
| `Math.max(...values)` | mayor valor | límites y estadísticas |
| `Math.floor(x)` | entero hacia abajo | páginas completas o índice aleatorio |
| `Math.ceil(x)` | entero hacia arriba | cantidad de páginas |
| `Math.round(x)` | entero más cercano | redondeo general |
| `Math.trunc(x)` | parte entera hacia cero | eliminar decimales |
| `Math.pow(base, exponent)` | potencia | fórmulas; también `base ** exponent` |
| `Math.sqrt(x)` | raíz cuadrada | geometría |
| `Math.cbrt(x)` | raíz cúbica | cálculos volumétricos |
| `Math.hypot(...values)` | raíz de suma de cuadrados | distancia euclidiana |
| `Math.random()` | número entre 0 incluido y 1 excluido | simulaciones no criptográficas |

```js
Math.abs(-8)          // 8
Math.sign(-8)         // -1
Math.min(4, 1, 9)     // 1
Math.max(4, 1, 9)     // 9
Math.floor(4.9)       // 4
Math.ceil(4.1)        // 5
Math.round(4.5)       // 5
Math.trunc(-4.9)      // -4
Math.pow(2, 3)        // 8
2 ** 3                // 8
Math.sqrt(81)         // 9
Math.cbrt(27)         // 3
Math.hypot(3, 4)      // 5
```

### Trigonometría y logaritmos

`Math.sin`, `Math.cos` y `Math.tan` reciben radianes. `Math.asin`, `Math.acos` y `Math.atan` hacen la operación inversa; `Math.atan2(y, x)` conserva el cuadrante. `Math.log`, `Math.log2` y `Math.log10` cubren logaritmos comunes.

```js
const degrees = 180
const radians = degrees * (Math.PI / 180)

Math.sin(radians) // aproximadamente 0
Math.cos(0)       // 1
Math.log2(8)      // 3
Math.log10(1000)  // 3
```

## Patrones matemáticos frecuentes

### Limitar un valor

```js
function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

clamp(120, 0, 100) // 100
clamp(-5, 0, 100)  // 0
clamp(40, 0, 100)  // 40
```

### Entero aleatorio dentro de un rango

```js
function randomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

randomInteger(1, 6) // uno de: 1, 2, 3, 4, 5 o 6
```

`Math.random()` no es seguro para tokens, contraseñas, códigos de recuperación ni decisiones de seguridad. En el navegador usa `crypto.getRandomValues()` o `crypto.randomUUID()`.

```js
crypto.randomUUID()
// ejemplo: 'c5947b4a-18c1-4c0a-a8bb-80cf9e442f06'
```

## `BigInt`

`BigInt` representa enteros de tamaño arbitrario. Se crea con el sufijo `n` o con `BigInt()`. No puede mezclarse directamente con `Number`, no admite decimales y `JSON.stringify` necesita una estrategia explícita.

```js
const largeId = 9_007_199_254_740_993n

largeId + 2n          // 9007199254740995n
largeId * 10n         // 90071992547409930n
BigInt('123456789')   // 123456789n
// largeId + 2        // TypeError: no mezcla BigInt y Number
```

## Caso de uso: calcular paginación

```js
function getPagination(totalItems, pageSize, currentPage) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
  const page = Math.min(Math.max(currentPage, 1), totalPages)

  return {
    page,
    totalPages,
    offset: (page - 1) * pageSize,
  }
}

getPagination(53, 10, 9)
// { page: 6, totalPages: 6, offset: 50 }
```
