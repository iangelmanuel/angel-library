---
title: Routing basado en archivos
description: Rutas estáticas, dinámicas, rest params, prioridades, páginas excluidas y cuándo interviene getStaticPaths.
type: guides
order: 4
tags: [astro, routing, pages]
scope: src/pages
related:
  - frontend/astro/astro-get-static-paths
  - frontend/astro/astro-endpoints
  - backend/astro/astro-ssr-adapters
updatedAt: 2026-08-25
---

Cada archivo dentro de `src/pages/` crea una URL. `index.astro` representa la raíz de su carpeta y la extensión del archivo no aparece en la ruta.

## Consulta rápida

| Quieres crear | Archivo |
| --- | --- |
| `/` | `src/pages/index.astro` |
| `/about` | `src/pages/about.astro` o `about/index.astro` |
| `/blog/astro` | `src/pages/blog/[slug].astro` |
| `/docs/a/b` | `src/pages/docs/[...path].astro` |
| `/api/posts` | `src/pages/api/posts.ts` |
| varias rutas en build | ruta dinámica + `getStaticPaths()` |

```text
src/pages/
├── index.astro             # /
├── about.astro             # /about
├── blog/index.astro        # /blog
├── blog/[slug].astro       # /blog/:slug
└── docs/[...path].astro    # /docs/cualquier/profundidad
```

## Segmentos dinámicos

`[id]` captura un segmento. `[...path]` captura varios y puede producir `undefined` para la raíz. En salida estática deben enumerarse con `getStaticPaths()`; en rutas on-demand se resuelven desde la request.

```astro title="src/pages/docs/[...path].astro"
---
export const prerender = false;
const path = Astro.params.path ?? 'inicio';
---
<h1>{path}</h1>
```

`Astro.params` contiene parámetros del path; `Astro.url.searchParams` contiene la consulta que aparece después de `?`. No son equivalentes: `/blog/astro?page=2` tiene `slug = 'astro'` y `page = '2'`.

## Estático o bajo demanda

| Modo | Cuándo se conoce la ruta dinámica | Consecuencia |
| --- | --- | --- |
| prerenderizado | durante `astro build` mediante `getStaticPaths()` | HTML rápido y fácil de distribuir en CDN |
| bajo demanda | cuando llega la solicitud | admite URLs y datos no conocidos durante build |

En un proyecto estático, una ruta dinámica necesita enumerar sus variantes. Cuando existe un adapter y la ruta usa `prerender = false`, puede responder a cualquier parámetro válido durante la solicitud. La elección depende del origen y frecuencia de cambio de los datos, no solo de cuántas rutas existen.

## Prioridad

Las rutas estáticas ganan sobre las dinámicas; los parámetros con nombre ganan sobre los rest params. Evita depender de prioridades complejas: si dos archivos parecen representar el mismo recurso, la estructura ya es difícil de mantener.

Las páginas `.astro`, `.md`, `.mdx` y `.html` pueden participar en el routing. Un endpoint `.ts` o `.js` produce una respuesta HTTP. Mantén rutas de contenido y endpoints con nombres que hagan evidente qué contrato tiene cada URL.

## Excluir páginas

Un archivo o carpeta con prefijo `_` no genera ruta. Sirve para colocar helpers o componentes cerca de la página.

```text
src/pages/blog/
├── _PostCard.astro
├── _queries.ts
└── index.astro
```

## Redirects

Los redirects permanentes conocidos en build se declaran en `astro.config.mjs`. Para decisiones por usuario o request usa `Astro.redirect()` en una ruta on-demand o middleware.

```js title="astro.config.mjs"
export default defineConfig({
  redirects: {
    '/inicio': '/',
    '/docs/vieja': { destination: '/docs/nueva', status: 301 },
  },
});
```

Usa un redirect permanente cuando la URL cambió de forma definitiva y uno temporal cuando la decisión pueda variar. Para una página eliminada sin reemplazo, una respuesta 404 o 410 comunica mejor la situación que enviar siempre al inicio.

## Errores frecuentes

- Confundir un parámetro rest con una cadena garantizada: también puede ser `undefined` en la raíz.
- Acceder a una ruta dinámica estática que no fue devuelta por `getStaticPaths()`.
- Leer parámetros sin validarlos antes de consultar una base de datos o construir una ruta de archivo.
- Crear dos patrones que compiten por la misma URL.
- Usar un redirect para ocultar una arquitectura de URLs inconsistente.

Referencia oficial: [Routing](https://docs.astro.build/en/guides/routing/).
