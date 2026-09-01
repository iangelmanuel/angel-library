---
title: Manejo de errores centralizado
description: El middleware de error (firma de 4 argumentos), next(err) para propagar, y por qué evita un try/catch repetido en cada ruta.
type: guides
order: 5
tags: [express, errors, middleware]
scope: error-handling middleware
related: [backend/express/express-api-error-responses]
updatedAt: 2026-08-16
---

Express reconoce un tipo especial de middleware — uno con **4** argumentos en vez de 3 — como manejador de errores. Registrar uno solo, al final de todo, evita repetir `try/catch` + formato de respuesta de error en cada ruta.

## El middleware de error

```ts title="middlewares/error-handler.ts"
import type { ErrorRequestHandler } from "express"

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.error(err)

  const status = err.status ?? 500
  res.status(status).json({
    error: status === 500 ? "Error interno del servidor" : err.message
  })
}
```

Se registra **al final**, después de todas las rutas — Express identifica un middleware de error por su cantidad de argumentos (4), no por su nombre ni dónde se importa:

```ts title="app.ts"
app.get("/usuarios", handler)
app.post("/usuarios", handler)
// ... el resto de las rutas ...

app.use(errorHandler) // último, siempre
```

## Cómo llegan los errores hasta aquí

Express captura los errores lanzados de forma síncrona. En Express 5, un handler que devuelve una promesa también propaga automáticamente un rechazo o un `throw` hasta el middleware de errores:

```ts
app.get("/usuarios/:id", async (req, res) => {
  const usuario = await buscarUsuario(req.params.id)
  if (!usuario) throw new AppError(404, "Usuario no encontrado")
  res.json(usuario)
})
```

`next(error)` sigue siendo necesario cuando el fallo nace en una API de callbacks o en trabajo asíncrono que el handler no devuelve como promesa:

```ts
import { readFile } from "node:fs"

app.get("/reporte", (_req, res, next) => {
  readFile("./reporte.json", "utf8", (error, data) => {
    if (error) return next(error)
    res.type("json").send(data)
  })
})
```

Llamar a `next()` sin argumentos continúa la cadena normal. Llamarlo con un error omite los handlers normales restantes y busca el siguiente middleware de error. En Express 4, los rechazos de handlers `async` no se propagaban automáticamente y requerían wrapper o `try/catch`; revisa la versión del proyecto antes de copiar una estrategia heredada.

## Una clase de error propia, con status

Repetir `(error as any).status = 404` en cada lugar es incómodo — una clase propia lo deja más limpio y tipado:

```ts title="errors/AppError.ts"
export class AppError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message)
    this.name = "AppError"
  }
}
```

```ts
import { AppError } from "./errors/AppError"

app.get("/usuarios/:id", async (req, res) => {
  const usuario = await buscarUsuario(req.params.id)
  if (!usuario) throw new AppError(404, "Usuario no encontrado")
  res.json(usuario)
})
```

```ts title="middlewares/error-handler.ts"
import { AppError } from "../errors/AppError"

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (err instanceof AppError) {
    return res.status(err.status).json({ error: err.message })
  }

  console.error(err) // error inesperado: registrarlo, sin exponer detalles internos
  res.status(500).json({ error: "Error interno del servidor" })
}
```

## Wrapper para proyectos que todavía usan Express 4

En Express 4, escribir `try/catch` + `next(error)` en cada handler async es repetitivo. Un wrapper devuelve una función que conecta el rechazo con Express. En Express 5 este patrón ya no es necesario para handlers que retornan su promesa.

```ts title="utils/asyncHandler.ts"
import type { NextFunction, Request, RequestHandler, Response } from "express"

export function asyncHandler(fn: RequestHandler) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}
```

```ts
import { asyncHandler } from "./utils/asyncHandler"

app.get(
  "/usuarios/:id",
  asyncHandler(async (req, res) => {
    const usuario = await buscarUsuario(req.params.id)
    if (!usuario) throw new AppError(404, "Usuario no encontrado")
    res.json(usuario) // si algo lanza aquí arriba, asyncHandler lo atrapa y lo manda a next()
  })
)
```

## Flujo de un error

| Pieza                            | Rol                                                                  |
| -------------------------------- | -------------------------------------------------------------------- |
| `(err, req, res, next) => {...}` | Firma que Express reconoce como middleware de error                  |
| `app.use(errorHandler)`          | Se registra al final, después de todas las rutas                     |
| `next(error)`                    | Propaga errores de callbacks o trabajo fuera de la promesa retornada |
| `class AppError extends Error`   | Errores con `status` propio, tipados                                 |
| `asyncHandler(fn)`               | Compatibilidad para handlers async en Express 4                      |

## Frontera y exposición segura

- Un error lanzado dentro de un callback asíncrono **sin** pasar por `next(error)` —por ejemplo, dentro de un `setTimeout`— no llega al error handler. Una promesa iniciada sin devolverla, esperarla o capturarla tampoco forma parte del ciclo de la ruta.
- Si `res.headersSent` ya es `true`, delega con `next(error)` para que el manejador predeterminado cierre la conexión; intentar enviar otro JSON provoca un segundo fallo.
- El error handler es el lugar correcto para decidir qué información exponer: un error interno (bug, falla de base de datos) nunca debería devolver su mensaje real al cliente, solo un genérico — ver [Diseño de respuestas de error](/backend/express/express-api-error-responses) para el formato completo.
