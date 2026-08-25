---
title: Primeros pasos con Express
description: Instalar Express, crear una aplicación mínima, ejecutar en desarrollo y comprender el recorrido completo de una request.
category: backend
stack: express
order: 1
tags: [express, node, http, getting-started]
scope: inicio con Express
related:
  - technologies/express
  - guides/node-http-server
  - guides/express-routing-request-response
updatedAt: 2026-08-25
---

Express es una capa de routing y middleware sobre HTTP de Node.js. No reemplaza el runtime: usa sus procesos, módulos, red y modelo asíncrono. Si todavía no reconoces esos conceptos, empieza en [Node.js](/technologies/nodejs).

## Crear el proyecto

```bash
mkdir express-api
cd express-api
npm init -y
npm install express
npm install --save-dev typescript tsx @types/node @types/express
```

```json title="package.json"
{
  "type": "module",
  "scripts": {
    "dev": "tsx watch src/server.ts",
    "start": "node dist/server.js"
  }
}
```

## Aplicación mínima

```ts title="src/app.ts"
import express from 'express';

export const app = express();

app.disable('x-powered-by');
app.use(express.json({ limit: '100kb' }));

app.get('/health', (_request, response) => {
  response.status(200).json({ status: 'ok' });
});
```

```ts title="src/server.ts"
import { app } from './app.js';

const port = Number(process.env.PORT ?? 3000);
app.listen(port, () => console.log(`API disponible en http://localhost:${port}`));
```

Separar `app` de `server` permite importar la aplicación en tests sin abrir un puerto. `express.json()` parsea bodies JSON, pero su límite no sustituye la validación del contenido.

## Probar la ruta

```bash
curl -i http://localhost:3000/health
```

```http
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

{"status":"ok"}
```

## Recorrido de una request

```text
Node acepta la conexión
  → Express evalúa middleware y rutas en orden
  → coincide método + path
  → el handler valida y ejecuta el caso de uso
  → se envía una respuesta
  → un error se delega al middleware final de errores
```

Una ruta que no responde ni llama a `next()` queda pendiente. Una ruta que responde y después intenta responder otra vez provoca errores de headers ya enviados.

## Orden inicial recomendado

1. Routing, parámetros y helpers de request/response.
2. Middleware y orden de ejecución.
3. Validación en la frontera.
4. Errores y logging.
5. Seguridad y CORS.
6. Diseño REST, paginación y contratos de error.
7. Autenticación, bases de datos, librerías y recetas.

## Qué Express no crea por ti

No incluye ORM, validación de esquemas, autenticación, permisos, colas ni arquitectura de carpetas. Esa libertad es útil, pero cada dependencia debe responder a un problema visible. Domina primero `Request`, `Response`, Router y middleware.

