---
title: better-auth en Astro
description: Instalación, configuración con adapter y providers, el endpoint catch-all, y leer la sesión en middleware/páginas — sin JWT manual, sin CORS.
type: guides
sidebar:
  order: 5
tags: [astro, better-auth, auth]
website: https://www.better-auth.com
related: [backend/astro/astro-backend-arquitectura]
updatedAt: 2026-09-07
---

Better Auth es un framework de autenticación orientado a TypeScript y agnóstico del framework: aplica hash a contraseñas, emite y valida sesiones y maneja proveedores OAuth, con integración para Astro, Express y Next.js.

## Antes de empezar

Esta integración parte de un proyecto Astro con adaptador de servidor y renderizado bajo demanda y un cliente Prisma configurado para PostgreSQL. Sigue primero [Prisma en astro](/backend/astro/astro-prisma). Mantén una sola carpeta de helpers e imports coherentes. Define `BETTER_AUTH_SECRET` y `BETTER_AUTH_URL` en el entorno del servidor; configura las credenciales GitHub solo si activarás ese proveedor.

Con Prisma, la CLI de Better Auth **genera el esquema**, y Prisma crea/aplica la migración. Hazlo en desarrollo y revisa el diff antes de aplicar las migraciones versionadas en producción. `auth@latest` sigue el canal actual: registra la versión resuelta cuando reproduzcas esta guía.

## Instalación

```bash
pnpm add better-auth @better-auth/prisma-adapter
```

## Configuración rápida — de cero a un endpoint funcionando

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
      clientId: import.meta.env.GITHUB_CLIENT_ID,
      clientSecret: import.meta.env.GITHUB_CLIENT_SECRET
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

**3. Montar el endpoint catch-all** — sí hace falta crear esta ruta, es lo que expone todo `/api/auth/*`:

```ts title="src/pages/api/auth/[...all].ts"
import type { APIRoute } from "astro"
import { auth } from "../../../lib/auth"

export const ALL: APIRoute = async (context) => {
  return auth.handler(context.request)
}
```

El archivo `[...all].ts` (ruta dinámica catch-all de Astro) captura cualquier ruta bajo `/api/auth/*` — `sign-in`, `sign-up`, `sign-out`, callbacks de OAuth, todos pasan por este único handler. **No hace falta escribir rutas propias de login/registro.**

**4. Leer la sesión en el middleware, para poblar `context.locals`:**

```ts title="src/middleware.ts"
import { defineMiddleware } from "astro:middleware"
import { auth } from "./lib/auth"

export const onRequest = defineMiddleware(async (context, next) => {
  const session = await auth.api.getSession({
    headers: context.request.headers
  })
  context.locals.user = session?.user ?? null

  return next()
})
```

Requiere `output: 'server'` o mantener `output: 'static'` y marcar las rutas de autenticación con `export const prerender = false`. El antiguo modo `hybrid` se expresa hoy con esa selección por ruta.

## Proteger una página

Declara `App.Locals.user` en `src/env.d.ts` como `import("better-auth").User | null`; la [receta de sesión](/backend/astro/astro-auth-completa) incluye ese archivo. Asignar `context.locals.user` sin declarar su tipo produce un error en `astro check`.

```astro title="src/pages/perfil.astro"
---
if (!Astro.locals.user) {
  return Astro.redirect("/login")
}
---

<h1>Hola, {Astro.locals.user.name}</h1>
```

## Proteger un endpoint

El siguiente fragmento supone un `postsRepository` ya implementado e importado. Antes de crear el registro, valida los campos permitidos del cuerpo con un esquema: no copies campos arbitrarios del cliente a la base de datos.

```ts title="src/pages/api/posts.ts"
import type { APIRoute } from "astro"

export const POST: APIRoute = async ({ request, locals }) => {
  if (!locals.user) {
    return new Response(JSON.stringify({ error: "No autenticado" }), {
      status: 401
    })
  }

  let body: unknown
  try { body = await request.json() } catch {
    return Response.json({ error: "JSON inválido" }, { status: 400 })
  }
  if (!body || typeof body !== "object" || !("title" in body) ||
      typeof body.title !== "string" || !body.title.trim()) {
    return Response.json({ error: "Falta title" }, { status: 400 })
  }
  const post = await postsRepository.create({
    title: body.title.trim(),
    authorId: locals.user.id
  })
  return new Response(JSON.stringify(post), { status: 201 })
}
```

## Login/registro desde un componente

```astro title="src/components/AuthForm.astro"
<script>
  import { createAuthClient } from "better-auth/client"

  const authClient = createAuthClient()

  document
    .querySelector("#login-form")
    ?.addEventListener("submit", async (e) => {
      e.preventDefault()
      const form = e.target as HTMLFormElement
      const email = (form.email as HTMLInputElement).value
      const password = (form.password as HTMLInputElement).value

      const { error } = await authClient.signIn.email({ email, password })
      if (error) {
        document.querySelector("#login-status")!.textContent = "Revisa tus credenciales."
        return
      }
      window.location.href = "/perfil"
    })
</script>

<form id="login-form">
  <label for="login-email">Email</label>
  <input
    id="login-email"
    name="email"
    type="email"
    required
  />
  <label for="login-password">Contraseña</label>
  <input
    id="login-password"
    name="password"
    type="password"
    required
  />
  <button type="submit">Entrar</button>
  <p id="login-status" role="status"></p>
</form>
```

## Roles y datos custom del usuario

```ts title="src/lib/auth.ts"
export const auth = betterAuth({
  // ...
  user: {
    additionalFields: {
      rol: { type: "string", defaultValue: "user", input: false }
    }
  }
})
```

Tras regenerar el schema (`pnpm dlx auth@latest generate`), `locals.user.rol` queda disponible en cualquier página/endpoint que lea la sesión del middleware.

## Piezas de Better Auth en Astro

| Pieza                                    | Rol                                                               |
| ---------------------------------------- | ----------------------------------------------------------------- |
| `betterAuth({ database, ...providers })` | Configuración central                                             |
| `pages/api/auth/[...all].ts`             | Ruta catch-all que expone todos los endpoints de auth             |
| `context.locals.user`                    | Poblado en el middleware, disponible en páginas y endpoints       |
| `createAuthClient()`                     | Client para login/registro desde el navegador, sin `fetch` manual |

## Sesión, adapter y runtime

- **Sin CORS**: al ser una sola app Astro sirviendo tanto la UI como estos endpoints, no hay origen cruzado que autorizar.
- Requiere un adaptador y rutas renderizadas bajo demanda. Usa `output: 'server'` o `prerender = false` en **todas** las rutas que leen sesión; una página prerenderizada no conoce al usuario de la solicitud.
- Los endpoints generados reemplazan rutas propias de login — no combinar con JWT manual para el mismo flujo.

## Comprobación y límites

Prueba registro, login incorrecto, login correcto, lectura de sesión y logout. Sin sesión, una página protegida debe redirigir y una API debe devolver 401. Prueba también un usuario autenticado sin permiso: debe recibir 403 y no modificar datos.

El campo `rol` usa `input: false` para que el formulario no pueda asignar privilegios. Cambia permisos solo desde una operación autorizada en el servidor. Un campo adicional por sí solo no implementa control de acceso; valida permisos y pertenencia del recurso en cada operación. Si expones roles al cliente, configura también la inferencia de campos adicionales según la API del cliente utilizada.

## Fuentes

- [Better Auth: adapter de Prisma y migraciones](https://better-auth.com/docs/adapters/prisma)
- [Better Auth: campos adicionales de usuario](https://better-auth.com/docs/concepts/users-accounts)
