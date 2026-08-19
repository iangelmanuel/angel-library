---
title: Express
description: Framework HTTP minimalista para Node.js basado en routing y middlewares, con una arquitectura explícita para APIs y servicios web.
category: backend
stack: express
order: 1
tags: [express, node, backend, http, middleware]
website: https://expressjs.com
github: https://github.com/expressjs/express
related:
  - technologies/nodejs
  - guides/express-middlewares
  - guides/backend-api-design
updatedAt: 2026-08-19
---

Express proporciona una capa pequeña sobre el servidor HTTP de Node.js. Su núcleo conecta **rutas** y **middlewares**: funciones que reciben solicitud, respuesta y una continuación. La flexibilidad permite adaptar la arquitectura, pero obliga a decidir validación, errores, seguridad y estructura.

```ts
import express from 'express';

const app = express();
app.use(express.json({ limit: '100kb' }));

app.get('/health', (_request, response) => {
  response.json({ status: 'ok' });
});

app.listen(3000);
```

## Modelo mental

```text
solicitud → middleware global → router → validación → caso de uso
          → adaptador de datos → respuesta / middleware de error
```

Un middleware puede observar, transformar o terminar la respuesta. Si ni responde ni llama a `next()`, la solicitud queda pendiente.

## Cuándo encaja

- APIs HTTP donde se desea controlar estructura y dependencias.
- Backends pequeños o medianos con middleware del ecosistema.
- Servicios que necesitan integrarse con librerías Node sin una abstracción completa.

Puede no ser la opción ideal si el equipo necesita convenciones rígidas, generación automática o una plataforma con renderizado frontend integrado. En ese caso compara el costo de ensamblar piezas, no solo la cantidad de código inicial.

## Responsabilidades que Express no resuelve solo

- validación y serialización de contratos;
- autenticación y autorización;
- acceso a datos y transacciones;
- jobs, caché y almacenamiento de archivos;
- logging estructurado, métricas y trazas;
- cierre ordenado y despliegue.

## Referencias

- [Express: documentación](https://expressjs.com/en/guide/routing.html)
- [Express: uso de middleware](https://expressjs.com/en/guide/using-middleware.html)
