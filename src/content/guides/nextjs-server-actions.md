---
title: Server Actions
description: Mutar datos con 'use server' — un solo roundtrip que devuelve el resultado Y la UI actualizada, más las protecciones de seguridad que trae el framework.
category: frontend
stack: nextjs
order: 21
tags: [nextjs, forms, backend]
scope: next.js (use server)
related:
  - guides/nextjs-directivas
  - guides/react-useactionstate
  - libraries/zod
updatedAt: 2026-08-25
---

Una Server Action es una función marcada con `'use server'`, invocada desde un `<form action>`, un event handler, o una transición del cliente. Next.js la trata como un POST hacia la ruta que la usa.

## Definir y usar una

```ts title="app/posts/actions.ts"
'use server'

import { revalidatePath } from 'next/cache';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';

export async function crearPost(formData: FormData) {
  const session = await auth();
  if (!session?.user) throw new Error('No autenticado');

  await db.post.create({
    data: { title: String(formData.get('title')), authorId: session.user.id },
  });

  revalidatePath('/posts');
}
```

```tsx title="app/posts/nuevo/page.tsx"
import { crearPost } from '../actions';

export default function NuevoPost() {
  return (
    <form action={crearPost}>
      <input name="title" required />
      <button>Publicar</button>
    </form>
  );
}
```

## Un solo roundtrip para datos y UI

Cuando la acción llama a `revalidatePath`, `revalidateTag` o `updateTag`, cambia cookies o ejecuta `redirect()`, Next.js vuelve a renderizar la ruta actual en el servidor **dentro de la misma respuesta HTTP** — no hace falta un segundo `fetch` para ver la UI actualizada después del envío. Esto es distinto a un endpoint REST tradicional donde tú inicias la nueva consulta manualmente.

## Las actions se despachan de a una

El cliente de Next.js manda las Server Actions de un mismo usuario **secuencialmente**: si se disparan tres seguidas, la segunda espera a que termine la primera. Esto mantiene consistente el árbol re-renderizado con la acción que lo produjo — pero significa que `Promise.all` sobre varias Server Actions desde el cliente no las paraleliza de verdad. Para trabajo en paralelo, hazlo adentro directamente sola action.

## Seguridad — lo que el framework protege, y lo que no

Cada Server Action es un endpoint POST alcanzable por cualquiera que sepa la URL, no solo desde tu formulario. Next.js aplica algunas protecciones automáticas:

- **Chequeo CSRF**: compara `Origin` contra `Host`, rechaza si no coinciden.
- **Límite de tamaño del body**: 1MB por defecto (configurable).
- **IDs de action encriptados**: las actions no usadas se eliminan del bundle de cliente, así que no quedan expuestas sin querer.

Ninguna de esas protecciones reemplaza la autorización dentro de la action — el renderizado condicional ("este botón solo se muestra si eres admin") **no** es una barrera de seguridad, porque la request se puede mandar sin pasar por tu UI.

```ts title="app/posts/actions.ts"
'use server'

export async function borrarPost(postId: string) {
  const session = await auth();
  if (!session?.user) throw new Error('No autenticado');

  // No confiar en que el cliente mande solo IDs de posts propios:
  // verificar ownership aquí, con datos del servidor.
  const post = await db.post.findFirst({ where: { id: postId, authorId: session.user.id } });
  if (!post) throw new Error('No autorizado');

  await db.post.delete({ where: { id: postId } });
}
```

## Contrato de una Action en una mirada

| Concepto | Qué significa |
| --- | --- |
| `'use server'` | Marca la función como Server Action |
| `<form action={miAction}>` | Forma más simple de invocarla, con progressive enhancement |
| `revalidatePath`/`revalidateTag` dentro de la action | La respuesta incluye la UI re-renderizada, sin fetch aparte |
| Despacho secuencial | Varias actions del mismo cliente no corren en paralelo entre sí |
| Autorización dentro de la action | Obligatoria — el framework no la reemplaza |

## Seguridad, errores y consistencia

- Validar `formData` con [Zod](/libraries/zod) antes de tocar la base de datos — nada de lo que llega a una action es confiable solo porque vino de tu propio formulario.
- Mandar solo el ID desde el cliente y volver a buscar el resto de los datos del lado del servidor (con el usuario de la sesión) evita que alguien mande un objeto completo con un `ownerId` falso.
- `redirect()` dentro de una Action interrumpe el flujo. Ejecuta `revalidatePath()` o `revalidateTag()` antes del redirect para que la invalidación ocurra.
