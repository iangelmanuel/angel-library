---
title: Date, RegExp e Intl
description: Fechas, patrones y formato internacional con métodos, resultados visibles, límites y casos de uso.
category: general
stack: javascript
order: 11
tags: [javascript, date, regexp, intl, localization]
scope: APIs nativas del lenguaje
related:
  - guides/javascript-strings
  - guides/javascript-numbers-math
  - guides/javascript-built-ins
updatedAt: 2026-08-18
---

## `Date`: un instante en el tiempo

`Date` guarda un número de milisegundos desde el 1 de enero de 1970 en UTC. Sus métodos pueden interpretar o mostrar el mismo instante en UTC o en la zona local. No modela por sí sola una zona horaria permanente ni una fecha de calendario sin hora.

```js
const instant = new Date('2026-08-18T15:30:00.000Z')

instant.getTime()      // 1787067000000
instant.toISOString()  // '2026-08-18T15:30:00.000Z'
instant.toJSON()       // '2026-08-18T15:30:00.000Z'
```

## Crear, leer y cambiar fechas

| API | Devuelve | Muta | Caso de uso |
| --- | --- | --- | --- |
| `new Date()` | Date con el instante actual | no aplica | registrar el momento actual |
| `new Date(value)` | Date desde texto o milisegundos | no aplica | convertir un instante |
| `Date.now()` | milisegundos actuales | no | medir o guardar timestamp |
| `Date.parse(text)` | milisegundos o `NaN` | no | interpretar texto ISO |
| `Date.UTC(...)` | milisegundos UTC | no | construir sin zona local |
| `getTime()` | milisegundos | no | comparar o calcular duración |
| `getFullYear()`, `getMonth()`, `getDate()` | componentes locales | no | leer calendario local |
| `getUTCFullYear()`, `getUTCMonth()`, `getUTCDate()` | componentes UTC | no | leer calendario UTC |
| `setDate()`, `setMonth()`, etc. | timestamp | **sí** | modificar la instancia existente |
| `toISOString()` | string ISO en UTC | no | transportar un instante |

```js
const date = new Date('2026-01-31T00:00:00.000Z')
const copy = new Date(date)

copy.setUTCDate(copy.getUTCDate() + 1)

copy.toISOString() // '2026-02-01T00:00:00.000Z'
date.toISOString() // '2026-01-31T00:00:00.000Z'
```

Los meses numéricos empiezan en cero: enero es `0` y diciembre es `11`. Para evitar interpretaciones distintas, intercambia instantes con ISO 8601 completo y zona explícita, como `2026-08-18T15:30:00Z`.

### Validar una fecha

```js
function isValidDate(value) {
  return value instanceof Date && !Number.isNaN(value.getTime())
}

isValidDate(new Date('2026-08-18')) // true
isValidDate(new Date('invalid'))    // false
```

## `RegExp`: buscar patrones

Una expresión regular describe un patrón de texto. Es útil para búsqueda, extracción y reemplazo; una validación de negocio compleja suele necesitar además reglas normales de JavaScript.

| Bandera | Significado |
| --- | --- |
| `g` | todas las coincidencias |
| `i` | ignora mayúsculas y minúsculas |
| `m` | `^` y `$` trabajan por línea |
| `s` | `.` también incluye saltos de línea |
| `u` | semántica Unicode |
| `y` | búsqueda desde `lastIndex` de forma estricta |
| `d` | añade índices de las coincidencias |

| API | Devuelve | Muta estado | Caso de uso |
| --- | --- | --- | --- |
| `regexp.test(text)` | booleano | puede cambiar `lastIndex` con `g` o `y` | comprobar coincidencia |
| `regexp.exec(text)` | array o `null` | puede cambiar `lastIndex` | extraer grupos e índice |
| `text.match(regexp)` | array o `null` | no cambia el string | extraer una o varias coincidencias |
| `text.matchAll(regexp)` | iterador | no cambia el string | recorrer grupos de todas las coincidencias |
| `text.search(regexp)` | índice o `-1` | no | localizar la primera coincidencia |
| `text.replace(regexp, value)` | string nuevo | no | transformar texto |
| `text.split(regexp)` | array | no | dividir con un patrón |

```js
const pattern = /(?<code>[A-Z]{2})-(?<number>\d{3})/
const result = pattern.exec('Pedido CO-418 listo')

result?.[0]          // 'CO-418'
result?.index        // 7
result?.groups?.code // 'CO'
result?.groups?.number // '418'
pattern.test('Sin código') // false
```

### Obtener todas las coincidencias

```js
const text = 'IDs: AB-100, CO-418 y MX-007'
const matches = [...text.matchAll(/(?<code>[A-Z]{2})-(?<id>\d{3})/g)]
  .map(match => match.groups)

matches
// [
//   { code: 'AB', id: '100' },
//   { code: 'CO', id: '418' },
//   { code: 'MX', id: '007' }
// ]
```

Evita expresiones con retroceso catastrófico sobre texto no confiable. Limita el tamaño de entrada, simplifica cuantificadores ambiguos y prueba casos adversos cuando una regex se ejecute en servidor.

## `Intl`: presentar según idioma y región

`Intl` usa datos de localización del runtime. Separa el valor de su presentación: conserva números y fechas como datos, y formatea al final para la interfaz.

| Constructor | Resuelve |
| --- | --- |
| `Intl.NumberFormat` | números, moneda, porcentajes y unidades |
| `Intl.DateTimeFormat` | fecha y hora con zona explícita |
| `Intl.RelativeTimeFormat` | “hace 2 días” o “dentro de 1 hora” |
| `Intl.ListFormat` | listas con conjunciones del idioma |
| `Intl.Collator` | comparación y orden de texto |
| `Intl.PluralRules` | categoría plural del idioma |
| `Intl.Segmenter` | palabras, frases o grafemas |

### Números, moneda y unidades

```js
const currency = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
})

currency.format(125000) // resultado localizado, por ejemplo: '$ 125.000'

new Intl.NumberFormat('es', {
  style: 'unit',
  unit: 'kilometer-per-hour',
}).format(80)
// resultado localizado, por ejemplo: '80 km/h'
```

### Fecha con zona explícita

```js
const instant = new Date('2026-08-18T15:30:00Z')
const formatter = new Intl.DateTimeFormat('es-CO', {
  dateStyle: 'long',
  timeStyle: 'short',
  timeZone: 'America/Bogota',
})

formatter.format(instant)
// resultado localizado, por ejemplo: '18 de agosto de 2026, 10:30 a. m.'
```

Especificar `timeZone` evita que el servidor y el navegador muestren zonas diferentes por accidente.

### Listas, tiempo relativo y orden

```js
const list = new Intl.ListFormat('es', {
  style: 'long',
  type: 'conjunction',
})

list.format(['HTML', 'CSS', 'JavaScript'])
// 'HTML, CSS y JavaScript'

const relative = new Intl.RelativeTimeFormat('es', { numeric: 'auto' })
relative.format(-1, 'day') // 'ayer'
relative.format(2, 'day')  // 'dentro de 2 días'

const collator = new Intl.Collator('es', { sensitivity: 'base' })
['zorro', 'Árbol', 'avión'].toSorted(collator.compare)
// ['Árbol', 'avión', 'zorro']
```

La puntuación y los espacios exactos pueden variar entre versiones de los datos de localización. Prueba el significado, no una representación demasiado rígida, salvo que tu producto exija un formato contractual.

## Caso de uso: fecha legible y consistente

```js
function formatPublication(iso, locale = 'es-CO') {
  const date = new Date(iso)

  if (Number.isNaN(date.getTime())) {
    return 'Fecha desconocida'
  }

  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    timeZone: 'UTC',
  }).format(date)
}

formatPublication('2026-08-18T15:30:00Z')
// resultado localizado, por ejemplo: '18 ago 2026'

formatPublication('sin-fecha')
// 'Fecha desconocida'
```
