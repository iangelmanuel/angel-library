---
title: Promise Utils — delay, timeout y concurrencia
description: Helpers pequeños para espera cancelable, timeout de promesas y procesamiento con límite de concurrencia.
type: utilities
order: 12
tags: [typescript, promises, async, concurrency]
runtime: universal
language: typescript
related:
  - general/utils/fetch
updatedAt: 2026-08-18
---

Utilidades mínimas para controlar tiempo y concurrencia en código async. Importa siempre desde `@/libs/promise`.

## Espera y timeout

### `delay()` — Espera cancelable

Espera la cantidad de milisegundos indicada, como una versión con Promise de `setTimeout`. Acepta un `AbortSignal` opcional para cancelar la espera antes de tiempo, algo que `setTimeout` por sí solo no ofrece.

```ts title="lib/promise.ts"
export function delay(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) return reject(signal.reason);
    const id = setTimeout(resolve, ms);
    signal?.addEventListener('abort', () => { clearTimeout(id); reject(signal.reason); }, { once: true });
  });
}
```

### `withTimeout()` — Timeout genérico

Envuelve cualquier promesa con un límite de tiempo: si no se resuelve antes de `ms`, la promesa devuelta rechaza con un error de timeout.

```ts
export async function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  let timeoutId: ReturnType<typeof setTimeout>;
  const timeout = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error(`Timeout después de ${ms}ms`)), ms);
  });

  try {
    return await Promise.race([promise, timeout]);
  } finally {
    clearTimeout(timeoutId!);
  }
}
```

`Promise.race` deja la operación original corriendo si no soporta cancelación. Para `fetch`, pasa un `AbortSignal`; para una operación de base de datos, usa el timeout del driver.

## Concurrencia

### `mapBatches()` — Procesar por lotes

Procesa un array de forma asíncrona en lotes de tamaño fijo, esperando a que termine cada lote antes de arrancar el siguiente. Evita lanzar cientos de llamadas en paralelo con `Promise.all()` directo, que puede saturar una API o una base de datos.

```ts
export async function mapBatches<T, R>(items: T[], size: number, mapper: (item: T) => Promise<R>) {
  const results: R[] = [];
  for (let index = 0; index < items.length; index += size) {
    results.push(...await Promise.all(items.slice(index, index + size).map(mapper)));
  }
  return results;
}
```

Los lotes limitan presión sobre una API o base de datos, aunque no mantienen una cola perfectamente llena. Para trabajos grandes o críticos usa un limitador de concurrencia dedicado y define cómo manejar errores parciales.

## Resumen

| Función | Qué hace |
| --- | --- |
| `delay()` | Espera cancelable con `AbortSignal` |
| `withTimeout()` | Limita cuánto puede tardar una promesa |
| `mapBatches()` | Procesa un array async en lotes de tamaño fijo |

## Consideraciones

- `withTimeout()` no cancela la promesa original si pierde la carrera contra el timeout — solo deja de esperarla. Si necesitas cancelación real, la operación de base debe soportar un `AbortSignal` (como `fetch`).
- `mapBatches()` espera a que todo el lote termine antes de seguir: un ítem lento en un lote retrasa a todo el lote, no solo a sí mismo.
- Ninguna de estas funciones reintenta errores — combínalas con `withRetry()` de [Fetch Utils](/general/utils/fetch) si necesitas eso además.
