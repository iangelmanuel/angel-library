---
title: Estructura MVC para APIs Express
description: Organización por capas (routes, controllers, services, repositories) para backends Express que no se vuelvan spaghetti.
type: patterns
order: 1
tags: [node, express, architecture, mvc]
problem: Los routers de Express crecen hasta mezclar HTTP, lógica de negocio y acceso a datos en el mismo archivo.
updatedAt: 2026-08-16
---

## Estructura

```text
src/
├── app.ts                 # express(): middlewares globales + montaje de rutas
├── server.ts              # listen, conexión DB, shutdown limpio
├── config/                # env, constantes
├── routes/                # solo definición de endpoints → controllers
│   └── users.routes.ts
├── controllers/           # req/res: parsean entrada, llaman services, responden
│   └── users.controller.ts
├── services/              # lógica de negocio, orquestación
│   └── users.service.ts
├── repositories/          # acceso a datos (Prisma, SQL, etc.)
│   └── users.repository.ts
├── middlewares/           # auth, validación, errores, logging
├── utils/                 # helpers puros
└── types/                 # tipos y DTOs compartidos
```

## Flujo de una request

```text
Request
  → route (método + path, aplica middlewares)
  → middleware (auth, validación)
  → controller (adapta HTTP → service, nunca toca la DB)
  → service (reglas de negocio)
  → repository (consultas)
  → controller (formatea respuesta + status)
```

## Reglas

- El controller es la única capa que conoce `req`/`res`.
- La DB solo se toca en repositories → cambiar de ORM no rompe services.
- Los errores se lanzan en services y los formatea un middleware de error central; no try/catch por todas partes.

## Error handler central

```ts title="middlewares/error-handler.ts"
import type { ErrorRequestHandler } from 'express';

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  const status = err.status ?? 500;
  res.status(status).json({
    error: status === 500 ? 'Error interno' : err.message,
  });
};
```

Se registra **al final**, después de todas las rutas: `app.use(errorHandler)`.
