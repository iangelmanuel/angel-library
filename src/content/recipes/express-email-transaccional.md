---
title: Email transaccional (Resend + Express)
description: Email de confirmación al registrarse y de recuperación de contraseña — los dos flujos de email más comunes de cualquier backend.
category: backend
stack: express
order: 31
tags: [express, email, resend]
problem: Los dos casos de uso de email transaccional que casi todo backend termina necesitando, con tokens de un solo uso.
technologies: [libraries/resend, guides/express-prisma]
updatedAt: 2026-08-16
---

## Setup

```bash
npm install resend jsonwebtoken
```

```ts title="lib/resend.ts"
import { Resend } from 'resend';

export const resend = new Resend(process.env.RESEND_API_KEY);
```

## Flujo 1: confirmar email al registrarse

Un token de un solo uso, firmado igual que un JWT de sesión pero con un propósito distinto (`type: 'email-confirmation'`) y expiración corta:

```ts title="routes/auth.routes.ts"
import jwt from 'jsonwebtoken';
import { resend } from '../lib/resend';

authRouter.post('/registro', async (req, res, next) => {
  try {
    const usuario = await crearUsuario(req.body); // ver Auth completa

    const tokenConfirmacion = jwt.sign(
      { sub: usuario.id, type: 'email-confirmation' },
      process.env.JWT_SECRET!,
      { expiresIn: '24h' },
    );

    const urlConfirmacion = `${process.env.APP_URL}/confirmar-email?token=${tokenConfirmacion}`;

    await resend.emails.send({
      from: 'App <noreply@midominio.com>',
      to: usuario.email,
      subject: 'Confirmá tu cuenta',
      html: `<p>Hacé click <a href="${urlConfirmacion}">acá</a> para confirmar tu cuenta. Expira en 24 horas.</p>`,
    });

    res.status(201).json({ ok: true });
  } catch (err) {
    next(err);
  }
});

authRouter.get('/confirmar-email', async (req, res) => {
  try {
    const payload = jwt.verify(req.query.token as string, process.env.JWT_SECRET!) as {
      sub: string;
      type: string;
    };

    if (payload.type !== 'email-confirmation') {
      return res.status(400).json({ error: 'Token inválido' });
    }

    await prisma.user.update({ where: { id: payload.sub }, data: { emailConfirmado: true } });
    res.json({ ok: true });
  } catch {
    res.status(400).json({ error: 'Token inválido o expirado' });
  }
});
```

## Flujo 2: recuperar contraseña

Mismo patrón de token, distinto `type`, y esta vez de un solo uso real (no solo por expiración):

```ts
authRouter.post('/olvide-password', async (req, res) => {
  const usuario = await prisma.user.findUnique({ where: { email: req.body.email } });

  // Responder igual exista o no el usuario — no revelar si un email está registrado
  if (usuario) {
    const token = jwt.sign({ sub: usuario.id, type: 'password-reset' }, process.env.JWT_SECRET!, {
      expiresIn: '1h',
    });

    await resend.emails.send({
      from: 'App <noreply@midominio.com>',
      to: usuario.email,
      subject: 'Recuperar contraseña',
      html: `<p>Cambiá tu contraseña <a href="${process.env.APP_URL}/reset-password?token=${token}">acá</a>. Expira en 1 hora.</p>`,
    });
  }

  res.json({ ok: true });
});

authRouter.post('/reset-password', async (req, res) => {
  try {
    const payload = jwt.verify(req.body.token, process.env.JWT_SECRET!) as { sub: string; type: string };
    if (payload.type !== 'password-reset') throw new Error();

    const passwordHash = await bcrypt.hash(req.body.password, 10);
    await prisma.user.update({ where: { id: payload.sub }, data: { passwordHash } });

    res.json({ ok: true });
  } catch {
    res.status(400).json({ error: 'Token inválido o expirado' });
  }
});
```

## Por qué responder igual exista o no el email

`/olvide-password` devuelve `{ ok: true }` sin importar si el email está registrado — devolver un error distinto ("ese email no existe") permite a un atacante enumerar qué emails están registrados en el sistema probando uno por uno.

## Consideraciones

- Estos tokens usan el mismo `JWT_SECRET` que la sesión por simplicidad del ejemplo — en un proyecto real, un secreto separado para tokens de propósito único (confirmación, reset) limita el daño si uno de los dos se filtra.
- Un JWT verificado con `jwt.verify()` sigue siendo válido hasta que expira, aunque ya se haya "usado" una vez (por ejemplo, resetear la contraseña dos veces con el mismo link antes de que expire) — para invalidar de verdad tras el primer uso, hace falta guardar un registro de tokens usados en la base, o usar un token random guardado en una tabla en vez de un JWT autocontenido.
