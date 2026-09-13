---
title: Auth completa con better-auth en Astro
description: Ensamblar registro, login, sesión y logout con Better Auth sobre un proyecto Astro con Prisma y servidor configurados.
type: recipes
sidebar:
  order: 7
tags: [astro, auth, better-auth]
problem: Todas las piezas de better-auth en Astro juntas, de cero a una página protegida funcionando.
technologies: [backend/astro/astro-better-auth]
updatedAt: 2026-09-07
---

## Antes de empezar

Prepara [Prisma en Astro](/backend/astro/astro-prisma) y un [adaptador de servidor](/backend/astro/astro-ssr-adapters) con `output: "server"`. Usa `src/lib/` para todos los helpers. Define `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL` y `DATABASE_URL` solo en el servidor. Esta receta presupone esa infraestructura y detalla el flujo del usuario.

## Preparación

```bash
pnpm add better-auth @better-auth/prisma-adapter
```

## Config

```ts title="src/lib/auth.ts"
import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { prisma } from "./prisma"

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  emailAndPassword: { enabled: true }
})
```

Con la configuración creada, genera el esquema de autenticación y aplica la migración en tu base de desarrollo. La CLI de Better Auth no aplica migraciones de Prisma:

```bash
pnpm dlx auth@latest generate
pnpm exec prisma migrate dev --name add-auth
pnpm exec prisma generate
```

## Endpoint catch-all

```ts title="src/pages/api/auth/[...all].ts"
import type { APIRoute } from "astro"
import { auth } from "../../../lib/auth"

export const ALL: APIRoute = async (context) => auth.handler(context.request)
```

## Middleware

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

## Tipar la sesión

```ts title="src/env.d.ts"
declare namespace App {
  interface Locals {
    user: import("better-auth").User | null
  }
}
```

## Registro y login

Este formulario usa el cliente de navegador de Better Auth: sus respuestas gestionan las cookies del endpoint. El registro y el login son acciones distintas sobre los mismos campos. Requiere JavaScript; si necesitas formularios sin él, implementa un endpoint que procese el formulario y propague los encabezados `Set-Cookie` de Better Auth.

```astro title="src/pages/login.astro"
<form id="auth-form">
  <label>Nombre (para registrarse) <input name="name" autocomplete="name" /></label>
  <label>Email <input name="email" type="email" autocomplete="email" required /></label>
  <label>Contraseña <input name="password" type="password" minlength="8" autocomplete="current-password" required /></label>
  <button name="mode" value="login" type="submit">Entrar</button>
  <button name="mode" value="register" type="submit">Crear cuenta</button>
  <p id="auth-status" role="status"></p>
</form>

<script>
  import { createAuthClient } from "better-auth/client"
  const client = createAuthClient()
  const form = document.querySelector<HTMLFormElement>("#auth-form")!
  const status = document.querySelector<HTMLParagraphElement>("#auth-status")!
  const buttons = form.querySelectorAll<HTMLButtonElement>("button")
  form.addEventListener("submit", async event => {
    event.preventDefault()
    const register = (event.submitter as HTMLButtonElement | null)?.value === "register"
    const data = new FormData(form)
    const email = String(data.get("email") ?? "")
    const password = String(data.get("password") ?? "")
    const name = String(data.get("name") ?? "").trim()
    if (register && !name) {
      status.textContent = "Escribe tu nombre para crear la cuenta."
      return
    }
    buttons.forEach(button => button.disabled = true)
    status.textContent = "Procesando…"
    try {
      const result = register
        ? await client.signUp.email({ email, password, name })
        : await client.signIn.email({ email, password })
      if (result.error) {
        status.textContent = "No se pudo completar la operación. Revisa los datos."
        return
      }
      window.location.assign("/perfil")
    } catch {
      status.textContent = "No hay conexión. Inténtalo de nuevo."
    } finally {
      buttons.forEach(button => button.disabled = false)
    }
  })
</script>
```

## Página protegida

```astro title="src/pages/perfil.astro"
---
if (!Astro.locals.user) {
  return Astro.redirect("/login")
}
---

<h1>Hola, {Astro.locals.user.name}</h1>
<button id="logout" type="button">Cerrar sesión</button>
<p id="logout-status" role="status"></p>
<script>
  import { createAuthClient } from "better-auth/client"
  const client = createAuthClient()
  document.querySelector("#logout")?.addEventListener("click", async () => {
    const status = document.querySelector("#logout-status")!
    try {
      const { error } = await client.signOut()
      if (error) { status.textContent = "No se pudo cerrar la sesión."; return }
      window.location.assign("/login")
    } catch { status.textContent = "Revisa la conexión e inténtalo de nuevo." }
  })
</script>
```

## Consideraciones

- Cada pieza de esta receta está documentada a fondo en [better-auth en Astro](/backend/astro/astro-better-auth) — aquí solo el ensamblado end-to-end.
- Los ejemplos asumen navegación normal entre páginas. Si usas `ClientRouter`, adapta la inicialización y limpieza de listeners al ciclo de navegación de Astro.
- La verificación de email y recuperación de contraseña requieren configurar el envío de correo. No anuncies una cuenta como verificada solo porque pudo registrarse.

## Comprobación

Visita `/perfil` sin cookie: redirige a `/login`. Registra una cuenta ficticia, comprueba que aparece su nombre y cierra sesión. Al recargar `/perfil` debe redirigir otra vez. Un login incorrecto debe permanecer en el formulario con feedback; un fallo de red debe permitir reintentar. Verifica las cookies en las herramientas del navegador y nunca en logs públicos.

## Fuentes

- [Better Auth: integración con Astro](https://better-auth.com/docs/integrations/astro)
- [Better Auth: migraciones con Prisma](https://better-auth.com/docs/adapters/prisma)
