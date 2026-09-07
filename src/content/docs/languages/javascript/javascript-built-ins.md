---
title: Mapa de tipos y APIs nativas de JavaScript
description: Índice para encontrar métodos por intención, distinguir lenguaje y navegador, y comprobar retorno, mutación y compatibilidad.
type: guides
order: 7
tags: [javascript, methods, built-ins, reference]
scope: mapa de referencia
related:
  - languages/javascript/javascript-strings
  - languages/javascript/javascript-numbers-math
  - languages/javascript/javascript-arrays-objects
  - languages/javascript/javascript-objects
  - languages/javascript/javascript-collections
  - languages/javascript/javascript-date-regexp-intl
  - languages/javascript/javascript-errors-debugging
  - languages/javascript/javascript-prototypes-classes
  - languages/javascript/javascript-iterators-generators
  - languages/javascript/javascript-binary-data
  - languages/javascript/javascript-browser-constructors
updatedAt: 2026-08-25
---

## Para aprender y para consultar

Si estás aprendiendo, recorre esta sección en orden: texto, números, arrays, objetos y colecciones. Si vienes a recordar una API, comienza por la intención y abre su documento.

Cada referencia responde cinco preguntas:

1. ¿Sobre qué valor se llama?
2. ¿Qué argumentos recibe?
3. ¿Qué devuelve exactamente?
4. ¿Muta el valor original?
5. ¿Qué caso de uso justifica elegirla frente a una alternativa?

```js
const source = [3, 1, 2]
const result = source.toSorted((a, b) => a - b)

result // [1, 2, 3]  ← retorno
source // [3, 1, 2]  ← no mutó
```

## Buscar por tipo de valor

| Valor o API                           | Documento                                                                                   | Preguntas que resuelve                                        |
| ------------------------------------- | ------------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| `String`                              | [Strings](/languages/javascript/javascript-strings)                                         | buscar, cortar, reemplazar, normalizar y trabajar con Unicode |
| `Number`, `BigInt`, `Math`            | [Números y Math](/languages/javascript/javascript-numbers-math)                             | convertir, validar, redondear, calcular y manejar precisión   |
| `Array`                               | [Arrays](/languages/javascript/javascript-arrays-objects)                                   | transformar, filtrar, buscar, ordenar, acumular y copiar      |
| `Object`                              | [Objetos](/languages/javascript/javascript-objects)                                         | claves, desestructuración, copia, agrupación y descriptores   |
| `Map`, `Set`, `WeakMap`, `WeakSet`    | [Colecciones](/languages/javascript/javascript-collections)                                 | índices dinámicos, unicidad y referencias débiles             |
| `Date`, `RegExp`, `Intl`              | [Fecha, patrones e internacionalización](/languages/javascript/javascript-date-regexp-intl) | instantes, coincidencias y presentación localizada            |
| `Error`                               | [Errores y depuración](/languages/javascript/javascript-errors-debugging)                   | lanzar, capturar, clasificar, agregar causa y limpiar         |
| `Promise`                             | [Código asíncrono](/languages/javascript/javascript-async-promises)                         | esperar, combinar, cancelar y manejar carreras                |
| `ArrayBuffer`, TypedArray, `DataView` | [Datos binarios](/languages/javascript/javascript-binary-data)                              | bytes, vistas, endianness, transferencia y memoria compartida |
| `Iterator`, generators                | [Iteradores](/languages/javascript/javascript-iterators-generators)                         | producir, transformar y consumir valores bajo demanda         |
| `Symbol`, `Proxy`, `Reflect`          | [Metaprogramación](/languages/javascript/javascript-advanced-language)                      | personalizar protocolos e interceptar operaciones             |

## Buscar por intención

| Quiero…                                 | Empieza por                                                       |
| --------------------------------------- | ----------------------------------------------------------------- |
| comprobar tipo                          | `typeof`, `Array.isArray`, `Number.isFinite`, `instanceof`        |
| convertir entrada                       | `String`, `Number`, `BigInt`, `Boolean`, `parseInt`, `parseFloat` |
| usar un valor predeterminado            | `??`, parámetros predeterminados o desestructuración              |
| copiar sin mutar el primer nivel        | spread, `slice`, `toSorted`, `toSpliced`, `with`                  |
| clonar datos compatibles profundamente  | `structuredClone`                                                 |
| transformar todos los elementos         | `map`                                                             |
| conservar algunos elementos             | `filter`                                                          |
| encontrar uno                           | `find` o `findLast`                                               |
| comprobar una condición                 | `some` o `every`                                                  |
| acumular                                | `reduce` o un `for...of` explícito                                |
| eliminar duplicados                     | `new Set(values)`                                                 |
| agrupar                                 | `Object.groupBy` o `Map.groupBy`                                  |
| indexar por una clave de cualquier tipo | `Map`                                                             |
| ordenar texto para personas             | `Intl.Collator`                                                   |
| formatear moneda, fecha o unidades      | `Intl.NumberFormat`, `Intl.DateTimeFormat`                        |
| escapar texto para construir una RegExp | `RegExp.escape` en runtimes compatibles                           |
| procesar una fuente sin materializarla  | generator o Iterator helpers                                      |
| combinar tareas asíncronas              | `Promise.all`, `allSettled`, `any` o `race`                       |

## Instancia, método estático y prototype

Estas llamadas se parecen, pero viven en lugares distintos:

```js
Array.isArray(value) // método estático de Array
array.map(callback) // método heredado de Array.prototype
new Map(entries) // construcción de una instancia
Object.keys(object) // método estático que recibe un objeto
```

| Forma                | Lectura correcta                             |
| -------------------- | -------------------------------------------- |
| `Type.method(value)` | utilidad del constructor o namespace         |
| `value.method()`     | método disponible en la cadena de prototypes |
| `new Type()`         | crear una instancia construible              |
| `property`           | dato; no se invoca con `()`                  |

`Math` y `JSON` son namespaces: no se crean con `new`. `Symbol` y `BigInt` se llaman como funciones, pero tampoco son constructores.

## Valores y funciones globales

El objeto global cambia de nombre entre runtimes (`window`, `self`, `global`), pero `globalThis` ofrece una referencia estándar cuando realmente necesitas acceder a él.

| Global                                     | Uso                              | Recomendación                                                 |
| ------------------------------------------ | -------------------------------- | ------------------------------------------------------------- |
| `globalThis`                               | objeto global del entorno actual | evita depender de `window` en código compartido               |
| `undefined`, `NaN`, `Infinity`             | valores especiales               | normalmente aparecen como resultado, no se construyen         |
| `parseInt`, `parseFloat`                   | conversión parcial desde texto   | prefiere `Number.parseInt` y `Number.parseFloat` por claridad |
| `isNaN`, `isFinite`                        | comprobación con coerción        | prefiere `Number.isNaN` y `Number.isFinite`                   |
| `encodeURI`, `decodeURI`                   | URI completa                     | no codifica separadores estructurales                         |
| `encodeURIComponent`, `decodeURIComponent` | componente de una URI            | útil para una pieza; `URLSearchParams` suele ser más seguro   |
| `structuredClone`                          | clonación estructurada           | conserva varios built-ins y ciclos; no clona funciones        |

```js
globalThis.setTimeout === setTimeout // true en runtimes que exponen timer global

Number.isFinite("10") // false
isFinite("10") // true por coerción

encodeURIComponent("css & js")
// 'css%20%26%20js'

new URLSearchParams({ topic: "css & js" }).toString()
// 'topic=css+%26+js'
```

`eval(code)` y `Function(code)` interpretan texto como código. Dificultan optimización y análisis, y pueden convertir datos no confiables en ejecución arbitraria. No son parsers de JSON, expresiones matemáticas ni plantillas; usa una herramienta diseñada para el formato permitido.

## Elegir una estructura de datos

| Necesidad                                    | Estructura inicial |
| -------------------------------------------- | ------------------ |
| secuencia ordenada con índices               | `Array`            |
| entidad con campos conocidos                 | objeto             |
| pares con claves dinámicas o no string       | `Map`              |
| pertenencia y valores únicos                 | `Set`              |
| metadata que no debe mantener vivo un objeto | `WeakMap`          |
| bytes y números de tamaño fijo               | TypedArray         |
| secuencia lazy o potencialmente infinita     | iterador           |

No elijas por costumbre. Un array de objetos puede ser fácil de renderizar, pero buscar repetidamente por `id` es más directo con un `Map`. Un `Set` expresa pertenencia mejor que `array.includes` cuando hay muchas consultas.

## Retorno y mutación

Los nombres no siempre revelan si una operación modifica el receptor:

| Muta                            | Alternativa sin mutación                  |
| ------------------------------- | ----------------------------------------- |
| `sort()`                        | `toSorted()`                              |
| `reverse()`                     | `toReversed()`                            |
| `splice()`                      | `toSpliced()`                             |
| asignar `array[index]`          | `array.with(index, value)`                |
| `Object.assign(target, source)` | `Object.assign({}, source)` o spread      |
| `map.set`, `set.add`            | crear otra colección y modificar la copia |

Una operación “sin mutación” puede conservar referencias internas. Spread, `slice`, `map` y los métodos `to...` realizan copias superficiales.

## Callbacks: firma y errores comunes

Muchos métodos reciben `(value, index, collection)`. No pases una función existente sin verificar cómo interpreta todos los argumentos.

```js
;["10", "11", "12"].map(Number)[
  // [10, 11, 12]

  ("10", "11", "12")
].map(Number.parseInt)
// [10, NaN, 1]
```

`map` entrega índice como segundo argumento y `parseInt` lo interpreta como radix. Expresa la intención:

```js
;["10", "11", "12"].map((value) => Number.parseInt(value, 10))
// [10, 11, 12]
```

## Compatibilidad de APIs modernas

La especificación ECMAScript publica ediciones anuales, pero tu producto se ejecuta en versiones concretas de navegadores o runtimes. Entre las APIs recientes estables están Iterator helpers, `RegExp.escape`, `Promise.try` y `Float16Array` en ECMAScript 2025, además de `Math.sumPrecise`, `Iterator.concat`, `Error.isError`, `Array.fromAsync`, conversiones de `Uint8Array`, upsert de Map y mejoras de JSON en ECMAScript 2026. La gestión explícita de recursos y Temporal están previstas para ECMAScript 2027.

Antes de adoptar una API:

1. comprueba los runtimes declarados por el proyecto;
2. revisa compatibilidad en documentación oficial;
3. decide si necesitas transpilar, polyfill o una implementación equivalente;
4. añade una prueba en el entorno mínimo soportado.

## Método de consulta rápida

Cuando olvides una API, evita buscar solo su nombre. Formula la pregunta completa:

```text
Quiero ordenar números sin mutar el array original.
```

Eso conduce a `toSorted((a, b) => a - b)` y deja claras las tres decisiones: intención, comparación numérica y ausencia de mutación.
