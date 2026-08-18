---
title: better-auth en Express
description: Instalación, configuración con adapter, providers y sesión, Route Handler catch-all, y cómo leer el usuario en un middleware.
category: backend
stack: express
order: 11
tags: [express, better-auth, auth]
website: https://www.better-auth.com
related: [guides/express-jwt]
updatedAt: 2026-08-17
---

better-auth es un framework de autenticación TypeScript-first y agnóstico de framework: resuelve lo mismo que [JWT + bcrypt + cookies armado a mano](/guides/express-jwt) (hashear contraseñas, emitir y validar una sesión, manejar providers OAuth), pero como solución lista — tú configuras qué métodos de login quieres, y la librería maneja el resto. A diferencia de Auth.js (históricamente atado a Next.js), su core es agnóstico desde el diseño, con integración oficial para Express, Astro y Next.js por igual.

## Instalación

```bash
npm install better-auth
```

## Configuración rápida — de cero a un endpoint funcionando

**1. Configurar el core** (adapter de base de datos + providers):

```ts title="lib/auth.ts"
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
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
  },
});
```

El `database` usa un **adapter** — better-auth no impone un ORM: hay adapters para Prisma, Drizzle, Kysely y SQL directo. `prismaAdapter` es el más común si el proyecto ya usa [Prisma](/guides/express-prisma).

**2. Generar y aplicar las migraciones del schema de auth** (better-auth necesita tablas propias de usuario/sesión):

```bash
npx @better-auth/cli generate   # genera el schema de Prisma/Drizzle necesario
npx @better-auth/cli migrate    # aplica la migración
```

**3. Montar el handler — sí necesita una ruta, un catch-all para toda `/api/auth/*`:**

```ts title="app.ts"
import express from 'express';
import { toNodeHandler } from 'better-auth/node';
import { auth } from './lib/auth';

const app = express();

// Tiene que ir ANTES de express.json() — better-auth necesita el body sin parsear
app.all('/api/auth/*', toNodeHandler(auth));

app.use(express.json());
// ... el resto de las rutas ...
```

`toNodeHandler` convierte el handler agnóstico de framework de better-auth en algo que Express puede montar directo — a partir de ahí, `/api/auth/sign-in`, `/api/auth/sign-up`, los callbacks de OAuth, etc. ya funcionan sin escribirlos a mano. **No hace falta armar rutas propias de login/registro** — este único `app.all` las reemplaza todas.

## Modelo de sesión

better-auth emite una cookie de sesión httpOnly al hacer login — no un JWT que el cliente decodifica, sino un identificador que el servidor valida contra la base en cada request (sesión "server-side", más fácil de revocar que un JWT stateless).

## Leer la sesión en un middleware propio

```ts title="middlewares/requireAuth.ts"
import type { Request, Response, NextFunction } from 'express';
import { auth } from '../lib/auth';
import { fromNodeHeaders } from 'better-auth/node';

declare global {
  namespace Express {
    interface Request {
      user?: { id: string; email: string };
    }
  }
}

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const session = await auth.api.getSession({ headers: fromNodeHeaders(req.headers) });

  if (!session) {
    return res.status(401).json({ error: 'No autenticado' });
  }

  req.user = session.user;
  next();
}
```

```ts
app.get('/perfil', requireAuth, (req, res) => {
  res.json({ userId: req.user!.id });
});
```

Mismo shape de resultado (`req.user` poblado) que el [middleware de auth manual](/guides/express-auth-middleware) — el resto de las rutas protegidas no necesita saber si la sesión viene de JWT manual o de better-auth.

## Login con email/password desde el cliente

better-auth también expone un client (`better-auth/client`) para no armar el `fetch` a mano contra `/api/auth/sign-in`:

```ts title="lib/auth-client.ts"
import { createAuthClient } from 'better-auth/client';

export const authClient = createAuthClient({ baseURL: 'http://localhost:3000' });
```

```ts
await authClient.signIn.email({ email, password });
await authClient.signUp.email({ email, password, name });
await authClient.signOut();
```

## Roles y datos custom del usuario

Para agregar campos propios (como `rol`) al usuario que better-auth gestiona:

```ts title="lib/auth.ts"
export const auth = betterAuth({
  // ...
  user: {
    additionalFields: {
      rol: { type: 'string', defaultValue: 'user' },
    },
  },
});
```

Después de correr `npx @better-auth/cli generate` de nuevo (para que la migración incluya el campo nuevo), `session.user.rol` queda disponible donde sea que se lea la sesión.

## Resumen

| Pieza | Rol |
| --- | --- |
| `betterAuth({ database, ...providers })` | Configuración central |
| `@better-auth/cli generate` / `migrate` | Genera y aplica el schema de auth |
| `toNodeHandler(auth)` en `/api/auth/*` | Expone todos los endpoints de auth, sin rutas propias |
| `auth.api.getSession({ headers })` | Leer la sesión actual dentro de un middleware/ruta propia |
| `user.additionalFields` | Agregar campos custom (como `rol`) al usuario |

## Consideraciones

- Requiere una base de datos configurada desde el inicio (vía el adapter que corresponda) — el trade-off frente a JWT manual es menos control fino a cambio de no reinventar hashing, expiración, refresh y providers OAuth.
- Sesión server-side significa una consulta a la base (o cache) por request autenticado, a diferencia de un JWT que se valida sin tocar la base.
- Los endpoints que genera (`/api/auth/*`) reemplazan por completo rutas propias de `/login`, `/registro`, etc. — no conviene tener ambos sistemas (JWT manual y better-auth) activos para el mismo flujo al mismo tiempo.
