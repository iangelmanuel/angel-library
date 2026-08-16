---
title: Layouts anidados
description: UI compartida que no se remonta al navegar — el layout raíz obligatorio, layouts anidados y route groups para organizar sin tocar la URL.
category: frontend
stack: nextjs
order: 2
tags: [nextjs, routing]
scope: next.js (layout.tsx)
related:
  - guides/nextjs-page-error-loading
updatedAt: 2026-08-16
---

Un `layout.tsx` envuelve `page.tsx` y todo lo que haya debajo en su carpeta — pero a diferencia de un componente normal, **no se remonta** al navegar entre páginas hijas. Un sidebar con estado propio, un contador, un video reproduciéndose: todo eso sobrevive la navegación si vive en un layout, exactamente igual que `transition:persist` en Astro pero sin tener que declararlo — es el comportamiento por defecto acá.

## Lo básico

```tsx title="app/dashboard/layout.tsx"
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <section>
      <Sidebar />
      {children}
    </section>
  );
}
```

## El layout raíz — obligatorio

`app/layout.tsx` es especial: es el único lugar donde van las etiquetas `<html>` y `<body>`. Toda la app necesita exactamente uno (salvo que uses múltiples layouts raíz con route groups, ver abajo).

```tsx title="app/layout.tsx"
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
```

No le agregues `<title>`/`<meta>` a mano acá — eso es trabajo de la [Metadata API](/guides/nextjs-metadata-seo).

## Layouts anidados

Cada carpeta puede tener su propio `layout.tsx`, que envuelve al de la carpeta padre — se van anidando en cascada, de afuera hacia adentro.

```
app/
  layout.tsx          (envuelve todo el sitio)
  dashboard/
    layout.tsx        (envuelve solo /dashboard/*)
    page.tsx
    ajustes/
      page.tsx         (usa ambos layouts, anidados)
```

## Route groups — organizar sin tocar la URL

Una carpeta entre paréntesis, `(nombre)`, agrupa rutas para compartir un layout (o simplemente para organizar el proyecto) sin que ese nombre aparezca en la URL.

```
app/
  (marketing)/
    layout.tsx    (layout propio, solo para estas rutas)
    page.tsx       →  /
    precios/
      page.tsx     →  /precios
  (panel)/
    layout.tsx    (otro layout, distinto del anterior)
    dashboard/
      page.tsx     →  /dashboard
```

`(marketing)` y `(panel)` no aparecen en la URL — son puramente organizativos. Esto también es la forma de tener **más de un layout raíz**: cualquier layout que no tiene otro `layout.tsx` por encima (dentro de su route group) actúa como raíz para esa sección, con su propio `<html>`/`<body>`.

## Lo que un layout NO puede hacer

Como no se re-renderiza en cada navegación, un layout no tiene acceso confiable a `searchParams` ni al pathname actual (quedarían obsoletos apenas el usuario navegara). Para eso, extraé esa parte a un Client Component con [`usePathname`](/guides/nextjs-usepathname)/[`useSearchParams`](/guides/nextjs-usesearchparams) e importalo en el layout.

```tsx title="app/dashboard/layout.tsx"
import { Breadcrumbs } from '@/app/ui/breadcrumbs'; // Client Component con usePathname

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Breadcrumbs />
      <main>{children}</main>
    </>
  );
}
```

## Resumen

| Concepto | Qué es |
| --- | --- |
| `layout.tsx` | UI compartida, no se remonta al navegar entre páginas hijas |
| Layout raíz (`app/layout.tsx`) | Obligatorio, define `<html>`/`<body>` |
| Layouts anidados | Uno por carpeta, se envuelven en cascada |
| Route group `(nombre)` | Agrupa/organiza rutas sin afectar la URL, puede tener su propio layout raíz |
| `template.tsx` | Como un layout, pero SÍ se remonta en cada navegación (poco común, casos con animación de entrada por página) |

## Consideraciones

- Un layout no puede pasarle datos a `children` vía props — si `layout` y `page` necesitan el mismo dato, pedilo en los dos (con `fetch`, que memoiza automáticamente, o con `cache` de React si no usás `fetch`).
- Navegar entre dos layouts raíz distintos (dos route groups distintos) fuerza una recarga completa de página, no una transición de cliente — es la excepción a "los layouts no se remontan".
- `template.tsx` existe para el caso raro donde SÍ querés que algo se reinicie en cada navegación (un formulario que debe limpiarse, una animación de entrada que debe repetirse) — la mayoría de las veces, `layout.tsx` es lo correcto.
