---
title: TypeScript
description: Sistema de tipos estático para JavaScript que mejora diseño, refactor y contratos, sin validar datos en runtime.
type: technologies
order: 1
tags: [typescript, types, javascript]
website: https://www.typescriptlang.org
github: https://github.com/microsoft/TypeScript
related:
  - general/packages/zod
  - general/typescript/typescript-path-aliases
  - architecture/principios/validate-at-boundaries
updatedAt: 2026-08-19
---

## Modelo mental

TypeScript analiza el programa antes de ejecutarlo y luego elimina los tipos. Si un dato llega desde HTTP, storage, variables de entorno o JSON, sigue siendo desconocido hasta validarlo en runtime.

**TypeScript (TS)** es un superconjunto de JavaScript: todo JavaScript válido puede analizarse como TypeScript, pero los tipos añadidos deben transformarse antes de ejecutarse en un runtime de JavaScript. El compilador no cambia automáticamente la lógica ni valida una respuesta de red.

## Tipo estático y valor de runtime

Un **tipo estático** existe durante el análisis. Un **valor de runtime** existe cuando el programa se ejecuta.

```ts
type User = { id: string; name: string }

const response = await fetch("/api/user")
const payload: unknown = await response.json()
```

Anotar directamente `payload as User` solo afirma algo al compilador. Para demostrarlo se comprueban los campos o se usa un esquema de validación.

## Inferencia, anotación y estrechamiento

La **inferencia** permite que TypeScript deduzca un tipo. Una **anotación** lo declara de forma explícita. El **narrowing** o estrechamiento reduce una unión mediante comprobaciones.

```ts
function formatId(id: string | number) {
  if (typeof id === "number") {
    return id.toFixed(0) // Aquí id es number.
  }

  return id.toUpperCase() // Aquí id es string.
}
```

No se necesita anotar cada variable local. Las APIs públicas, parámetros ambiguos y estructuras compartidas se benefician de contratos explícitos.

## Lo que aporta

- Contratos navegables entre módulos.
- Refactors con feedback inmediato.
- Inferencia que reduce documentación repetida.
- Uniones discriminadas para modelar estados válidos.
- Genéricos para conservar relaciones entre inputs y outputs.

## Patrones que valen la pena

```ts
type Result<T> = { ok: true; data: T } | { ok: false; error: string }

function assertNever(value: never): never {
  throw new Error(`Caso no manejado: ${String(value)}`)
}
```

## Reglas prácticas

- Prefiere `unknown` a `any` en límites externos.
- Deja que la inferencia haga el trabajo local; escribe tipos explícitos en APIs públicas.
- Evita casts `as` para silenciar un desacuerdo real.
- Activa el modo estricto y corrige desde el origen.
- Usa esquemas de runtime para datos no confiables y deriva el tipo cuando sea posible.

Los tipos deben volver estados inválidos difíciles de representar, no describir con precisión accidental cada detalle interno.

## `interface`, `type` y genéricos

`interface` describe especialmente bien formas de objetos y puede extenderse. `type` también representa uniones, tuplas y transformaciones. Para la mayoría de objetos ambos funcionan; conviene seguir una convención y elegir por capacidad, no por dogma.

Un **genérico** conserva una relación entre tipos:

```ts
function first<T>(items: readonly T[]): T | undefined {
  return items[0]
}

const name = first(["Ana", "Luis"]) // string | undefined
```

`T` no significa “cualquier cosa sin control”; representa el tipo concreto inferido para esa llamada. El retorno conserva ese vínculo.

## Unión discriminada

Una propiedad literal compartida permite modelar estados mutuamente excluyentes:

```ts
type RequestState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; message: string }
```

Solo el estado `success` contiene `data`. Esto evita combinaciones ambiguas como `isLoading: true` junto con un error activo.
