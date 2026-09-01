---
title: Backend en Next.js — mapa y arquitectura
description: Ruta backend del App Router para elegir Route Handlers, Server Actions, Proxy, cookies y capas de dominio al aprender o consultar.
type: guides
order: 1
tags: [nextjs, architecture, server, backend]
scope: arquitectura backend en Next.js
related:
  - backend/nextjs/nextjs-api-rest
  - backend/nextjs/nextjs-cookies-headers
  - backend/nextjs/nextjs-instrumentation
  - frontend/nextjs/nextjs-endpoints
  - frontend/nextjs/nextjs-server-actions
  - frontend/nextjs/nextjs-proxy
updatedAt: 2026-08-25
---

El App Router puede renderizar UI y ejecutar lógica de servidor. Sus dos fronteras de mutación principales son los **Route Handlers**, que exponen HTTP, y las **Server Actions**, que conectan formularios o componentes de la propia aplicación con funciones de servidor.

```text
consumidor externo / webhook → Route Handler
UI del mismo proyecto        → Server Action
lectura durante render       → Server Component o capa de datos directa
filtro previo de rutas       → Proxy
inicio y telemetría          → instrumentation.ts
```

## Dos formas de recorrer la documentación

### Quiero aprender desde cero

Primero domina Server Components, routing, fetching y caché en la ruta Frontend de Next.js. Después sigue:

1. este mapa y sus fronteras;
2. [API REST con Route Handlers](/backend/nextjs/nextjs-api-rest);
3. [cookies, headers y request](/backend/nextjs/nextjs-cookies-headers);
4. [instrumentación](/backend/nextjs/nextjs-instrumentation);
5. autenticación y acceso a datos;
6. recetas completas al final.

Para cada ejemplo pregunta: ¿quién consume esta operación?, ¿qué dato es externo?, ¿qué permiso se comprueba?, ¿qué runtime la ejecuta? y ¿qué parte puede cachearse?

### Ya uso Next.js y quiero recordar

| Necesito | Documento |
| --- | --- |
| endpoint, webhook o API pública | [API REST](/backend/nextjs/nextjs-api-rest) |
| sintaxis y métodos de `route.ts` | [Route Handlers](/frontend/nextjs/nextjs-endpoints) |
| formulario o mutación de la propia UI | [Server Actions](/frontend/nextjs/nextjs-server-actions) |
| leer/escribir cookies o inspeccionar headers | [Request APIs](/backend/nextjs/nextjs-cookies-headers) |
| redirects o filtro temprano por ruta | [Proxy](/frontend/nextjs/nextjs-proxy) |
| inicializar SDK y capturar errores globales | [Instrumentation](/backend/nextjs/nextjs-instrumentation) |
| autenticación | [Auth.js](/backend/nextjs/nextjs-auth-js) o [Better Auth](/backend/nextjs/nextjs-better-auth) |
| persistencia | [Prisma](/backend/nextjs/nextjs-prisma) o [Supabase](/backend/nextjs/nextjs-supabase) |

## Route Handler, Action o lectura directa

```text
¿la operación solo obtiene datos para un Server Component?
  → llama a la capa de datos; no hagas fetch a tu propia API

¿la UI propia envía una mutación?
  → Server Action

¿un cliente externo necesita HTTP?
  → Route Handler
```

Hacer `fetch('/api/...')` desde un Server Component hacia el mismo proyecto agrega serialización y otra frontera HTTP sin necesidad. Extrae una función server-only y compártela entre el componente y el Route Handler cuando ambos necesiten el mismo caso de uso.

## Estructura por capacidad

```text
src/
├── proxy.ts
├── instrumentation.ts
├── app/api/posts/
│   ├── route.ts
│   └── [id]/route.ts
├── actions/posts.ts
├── modules/posts/
│   ├── posts.schema.ts
│   ├── posts.service.ts
│   └── posts.repository.ts
└── libs/
    ├── auth.ts
    └── db.ts
```

Route Handlers y Actions adaptan entradas. Los casos de uso reciben valores validados e identidad explícita. El repository encapsula persistencia. No toda función merece tres capas, pero el dominio no debería depender de `NextRequest`, `FormData` o `NextResponse`.

```ts title="src/app/api/posts/route.ts"
import { NextResponse } from 'next/server';
import { listPosts } from '@/modules/posts/posts.service';
import { requireUser } from '@/libs/auth';

export async function GET(request: Request) {
  const actor = await requireUser();
  const cursor = new URL(request.url).searchParams.get('cursor');
  const result = await listPosts({ actor, cursor });
  return NextResponse.json(result);
}
```

## Autenticación y autorización

Proxy puede redirigir o descartar tráfico temprano, pero no sustituye la autorización en la operación. Una Action y un Route Handler deben volver a obtener la sesión y comprobar ownership, tenant o permiso del recurso.

No confíes en que una función marcada `'use server'` sea privada. El cliente puede invocar su endpoint generado; trátala como una frontera pública autenticable.

## Runtime, caché y streaming

El runtime predeterminado de servidor es Node.js. Edge tiene un conjunto distinto de APIs y compatibilidad de dependencias; úsalo cuando la latencia y la plataforma lo justifiquen, no como optimización automática.

Los Route Handlers `GET` son dinámicos por defecto en el modelo actual. Aplica caché de manera explícita según el contrato. Cookies y headers dependen de la request; no deben leerse dentro de un scope de caché compartido. Además, una cookie no puede escribirse después de iniciar streaming.

## Operación segura

- valida body, params, query y headers en la frontera;
- limita tamaño y duración de operaciones;
- usa idempotencia para pagos o creaciones reintentables;
- evita filtrar variables server-only al bundle cliente;
- registra request id, latencia y error sanitizado;
- diseña conexiones y SDKs para entornos con varias instancias.

## Señal de una buena separación

El mismo caso de uso puede ser llamado por Action, Route Handler o job sin simular objetos de Next.js. El framework organiza entrega y render; las reglas de negocio conservan entradas pequeñas y explícitas.
