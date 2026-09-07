---
title: Auth.js en Express
description: Instalación, ruta catch-all, providers (social y Credentials), los callbacks jwt/session para meter datos propios en la sesión, y cómo tiparlos.
type: guides
order: 17
tags: [express, auth-js, nextauth, auth]
website: https://authjs.dev
related: [backend/express/bcrypt, backend/express/express-auth-middleware]
updatedAt: 2026-08-17
---

Auth.js empezó como **NextAuth.js**, pensado solo para Next.js — hoy su core (`@auth/core`) es agnóstico de framework, con `@auth/express` como paquete de integración oficial. La API de configuración (providers, callbacks) es la misma en cualquier framework; lo que cambia es cómo se monta el handler.

## Instalación

```bash
npm install @auth/express
```

## Configuración rápida — de cero a una sesión funcionando

**1. Definir los providers** (social + Credentials para email/password propio):

```ts title="auth.config.ts"
import Credentials from "@auth/express/providers/credentials"
import GitHub from "@auth/express/providers/github"
import bcrypt from "bcrypt"
import { prisma } from "./lib/prisma"

export const authConfig = {
  providers: [
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!
    }),
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

        // Lo que se devuelve aquí es lo que Auth.js usa para armar el user inicial del token
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
}
```

Un **provider** por método de login: OAuth (`GitHub`, etc.) maneja todo el flow de redirect automáticamente; `Credentials` es el que se usa para email+password propio. `authorize` es donde vive la lógica real de verificación — devolver `null` (no lanzar) es la forma correcta de decir "credenciales inválidas": Auth.js lo traduce en un error genérico del lado del cliente sin filtrar si fue el email o la contraseña lo que falló.

**2. Montar el Route Handler catch-all** — sí hace falta crear esta ruta, es la que expone signin/callback/session:

```ts title="app.ts"
import { ExpressAuth } from "@auth/express"
import express from "express"
import { authConfig } from "./auth.config"

const app = express()

app.set("trust proxy", true) // necesario si el servidor corre detrás de un proxy/load balancer

app.use("/api/auth/*", ExpressAuth(authConfig))

app.use(express.json())
// ... el resto de las rutas ...
```

`ExpressAuth(authConfig)` monta `/api/auth/signin`, `/api/auth/callback/:provider`, `/api/auth/session`, etc. — no hace falta escribir esas rutas a mano.

## Los callbacks `jwt` y `session` — meter datos propios en la sesión

Por default, `session.user` solo trae `id`/`name`/`email`/`image` — el `rol` que devolvimos en `authorize` **no** aparece solo en la sesión. Hacen falta dos callbacks para pasarlo de un lado al otro:

```ts title="auth.config.ts"
export const authConfig = {
  providers: [/* ... */],
  callbacks: {
    // Corre cada vez que se crea o actualiza el JWT — aquí se decide qué queda GUARDADO en el token
    async jwt({ token, user }) {
      if (user) {
        // "user" solo está disponible en el login inicial (viene de authorize() o del provider OAuth)
        token.id = user.id
        token.rol = (user as { rol: string }).rol
      }
      return token
    },

    // Corre cada vez que se LEE la sesión (auth(), getSession, etc.) — aquí se decide qué queda EXPUESTO
    async session({ session, token }) {
      session.user.id = token.id as string
      session.user.rol = token.rol as string
      return session
    }
  }
}
```

El flujo es: `authorize()` (o el provider OAuth) da un `user` → el callback `jwt` copia lo que haga falta de `user` al `token` (el JWT que se guarda, cifrado, en la cookie) → el callback `session` copia lo que haga falta del `token` a `session.user` (lo que finalmente lee el resto de la app). `user` solo existe en el callback `jwt` durante el login inicial — en requests siguientes, `jwt` corre de nuevo pero sin `user`, solo con el `token` ya existente, por eso el `if (user)` es necesario para no pisar el dato con `undefined` en cada request.

## Tipar `session.user.rol` y `token.rol` (module augmentation)

Sin esto, TypeScript no sabe que `session.user.rol` o `token.rol` existen — el código de arriba compilaría con `as` a los golpes, pero cualquier otro archivo que lea `session.user.rol` no tendría autocompletado ni chequeo de tipos.

```ts title="types/auth.d.ts"
import type { DefaultSession } from "@auth/core/types"

declare module "@auth/core/types" {
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

declare module "@auth/core/jwt" {
  interface JWT {
    id: string
    rol: string
  }
}
```

Con este archivo (que TypeScript recoge automáticamente si está dentro del proyecto, sin necesidad de importarlo en ningún lado), `session.user.rol` queda tipado como `string` en cualquier archivo que lea la sesión, y los `as` de los callbacks de arriba dejan de hacer falta.

## Leer la sesión en un middleware propio

```ts title="middlewares/requireAuth.ts"
import { getSession } from "@auth/express"
import type { NextFunction, Request, Response } from "express"
import { authConfig } from "../auth.config"

export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const session = await getSession(req, authConfig)

  if (!session?.user) {
    return res.status(401).json({ error: "No autenticado" })
  }

  req.user = { id: session.user.id, rol: session.user.rol }
  next()
}
```

```ts
app.get("/perfil", requireAuth, (req, res) => {
  res.json({ userId: req.user!.id, rol: req.user!.rol })
})
```

## Piezas de Auth.js

| Pieza                                      | Rol                                                                          |
| ------------------------------------------ | ---------------------------------------------------------------------------- |
| `Credentials({ authorize })`               | Login con email/password propio; `null` = credenciales inválidas             |
| `ExpressAuth(authConfig)` en `/api/auth/*` | Expone signin/callback/session automáticamente                               |
| `callbacks.jwt({ token, user })`           | Qué datos quedan guardados en el JWT (solo tiene `user` en el login inicial) |
| `callbacks.session({ session, token })`    | Qué datos del JWT quedan expuestos en `session.user`                         |
| `declare module '@auth/core/types'`        | Tipar los campos custom de `Session`/`User`                                  |
| `declare module '@auth/core/jwt'`          | Tipar los campos custom del `JWT`                                            |

## Sesión, callbacks y adaptación

- El paquete `@auth/express` es más nuevo que la integración de Next.js (`next-auth`) — menos superficie probada en producción a gran escala.
- Olvidar el callback `jwt` (y solo agregar `session`) es un error común: `session` solo puede leer lo que ya esté en `token` — si `jwt` no lo copió ahí primero, `session` no tiene de dónde sacarlo.
- `Credentials` con contraseñas propias sigue necesitando hashear con [bcrypt](/backend/express/bcrypt) a mano dentro de `authorize` — Auth.js no reemplaza esa parte, solo el manejo de sesión/providers alrededor.
