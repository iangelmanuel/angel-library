---
title: Supertest
description: Tests de integración HTTP contra tu app Express — sin levantar un servidor real, request/response completos incluyendo middlewares.
category: testing
stack: testing-integracion
order: 2
tags: [express, testing, supertest, http]
website: https://github.com/ladjs/supertest
install: |
  npm install --save-dev supertest
  npm install --save-dev @types/supertest
related: [libraries/vitest-backend]
updatedAt: 2026-08-16
---

[Vitest](/libraries/vitest-backend) testea funciones aisladas (services, repositories mockeados). Supertest testea la app **completa**, como un cliente HTTP real — pasando por todos los middlewares, el routing y el error handler, sin necesitar `app.listen()` en un puerto real.

## Requisito: exportar `app` sin llamar a `.listen()`

```ts title="app.ts"
import express from 'express';

const app = express();
app.use(express.json());
// ... middlewares y rutas ...

export default app; // exportar SIN listen()
```

```ts title="server.ts"
import app from './app';

app.listen(3000, () => console.log('Escuchando en 3000'));
```

Separar `app.ts` (la configuración de Express) de `server.ts` (el `.listen()` real) es lo que permite que Supertest use la misma app sin abrir un puerto de verdad — Supertest simula las requests directamente contra el objeto `app`.

## Un test de integración

```ts title="routes/users.routes.test.ts"
import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../app';

describe('POST /usuarios', () => {
  it('crea un usuario con datos válidos', async () => {
    const response = await request(app)
      .post('/usuarios')
      .send({ email: 'nuevo@test.com', password: 'password123' });

    expect(response.status).toBe(201);
    expect(response.body.email).toBe('nuevo@test.com');
  });

  it('rechaza un email inválido con 400', async () => {
    const response = await request(app)
      .post('/usuarios')
      .send({ email: 'no-es-un-email', password: 'password123' });

    expect(response.status).toBe(400);
    expect(response.body.error).toBeDefined();
  });
});
```

`request(app)` arma la request; `.post(ruta)`, `.get(ruta)`, etc. definen el verbo; `.send(body)` manda el body; el resultado (`response`) tiene `.status`, `.body`, `.headers` ya parseados.

## Testear rutas protegidas (con auth)

```ts
describe('GET /perfil', () => {
  it('rechaza sin token', async () => {
    const response = await request(app).get('/perfil');
    expect(response.status).toBe(401);
  });

  it('devuelve el perfil con un token válido', async () => {
    const token = firmarToken({ sub: 'user-1', rol: 'user' }); // helper de test, mismo JWT real

    const response = await request(app)
      .get('/perfil')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.userId).toBe('user-1');
  });
});
```

`.set('Authorization', ...)` agrega headers — el mismo patrón para cookies (`.set('Cookie', 'token=...')`) o cualquier header custom que la API espere.

## Resumen

| Método | Qué hace |
| --- | --- |
| `request(app)` | Punto de entrada, usa la app de Express sin `.listen()` |
| `.get/.post/.put/.delete(ruta)` | Define el verbo y la ruta |
| `.send(body)` | Manda el body (JSON automáticamente si es un objeto) |
| `.set(header, valor)` | Headers custom, auth, cookies |
| `response.status` / `.body` | La respuesta completa, ya parseada |

## Consideraciones

- Supertest testea la app entera "de afuera hacia adentro" — es el nivel correcto para verificar que middlewares, validación y error handler realmente funcionan juntos, algo que un test de service aislado (con todo mockeado) no puede confirmar.
- Para rutas que tocan la base de datos real, combinar con la base de test de [Vitest](/libraries/vitest-backend) — sin eso, estos tests fallarían (o peor, escribirían) contra la base de desarrollo/producción.
