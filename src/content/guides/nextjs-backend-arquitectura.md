---
title: Backend en Next.js — Route Handlers + Server Actions
description: Las dos superficies de backend del App Router, cómo organizarlas, sin repetir su mecánica ya documentada en Frontend.
category: backend
stack: nextjs
order: 1
tags: [nextjs, architecture, server]
scope: arquitectura backend en Next.js
related:
  - guides/nextjs-endpoints
  - guides/nextjs-server-actions
  - guides/nextjs-proxy
updatedAt: 2026-08-16
---

El App Router de Next.js tiene dos superficies para lógica de servidor — Route Handlers y Server Actions — cuya sintaxis ya está documentada a fondo en Frontend/Next.js: [Endpoints (Route Handlers)](/guides/nextjs-endpoints), [Server Actions](/guides/nextjs-server-actions), [Proxy](/guides/nextjs-proxy). Esta guía es sobre cómo se **organizan** cuando el proyecto las usa con intención de backend real, no sobre su sintaxis.

## Dónde vive cada cosa

```text
src/
├── proxy.ts                    # auth, redirects — corre antes de cada request (antes "middleware.ts")
├── app/
│   └── api/
│       └── posts/
│           ├── route.ts        # GET/POST /api/posts
│           └── [id]/route.ts   # GET/PATCH/DELETE /api/posts/:id
├── actions/
│   └── posts.ts                # Server Actions ('use server'), para mutaciones desde la UI
├── lib/
│   ├── prisma.ts               # o supabase.ts
│   └── auth.ts                 # config de Auth.js / better-auth
└── repositories/
    └── posts.repository.ts     # capa de acceso a datos, mismo patrón que en Express
```

## Route Handlers vs Server Actions: cuándo cada uno

```text
Route Handlers (app/api/*/route.ts)  →  API pública, webhooks, un cliente que no es la propia app
Server Actions ('use server')          →  mutaciones desde la propia UI (formularios, componentes de esta app)
```

Mismo criterio que en Astro — si el único consumidor es la propia app Next.js, una Server Action evita escribir un endpoint + `fetch` manual. Si algo externo necesita pegarle, un Route Handler es lo que corresponde.

## El repository sigue teniendo sentido

```ts title="app/api/posts/route.ts"
import { NextResponse } from 'next/server';
import { postsRepository } from '@/repositories/posts.repository';

export async function GET() {
  const posts = await postsRepository.findAll();
  return NextResponse.json(posts);
}
```

Mismo patrón de capas que en [Express](/patterns/backend-mvc-structure): el Route Handler cumple el rol de "controller" (adapta HTTP), la lógica de negocio va en un service si la operación lo justifica, y el acceso a datos queda aislado en `repositories/`.

## Auth: el `proxy.ts`

```ts title="proxy.ts"
import { auth } from '@/lib/auth'; // Auth.js o better-auth

export default auth((req) => {
  // req.auth tiene la sesión si existe
});

export const config = {
  matcher: ['/dashboard/:path*', '/api/protegida/:path*'],
};
```

`proxy.ts` (el archivo que reemplazó a `middleware.ts` desde Next 16, ver [Proxy](/guides/nextjs-proxy)) es donde vive la protección de rutas a nivel amplio — redirigir a `/login` si no hay sesión, antes de que la request llegue a la página o al Route Handler.

## Resumen

| Pieza de Next.js | Rol en el backend |
| --- | --- |
| `proxy.ts` | Auth a nivel de ruta, corre antes de cada request que matchea |
| `app/api/*/route.ts` | Route Handlers, para consumidores externos |
| Server Actions (`'use server'`) | Mutaciones desde la propia UI |
| `repositories/` | Mismo patrón de capas que en Express, adaptado |

## Consideraciones

- **No hace falta CORS** en la mayoría de los casos — mismo motivo que Astro: frontend y backend son la misma app Next.js, mismo origen.
- El App Router soporta **Cache Components** (`use cache`) como modelo opcional para cachear el resultado de funciones de servidor — relevante para Route Handlers de solo lectura con datos que no cambian en cada request, fuera del alcance de esta guía introductoria (ver [Fetching con revalidate](/guides/nextjs-fetching-revalidate)).
