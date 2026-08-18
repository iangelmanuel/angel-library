---
title: Prisma en Express
description: Instalación, schema, client, CRUD completo, transacciones y el patrón de repository — todo lo necesario para usar Prisma en un backend Express.
category: backend
stack: express
order: 13
tags: [express, prisma, database, orm]
website: https://www.prisma.io
related: [patterns/backend-mvc-structure]
updatedAt: 2026-08-17
---

Prisma es un ORM con schema declarativo: el `schema.prisma` es la única fuente de verdad, y de ahí genera un client con métodos y tipos exactos para cada modelo — no hay que escribir SQL a mano ni mantener tipos sincronizados por separado.

## Instalación

```bash
npm install prisma --save-dev
npm install @prisma/client
npx prisma init
```

`prisma init` crea `prisma/schema.prisma` y un `.env` con `DATABASE_URL` de ejemplo.

## Configuración rápida — de cero a un modelo funcionando

**1. Apuntar `DATABASE_URL` a una base real.** Para desarrollo local rápido sin instalar Postgres a mano, un contenedor de un solo comando alcanza:

```bash
docker run --name postgres-dev -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres
```

```env title=".env"
DATABASE_URL="postgresql://postgres:password@localhost:5432/miapp"
```

**2. Definir el schema:**

```prisma title="prisma/schema.prisma"
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  posts     Post[]
  createdAt DateTime @default(now())
}

model Post {
  id        String   @id @default(cuid())
  title     String
  published Boolean  @default(false)
  author    User     @relation(fields: [authorId], references: [id])
  authorId  String
}
```

Cada `model` es una tabla; `@relation` describe una foreign key; `@id`, `@unique`, `@default` son constraints declarativos.

**3. Migrar** (crea la tabla en la base y genera el client con los tipos correspondientes):

```bash
npx prisma migrate dev --name init
```

**4. El client, como singleton:**

```ts title="lib/prisma.ts"
import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();
```

En una app Express de proceso largo (no serverless), esto alcanza tal cual — el proceso vive mientras el servidor corre, así que una instancia global no se recrea en cada request.

**5. Un endpoint real, para confirmar que anda:**

```ts title="app.ts"
import express from 'express';
import { prisma } from './lib/prisma';

const app = express();
app.use(express.json());

app.get('/posts', async (req, res) => {
  const posts = await prisma.post.findMany();
  res.json(posts);
});

app.post('/posts', async (req, res) => {
  const post = await prisma.post.create({ data: req.body });
  res.status(201).json(post);
});

app.listen(3000);
```

## CRUD básico

```ts
await prisma.user.create({ data: { email: 'a@b.com', name: 'Angel' } });
await prisma.user.findUnique({ where: { id: '...' } });
await prisma.user.findMany({ where: { name: { contains: 'an' } } });
await prisma.user.update({ where: { id: '...' }, data: { name: 'Nuevo nombre' } });
await prisma.user.delete({ where: { id: '...' } });
```

## Métodos que se usan seguido y no son solo CRUD básico

```ts
// findFirst: el primero que matchea, sin buscar por un campo único
await prisma.post.findFirst({ where: { published: true }, orderBy: { createdAt: 'desc' } });

// upsert: actualiza si existe, crea si no — un solo viaje a la base en vez de find + if + create/update
await prisma.user.upsert({
  where: { email: 'a@b.com' },
  update: { name: 'Nombre actualizado' },
  create: { email: 'a@b.com', name: 'Nombre nuevo' },
});

// createMany / updateMany / deleteMany: operan sobre varios registros en una sola query
await prisma.post.createMany({ data: [{ title: 'Uno' }, { title: 'Dos' }] });
await prisma.post.updateMany({ where: { published: false }, data: { published: true } });
await prisma.post.deleteMany({ where: { authorId: '...' } });

// count: contar sin traer los registros
await prisma.post.count({ where: { published: true } });

// aggregate: min/max/avg/sum sobre un campo numérico
await prisma.post.aggregate({ _count: true, _avg: { views: true } });

// groupBy: agrupar y agregar, el equivalente a GROUP BY de SQL
await prisma.post.groupBy({ by: ['authorId'], _count: { id: true } });
```

`createMany`/`updateMany`/`deleteMany` no devuelven los registros afectados, solo `{ count: number }` — si hace falta el resultado completo de cada uno, la alternativa es un `$transaction` con varias operaciones individuales (ver abajo).

## Relaciones: incluir datos relacionados

Por defecto, una consulta **no** trae las relaciones — hay que pedirlas explícitamente con `include`.

```ts
const userConPosts = await prisma.user.findUnique({
  where: { id: '...' },
  include: { posts: true },
});
```

`select` hace lo opuesto: en vez de traer el modelo completo, elegís exactamente qué campos querés.

```ts
const soloEmail = await prisma.user.findMany({ select: { email: true } });
```

## Transacciones con `$transaction`

Cuando varias operaciones tienen que ejecutarse **todas o ninguna** (si una falla, se revierten todas), `$transaction` las agrupa de forma atómica. Prisma ofrece dos formas.

### Forma secuencial (array de promesas)

La más simple — un array de operaciones independientes entre sí, que Prisma ejecuta todas dentro de la misma transacción:

```ts
const [post, contador] = await prisma.$transaction([
  prisma.post.create({ data: { title: 'Nuevo post', authorId: userId } }),
  prisma.user.update({ where: { id: userId }, data: { postsCount: { increment: 1 } } }),
]);
```

Si `prisma.user.update` falla (por ejemplo, el usuario no existe), el `create` del post **también se revierte** — no queda un post huérfano sin su contador actualizado.

### Forma interactiva (callback)

Para cuando una operación depende del **resultado** de la anterior — el array secuencial no sirve porque ahí todas las operaciones se arman de antemano, sin poder usar el resultado de una en la siguiente:

```ts
const resultado = await prisma.$transaction(async (tx) => {
  const cuentaOrigen = await tx.account.findUnique({ where: { id: origenId } });

  if (!cuentaOrigen || cuentaOrigen.balance < monto) {
    throw new Error('Fondos insuficientes'); // esto revierte TODA la transacción
  }

  await tx.account.update({ where: { id: origenId }, data: { balance: { decrement: monto } } });
  await tx.account.update({ where: { id: destinoId }, data: { balance: { increment: monto } } });

  return { ok: true };
});
```

Dentro del callback se usa `tx` (el client transaccional que Prisma pasa como argumento), **no** `prisma` directo — usar `prisma.account.update(...)` por error adentro del callback ejecutaría esa operación **fuera** de la transacción, sin las garantías de atomicidad.

Un `throw` dentro del callback revierte automáticamente todo lo que la transacción llevaba hecho hasta ese punto — es el mecanismo para cancelar por una regla de negocio (como el chequeo de fondos insuficientes arriba), no solo por errores de la base.

## Uso dentro de un repository (patrón de capas)

Siguiendo la [estructura MVC](/patterns/backend-mvc-structure): el repository es la única capa que importa `prisma` directamente.

```ts title="repositories/users.repository.ts"
import { prisma } from '../lib/prisma';

export const usersRepository = {
  findById: (id: string) => prisma.user.findUnique({ where: { id } }),
  findAll: () => prisma.user.findMany(),
  create: (data: { email: string; name?: string }) => prisma.user.create({ data }),
};
```

```ts title="services/users.service.ts"
import { usersRepository } from '../repositories/users.repository';

export const usersService = {
  async obtenerUsuario(id: string) {
    const usuario = await usersRepository.findById(id);
    if (!usuario) throw new AppError(404, 'Usuario no encontrado');
    return usuario;
  },
};
```

El controller nunca importa `prisma` directamente — pasa por service → repository, así que cambiar de ORM en el futuro solo toca la capa de repository.

## Cierre limpio al apagar el servidor

```ts title="server.ts"
process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
});
```

Ver [process y señales](/guides/node-process) para el patrón completo de shutdown limpio.

## Resumen

| API | Qué hace |
| --- | --- |
| `create` / `findUnique` / `findMany` / `update` / `delete` | CRUD básico |
| `findFirst` | Primer match, sin depender de un campo único |
| `upsert` | Update si existe, create si no, en un solo viaje |
| `createMany` / `updateMany` / `deleteMany` | Operan sobre varios registros, devuelven solo `{ count }` |
| `count` / `aggregate` / `groupBy` | Conteos y agregaciones sin traer los registros completos |
| `include` / `select` | Traer relaciones / elegir campos específicos |
| `$transaction([...])` | Varias operaciones independientes, atómicas, secuenciales |
| `$transaction(async (tx) => {...})` | Operaciones que dependen del resultado de la anterior, atómicas |

## Consideraciones

- El client se genera a partir del schema (`prisma generate`) — si editás el schema y no regenerás, TypeScript sigue viendo los tipos viejos. `migrate dev` lo hace automático; en CI/producción hace falta correrlo a mano después de instalar dependencias.
- `npx prisma migrate dev` **no** es el comando de producción — en un deploy real se usa `npx prisma migrate deploy`, que aplica migraciones existentes sin generar nuevas interactivamente.
- Una sola instancia de `PrismaClient` por proceso — crear una nueva en cada request agota las conexiones a la base.
- Dentro de un callback de `$transaction` interactiva, usar siempre `tx`, nunca `prisma` — es el error más común al escribir una transacción de este tipo.
- `DATABASE_URL` es un secreto — nunca commitear `.env`, ver [Variables de entorno en Node](/guides/node-env-vars).
