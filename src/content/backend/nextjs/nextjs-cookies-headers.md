---
title: cookies(), headers() y datos de la request
description: Leer y escribir cookies, inspeccionar headers y entender por qué estas APIs vuelven dinámica una ruta.
type: guides
order: 3
tags: [nextjs, cookies, headers, http, auth]
scope: next/headers
related:
  - frontend/nextjs/nextjs-server-actions
  - frontend/nextjs/nextjs-endpoints
updatedAt: 2026-08-25
---

`cookies()` y `headers()` vienen de `next/headers` y son APIs asíncronas. Leen datos de la request actual, por lo que no pueden conocerse durante un build estático.

Una cookie es un par nombre/valor que el navegador asocia a un dominio y envía en requests compatibles. Un header transporta metadata HTTP. Ambos pertenecen a la frontera de red: deben validarse y nunca convierten una identidad en confiable por sí solos.

## Consulta rápida

| Necesidad                                 | API                                        |
| ----------------------------------------- | ------------------------------------------ |
| leer preferencia o sesión durante render  | `await cookies()`                          |
| leer `user-agent`, idioma o header propio | `await headers()`                          |
| escribir/eliminar cookie                  | Server Action o Route Handler              |
| crear headers de respuesta                | `Response`, `NextResponse` o configuración |
| leer query/path dentro de Route Handler   | `request.url` y `params`                   |

## Leer cookies y headers

```tsx title="app/cuenta/page.tsx"
import { cookies, headers } from "next/headers"

export default async function Page() {
  const cookieStore = await cookies()
  const headersList = await headers()
  const theme = cookieStore.get("theme")?.value ?? "system"
  const userAgent = headersList.get("user-agent")
  return <pre>{JSON.stringify({ theme, userAgent })}</pre>
}
```

## Escribir cookies

Los headers de la respuesta no se pueden cambiar después de empezar a transmitir el body. Por eso `set`, `delete` y `clear` deben ejecutarse en una Server Action o Route Handler.

```ts title="app/actions.ts"
"use server"

import { cookies } from "next/headers"

export async function guardarTema(theme: "light" | "dark") {
  const store = await cookies()
  store.set("theme", theme, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/"
  })
}
```

## Cookies de sesión

Una cookie de autenticación debería usar `httpOnly`, `secure` en producción, `sameSite` y un `maxAge`/`expires` explícito. Guarda un identificador opaco o token firmado, no el perfil completo del usuario. La autorización real siempre se vuelve a comprobar en el servidor.

```ts
store.set("session", sessionId, {
  httpOnly: true, // JavaScript del navegador no puede leerla
  secure: process.env.NODE_ENV === "production", // solo HTTPS en producción
  sameSite: "lax", // reduce envíos cross-site inesperados
  path: "/",
  maxAge: 60 * 60 * 24 * 7
})
```

`HttpOnly` reduce robo mediante XSS, pero no evita que el navegador envíe la cookie. `SameSite` ayuda contra CSRF; los flujos cross-site legítimos pueden requerir una estrategia diferente. `Secure` exige HTTPS. Ningún atributo reemplaza expiración, rotación y revocación del servidor.

## Eliminar y actualizar

```ts title="app/logout/route.ts"
import { cookies } from "next/headers"

export async function POST() {
  const store = await cookies()
  await revokeSession(store.get("session")?.value)
  store.delete("session")
  return new Response(null, { status: 204 })
}
```

Eliminar una cookie del navegador no revoca automáticamente una sesión almacenada. Invalida primero el estado server-side cuando exista.

## Headers de respuesta

Para devolver headers propios usa un Route Handler, `NextResponse` en `proxy.ts`, o la opción `headers()` de `next.config`. No intentes mutar el objeto devuelto por `headers()`; es una vista de solo lectura de la request.

```ts title="app/api/report/route.ts"
export async function GET() {
  return Response.json(
    { status: "ready" },
    {
      headers: {
        "Cache-Control": "private, no-store",
        "X-Content-Type-Options": "nosniff"
      }
    }
  )
}
```

No reflejes un header recibido directamente en la respuesta. Valores como filename, redirect o idioma deben pasar por allowlists para evitar inyección o comportamiento inesperado.

## Impacto en renderizado

Leer estas APIs hace que ese árbol dependa de la request. Con Cache Components, aíslalo detrás de `<Suspense>` y pasa solo valores concretos a funciones cacheadas; no llames `cookies()` dentro de un scope `'use cache'` compartido.

```tsx
async function AccountMenu() {
  const sessionId = (await cookies()).get("session")?.value
  const user = sessionId ? await getSessionUser(sessionId) : null
  return user ? <span>{user.name}</span> : <a href="/login">Ingresar</a>
}
```

Lee el valor en la frontera dinámica y pasa datos concretos hacia componentes o funciones. Nunca uses una cookie de una persona como parte accidental de una caché compartida.

## Errores comunes

- intentar escribir una cookie desde un Server Component;
- escribirla después de que comenzó el streaming;
- guardar el perfil o permisos completos y asumir que siguen vigentes;
- omitir `path`, provocando cookies con alcances diferentes;
- usar `SameSite=None` sin `Secure`;
- registrar el header `cookie` o `authorization` completo.

Referencias oficiales: [cookies](https://nextjs.org/docs/app/api-reference/functions/cookies) y [headers](https://nextjs.org/docs/app/api-reference/functions/headers).
