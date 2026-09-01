---
title: Metadata para SEO
description: El objeto metadata estático, generateMetadata para SEO dinámico, y los archivos especiales para favicon/OG images.
type: guides
order: 1
tags: [nextjs, seo]
scope: next.js (metadata API)
updatedAt: 2026-08-16
---

Next genera las etiquetas `<head>` (title, description, Open Graph, etc.) a partir de un export — nada de escribir `<head>` a mano en `layout.tsx`/`page.tsx`.

## Metadata estática

Un objeto exportado desde `layout.tsx` o `page.tsx`, cuando el contenido no depende de datos que haya que buscar.

```tsx title="app/blog/layout.tsx"
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mi Blog',
  description: 'Notas sobre desarrollo web',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
```

## `generateMetadata` — SEO dinámico

Cuando el título/descripción dependen de datos (el título de un post específico), se usa una función en vez del objeto estático. Recibe los mismos `params`/`searchParams` que la página.

```tsx title="app/blog/[slug]/page.tsx"
import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await fetch(`https://api.ejemplo.com/blog/${slug}`).then((r) => r.json());

  return {
    title: post.title,
    description: post.description,
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  // ...
}
```

## Evitar pedir los datos dos veces

Si `generateMetadata` y el componente de la página necesitan el mismo dato, envolver la función de fetch en `cache` de React memoiza el resultado — se ejecuta una sola vez aunque se llame desde los dos lugares.

```ts title="lib/data.ts"
import { cache } from 'react';

export const getPost = cache(async (slug: string) => {
  return fetch(`https://api.ejemplo.com/blog/${slug}`).then((r) => r.json());
});
```

## Metadata por archivo

Ciertos archivos especiales generan metadata automáticamente sin tocar el objeto `metadata`: `favicon.ico`, `icon.png`, `apple-icon.png`, `opengraph-image.png`, `robots.txt`, `sitemap.xml` — con solo ponerlos en la carpeta correcta de `app/`.

Para una imagen OG que depende de datos (una por post de blog), `opengraph-image.tsx` con el constructor `ImageResponse` la genera con JSX y CSS, no con una herramienta de diseño aparte.

```tsx title="app/blog/[slug]/opengraph-image.tsx"
import { ImageResponse } from 'next/og';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);

  return new ImageResponse(
    <div style={{ fontSize: 64, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {post.title}
    </div>,
  );
}
```

## Resumen

| API | Uso |
| --- | --- |
| `export const metadata: Metadata` | SEO estático, no depende de datos |
| `generateMetadata({ params })` | SEO dinámico, puede hacer fetch |
| `favicon.ico`, `opengraph-image.png`, `robots.txt`, `sitemap.xml` | Metadata por convención de archivo |
| `ImageResponse` (`next/og`) | Generar imágenes OG dinámicas con JSX/CSS |

## Consideraciones

- `metadata`/`generateMetadata` solo funcionan en Server Components — no se puede exportar desde un archivo con `'use client'`.
- La metadata de un layout y la de la página que envuelve se **combinan** (merge), no se reemplazan — un campo declarado en la página pisa el mismo campo del layout, pero los que no se repiten se heredan igual.
- Para bots que no ejecutan JS (Twitterbot, Slackbot), Next resuelve `generateMetadata` antes de mandar cualquier HTML, para garantizar que la metadata esté en el `<head>` del documento inicial — con navegadores normales, puede resolverse en paralelo (streaming) sin bloquear el resto de la página.
