---
title: express-validator
description: Validación declarativa como middleware — chains de reglas por campo, y por qué en un proyecto con Zod puede no hacer falta.
type: libraries
order: 19
tags: [express, validation]
website: https://express-validator.github.io
install: npm install express-validator
related: [general/packages/zod]
updatedAt: 2026-08-16
---

`express-validator` es un wrapper de [validator.js](https://github.com/validatorjs) diseñado específicamente como middleware de Express — reglas de validación declaradas por campo, que corren como parte de la cadena de middlewares antes de que la request llegue al handler.

## Uso básico

```ts
import { body, validationResult } from "express-validator"

app.post(
  "/usuarios",
  body("email").isEmail().withMessage("Email no válido"),
  body("password").isLength({ min: 8 }).withMessage("Mínimo 8 caracteres"),
  body("edad").isInt({ min: 18 }).withMessage("Debes ser mayor de edad"),
  (req, res) => {
    const errores = validationResult(req)
    if (!errores.isEmpty()) {
      return res.status(400).json({ errors: errores.array() })
    }

    // req.body ya pasó las validaciones de arriba
    crearUsuario(req.body)
    res.status(201).json({ ok: true })
  }
)
```

Cada `body('campo').regla()` es un middleware que se agrega a la cadena — corren todos antes del handler final, acumulando errores en vez de cortar en el primero.

## Validar distintas fuentes

```ts
import { body, param, query } from "express-validator"

app.get(
  "/posts/:id",
  param("id").isUUID().withMessage("Id inválido"),
  query("incluirComentarios").optional().isBoolean(),
  handler
)
```

`body` valida el body, `param` los parámetros de ruta (`:id`), `query` el query string — cada uno apunta a una parte distinta de la request.

## Sanitización

Además de validar, puede transformar el valor:

```ts
body('email').isEmail().normalizeEmail(),   // baja a minúsculas, formato consistente
body('nombre').trim().escape(),              // recorta espacios, escapa HTML
```

## Middleware reutilizable para el chequeo de errores

Repetir `validationResult(req)` en cada ruta es innecesario — un middleware lo centraliza:

```ts title="middlewares/validar.ts"
import type { NextFunction, Request, Response } from "express"
import { validationResult } from "express-validator"

export function validar(req: Request, res: Response, next: NextFunction) {
  const errores = validationResult(req)
  if (!errores.isEmpty()) {
    return res
      .status(400)
      .json({ error: { code: "VALIDATION_ERROR", fields: errores.array() } })
  }
  next()
}
```

```ts
app.post(
  "/usuarios",
  body("email").isEmail(),
  body("password").isLength({ min: 8 }),
  validar,
  handler
)
```

## Resumen

| API                                           | Qué hace                                         |
| --------------------------------------------- | ------------------------------------------------ |
| `body()` / `param()` / `query()`              | Apuntan a qué parte de la request validar        |
| `.isEmail()`, `.isLength()`, `.isInt()`, etc. | Reglas encadenables                              |
| `.withMessage(msg)`                           | Mensaje de error custom por regla                |
| `validationResult(req)`                       | Junta los errores acumulados de todas las reglas |

## Consideraciones — express-validator vs Zod

- Si el proyecto ya usa [Zod](/general/packages/zod) (por ejemplo, para validar `.env` o compartir schemas con un frontend), duplicar reglas de validación en dos sistemas distintos (Zod en un lado, express-validator en otro) es trabajo repetido — un middleware genérico que valide `req.body` contra un `z.object()` cubre lo mismo sin una segunda API que aprender.
- `express-validator` está pensado específicamente para Express (las reglas son middlewares) — Zod es agnóstico de framework, útil si el mismo schema necesita reusarse fuera de rutas Express (un CLI, un worker, otro servicio).
- Para proyectos que **no** usan Zod en ningún otro lado, express-validator es una opción válida y directa, sin traer una dependencia extra solo para validar bodies de request.
