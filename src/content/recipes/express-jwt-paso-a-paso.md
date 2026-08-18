---
title: JWT + Express paso a paso
description: Desde cero — instalar, firmar el primer token, verificarlo en un middleware, y probarlo con curl.
category: backend
stack: express
order: 25
tags: [express, jwt]
problem: La versión más chica posible de JWT funcionando en Express, para entender el mecanismo antes de sumar bcrypt/cookies/roles.
technologies: [guides/express-jwt]
updatedAt: 2026-08-16
---

## Paso 1: instalar

```bash
npm install express jsonwebtoken
npm install --save-dev @types/jsonwebtoken
```

## Paso 2: un endpoint que firma un token (sin verificar password todavía, a propósito)

```ts title="server.ts"
import express from 'express';
import jwt from 'jsonwebtoken';

const app = express();
app.use(express.json());

const SECRET = 'solo-para-este-ejemplo-usar-env-var-en-real';

app.post('/token', (req, res) => {
  const { userId } = req.body;
  const token = jwt.sign({ sub: userId }, SECRET, { expiresIn: '1h' });
  res.json({ token });
});
```

## Paso 3: probar que emite un token

```bash
curl -X POST http://localhost:3000/token \
  -H "Content-Type: application/json" \
  -d '{"userId": "123"}'
```

```json
{ "token": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjMi..." }
```

## Paso 4: un middleware que verifica el token

```ts title="server.ts"
function requireAuth(req: express.Request, res: express.Response, next: express.NextFunction) {
  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'Falta el token' });
  }

  try {
    const payload = jwt.verify(token, SECRET) as { sub: string };
    (req as any).userId = payload.sub;
    next();
  } catch {
    res.status(401).json({ error: 'Token inválido o expirado' });
  }
}

app.get('/protegida', requireAuth, (req, res) => {
  res.json({ mensaje: `Hola, usuario ${(req as any).userId}` });
});
```

## Paso 5: probar la ruta protegida

```bash
# Sin token: 401
curl http://localhost:3000/protegida

# Con token: 200
curl http://localhost:3000/protegida \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiJ9..."
```

## Siguiente paso natural

Esta versión firma un token para cualquier `userId` que le pasen, sin verificar contraseña — es intencional, para aislar el mecanismo de JWT antes de sumar autenticación real. El paso siguiente es [Auth completa](/recipes/express-auth-completa), que agrega registro, login con bcrypt, y cookies en vez de headers manuales.

## Consideraciones

- `SECRET` hardcodeado en el código es **solo para este ejemplo aislado** — en cualquier proyecto real va en una variable de entorno, ver [Variables de entorno en Node](/guides/node-env-vars).
- `(req as any).userId` es un atajo rápido para esta demo mínima — la forma correcta de tipar `req.user` está en [Middleware de autenticación](/guides/express-auth-middleware).
