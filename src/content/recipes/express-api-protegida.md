---
title: API protegida (auth + validación + rate limiting)
description: Todas las piezas de seguridad juntas en un mismo endpoint — el ejemplo de referencia de cómo se ve una ruta "bien protegida".
category: backend
stack: express
order: 32
tags: [express, security, auth, validation, rate-limiting]
problem: Ver todas las capas de protección combinadas en una sola ruta real, en el orden correcto.
technologies:
  - guides/express-auth-middleware
  - guides/express-roles-permisos
  - libraries/zod
  - guides/express-cors
  - guides/express-seguridad
updatedAt: 2026-08-16
---

## El orden de las capas importa

```ts title="routes/admin.routes.ts"
import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { z } from 'zod';
import { requireAuth } from '../middlewares/requireAuth';
import { requireRole } from '../middlewares/requireRole';
import { asyncHandler } from '../utils/asyncHandler';
import { prisma } from '../lib/prisma';

export const adminRouter = Router();

const limiterEscritura = rateLimit({ windowMs: 15 * 60 * 1000, max: 30 });

const actualizarUsuarioSchema = z.object({
  rol: z.enum(['user', 'moderador', 'admin']).optional(),
  activo: z.boolean().optional(),
});

adminRouter.patch(
  '/usuarios/:id',
  requireAuth,                 // 1. ¿quién sos? (401 si no hay token válido)
  requireRole('admin'),        // 2. ¿podés hacer esto? (403 si no sos admin)
  limiterEscritura,            // 3. ¿estás abusando de este endpoint? (429 si sí)
  asyncHandler(async (req, res) => {
    const datos = actualizarUsuarioSchema.parse(req.body); // 4. ¿el body tiene forma válida? (400 si no)

    const usuario = await prisma.user.update({
      where: { id: req.params.id },
      data: datos,
    });

    res.json(usuario);
  }),
);
```

## Por qué ese orden específico

```text
requireAuth       → lo más barato de chequear primero, corta rápido si no hay ni token
requireRole        → sigue siendo barato (compara un string), corta antes de gastar más
limiterEscritura   → un poco más de trabajo (consulta el store de rate limit)
Zod .parse()        → lo último — no tiene sentido validar la forma del body de alguien
                      que ni siquiera está autenticado o autorizado
```

Chequear lo más barato y más determinante primero evita trabajo innecesario — no hay razón para parsear y validar un body completo si la request ya iba a rechazarse por falta de auth.

## CORS a nivel de la app, no de esta ruta puntual

```ts title="app.ts"
import cors from 'cors';
import { adminRouter } from './routes/admin.routes';

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);
app.use(helmet());
app.use(express.json({ limit: '1mb' }));

app.use('/admin', adminRouter);
app.use(errorHandler);
```

[CORS](/guides/express-cors) y [helmet](/guides/express-seguridad) van a nivel de toda la app (una vez), no repetidos por ruta — son protecciones transversales, a diferencia de auth/rol/rate-limit que sí varían según qué tan sensible es cada endpoint puntual.

## Manejar el `RateLimitExceeded` y el `ZodError` en el error handler

```ts title="middlewares/error-handler.ts"
export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (err instanceof ZodError) {
    return res.status(400).json({ error: { code: 'VALIDATION_ERROR', fields: err.flatten().fieldErrors } });
  }
  if (err instanceof AppError) {
    return res.status(err.status).json({ error: { code: err.code, message: err.message } });
  }
  console.error(err);
  res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Error interno' } });
};
```

(`express-rate-limit` responde `429` por sí solo antes de que la request llegue al error handler — no necesita manejo especial ahí.)

## Resumen — checklist de una ruta bien protegida

| Capa | Protege contra |
| --- | --- |
| `requireAuth` | Acceso sin autenticar |
| `requireRole` / ownership | Acceso autenticado pero sin permiso suficiente |
| Rate limiting | Abuso por volumen, fuerza bruta |
| Validación (Zod) | Datos con forma inesperada o maliciosa |
| CORS + Helmet (nivel app) | Exposición del lado del navegador, headers faltantes |

## Consideraciones

- No todas las rutas necesitan las cinco capas — un endpoint público de solo lectura (`GET /posts`) no necesita `requireAuth`; el nivel de protección depende de qué tan sensible es cada operación puntual.
- Esta receta combina piezas ya documentadas por separado — para el detalle de cada una (por qué ese orden de middlewares, cómo funciona cada pieza), ver sus guías individuales enlazadas en `technologies` arriba.
