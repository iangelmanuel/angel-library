---
title: Astro
description: Framework web orientado a contenido, HTML estático y arquitectura de islas, con SSR opcional por ruta.
category: frontend
stack: astro
tags: [astro, framework, static, islands]
website: https://astro.build
github: https://github.com/withastro/astro
related:
  - guides/astro-components-props-slots
  - guides/astro-routing
  - guides/astro-islas
  - guides/astro-ssr-adapters
updatedAt: 2026-08-18
---

## Modelo mental

- El resultado por defecto es HTML; JavaScript cliente es opt-in.
- Los componentes `.astro` corren en build o servidor y no tienen runtime en navegador.
- La interactividad se agrega como scripts pequeños o islas de framework.
- Cada ruta puede ser estática u on-demand según sus datos.

## Cuándo lo elijo

- Documentación, marketing, blogs, portfolios y catálogos con mucho contenido.
- Sitios que necesitan excelente carga inicial y poca hidratación.
- Proyectos que mezclan componentes Astro con React/Vue/Svelte puntualmente.
- Aplicaciones con backend moderado mediante endpoints, Actions y adapters.

## Cuándo no es la primera opción

Una aplicación donde casi toda la pantalla es estado cliente compartido y navegación altamente interactiva puede aprovechar mejor un framework centrado en React. Astro puede hacerlo, pero perdería parte de su ventaja de enviar poco JavaScript.

## Piezas esenciales

| Pieza | Propósito |
| --- | --- |
| `src/pages` | routing basado en archivos |
| `.astro` | componentes server-first |
| Content Collections | contenido tipado y validado |
| `client:*` | hidratación selectiva |
| Actions/endpoints | lógica backend |
| adapter | runtime de despliegue para rutas on-demand |

## Regla práctica

Empieza estático. Vuelve dinámica solo la ruta o isla que realmente necesita datos por request. Ese diseño conserva simplicidad y rendimiento sin cerrar la puerta a autenticación o personalización.
