---
title: Promise Utils — delay, timeout y concurrencia
description: Helpers pequeños para espera cancelable, timeout de promesas y procesamiento con límite de concurrencia.
category: general
order: 12
tags: [typescript, promises, async, concurrency]
runtime: universal
language: typescript
related:
  - utilities/fetch
updatedAt: 2026-08-18
---

## `delay()` cancelable

```ts title="lib/promise.ts"
export function delay(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) return reject(signal.reason);
    const id = setTimeout(resolve, ms);
    signal?.addEventListener('abort', () => { clearTimeout(id); reject(signal.reason); }, { once: true });
  });
}
```

## Timeout genérico

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

## Procesar por lotes

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
