---
title: Backend en Astro — endpoints + middleware
description: Con output "server", los endpoints y el middleware de Astro son tu backend. Cómo organizarlos, sin repetir su mecánica ya documentada en Frontend.
category: backend
stack: astro
order: 1
tags: [astro, architecture, server]
scope: arquitectura backend en Astro
related:
  - guides/astro-endpoints
  - guides/astro-middleware
  - guides/astro-server-actions
updatedAt: 2026-08-16
---

Con `output: 'server'`, Astro deja de ser solo un generador de sitios estáticos — sus endpoints y su middleware pueden correr en cada request. También puedes mantener `output: 'static'` y marcar únicamente las rutas dinámicas con `export const prerender = false`; ese es el reemplazo actual del antiguo modo `hybrid`. La mecánica de cada pieza (`export function GET`, `defineMiddleware`, Actions) ya está documentada a fondo en Frontend/Astro: [Endpoints](/guides/astro-endpoints), [Middleware](/guides/astro-middleware), [Server Actions](/guides/astro-server-actions). Esta guía es sobre cómo se **organizan** esas piezas cuando el proyecto las usa con intención de backend, no sobre su sintaxis.

## Dónde vive cada cosa

```text
src/
├── middleware.ts              # auth, CORS (rara vez necesario), logging — corre en TODA request
├── pages/
│   └── api/
│       ├── posts.ts           # GET/POST /api/posts
│       └── posts/[id].ts      # GET/PATCH/DELETE /api/posts/:id
├── actions/
│   └── posts.ts               # Server Actions, para mutaciones desde formularios/componentes
├── lib/
│   ├── prisma.ts               # o supabase.ts
│   └── auth.ts                 # config de better-auth / auth-astro
└── repositories/
    └── posts.repository.ts     # capa de acceso a datos, mismo patrón que en Express
```

## Endpoints vs Server Actions: cuándo cada uno

```text
Endpoints (pages/api/*.ts)  →  API pública/consumida por fetch externo, webhooks, un cliente que no es la propia app
Server Actions (actions/*)  →  mutaciones desde la propia UI (formularios, componentes) de esta misma app Astro
```

Si el único consumidor directamente operación es la propia app Astro (un formulario que crea un post), una Server Action evita escribir un endpoint + el `fetch` manual del lado del cliente. Si algo externo necesita pegarle (un webhook de Stripe, un cliente mobile, otro servicio), un endpoint REST tradicional en `pages/api/` es lo que corresponde.

## El repository sigue teniendo sentido

El mismo patrón de capas de [la arquitectura MVC de Express](/patterns/backend-mvc-structure) aplica aquí, simplificado — Astro no tiene "controllers" separados (el endpoint mismo cumple ese rol), pero separar el acceso a datos en un `repository` sigue evitando que la lógica de Prisma/Supabase quede desparramada en cada archivo de `pages/api/`.

```ts title="pages/api/posts.ts"
import type { APIRoute } from 'astro';
import { postsRepository } from '../../repositories/posts.repository';

export const GET: APIRoute = async () => {
  const posts = await postsRepository.findAll();
  return new Response(JSON.stringify(posts), {
    headers: { 'Content-Type': 'application/json' },
  });
};
```

## Middleware: dónde va la autenticación

```ts title="middleware.ts"
import { defineMiddleware } from 'astro:middleware';
import { auth } from './lib/auth';

export const onRequest = defineMiddleware(async (context, next) => {
  const session = await auth.api.getSession({ headers: context.request.headers });
  context.locals.user = session?.user ?? null;
  return next();
});
```

`context.locals` es cómo el middleware le pasa datos (el usuario actual) a cualquier endpoint o página que corra después en la misma request — ver [Middleware](/guides/astro-middleware) para el detalle completo del mecanismo.

## Resumen

| Pieza de Astro | Rol en el backend |
| --- | --- |
| `middleware.ts` | Auth, poblar `context.locals`, corre en toda request |
| `pages/api/*.ts` | Endpoints REST tradicionales, para consumidores externos |
| `actions/*.ts` | Mutaciones desde la propia UI, sin armar un endpoint + fetch manual |
| `repositories/` | Mismo patrón de capas que en Express, adaptado |

## Consideraciones

- **No hace falta CORS** en la mayoría de los casos: si el frontend y el backend son la misma app Astro (mismo origen), CORS simplemente no aplica — a diferencia directamente API Express separada del frontend.
- `output: 'server'` cambia el modelo de deploy (necesita un adapter — Node, Vercel, etc. — y ya no es solo archivos estáticos) — confirmar que el hosting elegido soporta SSR antes de depender de endpoints/actions en producción.
