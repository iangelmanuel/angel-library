---
title: Next.js
description: Framework full-stack de React con App Router, Server Components, streaming, Route Handlers y caché integrada.
category: frontend
stack: nextjs
tags: [nextjs, react, framework, fullstack]
website: https://nextjs.org
github: https://github.com/vercel/next.js
related:
  - technologies/react
  - guides/nextjs-server-client-components
  - guides/nextjs-layouts
  - guides/nextjs-cache-components
updatedAt: 2026-08-18
---

## Modelo mental

- El App Router es un árbol de segmentos con layouts persistentes.
- Los componentes son server-side por defecto; `'use client'` crea fronteras interactivas.
- El render puede combinar shell estática, datos cacheados y contenido dinámico transmitido.
- Las mutaciones viven en Server Actions o Route Handlers, con autorización en el servidor.

## Cuándo lo elijo

- Aplicaciones React con frontend y backend en el mismo repositorio.
- Productos con autenticación, dashboards, formularios y datos personalizados.
- Equipos que necesitan convenciones fuertes de routing, rendering y despliegue.
- Sitios que se benefician de streaming y Server Components.

## Costos

El modelo de render y caché tiene más conceptos que una SPA tradicional. Una directiva o API de request puede cambiar cuándo se renderiza una ruta. Para mantener claridad, cada página debería declarar mentalmente qué parte es estática, cacheada, por request y cliente.

## Piezas esenciales

| Pieza | Propósito |
| --- | --- |
| `app/` | rutas, layouts y convenciones |
| Server Components | datos y HTML sin bundle cliente |
| Client Components | estado, efectos y browser APIs |
| Server Actions | mutaciones desde UI |
| Route Handlers | API HTTP pública/integrable |
| Cache Components | caché y partial prerendering |

## Regla práctica

Mantén los límites de cliente pequeños y los accesos a datos cerca del servidor. No dupliques una API interna solo para que un Server Component haga `fetch` contra su propio backend: llama directamente a la capa de datos.
