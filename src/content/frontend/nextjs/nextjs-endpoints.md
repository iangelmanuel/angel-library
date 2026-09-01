---
title: Endpoints (Route Handlers)
description: Archivos route.ts dentro de app/ que responden con las Web APIs Request/Response en vez de renderizar UI.
type: guides
order: 22
tags: [nextjs, api, backend]
scope: next.js (route.ts)
related:
  - frontend/nextjs/nextjs-server-actions
updatedAt: 2026-08-25
---

Un archivo `route.ts` dentro de `app/` (nunca conviviendo con un `page.tsx` en la misma carpeta) exporta funciones con nombre de método HTTP, usando las Web APIs `Request`/`Response` estándar — no un formato propio de Next.

## Lo básico

```ts title="app/api/hola/route.ts"
export async function GET() {
  return Response.json({ mensaje: "Hola" })
}
```

Métodos soportados: `GET`, `POST`, `PUT`, `PATCH`, `DELETE`, `HEAD`, `OPTIONS`. Next implementa `HEAD` automáticamente a partir de `GET`, y `OPTIONS` si no lo defines tú.

## `NextRequest` — Request extendido

El parámetro `request` es un `NextRequest`, que agrega conveniencias sobre el `Request` nativo: `nextUrl` (URL ya parseada) y acceso directo a cookies.

```ts title="app/api/buscar/route.ts"
import type { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q")
  return Response.json({ resultados: await buscar(query) })
}
```

## Rutas dinámicas — `params`

Igual que en `page.tsx`, `params` es una promesa.

```ts title="app/items/[slug]/route.ts"
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  return Response.json({ slug })
}
```

## Leer body — JSON o FormData

```ts title="app/api/usuarios/route.ts"
export async function POST(request: Request) {
  const body = await request.json()
  return Response.json({ recibido: body })
}
```

```ts
export async function POST(request: Request) {
  const formData = await request.formData()
  const email = formData.get("email")
  return Response.json({ email })
}
```

## Cookies y headers

```ts
import { cookies, headers } from "next/headers"

export async function GET() {
  const cookieStore = await cookies()
  const token = cookieStore.get("token")

  const headersList = await headers()
  const referer = headersList.get("referer")

  return Response.json({ token: token?.value, referer })
}
```

## Cuándo un endpoint en vez directamente Server Action

Un Route Handler tiene sentido cuando el consumidor no es tu propia UI de React (un webhook de un tercero, un cliente externo, un `GET` de solo lectura que quieres cachear como página) — para mutaciones desde tu propia UI, [Server Actions](/frontend/nextjs/nextjs-server-actions) suele ser menos código.

## Métodos y APIs en una mirada

| API                                           | Uso                                                        |
| --------------------------------------------- | ---------------------------------------------------------- |
| `export async function GET/POST/...()`        | Handler por método HTTP                                    |
| `NextRequest`                                 | `Request` extendido, con `.nextUrl` y cookies convenientes |
| `params` (promesa)                            | Segmentos dinámicos del route                              |
| `request.json()` / `request.formData()`       | Leer el body                                               |
| `cookies()` / `headers()` (de `next/headers`) | Leer/escribir cookies y headers de la request actual       |

## Contrato HTTP, runtime y caché

- Un `route.ts` y un `page.tsx` no pueden convivir en la misma carpeta — un segmento es una página o un endpoint, no ambas cosas.
- Desde Next 15, un `GET` sin configuración explícita se trata como **dinámico** por defecto (antes era estático) — si necesitas cachearlo, `export const revalidate = N` (ver [Fetching con revalidate](/frontend/nextjs/nextjs-fetching-revalidate)).
- Para subir/procesar archivos grandes o streaming (por ejemplo, respuestas de un LLM), Route Handlers soportan `ReadableStream` directo de las Web APIs — no hace falta nada específico de Next para eso.
