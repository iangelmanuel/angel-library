---
title: Array Utils — Referencia rápida
description: Utilidades tipadas para dividir, deduplicar, agrupar y generar arrays sin librerías.
category: general
stack: utils
runtime: universal
language: typescript
related:
  - utilities/string
updatedAt: 2026-08-15
---

Utilidades mínimas para trabajar con arrays. Importa siempre desde `@/lib/array`.

Nada de esto depende del DOM: funciona igual en el browser, en Node o en un endpoint de Astro.

## Dividir y agrupar

### `chunk()` — Dividir en bloques

Divide un array en sub-arrays del tamaño indicado. El último bloque puede quedar más corto si la longitud no es múltiplo exacto de `size`. Útil para paginar resultados o renderizar una grilla en filas fijas.

```ts title="lib/array.ts"
export function chunk<T>(array: T[], size: number): T[][] {
  if (size <= 0) return [array]
  const chunks: T[][] = []
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size))
  }
  return chunks
}
```

```ts
import { chunk } from '@/lib/array';

const filas = chunk([1, 2, 3, 4, 5], 2);
// [[1, 2], [3, 4], [5]]
```

### `groupBy()` — Agrupar por clave

Agrupa los elementos de un array en un objeto, usando el valor que devuelve la función `key` como clave de cada grupo. El genérico `K` debe ser un `PropertyKey` (string, number o symbol) para poder usarlo como índice del objeto resultante.

```ts title="lib/array.ts"
export function groupBy<T, K extends PropertyKey>(
  array: T[],
  key: (item: T) => K
): Record<K, T[]> {
  const groups = {} as Record<K, T[]>
  for (const item of array) {
    const groupKey = key(item)
    groups[groupKey] ??= []
    groups[groupKey].push(item)
  }
  return groups
}
```

```ts
import { groupBy } from '@/lib/array';

const porCategoria = groupBy(entradas, (entrada) => entrada.category);
// { frontend: [...], backend: [...] }
```

## Deduplicar

### `unique()` — Sin duplicados

Elimina duplicados de un array de valores primitivos apoyándose en `Set`. Solo compara por igualdad estricta, así que dos objetos con el mismo contenido no se consideran duplicados — para eso usa `uniqueBy()`.

```ts title="lib/array.ts"
export function unique<T>(array: T[]): T[] {
  return [...new Set(array)]
}
```

```ts
import { unique } from '@/lib/array';

const tags = unique(['react', 'astro', 'react']);
// ["react", "astro"]
```

### `uniqueBy()` — Sin duplicados por clave

Elimina duplicados de un array de objetos, comparando por el valor que devuelve la función `key` en vez de por igualdad estricta del objeto completo. Conserva la primera aparición de cada clave.

```ts title="lib/array.ts"
export function uniqueBy<T, K>(array: T[], key: (item: T) => K): T[] {
  const seen = new Set<K>()
  return array.filter((item) => {
    const value = key(item)
    if (seen.has(value)) return false
    seen.add(value)
    return true
  })
}
```

```ts
import { uniqueBy } from '@/lib/array';

const usuarios = uniqueBy(resultados, (usuario) => usuario.email);
```

## Generar

### `range()` — Secuencia numérica

Genera un array de números entre `start` y `end` (sin incluir `end`), con el paso indicado. Con un solo argumento, genera desde 0 hasta ese valor — igual que `range()` en Python.

```ts title="lib/array.ts"
export function range(start: number, end?: number, step = 1): number[] {
  const [from, to] = end === undefined ? [0, start] : [start, end]
  const length = Math.max(Math.ceil((to - from) / step), 0)
  return Array.from({ length }, (_, i) => from + i * step)
}
```

```ts
import { range } from '@/lib/array';

range(5);        // [0, 1, 2, 3, 4]
range(2, 10, 2);  // [2, 4, 6, 8]
```

### `shuffle()` — Orden aleatorio

Devuelve una copia del array con sus elementos en orden aleatorio, usando el algoritmo Fisher-Yates. No muta el array original.

```ts title="lib/array.ts"
export function shuffle<T>(array: T[]): T[] {
  const result = [...array]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}
```

```ts
import { shuffle } from '@/lib/array';

const orden = shuffle(preguntas);
```

## Resumen

| Función | Qué hace |
| --- | --- |
| `chunk()` | Dividir un array en bloques de tamaño fijo |
| `groupBy()` | Agrupar elementos en un objeto según una clave derivada |
| `unique()` | Quitar duplicados de valores primitivos |
| `uniqueBy()` | Quitar duplicados de objetos según una clave derivada |
| `range()` | Generar una secuencia numérica |
| `shuffle()` | Devolver una copia del array en orden aleatorio |

## Consideraciones

- `unique()` compara por igualdad estricta (`===`): sirve para strings, números y booleanos, no para objetos o arrays.
- `groupBy()` y `uniqueBy()` reciben una función `key`, no un nombre de propiedad — así funcionan con cualquier expresión derivada, no solo con `item.campo`.
- Ninguna de estas funciones muta el array original.
