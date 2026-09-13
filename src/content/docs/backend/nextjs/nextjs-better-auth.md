---
title: better-auth en Next.js
description: Instalación, configuración con adapter y providers, Route Handler catch-all, y el cliente con hooks para Client Components.
type: guides
sidebar:
  order: 6
tags: [nextjs, better-auth, auth]
website: https://www.better-auth.com
related:
  [backend/nextjs/nextjs-backend-arquitectura, backend/nextjs/nextjs-auth-js]
updatedAt: 2026-09-07
---

Better Auth es un framework de autenticación orientado a TypeScript y agnóstico del framework. Es una alternativa a [Auth.js](/backend/nextjs/nextjs-auth-js), con integración para Express y Astro, útil si el proyecto necesita una sola solución de autenticación en varios stacks o su modelo de plugins.

## Antes de empezar

Esta integración parte de un proyecto Next.js con App Router y un cliente Prisma configurado para PostgreSQL. Sigue primero [Prisma en nextjs](/backend/nextjs/nextjs-prisma). Mantén una sola carpeta de helpers e imports coherentes. Define `BETTER_AUTH_SECRET` y `BETTER_AUTH_URL` en el entorno del servidor; configura las credenciales GitHub solo si activarás ese proveedor.

Con Prisma, la CLI de Better Auth **genera el esquema**, y Prisma crea/aplica la migración. Hazlo en desarrollo y revisa el diff antes de aplicar las migraciones versionadas en producción. `auth@latest` sigue el canal actual: registra la versión resuelta cuando reproduzcas esta guía.

## Instalación

```bash
pnpm add better-auth @better-auth/prisma-adapter
```

## Configuración rápida — de cero a un Route Handler funcionando

**1. Configurar el core:**

```ts title="src/lib/auth.ts"
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
pnpm dlx auth@latest generate
pnpm exec prisma migrate dev --name add-auth
pnpm exec prisma generate
```

**3. Montar el Route Handler catch-all** — sí hace falta crear este archivo, expone todo `/api/auth/*`:

```ts title="app/api/auth/[...all]/route.ts"
import { toNextJsHandler } from "better-auth/next-js"
import { auth } from "@/lib/auth"

export const { GET, POST } = toNextJsHandler(auth)
```

**No hace falta escribir rutas propias de login/registro** — este archivo las reemplaza todas.

## Leer la sesión en un Server Component

```tsx title="app/perfil/page.tsx"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"

export default async function PerfilPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect("/login")

  return <h1>Hola, {session.user.name}</h1>
}
```

## Cliente React con hooks, para Client Components

```ts title="src/lib/auth-client.ts"
import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient()
```

```tsx title="app/components/UserMenu.tsx"
"use client"

import { authClient } from "@/lib/auth-client"

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
import { auth } from "@/lib/auth"

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
      rol: { type: "string", defaultValue: "user", input: false }
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
- Tanto Better Auth como Auth.js ofrecen APIs de sesión para React. Elige por requisitos de autenticación, plugins y operación, no por asumir que una alternativa carece de hooks.
- Los endpoints generados reemplazan rutas propias de login — no combinar con Auth.js para el mismo flujo de sesión.

## Comprobación y límites

Prueba registro, login incorrecto, login correcto, lectura de sesión y logout. Sin sesión, una página protegida debe redirigir y una API debe devolver 401. Prueba también un usuario autenticado sin permiso: debe recibir 403 y no modificar datos.

El campo `rol` usa `input: false` para que el formulario no pueda asignar privilegios. Cambia permisos solo desde una operación autorizada en el servidor. Un campo adicional por sí solo no implementa control de acceso; valida permisos y pertenencia del recurso en cada operación. Si expones roles al cliente, configura también la inferencia de campos adicionales según la API del cliente utilizada.

## Fuentes

- [Better Auth: adapter de Prisma y migraciones](https://better-auth.com/docs/adapters/prisma)
- [Better Auth: campos adicionales de usuario](https://better-auth.com/docs/concepts/users-accounts)
