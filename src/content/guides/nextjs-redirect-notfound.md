---
title: "redirect() y notFound()"
description: Funciones que cortan el render y navegan o muestran el 404 — de dónde se pueden llamar y cómo difieren.
category: frontend
stack: nextjs
order: 9
tags: [nextjs, routing]
scope: next.js (next/navigation)
related:
  - guides/nextjs-page-error-loading
updatedAt: 2026-08-16
---

Ambas funcionan igual por dentro: lanzan un error especial que Next.js intercepta para cortar el render en ese punto y mostrar otra cosa — no son un `return` normal.

## `redirect()`

Se puede llamar en Server Components, Route Handlers y Server Actions.

```tsx title="app/team/[id]/page.tsx"
import { redirect } from 'next/navigation';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const team = await fetchTeam(id);

  if (!team) {
    redirect('/login');
  }

  return <h1>{team.name}</h1>;
}
```

No hace falta `return redirect(...)` — la función tiene tipo `never`, TypeScript ya sabe que el código después no se ejecuta.

## `notFound()`

Corta el render y muestra el `not-found.tsx` más cercano en el árbol de esa ruta (ver [page.tsx, error.tsx, loading.tsx](/guides/nextjs-page-error-loading)).

```tsx title="app/blog/[slug]/page.tsx"
import { notFound } from 'next/navigation';

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await fetchPost(slug);

  if (!post) {
    notFound();
  }

  return <h1>{post.title}</h1>;
}
```

## Diferencia clave: cuándo usar cada una

`redirect()` es "esto existe, pero en otro lado" (login, otra URL). `notFound()` es "esto no existe" — responde con status semánticamente distinto (404) en vez de una redirección.

## En un Server Action

```ts title="app/actions.ts"
'use server'

import { redirect } from 'next/navigation';

export async function crearPost(formData: FormData) {
  const post = await guardarPost(formData);
  redirect(`/blog/${post.slug}`);
}
```

En un Server Action, `redirect()` usa `push` por defecto (agrega una entrada al historial) en vez de `replace` — se puede forzar con el segundo argumento si hace falta lo contrario.

## Resumen

| Función | Efecto | Dónde se puede llamar |
| --- | --- | --- |
| `redirect(ruta)` | Navega a otra ruta, corta el render actual | Server Components, Route Handlers, Server Actions |
| `notFound()` | Muestra el `not-found.tsx` más cercano | Server Components, Route Handlers, Server Actions |
| `permanentRedirect(ruta)` | Como `redirect`, pero devuelve 308 en vez de 307 | Igual que `redirect` |

## Consideraciones

- Con `try/catch`, `redirect()` y `notFound()` tienen que llamarse **fuera** del `try` — ambas lanzan internamente, y un `catch` demasiado amplio las atraparía como si fueran un error real.
- `redirect()` en un Client Component solo funciona durante el render, no dentro de un event handler (`onClick`) — para navegar desde un handler, usar `useRouter().push()` en su lugar.
- Si el recurso simplemente no existe (vs. "existe pero hay que ir a otro lado"), `notFound()` es la señal semánticamente correcta — mandar todo a `redirect('/404')` a mano pierde el status code 404 real.
