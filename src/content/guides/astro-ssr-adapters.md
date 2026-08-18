---
title: Renderizado on-demand y adapters
description: Elegir entre páginas estáticas y SSR, configurar output, seleccionar rutas con prerender y entender el runtime del adapter.
category: backend
stack: astro
order: 4
tags: [astro, ssr, adapters, deployment]
scope: astro output y adapters
related:
  - guides/astro-routing
  - guides/astro-endpoints
  - guides/astro-server-islands
updatedAt: 2026-08-18
---

Astro prerenderiza por defecto. Para ejecutar una ruta cuando llega la request necesitas un adapter compatible con el destino y una ruta on-demand.

## Proyecto principalmente estático

```astro
---
export const prerender = false;
const user = await getUser(Astro.cookies);
---
<h1>Hola {user.name}</h1>
```

Con `output: 'static'`, todas las rutas son estáticas salvo las marcadas con `prerender = false`.

## Proyecto principalmente dinámico

```js title="astro.config.mjs"
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';

export default defineConfig({ output: 'server', adapter: node({ mode: 'standalone' }) });
```

Con `output: 'server'`, las rutas son on-demand salvo las marcadas con `export const prerender = true`.

## Qué aporta el adapter

Transforma la salida de Astro al runtime real: Node, Cloudflare, Netlify, Vercel u otro. Las capacidades cambian por plataforma — filesystem, streaming, imágenes, sesiones y APIs de runtime—, así que una app que funciona con el adapter Node no debe asumir automáticamente el mismo entorno en edge.

## Cómo decidir

- Contenido público que cambia con deploy: prerender.
- Página personalizada por cookie o sesión: on-demand.
- Catálogo grande con cambios periódicos: prerender + rebuild/webhook, o SSR con caché.
- Un widget personalizado dentro de página estática: Server Island.

No conviertas todo el sitio a SSR solo porque una ruta lo necesita. La selección por ruta conserva las ventajas estáticas donde sí aplican.

Referencia oficial: [On-demand rendering](https://docs.astro.build/en/guides/on-demand-rendering/).
