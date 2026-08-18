---
title: API REST con Route Handlers
description: Los mismos principios de REST/CRUD/paginación de Express, aplicados a la sintaxis de Route Handlers de Next.js.
category: backend
stack: nextjs
order: 2
tags: [nextjs, api, rest]
related:
  - guides/express-rest-crud
  - guides/express-api-paginacion
  - guides/nextjs-endpoints
updatedAt: 2026-08-16
---

Las convenciones — verbo HTTP correcto, cómo paginar/filtrar, formato de errores — son las mismas que en [REST y CRUD](/guides/express-rest-crud) y [Paginación, filtrado y búsqueda](/guides/express-api-paginacion). Esta guía es solo la sintaxis de Route Handlers, que ya está introducida en [Endpoints (Route Handlers)](/guides/nextjs-endpoints).

## Un recurso completo

```ts title="app/api/posts/route.ts"
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { postsRepository } from '@/repositories/posts.repository';
import { auth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const page = Number(request.nextUrl.searchParams.get('page') ?? 1);
  const limit = Number(request.nextUrl.searchParams.get('limit') ?? 20);

  const { data, total } = await postsRepository.findPaginated({ page, limit });
  return NextResponse.json({ data, pagination: { page, limit, total } });
}

const crearPostSchema = z.object({ title: z.string().min(1) });

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: { code: 'NO_AUTENTICADO' } }, { status: 401 });
  }

  const body = await request.json();
  const resultado = crearPostSchema.safeParse(body);

  if (!resultado.success) {
    return NextResponse.json(
      { error: { code: 'VALIDATION_ERROR', fields: resultado.error.flatten().fieldErrors } },
      { status: 400 },
    );
  }

  const post = await postsRepository.create({ ...resultado.data, authorId: session.user.id });
  return NextResponse.json(post, { status: 201 });
}
```

## Ruta dinámica: `app/api/posts/[id]/route.ts`

```ts title="app/api/posts/[id]/route.ts"
import { NextResponse } from 'next/server';
import { postsRepository } from '@/repositories/posts.repository';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; // params es una Promise desde Next 15+
  const post = await postsRepository.findById(id);

  if (!post) {
    return NextResponse.json({ error: { code: 'NO_ENCONTRADO' } }, { status: 404 });
  }

  return NextResponse.json(post);
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await postsRepository.delete(id);
  return new NextResponse(null, { status: 204 });
}
```

`params` como Promise (no un objeto directo) es un cambio de Next.js 15+ — ver [Leer params y searchParams](/guides/nextjs-params-searchparams) para el detalle completo de ese cambio.

## La diferencia principal frente a Express: sin middleware por ruta

Igual que en Astro, Next.js no tiene una cadena de middlewares específica por Route Handler — la protección amplia va en `proxy.ts` (ver [Backend en Next.js](/guides/nextjs-backend-arquitectura)), y chequeos específicos de la ruta (como `auth()` en el ejemplo de `POST` arriba) van al principio del handler mismo.

## Resumen

| Concepto | Dónde ya está documentado |
| --- | --- |
| Verbos HTTP, status codes correctos | [REST y CRUD](/guides/express-rest-crud) |
| Paginación/filtrado | [Paginación, filtrado y búsqueda](/guides/express-api-paginacion) |
| Sintaxis de Route Handlers, `params`/`searchParams` | [Endpoints](/guides/nextjs-endpoints), [Leer params y searchParams](/guides/nextjs-params-searchparams) |

## Consideraciones

- `NextResponse.json(body, { status })` es el helper equivalente a `res.status(status).json(body)` de Express — misma idea, forma distinta de escribirlo.
- Un Route Handler puede declarar `export const runtime = 'edge'` para correr en el Edge Runtime (más rápido para arrancar, con limitaciones — por ejemplo, Prisma necesita un driver adapter especial ahí, ver [Prisma en Next.js](/guides/nextjs-prisma)) — el default (`'nodejs'`) alcanza para la gran mayoría de los casos.
