---
title: Auth completa (registro + login + JWT + cookies)
description: El flujo entero de principio a fin — registro con bcrypt, login que firma un JWT, y una cookie httpOnly para mantener la sesión.
type: recipes
order: 24
tags: [express, auth, jwt, bcrypt, cookies]
problem: Armar autenticación manual completa, sin ninguna librería de auth managed, entendiendo cada pieza.
technologies:
  - backend/express/express-jwt
  - backend/express/bcrypt
  - backend/express/express-cookies-sesiones
  - backend/express/express-auth-middleware
updatedAt: 2026-08-16
---

## Piezas que se combinan

Esta receta junta [JWT](/backend/express/express-jwt), [bcrypt](/backend/express/bcrypt), [cookies httpOnly](/backend/express/express-cookies-sesiones) y el [middleware de auth](/backend/express/express-auth-middleware) en un flujo completo — cada pieza por separado ya está documentada a fondo en su propia guía; aquí solo el ensamblado.

## Setup

```bash
npm install express jsonwebtoken bcrypt cookie-parser
npm install --save-dev @types/jsonwebtoken @types/bcrypt @types/cookie-parser
```

## Registro

```ts title="routes/auth.routes.ts"
import { Router } from 'express';
import bcrypt from 'bcrypt';
import { prisma } from '../lib/prisma';

export const authRouter = Router();

authRouter.post('/registro', async (req, res, next) => {
  try {
    const { email, password, nombre } = req.body;

    const existente = await prisma.user.findUnique({ where: { email } });
    if (existente) {
      return res.status(409).json({ error: { code: 'EMAIL_YA_REGISTRADO', message: 'Ese email ya está en uso' } });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const usuario = await prisma.user.create({
      data: { email, passwordHash, nombre, rol: 'user' },
    });

    res.status(201).json({ id: usuario.id, email: usuario.email });
  } catch (err) {
    next(err);
  }
});
```

## Login: verificar y firmar el JWT

```ts
import jwt from 'jsonwebtoken';

authRouter.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const usuario = await prisma.user.findUnique({ where: { email } });
    const passwordValida = usuario && (await bcrypt.compare(password, usuario.passwordHash));

    if (!usuario || !passwordValida) {
      return res.status(401).json({ error: { code: 'CREDENCIALES_INVALIDAS', message: 'Email o contraseña incorrectos' } });
    }

    const token = jwt.sign(
      { sub: usuario.id, rol: usuario.rol },
      process.env.JWT_SECRET!,
      { expiresIn: '1h' },
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 1000,
    });

    res.json({ id: usuario.id, email: usuario.email });
  } catch (err) {
    next(err);
  }
});
```

## Logout

```ts
authRouter.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.status(204).end();
});
```

## Ruta protegida de prueba

```ts title="app.ts"
import cookieParser from 'cookie-parser';
import { authRouter } from './routes/auth.routes';
import { requireAuth } from './middlewares/requireAuth';

app.use(cookieParser());
app.use(express.json());
app.use('/auth', authRouter);

app.get('/perfil', requireAuth, (req, res) => {
  res.json({ userId: req.user!.id, rol: req.user!.rol });
});
```

## Consideraciones

- `secure: process.env.NODE_ENV === 'production'` — en desarrollo local sin HTTPS, `secure: true` haría que el navegador nunca mande la cookie de vuelta.
- Este flujo no incluye verificación de email ni recuperación de contraseña — son extensiones naturales del mismo patrón (un token de un solo uso, firmado igual que el JWT de sesión, con expiración corta), fuera del alcance de esta receta puntual.
