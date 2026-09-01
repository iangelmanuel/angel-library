---
title: Estructura MVC completa (carpetas reales)
description: El árbol de carpetas de la guía de arquitectura, pero con archivos reales y código andando — no solo el diagrama.
type: recipes
order: 27
tags: [express, mvc, architecture]
problem: Ver la estructura por capas (routes/controllers/services/repositories) con código de verdad en cada archivo, no solo la explicación conceptual.
technologies: [backend/express/backend-mvc-structure]
updatedAt: 2026-08-16
---

## El concepto ya está documentado

Esta receta lleva a código la [Estructura MVC para APIs Express](/backend/express/backend-mvc-structure): conserva el árbol y el flujo de una request, con un recurso `posts` implementado en cada capa.

## Árbol completo

```text
src/
├── app.ts
├── server.ts
├── routes/posts.routes.ts
├── controllers/posts.controller.ts
├── services/posts.service.ts
├── repositories/posts.repository.ts
├── middlewares/error-handler.ts
└── errors/AppError.ts
```

## `repositories/posts.repository.ts` — solo acceso a datos

```ts
import { prisma } from '../lib/prisma';

export const postsRepository = {
  findAll: () => prisma.post.findMany(),
  findById: (id: string) => prisma.post.findUnique({ where: { id } }),
  create: (data: { title: string; content?: string }) => prisma.post.create({ data }),
  delete: (id: string) => prisma.post.delete({ where: { id } }),
};
```

## `services/posts.service.ts` — reglas de negocio

```ts
import { postsRepository } from '../repositories/posts.repository';
import { AppError } from '../errors/AppError';

export const postsService = {
  async obtenerPost(id: string) {
    const post = await postsRepository.findById(id);
    if (!post) throw new AppError(404, 'POST_NO_ENCONTRADO', 'Post no encontrado');
    return post;
  },

  async crearPost(datos: { title: string; content?: string }) {
    if (datos.title.trim().length === 0) {
      throw new AppError(400, 'TITULO_VACIO', 'El título no puede estar vacío');
    }
    return postsRepository.create(datos);
  },
};
```

## `controllers/posts.controller.ts` — única capa que conoce `req`/`res`

```ts
import type { Request, Response } from 'express';
import { postsService } from '../services/posts.service';

export const postsController = {
  async getPost(req: Request, res: Response) {
    const post = await postsService.obtenerPost(req.params.id);
    res.json(post);
  },

  async createPost(req: Request, res: Response) {
    const post = await postsService.crearPost(req.body);
    res.status(201).json(post);
  },
};
```

## `routes/posts.routes.ts` — solo mapeo ruta → controller

```ts
import { Router } from 'express';
import { postsController } from '../controllers/posts.controller';
import { asyncHandler } from '../utils/asyncHandler';

export const postsRouter = Router();

postsRouter.get('/:id', asyncHandler(postsController.getPost));
postsRouter.post('/', asyncHandler(postsController.createPost));
```

## Por qué separar así (recordatorio del patrón)

Cambiar de Prisma a otro ORM toca solo `repositories/`. Cambiar una regla de negocio (por ejemplo, longitud mínima del título) toca solo `services/`. Cambiar cómo se lee `req.body` o el status code de la respuesta toca solo `controllers/`. Cada capa tiene una sola razón para cambiar — ver el resto del razonamiento en el [doc de arquitectura](/backend/express/backend-mvc-structure).

## Consideraciones

- Para un proyecto chico (un CRUD, un prototipo), cuatro capas por cada recurso puede sentirse como overhead — el patrón se justifica cuando el proyecto crece lo suficiente como para que mezclar todo en un archivo empiece a doler. No hace falta empezar así desde el día uno de un proyecto trivial.
- El `controller` aquí no tiene `try/catch` propio porque `asyncHandler` ya lo cubre (ver [Manejo de errores centralizado](/backend/express/express-error-handling)) — cualquier `throw` de `service` sube directo al error handler.
