---
title: Fundamentos de routing
description: Comprende segmentos, páginas, layouts, rutas dinámicas y navegación antes de entrar en patrones avanzados del App Router.
category: frontend
stack: nextjs
order: 3
tags: [nextjs, routing, app-router, navegación]
scope: next.js app router
related:
  - guides/nextjs-project-structure-configuration
  - guides/nextjs-layouts
  - guides/nextjs-params-searchparams
  - guides/nextjs-link
updatedAt: 2026-08-25
---

El App Router convierte carpetas en **segmentos** de una URL y archivos especiales en comportamiento. Entender esta relación antes de usar rutas paralelas, interceptadas o grupos evita que el árbol de archivos se vuelva difícil de seguir.

## Mapa rápido

| Archivo | URL resultante |
| --- | --- |
| `app/page.tsx` | `/` |
| `app/blog/page.tsx` | `/blog` |
| `app/blog/[slug]/page.tsx` | `/blog/mi-articulo` |
| `app/docs/[...parts]/page.tsx` | `/docs/a`, `/docs/a/b`, etc. |
| `app/shop/[[...filters]]/page.tsx` | `/shop` y `/shop/categoria/...` |
| `app/(marketing)/about/page.tsx` | `/about`; el grupo no aparece |

## Segmentos y páginas

```text
app/
├── layout.tsx
├── page.tsx
└── products/
    ├── layout.tsx
    ├── page.tsx
    └── [id]/
        └── page.tsx
```

La URL `/products/42` compone el layout raíz, el layout de productos y la página dinámica. Un layout se conserva entre navegaciones de sus descendientes; una página representa la hoja que cambia.

## Segmentos dinámicos

```tsx title="app/products/[id]/page.tsx"
type Props = {
  params: Promise<{ id: string }>;
};

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  return <h1>Producto {id}</h1>;
}
```

Los corchetes declaran una parte variable de la URL. En el App Router actual, `params` y `searchParams` se reciben como promesas en las páginas y deben resolverse con `await` o con `use()` cuando corresponda.

| Sintaxis | Coincide con | Valor |
| --- | --- | --- |
| `[id]` | exactamente un segmento | `{ id: '42' }` |
| `[...slug]` | uno o más segmentos | `{ slug: ['a', 'b'] }` |
| `[[...slug]]` | cero o más segmentos | `{ slug: undefined }` o un array |

Usa un segmento dinámico para identificar un recurso. Usa parámetros de consulta para filtros, orden, paginación o estado de UI que no cambia la identidad principal del recurso.

## Parámetros de consulta

La URL `/products?category=books&page=2` mantiene `/products` como ruta y envía filtros en `searchParams`.

```tsx title="app/products/page.tsx"
type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function ProductsPage({ searchParams }: Props) {
  const query = await searchParams;
  const category = typeof query.category === 'string' ? query.category : 'all';

  return <h1>Categoría: {category}</h1>;
}
```

No confíes en estos valores solo porque TypeScript les asigna un tipo: provienen del usuario. Valida rangos, opciones permitidas y formato antes de utilizarlos en consultas.

## Navegación: declarativa o imperativa

```tsx
import Link from 'next/link';

<Link href="/products">Ver productos</Link>
```

Usa `<Link>` cuando la interfaz representa un destino. Es accesible, mantiene la semántica de enlace y permite optimizaciones del router. Usa `useRouter()` para navegar como consecuencia de una acción, por ejemplo después de completar un flujo cliente.

No uses `router.push()` para reemplazar un enlace visible: pierde semántica, apertura en nueva pestaña y comportamiento esperado por tecnologías de asistencia.

## Ruta de página frente a Route Handler

```text
app/products/page.tsx       → interfaz GET /products
app/api/products/route.ts   → respuesta HTTP /api/products
```

`page.tsx` produce UI de React. `route.ts` implementa métodos HTTP como `GET`, `POST` o `DELETE`. No pueden reclamar el mismo segmento y método `GET` a la vez; separa la API pública cuando ambos sean necesarios.

## Precedencia y colisiones

Las rutas estáticas son más específicas que las dinámicas: `/blog/archive` debe resolver antes que `/blog/[slug]`. Los nombres de grupos no forman parte de la URL, por lo que dos grupos distintos pueden crear accidentalmente el mismo destino. La compilación ayuda a detectar esas colisiones.

## Ruta de aprendizaje recomendada

1. Crea páginas estáticas y layouts anidados.
2. Añade un `[id]` y comprende `params`.
3. Añade filtros con `searchParams`.
4. Practica `<Link>`, `redirect()` y `notFound()`.
5. Después estudia grupos, generación estática y rutas paralelas.

Las rutas avanzadas resuelven problemas concretos de composición. No conviene comenzar por ellas si páginas, layouts y segmentos dinámicos todavía no son predecibles.

Referencia oficial: [Layouts and pages](https://nextjs.org/docs/app/getting-started/layouts-and-pages) y [Dynamic segments](https://nextjs.org/docs/app/api-reference/file-conventions/dynamic-routes).
