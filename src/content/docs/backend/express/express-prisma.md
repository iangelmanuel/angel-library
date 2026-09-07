---
title: Prisma en Express
description: Conectar Prisma 7 a Express 5, servir consultas acotadas y separar persistencia, permisos y errores.
type: guides
order: 18
tags: [express, prisma, database, orm]
website: https://www.prisma.io
related: [database/database-prisma/prisma-configuracion, backend/express/backend-mvc-structure, backend/express/express-api-protegida]
updatedAt: 2026-09-07
---

Prisma resuelve el acceso a los datos; Express recibe la petición y construye la respuesta HTTP. El ORM no valida automáticamente los datos del navegador ni decide qué registros puede modificar cada usuario.

## Requisitos

Completa [Prisma 7 con PostgreSQL](/database/database-prisma/prisma-configuracion): esquema `User`/`Post`, migraciones, cliente compartido y prueba con `tsx`. Esta integración usa **Express 5** en Node y un proyecto TypeScript ESM.

```bash
pnpm add express@5
pnpm add -D @types/express@5
```

## Implementación: servidor de lectura

```ts title="src/server.ts"
import express, { type ErrorRequestHandler } from "express"
import { prisma } from "./lib/prisma"

const app = express()

app.get("/posts", async (_req, res) => {
  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    take: 20,
    select: { id: true, title: true }
  })
  res.json(posts)
})

const onError: ErrorRequestHandler = (error, _req, res, next) => {
  if (res.headersSent) return next(error)
  console.error(error)
  res.status(500).json({ error: "No se pudo completar la petición" })
}
app.use(onError)

const server = app.listen(3000, "127.0.0.1", () => {
  console.log("http://127.0.0.1:3000/posts")
})

let closing = false
function shutdown() {
  if (closing) return
  closing = true
  const deadline = setTimeout(() => process.exit(1), 10000)
  deadline.unref()

  // Deja terminar las peticiones antes de cerrar la base.
  server.close(async error => {
    try {
      await prisma.$disconnect()
      process.exitCode = error ? 1 : 0
    } catch {
      process.exitCode = 1
    } finally {
      clearTimeout(deadline)
    }
  })
}
process.on("SIGINT", shutdown)
process.on("SIGTERM", shutdown)
```

```bash
pnpm exec tsx src/server.ts
```

Express 5 pasa automáticamente al middleware los rechazos de handlers que devuelven promesas. En Express 4 ese comportamiento requiere un wrapper o `next(error)` explícito.

El listado devuelve solo campos públicos y hasta 20 filas. La escucha local sirve para practicar; la configuración de despliegue debe definir host, proxy, límites y observabilidad.

## Escrituras: validación y autorización

Antes de añadir POST/PATCH, conecta la [API protegida](/backend/express/express-api-protegida). El flujo debe ser:

1. Limitar y parsear el cuerpo.
2. Verificar sesión e identidad.
3. Validar los campos editables, como `title`.
4. Comprobar los permisos sobre el recurso.
5. Llamar al servicio con datos explícitos: `crearPostConLimite(usuario.id, tituloValidado)`.
6. Devolver una respuesta que seleccione los campos públicos.

El servicio `src/lib/posts.ts` de la guía compartida aplica el límite de posts con aislamiento serializable. El ID de usuario y el título que recibe no sustituyen las comprobaciones HTTP anteriores. No uses `prisma.post.create({ data: req.body })`: permitiría al cliente elegir campos que deberían controlar el servidor y la sesión.

## Separación mediante repository

Esta capa resulta útil cuando varias rutas comparten consultas. Es opcional para una aplicación pequeña:

```ts title="src/repositories/users.repository.ts"
import { prisma } from "../lib/prisma"

export const usersRepository = {
  findPublicById: (id: string) => prisma.user.findUnique({
    where: { id },
    select: { id: true, name: true }
  }),
  create: (data: { email: string; name?: string }) => prisma.user.create({
    data,
    select: { id: true, name: true }
  })
}
```

Un service decide qué hacer cuando `findPublicById` devuelve `null`; el controller traduce ese resultado a 404. Una violación de unicidad (`P2002`) puede convertirse en un conflicto de negocio. No expongas el error completo de Prisma a quien hace la petición.

Separar capas reduce acoplamiento, pero cambiar de ORM puede afectar consultas, transacciones y modelos. Un repository no garantiza por sí solo una migración trivial.

## Comprobación

1. Abre `http://127.0.0.1:3000/posts`: sin publicaciones devuelve `[]`.
2. Publica un registro de desarrollo y repite: aparece con `id` y `title`, sin datos del autor.
3. Detén PostgreSQL: la petición devuelve 500; el proceso debe seguir atendiendo peticiones y el detalle queda en el log local.
4. Pulsa Ctrl+C: el servidor deja de aceptar peticiones y luego cierra el cliente. Una operación colgada tiene un plazo de diez segundos.
5. Al integrar escrituras, prueba petición anónima, título inválido e intento de cambiar `authorId` desde el cuerpo: no deben crear un post con otra identidad.

## Límites y recursos

Reutiliza el cliente por proceso; no conectes y desconectes en cada handler. En producción, configura logs para evitar secretos y datos personales, dimensiona conexiones y añade paginación.

La [guía compartida](/database/database-prisma/prisma-configuracion) concentra CRUD, relaciones, transacciones y migraciones. Para el servidor: [manejo de errores de Express](https://expressjs.com/en/guide/error-handling.html) y [cierre mediante señales](/backend/node/node-process).
