---
title: CRUD completo
description: Las 5 operaciones sobre un recurso "posts" — Prisma + Express + validación + los status codes correctos, todo junto.
type: recipes
order: 26
tags: [express, crud, prisma, rest]
problem: Un CRUD real de punta a punta, combinando REST, Prisma y manejo de errores en un solo archivo de referencia.
technologies:
  - backend/express/express-rest-crud
  - backend/express/express-prisma
  - backend/express/express-api-error-responses
updatedAt: 2026-08-16
---

## Piezas que se combinan

[REST/CRUD](/backend/express/express-rest-crud) (convenciones de rutas y status codes) + [Prisma](/backend/express/express-prisma) (persistencia) + [respuestas de error](/backend/express/express-api-error-responses) (formato consistente).

## Router completo

```ts title="routes/posts.routes.ts"
import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { AppError } from '../errors/AppError';
import { asyncHandler } from '../utils/asyncHandler';

export const postsRouter = Router();

const crearPostSchema = z.object({
  title: z.string().min(1),
  content: z.string().optional(),
  published: z.boolean().default(false),
});

// GET /posts — listar
postsRouter.get('/', asyncHandler(async (req, res) => {
  const posts = await prisma.post.findMany();
  res.json(posts);
}));

// GET /posts/:id — uno
postsRouter.get('/:id', asyncHandler(async (req, res) => {
  const post = await prisma.post.findUnique({ where: { id: req.params.id } });
  if (!post) throw new AppError(404, 'POST_NO_ENCONTRADO', 'Post no encontrado');
  res.json(post);
}));

// POST /posts — crear
postsRouter.post('/', asyncHandler(async (req, res) => {
  const datos = crearPostSchema.parse(req.body); // lanza si es inválido, lo atrapa asyncHandler
  const post = await prisma.post.create({ data: datos });
  res.status(201).json(post);
}));

// PATCH /posts/:id — actualizar parcial
postsRouter.patch('/:id', asyncHandler(async (req, res) => {
  const datos = crearPostSchema.partial().parse(req.body); // todos los campos opcionales aquí
  const post = await prisma.post.update({ where: { id: req.params.id }, data: datos });
  res.json(post);
}));

// DELETE /posts/:id — eliminar
postsRouter.delete('/:id', asyncHandler(async (req, res) => {
  await prisma.post.delete({ where: { id: req.params.id } });
  res.status(204).end();
}));
```

```ts title="app.ts"
import { postsRouter } from './routes/posts.routes';

app.use('/posts', postsRouter);
app.use(errorHandler); // al final, atrapa el ZodError y cualquier AppError lanzado arriba
```

## Manejar el error de Zod en el error handler

```ts title="middlewares/error-handler.ts"
import { ZodError } from 'zod';
import { AppError } from '../errors/AppError';

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: { code: 'VALIDATION_ERROR', fields: err.flatten().fieldErrors },
    });
  }

  if (err instanceof AppError) {
    return res.status(err.status).json({ error: { code: err.code, message: err.message } });
  }

  console.error(err);
  res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Error interno' } });
};
```

## Consideraciones

- `crearPostSchema.partial()` en el `PATCH` reusa el mismo schema del `POST`, pero con todos los campos opcionales — evita mantener dos schemas casi idénticos.
- Este ejemplo no incluye auth ni ownership (cualquiera puede editar cualquier post) — combinar con [Middleware de autenticación](/backend/express/express-auth-middleware) y el nivel de ownership de [Roles y permisos](/backend/express/express-roles-permisos) para una versión protegida real (ver también [API protegida](/backend/express/express-api-protegida)).
