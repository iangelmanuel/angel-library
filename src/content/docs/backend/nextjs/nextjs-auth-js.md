---
title: Auth.js en Next.js
description: Instalación, Route Handler, providers (social y Credentials), los callbacks jwt/session para meter datos propios en la sesión, y cómo tiparlos.
type: guides
order: 5
tags: [nextjs, auth-js, nextauth, auth]
website: https://authjs.dev
related: [backend/nextjs/nextjs-backend-arquitectura, backend/express/bcrypt]
updatedAt: 2026-08-17
---

Next.js es donde Auth.js nació (como NextAuth.js) — el paquete `next-auth` sigue siendo el más documentado y probado en producción de las tres integraciones (Next.js, Express, Astro).

## Instalación

```bash
npm install next-auth@beta
```

## Configuración rápida — de cero a una sesión funcionando

**1. Providers, incluyendo Credentials:**

```ts title="auth.ts"
import bcrypt from "bcrypt"
import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import GitHub from "next-auth/providers/github"
import { prisma } from "@/libs/prisma"

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    GitHub,
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Contraseña", type: "password" }
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) return null

        const usuario = await prisma.user.findUnique({
          where: { email: credentials.email as string }
        })
        if (!usuario) return null

        const passwordValida = await bcrypt.compare(
          credentials.password as string,
          usuario.passwordHash
        )
        if (!passwordValida) return null

        return {
          id: usuario.id,
          email: usuario.email,
          name: usuario.nombre,
          rol: usuario.rol
        }
      }
    })
  ]
  // callbacks va aquí — ver la sección de abajo
})
```

`GitHub` sin argumentos toma `AUTH_GITHUB_ID`/`AUTH_GITHUB_SECRET` del entorno automáticamente — convención de Auth.js v5 para providers OAuth conocidos. `authorize` es donde vive la verificación real para `Credentials`; devolver `null` (nunca lanzar) es la forma correcta de decir "credenciales inválidas".

**2. El Route Handler** — sí hace falta crear este archivo, expone signin/callback/session:

```ts title="app/api/auth/[...nextauth]/route.ts"
import { handlers } from "@/auth"

export const { GET, POST } = handlers
```

**No hace falta escribir rutas propias de login/registro.**

## Los callbacks `jwt` y `session` — meter datos propios en la sesión

Por default, `session.user` solo trae `id`/`name`/`email`/`image` — el `rol` devuelto en `authorize` (o cualquier dato extra de un provider OAuth) no aparece solo. Auth.js separa esto en dos callbacks a propósito, cada uno con una responsabilidad distinta:

```ts title="auth.ts"
export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [/* ... */],
  callbacks: {
    // Corre cada vez que se crea o actualiza el JWT — decide qué queda GUARDADO en el token
    async jwt({ token, user }) {
      if (user) {
        // "user" solo está disponible en el login inicial (de authorize() o el provider OAuth)
        token.id = user.id
        token.rol = (user as { rol: string }).rol
      }
      return token
    },

    // Corre cada vez que se LEE la sesión (auth(), useSession, etc.) — decide qué queda EXPUESTO
    async session({ session, token }) {
      session.user.id = token.id as string
      session.user.rol = token.rol as string
      return session
    }
  }
})
```

El flujo completo: `authorize()` (o el provider OAuth) devuelve un `user` → el callback `jwt` copia lo necesario de `user` al `token` (el JWT cifrado en la cookie) → el callback `session` copia lo necesario del `token` a `session.user` (lo que finalmente lee el resto de la app, tanto en servidor como en cliente). `user` solo existe en `jwt` durante el login inicial — en requests posteriores, `jwt` corre de nuevo pero solo con el `token` ya existente, por eso el `if (user)` evita pisar el dato con `undefined`.

### Actualizar la sesión sin re-loguearse

Si algo cambia el `rol` de un usuario ya logueado (un admin lo promueve), el JWT sigue teniendo el valor viejo hasta que se refresque — `update()` del lado del cliente dispara el callback `jwt` de nuevo con `trigger: 'update'`:

```ts
// callbacks.jwt, extendido
async jwt({ token, user, trigger, session }) {
  if (user) {
    token.id = user.id;
    token.rol = (user as { rol: string }).rol;
  }

  if (trigger === 'update' && session?.rol) {
    token.rol = session.rol; // actualiza el token con el nuevo valor pasado a update()
  }

  return token;
},
```

```tsx
"use client"

import { useSession } from "next-auth/react"

const { update } = useSession()
await update({ rol: "admin" }) // dispara jwt({ trigger: 'update', session: { rol: 'admin' } })
```

## Tipar `session.user.rol` y `token.rol` (module augmentation)

Sin esto, TypeScript no sabe que estos campos existen — cualquier archivo que lea `session.user.rol` no tiene autocompletado ni chequeo de tipos.

```ts title="types/next-auth.d.ts"
import type { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      rol: string
    } & DefaultSession["user"]
  }

  interface User {
    rol: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    rol: string
  }
}
```

Este archivo no se importa en ningún lado — TypeScript lo recoge automáticamente por estar dentro del proyecto (`.d.ts` en `types/` o la raíz, según el `include` del `tsconfig.json`). Con esto, `session.user.rol` queda tipado como `string` en Server Components, Route Handlers y `useSession()` del lado del cliente, sin `as` en ningún lado.

## Leer la sesión en un Server Component

```tsx title="app/perfil/page.tsx"
import { redirect } from "next/navigation"
import { auth } from "@/auth"

export default async function PerfilPage() {
  const session = await auth()
  if (!session?.user) redirect("/login")

  return (
    <h1>
      Hola, {session.user.name} ({session.user.rol})
    </h1>
  )
}
```

## Proteger rutas en `proxy.ts`

```ts title="proxy.ts"
export { auth as default } from "@/auth"

export const config = {
  matcher: ["/dashboard/:path*"]
}
```

## Login/logout (Server Actions)

```tsx title="app/components/AuthButtons.tsx"
import { signIn, signOut } from "@/auth"

export function LoginButton() {
  return (
    <form
      action={async () => {
        "use server"
        await signIn("github")
      }}
    >
      <button type="submit">Iniciar sesión con GitHub</button>
    </form>
  )
}

export function LogoutButton() {
  return (
    <form
      action={async () => {
        "use server"
        await signOut()
      }}
    >
      <button type="submit">Cerrar sesión</button>
    </form>
  )
}
```

## Leer la sesión en un Route Handler propio

```ts title="app/api/posts/route.ts"
import { NextResponse } from "next/server"
import { auth } from "@/auth"

export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 })
  }

  const body = await request.json()
  const post = await postsRepository.create({
    ...body,
    authorId: session.user.id
  })
  return NextResponse.json(post, { status: 201 })
}
```

## Piezas de Auth.js en Next.js

| Pieza                                              | Rol                                                                                 |
| -------------------------------------------------- | ----------------------------------------------------------------------------------- |
| `Credentials({ authorize })`                       | Login con email/password propio; `null` = credenciales inválidas                    |
| `app/api/auth/[...nextauth]/route.ts`              | Expone `handlers.GET`/`handlers.POST`, sin rutas propias                            |
| `callbacks.jwt({ token, user, trigger, session })` | Qué queda guardado en el JWT; `trigger: 'update'` para refrescarlo sin re-loguearse |
| `callbacks.session({ session, token })`            | Qué del JWT queda expuesto en `session.user`                                        |
| `declare module 'next-auth'` / `'next-auth/jwt'`   | Tipar los campos custom                                                             |
| `auth()`                                           | Leer sesión en Server Components, Route Handlers, proxy                             |

## Callbacks, sesión y protección

- Este es el paquete más maduro de los tres frameworks documentados — más terreno probado para necesidades de auth avanzadas o de producción crítica.
- Olvidar el callback `jwt` (y solo agregar `session`) es el error más común: `session` solo puede leer lo que `jwt` ya haya copiado al `token`, no accede a `user` directamente.
- `strategy: 'jwt'` (default) no necesita adapter de base de datos para las sesiones; `strategy: 'database'` sí, pero permite revocar sesiones activas borrando la fila — con `'jwt'`, revocar antes de que expire requiere lógica propia.
