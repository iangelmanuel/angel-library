---
title: Fetch Utils — Referencia rápida
description: Wrapper tipado sobre fetch con manejo de errores HTTP, timeout y reintentos, sin librerías.
category: general
runtime: universal
language: typescript
related:
  - libraries/zod
updatedAt: 2026-08-15
---

Utilidades mínimas sobre `fetch`. Importa siempre desde `@/lib/fetch`.

`fetch` no lanza en respuestas 4xx/5xx, no tiene timeout nativo y no reintenta — estas funciones cubren esos tres huecos sin traer axios ni ky.

## Errores HTTP

### `HttpError` — Error tipado de respuesta

Clase de error para respuestas no exitosas. Guarda el `status`, el `statusText` y el cuerpo de la respuesta (como texto) para poder inspeccionarlo en el `catch`.

```ts title="lib/fetch.ts"
export class HttpError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    public body: unknown
  ) {
    super(`HTTP ${status}: ${statusText}`)
    this.name = 'HttpError'
  }
}
```

### `fetchJson()` — Fetch con JSON y errores

Hace el `fetch`, lanza `HttpError` si la respuesta no es `ok`, y parsea el body como JSON tipado con el genérico `T`. Evita repetir el `if (!res.ok) throw` en cada llamada.

```ts title="lib/fetch.ts"
export async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, init)
  if (!response.ok) {
    const body = await response.text().catch(() => undefined)
    throw new HttpError(response.status, response.statusText, body)
  }
  return response.json() as Promise<T>
}
```

```ts
import { fetchJson, HttpError } from '@/lib/fetch';

interface Usuario {
  id: string;
  email: string;
}

try {
  const usuario = await fetchJson<Usuario>('/api/usuario');
} catch (error) {
  if (error instanceof HttpError && error.status === 404) {
    // usuario no encontrado
  }
}
```

## Timeout y reintentos

### `fetchWithTimeout()` — Fetch con límite de tiempo

Envuelve `fetch` con un `AbortController` que cancela la petición si no responde dentro de `timeoutMs`. Sin esto, una petición colgada nunca termina.

```ts title="lib/fetch.ts"
export async function fetchWithTimeout(
  url: string,
  init: RequestInit = {},
  timeoutMs = 8000
): Promise<Response> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), timeoutMs)

  try {
    return await fetch(url, { ...init, signal: controller.signal })
  } finally {
    clearTimeout(timeout)
  }
}
```

```ts
import { fetchWithTimeout } from '@/lib/fetch';

const respuesta = await fetchWithTimeout('/api/lento', {}, 5000);
```

### `withRetry()` — Reintentar una función async

Reintenta una función async hasta `attempts` veces, con una pequeña espera entre intento e intento. No es específica de `fetch`: sirve para cualquier operación async que pueda fallar de forma transitoria.

```ts title="lib/fetch.ts"
export async function withRetry<T>(
  fn: () => Promise<T>,
  attempts = 3,
  delayMs = 300
): Promise<T> {
  let lastError: unknown

  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error
      if (attempt < attempts) {
        await new Promise((resolve) => setTimeout(resolve, delayMs * attempt))
      }
    }
  }

  throw lastError
}
```

```ts
import { fetchJson, withRetry } from '@/lib/fetch';

const datos = await withRetry(() => fetchJson('/api/datos'));
```

## Resumen

| Función | Qué hace |
| --- | --- |
| `HttpError` | Error tipado con status, statusText y body |
| `fetchJson()` | Fetch + parseo JSON tipado, lanza `HttpError` si falla |
| `fetchWithTimeout()` | Fetch que se cancela solo si tarda demasiado |
| `withRetry()` | Reintentar cualquier función async con espera entre intentos |

## Consideraciones

- Combiná `fetchJson()` con [Zod](/libraries/zod) para validar la forma real de la respuesta, no solo tiparla — el genérico `T` no valida nada en runtime.
- `withRetry()` reintenta cualquier error, incluidos los que nunca se van a resolver reintentando (ej. 400 por payload inválido). Filtrá vos el error dentro de `fn` si solo querés reintentar fallos de red o 5xx.
- El `delayMs` crece linealmente con el intento (`delayMs * attempt`), no exponencialmente — para casos con mucho tráfico considera un backoff exponencial en su lugar.
