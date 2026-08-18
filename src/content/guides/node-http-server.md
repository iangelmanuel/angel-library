---
title: Servidor HTTP nativo
description: http.createServer(req, res) sin ningún framework — qué resuelve por tú Node y por qué frameworks como Express existen encima de esto.
category: backend
stack: node
order: 4
tags: [node, http, server]
scope: node:http
related: [recipes/node-rest-api-minima]
updatedAt: 2026-08-16
---

El módulo `http` de Node es la base sobre la que está construido Express (y prácticamente cualquier framework backend de Node) — entenderlo ayuda a entender qué es exactamente lo que un framework agrega encima.

## Un servidor mínimo

```ts title="server.ts"
import { createServer } from 'node:http';

const server = createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hola mundo');
});

server.listen(3000, () => {
  console.log('Escuchando en http://localhost:3000');
});
```

`createServer` recibe una función que Node llama por **cada** request entrante, con dos objetos: `req` (la request: método, URL, headers, body) y `res` (la respuesta: lo que se manda de vuelta).

## `req`: leer la request

```ts
const server = createServer((req, res) => {
  console.log(req.method);  // 'GET', 'POST', etc.
  console.log(req.url);      // '/usuarios?activo=true' (ruta + query string, sin parsear)
  console.log(req.headers);  // objeto con todos los headers

  res.end('ok');
});
```

`req.url` viene como string crudo — Node no lo parsea en partes (ruta vs query string) por tú:

```ts
import { createServer } from 'node:http';

const server = createServer((req, res) => {
  const url = new URL(req.url!, `http://${req.headers.host}`);
  console.log(url.pathname);           // '/usuarios'
  console.log(url.searchParams.get('activo')); // 'true'

  res.end('ok');
});
```

## Leer el body (POST/PUT)

A diferencia de `req`, el body **no** llega ya armado — `req` es en realidad un stream, y hay que juntarlo a mano:

```ts
function leerBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (chunk) => (data += chunk));
    req.on('end', () => resolve(data));
    req.on('error', reject);
  });
}

const server = createServer(async (req, res) => {
  if (req.method === 'POST') {
    const body = await leerBody(req);
    const json = JSON.parse(body);
    res.end(JSON.stringify({ recibido: json }));
  }
});
```

Esto — parsear el body automáticamente, dar `req.body` ya listo — es exactamente una de las cosas que un framework como Express resuelve por tú con un middleware, en vez de escribir esta función en cada proyecto.

## `res`: mandar la respuesta

```ts
res.writeHead(200, { 'Content-Type': 'application/json' });
res.end(JSON.stringify({ ok: true }));

// Atajo equivalente para JSON:
res.setHeader('Content-Type', 'application/json');
res.statusCode = 200;
res.end(JSON.stringify({ ok: true }));
```

`res.end()` es obligatorio — sin llamarlo, la respuesta nunca se envía y la request queda colgada hasta el timeout.

## Enrutamiento manual

Node no tiene concepto de "rutas" — cada request pasa por la misma función, y el ruteo es simplemente comparar `req.method`/`url.pathname` a mano:

```ts
const server = createServer((req, res) => {
  const url = new URL(req.url!, `http://${req.headers.host}`);

  if (req.method === 'GET' && url.pathname === '/usuarios') {
    res.end('lista de usuarios');
  } else if (req.method === 'POST' && url.pathname === '/usuarios') {
    res.end('usuario creado');
  } else {
    res.writeHead(404);
    res.end('No encontrado');
  }
});
```

Esto escala mal rápido (imaginate 30 rutas como una cadena de `if`) — es exactamente el problema que un router de framework resuelve. Ver la receta [API REST mínima con Node puro](/recipes/node-rest-api-minima) para una versión un poco más organizada, todavía sin framework.

## Resumen

| API | Qué es |
| --- | --- |
| `createServer((req, res) => {...})` | Crea el servidor, una función por cada request |
| `req.method` / `req.url` | Método y ruta+query cruda (sin parsear) |
| `new URL(req.url, base)` | Parsea `req.url` en `pathname` + `searchParams` |
| `req.on('data'/'end')` | El body llega como stream, hay que juntarlo a mano |
| `res.writeHead(status, headers)` / `res.end(body)` | Mandar la respuesta |

## Consideraciones

- Esto **no tiene** `next()` — ese concepto (una cadena de funciones middleware que se pasan el control entre sí) no existe en el `http` nativo, lo agregan frameworks como Express. Ver [Middlewares en Express](/guides/express-middlewares).
- Node nativo no parsea query strings, no parsea el body, no tiene router, no tiene manejo de errores centralizado — todo eso es exactamente el trabajo que hace un framework. Entender esto ayuda a entender qué gana realmente un proyecto al agregar Express (o cualquier otro) en vez de "es una capa random encima".
