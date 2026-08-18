---
title: TypeScript
description: Sistema de tipos estático para JavaScript que mejora diseño, refactor y contratos, sin validar datos en runtime.
category: general
tags: [typescript, types, javascript]
website: https://www.typescriptlang.org
github: https://github.com/microsoft/TypeScript
related:
  - libraries/zod
  - guides/typescript-path-aliases
  - practices/validate-at-boundaries
updatedAt: 2026-08-18
---

## Modelo mental

TypeScript analiza el programa antes de ejecutarlo y luego elimina los tipos. Si un dato llega desde HTTP, storage, variables de entorno o JSON, sigue siendo desconocido hasta validarlo en runtime.

## Lo que aporta

- Contratos navegables entre módulos.
- Refactors con feedback inmediato.
- Inferencia que reduce documentación repetida.
- Uniones discriminadas para modelar estados válidos.
- Genéricos para conservar relaciones entre inputs y outputs.

## Patrones que valen la pena

```ts
type Result<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };

function assertNever(value: never): never {
  throw new Error(`Caso no manejado: ${String(value)}`);
}
```

## Reglas prácticas

- Prefiere `unknown` a `any` en límites externos.
- Deja que la inferencia haga el trabajo local; escribe tipos explícitos en APIs públicas.
- Evita casts `as` para silenciar un desacuerdo real.
- Activá modo estricto y corregí desde el origen.
- Usa schemas de runtime para datos no confiables y derivá el tipo cuando sea posible.

Los tipos deben volver estados inválidos difíciles de representar, no describir con precisión accidental cada detalle interno.
