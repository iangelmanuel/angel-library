---
title: generateStaticParams()
description: El equivalente Next del getStaticPaths de Astro — qué valores directamente ruta dinámica generar en build, y qué hacer con el resto.
type: guides
order: 15
tags: [nextjs, routing, performance]
scope: next.js (generateStaticParams)
related:
  - frontend/astro/astro-get-static-paths
  - frontend/nextjs/nextjs-params-searchparams
updatedAt: 2026-08-25
---

Mismo problema que resuelve [`getStaticPaths` en Astro](/frontend/astro/astro-get-static-paths): una ruta con `[slug]` no le dice a Next qué páginas concretas generar en build — `generateStaticParams` es la función que devuelve esa lista. Reemplaza al `getStaticPaths` del Pages Router viejo.

## Lo básico

```tsx title="app/blog/[slug]/page.tsx"
export async function generateStaticParams() {
  const posts = await fetch('https://api.ejemplo.com/posts').then((r) => r.json());

  return posts.map((post: { slug: string }) => ({
    slug: post.slug,
  }));
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  // ...
}
```

Cada objeto del array devuelto se convierte en una página generada en build — con el ejemplo de arriba, una por cada post.

## Varios segmentos dinámicos

Para una ruta como `[categoria]/[producto]`, cada objeto lleva ambas claves.

```tsx title="app/productos/[categoria]/[producto]/page.tsx"
export async function generateStaticParams() {
  const productos = await fetch('https://api.ejemplo.com/productos').then((r) => r.json());

  return productos.map((p: { categoria: string; id: string }) => ({
    categoria: p.categoria,
    producto: p.id,
  }));
}
```

## `dynamicParams` — Qué pasa con lo no generado

Por defecto (`dynamicParams = true`), una URL que matchea el patrón pero no estaba en la lista de `generateStaticParams` igual se renderiza — la primera vez, on-demand; después queda cacheada. Poniendo `false`, cualquier valor no generado en build devuelve 404 directo, sin intentar renderizarlo.

```tsx title="app/blog/[slug]/page.tsx"
export const dynamicParams = false; // solo los slugs de generateStaticParams existen, el resto es 404
```

## Generar un subconjunto, el resto bajo demanda

No hace falta devolver todo — para un blog con miles de posts, generar los 10 más recientes en build y dejar que el resto se genere (y cachee) la primera vez que alguien los visita es más rápido de buildear.

```tsx
export async function generateStaticParams() {
  const posts = await fetch('https://api.ejemplo.com/posts').then((r) => r.json());
  return posts.slice(0, 10).map((post: { slug: string }) => ({ slug: post.slug }));
}
```

## Contrato de la función

| API | Uso |
| --- | --- |
| `generateStaticParams()` | Devuelve el array de `params` a generar en build |
| Array vacío `[]` | Ninguna página se genera en build, todas on-demand (ISR completo) |
| `export const dynamicParams = false` | Cualquier valor no listado da 404, en vez de generarse on-demand |
| Funciona en `page.tsx`, `layout.tsx` y `route.ts` | No es exclusivo de páginas |

## Cobertura de rutas y escalabilidad

- Siempre hay que devolver un array, aunque sea vacío — no devolver nada hace que la ruta completa se trate como dinámica, perdiendo cualquier beneficio de pre-generación.
- En rutas con varios segmentos dinámicos anidados, un `generateStaticParams` hijo puede usar los `params` que le pasó el padre — se puede generar "de abajo hacia arriba" (una función que devuelve todo) o "de arriba hacia abajo" (cada nivel genera su propio segmento).
- A diferencia de `getStaticPaths` en Astro (que es obligatorio para toda ruta `[dinámica]`), aquí es opcional: sin `generateStaticParams`, la ruta simplemente es 100% dinámica (se renderiza en cada request) en vez de fallar el build.
