---
title: Prisma en Astro
description: Conectar Prisma 7 a endpoints y Actions de Astro usando una base compartida y autorización en el servidor.
type: guides
order: 7
tags: [astro, prisma, database, orm]
website: https://www.prisma.io
related: [database/database-prisma/prisma-configuracion, backend/astro/astro-backend-arquitectura, frontend/astro/astro-server-actions]
updatedAt: 2026-09-07
---

Astro puede consultar Prisma desde páginas de servidor, endpoints y Actions. La consulta ocurre donde se ejecuta esa ruta: durante el build si se prerenderiza, o en cada petición si se renderiza bajo demanda.

## Requisitos

Completa [Prisma 7 con PostgreSQL](/database/database-prisma/prisma-configuracion): esquema, migraciones, cliente `src/lib/prisma.ts` y prueba de lectura/escritura. Esta integración usa un servidor Node y el mismo esquema `User`/`Post`.

Para atender peticiones en ejecución necesitas un adapter. En un proyecto Astro existente:

```bash
pnpm exec astro add node
```

Comprueba que el adapter quede configurado y elige `output: "server"` si la mayoría de las rutas son dinámicas. También puedes conservar salida estática y marcar las rutas necesarias con `prerender = false`.

## Implementación: endpoint de lectura

```ts title="src/pages/api/posts.ts"
import type { APIRoute } from "astro"
import { prisma } from "../../lib/prisma"

export const prerender = false

export const GET: APIRoute = async () => {
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

La respuesta pública incluye solo posts publicados y dos campos. Limitar filas evita devolver toda la tabla, pero no implementa navegación entre páginas; añade paginación cuando el listado la necesite.

## Implementación: Action autenticada

Esta parte requiere [autenticación en Astro](/backend/astro/astro-better-auth): middleware que verifica la sesión, `App.Locals` tipado y `locals.user.id` correspondiente a un `User` persistido. No basta con aceptar un identificador enviado por el navegador.

Crea también el servicio `src/lib/posts.ts` de la guía compartida, que valida el título y aplica el límite con una transacción serializable.

```ts title="src/actions/posts.ts"
import { ActionError, defineAction } from "astro:actions"
import { z } from "astro/zod"
import { crearPostConLimite } from "../lib/posts"

export const posts = {
  crear: defineAction({
    accept: "form",
    input: z.object({ title: z.string().trim().min(1).max(200) }),
    handler: async (input, context) => {
      const user = context.locals.user
      if (!user) throw new ActionError({ code: "UNAUTHORIZED", message: "Inicia sesión" })

      const post = await crearPostConLimite(user.id, input.title)
      return { id: post.id, title: post.title }
    }
  })
}
```

Registra el grupo para que Astro lo exponga:

```ts title="src/actions/index.ts"
import { posts } from "./posts"

export const server = { posts }
```

Si ya hay otras Actions, añade `posts` al objeto existente. No sobrescribas sus registros.

```astro title="src/pages/nuevo-post.astro"
---
import { actions } from "astro:actions"
export const prerender = false
const result = Astro.getActionResult(actions.posts.crear)
---
<form method="POST" action={actions.posts.crear}>
  <label for="title">Título</label>
  <input id="title" name="title" required maxlength="200" />
  <button>Crear post</button>
</form>
{result?.error && <p role="alert">No se pudo crear el post. Revisa el título y tu sesión.</p>}
{result?.data && <p role="status">Creado: {result.data.title}</p>}
```

La acción vuelve a verificar la identidad aunque la página ya la haya comprobado. El formulario ofrece feedback sin necesitar una isla React. Añade errores de negocio específicos y protección ante envíos duplicados si el flujo lo requiere.

## Comprobación

1. Abre `/api/posts`: devuelve `[]` en una base sin posts publicados.
2. Publica un post desde un entorno de desarrollo y repite la petición: aparece con `id` y `title`.
3. Envía el formulario sin sesión: la Action lo rechaza y la tabla no cambia.
4. Con sesión válida, crea un título y comprueba su `authorId` en la base. Un título vacío o mayor de 200 caracteres debe rechazarse también sin depender de HTML.
5. Detén la base: el endpoint responde 500 con un mensaje público; registra el diagnóstico detallado en el servidor.

## Límites y recursos

No importes Prisma desde scripts del navegador ni componentes hidratados. Esta receta corresponde a Node; otro adapter puede requerir otro driver y otra estrategia de conexiones.

El CRUD, las relaciones, las migraciones y las transacciones están en la [guía compartida](/database/database-prisma/prisma-configuracion), para que las tres integraciones usen el mismo contrato.

- [Astro: renderizado bajo demanda](https://docs.astro.build/en/guides/on-demand-rendering/)
- [Astro Actions](https://docs.astro.build/en/guides/actions/)
