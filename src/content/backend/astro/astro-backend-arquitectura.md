---
title: Backend en Astro — mapa y arquitectura
description: Ruta backend de Astro para aprender cuándo usar endpoints, Actions, middleware, sesiones y render on-demand o consultar cada pieza rápidamente.
type: guides
order: 1
tags: [astro, architecture, server, backend]
scope: arquitectura backend en Astro
related:
  - backend/astro/astro-api-rest
  - backend/astro/astro-ssr-adapters
  - backend/astro/astro-sessions
  - frontend/astro/astro-endpoints
  - frontend/astro/astro-middleware
  - frontend/astro/astro-server-actions
updatedAt: 2026-08-25
---

Astro puede actuar como frontend y como capa backend del mismo producto. La pregunta principal no es “¿Astro soporta servidor?”, sino qué rutas necesitan ejecución durante una request y qué superficie comunica mejor la intención.

```text
contenido público estable → prerender durante build
request HTTP pública      → endpoint con Request/Response
mutación desde la UI      → Action tipada
contexto transversal      → middleware + locals
estado entre requests     → session/cookie + almacenamiento
```

## Dos formas de usar esta ruta

### Quiero aprender desde cero

Antes debes reconocer routing, componentes y render estático en la ruta Frontend de Astro. Después sigue este orden:

1. esta arquitectura y la frontera frontend/backend;
2. [API REST con endpoints](/backend/astro/astro-api-rest);
3. [render on-demand y adapters](/backend/astro/astro-ssr-adapters);
4. [sessions](/backend/astro/astro-sessions);
5. autenticación y base de datos;
6. recetas completas cuando puedas explicar cada pieza.

En cada ejemplo identifica qué ocurre en build, qué ocurre por request y qué código podría llegar al navegador. Un secreto solo puede usarse en contexto server-side.

### Ya uso Astro y quiero recordar

| Necesito                                  | Documento                                                                                 |
| ----------------------------------------- | ----------------------------------------------------------------------------------------- |
| endpoint público, webhook o cliente móvil | [API REST](/backend/astro/astro-api-rest)                                                 |
| sintaxis de `APIRoute`, params y Response | [Endpoints](/frontend/astro/astro-endpoints)                                              |
| formulario o mutación interna tipada      | [Actions](/frontend/astro/astro-server-actions)                                           |
| auth, redirects o datos por request       | [Middleware](/frontend/astro/astro-middleware)                                            |
| escoger SSG, SSR y adapter                | [On-demand y adapters](/backend/astro/astro-ssr-adapters)                                 |
| conservar carrito, flash o sesión         | [Sessions](/backend/astro/astro-sessions)                                                 |
| autenticación administrada                | [Better Auth](/backend/astro/astro-better-auth) o [Auth.js](/backend/astro/astro-auth-js) |
| acceso a datos                            | [Prisma](/backend/astro/astro-prisma) o [Supabase](/backend/astro/astro-supabase)         |

## Elegir Endpoint o Action

Un endpoint es un contrato HTTP visible. Úsalo para webhooks, API pública, aplicación móvil, otro servicio o descargas. Recibe `Request` y devuelve `Response`.

Una Action es una función de servidor tipada para la UI Astro. Reduce el código repetido de endpoint + `fetch`, integra validación y devuelve un resultado seguro. No es el contrato apropiado para un consumidor externo.

```text
¿el consumidor controla tu UI Astro?
  sí → Action, salvo que necesites un contrato HTTP explícito
  no → endpoint
```

Ambos son fronteras no confiables: autentica, autoriza, valida y limita en el servidor.

## Estructura por capacidades

```text
src/
├── middleware.ts
├── actions/
│   └── posts.ts
├── pages/api/
│   └── posts/[id].ts
├── modules/posts/
│   ├── posts.schema.ts
│   ├── posts.service.ts
│   └── posts.repository.ts
└── libs/
    ├── auth.ts
    └── db.ts
```

El endpoint o Action adapta el transporte. El service expresa el caso de uso. El repository encapsula persistencia. En una operación simple no hace falta crear todas las capas; extráelas cuando una regla se reutiliza, necesita tests aislados o coordina varias dependencias.

```ts title="src/pages/api/posts.ts"
import type { APIRoute } from "astro"
import { listPosts } from "../../modules/posts/posts.service"

export const GET: APIRoute = async ({ url, locals }) => {
  const result = await listPosts({
    actor: locals.user,
    cursor: url.searchParams.get("cursor")
  })

  return Response.json(result)
}
```

No pases todo el contexto Astro al dominio. Entrega valores concretos para que el caso de uso también pueda ejecutarse desde una prueba o un job.

## Middleware y `locals`

El middleware corre antes y después de la siguiente capa. Es apropiado para correlación, sesión, redirects y contexto transversal. `locals` transporta datos de esa request, no un store global.

```ts title="src/middleware.ts"
import { defineMiddleware } from "astro:middleware"

export const onRequest = defineMiddleware(async (context, next) => {
  context.locals.requestId = crypto.randomUUID()
  context.locals.user = await readSession(context.request.headers)
  return next()
})
```

No asumas que poblar `locals.user` autoriza toda operación. Cada endpoint o Action sensible debe comprobar permiso sobre el recurso específico.

## Render y despliegue

Astro prerenderiza por defecto. Una ruta que depende de cookies, sesión o datos por request necesita render on-demand y un adapter. Puedes conservar `output: 'static'` y marcar rutas con `prerender = false`, o usar `output: 'server'` y prerenderizar excepciones.

El adapter define el runtime real. Node, serverless y edge difieren en filesystem, duración, conexiones y APIs disponibles. Diseña contra las capacidades del destino, no solo contra el servidor local.

## Seguridad mínima

- Los valores de `PUBLIC_*` pueden llegar al cliente; los secretos no usan ese prefijo.
- Un sitio del mismo origen normalmente no necesita CORS, pero sí autenticación, autorización y protección CSRF cuando usa cookies.
- Limita JSON y archivos, valida firmas de webhooks sobre el cuerpo requerido y usa timeouts para proveedores.
- No confíes en datos del cliente para precio, rol, tenant o propietario.

## Señal de que la arquitectura funciona

Puedes cambiar un endpoint por una Action, o invocar el mismo caso de uso desde un job, sin reescribir reglas de negocio. La capa HTTP conoce Astro; el núcleo conoce datos validados y dependencias explícitas.
