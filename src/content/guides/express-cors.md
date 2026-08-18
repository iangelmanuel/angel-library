---
title: CORS en Express
description: Qué es Same-Origin Policy, por qué el navegador bloquea requests entre orígenes distintos, y cómo configurar el paquete cors.
category: backend
stack: express
order: 3
tags: [express, cors, security]
scope: cors
updatedAt: 2026-08-16
---

CORS (Cross-Origin Resource Sharing) es un mecanismo del **navegador**, no del servidor — Express no "bloquea" nada por sí solo; es el navegador el que rechaza la respuesta si el servidor no autoriza explícitamente el origen que hizo la request.

## Por qué existe: Same-Origin Policy

Por defecto, el navegador bloquea que JavaScript corriendo en `https://mi-frontend.com` lea la respuesta directamente request a `https://mi-api.com` (dominio distinto = origen distinto) — una protección de seguridad para que un sitio no pueda leer datos de otro sin permiso. CORS es la forma en que el servidor le dice al navegador "sí, este origen puede leer mi respuesta".

Esto **solo aplica** cuando frontend y backend están en orígenes distintos (dominios, puertos o protocolos distintos) — una API Express separada del frontend (típico si el frontend es una SPA aparte) necesita CORS; una app full-stack donde todo se sirve desde el mismo origen (como Astro o Next.js, ver sus respectivas guías) generalmente no.

## Instalación y uso básico

```bash
npm install cors
```

```ts title="app.ts"
import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors()); // permite CUALQUIER origen — cómodo en desarrollo, rara vez correcto en producción
```

## Restringir a orígenes específicos

```ts
app.use(
  cors({
    origin: 'https://mi-frontend.com',
    credentials: true, // necesario si el frontend manda cookies (ver Cookies vs sesiones)
  }),
);
```

```ts
// Varios orígenes permitidos (ej: producción + preview de Vercel)
app.use(
  cors({
    origin: ['https://mi-frontend.com', 'https://staging.mi-frontend.com'],
  }),
);
```

## Origen dinámico (validado a mano)

```ts
const origenesPermitidos = ['https://mi-frontend.com', 'http://localhost:5173'];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || origenesPermitidos.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Origen no permitido por CORS'));
      }
    },
  }),
);
```

## CORS por ruta, no global

```ts
app.get('/publico', cors(), handler);           // esta ruta sí permite cross-origin
app.get('/interno', handler);                    // esta no (sin el middleware cors())
```

## Resumen

| Opción de `cors({...})` | Qué controla |
| --- | --- |
| `origin` | Qué origen(es) puede leer la respuesta |
| `credentials: true` | Permite mandar cookies/auth headers en la request cross-origin |
| `methods` | Qué verbos HTTP permite (`GET`, `POST`, etc.) |
| `allowedHeaders` | Qué headers custom puede mandar el cliente |

## Consideraciones

- `cors()` sin opciones (`origin: '*'` implícito) es válido para una API pública sin autenticación, pero **incompatible** con `credentials: true` — el navegador rechaza esa combinación por diseño (no se puede permitir cookies desde "cualquier origen").
- CORS protege al **navegador**, no al servidor — no es una medida de seguridad contra requests hechas fuera del navegador (curl, Postman, otro servidor); para eso hace falta autenticación real, ver [Middleware de autenticación](/guides/express-auth-middleware).
- Un error de CORS en la consola del navegador (`blocked by CORS policy`) es del lado del cliente — la request en general **sí llegó** al servidor y se ejecutó; lo que se bloquea es que el navegador le entregue la respuesta al código JS que la pidió.
