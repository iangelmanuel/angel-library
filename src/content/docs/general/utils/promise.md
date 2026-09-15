---
title: Promise Utils — delay, timeout y concurrencia
description: Helpers pequeños para espera cancelable, timeout de promesas y procesamiento con límite de concurrencia.
tags: [typescript, promises, async, concurrency]
sidebar:
  order: 12
draft: false
language: TypeScript
runtime: Universal
technologies: [general/utils/fetch]
updatedAt: 2026-09-07
---

Utilidades para controlar tiempo y concurrencia en código asíncrono. Copia los bloques en `src/lib/promise.ts` e importa desde su ruta relativa; `@/lib/promise` solo funciona si configuraste ese alias.

## Espera y timeout

### `delay()` — Espera cancelable

Espera la cantidad de milisegundos indicada, como una versión con Promise de `setTimeout`. Acepta un `AbortSignal` opcional para cancelar la espera antes de tiempo, algo que `setTimeout` por sí solo no ofrece.

```ts title="src/lib/promise.ts"
export function delay(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) return reject(signal.reason)
    if (!Number.isFinite(ms) || ms < 0) return reject(new RangeError("ms debe ser finito y no negativo"))
    const onAbort = () => {
      clearTimeout(id)
      reject(signal?.reason)
    }
    const id = setTimeout(() => {
      signal?.removeEventListener("abort", onAbort)
      resolve()
    }, ms)
    signal?.addEventListener("abort", onAbort, { once: true })
  })
}
```

### `withTimeout()` — Timeout genérico

Envuelve cualquier promesa con un límite de tiempo: si no se resuelve antes de `ms`, la promesa devuelta rechaza con un error de timeout.

```ts
export async function withTimeout<T>(
  promise: Promise<T>,
  ms: number
): Promise<T> {
  if (!Number.isFinite(ms) || ms < 0) throw new RangeError("ms debe ser finito y no negativo")
  let timeoutId: ReturnType<typeof setTimeout>
  const timeout = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(
      () => reject(new Error(`Timeout después de ${ms}ms`)),
      ms
    )
  })

  try {
    return await Promise.race([promise, timeout])
  } finally {
    clearTimeout(timeoutId!)
  }
}
```

`Promise.race` deja la operación original corriendo si no soporta cancelación. Para `fetch`, pasa un `AbortSignal`; para una operación de base de datos, usa el timeout del driver.

## Concurrencia

### `mapBatches()` — Procesar por lotes

Procesa un array de forma asíncrona en lotes de tamaño fijo, esperando a que termine cada lote antes de arrancar el siguiente. Evita lanzar cientos de llamadas en paralelo con `Promise.all()` directo, que puede saturar una API o una base de datos.

```ts
export async function mapBatches<T, R>(
  items: T[],
  size: number,
  mapper: (item: T) => Promise<R>
) {
  if (!Number.isInteger(size) || size < 1) throw new RangeError("size debe ser un entero positivo")
  const results: R[] = []
  for (let index = 0; index < items.length; index += size) {
    results.push(
      ...(await Promise.all(items.slice(index, index + size).map(mapper)))
    )
  }
  return results
}
```

Los lotes limitan presión sobre una API o base de datos, aunque no mantienen una cola perfectamente llena. Para trabajos grandes o críticos usa un limitador de concurrencia dedicado y define cómo manejar errores parciales.

## Resumen

| Función         | Qué hace                                       |
| --------------- | ---------------------------------------------- |
| `delay()`       | Espera cancelable con `AbortSignal`            |
| `withTimeout()` | Limita cuánto puede tardar una promesa         |
| `mapBatches()`  | Procesa un array async en lotes de tamaño fijo |

## Comprobación

```ts
console.log(await mapBatches([1, 2, 3], 2, async n => n * 2)) // [2, 4, 6]
console.log(await mapBatches([], 2, async n => n)) // []
await mapBatches([1], 0, async n => n) // rechaza con RangeError; no entra en un bucle infinito
```

Ejecuta el caso inválido por separado o dentro de `try/catch`. En `delay`, prueba una señal ya cancelada y otra que se cancela durante la espera. El listener se elimina también cuando la espera termina normalmente, para no acumular suscripciones al reutilizar una señal.

## Consideraciones

- `withTimeout()` no cancela la promesa original si pierde la carrera contra el timeout — solo deja de esperarla. Si necesitas cancelación real, la operación de base debe soportar un `AbortSignal` (como `fetch`).
- `mapBatches()` espera a que todo el lote termine antes de seguir: un ítem lento en un lote retrasa a todo el lote, no solo a sí mismo.
- Ninguna de estas funciones reintenta errores — combínalas con `withRetry()` de [Fetch Utils](/general/utils/fetch) si necesitas eso además.
