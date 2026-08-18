---
title: API REST con endpoints de Astro
description: Los mismos principios de REST/CRUD/paginación de Express, aplicados a la sintaxis de endpoints de Astro.
category: backend
stack: astro
order: 2
tags: [astro, api, rest]
related:
  - guides/express-rest-crud
  - guides/express-api-paginacion
  - guides/astro-endpoints
updatedAt: 2026-08-16
---

Las convenciones — qué verbo HTTP usar, cómo paginar/filtrar, el formato de errores — son las mismas que en [REST y CRUD](/guides/express-rest-crud) y [Paginación, filtrado y búsqueda](/guides/express-api-paginacion). Esta guía es solo cómo se ven esos mismos principios en la sintaxis de endpoints de Astro, que no tiene un router de terceros (Express) sino archivos con `export function GET/POST/...`.

## Un recurso completo

```ts title="src/pages/api/posts.ts"
import type { APIRoute } from 'astro';
import { z } from 'zod';
import { postsRepository } from '../../repositories/posts.repository';

export const GET: APIRoute = async ({ url }) => {
  const page = Number(url.searchParams.get('page') ?? 1);
  const limit = Number(url.searchParams.get('limit') ?? 20);

  const { data, total } = await postsRepository.findPaginated({ page, limit });

  return new Response(JSON.stringify({ data, pagination: { page, limit, total } }), {
    headers: { 'Content-Type': 'application/json' },
  });
};

const crearPostSchema = z.object({ title: z.string().min(1) });

export const POST: APIRoute = async ({ request, locals }) => {
  if (!locals.user) {
    return new Response(JSON.stringify({ error: { code: 'NO_AUTENTICADO' } }), { status: 401 });
  }

  const body = await request.json();
  const resultado = crearPostSchema.safeParse(body);

  if (!resultado.success) {
    return new Response(
      JSON.stringify({ error: { code: 'VALIDATION_ERROR', fields: resultado.error.flatten().fieldErrors } }),
      { status: 400 },
    );
  }

  const post = await postsRepository.create({ ...resultado.data, authorId: locals.user.id });
  return new Response(JSON.stringify(post), { status: 201, headers: { 'Content-Type': 'application/json' } });
};
```

## Ruta dinámica: `/api/posts/[id]`

```ts title="src/pages/api/posts/[id].ts"
import type { APIRoute } from 'astro';
import { postsRepository } from '../../../repositories/posts.repository';

export const GET: APIRoute = async ({ params }) => {
  const post = await postsRepository.findById(params.id!);

  if (!post) {
    return new Response(JSON.stringify({ error: { code: 'NO_ENCONTRADO' } }), { status: 404 });
  }

  return new Response(JSON.stringify(post), { headers: { 'Content-Type': 'application/json' } });
};

export const DELETE: APIRoute = async ({ params }) => {
  await postsRepository.delete(params.id!);
  return new Response(null, { status: 204 });
};
```

`[id].ts` es la misma convención de rutas dinámicas que Astro usa para páginas — un endpoint no es conceptualmente distinto, solo exporta funciones de verbo HTTP en vez de un componente.

## La diferencia principal frente a Express: sin middleware por ruta

Express permite `app.get(ruta, mw1, mw2, handler)` — una cadena de middlewares específica de esa ruta. Astro no tiene ese mecanismo por archivo; la protección (auth, rate limiting) se resuelve en el [middleware global](/guides/astro-backend-arquitectura) (que corre para toda request y decide qué hacer según la ruta) o a mano, al principio de cada handler, como en el ejemplo de `POST` arriba (`if (!locals.user) return 401`).

## Resumen

| Concepto | Dónde ya está documentado |
| --- | --- |
| Verbos HTTP, status codes correctos | [REST y CRUD](/guides/express-rest-crud) |
| Paginación/filtrado | [Paginación, filtrado y búsqueda](/guides/express-api-paginacion) |
| Formato de respuesta de error | [Diseño de respuestas de error](/guides/express-api-error-responses) |
| Sintaxis de rutas/params de Astro | [Endpoints (API routes)](/guides/astro-endpoints) |

## Consideraciones

- Sin middleware encadenable por ruta, proteger varios endpoints con la misma lógica (auth, un rol específico) suele resolverse chequeando `locals` al principio de cada handler, o centralizando esa decisión en el middleware global según el `pathname` de la request.
- El resto de las decisiones de diseño de API (formato de paginación, de errores) son intencionalmente las mismas que en Express — no hay razón para que una API se vea distinta solo porque el framework que la sirve cambió.
