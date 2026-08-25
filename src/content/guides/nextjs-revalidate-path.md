---
title: Revalidación de paths — revalidatePath()
description: Invalidar bajo demanda la caché de una ruta después de una mutación y elegir entre revalidatePath, revalidateTag y updateTag.
category: frontend
stack: nextjs
order: 18
tags: [nextjs, caching]
scope: next.js (next/cache)
related:
  - guides/nextjs-fetching-revalidate
  - guides/nextjs-server-actions
updatedAt: 2026-08-25
---

`revalidate` (el de [fetching con revalidate](/guides/nextjs-fetching-revalidate)) refresca por tiempo. `revalidatePath` refresca **al instante, bajo demanda** — el caso típico es "acabo de guardar algo, quiero que la página que lo lista se actualice ya, no en N segundos".

## Uso básico

Se llama desde un Server Action o un Route Handler — nunca desde un Client Component ni desde el Proxy, porque solo funciona en el servidor.

```ts title="app/posts/actions.ts"
'use server'

import { revalidatePath } from 'next/cache';

export async function crearPost(formData: FormData) {
  await guardarPost(formData);
  revalidatePath('/posts');
}
```

## Un path literal vs un patrón de ruta

Un path literal (`/blog/mi-post`) invalida esa página puntual. Para invalidar **todas** las páginas que matchean una ruta dinámica, se usa el patrón con `[slug]` más el segundo argumento `'page'` (obligatorio en ese caso).

```ts
revalidatePath('/blog/mi-post');            // solo esa página
revalidatePath('/blog/[slug]', 'page');     // todas las que usan ese page.tsx
revalidatePath('/blog/[slug]', 'layout');   // esas más todo lo anidado debajo del layout
revalidatePath('/', 'layout');              // toda la app
```

## `revalidateTag` — La alternativa por etiqueta

Mientras `revalidatePath` invalida por **ruta**, `revalidateTag` invalida por **etiqueta** — todos los fetches en cualquier página que hayan usado esa tag (ver `next.tags` en [fetching con revalidate](/guides/nextjs-fetching-revalidate)), sin importar en qué ruta estén.

```ts title="app/posts/actions.ts"
'use server'

import { revalidateTag } from 'next/cache';

export async function actualizarPost(id: string) {
  await guardarCambios(id);
  revalidateTag('posts'); // invalida CUALQUIER fetch etiquetado "posts", en cualquier página
}
```

La diferencia importa en la práctica: si `/blog` y `/dashboard` piden datos distintos pero ambos etiquetados `posts`, `revalidatePath('/blog')` deja `/dashboard` con datos viejos — `revalidateTag('posts')` actualiza ambos.

## Combinarlos

No son excluyentes — una mutación que afecta tanto una página puntual como datos compartidos por tag puede llamar a los dos.

```ts
'use server'

import { revalidatePath, revalidateTag } from 'next/cache';

export async function actualizarPost(id: string) {
  await guardarCambios(id);
  revalidatePath('/blog');   // refresca esa página ya
  revalidateTag('posts');    // refresca cualquier otra página que use esos datos
}
```

## Estrategias de invalidación en una mirada

| Función | Invalida por | Alcance |
| --- | --- | --- |
| `revalidatePath(path)` | Ruta específica | Esa página (o layout + todo lo anidado, con `'layout'`) |
| `revalidatePath(patron, 'page')` | Patrón de ruta dinámica | Todas las páginas que matchean ese `page.tsx` |
| `revalidateTag(tag)` | Etiqueta de datos | Cualquier página que use un fetch con esa tag, sin importar la ruta |

## Consistencia, alcance y errores

- Con `rewrites` configurados en `next.config`, `revalidatePath` necesita el path de **destino** (la ubicación real del archivo de ruta), no el que el usuario ve en la URL — son distintos cuando hay un rewrite de por medio.
- Llamado desde un Server Action, actualiza la UI en la misma respuesta si estás viendo esa ruta ahora mismo. Llamado desde un Route Handler, solo marca la ruta para revalidar en la próxima visita — no dispara nada de inmediato.
- Ninguna de las dos funciona en Client Components ni en `proxy.ts` — ambas son server-only, por diseño (necesitan tocar la caché del servidor directamente).
