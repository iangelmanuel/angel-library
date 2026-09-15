---
title: Better Auth
description: Framework de autenticación para TypeScript agnóstico del framework — sesiones, email/contraseña, OAuth y plugins (2FA, passkeys, organizaciones) sobre tu propia base de datos.
tags: [typescript, auth, sesiones, oauth, node]
sidebar:
  order: 1
draft: false
resourceCategory: Documentación del paquete
website: https://www.better-auth.com
github: https://github.com/better-auth/better-auth
technologies:
  - backend/astro/astro-better-auth
  - backend/express/express-better-auth
  - backend/nextjs/nextjs-better-auth
note: "Cada plugin que se activa suele añadir tablas: hay que volver a correr `generate` y aplicar la migración antes de usarlo."
updatedAt: 2026-09-14
---

Better Auth es una librería de autenticación y autorización para TypeScript, **agnóstica del framework y sin servicio externo**: las tablas de usuarios y sesiones viven en tu base de datos y el proveedor de identidad sigue siendo tu propia aplicación. Licencia MIT.

La diferencia con armar el auth a mano es lo que ya trae resuelto: hash de contraseñas, emisión y rotación de sesiones en cookie, verificación por correo, OAuth con los proveedores habituales y un sistema de plugins para lo que normalmente se posterga (2FA, passkeys, organizaciones, rate limit).

Esta entrada cubre el paquete en general. Para la integración concreta hay guías por framework: [Astro](/backend/astro/astro-better-auth), [Express](/backend/express/express-better-auth) y [Next.js](/backend/nextjs/nextjs-better-auth).

## Instalación

```bash
pnpm add better-auth
```

## El servidor

`betterAuth()` devuelve un objeto con un `handler` (un `Request → Response` estándar) y una API para usar desde el servidor.

```ts title="src/lib/auth.ts"
import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { prisma } from "./prisma"

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  emailAndPassword: { enabled: true },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!
    }
  }
})
```

Dos variables de entorno son obligatorias y **solo del servidor**:

```bash title=".env"
BETTER_AUTH_SECRET="una-cadena-larga-y-aleatoria"
BETTER_AUTH_URL="http://localhost:4321"
```

`BETTER_AUTH_SECRET` firma las sesiones: si cambia, todas caducan. `BETTER_AUTH_URL` es la base que se usa para armar los callbacks de OAuth — en producción debe ser la URL pública real.

## El esquema de la base de datos

Better Auth necesita sus tablas (`user`, `session`, `account`, `verification`, más las que agreguen los plugins). Su CLI las deriva de tu configuración:

```bash
pnpm dlx @better-auth/cli generate
```

Con un ORM que versiona migraciones (Prisma, Drizzle) esto **genera el esquema** y la migración la crea y aplica el ORM. Con conexión directa a la base, `migrate` puede aplicarla él mismo:

```bash
pnpm dlx @better-auth/cli migrate
```

Revisa el diff antes de aplicar nada en producción: agregar un plugin cambia el esquema.

## Montar el endpoint

Todo pasa por una ruta catch-all bajo `/api/auth`. En cualquier framework con Request/Response estándar es una línea:

```ts
// El handler recibe la Request y devuelve la Response.
export const ALL = ({ request }: { request: Request }) =>
  auth.handler(request)
```

## El cliente

```ts title="src/lib/auth-client.ts"
import { createAuthClient } from "better-auth/client"

export const authClient = createAuthClient({
  baseURL: "http://localhost:4321"
})
```

```ts
await authClient.signUp.email({
  email: "ana@ejemplo.com",
  password: "una-contraseña-larga",
  name: "Ana"
})

await authClient.signIn.email({
  email: "ana@ejemplo.com",
  password: "una-contraseña-larga"
})

await authClient.signIn.social({ provider: "github" })

await authClient.signOut()
```

Hay entradas específicas por framework (`better-auth/react`, `better-auth/vue`, `better-auth/svelte`) que añaden un hook reactivo de sesión, como `useSession`.

## Leer la sesión en el servidor

La comprobación que importa es esta, y va en el servidor — nunca solo en el cliente:

```ts
const session = await auth.api.getSession({
  headers: request.headers
})

if (!session) {
  return new Response("No autorizado", { status: 401 })
}

session.user.id
```

## Plugins

Se activan en la configuración y casi siempre agregan tablas y métodos al cliente:

| Plugin           | Qué añade                                               |
| ---------------- | ------------------------------------------------------- |
| `twoFactor`      | Segundo factor por TOTP y códigos de respaldo           |
| `passkey`        | Inicio de sesión con WebAuthn                           |
| `organization`   | Organizaciones, miembros, invitaciones y roles          |
| `admin`          | Gestión de usuarios: banear, listar, impersonar         |
| `magicLink`      | Acceso por enlace enviado al correo                     |
| `jwt`            | Emitir JWT para consumidores que no usan cookies        |

```ts
import { twoFactor } from "better-auth/plugins"

export const auth = betterAuth({
  // ...
  plugins: [twoFactor()]
})
```

Cada plugin nuevo suele implicar volver a correr `generate` y migrar.

## Notas de operación

- El `secret` y las credenciales de OAuth son del servidor: si aparecen en un bundle de cliente, están comprometidas.
- En producción, cookies con `Secure` y dominio correcto; con subdominios hay que configurarlo explícitamente.
- La verificación de correo y el rate limit no están activos por defecto — decídelos antes de abrir el registro.
- El proyecto se mueve rápido: fija la versión en `package.json` y revisa el changelog antes de subir de minor.
