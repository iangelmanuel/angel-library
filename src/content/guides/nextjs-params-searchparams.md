---
title: Leer params y searchParams en una página
description: Ambos son promesas desde Next 15 — cómo leerlos en Server y Client Components, y el helper PageProps tipado.
category: frontend
stack: nextjs
order: 6
tags: [nextjs, routing, typescript]
scope: next.js app router (page props)
updatedAt: 2026-08-16
---

`page.tsx` recibe dos props especiales: `params` (los segmentos dinámicos de la URL, `[slug]`) y `searchParams` (la query string, `?orden=precio`). Desde Next.js 15, **ambos son promesas** — hay que `await`earlos, ya no se leen directo como en versiones anteriores.

## `params` — Segmentos dinámicos

```tsx title="app/blog/[slug]/page.tsx"
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params;
  return <h1>Post: {slug}</h1>;
}
```

| Ruta | URL | `params` |
| --- | --- | --- |
| `app/shop/[slug]/page.tsx` | `/shop/1` | `Promise<{ slug: '1' }>` |
| `app/shop/[cat]/[item]/page.tsx` | `/shop/1/2` | `Promise<{ cat: '1', item: '2' }>` |
| `app/shop/[...slug]/page.tsx` | `/shop/1/2` | `Promise<{ slug: ['1', '2'] }>` |

## `searchParams` — Query string

```tsx title="app/shop/page.tsx"
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { pagina = '1', orden = 'asc' } = await searchParams;
  return <p>Página {pagina}, orden {orden}</p>;
}
```

A diferencia de `params`, leer `searchParams` opta la página a renderizado dinámico (por request) — su valor no se puede conocer en build, así que Next no puede pre-generar esa página como estática.

## El helper `PageProps` — Tipado automático

En vez de escribir el tipo de `params`/`searchParams` a mano en cada página, `PageProps<'/ruta/literal'>` los infiere de la ruta real, con autocompletado incluido.

```tsx title="app/blog/[slug]/page.tsx"
export default async function Page(props: PageProps<'/blog/[slug]'>) {
  const { slug } = await props.params;
  const query = await props.searchParams;
  return <h1>Post: {slug}</h1>;
}
```

## En un Client Component

Un Client Component no puede ser `async`, así que para leer esas promesas se usa el `use()` de React en vez de `await`.

```tsx title="app/shop/page.tsx"
'use client'

import { use } from 'react';

export default function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { orden } = use(searchParams);
  return <p>Orden: {orden}</p>;
}
```

## Resumen

| Prop | Qué contiene | Estático u opta dinámico |
| --- | --- | --- |
| `params` | Segmentos dinámicos (`[slug]`) | Puede ser estático con `generateStaticParams` |
| `searchParams` | Query string | Siempre dinámico (no se conoce en build) |
| `PageProps<'/ruta'>` | Tipa ambos automáticamente según la ruta literal | — |
| `use(promesa)` | Leer cualquiera de los dos en un Client Component | — |

## Consideraciones

- Antes de Next 15, `params`/`searchParams` eran síncronos — código viejo que hace `params.slug` directo (sin `await`) todavía funciona por compatibilidad, pero está deprecado y hay un codemod oficial para migrarlo.
- `searchParams` es un objeto plano, no una instancia de `URLSearchParams` — no tiene métodos como `.get()`, se accede directo por clave.
- Si una página necesita ser mayormente estática pero un fragmento puntual depende de `searchParams`, pasar la promesa hacia un componente más profundo del árbol (en vez de hacer `await` arriba de todo) deja que el resto de la página se pre-renderice igual.
