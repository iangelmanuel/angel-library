---
title: Auth.js en Next.js
description: Instalación, Route Handler, providers (social y Credentials), los callbacks jwt/session para meter datos propios en la sesión, y cómo tiparlos.
tags: [nextjs, auth-js, nextauth, auth]
sidebar:
  order: 5
draft: false
resourceCategory: Documentación oficial
website: https://authjs.dev
technologies:
  - backend/nextjs/nextjs-backend-arquitectura
  - packages/node-bcrypt/bcrypt
updatedAt: 2026-09-07
---

Auth.js gestiona proveedores de identidad y sesiones en Next.js. Esta guía usa la API de Auth.js v5 (`handlers`, `auth`, `signIn`) con App Router; no mezcles estos ejemplos con configuración de NextAuth v4. La instalación usa el canal beta: fija la versión resuelta y consulta su documentación al actualizar.

## Instalación

Parte de App Router con `src/app`, alias `@/*` hacia `src/*` y el [cliente de Prisma 7](/database/database-prisma/prisma-configuracion) en `src/lib/prisma.ts`. Guarda la configuración siguiente en `src/auth.ts`. Para Credentials, el modelo `User` necesita además `passwordHash String?` y `rol String @default("user")`: añade esos campos al esquema, migra y regenera el cliente. El registro debe guardar un hash, nunca la contraseña original.

El modelo compartido usa `name`; conserva ese nombre en el código y en el esquema. Si tu aplicación usa `nombre`, adapta ambas partes. El proveedor GitHub de este ejemplo inicia una sesión OAuth; para usar esa identidad como autor en tu base, configura un adapter de Auth.js o un vínculo local verificado. El identificador del proveedor no equivale automáticamente al ID de tu tabla `User`.

```bash
pnpm add next-auth@beta bcrypt
pnpm add -D @types/bcrypt
```

## Configuración rápida — de cero a una sesión funcionando

**1. Providers, incluyendo Credentials:**

```ts title="auth.ts"
import bcrypt from "bcrypt"
import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import GitHub from "next-auth/providers/github"
import { prisma } from "@/lib/prisma"

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    GitHub,
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Contraseña", type: "password" }
      },
      authorize: async (credentials) => {
        if (typeof credentials?.email !== "string" || typeof credentials?.password !== "string") return null

        const usuario = await prisma.user.findUnique({
          where: { email: credentials.email as string }
        })
        if (!usuario?.passwordHash) return null

        const passwordValida = await bcrypt.compare(
          credentials.password as string,
          usuario.passwordHash
        )
        if (!passwordValida) return null

        return {
          id: usuario.id,
          email: usuario.email,
          name: usuario.name,
          rol: usuario.rol
        }
      }
    })
  ]
  // callbacks va aquí — ver la sección de abajo
})
```

`GitHub` toma `AUTH_GITHUB_ID`/`AUTH_GITHUB_SECRET` del entorno. Define además `AUTH_SECRET` en el servidor. En `authorize`, devuelve `null` para credenciales rechazadas; un fallo inesperado de la base de datos es otro tipo de error y debe registrarse sin exponer detalles al cliente.

**2. El Route Handler** — sí hace falta crear este archivo, expone signin/callback/session:

```ts title="app/api/auth/[...nextauth]/route.ts"
import { handlers } from "@/auth"

export const { GET, POST } = handlers
```

Auth.js expone las rutas de sesión. Con `Credentials`, el registro de usuarios, la validación de contraseñas, la recuperación y la protección frente a intentos masivos siguen siendo responsabilidad de tu aplicación.

## Los callbacks `jwt` y `session` — meter datos propios en la sesión

La sesión expone un conjunto reducido de datos, habitualmente `name`, `email` e `image`; no asumas que `id` y `rol` aparecen automáticamente. Este fragmento muestra cómo añadirlos con estrategia JWT. Parte de usuarios y roles que ya fueron resueltos por el servidor; un proveedor OAuth no implica por sí solo un rol local.

```ts title="auth.ts"
export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [/* ... */],
  callbacks: {
    // Corre cada vez que se crea o actualiza el JWT — decide qué queda GUARDADO en el token
    async jwt({ token, user }) {
      if (user) {
        // "user" solo está disponible en el login inicial (de authorize() o el provider OAuth)
        token.id = user.id
        token.rol = user.rol ?? "user"
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
async jwt({ token, user, trigger }) {
  if (user) {
    token.id = user.id;
    token.rol = user.rol ?? "user";
  }

  if (trigger === 'update' && typeof token.id === 'string') {
    const usuario = await prisma.user.findUnique({
      where: { id: token.id },
      select: { rol: true }
    });
    token.rol = usuario?.rol ?? 'user';
  }

  return token;
},
```

```tsx
"use client"

import { useSession } from "next-auth/react"

export function ActualizarPermisos() {
  const { update } = useSession() // Dentro de un componente y un SessionProvider.
  return <button onClick={() => update()}>Actualizar sesión</button>
}
```

El cliente solo solicita una actualización; **nunca decide su rol**. Copiar `session.rol` desde `update({ rol: "admin" })` al JWT permitiría elevar privilegios. Los roles se leen de datos controlados por el servidor. Para revocación inmediata o cuentas eliminadas, comprueba además el usuario vigente en cada operación sensible: refrescar la interfaz no es una barrera de autorización.

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
    rol?: string
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
import { NextResponse } from "next/server"
import { auth } from "@/auth"

export default auth(request => {
  if (!request.auth?.user) {
    return NextResponse.redirect(new URL("/login", request.url))
  }
})

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

Este fragmento presupone un repositorio `postsRepository` implementado e importado. Valida un esquema de campos permitidos antes de persistir; la autenticación no valida el cuerpo.

```ts title="app/api/posts/route.ts"
import { NextResponse } from "next/server"
import { auth } from "@/auth"

export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 })
  }

  let body: unknown
  try { body = await request.json() } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 })
  }
  if (!body || typeof body !== "object" || !("title" in body) ||
      typeof body.title !== "string" || !body.title.trim()) {
    return NextResponse.json({ error: "Falta title" }, { status: 400 })
  }
  const post = await postsRepository.create({
    title: body.title.trim(),
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

- Evalúa los proveedores, la estrategia de sesión y la compatibilidad de la versión instalada con tu aplicación; una librería de autenticación no elimina las políticas de autorización de tu dominio.
- Olvidar el callback `jwt` (y solo agregar `session`) es el error más común: `session` solo puede leer lo que `jwt` ya haya copiado al `token`, no accede a `user` directamente.
- `strategy: 'jwt'` (default) no necesita adapter de base de datos para las sesiones; `strategy: 'database'` sí, pero permite revocar sesiones activas borrando la fila — con `'jwt'`, revocar antes de que expire requiere lógica propia.

## Comprobación

Sin cookie, visita `/dashboard`: debe redirigir. Prueba una API directamente sin pasar por la página y verifica que también rechace la operación. Desde una cuenta de usuario, enviar un rol inventado al refrescar la sesión no debe conceder permisos. Cambia el rol en la base de datos de desarrollo y comprueba que el servidor aplica la política vigente.

## Fuentes

- [Auth.js: instalación y handlers](https://authjs.dev/getting-started/installation)
- [Auth.js: control de acceso por roles](https://authjs.dev/guides/role-based-access-control)
