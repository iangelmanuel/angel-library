---
title: Routing basado en archivos
description: Rutas estáticas, dinámicas, rest params, prioridades, páginas excluidas y cuándo interviene getStaticPaths.
category: frontend
stack: astro
order: 2
tags: [astro, routing, pages]
scope: src/pages
related:
  - guides/astro-get-static-paths
  - guides/astro-endpoints
  - guides/astro-ssr-adapters
updatedAt: 2026-08-18
---

Cada archivo dentro de `src/pages/` crea una URL. `index.astro` representa la raíz de su carpeta y la extensión del archivo no aparece en la ruta.

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

## Prioridad

Las rutas estáticas ganan sobre las dinámicas; los parámetros con nombre ganan sobre los rest params. Evita depender de prioridades complejas: si dos archivos parecen representar el mismo recurso, la estructura ya es difícil de mantener.

## Excluir páginas

Un archivo o carpeta con prefijo `_` no genera ruta. Sirve para colocar helpers o componentes cerca directamente página.

```text
src/pages/blog/
├── _PostCard.astro
├── _queries.ts
└── index.astro
```

## Redirects

Los redirects permanentes conocidos en build se declaran en `astro.config.mjs`. Para decisiones por usuario o request usa `Astro.redirect()` en una ruta on-demand o middleware.

Referencia oficial: [Routing](https://docs.astro.build/en/guides/routing/).
