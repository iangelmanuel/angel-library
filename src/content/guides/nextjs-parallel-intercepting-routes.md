---
title: Parallel Routes e Intercepting Routes
description: Slots simultáneos y rutas interceptadas para dashboards, modales con URL y vistas que preservan contexto.
category: frontend
stack: nextjs
order: 26
tags: [nextjs, routing, modals, architecture]
scope: next.js app router (routing avanzado)
related:
  - guides/nextjs-route-groups
  - guides/nextjs-layouts
updatedAt: 2026-08-18
---

Estas dos convenciones se suelen combinar, pero resuelven problemas distintos: las Parallel Routes renderizan varios slots en un layout; las Intercepting Routes muestran otra ruta dentro del contexto actual.

## Parallel Routes — carpetas `@slot`

```text
app/dashboard/
├── @analytics/page.tsx
├── @team/page.tsx
├── @analytics/default.tsx
├── @team/default.tsx
└── layout.tsx
```

```tsx title="app/dashboard/layout.tsx"
export default function Layout({
  children,
  analytics,
  team,
}: Readonly<{ children: React.ReactNode; analytics: React.ReactNode; team: React.ReactNode }>) {
  return <><main>{children}</main><aside>{analytics}{team}</aside></>;
}
```

Los slots no forman parte de la URL. Cada uno puede tener su propio `loading.tsx` y `error.tsx`. Agrega `default.tsx` para el fallback que Next usa cuando una recarga completa no puede reconstruir el estado activo del slot.

## Intercepting Routes — `(.)`, `(..)` y `(...)`

El prefijo intercepta otra ruta según segmentos de URL, no según niveles físicos del filesystem:

- `(.)foto`: mismo nivel.
- `(..)foto`: un segmento arriba.
- `(..)(..)foto`: dos segmentos arriba.
- `(...)foto`: desde la raíz de `app`.

El caso clásico es abrir `/fotos/42` como modal al navegar desde la galería, pero renderizar la página completa cuando el usuario abre o recarga esa URL directamente.

## Cuándo no usarlas

Para un layout con dos columnas siempre visibles, CSS Grid y componentes normales son más simples. Estas convenciones valen la pena cuando cada zona tiene navegación/estado independiente o cuando una misma URL necesita presentación contextual y presentación directa.

Referencias oficiales: [Parallel Routes](https://nextjs.org/docs/app/api-reference/file-conventions/parallel-routes) e [Intercepting Routes](https://nextjs.org/docs/app/api-reference/file-conventions/intercepting-routes).
