---
title: JWT — qué es y cómo firmarlo/verificarlo
description: Estructura de un JSON Web Token, firmar y verificar con jsonwebtoken, expiración y qué NO guardar dentro del payload.
category: backend
stack: express
order: 7
tags: [express, jwt, auth]
scope: jsonwebtoken
related: [guides/express-cookies-sesiones]
updatedAt: 2026-08-16
---

Un JWT (JSON Web Token) es una forma de codificar información (típicamente "quién es el usuario") en un string que el propio servidor puede **verificar sin consultar una base de datos** — la confianza viene de una firma criptográfica, no de una tabla de sesiones.

## Estructura

Un JWT son tres partes separadas por puntos, cada una en Base64:

```text
eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjMiLCJyb2wiOiJhZG1pbiJ9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
└─── header ───┘.└──────── payload ────────┘.└──────── firma ────────┘
```

- **Header**: qué algoritmo de firma se usó.
- **Payload**: los datos — típicamente `sub` (id del usuario), y cualquier otro claim custom (`rol`, `email`).
- **Firma**: el hash del header+payload firmado con un secreto — es lo que hace que el token no se pueda falsificar sin conocer ese secreto.

**El payload NO está encriptado**, solo codificado en Base64 — cualquiera puede decodificarlo y leerlo (pegar el token en [jwt.io](https://jwt.io) lo muestra entero). Lo que no se puede hacer sin el secreto es **modificarlo** sin que la firma deje de coincidir.

## Firmar un token

```bash
npm install jsonwebtoken
```

```ts title="lib/jwt.ts"
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!; // ver Variables de entorno en Node

export function firmarToken(payload: { sub: string; rol: string }) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
}
```

## Verificar un token

```ts
export function verificarToken(token: string) {
  return jwt.verify(token, JWT_SECRET) as { sub: string; rol: string };
}
```

`jwt.verify()` chequea la firma **y** la expiración en un solo paso — lanza si cualquiera de las dos falla (`JsonWebTokenError` para firma inválida, `TokenExpiredError` para expirado).

## Uso típico: login

```ts
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const usuario = await buscarUsuarioPorEmail(email);
  if (!usuario || !(await compararPassword(password, usuario.passwordHash))) {
    return res.status(401).json({ error: 'Credenciales inválidas' });
  }

  const token = firmarToken({ sub: usuario.id, rol: usuario.rol });
  res.json({ token });
});
```

`compararPassword` usa [bcrypt](/libraries/bcrypt) — nunca se guarda ni se compara la contraseña en texto plano.

## Expiración y refresh tokens

Un JWT de vida corta (`expiresIn: '15m'`) limita el daño si se roba, pero obliga a re-loguearse seguido — el patrón común es combinar un **access token** de vida corta con un **refresh token** de vida larga, guardado de forma más segura (httpOnly cookie), que solo sirve para pedir un access token nuevo sin volver a mandar la contraseña.

```ts
const accessToken = firmarToken({ sub: usuario.id, rol: usuario.rol });          // expira en 15 min
const refreshToken = jwt.sign({ sub: usuario.id }, JWT_REFRESH_SECRET, { expiresIn: '7d' });
```

## Resumen

| API | Qué hace |
| --- | --- |
| `jwt.sign(payload, secret, { expiresIn })` | Crea y firma un token |
| `jwt.verify(token, secret)` | Verifica firma + expiración, lanza si falla |
| Payload | Legible por cualquiera (Base64, no encriptado) — no falsificable sin el secreto |
| Access + refresh token | Access de vida corta, refresh de vida larga para renovarlo |

## Consideraciones

- **Nunca** poner datos sensibles en el payload (contraseñas, tarjetas, tokens de terceros) — cualquiera que tenga el JWT puede leerlo, aunque no pueda modificarlo.
- `JWT_SECRET` tiene que ser largo y random (no una palabra), y vivir en una variable de entorno — ver [Variables de entorno en Node](/guides/node-env-vars). Si se filtra, cualquiera puede firmar tokens válidos como cualquier usuario.
- Un JWT no se puede "invalidar" del lado del servidor antes de que expire (a diferencia de una sesión en base de datos) — si hace falta poder cerrar sesión de verdad en el momento (no solo esperar a que expire), o bien la expiración es corta y se usa refresh tokens con una lista de revocación, o directamente conviene una librería de sesión server-side como [better-auth](/guides/express-better-auth).
