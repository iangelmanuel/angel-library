---
title: Object Utils — pick, omit y compact
description: Seleccionar, excluir y limpiar propiedades de objetos con tipos inferidos, sin mutar el valor original.
category: general
stack: utils
order: 11
tags: [typescript, objects, utilities]
runtime: universal
language: typescript
updatedAt: 2026-08-18
---

## `pick()`

```ts title="lib/object.ts"
export function pick<T extends object, K extends keyof T>(object: T, keys: readonly K[]): Pick<T, K> {
  return Object.fromEntries(keys.filter((key) => key in object).map((key) => [key, object[key]])) as Pick<T, K>;
}
```

## `omit()`

```ts
export function omit<T extends object, K extends keyof T>(object: T, keys: readonly K[]): Omit<T, K> {
  const blocked = new Set<PropertyKey>(keys);
  return Object.fromEntries(Object.entries(object).filter(([key]) => !blocked.has(key))) as Omit<T, K>;
}
```

## `compactObject()`

```ts
export function compactObject<T extends Record<string, unknown>>(object: T) {
  return Object.fromEntries(Object.entries(object).filter(([, value]) => value !== null && value !== undefined));
}
```

`compactObject` conserva `false`, `0` y `''`; eliminarlos con `filter(Boolean)` suele borrar datos válidos.

Estas funciones son superficiales: no clonan ni transforman objetos anidados. Para límites de seguridad —por ejemplo, decidir qué campos puede actualizar una API— prefiere un schema Zod que valide y elimine propiedades desconocidas, no solo `pick()` sobre input no confiable.
