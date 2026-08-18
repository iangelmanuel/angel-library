---
title: Prisma + Express
description: Desde npx prisma init hasta un endpoint funcionando — el camino completo, sin saltarse pasos.
category: backend
stack: express
order: 28
tags: [express, prisma, database]
problem: La secuencia exacta de comandos y archivos para pasar de "Express vacío" a "un endpoint leyendo de Postgres vía Prisma".
technologies: [guides/express-prisma]
updatedAt: 2026-08-16
---

## Paso 1: instalar y arrancar Prisma

```bash
npm install express
npm install prisma --save-dev
npm install @prisma/client
npx prisma init
```

Esto crea `prisma/schema.prisma` y un `.env` con `DATABASE_URL` de ejemplo.

## Paso 2: definir el modelo

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
  createdAt DateTime @default(now())
}
```

## Paso 3: apuntar `DATABASE_URL` a una base real

```env title=".env"
DATABASE_URL="postgresql://usuario:password@localhost:5432/miapp"
```

Para desarrollo local rápido sin instalar Postgres a mano, un contenedor Docker de un solo comando alcanza:

```bash
docker run --name postgres-dev -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres
```

## Paso 4: migrar

```bash
npx prisma migrate dev --name init
```

Esto crea la tabla `Post` en la base y genera el client con los tipos correspondientes.

## Paso 5: el client como singleton

```ts title="lib/prisma.ts"
import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();
```

## Paso 6: un endpoint real

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

app.listen(3000, () => console.log('http://localhost:3000'));
```

## Paso 7: probar

```bash
curl -X POST http://localhost:3000/posts \
  -H "Content-Type: application/json" \
  -d '{"title": "Mi primer post"}'

curl http://localhost:3000/posts
```

## Siguiente paso natural

Esta versión no valida el body ni maneja errores — el siguiente paso natural es aplicar el patrón completo de [CRUD completo](/recipes/express-crud-completo) (validación con Zod, status codes correctos, error handler) sobre esta misma base.

## Consideraciones

- `npx prisma migrate dev` **no** es el comando de producción — en un deploy real se usa `npx prisma migrate deploy`, que aplica migraciones existentes sin generar nuevas interactivamente (ver [Prisma en Express](/guides/express-prisma)).
- El contenedor Docker de este ejemplo es solo para desarrollo local — nunca usar esa contraseña (`password`) hardcodeada fuera de un entorno de prueba descartable.
