---
title: CRUD con Prisma en Astro
description: Las 5 operaciones sobre "posts" combinando endpoints, Server Actions y el repository — cuándo usar cada mecanismo.
type: recipes
order: 8
tags: [astro, crud, prisma]
problem: Un CRUD real mostrando la elección entre endpoint y Server Action para cada operación, no solo una de las dos formas.
technologies: [backend/astro/astro-prisma, backend/astro/astro-api-rest]
updatedAt: 2026-08-16
---

## El repository (compartido por ambos mecanismos)

```ts title="src/repositories/posts.repository.ts"
import { prisma } from "../lib/prisma"

export const postsRepository = {
  findAll: () => prisma.post.findMany(),
  findById: (id: string) => prisma.post.findUnique({ where: { id } }),
  create: (data: { title: string; authorId: string }) =>
    prisma.post.create({ data }),
  update: (id: string, data: { title?: string }) =>
    prisma.post.update({ where: { id }, data }),
  delete: (id: string) => prisma.post.delete({ where: { id } })
}
```

## Leer (GET): endpoint — puede necesitarlo un consumidor externo

```ts title="src/pages/api/posts.ts"
import type { APIRoute } from "astro"
import { postsRepository } from "../../repositories/posts.repository"

export const GET: APIRoute = async () => {
  const posts = await postsRepository.findAll()
  return new Response(JSON.stringify(posts), {
    headers: { "Content-Type": "application/json" }
  })
}
```

## Crear/actualizar/borrar: Server Actions — solo la propia UI las usa

```ts title="src/actions/posts.ts"
import { ActionError, defineAction } from "astro:actions"
import { z } from "zod"
import { postsRepository } from "../repositories/posts.repository"

export const posts = {
  crear: defineAction({
    input: z.object({ title: z.string().min(1) }),
    handler: async (input, context) => {
      if (!context.locals.user) throw new ActionError({ code: "UNAUTHORIZED" })
      return postsRepository.create({
        ...input,
        authorId: context.locals.user.id
      })
    }
  }),

  actualizar: defineAction({
    input: z.object({ id: z.string(), title: z.string().min(1) }),
    handler: async ({ id, ...datos }, context) => {
      if (!context.locals.user) throw new ActionError({ code: "UNAUTHORIZED" })
      return postsRepository.update(id, datos)
    }
  }),

  eliminar: defineAction({
    input: z.object({ id: z.string() }),
    handler: async ({ id }, context) => {
      if (!context.locals.user) throw new ActionError({ code: "UNAUTHORIZED" })
      await postsRepository.delete(id)
      return { ok: true }
    }
  })
}
```

## Consumir desde un componente (sin escribir fetch a mano)

```astro title="src/pages/posts/nuevo.astro"
---
import { actions } from "astro:actions"
---

<form
  method="POST"
  action={actions.posts.crear}
>
  <input
    name="title"
    placeholder="Título"
    required
  />
  <button type="submit">Crear post</button>
</form>
```

## Por qué mezclar ambos mecanismos aquí

`GET /api/posts` como endpoint tradicional deja la lista consumible por cualquiera (un fetch externo, otra app) — las mutaciones como Server Actions evitan escribir el `fetch` + manejo de estado a mano del lado del cliente, ya que Astro genera esa integración automáticamente para formularios y componentes de la propia UI. Ver [Backend en Astro](/backend/astro/astro-backend-arquitectura) para el criterio completo de cuándo usar cada uno.

## Consideraciones

- `ActionError` es el mecanismo de Server Actions para errores tipados que el cliente puede inspeccionar (`action.error.code`) — distinto del `Response` con status manual que usa un endpoint tradicional.
- Si todos los consumidores de este CRUD pertenecen a la propia aplicación y no necesitan una API pública, las Server Actions pueden cubrir las cinco operaciones. El endpoint `GET` del ejemplo ilustra un caso mixto.
