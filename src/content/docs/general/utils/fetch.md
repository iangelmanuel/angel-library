---
title: Fetch Utils — Referencia rápida
description: Wrapper tipado sobre fetch con manejo de errores HTTP, timeout y reintentos, sin librerías.
type: utilities
tags: [typescript, fetch, http, errors]
runtime: universal
language: typescript
related:
  - general/packages/zod
updatedAt: 2026-09-07
---

Utilidades sobre `fetch` para un entorno con `fetch`, `AbortSignal.timeout` y `AbortSignal.any` (por ejemplo Node.js 22.12+). Copia los bloques en `src/lib/fetch.ts`. Los ejemplos de importación asumen un alias `@/*` hacia `src/*`; usa rutas relativas si no lo tienes.

`fetch` no rechaza por estados HTTP 4xx/5xx ni reintenta automáticamente. Puedes limitar el tiempo mediante una señal de cancelación. Esta referencia distingue errores HTTP, validación del JSON y política de reintentos.

## Errores HTTP

### `HttpError` — Error tipado de respuesta

Clase de error para respuestas no exitosas. Guarda el `status`, el `statusText` y el cuerpo de la respuesta (como texto) para poder inspeccionarlo en el `catch`.

```ts title="src/lib/fetch.ts"
export class HttpError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    public body: unknown
  ) {
    super(`HTTP ${status}: ${statusText}`)
    this.name = "HttpError"
  }
}
```

### `fetchJson()` — Fetch con JSON y errores

Hace la solicitud, comprueba el estado y devuelve JSON como `unknown`. Un tipo genérico no verifica el contenido recibido: valida sus campos antes de usarlos. Este contrato exige un cuerpo JSON y rechaza 204/205; para una eliminación sin contenido usa `fetch` directamente.

```ts title="src/lib/fetch.ts"
export async function fetchJson(
  url: string,
  init?: RequestInit
): Promise<unknown> {
  const response = await fetch(url, init)
  if (!response.ok) {
    const body = await response.text().catch(() => undefined)
    throw new HttpError(response.status, response.statusText, body)
  }
  const type = response.headers.get("content-type")?.split(";")[0].trim().toLowerCase() ?? ""
  if (response.status === 204 || response.status === 205 ||
      !(type === "application/json" || (type.startsWith("application/") && type.endsWith("+json")))) {
    throw new TypeError("Se esperaba una respuesta con cuerpo JSON")
  }
  return response.json()
}
```

```ts
import { HttpError, fetchJson } from "@/lib/fetch"

interface Usuario {
  id: string
  email: string
}

try {
  const payload = await fetchJson("/api/usuario")
  // Validar payload con un esquema de Usuario antes de leer sus propiedades.
} catch (error) {
  if (error instanceof HttpError && error.status === 404) {
    // usuario no encontrado
  }
}
```

## Timeout y reintentos

### `fetchWithTimeout()` — Fetch con límite de tiempo

Combina la cancelación del llamador con un plazo máximo. La señal sigue activa mientras se lee el cuerpo; limpiar un temporizador al recibir solo los encabezados dejaría la lectura del cuerpo fuera del plazo.

```ts title="src/lib/fetch.ts"
export async function fetchWithTimeout(
  url: string,
  init: RequestInit = {},
  timeoutMs = 8000
): Promise<Response> {
  const timeout = AbortSignal.timeout(timeoutMs)
  const signal = init.signal ? AbortSignal.any([init.signal, timeout]) : timeout
  return fetch(url, { ...init, signal })
}
```

```ts
import { fetchWithTimeout } from "@/lib/fetch"

const respuesta = await fetchWithTimeout("/api/lento", {}, 5000)
```

### `withRetry()` — Reintentar una función async

Ejecuta una función hasta `attempts` veces en total. La política `shouldRetry` decide qué errores son transitorios; por defecto no repite operaciones. Úsala solo cuando repetir sea seguro: una lectura o una mutación con idempotencia garantizada por el servidor.

```ts title="src/lib/fetch.ts"
export async function withRetry<T>(
  fn: () => Promise<T>,
  attempts = 3,
  delayMs = 300,
  shouldRetry: (error: unknown) => boolean = () => false
): Promise<T> {
  if (!Number.isInteger(attempts) || attempts < 1) throw new RangeError("attempts debe ser un entero positivo")
  if (!Number.isFinite(delayMs) || delayMs < 0) throw new RangeError("delayMs debe ser finito y no negativo")
  let lastError: unknown

  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      return await fn()
    } catch (error) {
      if (!shouldRetry(error)) throw error
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
import { HttpError, fetchJson, withRetry } from "@/lib/fetch"

const datos = await withRetry(
  () => fetchJson("/api/datos", { signal: AbortSignal.timeout(5000) }),
  3,
  300,
  error => error instanceof HttpError && [502, 503, 504].includes(error.status)
)
```

## Resumen

| Función              | Qué hace                                                     |
| -------------------- | ------------------------------------------------------------ |
| `HttpError`          | Error tipado con status, statusText y body                   |
| `fetchJson()`        | Fetch + JSON como unknown; exige validar sus datos         |
| `fetchWithTimeout()` | Fetch que se cancela solo si tarda demasiado                 |
| `withRetry()`        | Reintentar según una política explícita de errores           |

## Consideraciones

- Combina `fetchJson()` con [Zod](/general/packages/zod) para validar la forma de la respuesta. Un error de esquema se corrige revisando el contrato, no repitiendo la solicitud.
- El ejemplo no reintenta 400, 401, 403, errores de JSON ni cancelaciones. Una política para 429 debe respetar `Retry-After`. La espera de este helper no es cancelable; para un presupuesto global combina una espera cancelable y comprobaciones de señal entre intentos.
- El `delayMs` crece linealmente con el intento (`delayMs * attempt`), no exponencialmente — para casos con mucho tráfico considera un backoff exponencial en su lugar.

## Comprobación

```ts
let intentos = 0
const resultado = await withRetry(async () => {
  intentos++
  if (intentos < 2) throw new HttpError(503, "Unavailable", "")
  return "listo"
}, 3, 0, error => error instanceof HttpError && error.status === 503)
console.log(resultado, intentos) // listo 2
```

Comprueba por separado 200 con JSON, 200 con HTML, 204, 404 y una respuesta cuyo cuerpo tarda más que el plazo. La cancelación externa debe seguir funcionando al pasar `init.signal`.

## Fuentes

- [MDN: usar Fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch)
- [MDN: AbortSignal.any](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal/any_static)
