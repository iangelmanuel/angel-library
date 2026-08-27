---
title: Route Groups y organización de app/
description: Organizar rutas por área sin cambiar la URL, compartir layouts y separar zonas públicas, privadas o administrativas.
category: frontend
stack: nextjs
order: 8
tags: [nextjs, routing, architecture]
scope: next.js app router
related:
  - guides/nextjs-layouts
  - guides/nextjs-parallel-intercepting-routes
updatedAt: 2026-08-25
---

Una carpeta entre paréntesis organiza rutas sin aparecer en la URL. `app/(marketing)/precios/page.tsx` sigue produciendo `/precios`.

## En una mirada

| Convención | Cambia la URL | Cambia el layout |
| --- | --- | --- |
| carpeta `dashboard/` | sí | puede hacerlo |
| grupo `(dashboard)/` | no | puede hacerlo |
| carpeta privada `_components/` | no crea una ruta | no por sí sola |

Un grupo es una herramienta de organización del **árbol de layouts**, no un parámetro ni una autorización. Nombrar un grupo `(private)` no protege sus páginas; la sesión y los permisos todavía deben verificarse en el servidor.

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

## Caso de uso: dos experiencias

```text
app/
├── (public)/
│   ├── layout.tsx       → navegación de marketing
│   └── pricing/page.tsx → /pricing
└── (workspace)/
    ├── layout.tsx       → navegación autenticada
    └── projects/page.tsx → /projects
```

El grupo permite que las dos áreas usen envolturas diferentes sin publicar `/public` o `/workspace`. Si el layout de workspace requiere sesión, valida allí para cubrir sus descendientes, pero vuelve a autorizar cada mutación sobre el recurso concreto.

## Múltiples root layouts

Si eliminas el `app/layout.tsx` común, cada grupo puede tener su propio `<html>` y `<body>`. Navegar entre root layouts distintos provoca una carga completa del documento, no una transición cliente.

Esto puede ser válido para áreas realmente independientes, pero tiene costo: se pierde estado cliente compartido, se vuelve a descargar el documento y los providers se montan otra vez. Si solo cambia la barra lateral, conserva un root layout común y anida layouts normales.

## Colocación y carpetas privadas

Una carpeta `_components` o `_lib` se considera privada y no crea rutas. La colocación normal también es segura: una carpeta solo se vuelve pública cuando contiene un `page.tsx` o `route.ts` alcanzable.

```text
app/blog/
├── _components/PostCard.tsx
├── _libs/get-posts.ts
└── page.tsx
```

## Límites

- Dos grupos no pueden resolver a la misma URL: `(shop)/about` y `(marketing)/about` chocan.
- El nombre del grupo no está disponible como parámetro porque no forma parte de la ruta.
- No uses grupos solo para imitar cada carpeta de arquitectura; deben representar límites de layout o dominios que ayuden a navegar el proyecto.
- No intentes leer `(marketing)` desde `params`: el nombre se elimina antes de construir la URL.
- Después de mover rutas entre grupos, ejecuta una compilación para detectar colisiones y revisa enlaces relativos.

Referencia oficial: [Route Groups](https://nextjs.org/docs/app/api-reference/file-conventions/route-groups).
