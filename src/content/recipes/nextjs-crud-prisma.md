---
title: CRUD con Prisma en Next.js
description: Las 5 operaciones sobre "posts", combinando Route Handlers y Server Actions con revalidatePath para refrescar la UI.
category: backend
stack: nextjs
order: 8
tags: [nextjs, crud, prisma]
problem: Un CRUD real que compara Route Handler y Server Action y refresca la UI después de una mutación sin recargar la página.
technologies: [guides/nextjs-prisma, guides/nextjs-api-rest]
updatedAt: 2026-08-16
---

## El repository (compartido)

```ts title="repositories/posts.repository.ts"
import { prisma } from '@/lib/prisma';

export const postsRepository = {
  findAll: () => prisma.post.findMany(),
  findById: (id: string) => prisma.post.findUnique({ where: { id } }),
  create: (data: { title: string; authorId: string }) => prisma.post.create({ data }),
  update: (id: string, data: { title?: string }) => prisma.post.update({ where: { id }, data }),
  delete: (id: string) => prisma.post.delete({ where: { id } }),
};
```

## Leer (GET): Route Handler

```ts title="app/api/posts/route.ts"
import { NextResponse } from 'next/server';
import { postsRepository } from '@/repositories/posts.repository';

export async function GET() {
  const posts = await postsRepository.findAll();
  return NextResponse.json(posts);
}
```

## Crear/actualizar/borrar: Server Actions con `revalidatePath`

```ts title="app/actions/posts.ts"
'use server';

import { revalidatePath } from 'next/cache';
import { auth } from '@/lib/auth';
import { postsRepository } from '@/repositories/posts.repository';

export async function crearPost(formData: FormData) {
  const session = await auth();
  if (!session?.user) throw new Error('No autenticado');

  await postsRepository.create({
    title: formData.get('title') as string,
    authorId: session.user.id,
  });

  revalidatePath('/posts'); // la página de listado se refresca con el dato nuevo
}

export async function eliminarPost(id: string) {
  await postsRepository.delete(id);
  revalidatePath('/posts');
}
```

`revalidatePath` es lo que hace que la Server Component de listado (`/posts`) muestre el dato actualizado en la siguiente navegación/render, sin necesitar un `fetch` manual desde el cliente ni recargar toda la página — ver [Revalidación de paths](/guides/nextjs-revalidate-path) para el mecanismo completo.

## Consumir desde un Server Component + formulario

```tsx title="app/posts/page.tsx"
import { postsRepository } from '@/repositories/posts.repository';
import { crearPost, eliminarPost } from '@/app/actions/posts';

export default async function PostsPage() {
  const posts = await postsRepository.findAll();

  return (
    <>
      <form action={crearPost}>
        <input name="title" placeholder="Título" required />
        <button type="submit">Crear</button>
      </form>

      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            {post.title}
            <form action={eliminarPost.bind(null, post.id)}>
              <button type="submit">Eliminar</button>
            </form>
          </li>
        ))}
      </ul>
    </>
  );
}
```

`eliminarPost.bind(null, post.id)` pre-carga el `id` como primer argumento de la action — el patrón estándar para pasarle un valor fijo a una Server Action desde un `form action`, que solo puede invocarla con el `FormData` del form.

## Consideraciones

- Sin `revalidatePath` (o `revalidateTag`), la página de listado seguiría mostrando datos cacheados/viejos después de crear o eliminar un post — es un paso fácil de olvidar y la causa más común de "creé el post pero no aparece en la lista".
- Este mismo CRUD también podría exponerse completo como Route Handlers (`POST`/`PATCH`/`DELETE` en `app/api/posts/route.ts`) si algo externo a la propia app necesita consumirlo — ver [API REST con Route Handlers](/guides/nextjs-api-rest).
