---
title: Auth completa (registro + login + JWT + cookies)
description: Laboratorio de registro y login con bcrypt, JWT y cookie HttpOnly sobre una aplicación Express y Prisma ya preparada.
type: recipes
sidebar:
  order: 24
tags: [express, auth, jwt, bcrypt, cookies]
problem: Armar autenticación manual completa, sin ninguna librería de auth managed, entendiendo cada pieza.
technologies:
  - backend/express/express-jwt
  - packages/node-bcrypt/bcrypt
  - backend/express/express-cookies-sesiones
  - backend/express/express-auth-middleware
updatedAt: 2026-09-07
---

## Piezas que se combinan

Esta receta junta [JWT](/backend/express/express-jwt), [bcrypt](/packages/node-bcrypt/bcrypt), [cookies httpOnly](/backend/express/express-cookies-sesiones) y el [middleware de auth](/backend/express/express-auth-middleware) en un flujo completo — cada pieza por separado ya está documentada a fondo en su propia guía; aquí solo el ensamblado.

## Setup

Requiere Express, el cliente Prisma de [esta guía](/backend/express/express-prisma), un modelo `User` con `email` único, `nombre`, `passwordHash` y `rol`, y el [middleware de autenticación](/backend/express/express-auth-middleware). Monta `cookieParser()`, `express.json({ limit: "16kb" })` y el router en ese orden. Los bloques del router son consecutivos; el middleware de errores va al final de la aplicación.

```bash
pnpm add express jsonwebtoken bcrypt cookie-parser zod
npm install --save-dev @types/jsonwebtoken @types/bcrypt @types/cookie-parser
```

## Registro

```ts title="routes/auth.routes.ts"
import bcrypt from "bcrypt"
import { z } from "zod"
import { Router } from "express"
import { prisma } from "../lib/prisma"

export const authRouter = Router()

const jwtSecret = process.env.JWT_SECRET
if (!jwtSecret) throw new Error("Configura JWT_SECRET en el entorno del servidor")
const credenciales = z.object({
  email: z.email(),
  password: z.string().min(8).refine(value => Buffer.byteLength(value, "utf8") <= 72,
    "La contraseña supera el límite de bytes de bcrypt")
})
const registro = credenciales.extend({ nombre: z.string().trim().min(1).max(100) })

authRouter.post("/registro", async (req, res, next) => {
  try {
    const parsed = registro.safeParse(req.body)
    if (!parsed.success) return res.status(400).json({ error: { code: "VALIDATION_ERROR", message: "Datos inválidos" } })
    const { email, password, nombre } = parsed.data

    const existente = await prisma.user.findUnique({ where: { email } })
    if (existente) {
      return res.status(409).json({
        error: {
          code: "EMAIL_YA_REGISTRADO",
          message: "Ese email ya está en uso"
        }
      })
    }

    const passwordHash = await bcrypt.hash(password, 10)
    const usuario = await prisma.user.create({
      data: { email, passwordHash, nombre, rol: "user" }
    })

    res.status(201).json({ id: usuario.id, email: usuario.email })
  } catch (err) {
    next(err)
  }
})
```

## Login: verificar y firmar el JWT

```ts
import jwt from "jsonwebtoken"

authRouter.post("/login", async (req, res, next) => {
  try {
    const parsed = credenciales.safeParse(req.body)
    if (!parsed.success) return res.status(400).json({ error: { code: "VALIDATION_ERROR", message: "Datos inválidos" } })
    const { email, password } = parsed.data

    const usuario = await prisma.user.findUnique({ where: { email } })
    const passwordValida =
      usuario && (await bcrypt.compare(password, usuario.passwordHash))

    if (!usuario || !passwordValida) {
      return res.status(401).json({
        error: {
          code: "CREDENCIALES_INVALIDAS",
          message: "Email o contraseña incorrectos"
        }
      })
    }

    const token = jwt.sign(
      { sub: usuario.id, rol: usuario.rol },
      jwtSecret,
      { expiresIn: "1h" }
    )

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 1000
    })

    res.json({ id: usuario.id, email: usuario.email })
  } catch (err) {
    next(err)
  }
})
```

## Logout

```ts
authRouter.post("/logout", (req, res) => {
  res.clearCookie("token")
  res.status(204).end()
})
```

## Ruta protegida de prueba

```ts title="app.ts"
import cookieParser from "cookie-parser"
import { requireAuth } from "./middlewares/requireAuth"
import { authRouter } from "./routes/auth.routes"

app.use(cookieParser())
app.use(express.json())
app.use("/auth", authRouter)

app.get("/perfil", requireAuth, (req, res) => {
  res.json({ userId: req.user!.id, rol: req.user!.rol })
})
```

## Consideraciones

- `secure: process.env.NODE_ENV === 'production'` — en desarrollo local sin HTTPS, `secure: true` haría que el navegador nunca mande la cookie de vuelta.
- La unicidad se garantiza en la base: dos registros simultáneos pueden pasar `findUnique`. Traduce el conflicto de la restricción única a 409 sin exponer el error interno.
- Borrar la cookie no revoca una copia del JWT. Si necesitas revocación inmediata, registra sesiones o versiones de sesión en servidor y compruébalas. No uses esta receta como sistema terminado de identidad.
- Añade límites de intentos y protección CSRF para escrituras autenticadas por cookie. `SameSite` reduce riesgos, pero no sustituye la política de protección de la aplicación.
- La recuperación de contraseña necesita tokens de un solo uso y revocación comprobable. Firmar un JWT con expiración no lo convierte en un token de un solo uso. Consulta [autenticación y recuperación](/security/security-aplicacion/security-auth-access-control).

## Comprobación

Registra un usuario ficticio: 201 sin `passwordHash` en la respuesta. Envía campos inválidos: 400; email duplicado: 409; contraseña incorrecta: 401. Inicia sesión y comprueba `/perfil`, luego cierra sesión y repite sin cookie: 401. Prueba registros simultáneos y verifica que solo quede una fila.
