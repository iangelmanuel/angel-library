---
title: Parallel Routes e Intercepting Routes
description: Slots simultáneos y rutas interceptadas para dashboards, modales con URL y vistas que preservan contexto.
type: guides
order: 30
tags: [nextjs, routing, modals, architecture]
scope: next.js app router (routing avanzado)
related:
  - frontend/nextjs/nextjs-route-groups
  - frontend/nextjs/nextjs-layouts
updatedAt: 2026-08-25
---

Estas dos convenciones se suelen combinar, pero resuelven problemas distintos: las Parallel Routes renderizan varios slots en un layout; las Intercepting Routes muestran otra ruta dentro del contexto actual.

Son routing avanzado. Antes de aplicarlas, confirma que el problema no se resuelve con composición normal, un estado local de modal o un layout anidado. Su valor aparece cuando la URL debe conservarse y el comportamiento cambia según cómo se llegó a ella.

## Diferencia rápida

| Convención             | Resuelve                                                |
| ---------------------- | ------------------------------------------------------- |
| `@slot`                | varias ramas renderizadas simultáneamente por un layout |
| `(.)`, `(..)`, `(...)` | mostrar una ruta desde otro contexto de navegación      |
| `default.tsx`          | reconstruir un slot cuando no se conoce su rama activa  |

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
  team
}: Readonly<{
  children: React.ReactNode
  analytics: React.ReactNode
  team: React.ReactNode
}>) {
  return (
    <>
      <main>{children}</main>
      <aside>
        {analytics}
        {team}
      </aside>
    </>
  )
}
```

Los slots no forman parte de la URL. Cada uno puede tener su propio `loading.tsx` y `error.tsx`. Agrega `default.tsx` para el fallback que Next usa cuando una recarga completa no puede reconstruir el estado activo del slot.

El prop `children` también es un slot implícito. En una navegación cliente, Next.js puede conservar la subpágina activa de otros slots; en una carga completa solo conoce la URL y necesita `default.tsx` para los slots que no coinciden.

## Intercepting Routes — `(.)`, `(..)` y `(...)`

El prefijo intercepta otra ruta según segmentos de URL, no según niveles físicos del filesystem:

- `(.)foto`: mismo nivel.
- `(..)foto`: un segmento arriba.
- `(..)(..)foto`: dos segmentos arriba.
- `(...)foto`: desde la raíz de `app`.

El caso clásico es abrir `/fotos/42` como modal al navegar desde la galería, pero renderizar la página completa cuando el usuario abre o recarga esa URL directamente.

```text
app/
├── @modal/
│   ├── (.)photos/[id]/page.tsx  → versión modal interceptada
│   ├── default.tsx              → no mostrar modal
│   └── [...catchAll]/page.tsx   → cerrar para otras rutas
├── photos/[id]/page.tsx         → página completa
├── layout.tsx                   → renderiza children y modal
└── page.tsx                     → galería
```

El layout recibe `modal` y lo coloca junto al contenido principal. Al seleccionar una foto desde la galería, el router conserva la galería debajo y coloca la ruta interceptada en el slot. Al recargar `/photos/42`, se renderiza la página completa porque ya no existe el contexto previo que debía interceptarse.

El botón de cierre debe usar navegación hacia atrás solo cuando ese historial sea confiable; también puedes enlazar explícitamente a la galería. Prueba abrir el enlace directamente, recargar, avanzar y retroceder: un modal correcto debe comportarse como una URL, no solo como una capa visual.

## Cuándo no usarlas

Para un layout con dos columnas siempre visibles, CSS Grid y componentes normales son más simples. Estas convenciones valen la pena cuando cada zona tiene navegación/estado independiente o cuando una misma URL necesita presentación contextual y presentación directa.

## Accesibilidad del modal

Interceptar una ruta no implementa por sí mismo un diálogo accesible. El modal debe tener nombre, foco inicial, cierre por teclado, contención de foco cuando corresponda y restauración del foco al activador. El contenido completo debe seguir siendo utilizable al abrir la URL sin modal.

Referencias oficiales: [Parallel Routes](https://nextjs.org/docs/app/api-reference/file-conventions/parallel-routes) e [Intercepting Routes](https://nextjs.org/docs/app/api-reference/file-conventions/intercepting-routes).
