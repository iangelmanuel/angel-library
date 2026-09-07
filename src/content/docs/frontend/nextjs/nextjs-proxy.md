---
title: Proxy (antes Middleware)
description: Código que corre antes de cada request para redirigir, reescribir o modificar headers — Middleware se renombró en Next 16.
type: guides
order: 23
tags: [nextjs, auth, routing]
scope: next.js (proxy.ts)
updatedAt: 2026-08-25
---

Desde Next.js 16, el archivo `middleware.ts` se renombró a **`proxy.ts`** — el nombre viejo queda deprecado. La API es prácticamente la misma (`NextRequest`/`NextResponse`), solo cambia el nombre del archivo y de la función exportada. Next explica el cambio así: "middleware" se confundía con el middleware de Express, y el propósito real (interceptar antes de que la request llegue a tu app, como un proxy de red) quedaba poco claro con ese nombre.

## Ubicación y forma básica

`proxy.ts` en la raíz del proyecto (o dentro de `src/` si tu estructura usa esa carpeta), al mismo nivel que `app/`.

```ts title="proxy.ts"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function proxy(request: NextRequest) {
  return NextResponse.redirect(new URL("/inicio", request.url))
}

export const config = {
  matcher: "/about/:path*"
}
```

## `matcher` — En qué rutas corre

Sin `matcher`, el Proxy corre en **todas** las requests, incluidos archivos estáticos y optimización de imágenes — casi siempre conviene acotarlo, o vas a interceptar cosas que no querías (CSS, JS, imágenes) y romper el sitio sin darte cuenta.

```ts
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"]
}
```

## Caso típico: chequeo de auth con redirect

```ts title="proxy.ts"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function proxy(request: NextRequest) {
  const token = request.cookies.get("token")

  if (!token && request.nextUrl.pathname.startsWith("/panel")) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: "/panel/:path*"
}
```

## `NextResponse` — Las tres formas de responder

```ts
NextResponse.next() // dejar pasar la request tal cual
NextResponse.redirect(new URL("/x", url)) // redirigir
NextResponse.rewrite(new URL("/y", url)) // servir otra ruta, sin cambiar la URL visible
```

## API de Proxy en una mirada

| API                                    | Uso                                                   |
| -------------------------------------- | ----------------------------------------------------- |
| `proxy.ts` en la raíz                  | Reemplaza a `middleware.ts` desde Next 16             |
| `export function proxy(request)`       | Función principal (o default export)                  |
| `export const config = { matcher }`    | En qué rutas corre                                    |
| `NextResponse.redirect/rewrite/next()` | Las tres formas de responder                          |
| `request.cookies` / `request.nextUrl`  | Leer cookies y la URL parseada de la request entrante |

## Alcance, latencia y seguridad

- El Proxy corre en el runtime de Node.js por defecto desde Next 16 (antes corría en el runtime Edge, más limitado) — código que antes evitabas ahí por esa restricción ahora puede no hacer falta evitarlo.
- Las Server Functions (`'use server'`) no son rutas separadas en la cadena de ejecución del Proxy — son un POST a la ruta donde se usan. Un `matcher` que excluye una ruta también se salta las Server Actions de esa ruta: no confíes solo en el Proxy para proteger una action, verifica auth también adentro de cada una (ver [Server Actions](/frontend/nextjs/nextjs-server-actions)).
- Hay un codemod oficial para migrar: `npx @next/codemod@canary middleware-to-proxy .` — renombra el archivo y la función automáticamente.
