---
title: Auth completa con better-auth en Astro
description: Setup completo — config, endpoint catch-all, middleware, página protegida y botones de login/logout.
category: backend
stack: astro
order: 7
tags: [astro, auth, better-auth]
problem: Todas las piezas de better-auth en Astro juntas, de cero a una página protegida funcionando.
technologies: [guides/astro-better-auth]
updatedAt: 2026-08-16
---

## Setup

```bash
npm install better-auth @prisma/client
npx @better-auth/cli generate
npx @better-auth/cli migrate
```

## Config

```ts title="src/lib/auth.ts"
import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { prisma } from './prisma';

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: 'postgresql' }),
  emailAndPassword: { enabled: true },
});
```

## Endpoint catch-all

```ts title="src/pages/api/auth/[...all].ts"
import type { APIRoute } from 'astro';
import { auth } from '../../../lib/auth';

export const ALL: APIRoute = async (context) => auth.handler(context.request);
```

## Middleware

```ts title="src/middleware.ts"
import { defineMiddleware } from 'astro:middleware';
import { auth } from './lib/auth';

export const onRequest = defineMiddleware(async (context, next) => {
  const session = await auth.api.getSession({ headers: context.request.headers });
  context.locals.user = session?.user ?? null;
  return next();
});
```

## Formulario de registro (Server Action)

```ts title="src/actions/auth.ts"
import { defineAction } from 'astro:actions';
import { z } from 'zod';
import { auth } from '../lib/auth';

export const authActions = {
  registro: defineAction({
    input: z.object({ email: z.string().email(), password: z.string().min(8), name: z.string() }),
    handler: async (input) => {
      return auth.api.signUpEmail({ body: input });
    },
  }),
};
```

```astro title="src/pages/registro.astro"
---
import { actions } from 'astro:actions';
---
<form method="POST" action={actions.authActions.registro}>
  <input name="name" placeholder="Nombre" required />
  <input name="email" type="email" placeholder="Email" required />
  <input name="password" type="password" placeholder="Contraseña" required />
  <button type="submit">Registrarse</button>
</form>
```

## Página protegida

```astro title="src/pages/perfil.astro"
---
if (!Astro.locals.user) {
  return Astro.redirect('/login');
}
---
<h1>Hola, {Astro.locals.user.name}</h1>
<form action="/api/auth/sign-out" method="POST">
  <button type="submit">Cerrar sesión</button>
</form>
```

## Consideraciones

- Cada pieza de esta receta está documentada a fondo en [better-auth en Astro](/guides/astro-better-auth) — acá solo el ensamblado end-to-end.
- Requiere `output: 'server'` configurado en `astro.config.mjs`, y una base de datos ya migrada con el schema que genera `@better-auth/cli`.
