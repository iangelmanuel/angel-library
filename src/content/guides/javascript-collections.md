---
title: Map, Set y colecciones débiles
description: Colecciones por clave, valores únicos, operaciones de conjuntos y referencias débiles con resultados y casos de uso.
category: general
stack: javascript
order: 10
tags: [javascript, map, set, weakmap, weakset, collections]
scope: tipos y métodos
related:
  - guides/javascript-arrays-objects
  - guides/javascript-objects
  - guides/javascript-built-ins
updatedAt: 2026-08-18
---

## Elegir la colección

| Estructura | Claves o valores | Orden | Caso principal |
| --- | --- | --- | --- |
| `Object` | claves string o symbol | orden definido con reglas propias | registros con campos conocidos |
| `Map` | claves de cualquier tipo | inserción | diccionario dinámico y recorrible |
| `Set` | valores únicos de cualquier tipo | inserción | eliminar duplicados y pertenencia |
| `WeakMap` | claves que sean objetos o symbols no registrados | no recorrible | metadatos privados ligados a un objeto |
| `WeakSet` | objetos o symbols no registrados | no recorrible | marcar objetos sin impedir su recolección |

`Map` y `Set` son mutables. Sus métodos de escritura cambian la instancia; si necesitas conservar el valor anterior, crea otra colección de forma explícita.

## `Map`

| Miembro | Devuelve | Muta | Caso de uso |
| --- | --- | --- | --- |
| `size` | cantidad de entradas | no | conocer el tamaño |
| `set(key, value)` | el mismo Map | **sí** | crear o reemplazar una entrada |
| `get(key)` | valor o `undefined` | no | leer una entrada |
| `has(key)` | booleano | no | comprobar existencia sin confundir `undefined` |
| `delete(key)` | booleano | **sí** | eliminar y saber si existía |
| `clear()` | `undefined` | **sí** | vaciar el Map |
| `keys()` | iterador de claves | no | recorrer claves |
| `values()` | iterador de valores | no | recorrer valores |
| `entries()` | iterador `[key, value]` | no | recorrer pares |
| `forEach(callback)` | `undefined` | no por sí solo | ejecutar un efecto por entrada |

```js
const visits = new Map()

visits.set('home', 3)      // Map(1) {'home' => 3}
visits.set('docs', 8)      // Map(2) {'home' => 3, 'docs' => 8}
visits.get('docs')         // 8
visits.get('missing')      // undefined
visits.has('home')         // true
visits.size                // 2
visits.delete('home')      // true
visits.delete('home')      // false
[...visits.entries()]      // [['docs', 8]]
```

Las claves conservan su tipo y su identidad:

```js
const objectKey = { id: 1 }
const cache = new Map()

cache.set(objectKey, 'resultado')
cache.set(1, 'número')
cache.set('1', 'texto')

cache.get(objectKey) // 'resultado'
cache.get({ id: 1 }) // undefined: es otra referencia
cache.size           // 3
```

### Convertir Map, arrays y objetos

```js
const map = new Map([
  ['theme', 'dark'],
  ['compact', true],
])

Object.fromEntries(map)
// { theme: 'dark', compact: true }

new Map(Object.entries({ page: 1, limit: 20 }))
// Map(2) {'page' => 1, 'limit' => 20}
```

## `Set`

| Miembro | Devuelve | Muta | Caso de uso |
| --- | --- | --- | --- |
| `size` | cantidad de valores | no | conocer el tamaño |
| `add(value)` | el mismo Set | **sí** | añadir si no existe |
| `has(value)` | booleano | no | pertenencia rápida |
| `delete(value)` | booleano | **sí** | quitar un valor |
| `clear()` | `undefined` | **sí** | vaciar el Set |
| `keys()`, `values()` | iterador de valores | no | recorrer valores |
| `entries()` | iterador `[value, value]` | no | compatibilidad con Map |

```js
const tags = new Set(['js', 'web', 'js'])

tags.size       // 2
tags.add('dom') // Set(3) {'js', 'web', 'dom'}
tags.has('web') // true
tags.delete('js') // true
[...tags]       // ['web', 'dom']
```

Eliminar duplicados es una de sus aplicaciones más frecuentes:

```js
const repeated = ['js', 'css', 'js', 'html', 'css']
const unique = [...new Set(repeated)]

unique // ['js', 'css', 'html']
```

Con objetos, la unicidad también depende de la referencia:

```js
new Set([{ id: 1 }, { id: 1 }]).size // 2
const item = { id: 1 }
new Set([item, item]).size            // 1
```

## Operaciones modernas de conjuntos

Los métodos modernos de `Set` devuelven un Set nuevo y no mutan los originales. Comprueba la compatibilidad del runtime que soporta tu proyecto.

| Método | Resultado |
| --- | --- |
| `union(other)` | valores de ambos conjuntos |
| `intersection(other)` | valores presentes en ambos |
| `difference(other)` | valores del primero que no están en el segundo |
| `symmetricDifference(other)` | valores presentes solo en uno |
| `isSubsetOf(other)` | si todos los valores están en el otro |
| `isSupersetOf(other)` | si contiene todos los valores del otro |
| `isDisjointFrom(other)` | si no comparten valores |

```js
const frontend = new Set(['js', 'css', 'html'])
const backend = new Set(['js', 'sql', 'http'])

[...frontend.union(backend)]
// ['js', 'css', 'html', 'sql', 'http']

[...frontend.intersection(backend)]
// ['js']

[...frontend.difference(backend)]
// ['css', 'html']

frontend.isDisjointFrom(new Set(['python'])) // true
```

Si debes soportar un entorno sin estos métodos, combina `filter` y `has`:

```js
const intersection = new Set([...frontend].filter(value => backend.has(value)))

[...intersection] // ['js']
```

## `WeakMap` y `WeakSet`

Las colecciones débiles no se pueden recorrer ni exponen `size`; así el programa no puede observar cuándo el recolector de basura libera una clave. Son apropiadas para asociar información a la vida útil de otro objeto.

```js
const metadata = new WeakMap()
const button = document.querySelector('button')

if (button) {
  metadata.set(button, { clicks: 0 })
  metadata.get(button) // { clicks: 0 }
  metadata.has(button) // true
}
```

No uses `WeakMap` como caché si necesitas listar, contar o invalidar todas sus entradas.

## Caso de uso: contar frecuencias

```js
function countBy(values) {
  const frequencies = new Map()

  for (const value of values) {
    frequencies.set(value, (frequencies.get(value) ?? 0) + 1)
  }

  return frequencies
}

const result = countBy(['error', 'info', 'error', 'warning'])

[...result]
// [['error', 2], ['info', 1], ['warning', 1]]
```
