---
title: Cookies vs sesiones — JWT en cookie o session store
description: httpOnly, secure, sameSite; y la diferencia real entre guardar el JWT en una cookie vs una sesión tradicional en base de datos.
category: backend
stack: express
order: 8
tags: [express, cookies, sessions, auth]
scope: cookies / express-session
updatedAt: 2026-08-16
---

Una vez que el servidor autenticó al usuario, hace falta que las siguientes requests "recuerden" quién es — hay dos formas principales de resolver esto, con trade-offs distintos.

## Opción 1: JWT en una cookie httpOnly

En vez de devolver el [JWT](/guides/express-jwt) en el body de la respuesta (donde JavaScript del cliente lo tendría que guardar en `localStorage`), se manda como cookie:

```bash
npm install cookie-parser
```

```ts
import cookieParser from 'cookie-parser';
app.use(cookieParser());

app.post('/login', async (req, res) => {
  // ... verificar credenciales ...
  const token = firmarToken({ sub: usuario.id, rol: usuario.rol });

  res.cookie('token', token, {
    httpOnly: true,   // JavaScript del navegador NO puede leer esta cookie (protege contra XSS)
    secure: true,      // solo se manda por HTTPS
    sameSite: 'lax',   // limita cuándo se manda en requests cross-site (protege contra CSRF)
    maxAge: 60 * 60 * 1000, // 1 hora, en ms
  });

  res.json({ ok: true });
});
```

```ts
// Leer el token en requests siguientes
app.get('/perfil', (req, res) => {
  const token = req.cookies.token;
  const payload = verificarToken(token);
  res.json({ userId: payload.sub });
});
```

`httpOnly: true` es la razón principal para preferir cookie sobre `localStorage`: un JWT en `localStorage` es legible por **cualquier** script que corra en la página (incluyendo uno inyectado por un XSS) — una cookie httpOnly no, el navegador la manda automáticamente pero JavaScript no puede tocarla.

## Opción 2: sesión tradicional (server-side)

En vez de un JWT autocontenido, la cookie solo guarda un **id de sesión** random — los datos reales (quién es el usuario) viven en el servidor (memoria, Redis, base de datos).

```bash
npm install express-session
```

```ts
import session from 'express-session';

app.use(
  session({
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, secure: true, maxAge: 60 * 60 * 1000 },
  }),
);

app.post('/login', async (req, res) => {
  // ... verificar credenciales ...
  req.session.userId = usuario.id; // Express guarda esto server-side, la cookie solo tiene el id de sesión
  res.json({ ok: true });
});

app.get('/perfil', (req, res) => {
  if (!req.session.userId) return res.status(401).json({ error: 'No autenticado' });
  res.json({ userId: req.session.userId });
});
```

## La diferencia real: revocación

| | JWT (autocontenido) | Sesión server-side |
| --- | --- | --- |
| Verificar | Sin tocar la base — solo la firma | Consulta al store de sesiones (Redis/DB) en cada request |
| Cerrar sesión antes de que expire | No es directo (ver nota en [JWT](/guides/express-jwt)) | Trivial — borrar esa sesión del store |
| Escala horizontal | Sin estado compartido — cualquier instancia del servidor puede verificarlo | Necesita un store compartido (Redis) entre instancias |

No hay una respuesta universalmente "mejor" — JWT gana en no depender de un store centralizado; sesión server-side gana en poder revocar acceso inmediatamente (crítico para "cerrar sesión en todos los dispositivos", o banear una cuenta al instante).

## Resumen

| Cookie option | Qué hace |
| --- | --- |
| `httpOnly: true` | JavaScript del navegador no puede leer la cookie (protege contra XSS) |
| `secure: true` | Solo se manda por HTTPS |
| `sameSite: 'lax' \| 'strict'` | Limita cuándo se manda en requests cross-site (protege contra CSRF) |
| `maxAge` | Cuánto dura antes de expirar, en ms |

## Consideraciones

- `sameSite: 'strict'` bloquea incluso navegación normal desde un link externo (el usuario llega "deslogueado" la primera vez); `'lax'` (el default recomendado) permite eso pero sigue bloqueando requests cross-site iniciadas por scripts o forms — el balance correcto para la mayoría de los casos.
- Para apps full-stack de mismo origen (Astro, Next.js), este trade-off manual casi no aplica — [better-auth](/guides/express-better-auth) y [Auth.js](/guides/express-auth-js) ya deciden esto por vos con defaults sensatos.
