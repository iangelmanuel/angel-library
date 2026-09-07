---
title: JSON.parse seguro con Result
description: Parsear JSON sin try/catch repetido y conservar el error para decidir fallback, logging o respuesta HTTP.
type: tricks
order: 13
tags: [typescript, json, errors, validation]
problem: JSON.parse lanza excepciones y obliga a repetir try/catch en storage, requests y archivos.
related:
  - general/utils/storage
  - general/packages/zod
updatedAt: 2026-08-18
---

```ts title="lib/json.ts"
type Result<T> = { ok: true; data: T } | { ok: false; error: SyntaxError }

export function safeJsonParse<T = unknown>(input: string): Result<T> {
  try {
    return { ok: true, data: JSON.parse(input) as T }
  } catch (error) {
    return {
      ok: false,
      error:
        error instanceof SyntaxError ? error : new SyntaxError("JSON inválido")
    }
  }
}
```

```ts
const result = safeJsonParse(localStorage.getItem("settings") ?? "")
if (!result.ok) localStorage.removeItem("settings")
```

El genérico solo ayuda al editor; no valida la estructura. Si el JSON cruza un límite de confianza, parsealo como `unknown` y pasalo por Zod antes de usarlo.
