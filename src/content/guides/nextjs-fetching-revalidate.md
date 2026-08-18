---
title: Fetching con revalidate — las constantes de caché
description: cache en fetch, next.revalidate/next.tags, y los exports dynamic/revalidate/fetchCache explicados uno por uno.
category: frontend
stack: nextjs
order: 18
tags: [nextjs, caching, performance]
scope: next.js (route segment config)
related:
  - guides/nextjs-revalidate-path
  - guides/nextjs-cache-components
updatedAt: 2026-08-16
---

Esto describe el modelo de caché "clásico" de Next (el que tiene la mayoría de los proyectos hoy). Next 16 introdujo un modelo nuevo opt-in ("Cache Components", con la directiva `use cache` — ver [Directivas](/guides/nextjs-directivas)) que reemplaza esto a futuro, pero mientras no actives `cacheComponents: true` en `next.config`, es este modelo el que aplica.

## `fetch` — Cacheado o no, por request

Por defecto, `fetch` **no cachea nada**. Se cachea explícitamente por request con el option `cache`.

```ts
await fetch('https://api.ejemplo.com/posts', { cache: 'force-cache' }); // cachea indefinidamente
await fetch('https://api.ejemplo.com/posts', { cache: 'no-store' });    // nunca cachea, siempre fresco
```

## `next.revalidate` — Cachear con vencimiento

Cachea el resultado, pero lo refresca automáticamente después de N segundos (Incremental Static Regeneration a nivel de request individual).

```ts
await fetch('https://api.ejemplo.com/posts', { next: { revalidate: 3600 } }); // se refresca cada hora
```

## `next.tags` — Etiquetar para invalidar bajo demanda

Marca el resultado con una o más etiquetas, para poder invalidarlo manualmente después con `revalidateTag` (ver [Revalidación de paths](/guides/nextjs-revalidate-path)) — sin esperar a que venza el tiempo de `revalidate`.

```ts
await fetch('https://api.ejemplo.com/posts', { next: { tags: ['posts'] } });
```

## Las constantes exportadas — a nivel de página/layout/route

Estas van en `page.tsx`, `layout.tsx` o `route.ts`, y controlan el comportamiento por defecto de **todos** los fetches de ese segmento que no especifican su propio `cache`.

### `export const dynamic`

Fuerza el modo de renderizado de todo el segmento.

```ts
export const dynamic = 'auto';
// 'auto' (default) | 'force-dynamic' | 'error' | 'force-static'
```

- **`'auto'`**: default, cachea lo que pueda sin forzar nada.
- **`'force-dynamic'`**: siempre renderiza por request, para cada usuario — equivalente a poner `cache: 'no-store'` en todos los fetches del segmento.
- **`'error'`**: fuerza estático, y **tira error en build** si algo del segmento usa una API que solo existe en request-time (como leer cookies) — útil para garantizar que una ruta se mantenga estática a propósito.
- **`'force-static'`**: fuerza estático, pero en vez de error, hace que `cookies()`/`headers()`/`useSearchParams()` devuelvan valores vacíos en vez de fallar.

### `export const revalidate`

El tiempo de revalidación por defecto de ese segmento — no pisa un `revalidate` puesto en un `fetch` individual, solo aplica donde ese fetch no especificó el suyo.

```ts
export const revalidate = 3600; // segundos
// false (default, cachea indefinidamente lo que se pueda) | 0 (siempre dinámico) | número
```

Si una ruta tiene varios segmentos (layout + page) con distinto `revalidate`, gana el **menor** de todos — así una página nunca queda "más fresca" que lo que su layout permite.

### `export const fetchCache`

Opción avanzada: cambia el comportamiento por defecto de **todos** los fetches del segmento, incluso los que no pusieron ningún `cache` explícito. Rara vez hace falta tocarla — `'auto'` (el default) ya hace lo razonable en la mayoría de los casos.

## Resumen

| Constante / opción | Nivel | Qué controla |
| --- | --- | --- |
| `fetch(url, { cache })` | Por request | `'force-cache'` (cachear) vs `'no-store'` (nunca) |
| `fetch(url, { next: { revalidate } })` | Por request | Segundos hasta refrescar ese fetch puntual |
| `fetch(url, { next: { tags } })` | Por request | Etiquetas para invalidar bajo demanda con `revalidateTag` |
| `export const dynamic` | Segmento (page/layout/route) | Forzar todo estático, todo dinámico, o error si no puede ser estático |
| `export const revalidate` | Segmento | Tiempo de revalidación por defecto del segmento entero |
| `export const fetchCache` | Segmento | Override avanzado del comportamiento default de todos los fetches |

## Consideraciones

- En desarrollo (`next dev`), las páginas **siempre** se renderizan on-demand, nunca cacheadas — para ver el comportamiento real de caché hay que probar con `next build && next start`.
- El valor de `revalidate` tiene que ser estáticamente analizable: `revalidate = 3600` funciona, `revalidate = 60 * 60` no (Next no evalúa expresiones ahí, necesita leer el literal en build).
- Para datos que no vienen de `fetch` (una query directa a una base de datos, un ORM), estas opciones no aplican directamente. En el modelo clásico existe `unstable_cache`; al migrar a Cache Components se reemplaza por una función async con `'use cache'`, `cacheLife()` y `cacheTag()`.
