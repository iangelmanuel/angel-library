---
title: Route Groups y organización de app/
description: Organizar rutas por área sin cambiar la URL, compartir layouts y separar zonas públicas, privadas o administrativas.
category: frontend
stack: nextjs
order: 5
tags: [nextjs, routing, architecture]
scope: next.js app router
related:
  - guides/nextjs-layouts
  - guides/nextjs-parallel-intercepting-routes
updatedAt: 2026-08-18
---

Una carpeta entre paréntesis organiza rutas sin aparecer en la URL. `app/(marketing)/precios/page.tsx` sigue produciendo `/precios`.

```text
app/
├── (marketing)/
│   ├── layout.tsx
│   ├── page.tsx
│   └── precios/page.tsx
├── (app)/
│   ├── layout.tsx
│   └── dashboard/page.tsx
└── layout.tsx
```

## Cuándo sirve

- Aplicar un layout solo a una zona sin agregar un segmento visible.
- Agrupar por equipo o feature sin alterar URLs existentes.
- Separar la experiencia pública de la aplicación autenticada.
- Mantener archivos relacionados cerca aunque la URL final sea corta.

## Múltiples root layouts

Si eliminas el `app/layout.tsx` común, cada grupo puede tener su propio `<html>` y `<body>`. Navegar entre root layouts distintos provoca una carga completa del documento, no una transición cliente.

## Colocación y carpetas privadas

Una carpeta `_components` o `_lib` se considera privada y no crea rutas. La colocación normal también es segura: una carpeta solo se vuelve pública cuando contiene un `page.tsx` o `route.ts` alcanzable.

```text
app/blog/
├── _components/PostCard.tsx
├── _lib/get-posts.ts
└── page.tsx
```

## Límites

- Dos grupos no pueden resolver a la misma URL: `(shop)/about` y `(marketing)/about` chocan.
- El nombre del grupo no está disponible como parámetro porque no forma parte de la ruta.
- No uses grupos solo para imitar cada carpeta de arquitectura; deben representar límites de layout o dominios que ayuden a navegar el proyecto.

Referencia oficial: [Route Groups](https://nextjs.org/docs/app/api-reference/file-conventions/route-groups).
