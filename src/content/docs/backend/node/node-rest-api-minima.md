---
title: API REST mínima con Node puro
description: Un CRUD completo de "tareas" con http.createServer — routing manual, parseo de JSON, sin ningún framework de por medio.
tags: [node, http, rest, crud]
sidebar:
  order: 16
draft: false
technologies: [backend/node/node-http-server]
problem: Entender qué hace exactamente un framework como Express, armando lo mismo con las piezas nativas de Node primero.
updatedAt: 2026-09-07
---

## Objetivo

Un CRUD de tareas (`GET /tareas`, `GET /tareas/:id`, `POST /tareas`, `PUT /tareas/:id`, `DELETE /tareas/:id`) usando solo `node:http` — sin Express, sin ningún paquete de routing. Sirve para ver exactamente qué problemas resuelve un framework, habiéndolos resuelto una vez a mano.

## Antes de empezar

Necesitas Node.js 22.12 o posterior y conocer [promesas](/languages/javascript/javascript-async-promises). Guarda el bloque en `server.ts`, en una carpeta de práctica con `package.json` que declare `"type": "module"`. Instala `tsx` con `pnpm add -D tsx` y ejecuta `pnpm exec tsx server.ts`. `tsx` ejecuta TypeScript; no comprueba sus tipos.

Los datos viven en memoria. `POST` crea una tarea; `PUT` reemplaza sus campos editables y exige ambos. El identificador lo decide el servidor.

## Código completo

```ts title="server.ts"
import { randomUUID } from "node:crypto"
import {
  type IncomingMessage,
  type ServerResponse,
  createServer
} from "node:http"

interface Tarea {
  id: string
  titulo: string
  completada: boolean
}

const tareas: Tarea[] = []

class HttpError extends Error {
  constructor(public status: number, message: string) {
    super(message)
  }
}

function leerBody(req: IncomingMessage): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = []
    let bytes = 0
    req.on("data", (chunk: Buffer) => {
      bytes += chunk.length
      if (bytes > 16 * 1024) {
        chunks.length = 0
        reject(new HttpError(413, "Cuerpo demasiado grande"))
        return // Drenar sin seguir acumulando datos.
      }
      chunks.push(chunk)
    })
    req.on("end", () => {
      if (bytes > 16 * 1024) return
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString("utf8")))
      } catch {
        reject(new HttpError(400, "JSON inválido"))
      }
    })
    req.on("aborted", () => reject(new HttpError(400, "Solicitud interrumpida")))
    req.on("error", reject)
  })
}

function enviarJSON(res: ServerResponse, status: number, body: unknown) {
  res.writeHead(status, { "Content-Type": "application/json" })
  res.end(JSON.stringify(body))
}

function validarTarea(body: unknown, reemplazo = false) {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    throw new HttpError(400, "Se esperaba un objeto JSON")
  }
  const data = body as Record<string, unknown>
  const campos = reemplazo ? ["titulo", "completada"] : ["titulo"]
  if (Object.keys(data).some(key => !campos.includes(key))) {
    throw new HttpError(400, "Hay campos no permitidos")
  }
  if (typeof data.titulo !== "string" || !data.titulo.trim() || data.titulo.length > 200) {
    throw new HttpError(400, "titulo debe ser texto de 1 a 200 caracteres")
  }
  if (reemplazo && typeof data.completada !== "boolean") {
    throw new HttpError(400, "completada debe ser un booleano")
  }
  return { titulo: data.titulo.trim(), completada: reemplazo ? data.completada as boolean : false }
}

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url ?? "/", "http://localhost")
    const partes = url.pathname.split("/").filter(Boolean)
    if (["POST", "PUT"].includes(req.method ?? "")) {
      const tipo = req.headers["content-type"]?.split(";")[0].trim().toLowerCase()
      if (tipo !== "application/json") throw new HttpError(415, "Usa application/json")
    }
    // GET /tareas
    if (req.method === "GET" && partes.length === 1 && partes[0] === "tareas") {
      return enviarJSON(res, 200, tareas)
    }

    // GET /tareas/:id
    if (req.method === "GET" && partes.length === 2 && partes[0] === "tareas") {
      const tarea = tareas.find((t) => t.id === partes[1])
      if (!tarea) return enviarJSON(res, 404, { error: "No encontrada" })
      return enviarJSON(res, 200, tarea)
    }

    // POST /tareas
    if (
      req.method === "POST" &&
      partes.length === 1 &&
      partes[0] === "tareas"
    ) {
      const body = validarTarea(await leerBody(req))

      const nueva: Tarea = {
        id: randomUUID(),
        titulo: body.titulo,
        completada: false
      }
      tareas.push(nueva)
      return enviarJSON(res, 201, nueva)
    }

    // PUT /tareas/:id
    if (req.method === "PUT" && partes.length === 2 && partes[0] === "tareas") {
      const tarea = tareas.find((t) => t.id === partes[1])
      if (!tarea) return enviarJSON(res, 404, { error: "No encontrada" })

      const body = validarTarea(await leerBody(req), true)
      tarea.titulo = body.titulo
      tarea.completada = body.completada
      return enviarJSON(res, 200, tarea)
    }

    // DELETE /tareas/:id
    if (
      req.method === "DELETE" &&
      partes.length === 2 &&
      partes[0] === "tareas"
    ) {
      const index = tareas.findIndex((t) => t.id === partes[1])
      if (index === -1) return enviarJSON(res, 404, { error: "No encontrada" })

      tareas.splice(index, 1)
      res.writeHead(204)
      return res.end()
    }

    enviarJSON(res, 404, { error: "Ruta no encontrada" })
  } catch (error) {
    if (res.destroyed || res.writableEnded) return
    if (error instanceof HttpError) {
      return enviarJSON(res, error.status, { error: error.message })
    }
    console.error(error)
    enviarJSON(res, 500, { error: "Error interno" })
  }
})

server.requestTimeout = 10_000
server.listen(3000, "127.0.0.1", () => console.log("http://127.0.0.1:3000"))
```

## Comprobación

Con el servidor activo, abre otra terminal, ejecuta `node` y pega:

```js
const base = "http://127.0.0.1:3000/tareas"
const response = await fetch(base, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ titulo: "Aprender HTTP" })
})
console.log(response.status) // 201
const tarea = await response.json()
console.log(tarea.titulo, tarea.completada) // Aprender HTTP false
console.log((await fetch(`${base}/${tarea.id}`, { method: "DELETE" })).status) // 204
console.log((await fetch(`${base}/${tarea.id}`)).status) // 404
```

Comprueba también `POST` con `{` (400 sin caída del proceso), `null` (400), un título numérico (400), un cuerpo mayor que 16 KiB (413) y un tipo de contenido incorrecto (415). Un `PUT` debe exigir `titulo` y `completada`; enviar `id` debe rechazarse sin modificar la tarea.

El `try/catch` de `JSON.parse` vive dentro del evento `end`: un error lanzado en un callback posterior no rechaza automáticamente la promesa que lo registró. Acumular bytes y decodificar al final también conserva caracteres UTF-8 divididos entre fragmentos.

## Qué resolvió esto a mano

- Parseo de `req.url` en `pathname` + partes de la ruta.
- Parseo del body como JSON, con manejo de error si no es JSON válido.
- Un helper (`enviarJSON`) para no repetir `writeHead` + `JSON.stringify` en cada rama.
- Una cadena de `if` como "router" — comparando método + forma de la ruta.

## Lo que un framework agrega encima de esto

- **Router real**: `app.get('/tareas/:id', handler)` en vez de parsear `partes[1]` a mano — con params nombrados, no por posición.
- **Middlewares**: parseo de body, CORS, auth, logging — como piezas reutilizables en vez de código repetido en cada handler (ver [Middlewares en Express](/backend/express/express-middlewares)).
- **Manejo de errores centralizado**: un solo lugar que atrapa errores de cualquier ruta, en vez de un `try/catch` por handler.
- **Validación declarativa**: en vez de `if (!body.titulo)` a mano por cada campo, algo como Zod o express-validator describe la forma esperada una vez.

## Consideraciones

- Atiende solicitudes concurrentes, pero no ofrece transacciones, persistencia, paginación ni autenticación. Los datos se pierden al reiniciar. Los métodos no implementados responden 404 en este router didáctico; una API más completa distingue 405 y anuncia los métodos con `Allow`.
- Para cualquier proyecto real, la ganancia de usar Express (o similar) frente a este código no es "hace magia" — es exactamente no reescribir este mismo router/parser/error-handler en cada proyecto nuevo.

## Fuentes

- [Node.js: HTTP](https://nodejs.org/api/http.html)
- [MDN: PUT y reemplazo de recursos](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Methods/PUT)
