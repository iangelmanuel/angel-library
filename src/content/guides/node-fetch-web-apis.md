---
title: Fetch, URL y Web APIs en Node.js
description: Consumir HTTP con fetch, construir URLs seguras, cancelar requests y reconocer APIs web disponibles en Node.
category: backend
stack: node
order: 9
tags: [node, fetch, url, web-apis, http]
scope: Web APIs en Node.js
related:
  - guides/node-http-server
  - guides/node-errores-asincronia
  - guides/backend-resiliencia-dependencias
updatedAt: 2026-08-25
---

Node incorpora varias APIs basadas en estándares web. Compartir `fetch`, `Request`, `Response`, `Headers`, `URL`, `URLSearchParams`, `AbortController`, `FormData` y streams web reduce diferencias entre frontend y backend, aunque el entorno siga sin DOM.

## Consumir JSON correctamente

```ts
const url = new URL('/v1/users', 'https://api.example.com');
url.searchParams.set('role', 'admin');
url.searchParams.set('limit', '20');

const response = await fetch(url, {
  headers: {
    accept: 'application/json',
    authorization: `Bearer ${process.env.API_TOKEN}`,
  },
  signal: AbortSignal.timeout(3_000),
});

if (!response.ok) {
  const detail = await response.text();
  throw new Error(`API ${response.status}: ${detail.slice(0, 200)}`);
}

const users = await response.json();
```

`fetch` solo rechaza por errores de red o cancelación. Un `404` o `500` produce una respuesta normal con `ok === false`; por eso hay que comprobarla.

## `URL` y `URLSearchParams`

```js
const url = new URL('https://example.com/products?sort=price');
url.pathname = '/products/featured';
url.searchParams.append('tag', 'css');
url.searchParams.append('tag', 'javascript');

console.log(url.searchParams.getAll('tag')); // ['css', 'javascript']
console.log(url.toString());
```

Estas APIs codifican espacios y caracteres reservados. Concatenar query strings a mano puede producir URLs inválidas o permitir que un valor altere parámetros vecinos.

## Headers y autenticación

```js
const headers = new Headers({ accept: 'application/json' });
headers.set('content-type', 'application/json');
```

Los nombres de headers no distinguen mayúsculas. `Authorization` transporta credenciales; `Content-Type` describe el body enviado y `Accept` expresa el formato esperado en la respuesta. No envíes un token del servidor al navegador ni lo incluyas en query params, logs o mensajes de error.

## Enviar datos

```ts
await fetch('https://api.example.com/posts', {
  method: 'POST',
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify({ title: 'Event loop' }),
});
```

Para archivos y campos usa `FormData`; deja que `fetch` construya el `Content-Type` con su boundary. Para un cuerpo en streaming, revisa el soporte y requisitos del runtime de destino.

## APIs compartidas, capacidades distintas

Que una API tenga el mismo nombre no significa que todo el entorno sea navegador. Node no tiene `document`, `localStorage`, cámara ni notificaciones. Tampoco conviene depender accidentalmente de extensiones específicas si el código debe correr en edge, navegador y Node.

## Caso de uso reusable

Centraliza base URL, autenticación, timeout, validación y formato de error en un cliente pequeño. No crees un wrapper que oculte por completo `Request`/`Response`: conservar sus conceptos hace más fácil streaming, caché y cancelación.

