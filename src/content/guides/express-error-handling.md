---
title: Manejo de errores centralizado
description: El middleware de error (firma de 4 argumentos), next(err) para propagar, y por qué evita un try/catch repetido en cada ruta.
category: backend
stack: express
order: 4
tags: [express, errors, middleware]
scope: error-handling middleware
related: [guides/express-api-error-responses]
updatedAt: 2026-08-16
---

Express reconoce un tipo especial de middleware — uno con **4** argumentos en vez de 3 — como manejador de errores. Registrar uno solo, al final de todo, evita repetir `try/catch` + formato de respuesta de error en cada ruta.

## El middleware de error

```ts title="middlewares/error-handler.ts"
import type { ErrorRequestHandler } from 'express';

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.error(err);

  const status = err.status ?? 500;
  res.status(status).json({
    error: status === 500 ? 'Error interno del servidor' : err.message,
  });
};
```

Se registra **al final**, después de todas las rutas — Express identifica un middleware de error por su cantidad de argumentos (4), no por su nombre ni dónde se importa:

```ts title="app.ts"
app.get('/usuarios', handler);
app.post('/usuarios', handler);
// ... el resto de las rutas ...

app.use(errorHandler); // último, siempre
```

## Cómo llegan los errores hasta acá: `next(err)`

Un error lanzado **síncronamente** dentro de un handler normal, Express lo atrapa solo (desde Express 5; en Express 4 solo si es síncrono). Un error **asíncrono** (dentro de un `async`, una promesa rechazada) necesita pasarse explícitamente con `next(err)`:

```ts
app.get('/usuarios/:id', async (req, res, next) => {
  try {
    const usuario = await buscarUsuario(req.params.id);
    if (!usuario) {
      const error = new Error('Usuario no encontrado');
      (error as any).status = 404;
      throw error;
    }
    res.json(usuario);
  } catch (err) {
    next(err); // lo manda directo al errorHandler, sin formatear la respuesta acá
  }
});
```

Llamar a `next(err)` con **cualquier** argumento (en vez de sin argumentos) es la señal para Express de "esto es un error, saltate el resto de los middlewares normales y andá directo al de error".

## Una clase de error propia, con status

Repetir `(error as any).status = 404` en cada lugar es incómodo — una clase propia lo deja más limpio y tipado:

```ts title="errors/AppError.ts"
export class AppError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'AppError';
  }
}
```

```ts
import { AppError } from './errors/AppError';

app.get('/usuarios/:id', async (req, res, next) => {
  try {
    const usuario = await buscarUsuario(req.params.id);
    if (!usuario) throw new AppError(404, 'Usuario no encontrado');
    res.json(usuario);
  } catch (err) {
    next(err);
  }
});
```

```ts title="middlewares/error-handler.ts"
import { AppError } from '../errors/AppError';

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (err instanceof AppError) {
    return res.status(err.status).json({ error: err.message });
  }

  console.error(err); // error inesperado: loguearlo completo, no exponer detalles internos
  res.status(500).json({ error: 'Error interno del servidor' });
};
```

## Envolver handlers async para no repetir try/catch

Escribir `try/catch` + `next(err)` en cada handler async es repetitivo — un wrapper lo hace una sola vez:

```ts title="utils/asyncHandler.ts"
import type { Request, Response, NextFunction, RequestHandler } from 'express';

export function asyncHandler(fn: RequestHandler) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
```

```ts
import { asyncHandler } from './utils/asyncHandler';

app.get('/usuarios/:id', asyncHandler(async (req, res) => {
  const usuario = await buscarUsuario(req.params.id);
  if (!usuario) throw new AppError(404, 'Usuario no encontrado');
  res.json(usuario); // si algo lanza acá arriba, asyncHandler lo atrapa y lo manda a next()
}));
```

## Resumen

| Pieza | Rol |
| --- | --- |
| `(err, req, res, next) => {...}` | Firma que Express reconoce como middleware de error |
| `app.use(errorHandler)` | Se registra al final, después de todas las rutas |
| `next(err)` | Propaga un error asíncrono hasta el error handler |
| `class AppError extends Error` | Errores con `status` propio, tipados |
| `asyncHandler(fn)` | Evita repetir `try/catch` en cada ruta async |

## Consideraciones

- Un error que se lanza dentro de un callback asíncrono **sin** pasar por `next(err)` (por ejemplo, dentro de un `setTimeout`, o una promesa sin `await` ni `.catch()`) nunca llega al error handler — puede tirar el proceso entero si nadie más lo atrapa.
- El error handler es el lugar correcto para decidir qué información exponer: un error interno (bug, falla de base de datos) nunca debería devolver su mensaje real al cliente, solo un genérico — ver [Diseño de respuestas de error](/guides/express-api-error-responses) para el formato completo.
