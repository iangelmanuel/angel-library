---
title: Auth completa con Auth.js en Next.js
description: Setup completo — config, Route Handler, proxy.ts, página protegida y botones de login/logout, de punta a punta.
type: recipes
order: 7
tags: [nextjs, auth, auth-js]
problem: Todas las piezas de Auth.js en Next.js juntas, de cero a una página protegida funcionando.
technologies: [backend/nextjs/nextjs-auth-js]
updatedAt: 2026-09-07
---

## Antes de empezar

Esta receta ensambla [Auth.js v5](/backend/nextjs/nextjs-auth-js) con App Router. Requiere un cliente Prisma exportado desde `src/lib/prisma.ts`, usuarios con `email`, `passwordHash` y `name`, y el alias `@/*` hacia `src/*`. Guarda la configuración en `src/auth.ts` y las rutas bajo `src/app`. El registro y la recuperación de cuenta se implementan aparte. Define `AUTH_SECRET` y, para GitHub, `AUTH_GITHUB_ID` y `AUTH_GITHUB_SECRET` en el servidor.

## Preparación

```bash
pnpm add next-auth@beta
pnpm add bcrypt
pnpm add -D @types/bcrypt
```

## Config

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
      credentials: { email: {}, password: {} },
      authorize: async (credentials) => {
        if (typeof credentials.email !== "string" || typeof credentials.password !== "string") return null
        const usuario = await prisma.user.findUnique({
          where: { email: credentials.email as string }
        })
        if (!usuario?.passwordHash) return null

        const valido = await bcrypt.compare(
          credentials.password as string,
          usuario.passwordHash
        )
        return valido
          ? { id: usuario.id, email: usuario.email, name: usuario.name }
          : null
      }
    })
  ]
})
```

## Route Handler

```ts title="app/api/auth/[...nextauth]/route.ts"
import { handlers } from "@/auth"

export const { GET, POST } = handlers
```

## `proxy.ts`

```ts title="proxy.ts"
import { NextResponse } from "next/server"
import { auth } from "@/auth"

export default auth(request => {
  if (!request.auth?.user) return NextResponse.redirect(new URL("/login", request.url))
})

export const config = {
  matcher: ["/dashboard/:path*"]
}
```

## Formulario de login (Server Action)

```tsx title="app/login/page.tsx"
import { signIn } from "@/auth"

export default function LoginPage() {
  return (
    <form
      action={async (formData) => {
        "use server"
        await signIn("credentials", {
          email: formData.get("email"),
          password: formData.get("password"),
          redirectTo: "/dashboard"
        })
      }}
    >
      <input
        aria-label="Email"
        name="email"
        type="email"
        required
      />
      <input
        aria-label="Contraseña"
        name="password"
        type="password"
        required
      />
      <button type="submit">Entrar</button>
    </form>
  )
}
```

## Página protegida

```tsx title="app/dashboard/page.tsx"
import { auth } from "@/auth"
import { redirect } from "next/navigation"

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user) redirect("/login")
  return <h1>Hola, {session.user.name}</h1>
}
```

## Consideraciones

El proxy facilita la navegación, pero las páginas, Server Actions y APIs deben comprobar la sesión al acceder a datos. El login del ejemplo muestra el flujo de éxito: captura `AuthError` para presentar credenciales incorrectas y vuelve a lanzar los errores de redirección de Next.js. Ver [manejo de sesión](/backend/nextjs/nextjs-auth-js).

## Cerrar sesión

```tsx title="app/components/LogoutButton.tsx"
import { signOut } from "@/auth"

export function LogoutButton() {
  return <form action={async () => {
    "use server"
    await signOut({ redirectTo: "/login" })
  }}><button type="submit">Cerrar sesión</button></form>
}
```

## Comprobación

Visita `/dashboard` sin sesión, inicia sesión con un usuario de prueba y vuelve a visitarlo. Debe mostrar su nombre. Cierra sesión y recarga: debe volver a `/login`. Comprueba también contraseña incorrecta y acceso directo a APIs. No basta con ocultar botones en el navegador.

## Fuentes

- [Auth.js: instalación](https://authjs.dev/getting-started/installation)

- Cada pieza está documentada a fondo en [Auth.js en Next.js](/backend/nextjs/nextjs-auth-js) — aquí solo el ensamblado end-to-end.
- El provider `Credentials` sigue necesitando [bcrypt](/backend/express/bcrypt) a mano dentro de `authorize` — Auth.js no reemplaza esa parte del flujo, solo el manejo de sesión alrededor.
