---
title: Object Utils — pick, omit y compact
description: Seleccionar, excluir y limpiar propiedades de objetos con tipos inferidos, sin mutar el valor original.
type: utilities
order: 11
tags: [typescript, objects, utilities]
runtime: universal
language: typescript
updatedAt: 2026-08-18
---

Utilidades mínimas para transformar objetos sin mutar el original. Importa siempre desde `@/libs/object`.

## Seleccionar propiedades

### `pick()` — Seleccionar propiedades

Selecciona un subconjunto de propiedades de un objeto, devolviendo un nuevo objeto tipado con solo esas claves. Las claves pedidas que no existen en el objeto original se omiten en vez de aparecer como `undefined`.

```ts title="lib/object.ts"
export function pick<T extends object, K extends keyof T>(
  object: T,
  keys: readonly K[]
): Pick<T, K> {
  return Object.fromEntries(
    keys.filter((key) => key in object).map((key) => [key, object[key]])
  ) as Pick<T, K>
}
```

### `omit()` — Excluir propiedades

Devuelve un nuevo objeto con todas las propiedades del original salvo las claves indicadas — el complemento de `pick()`: en vez de listar qué conservar, listás qué excluir.

```ts
export function omit<T extends object, K extends keyof T>(
  object: T,
  keys: readonly K[]
): Omit<T, K> {
  const blocked = new Set<PropertyKey>(keys)
  return Object.fromEntries(
    Object.entries(object).filter(([key]) => !blocked.has(key))
  ) as Omit<T, K>
}
```

## Limpiar valores

### `compactObject()` — Limpiar valores vacíos

Elimina las propiedades cuyo valor es `null` o `undefined`, dejando el resto intacto. Útil para limpiar un objeto de opciones antes de mandarlo a una API que rechaza claves vacías o `undefined` explícito.

```ts
export function compactObject<T extends Record<string, unknown>>(object: T) {
  return Object.fromEntries(
    Object.entries(object).filter(
      ([, value]) => value !== null && value !== undefined
    )
  )
}
```

`compactObject` conserva `false`, `0` y `''`; eliminarlos con `filter(Boolean)` suele borrar datos válidos.

## Resumen

| Función           | Qué hace                                              |
| ----------------- | ----------------------------------------------------- |
| `pick()`          | Nuevo objeto con solo las claves indicadas            |
| `omit()`          | Nuevo objeto con todas las claves salvo las indicadas |
| `compactObject()` | Quita propiedades `null` o `undefined`                |

## Consideraciones

- Estas funciones son superficiales: no clonan ni transforman objetos anidados.
- Para límites de seguridad —por ejemplo, decidir qué campos puede actualizar una API— prefiere un schema Zod que valide y elimine propiedades desconocidas, no solo `pick()` sobre input no confiable.
- Ninguna muta el objeto original: siempre devuelven uno nuevo.
