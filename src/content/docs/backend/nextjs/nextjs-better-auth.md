---
title: better-auth en Next.js
description: Instalación, configuración con adapter y providers, Route Handler catch-all, y el cliente con hooks para Client Components.
type: guides
order: 6
tags: [nextjs, better-auth, auth]
website: https://www.better-auth.com
related:
  [backend/nextjs/nextjs-backend-arquitectura, backend/nextjs/nextjs-auth-js]
updatedAt: 2026-08-17
---

Better Auth es un framework de autenticación orientado a TypeScript y agnóstico del framework. Es una alternativa a [Auth.js](/backend/nextjs/nextjs-auth-js), con integración para Express y Astro, útil si el proyecto necesita una sola solución de autenticación en varios stacks o su modelo de plugins.

## Instalación

```bash
npm install better-auth
```

## Configuración rápida — de cero a un Route Handler funcionando

**1. Configurar el core:**

```ts title="lib/auth.ts"
import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { prisma } from "./prisma"

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  emailAndPassword: {
    enabled: true
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!
    }
  }
})
```

**2. Generar y aplicar las migraciones:**

```bash
npx @better-auth/cli generate
npx @better-auth/cli migrate
```

**3. Montar el Route Handler catch-all** — sí hace falta crear este archivo, expone todo `/api/auth/*`:

```ts title="app/api/auth/[...all]/route.ts"
import { toNextJsHandler } from "better-auth/next-js"
import { auth } from "@/libs/auth"

export const { GET, POST } = toNextJsHandler(auth)
```

**No hace falta escribir rutas propias de login/registro** — este archivo las reemplaza todas.

## Leer la sesión en un Server Component

```tsx title="app/perfil/page.tsx"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { auth } from "@/libs/auth"

export default async function PerfilPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect("/login")

  return <h1>Hola, {session.user.name}</h1>
}
```

## Cliente React con hooks, para Client Components

```ts title="lib/auth-client.ts"
import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient()
```

```tsx title="app/components/UserMenu.tsx"
"use client"

import { authClient } from "@/libs/auth-client"

export function UserMenu() {
  const { data: session } = authClient.useSession()

  if (!session) return <a href="/login">Iniciar sesión</a>

  return (
    <button onClick={() => authClient.signOut()}>
      Cerrar sesión ({session.user.name})
    </button>
  )
}
```

## Proteger rutas en `proxy.ts`

```ts title="proxy.ts"
import { NextResponse } from "next/server"
import { auth } from "@/libs/auth"

export default async function proxy(req: Request) {
  const session = await auth.api.getSession({ headers: req.headers })
  if (!session) return NextResponse.redirect(new URL("/login", req.url))
}

export const config = {
  matcher: ["/dashboard/:path*"]
}
```

## Roles y datos custom del usuario

```ts title="lib/auth.ts"
export const auth = betterAuth({
  // ...
  user: {
    additionalFields: {
      rol: { type: "string", defaultValue: "user" }
    }
  }
})
```

Tras regenerar el schema, `session.user.rol` queda disponible tanto en `auth.api.getSession()` (servidor) como en `authClient.useSession()` (cliente).

## Piezas de Better Auth en Next.js

| Pieza                                    | Rol                                                      |
| ---------------------------------------- | -------------------------------------------------------- |
| `betterAuth({ database, ...providers })` | Configuración central                                    |
| `toNextJsHandler(auth)`                  | Adapta el handler agnóstico a la firma de Route Handlers |
| `auth.api.getSession({ headers })`       | Leer sesión en Server Components/Route Handlers          |
| `authClient.useSession()`                | Hook reactivo para Client Components                     |

## Cookies, plugins y runtime

- [Auth.js](/backend/nextjs/nextjs-auth-js) tiene más terreno probado específicamente en Next.js (es su origen); better-auth es la opción si el proyecto ya lo usa en otro stack (Astro, Express) y prefieres una sola librería de auth en todos lados.
- El cliente con hooks (`authClient.useSession()`) es una ventaja concreta frente a Auth.js para UI muy interactiva del lado del cliente.
- Los endpoints generados reemplazan rutas propias de login — no combinar con Auth.js para el mismo flujo de sesión.
