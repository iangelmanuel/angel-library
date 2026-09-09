---
title: API protegida (auth + validación + rate limiting)
description: Todas las piezas de seguridad juntas en un mismo endpoint — el ejemplo de referencia de cómo se ve una ruta "bien protegida".
type: recipes
order: 32
tags: [express, security, auth, validation, rate-limiting]
problem: Ver todas las capas de protección combinadas en una sola ruta real, en el orden correcto.
technologies:
  - backend/express/express-auth-middleware
  - backend/express/express-roles-permisos
  - packages/javascript-zod/zod
  - backend/express/express-cors
  - backend/express/express-seguridad
updatedAt: 2026-09-07
---

## Antes de empezar

Esta receta ensambla piezas de una aplicación Express: [autenticación](/backend/express/express-auth-middleware), [roles](/backend/express/express-roles-permisos), [Prisma](/backend/express/express-prisma) y [manejo de errores](/backend/express/express-error-handling). Los imports locales proceden de esas guías; adapta nombres de campos al modelo real. No es una aplicación autónoma lista para publicar.

## El orden de las capas importa

```ts title="routes/admin.routes.ts"
import { Router } from "express"
import rateLimit from "express-rate-limit"
import { z } from "zod"
import { prisma } from "../lib/prisma"
import { requireAuth } from "../middlewares/requireAuth"
import { requireRole } from "../middlewares/requireRole"
import { asyncHandler } from "../utils/asyncHandler"

export const adminRouter = Router()

const limiterEscritura = rateLimit({ windowMs: 15 * 60 * 1000, max: 30 })

const actualizarUsuarioSchema = z.strictObject({
  rol: z.enum(["user", "moderador", "admin"]).optional(),
  activo: z.boolean().optional()
}).refine(data => Object.keys(data).length > 0, "Envía al menos un campo")

adminRouter.patch(
  "/usuarios/:id",
  requireAuth, // 1. ¿quién eres? (401 si no hay token válido)
  requireRole("admin"), // 2. ¿puedes hacer esto? (403 si no eres admin)
  limiterEscritura, // 3. ¿estás abusando de este endpoint? (429 si sí)
  asyncHandler(async (req, res) => {
    const datos = actualizarUsuarioSchema.parse(req.body) // 4. ¿el body tiene forma válida? (400 si no)

    const usuario = await prisma.user.update({
      where: { id: req.params.id },
      data: datos,
      select: { id: true, rol: true, activo: true }
    })

    res.json(usuario)
  })
)
```

## Por qué ese orden específico

```text
límite general    → reduce tráfico antes de autenticación costosa
requireAuth       → verifica identidad; puede consultar base de datos o criptografía
requireRole       → aplica permisos a esa identidad
limiterEscritura  → limita esta operación; aquí usa la IP por defecto
validación        → comprueba parámetros y campos antes de escribir
```

El costo depende de la implementación: autenticarse no siempre es barato. Aplica un límite general antes de autenticación y uno específico para operaciones sensibles. `express.json()` ya habrá parseado el cuerpo si se montó globalmente; el límite de tamaño debe configurarse allí. Para limitar por usuario, configura una clave basada en la identidad verificada y un almacén compartido si hay varias instancias.

## CORS a nivel de la app, no de esta ruta puntual

```ts title="app.ts"
import cors from "cors"
import { adminRouter } from "./routes/admin.routes"

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
  })
)
app.use(helmet())
app.use(express.json({ limit: "1mb" }))

app.use("/admin", adminRouter)
app.use(errorHandler)
```

[CORS](/backend/express/express-cors) y [helmet](/backend/express/express-seguridad) van a nivel de toda la app (una vez), no repetidos por ruta — son protecciones transversales, a diferencia de auth/rol/rate-limit que sí varían según qué tan sensible es cada endpoint puntual.

## Manejar errores de validación

```ts title="middlewares/error-handler.ts"
export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: { code: "VALIDATION_ERROR", fields: err.flatten().fieldErrors }
    })
  }
  if (err instanceof AppError) {
    return res
      .status(err.status)
      .json({ error: { code: err.code, message: err.message } })
  }
  console.error(err)
  res
    .status(500)
    .json({ error: { code: "INTERNAL_ERROR", message: "Error interno" } })
}
```

(`express-rate-limit` responde `429` por sí solo antes de que la request llegue al error handler — no necesita manejo especial ahí.)

## Checklist de una ruta bien protegida

| Capa                      | Protege contra                                       |
| ------------------------- | ---------------------------------------------------- |
| `requireAuth`             | Acceso sin autenticar                                |
| `requireRole` / ownership | Acceso autenticado pero sin permiso suficiente       |
| Rate limiting             | Abuso por volumen, fuerza bruta                      |
| Validación (Zod)          | Datos con forma inesperada o maliciosa               |
| CORS + Helmet (nivel app) | Exposición del lado del navegador, headers faltantes |

## Consideraciones

- Valida también el identificador de la ruta según el modelo (UUID, CUID u otro) y traduce el error de registro inexistente de Prisma a 404. Usa `select` para no devolver hashes de contraseña u otros campos privados.
- `AppError`, `errorHandler`, `helmet`, `express` y `app` pertenecen al ensamblado de las guías previas; los bloques de esta receta muestran los cambios relevantes, no repiten esos archivos completos.
- Si la sesión viaja en cookies, añade protección CSRF a las operaciones de escritura. CORS no autentica ni reemplaza la comprobación de origen/token CSRF.

## Comprobación

Comprueba 401 sin sesión, 403 con rol insuficiente, 400 con cuerpo vacío o campos extra, 404 con id inexistente y 429 al superar el límite. En la respuesta correcta solo deben aparecer `id`, `rol` y `activo`. Una operación rechazada no debe modificar la base de datos.

- No todas las rutas necesitan las cinco capas — un endpoint público de solo lectura (`GET /posts`) no necesita `requireAuth`; el nivel de protección depende de qué tan sensible es cada operación puntual.
- Esta receta combina piezas ya documentadas por separado — para el detalle de cada una (por qué ese orden de middlewares, cómo funciona cada pieza), ver sus guías individuales enlazadas en `technologies` arriba.
