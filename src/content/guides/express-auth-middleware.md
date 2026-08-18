---
title: Middleware de autenticación y autorización
description: Proteger rutas verificando el token, poblar req.user, y un middleware de roles reutilizable para autorización.
category: backend
stack: express
order: 9
tags: [express, auth, middleware, authorization]
scope: middleware de auth
related: [guides/express-middlewares, guides/express-jwt]
updatedAt: 2026-08-16
---

**Autenticación** (¿quién sos?) y **autorización** (¿qué podés hacer?) son dos pasos distintos — el primero identifica al usuario, el segundo decide si ese usuario específico puede hacer la acción que está pidiendo. En Express, ambos se implementan como [middlewares](/guides/express-middlewares) en la cadena, antes del handler de la ruta.

## Middleware de autenticación: poblar `req.user`

```ts title="middlewares/requireAuth.ts"
import type { Request, Response, NextFunction } from 'express';
import { verificarToken } from '../lib/jwt';

// Extender el tipo de Request para que TypeScript conozca req.user
declare global {
  namespace Express {
    interface Request {
      user?: { id: string; rol: string };
    }
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.token ?? req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'No autenticado' });
  }

  try {
    const payload = verificarToken(token);
    req.user = { id: payload.sub, rol: payload.rol };
    next();
  } catch {
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
}
```

```ts
app.get('/perfil', requireAuth, (req, res) => {
  res.json({ userId: req.user!.id }); // req.user existe porque requireAuth ya corrió
});
```

Aceptar el token tanto de una cookie (`req.cookies.token`) como de un header `Authorization: Bearer <token>` cubre los dos casos típicos: cliente web (cookie) y cliente API/mobile (header) — ver [Cookies vs sesiones](/guides/express-cookies-sesiones) para cuál conviene según el caso.

## Middleware de autorización: chequeo de rol

Una vez que `req.user` existe (gracias a `requireAuth`), un segundo middleware puede decidir si ese rol específico tiene permiso:

```ts title="middlewares/requireRole.ts"
import type { Request, Response, NextFunction } from 'express';

export function requireRole(...rolesPermitidos: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !rolesPermitidos.includes(req.user.rol)) {
      return res.status(403).json({ error: 'No tenés permiso para esto' });
    }
    next();
  };
}
```

```ts
app.delete(
  '/usuarios/:id',
  requireAuth,                    // primero: ¿quién sos?
  requireRole('admin'),           // segundo: ¿podés hacer esto?
  handlerDeEliminarUsuario,
);
```

`requireRole` es una **fábrica** de middleware (una función que devuelve un middleware) — permite parametrizar qué roles se aceptan por ruta, en vez de un middleware fijo para cada combinación posible.

## 401 vs 403: la diferencia importa

```text
401 Unauthorized  →  "no sé quién sos" (falta o es inválido el token)
403 Forbidden      →  "sé quién sos, pero no podés hacer esto" (rol insuficiente)
```

Confundirlos no rompe nada técnicamente, pero da información engañosa al cliente sobre qué está fallando — `requireAuth` siempre debería devolver `401`, `requireRole` siempre `403`.

## Resumen

| Middleware | Responde |
| --- | --- |
| `requireAuth` | ¿Hay un token válido? Puebla `req.user` |
| `requireRole(...roles)` | ¿El `req.user` actual tiene uno de estos roles? |
| Orden en la ruta | Siempre `requireAuth` antes que `requireRole` — no se puede chequear rol sin saber antes quién es |

## Consideraciones

- `requireRole` depende de que `req.user` ya exista — usarlo sin `requireAuth` antes en la misma cadena es un bug (siempre entra al `if (!req.user ...)` y responde 403 a todo el mundo).
- Este patrón (rol único por usuario, `req.user.rol === 'admin'`) alcanza para la mayoría de los casos; sistemas con permisos más finos (varios roles por usuario, permisos por recurso específico) necesitan un modelo más elaborado — ver [Roles y permisos](/guides/express-roles-permisos).
