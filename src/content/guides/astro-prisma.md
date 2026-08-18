---
title: Prisma en Astro
description: Instalación, schema, client, CRUD completo y transacciones — usado desde endpoints y Server Actions con output "server".
category: backend
stack: astro
order: 7
tags: [astro, prisma, database, orm]
website: https://www.prisma.io
related: [guides/astro-backend-arquitectura]
updatedAt: 2026-08-17
---

Prisma es un ORM con schema declarativo: el `schema.prisma` es la única fuente de verdad, y de ahí genera un client con métodos y tipos exactos para cada modelo. En Astro se usa exactamente igual que en cualquier entorno Node — la diferencia está en **desde dónde** se llama (endpoints, Server Actions), no en la API del client en sí.

## Instalación

```bash
npm install prisma --save-dev
npm install @prisma/client
npx prisma init
```

## Configuración rápida — de cero a un endpoint funcionando

**1. `DATABASE_URL` en `.env`:**

```bash title=".env"
DATABASE_URL="postgresql://postgres:password@localhost:5432/miapp"
```

**2. El schema:**

```prisma title="prisma/schema.prisma"
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model Post {
  id        String   @id @default(cuid())
  title     String
  content   String?
  authorId  String
  createdAt DateTime @default(now())
}
```

**3. Migrar:**

```bash
npx prisma migrate dev --name init
```

**4. El client, como singleton:**

```ts title="src/lib/prisma.ts"
import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();
```

Nada específico de Astro aquí — con `output: 'server'` sobre un adapter Node tradicional, el proceso vive igual que un servidor Express, así que el mismo singleton alcanza.

**5. Un endpoint real:**

```ts title="src/pages/api/posts.ts"
import type { APIRoute } from 'astro';
import { prisma } from '../../lib/prisma';

export const GET: APIRoute = async () => {
  const posts = await prisma.post.findMany();
  return new Response(JSON.stringify(posts), {
    headers: { 'Content-Type': 'application/json' },
  });
};
```

Requiere `output: 'server'` o mantener `output: 'static'` y marcar esta ruta con `export const prerender = false` — en una ruta prerenderizada no hay servidor corriendo para atender el endpoint en runtime. El antiguo modo `hybrid` se reemplazó por esta selección por ruta.

## CRUD básico

```ts
await prisma.post.create({ data: { title: 'Nuevo', authorId: userId } });
await prisma.post.findUnique({ where: { id } });
await prisma.post.findMany({ where: { authorId: userId } });
await prisma.post.update({ where: { id }, data: { title: 'Editado' } });
await prisma.post.delete({ where: { id } });
```

## Métodos que se usan seguido y no son solo CRUD básico

```ts
await prisma.post.findFirst({ where: { published: true }, orderBy: { createdAt: 'desc' } });

await prisma.user.upsert({
  where: { email: 'a@b.com' },
  update: { name: 'Nombre actualizado' },
  create: { email: 'a@b.com', name: 'Nombre nuevo' },
});

await prisma.post.createMany({ data: [{ title: 'Uno', authorId }, { title: 'Dos', authorId }] });
await prisma.post.updateMany({ where: { authorId }, data: { published: true } });
await prisma.post.deleteMany({ where: { authorId } });

await prisma.post.count({ where: { published: true } });
await prisma.post.groupBy({ by: ['authorId'], _count: { id: true } });
```

## Relaciones: `include` y `select`

```ts
const postConAutor = await prisma.post.findUnique({
  where: { id },
  include: { author: true },
});

const soloTitulos = await prisma.post.findMany({ select: { title: true } });
```

## Transacciones con `$transaction`

### Forma secuencial (array de promesas)

```ts
const [post, contador] = await prisma.$transaction([
  prisma.post.create({ data: { title: 'Nuevo', authorId: userId } }),
  prisma.user.update({ where: { id: userId }, data: { postsCount: { increment: 1 } } }),
]);
```

Si una operación del array falla, **todas** se revierten — ninguna queda aplicada a medias.

### Forma interactiva (callback), para lógica que depende de un paso anterior

```ts title="src/actions/posts.ts"
import { defineAction } from 'astro:actions';
import { z } from 'zod';
import { prisma } from '../lib/prisma';

export const posts = {
  crearConLimite: defineAction({
    input: z.object({ title: z.string().min(1) }),
    handler: async (input, context) => {
      if (!context.locals.user) throw new Error('No autenticado');

      return prisma.$transaction(async (tx) => {
        const cantidad = await tx.post.count({ where: { authorId: context.locals.user!.id } });

        if (cantidad >= 100) {
          throw new Error('Límite de posts alcanzado'); // revierte toda la transacción
        }

        return tx.post.create({ data: { ...input, authorId: context.locals.user!.id } });
      });
    },
  }),
};
```

Dentro del callback se usa `tx` (el client transaccional), **nunca** `prisma` directo — usar `prisma` por error adentro ejecutaría esa operación fuera de la transacción.

## Uso en una Server Action

```ts title="src/actions/posts.ts"
import { defineAction } from 'astro:actions';
import { z } from 'zod';
import { prisma } from '../lib/prisma';

export const posts = {
  crear: defineAction({
    input: z.object({ title: z.string().min(1) }),
    handler: async (input, context) => {
      if (!context.locals.user) throw new Error('No autenticado');
      return prisma.post.create({ data: { ...input, authorId: context.locals.user.id } });
    },
  }),
};
```

Ver [Server Actions](/guides/astro-server-actions) para el resto del mecanismo (`input` con Zod integrado, cómo se llaman desde un formulario).

## Resumen

| API | Qué hace |
| --- | --- |
| `create` / `findUnique` / `findMany` / `update` / `delete` | CRUD básico |
| `upsert`, `findFirst`, `createMany`/`updateMany`/`deleteMany` | Casos comunes fuera del CRUD básico |
| `include` / `select` | Relaciones / campos específicos |
| `$transaction([...])` | Operaciones independientes, atómicas |
| `$transaction(async (tx) => {...})` | Operaciones que dependen de un paso anterior, atómicas |

## Consideraciones

- Si el hosting elegido para el deploy es un adapter **serverless/edge** (Vercel Edge, Cloudflare) en vez de un adapter Node tradicional, el patrón de singleton de Prisma necesita ajustes específicos de esa plataforma.
- `npx prisma migrate deploy` (no `migrate dev`) es el comando de producción — se corre como paso de build/deploy.
- Dentro de un callback de `$transaction` interactiva, usar siempre `tx`, nunca `prisma`.
