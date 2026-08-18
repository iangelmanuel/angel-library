---
title: Cache Components — use cache, cacheLife y cacheTag
description: El modelo moderno para mezclar shell estática, datos cacheados y contenido dinámico con Partial Prerendering.
category: frontend
stack: nextjs
order: 20
tags: [nextjs, caching, performance, rendering]
scope: next.js cache components
related:
  - guides/nextjs-directivas
  - guides/nextjs-fetching-revalidate
  - guides/nextjs-streaming-suspense
  - guides/nextjs-revalidate-path
updatedAt: 2026-08-18
---

Cache Components permite que una ruta contenga tres clases de trabajo: HTML estático calculable antes directamente request, funciones cacheadas reutilizables y contenido dinámico que se transmite detrás de Suspense.

## Activar

```ts title="next.config.ts"
import type { NextConfig } from 'next';

const nextConfig: NextConfig = { cacheComponents: true };
export default nextConfig;
```

## Cachear una consulta

```ts title="app/lib/products.ts"
import { cacheLife, cacheTag } from 'next/cache';

export async function getProducts() {
  'use cache';
  cacheLife('hours');
  cacheTag('products');
  return db.product.findMany();
}
```

Los argumentos serializables y valores cerrados sobre el scope participan en la clave. Entradas distintas producen entradas de caché distintas.

## Duración

`cacheLife()` acepta perfiles como `hours`, `days`, `weeks` y `max`, o un objeto con:

- `stale`: cuánto puede reutilizar el cliente sin comprobar el servidor.
- `revalidate`: cuándo el servidor intenta refrescar en segundo plano.
- `expire`: cuándo el valor deja de poder reutilizarse sin regenerarlo.

## Invalidación

```ts title="app/actions.ts"
'use server';
import { updateTag } from 'next/cache';

export async function crearProducto(formData: FormData) {
  await db.product.create({ data: { name: String(formData.get('name')) } });
  updateTag('products');
}
```

`updateTag()` expira y obtiene el dato fresco dentro del flujo de la mutación — útil para “read your own writes”. `revalidateTag(tag, 'max')` sirve cuando tolerás stale-while-revalidate.

## Datos de request

No llames `cookies()`, `headers()` ni otras APIs de request dentro del scope `'use cache'`. Lee esos valores fuera y pasa solo el dato que realmente define la consulta, o deja el componente dinámico detrás de `<Suspense>`.

## Migración desde el modelo clásico

Con Cache Components, `dynamic`, `revalidate` y `fetchCache` dejan de ser la herramienta principal. `use cache` marca el límite, `cacheLife` define duración y Suspense marca el trabajo por request. Cache Components requiere runtime Node.js y no aplica a `output: 'export'`.

Referencia oficial: [Cache Components](https://nextjs.org/docs/app/getting-started/partial-prerendering).
