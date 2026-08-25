---
title: Routing, Request y Response
description: Definir rutas y routers, leer params/query/body/headers y terminar respuestas sin mezclar transporte con negocio.
category: backend
stack: express
order: 2
tags: [express, routing, request, response]
scope: Express Router y HTTP
related:
  - guides/express-primeros-pasos
  - guides/express-middlewares
  - guides/backend-api-design
updatedAt: 2026-08-25
---

Una ruta de Express combina un método HTTP, un path y uno o más handlers. El router decide **qué código** atiende la solicitud; no debería decidir por sí solo todas las reglas del negocio.

## Firmas esenciales

```ts
app.get('/users', listUsers);
app.post('/users', validateCreateUser, createUser);
app.patch('/users/:id', updateUser);
app.delete('/users/:id', deleteUser);
```

`app.all()` coincide con todos los métodos y `app.use()` monta middleware o un router. Declara rutas específicas antes de handlers generales como el `404`.

## De dónde llega cada dato

```ts
app.post('/teams/:teamId/users', (req, res) => {
  const teamId = req.params.teamId;       // path: /teams/abc/users
  const active = req.query.active;        // query: ?active=true
  const input = req.body;                 // body parseado por middleware
  const token = req.get('authorization'); // header

  res.status(201).json({ teamId, active, input, hasToken: Boolean(token) });
});
```

Todo dato de `params`, `query`, `body`, headers o cookies es entrada externa. TypeScript describe lo que esperas, pero no valida lo que llegó por red.

| Fuente | Uso típico | Ejemplo |
| --- | --- | --- |
| `req.params` | identidad de un recurso en la ruta | `/users/:id` |
| `req.query` | filtros, orden y paginación | `?page=2` |
| `req.body` | comando o representación enviada | `{ "name": "Ana" }` |
| `req.get()` | metadata y negociación HTTP | `Accept-Language` |
| `req.user` | identidad añadida por auth | nunca debe venir del body |

## Responder una sola vez

```ts
if (!user) {
  return res.status(404).json({
    error: { code: 'USER_NOT_FOUND', message: 'Usuario no encontrado' },
  });
}

return res.status(200).json({ data: user });
```

`res.status()` configura y devuelve el mismo objeto para encadenar. `res.json()` serializa y termina la respuesta. `res.sendStatus(204)` no es equivalente a `res.status(204).end()`: para `204 No Content`, expresa claramente que no existe body.

## Router modular

```ts title="src/modules/users/users.router.ts"
import { Router } from 'express';

export const usersRouter = Router();

usersRouter.get('/', listUsers);
usersRouter.get('/:id', getUser);
usersRouter.post('/', validateCreateUser, createUser);
```

```ts title="src/app.ts"
app.use('/api/users', usersRouter);
```

El Router funciona como una miniaplicación montable. Dentro de él, `/` representa `/api/users`. Agrupar por capacidad de negocio mantiene cerca ruta, schema, caso de uso y pruebas sin crear una carpeta global gigante para cada tipo de archivo.

## Parámetros encadenados

Para routers hijos que necesitan parámetros del padre usa `Router({ mergeParams: true })`:

```ts
const commentsRouter = Router({ mergeParams: true });
app.use('/posts/:postId/comments', commentsRouter);
```

Sin `mergeParams`, `commentsRouter` no recibe `postId` en `req.params`.

## 404 y métodos no permitidos

Después de montar rutas, agrega un handler que responda `404`. No es un middleware de error: simplemente ninguna ruta coincidió.

```ts
app.use((_req, res) => {
  res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Ruta no encontrada' } });
});
```

Una API más estricta puede distinguir path inexistente (`404`) de path conocido con método no permitido (`405`) y enviar `Allow`, pero Express no lo produce automáticamente.

## Caso de uso y frontera HTTP

El handler traduce HTTP a una llamada de aplicación: extrae y valida datos, obtiene identidad, invoca un caso de uso y traduce el resultado a status y body. No pases el objeto `req` al repository; eso acopla persistencia a Express e impide reutilizar la lógica desde un job o test.

