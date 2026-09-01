---
title: API REST mínima con Node puro
description: Un CRUD completo de "tareas" con http.createServer — routing manual, parseo de JSON, sin ningún framework de por medio.
type: recipes
order: 16
tags: [node, http, rest, crud]
problem: Entender qué hace exactamente un framework como Express, armando lo mismo con las piezas nativas de Node primero.
related: [backend/node/node-http-server]
updatedAt: 2026-08-16
---

## Objetivo

Un CRUD de tareas (`GET /tareas`, `GET /tareas/:id`, `POST /tareas`, `PUT /tareas/:id`, `DELETE /tareas/:id`) usando solo `node:http` — sin Express, sin ningún paquete de routing. Sirve para ver exactamente qué problemas resuelve un framework, habiéndolos resuelto una vez a mano.

## Código completo

```ts title="server.ts"
import { createServer, type IncomingMessage, type ServerResponse } from 'node:http';
import { randomUUID } from 'node:crypto';

interface Tarea {
  id: string;
  titulo: string;
  completada: boolean;
}

const tareas: Tarea[] = [];

function leerBody(req: IncomingMessage): Promise<unknown> {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (chunk) => (data += chunk));
    req.on('end', () => resolve(data ? JSON.parse(data) : {}));
    req.on('error', reject);
  });
}

function enviarJSON(res: ServerResponse, status: number, body: unknown) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(body));
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url!, `http://${req.headers.host}`);
  const partes = url.pathname.split('/').filter(Boolean); // '/tareas/123' → ['tareas', '123']

  try {
    // GET /tareas
    if (req.method === 'GET' && partes.length === 1 && partes[0] === 'tareas') {
      return enviarJSON(res, 200, tareas);
    }

    // GET /tareas/:id
    if (req.method === 'GET' && partes.length === 2 && partes[0] === 'tareas') {
      const tarea = tareas.find((t) => t.id === partes[1]);
      if (!tarea) return enviarJSON(res, 404, { error: 'No encontrada' });
      return enviarJSON(res, 200, tarea);
    }

    // POST /tareas
    if (req.method === 'POST' && partes.length === 1 && partes[0] === 'tareas') {
      const body = (await leerBody(req)) as { titulo?: string };
      if (!body.titulo) return enviarJSON(res, 400, { error: 'Falta "titulo"' });

      const nueva: Tarea = { id: randomUUID(), titulo: body.titulo, completada: false };
      tareas.push(nueva);
      return enviarJSON(res, 201, nueva);
    }

    // PUT /tareas/:id
    if (req.method === 'PUT' && partes.length === 2 && partes[0] === 'tareas') {
      const tarea = tareas.find((t) => t.id === partes[1]);
      if (!tarea) return enviarJSON(res, 404, { error: 'No encontrada' });

      const body = (await leerBody(req)) as Partial<Tarea>;
      Object.assign(tarea, body);
      return enviarJSON(res, 200, tarea);
    }

    // DELETE /tareas/:id
    if (req.method === 'DELETE' && partes.length === 2 && partes[0] === 'tareas') {
      const index = tareas.findIndex((t) => t.id === partes[1]);
      if (index === -1) return enviarJSON(res, 404, { error: 'No encontrada' });

      tareas.splice(index, 1);
      res.writeHead(204);
      return res.end();
    }

    enviarJSON(res, 404, { error: 'Ruta no encontrada' });
  } catch {
    enviarJSON(res, 400, { error: 'JSON inválido' });
  }
});

server.listen(3000, () => console.log('http://localhost:3000'));
```

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

- Esto **no** tiene manejo de concurrencia, persistencia real (los datos viven en un array en memoria, se pierden al reiniciar), ni ningún tipo de autenticación — es intencionalmente mínimo, para ver la mecánica pelada.
- Para cualquier proyecto real, la ganancia de usar Express (o similar) frente a este código no es "hace magia" — es exactamente no reescribir este mismo router/parser/error-handler en cada proyecto nuevo.
