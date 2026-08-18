---
title: Strings y procesamiento de texto
description: Creación, búsqueda, extracción, reemplazo, Unicode y formato de strings con tablas, resultados y casos de uso.
category: general
stack: javascript
order: 6
tags: [javascript, strings, text, unicode, regexp]
scope: tipos y métodos
related:
  - guides/javascript-built-ins
  - guides/javascript-date-regexp-intl
  - guides/javascript-url-web-apis
updatedAt: 2026-08-18
---

## Modelo mental

Un string es una secuencia de texto **inmutable**. Ningún método modifica el valor original: cada transformación devuelve un string, un array, un número o un resultado nuevo. Puedes crearlo con comillas simples, dobles o template literals.

```js
const name = 'Mara'
const message = `Hola, ${name.toUpperCase()}`

message // 'Hola, MARA'
name    // 'Mara': no cambió
```

## Consultar y buscar

| Método o propiedad | Devuelve | Muta | Caso de uso |
| --- | --- | --- | --- |
| `length` | número de unidades UTF-16 | no | validar longitud aproximada |
| `at(index)` | carácter o `undefined` | no | leer posiciones, incluidas negativas |
| `charAt(index)` | carácter o `''` | no | compatibilidad con código antiguo |
| `includes(text)` | booleano | no | saber si contiene un fragmento |
| `startsWith(text)` | booleano | no | comprobar prefijos |
| `endsWith(text)` | booleano | no | comprobar extensiones o sufijos |
| `indexOf(text)` | primera posición o `-1` | no | localizar una coincidencia |
| `lastIndexOf(text)` | última posición o `-1` | no | localizar desde el final |
| `search(regexp)` | posición o `-1` | no | buscar con patrón |

```js
const file = 'report.final.pdf'

file.length               // 16
file.at(0)                // 'r'
file.at(-1)               // 'f'
file.includes('final')    // true
file.startsWith('report') // true
file.endsWith('.pdf')     // true
file.indexOf('.')         // 6
file.lastIndexOf('.')     // 12
file.search(/FINAL/i)     // 7
```

## Extraer y combinar

| Método | Devuelve | Muta | Nota |
| --- | --- | --- | --- |
| `slice(start, end?)` | fragmento nuevo | no | acepta índices negativos |
| `substring(start, end?)` | fragmento nuevo | no | convierte negativos a cero |
| `split(separator, limit?)` | array | no | divide el texto |
| `concat(...values)` | string nuevo | no | suele ser más legible usar templates |
| `repeat(count)` | string repetido | no | separadores o contenido repetido |

```js
const route = '/products/keyboard'

route.slice(1, 9)        // 'products'
route.slice(-8)          // 'keyboard'
route.substring(1, 9)    // 'products'
route.split('/')         // ['', 'products', 'keyboard']
'JS'.repeat(3)           // 'JSJSJS'
'Hola'.concat(' ', 'Ana') // 'Hola Ana'
```

Para construir texto con variables, los template literals suelen comunicar mejor la intención:

```js
const product = 'Monitor'
const price = 350
const summary = `${product}: $${price}`

summary // 'Monitor: $350'
```

## Limpiar y normalizar

| Método | Resultado | Muta | Caso de uso |
| --- | --- | --- | --- |
| `trim()` | elimina espacios en ambos extremos | no | limpiar formularios |
| `trimStart()` | elimina espacios iniciales | no | entradas alineadas |
| `trimEnd()` | elimina espacios finales | no | líneas de archivos |
| `toLowerCase()` | texto en minúsculas | no | comparación simple |
| `toUpperCase()` | texto en mayúsculas | no | presentación o códigos |
| `normalize(form?)` | forma Unicode normalizada | no | comparar texto equivalente |
| `padStart(length, fill?)` | relleno al inicio | no | ids y horas |
| `padEnd(length, fill?)` | relleno al final | no | columnas de texto |

```js
const raw = '  JavaScript  '

raw.trim()              // 'JavaScript'
raw.trimStart()         // 'JavaScript  '
raw.toLowerCase()       // '  javascript  '
'7'.padStart(3, '0')    // '007'
'9'.padEnd(3, '.')      // '9..'

const composed = 'é'
const decomposed = 'e\u0301'
composed === decomposed                      // false
composed.normalize() === decomposed.normalize() // true
```

## Reemplazar y trabajar con patrones

| Método | Devuelve | Muta | Diferencia |
| --- | --- | --- | --- |
| `replace(search, value)` | string nuevo | no | reemplaza la primera coincidencia; con regex global, todas |
| `replaceAll(search, value)` | string nuevo | no | reemplaza todas las coincidencias de texto |
| `match(regexp)` | array, coincidencia o `null` | no | extrae coincidencias |
| `matchAll(regexp)` | iterador de coincidencias | no | conserva grupos e índices de todas |

```js
const sentence = 'rojo, rojo y azul'

sentence.replace('rojo', 'verde')
// 'verde, rojo y azul'

sentence.replaceAll('rojo', 'verde')
// 'verde, verde y azul'

'Pedido AB-123'.match(/[A-Z]{2}-\d{3}/)?.[0]
// 'AB-123'
```

`replace` puede recibir una función. Resulta útil cuando el valor depende de cada coincidencia:

```js
const text = 'subtotal 40, impuesto 8'
const doubled = text.replace(/\d+/g, value => String(Number(value) * 2))

doubled // 'subtotal 80, impuesto 16'
```

### Grupos con nombre

```js
const input = '2026-08-18'
const pattern = /(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/
const result = input.match(pattern)

result?.groups
// { year: '2026', month: '08', day: '18' }
```

## Comparar texto para usuarios

`localeCompare` compara según un locale. Para ordenar muchas cadenas, crea un `Intl.Collator` una sola vez.

```js
const names = ['Ángel', 'ana', 'Carlos']
const collator = new Intl.Collator('es', { sensitivity: 'base' })

names.toSorted(collator.compare)
// ['ana', 'Ángel', 'Carlos']
```

El resultado exacto de una comparación es negativo, cero o positivo; no asumas que siempre será `-1` o `1`.

## Unicode y caracteres visuales

`length` cuenta unidades UTF-16, no siempre caracteres percibidos por una persona. El spread y `Array.from` manejan puntos de código, aunque emojis compuestos pueden seguir ocupando varios elementos.

```js
'😀'.length          // 2
[...'😀'].length     // 1
'👨‍👩‍👧‍👦'.length     // 11
[...'👨‍👩‍👧‍👦'].length // 7: es un único grafema visual
```

Para límites de palabras, frases o grafemas usa `Intl.Segmenter` cuando esté disponible en los runtimes objetivo.

```js
const segmenter = new Intl.Segmenter('es', { granularity: 'grapheme' })
const graphemes = [...segmenter.segment('A👨‍👩‍👧‍👦B')].map(item => item.segment)

graphemes // ['A', '👨‍👩‍👧‍👦', 'B']
```

## Caso de uso: crear un slug

```js
function toSlug(value) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

toSlug('  Guía de JavaScript moderno  ')
// 'guia-de-javascript-moderno'
```

Este slug es práctico para texto latino básico. En un producto internacional, define una política para otros alfabetos y evita asumir que toda URL debe transliterarse de la misma forma.
