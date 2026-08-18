---
title: better-auth en Astro
description: Instalación, configuración con adapter y providers, el endpoint catch-all, y leer la sesión en middleware/páginas — sin JWT manual, sin CORS.
category: backend
stack: astro
order: 5
tags: [astro, better-auth, auth]
website: https://www.better-auth.com
related: [guides/astro-backend-arquitectura]
updatedAt: 2026-08-17
---

better-auth es un framework de autenticación TypeScript-first y agnóstico de framework: hashea contraseñas, emite y valida sesiones, y maneja providers OAuth por tú, con integración oficial para Astro (además de Express y Next.js).

## Instalación

```bash
npm install better-auth
```

## Configuración rápida — de cero a un endpoint funcionando

**1. Configurar el core:**

```ts title="src/lib/auth.ts"
import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { prisma } from './prisma';

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: 'postgresql' }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    github: {
      clientId: import.meta.env.GITHUB_CLIENT_ID,
      clientSecret: import.meta.env.GITHUB_CLIENT_SECRET,
    },
  },
});
```

**2. Generar y aplicar las migraciones:**

```bash
npx @better-auth/cli generate
npx @better-auth/cli migrate
```

**3. Montar el endpoint catch-all** — sí hace falta crear esta ruta, es lo que expone todo `/api/auth/*`:

```ts title="src/pages/api/auth/[...all].ts"
import type { APIRoute } from 'astro';
import { auth } from '../../../lib/auth';

export const ALL: APIRoute = async (context) => {
  return auth.handler(context.request);
};
```

El archivo `[...all].ts` (ruta dinámica catch-all de Astro) captura cualquier ruta bajo `/api/auth/*` — `sign-in`, `sign-up`, `sign-out`, callbacks de OAuth, todos pasan por este único handler. **No hace falta escribir rutas propias de login/registro.**

**4. Leer la sesión en el middleware, para poblar `context.locals`:**

```ts title="src/middleware.ts"
import { defineMiddleware } from 'astro:middleware';
import { auth } from './lib/auth';

export const onRequest = defineMiddleware(async (context, next) => {
  const session = await auth.api.getSession({ headers: context.request.headers });
  context.locals.user = session?.user ?? null;

  return next();
});
```

Requiere `output: 'server'` o mantener `output: 'static'` y marcar las rutas de autenticación con `export const prerender = false`. El antiguo modo `hybrid` se expresa hoy con esa selección por ruta.

## Proteger una página

```astro title="src/pages/perfil.astro"
---
if (!Astro.locals.user) {
  return Astro.redirect('/login');
}
---
<h1>Hola, {Astro.locals.user.name}</h1>
```

## Proteger un endpoint

```ts title="src/pages/api/posts.ts"
import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request, locals }) => {
  if (!locals.user) {
    return new Response(JSON.stringify({ error: 'No autenticado' }), { status: 401 });
  }

  const body = await request.json();
  const post = await postsRepository.create({ ...body, authorId: locals.user.id });
  return new Response(JSON.stringify(post), { status: 201 });
};
```

## Login/registro desde un componente

```astro title="src/components/AuthForm.astro"
<script>
  import { createAuthClient } from 'better-auth/client';

  const authClient = createAuthClient();

  document.querySelector('#login-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const email = (form.email as HTMLInputElement).value;
    const password = (form.password as HTMLInputElement).value;

    await authClient.signIn.email({ email, password });
    window.location.href = '/perfil';
  });
</script>

<form id="login-form">
  <input name="email" type="email" required />
  <input name="password" type="password" required />
  <button type="submit">Entrar</button>
</form>
```

## Roles y datos custom del usuario

```ts title="src/lib/auth.ts"
export const auth = betterAuth({
  // ...
  user: {
    additionalFields: {
      rol: { type: 'string', defaultValue: 'user' },
    },
  },
});
```

Tras regenerar el schema (`npx @better-auth/cli generate`), `locals.user.rol` queda disponible en cualquier página/endpoint que lea la sesión del middleware.

## Resumen

| Pieza | Rol |
| --- | --- |
| `betterAuth({ database, ...providers })` | Configuración central |
| `pages/api/auth/[...all].ts` | Ruta catch-all que expone todos los endpoints de auth |
| `context.locals.user` | Poblado en el middleware, disponible en páginas y endpoints |
| `createAuthClient()` | Client para login/registro desde el navegador, sin `fetch` manual |

## Consideraciones

- **Sin CORS**: al ser una sola app Astro sirviendo tanto la UI como estos endpoints, no hay origen cruzado que autorizar.
- Requiere `output: 'server'` — en modo estático puro no hay servidor corriendo para atender el catch-all en runtime.
- Los endpoints generados reemplazan rutas propias de login — no combinar con JWT manual para el mismo flujo.
