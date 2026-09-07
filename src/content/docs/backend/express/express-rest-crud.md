---
title: REST y CRUD — convenciones de rutas y verbos
description: Qué verbo HTTP y qué forma de ruta corresponde a cada operación CRUD, códigos de status correctos, y errores típicos de diseño.
type: guides
order: 9
tags: [express, rest, api, crud]
scope: diseño de rutas REST
updatedAt: 2026-08-16
---

REST no es un protocolo con reglas estrictas verificables — es una convención. Seguirla hace que una API sea predecible para cualquiera que la use por primera vez, sin necesitar leer documentación para adivinar cómo crear un recurso.

## Las cinco operaciones, mapeadas a verbo + ruta

```text
GET    /posts          → listar todos
GET    /posts/:id       → obtener uno
POST   /posts           → crear uno nuevo
PUT    /posts/:id       → reemplazar uno completo
PATCH  /posts/:id       → actualizar parcialmente
DELETE /posts/:id       → eliminar uno
```

El **recurso** (`posts`) es siempre un sustantivo en plural, nunca un verbo — `GET /getPosts` o `POST /createPost` no son REST, son RPC con forma de URL. La acción la indica el verbo HTTP, no el nombre de la ruta.

## `PUT` vs `PATCH`: la diferencia real

```ts
// PUT: reemplaza el recurso ENTERO — si falta un campo, se pierde/resetea
app.put("/posts/:id", async (req, res) => {
  const post = await prisma.post.update({
    where: { id: req.params.id },
    data: {
      title: req.body.title,
      content: req.body.content,
      published: req.body.published
    }
  })
  res.json(post)
})

// PATCH: actualiza SOLO los campos que vienen en el body
app.patch("/posts/:id", async (req, res) => {
  const post = await prisma.post.update({
    where: { id: req.params.id },
    data: req.body // solo lo que el cliente mandó
  })
  res.json(post)
})
```

En la práctica, muchas APIs usan `PATCH` para casi todo (es más flexible) y reservan `PUT` para reemplazos completos explícitos — pero la distinción conceptual vale la pena conocerla.

## Recursos anidados

```text
GET  /posts/:postId/comments        → comentarios de un post específico
POST /posts/:postId/comments        → crear un comentario en ese post
```

Anidar más de un nivel (`/posts/:id/comments/:id/likes/:id`) generalmente es señal de que conviene una ruta plana con query params en su lugar (`GET /likes?commentId=...`) — la legibilidad se degrada rápido pasado el segundo nivel.

## Códigos de status correctos por operación

```text
GET exitoso           → 200 OK
POST exitoso (creó)   → 201 Created
PUT/PATCH exitoso     → 200 OK
DELETE exitoso         → 204 No Content (sin body en la respuesta)
Recurso no existe      → 404 Not Found
Body inválido          → 400 Bad Request
No autenticado          → 401 Unauthorized
Autenticado, sin permiso → 403 Forbidden
```

```ts
app.post("/posts", async (req, res) => {
  const post = await prisma.post.create({ data: req.body })
  res.status(201).json(post) // 201, no 200 — se creó algo nuevo
})

app.delete("/posts/:id", async (req, res) => {
  await prisma.post.delete({ where: { id: req.params.id } })
  res.status(204).end() // sin body — no hay nada que devolver sobre "lo borrado"
})
```

## Mapa CRUD

| Verbo    | Uso                       |
| -------- | ------------------------- |
| `GET`    | Leer, nunca modifica nada |
| `POST`   | Crear                     |
| `PUT`    | Reemplazar completo       |
| `PATCH`  | Actualizar parcial        |
| `DELETE` | Eliminar                  |

## Errores comunes

- Usar `GET` para una operación que modifica datos (`GET /posts/:id/delete`) — rompe la expectativa de que `GET` es siempre seguro de repetir/cachear, y algunos proxies/crawlers pueden disparar esas requests sin querer.
- Devolver `200` para todo, incluyendo errores (`200` con `{ error: "..." }` en el body) — el status code es información que el cliente (y herramientas HTTP genéricas) leen antes de mirar el body; usar el código correcto es parte del contrato.
- Rutas con verbos (`/getUsuarios`, `/crearPost`) en vez de sustantivos + verbo HTTP — funciona, pero no es REST, y pierde la predictibilidad que la convención da gratis.
