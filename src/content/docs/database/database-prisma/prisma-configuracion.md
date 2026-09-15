---
title: Prisma 7 con PostgreSQL
description: Configuración compartida, esquema coherente, CRUD y transacciones para integrar Prisma en servidores JavaScript.
tags: [prisma, postgresql, database, typescript]
sidebar:
  order: 1
draft: false
resourceCategory: Documentación oficial
website: https://www.prisma.io/docs
technologies:
  - backend/astro/astro-prisma
  - backend/express/express-prisma
  - backend/nextjs/nextjs-prisma
updatedAt: 2026-09-07
---

Prisma genera un cliente tipado a partir de un esquema de datos. Sirve para consultar una base relacional desde TypeScript y versionar cambios con migraciones. Los tipos ayudan a construir consultas, pero la entrada HTTP necesita validación y los permisos siguen siendo responsabilidad de tu aplicación.

## Requisitos y alcance

Esta base usa **Prisma 7, PostgreSQL 16, Node.js 22.12 o superior y TypeScript** en un proyecto ESM (`"type": "module"`). Los comandos usan pnpm 11. El código de aplicación se ejecuta con `tsx` o con el compilador de Astro/Next.js.

Usa una base de desarrollo vacía. Los modelos `User` y `Post` son del laboratorio; si integras una librería de autenticación, combina sus modelos y migraciones con los tuyos antes de ejecutar cambios. No sustituyas el esquema existente de una aplicación.

## 1. Instalar y conectar

Desde la raíz de tu proyecto:

```bash
pnpm add @prisma/client@7 @prisma/adapter-pg@7 pg dotenv
pnpm add -D prisma@7 typescript tsx @types/node @types/pg
```

Mantén `prisma`, `@prisma/client` y `@prisma/adapter-pg` en versiones compatibles y conserva el lockfile. Si necesitas PostgreSQL local, este comando crea una base `miapp` y conserva los datos en un volumen nombrado:

```bash
docker run --name prisma-docs-db -e POSTGRES_PASSWORD=local-demo -e POSTGRES_DB=miapp -p 127.0.0.1:5432:5432 -v prisma-docs-data:/var/lib/postgresql/data -d postgres:16
```

La contraseña es solo para este laboratorio local. Si el puerto o el nombre están ocupados, adapta ambos extremos de la conexión; no borres un contenedor existente para hacer sitio.

```dotenv title=".env"
DATABASE_URL="postgresql://postgres:local-demo@127.0.0.1:5432/miapp"
```

Añade `.env` a `.gitignore`. En despliegue, suministra la variable mediante el proveedor; no uses un prefijo que la exponga al navegador.

## 2. Configuración y esquema

Crea estos archivos. Prisma 7 configura la URL de la CLI en `prisma.config.ts`; el cliente en ejecución recibe su propio adapter.

```ts title="prisma.config.ts"
import "dotenv/config"
import { defineConfig, env } from "prisma/config"

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: { path: "prisma/migrations" },
  datasource: { url: env("DATABASE_URL") }
})
```

```prisma title="prisma/schema.prisma"
generator client {
  provider = "prisma-client"
  output   = "../src/generated/prisma"
}

datasource db {
  provider = "postgresql"
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
  content   String?
  published Boolean  @default(false)
  views     Int      @default(0)
  authorId  String
  author    User     @relation(fields: [authorId], references: [id])
  createdAt DateTime @default(now())

  @@index([authorId, createdAt])
}
```

`@unique` impide emails repetidos y `@relation` exige un autor existente. El índice facilita consultas por autor y fecha. Todos los campos usados a continuación aparecen en este esquema.

```bash
pnpm exec prisma validate
pnpm exec prisma migrate dev --name init
pnpm exec prisma generate
```

En Prisma 7, ejecuta `generate` explícitamente después de cambiar el esquema. `migrate dev` crea y aplica migraciones de desarrollo; en producción se aplican las migraciones versionadas con `pnpm exec prisma migrate deploy`. La generación del cliente es un paso del build, no una migración.

## 3. Crear un cliente compartido

```ts title="src/lib/prisma.ts"
import "dotenv/config"
import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from "../generated/prisma/client"

const connectionString = process.env.DATABASE_URL
if (!connectionString) throw new Error("Falta DATABASE_URL")

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }

function createClient() {
  const adapter = new PrismaPg({
    connectionString,
    max: 5,
    connectionTimeoutMillis: 5000
  })
  return new PrismaClient({ adapter })
}

export const prisma = globalForPrisma.prisma ?? createClient()

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma
```

Importa este módulo solo desde el servidor. La caché de desarrollo evita crear clientes con cada recarga de módulos; en producción, el módulo comparte su instancia dentro del proceso. Cada proceso o instancia serverless conserva su propio pool: cinco conexiones por instancia no son cinco conexiones para todo el despliegue.

Los imports relativos mostrados funcionan con `tsx` y los bundlers de los frameworks. Si compilas con `tsc` para ejecutar JavaScript ESM directamente en Node, configura las extensiones y la resolución de módulos de tu proyecto de forma coherente.

## 4. Comprobar lectura y escritura

Este script inserta un post de demostración cada vez que lo ejecutas:

```ts title="src/prisma-demo.ts"
import { prisma } from "./lib/prisma"

try {
  const author = await prisma.user.upsert({
    where: { email: "demo@example.test" },
    update: {},
    create: { email: "demo@example.test", name: "Demo" }
  })

  const post = await prisma.post.create({
    data: { title: "Mi primer post", authorId: author.id }
  })

  console.log(await prisma.post.findUnique({
    where: { id: post.id },
    select: { title: true, author: { select: { name: true } } }
  }))
} finally {
  await prisma.$disconnect()
}
```

```bash
pnpm exec tsx src/prisma-demo.ts
```

Resultado esperado: un objeto con `title: "Mi primer post"` y `author.name: "Demo"`. Una URL incorrecta debe producir un error de conexión; un autor inexistente debe fallar por la relación. `$disconnect` corresponde al final de este script; no lo ejecutes al final de cada petición de un servidor.

## Referencia de consultas

Estos fragmentos asumen `prisma` importado y un `authorId`/`postId` existente. Sustituye esos valores; no son variables globales proporcionadas por Prisma.

```ts
const posts = await prisma.post.findMany({
  where: { authorId, published: true },
  orderBy: [{ createdAt: "desc" }, { id: "desc" }],
  take: 20,
  select: { id: true, title: true, author: { select: { name: true } } }
})

await prisma.post.update({
  where: { id: postId },
  data: { views: { increment: 1 } }
})

await prisma.post.createMany({
  data: [
    { title: "Uno", authorId },
    { title: "Dos", authorId }
  ]
})

const total = await prisma.post.count({ where: { authorId } })
const porAutor = await prisma.post.groupBy({
  by: ["authorId"], _count: { id: true }
})
```

| Operación | Contrato útil para recordar |
| --- | --- |
| `findUnique` / `findFirst` | Devuelven un registro o `null`; la primera exige una condición única |
| `findMany` | Devuelve un array, vacío si no encuentra coincidencias |
| `create` / `update` / `delete` | Devuelven el registro; update/delete de un registro inexistente pueden lanzar `P2025` |
| `upsert` | Crea o actualiza; la delegación a una única sentencia SQL depende de la consulta y del motor |
| `createMany` / `updateMany` / `deleteMany` | Devuelven un contador; no devuelven los registros |
| `select` / `include` | Eligen campos o relaciones; selecciona solo lo que necesita tu respuesta |
| `count` / `aggregate` / `groupBy` | Resumen datos sin traer cada fila |

Nunca pases `req.body` o todo un formulario directamente a `data`. Valida los campos editables y obtiene `authorId` de la sesión verificada.

## Transacciones y concurrencia

Una transacción garantiza que sus escrituras se confirmen juntas o se reviertan juntas. No convierte automáticamente «contar y después insertar» en una regla segura frente a peticiones simultáneas.

Para dos escrituras sin dependencia de resultados puedes usar `prisma.$transaction([consulta1, consulta2])`. Una escritura anidada (`user.create` con `posts.create`) también puede crear registros relacionados de forma atómica.

Este servicio conserva un límite de 100 posts por autor usando aislamiento serializable y reintentos acotados de conflictos:

```ts title="src/lib/posts.ts"
import { Prisma } from "../generated/prisma/client"
import { prisma } from "./prisma"

export async function crearPostConLimite(authorId: string, title: string) {
  const normalized = title.trim()
  if (!normalized || normalized.length > 200) {
    throw new Error("El título debe tener entre 1 y 200 caracteres")
  }

  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      return await prisma.$transaction(async tx => {
        const count = await tx.post.count({ where: { authorId } })
        if (count >= 100) throw new Error("Límite de posts alcanzado")
        return tx.post.create({ data: { authorId, title: normalized } })
      }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable })
    } catch (error) {
      const conflict = error instanceof Prisma.PrismaClientKnownRequestError
        && error.code === "P2034"
      if (!conflict || attempt === 2) throw error
      await new Promise(resolve => setTimeout(resolve, 25 * (attempt + 1)))
    }
  }
  throw new Error("No se pudo completar la operación")
}
```

Todas las rutas que crean posts sujetos al límite deben usar el mismo servicio. Dentro de la transacción usa `tx`; deja llamadas HTTP y notificaciones fuera. El reintento cubre conflictos de la base, no peticiones duplicadas del usuario: para eso se necesita una clave de idempotencia.

**Comprobación de concurrencia:** prepara un autor con 99 posts, lanza dos llamadas simultáneas al servicio y comprueba que queda con 100. Una llamada puede fallar por límite o por conflicto agotado; nunca debería terminar con 101.

## Errores frecuentes y límites

- **Cliente sin generar:** ejecuta `prisma generate` antes del chequeo de tipos o build.
- **`DATABASE_URL` ausente:** la CLI carga `.env` con `dotenv/config`; el runtime también necesita la variable.
- **`P2002`:** una restricción única se violó. Traduce el caso esperado a un error de negocio sin mostrar detalles de la base.
- **Demasiadas conexiones:** reutiliza el cliente y dimensiona el pool considerando todas las instancias.
- **Migración fallida:** revisa el estado y la causa; no uses un reset como solución automática sobre datos que necesitas conservar.
- **Edge:** `pg` utiliza conexiones de Node. Elige una integración compatible con tu plataforma antes de reutilizar esta configuración.

## Continuar y recursos

Con esta base funcionando, sigue [Astro](/backend/astro/astro-prisma), [Express](/backend/express/express-prisma) o [Next.js](/backend/nextjs/nextjs-prisma).

- [Cambios de Prisma 7](https://www.prisma.io/docs/guides/upgrade-prisma-orm/v7)
- [Cliente generado y configuración de Prisma 7](https://www.prisma.io/docs/orm/v7/prisma-client/setup-and-configuration/introduction)
- [Transacciones, aislamiento y conflictos](https://docs.prisma.io/docs/orm/v7/prisma-client/queries/transactions)
