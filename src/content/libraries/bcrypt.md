---
title: bcrypt
description: Hashear y comparar contraseñas — por qué nunca se guardan en texto plano, qué es el salt, y el costo (rounds) configurable.
category: backend
stack: express
order: 18
tags: [express, bcrypt, security, passwords]
install: |
  npm install bcrypt
  npm install --save-dev @types/bcrypt
related: [guides/express-jwt]
updatedAt: 2026-08-16
---

Guardar contraseñas en texto plano significa que cualquiera con acceso a la base de datos (un atacante, un empleado malicioso, un backup filtrado) tiene la contraseña real de cada usuario. `bcrypt` hashea la contraseña de forma que **no se puede revertir** — solo se puede comparar un intento contra el hash guardado.

## Hashear al registrar

```ts
import bcrypt from 'bcrypt';

async function registrarUsuario(email: string, password: string) {
  const passwordHash = await bcrypt.hash(password, 10);
  return crearUsuarioEnDB({ email, passwordHash });
}
```

El segundo argumento (`10`) son los **rounds** de costo — cuánto trabajo computacional cuesta generar el hash. Más alto es más lento (y más resistente a fuerza bruta), `10` es un default razonable hoy; subir el número tiene un costo real de CPU en cada registro/login.

## Comparar al hacer login

```ts
async function verificarPassword(passwordIngresada: string, passwordHash: string) {
  return bcrypt.compare(passwordIngresada, passwordHash);
}
```

```ts
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const usuario = await buscarUsuarioPorEmail(email);

  if (!usuario || !(await verificarPassword(password, usuario.passwordHash))) {
    return res.status(401).json({ error: 'Credenciales inválidas' });
  }

  // credenciales correctas, emitir JWT o crear sesión
});
```

`bcrypt.compare()` es la única forma correcta de verificar — **nunca** se hashea la contraseña ingresada y se compara el string resultante con `===`, aunque parezca equivalente (ver por qué, abajo).

## Qué es el salt (y por qué no hace falta guardarlo aparte)

Un salt es un valor random que se mezcla con la contraseña antes de hashear, para que dos usuarios con la misma contraseña no tengan el mismo hash guardado (lo que revelaría el patrón a simple vista). `bcrypt.hash()` genera el salt automáticamente y lo **incluye dentro del string del hash resultante** — por eso no hace falta una columna separada para guardarlo, `bcrypt.compare()` lo extrae solo del hash al verificar.

```text
$2b$10$N9qo8uLOickgx2ZMRZoMye.IjPeKgAcXHqJqNz3z8WQvOc7q8vJZa
└┬┘└┬┘└──────────┬──────────┘└───────────────┬───────────────┘
 │  │        salt (22 chars)          hash resultante
 │  └─ cost factor (rounds)
 └─ versión del algoritmo
```

## Resumen

| API | Qué hace |
| --- | --- |
| `bcrypt.hash(password, rounds)` | Genera un hash (con salt incluido) |
| `bcrypt.compare(password, hash)` | Compara un intento contra el hash guardado |
| Rounds (típico: 10-12) | Costo computacional — más alto, más lento y más resistente |

## Consideraciones — por qué NO comparar con `===`

Hashear la contraseña ingresada de nuevo y comparar strings con `===` **no funciona** con bcrypt, porque cada llamada a `.hash()` genera un salt distinto (aunque la contraseña sea la misma) — el string resultante nunca sería igual dos veces. `bcrypt.compare()` extrae el salt del hash guardado y lo reutiliza para el chequeo, por eso es el único método correcto.

- `bcrypt.compare()` toma un tiempo aproximadamente constante independientemente de si la contraseña es correcta o no — evita timing attacks (adivinar la contraseña midiendo cuánto tarda la respuesta).
- Nunca loguear la contraseña en texto plano en ningún punto del flujo (ni siquiera "para debug") — ver [Logging de requests](/guides/express-logging) sobre no loguear datos sensibles.
