---
title: Prisma en Next.js
description: Instalación, schema, el singleton con globalThis para el hot-reload, CRUD completo y transacciones en Route Handlers/Server Actions.
category: backend
stack: nextjs
order: 7
tags: [nextjs, prisma, database, orm]
website: https://www.prisma.io
related: [guides/nextjs-backend-arquitectura]
updatedAt: 2026-08-17
---

Prisma es un ORM con schema declarativo: el `schema.prisma` es la única fuente de verdad, y de ahí genera un client con métodos y tipos exactos para cada modelo. Next.js tiene una particularidad frente a Express/Astro: el hot-reload del modo desarrollo (`next dev`) puede recrear módulos sin reiniciar el proceso — un singleton ingenuo puede terminar creando **múltiples** instancias en desarrollo, agotando conexiones a la base. Esta guía cubre eso además de la API completa del client.

## Instalación

```bash
npm install prisma --save-dev
npm install @prisma/client
npx prisma init
```

## Configuración rápida — de cero a un Route Handler funcionando

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
  authorId  String
  createdAt DateTime @default(now())
}
```

**3. Migrar:**

```bash
npx prisma migrate dev --name init
```

**4. El client — singleton con `globalThis`:**

```ts title="lib/prisma.ts"
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
```

`globalThis` sobrevive al hot reload de módulos, a diferencia de una variable normal del módulo. En desarrollo permite reutilizar el mismo cliente en vez de crear uno en cada recarga. Sin este patrón puede aparecer `too many connections` después de varios ciclos. En producción no hay hot reload, pero conservar el patrón no cambia el comportamiento esperado.

**5. Un Route Handler real:**

```ts title="app/api/posts/route.ts"
import { NextResponse } from 'next/server';
import { prisma } from '@/libs/prisma';

export async function GET() {
  const posts = await prisma.post.findMany();
  return NextResponse.json(posts);
}
```

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
const postConAutor = await prisma.post.findUnique({ where: { id }, include: { author: true } });
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

Si una operación del array falla, todas se revierten.

### Forma interactiva (callback), en una Server Action

```ts title="app/actions/posts.ts"
'use server';

import { prisma } from '@/libs/prisma';
import { auth } from '@/libs/auth';
import { revalidatePath } from 'next/cache';

export async function crearPostConLimite(formData: FormData) {
  const session = await auth();
  if (!session?.user) throw new Error('No autenticado');

  await prisma.$transaction(async (tx) => {
    const cantidad = await tx.post.count({ where: { authorId: session.user.id } });

    if (cantidad >= 100) {
      throw new Error('Límite de posts alcanzado'); // revierte toda la transacción
    }

    await tx.post.create({ data: { title: formData.get('title') as string, authorId: session.user.id } });
  });

  revalidatePath('/posts');
}
```

Dentro del callback se usa `tx`, nunca `prisma` directo — usarlo por error ejecutaría esa operación fuera de la transacción, sin las garantías de atomicidad.

## Flujo de Prisma en Next.js

| API | Qué hace |
| --- | --- |
| Singleton con `globalThis` | Evita múltiples instancias del client durante hot-reload |
| `create` / `findUnique` / `findMany` / `update` / `delete` | CRUD básico |
| `upsert`, `findFirst`, `createMany`/`updateMany`/`deleteMany` | Casos comunes fuera del CRUD básico |
| `$transaction([...])` | Operaciones independientes, atómicas |
| `$transaction(async (tx) => {...})` | Operaciones que dependen de un paso anterior, atómicas |

## Hot reload, conexiones y runtime

- Con el **Edge Runtime** (`export const runtime = 'edge'` en un Route Handler), Prisma necesita un driver adapter específico (`@prisma/adapter-*`) — el `PrismaClient` estándar no corre en Edge sin esa configuración adicional.
- `npx prisma migrate deploy` (no `migrate dev`) es el comando de producción.
- Dentro de un callback de `$transaction` interactiva, usar siempre `tx`, nunca `prisma`.
