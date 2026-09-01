---
title: Paginación, filtrado y búsqueda
description: Paginación offset-based vs cursor-based, filtros por query params, y búsqueda de texto — con ejemplos usando Prisma.
type: guides
order: 10
tags: [express, api, pagination, filtering]
technologies: [backend/express/express-prisma]
updatedAt: 2026-08-16
---

Devolver una tabla completa en un solo `GET /posts` funciona con 20 filas y se vuelve un problema real con 20 mil — paginación, filtros y búsqueda son lo que convierte un endpoint de listado en algo que escala.

## Paginación offset-based (la más simple)

```ts
app.get("/posts", async (req, res) => {
  const page = Number(req.query.page ?? 1)
  const limit = Number(req.query.limit ?? 20)

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      skip: (page - 1) * limit,
      take: limit
    }),
    prisma.post.count()
  ])

  res.json({
    data: posts,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
  })
})
```

Simple de implementar y de consumir (`?page=2&limit=20`), pero tiene un problema real con tablas grandes: `skip` en una base de datos generalmente sigue leyendo (y descartando) todas las filas anteriores — página 10.000 es notablemente más lenta que página 1.

## Paginación cursor-based (escala mejor)

En vez de "saltate N filas", el cliente manda el id del último elemento visto, y el servidor pide "todo lo que viene después de ese id":

```ts
app.get("/posts", async (req, res) => {
  const limit = Number(req.query.limit ?? 20)
  const cursor = req.query.cursor as string | undefined

  const posts = await prisma.post.findMany({
    take: limit,
    ...(cursor && { cursor: { id: cursor }, skip: 1 }), // skip: 1 para no repetir el cursor mismo
    orderBy: { id: "asc" }
  })

  const siguienteCursor =
    posts.length === limit ? posts[posts.length - 1].id : null

  res.json({ data: posts, nextCursor: siguienteCursor })
})
```

No permite "saltar a la página 50" directamente (no hay concepto de página, solo "seguir desde aquí") — a cambio, el rendimiento es constante sin importar cuán profundo se pagine. Es el patrón típico de feeds infinitos (scroll infinito), donde no hace falta números de página.

## Filtrado por query params

```ts
app.get("/posts", async (req, res) => {
  const { published, authorId } = req.query

  const posts = await prisma.post.findMany({
    where: {
      ...(published !== undefined && { published: published === "true" }),
      ...(authorId && { authorId: authorId as string })
    }
  })

  res.json(posts)
})
```

Cada filtro es opcional — el spread condicional (`...(condicion && {...})`) agrega la clave al `where` solo si el query param vino, en vez de armar el objeto con `if`s por fuera.

## Búsqueda de texto

```ts
app.get("/posts", async (req, res) => {
  const { q } = req.query // término de búsqueda

  const posts = await prisma.post.findMany({
    where: q
      ? {
          OR: [
            { title: { contains: q as string, mode: "insensitive" } },
            { content: { contains: q as string, mode: "insensitive" } }
          ]
        }
      : undefined
  })

  res.json(posts)
})
```

`mode: 'insensitive'` evita que la búsqueda dependa de mayúsculas/minúsculas exactas. Para búsqueda de texto más seria (relevancia, typos, múltiples idiomas), Postgres tiene full-text search nativo, o herramientas dedicadas (Algolia, Meilisearch, Elasticsearch) — `contains` alcanza para búsqueda simple, no para un buscador serio.

## Combinar todo

```ts
app.get("/posts", async (req, res) => {
  const page = Number(req.query.page ?? 1)
  const limit = Number(req.query.limit ?? 20)
  const { published, q } = req.query

  const where = {
    ...(published !== undefined && { published: published === "true" }),
    ...(q && { title: { contains: q as string, mode: "insensitive" as const } })
  }

  const [posts, total] = await Promise.all([
    prisma.post.findMany({ where, skip: (page - 1) * limit, take: limit }),
    prisma.post.count({ where })
  ])

  res.json({ data: posts, pagination: { page, limit, total } })
})
```

`where` se calcula una vez y se reusa tanto en `findMany` como en `count` — sin esto, el total contaría todos los registros en vez de solo los que matchean los filtros.

## Comparación de paginación

| Patrón                         | Cuándo usarlo                                                       |
| ------------------------------ | ------------------------------------------------------------------- |
| Offset (`page`/`limit`)        | La mayoría de los casos — simple, permite saltar a cualquier página |
| Cursor (`cursor`/`nextCursor`) | Tablas grandes, feeds infinitos, performance constante              |
| Filtros vía query params       | Cada filtro opcional, se combina con `where` condicional            |
| Búsqueda con `contains`        | Búsqueda simple; para algo serio, un motor de búsqueda dedicado     |

## Límites, índices y orden estable

- `req.query.page` siempre llega como string (o array de strings) — `Number(...)` sin validar puede dar `NaN` con un input raro; en producción vale la pena validar con Zod (`z.coerce.number().min(1)`) en vez de confiar directo.
- Un `limit` sin tope máximo (`?limit=999999`) permite que un cliente pida la tabla entera directamente — poner un máximo razonable (`Math.min(limit, 100)`) evita ese abuso.
