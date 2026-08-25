---
title: Renderizado on-demand y adapters
description: Elegir entre páginas estáticas y SSR, configurar output, seleccionar rutas con prerender y entender el runtime del adapter.
category: backend
stack: astro
order: 3
tags: [astro, ssr, adapters, deployment]
scope: astro output y adapters
related:
  - guides/astro-routing
  - guides/astro-endpoints
  - guides/astro-server-islands
updatedAt: 2026-08-25
---

Astro prerenderiza por defecto. Para ejecutar una ruta cuando llega la request necesitas un adapter compatible con el destino y una ruta on-demand.

**SSG** (*Static Site Generation*) produce el documento durante el build. **SSR** (*Server-Side Rendering*) lo produce al recibir la request. Astro usa “on-demand rendering” para destacar que no toda ruta dinámica tiene que renderizarse en un servidor tradicional: puede ejecutarse en serverless o edge según el adapter.

## Consulta rápida

| La página depende de | Modo sugerido |
| --- | --- |
| contenido que cambia con deploy | prerender |
| cookie, sesión o header actual | on-demand |
| parámetros conocidos durante build | `getStaticPaths()` + prerender |
| datos personalizados en una región | página estática + Server Island |
| endpoint o webhook runtime | `prerender = false` |

## Proyecto principalmente estático

```astro
---
export const prerender = false;
const user = await getUser(Astro.cookies);
---
<h1>Hola {user.name}</h1>
```

Con `output: 'static'`, todas las rutas son estáticas salvo las marcadas con `prerender = false`.

Esta estrategia mantiene HTML desplegable en CDN para la mayoría del sitio y paga runtime solo en rutas concretas. Es una buena opción para documentación con un panel autenticado pequeño.

## Proyecto principalmente dinámico

```js title="astro.config.mjs"
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';

export default defineConfig({ output: 'server', adapter: node({ mode: 'standalone' }) });
```

Con `output: 'server'`, las rutas son on-demand salvo las marcadas con `export const prerender = true`.

```astro title="src/pages/about.astro"
---
export const prerender = true;
---
<h1>Acerca de</h1>
```

No asumas que `output: 'server'` obliga a todas las páginas a consultar datos en cada request. Todavía puedes prerenderizar rutas públicas y cachear respuestas donde el contrato lo permita.

## Qué aporta el adapter

Transforma la salida de Astro al runtime real: Node, Cloudflare, Netlify, Vercel u otro. Las capacidades cambian por plataforma — filesystem, streaming, imágenes, sesiones y APIs de runtime—, así que una app que funciona con el adapter Node no debe asumir automáticamente el mismo entorno en edge.

Antes de elegir, revisa:

- si necesita un servidor persistente o funciones independientes;
- disponibilidad de filesystem escribible y si es temporal;
- duración máxima, región y cold starts;
- soporte para streaming, imágenes y sessions;
- modelo de variables y secretos;
- compatibilidad de drivers de base de datos.

Un **cold start** es el tiempo de inicializar una nueva instancia antes de atender. No conviertas cada request en conexiones nuevas; reutiliza clientes cuando el entorno lo permita y utiliza pools o proxies adecuados para serverless.

## Cómo decidir

- Contenido público que cambia con deploy: prerender.
- Página personalizada por cookie o sesión: on-demand.
- Catálogo grande con cambios periódicos: prerender + rebuild/webhook, o SSR con caché.
- Un widget personalizado dentro de página estática: Server Island.

No conviertas todo el sitio a SSR solo porque una ruta lo necesita. La selección por ruta conserva las ventajas estáticas donde sí aplican.

## Datos y caché

En prerender, el fetch ocurre durante el build y el resultado permanece hasta el siguiente despliegue. En on-demand ocurre durante la request, salvo que añadas una capa de caché. Documenta frescura, clave e invalidación; “SSR” no significa automáticamente “siempre actualizado” si existe CDN o caché intermedia.

## Streaming

Astro puede transmitir HTML a medida que está listo. El primer byte puede llegar antes de que termine todo el trabajo, pero los headers y cookies deben definirse antes de iniciar el body. Streaming mejora tiempo percibido; no reduce por sí mismo el costo total ni arregla una dependencia lenta.

## Verificación de despliegue

1. Ejecuta `astro build`, no solo el servidor de desarrollo.
2. Prueba la salida con el adapter real.
3. Confirma qué rutas quedaron prerenderizadas.
4. Comprueba cookies, redirects, streaming y variables en preview.
5. Simula una segunda instancia si hay sesión o almacenamiento local.

Referencia oficial: [On-demand rendering](https://docs.astro.build/en/guides/on-demand-rendering/).
