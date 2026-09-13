---
title: Prisma en Next.js
description: Consultar Prisma 7 desde Route Handlers y Server Actions con runtime Node, sesión verificada y revalidación.
type: guides
sidebar:
  order: 7
tags: [nextjs, prisma, database, orm]
website: https://www.prisma.io
related: [database/database-prisma/prisma-configuracion, backend/nextjs/nextjs-backend-arquitectura, backend/nextjs/nextjs-auth-js]
updatedAt: 2026-09-07
---

En App Router, Prisma se ejecuta desde código del servidor. Un Server Component puede consultar la base directamente; un Route Handler sirve datos a clientes HTTP y una Server Action atiende una mutación desde la interfaz.

## Requisitos

Completa [Prisma 7 con PostgreSQL](/database/database-prisma/prisma-configuracion), incluida la generación del cliente y la prueba de lectura/escritura. Esta guía usa `src/app` y el alias `@/*` hacia `src/*`. Si tu proyecto usa `app` en la raíz, ajusta las rutas de forma consistente.

Usa **runtime Node** para `@prisma/adapter-pg`. El cliente `src/lib/prisma.ts` compartido ya evita recreaciones por hot reload. No crees otro `PrismaClient` dentro de cada handler.

## Implementación: Route Handler

```ts title="src/app/api/posts/route.ts"
import { prisma } from "@/lib/prisma"

export const runtime = "nodejs"

export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      where: { published: true },
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      take: 20,
      select: { id: true, title: true }
    })
    return Response.json(posts)
  } catch {
    return Response.json({ error: "No se pudieron cargar los posts" }, { status: 500 })
  }
}
```

Publica solo los campos necesarios. Este listado entrega hasta 20 registros: añade cursor y enlaces de navegación para recorrer más resultados.

## Implementación: Server Action

Este fragmento requiere [Auth.js configurado](/backend/nextjs/nextjs-auth-js), un helper `auth` exportado desde `src/auth.ts` y el servicio `src/lib/posts.ts` de la guía compartida. El usuario autenticado debe existir en el modelo `User`; combina correctamente el esquema de autenticación antes de migrar.

```ts title="src/app/actions/posts.ts"
"use server"

import { revalidatePath } from "next/cache"
import { auth } from "@/auth"
import { crearPostConLimite } from "@/lib/posts"

export async function crearPost(formData: FormData): Promise<void> {
  const session = await auth()
  const authorId = session?.user?.id
  if (!authorId) throw new Error("No autenticado")

  const title = formData.get("title")
  if (typeof title !== "string" || !title.trim() || title.trim().length > 200) {
    throw new Error("El título debe tener entre 1 y 200 caracteres")
  }

  await crearPostConLimite(authorId, title)
  revalidatePath("/posts")
}
```

La sesión se comprueba dentro de la Action porque puede invocarse independientemente del render de la página. El ID del autor procede de esa sesión, nunca del formulario. La transacción y sus reintentos están centralizados en el servicio.

Ejemplo mínimo de invocación:

```tsx title="src/app/nuevo-post/page.tsx"
import { crearPost } from "../actions/posts"

export const runtime = "nodejs"

export default function NuevoPost() {
  return (
    <form action={crearPost}>
      <label htmlFor="title">Título</label>
      <input id="title" name="title" required maxLength={200} />
      <button>Crear post</button>
    </form>
  )
}
```

Este formulario enseña la conexión con la Action. Para una interfaz terminada, devuelve errores esperados como estado con [useActionState](/frontend/react/react-useactionstate), muestra confirmación y deshabilita el envío pendiente. Los errores lanzados inesperados llegan al límite de errores; no son una estrategia de mensajes de validación.

`revalidatePath("/posts")` invalida la ruta indicada; no sincroniza automáticamente cualquier caché externa ni actualiza por sí mismo todas las pestañas abiertas. Debe corresponder a la página donde presentas los posts.

## Comprobación

1. Consulta `/api/posts` con la base vacía: responde `[]`.
2. Crea un post publicado y confirma que solo expone `id` y `title`.
3. Invoca la Action sin sesión y comprueba que no se inserta nada.
4. Con sesión, envía un título válido; revisa el autor persistido y la actualización de `/posts`.
5. Prueba un valor de formulario que no sea texto y dos peticiones simultáneas en el límite, siguiendo la comprobación de la guía compartida.

## Límites y recursos

- Prisma y su conexión permanecen en el servidor. No importes ese módulo dentro de una frontera `"use client"`.
- En serverless cada instancia puede abrir su propio pool. El singleton de desarrollo no impone un límite global.
- Genera el cliente en el build y aplica migraciones existentes mediante `prisma migrate deploy` en el proceso de despliegue.
- La configuración de caché de tu versión de Next.js puede cambiar cuándo se ejecuta una consulta. Declara y comprueba la política de la ruta.

Consulta el [CRUD y las transacciones compartidas](/database/database-prisma/prisma-configuracion) y la [documentación de Prisma](https://www.prisma.io/docs). Para mutaciones: [Next.js Server Functions](https://nextjs.org/docs/app/getting-started/updating-data).
