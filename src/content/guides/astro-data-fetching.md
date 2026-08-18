---
title: Data fetching en Astro
description: Cuándo corre fetch en estático y SSR, consultas paralelas, endpoints internos y cómo decidir si hace falta una isla cliente.
category: frontend
stack: astro
order: 9
tags: [astro, fetch, data, performance]
scope: data fetching
related:
  - guides/astro-ssr-adapters
  - guides/astro-islas
  - utilities/fetch
updatedAt: 2026-08-18
---

Un `await fetch()` en el frontmatter corre donde se renderiza la página: durante `astro build` si está prerenderizada, o en cada request si es on-demand.

```astro
---
const response = await fetch('https://api.example.com/posts');
if (!response.ok) throw new Error(`Posts: ${response.status}`);
const posts = await response.json();
---
{posts.map((post) => <article>{post.title}</article>)}
```

## Estático vs on-demand

- Estático: la API se consulta una vez al construir. Resultado rápido y cacheable, pero requiere rebuild para actualizar.
- On-demand: la API se consulta durante la request. Puede personalizarse con cookies, pero necesita adapter y una estrategia de caché.
- Cliente: se consulta después de cargar la página. Reservalo para refetch frecuente, datos que dependen del navegador o UI muy interactiva.

## Evitar waterfalls

```ts
const [posts, authors] = await Promise.all([
  fetch(postsUrl).then((r) => r.json()),
  fetch(authorsUrl).then((r) => r.json()),
]);
```

## Endpoints propios

Desdirectamente ruta on-demand puedes construir una URL absoluta con `new URL('/api/data', Astro.url)`. En build estático, llamar a tu propio endpoint suele ser innecesario: importá la función que obtiene los datos y reutilizala directamente.

## Errores y tipos

`response.json()` no valida runtime. Comprobá `response.ok` y valida datos externos con Zod cuando una forma incorrecta pueda romper el render. Define un fallback explícito para APIs opcionales; no ocultes silenciosamente un fallo de datos esenciales.

Referencia oficial: [Data fetching](https://docs.astro.build/en/guides/data-fetching/).
