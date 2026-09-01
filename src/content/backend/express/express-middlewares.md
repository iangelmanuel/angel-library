---
title: Middlewares en Express — la cadena req → res → next
description: La firma (req, res, next), el orden de ejecución y la diferencia entre middleware propio y de terceros. Aquí se explica el propósito real de next().
type: guides
order: 3
tags: [express, middleware, node]
scope: express middleware
related: [backend/node/node-http-server]
updatedAt: 2026-08-16
---

Express está construido enteramente sobre un concepto: una **cadena** de funciones (middlewares) que reciben la request en orden, y cada una decide si la maneja, la modifica, o se la pasa a la siguiente. Esto es justo lo que el [servidor HTTP nativo de Node](/backend/node/node-http-server) no tiene — ahí `next()` no existe, es un concepto que Express agrega.

## La firma

```ts title="app.ts"
import express from 'express';

const app = express();

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next(); // sin esto, la request se queda colgada aquí para siempre
});

app.get('/usuarios', (req, res) => {
  res.json({ usuarios: [] });
});
```

Cada middleware recibe tres argumentos: `req` (la request, extendida con helpers que Node nativo no tiene — `req.body`, `req.params`, `req.query`, ya parseados), `res` (la response, con `res.json()`, `res.status()`, etc.), y `next` — una función que **hay que llamar** para pasarle el control al siguiente middleware de la cadena. Un handler de ruta (`app.get(...)`) es, en el fondo, el último eslabón de esa misma cadena.

## Orden de ejecución

Los middlewares se ejecutan en el **orden en que se registran** con `app.use()`, no en el orden en que aparecen en el archivo si están en archivos distintos importados en otro orden — el orden real es el de las llamadas a `.use()`/`.get()`/etc., de arriba hacia abajo.

```ts
app.use(middlewareA);   // corre primero
app.use(middlewareB);   // corre segundo, solo si A llamó a next()
app.get('/ruta', handler); // corre último
```

## Middleware global y middleware de ruta

```ts
app.use(loggerGlobal);                          // corre en TODAS las rutas
app.get('/admin', verificarAdmin, handler);      // corre SOLO para esta ruta, antes del handler
app.get('/publico', handler);                     // no pasa por verificarAdmin
```

Pasar varios middlewares antes del handler final (como `verificarAdmin` arriba) es exactamente la misma cadena — cada uno decide si llama a `next()` (sigue) o corta la cadena (por ejemplo, respondiendo `403` sin avanzar).

## Cortar la cadena sin llamar a `next()`

```ts
function verificarAdmin(req, res, next) {
  if (!req.user?.esAdmin) {
    return res.status(403).json({ error: 'No autorizado' }); // corta aquí, nunca llega al handler
  }
  next(); // es admin, seguir
}
```

Si un middleware envía una respuesta (`res.json()`, `res.send()`, etc.) y **también** llama a `next()`, Express sigue ejecutando la cadena sobre una respuesta ya enviada — normalmente un error (`Cannot set headers after they are sent`). La regla es: **o respondes o llamas a `next()`, nunca ambas acciones**.

## Middleware propio vs de terceros

```ts
import express from 'express';
import cors from 'cors';               // de terceros: paquete npm
import { logger } from './middlewares/logger'; // propio: código del proyecto

const app = express();

app.use(express.json());   // viene incluido con Express: parsea el body JSON
app.use(cors());            // de terceros
app.use(logger);            // propio
```

`express.json()` es el reemplazo directo del parseo manual de body que se hacía a mano en [Node puro](/backend/node/node-http-server) — ya viene con Express, no hace falta instalarlo aparte.

## Cadena de consulta

| Concepto | Qué es |
| --- | --- |
| `(req, res, next) => {...}` | La firma de cualquier middleware |
| `next()` | Pasa el control al siguiente eslabón de la cadena |
| `app.use(fn)` | Middleware global, corre en toda request |
| `app.get(ruta, mw1, mw2, handler)` | Middlewares específicos de una ruta, en orden |
| `express.json()` | Parseo de body JSON, incluido con Express |

## Reglas de orden y terminación

- Olvidar `next()` en un middleware que no responde nada deja la request colgada indefinidamente hasta el timeout del cliente — el bug más común al escribir un middleware nuevo.
- El orden de `app.use()` importa de verdad: un middleware de auth registrado *después* de las rutas que debería proteger, no las protege — corre después de que el handler ya respondió.
- Middlewares con **4** argumentos (`err, req, res, next`) son un caso especial: manejo de errores. Ver [Manejo de errores centralizado](/backend/express/express-error-handling).
