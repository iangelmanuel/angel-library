---
title: getStaticPaths()
description: Cómo Astro sabe qué páginas generar en build para una ruta dinámica — params, props y paginación.
category: frontend
stack: astro
order: 7
tags: [astro, routing]
scope: astro:pages
related:
  - guides/astro-content-collections
updatedAt: 2026-08-16
---

Astro genera sitios estáticos por defecto: cada ruta tiene que existir como archivo HTML ya armado en build, no se resuelve en cada visita. Para una ruta fija (`about.astro`) eso es automático. Para una ruta dinámica (`[slug].astro`) Astro no tiene forma de adivinar solo cuántas páginas hacen falta ni con qué valores — por eso el archivo tiene que exportar `getStaticPaths()`, una función que corre en build y devuelve la lista exacta de páginas a generar. Este mismo sitio lo usa en `src/pages/[type]/[...slug].astro` para generar la página de cada entrada de contenido.

## Lo mínimo

`params` define el valor de cada segmento dinámico del nombre de archivo.

```astro title="pages/posts/[slug].astro"
---
export async function getStaticPaths() {
  return [
    { params: { slug: 'primer-post' } },
    { params: { slug: 'segundo-post' } },
  ];
}

const { slug } = Astro.params;
---
```

## `props` — Pasar datos sin meterlos en la URL

Lo que no forma parte de la URL va en `props`, no en `params`. Evita tener que volver a buscar la entrada dentro del componente.

```astro
---
import { getCollection } from 'astro:content';

export async function getStaticPaths() {
  const posts = await getCollection('blog');
  return posts.map((post) => ({
    params: { slug: post.id },
    props: { post },
  }));
}

const { post } = Astro.props;
---
```

## Paginación con `paginate()`

`getStaticPaths` recibe `paginate` como argumento cuando el archivo se llama `[...page].astro`. Genera automáticamente una página por bloque de `pageSize` items.

```astro title="pages/blog/[...page].astro"
---
export async function getStaticPaths({ paginate }) {
  const posts = await getCollection('blog');
  return paginate(posts, { pageSize: 10 });
}

const { page } = Astro.props;
---
<p>Página {page.currentPage} de {page.lastPage}</p>
{page.data.map((post) => <a href={`/blog/${post.id}`}>{post.data.title}</a>)}
{page.url.prev && <a href={page.url.prev}>Anterior</a>}
{page.url.next && <a href={page.url.next}>Siguiente</a>}
```

## Resumen

| Campo | Qué es |
| --- | --- |
| `params` | Valores de los segmentos dinámicos del nombre de archivo (deben coincidir exacto) |
| `props` | Cualquier otro dato que la página necesite, fuera de la URL |
| `paginate(items, { pageSize })` | Divide un array en páginas, requiere `[...page].astro` |
| `page.data` / `page.currentPage` / `page.url.prev` / `page.url.next` | Lo que devuelve `paginate()`, disponible en `Astro.props.page` |

## Consideraciones

- `getStaticPaths()` corre en build, no en el navegador — no tiene acceso a `Astro.request` ni a nada que dependa de la petición real.
- Los valores de `params` deben ser strings (o `undefined` para un segmento opcional en `[[slug]]`) — un número hay que convertirlo con `String()`.
- En modo `output: 'server'`, las rutas dinámicas no necesitan `getStaticPaths()`: se resuelven en cada request, como en Next.js con rutas dinámicas sin `generateStaticParams`.
