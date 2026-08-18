---
title: Endpoints (API routes)
description: Archivos en src/pages que responden JSON u otro contenido en vez de HTML — GET/POST, rutas dinámicas y modo on-demand.
category: frontend
stack: astro
order: 15
tags: [astro, api, backend]
scope: astro:pages
updatedAt: 2026-08-16
---

Un endpoint es un archivo `.ts`/`.js` dentro de `src/pages` que, en vez de exportar un componente `.astro` que renderiza HTML, exporta funciones con nombre de método HTTP (`GET`, `POST`...) que devuelven una `Response`. Astro lo trata como una ruta más: convive con páginas normales en la misma carpeta, solo que responde JSON, XML, una imagen o cualquier otro contenido en vez de HTML. Este mismo sitio usa uno para `/search-index.json` (ver `src/pages/search-index.json.ts`), que arma el índice de búsqueda que consume el Command Palette.

## Endpoint básico

El nombre del archivo (menos `.ts`/`.js`) es la extensión de la URL: `data.json.ts` → `/data.json`.

```ts title="pages/data.json.ts"
import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  return new Response(JSON.stringify({ ok: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
};
```

## El contexto: params, request, url

```ts title="pages/api/[id].json.ts"
import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ params, request, url }) => {
  const id = params.id;
  const query = url.searchParams.get('filtro');
  return new Response(JSON.stringify({ id, query }));
};
```

## POST y otros métodos

Cada método HTTP es su propio export nombrado. Astro resuelve `HEAD` automáticamente a partir de `GET`.

```ts
export const POST: APIRoute = async ({ request }) => {
  const body = await request.json();
  return new Response(JSON.stringify({ recibido: body }), { status: 201 });
};

export const DELETE: APIRoute = async ({ params }) => {
  return new Response(null, { status: 204 });
};
```

## Endpoints dinámicos y estáticos

Igual que las páginas, una ruta dinámica (`[id].json.ts`) en modo estático necesita `getStaticPaths()` para saber qué archivos generar en build.

```ts title="pages/api/[id].json.ts"
export function getStaticPaths() {
  return [{ params: { id: '1' } }, { params: { id: '2' } }];
}
```

## Modo on-demand (SSR)

Con `output: 'server'` en `astro.config.mjs`, o con `export const prerender = false` en el archivo aunque el proyecto siga en `output: 'static'`, el endpoint corre en cada request en vez de generarse en build — necesario si depende de `request` (headers, body, cookies) en tiempo real. El antiguo valor `output: 'hybrid'` ya no forma parte de la configuración actual: el modo mixto se expresa por ruta con `prerender`.

```ts title="pages/api/echo.ts"
export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const body = await request.json();
  return new Response(JSON.stringify(body));
};
```

## Resumen

| API | Uso |
| --- | --- |
| `export const GET/POST/...: APIRoute` | Handler por método HTTP |
| `params` | Segmentos dinámicos de la URL |
| `request` | `Request` completo (headers, body, method) |
| `url` | URL completa, incluyendo query params |
| `getStaticPaths()` | Requerido en rutas dinámicas prerenderizadas |
| `export const prerender = false` | Forzar ese endpoint a on-demand |

## Consideraciones

- En modo estático (sin `prerender = false`), `request.body` no está disponible de forma confiable — un endpoint que necesita leer el body de un POST necesita on-demand rendering.
- Astro no valida nada del body automáticamente: sigue el mismo patrón que en cualquier boundary, `request.json()` + Zod antes de confiar en los datos.
- Para lo que sería un formulario típico con validación, [Server Actions](/guides/astro-server-actions) suele ser menos código que un endpoint a mano.
