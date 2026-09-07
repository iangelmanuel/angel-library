---
title: Supabase en Next.js
description: Instalación, clients separados para servidor y cliente con @supabase/ssr, RLS y storage — todo lo necesario para el App Router.
type: guides
order: 8
tags: [nextjs, supabase, database]
website: https://supabase.com
related: [backend/nextjs/nextjs-backend-arquitectura]
updatedAt: 2026-08-17
---

Supabase es una base de datos Postgres gestionada con auth, storage y una API REST/realtime autogenerada, todo desde un client JS. En Next.js con App Router, el mismo código puede correr tanto en servidor (Server Components, Route Handlers) como en cliente (Client Components) — Supabase necesita un client distinto para cada contexto, vía el paquete `@supabase/ssr`.

## Instalación

```bash
npm install @supabase/ssr @supabase/supabase-js
```

## Configuración rápida — de cero a un Server Component funcionando

**1. Crear el proyecto en [supabase.com](https://supabase.com)** y copiar URL + keys.

**2. Variables de entorno:**

```bash title=".env"
NEXT_PUBLIC_SUPABASE_URL=https://tuproyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key
```

`NEXT_PUBLIC_` es el prefijo que Next.js expone al navegador — la anon key lo necesita; la service role key **nunca** debe llevar ese prefijo, o quedaría en el bundle del cliente.

**3. Client de servidor** (Server Components, Route Handlers) — lee/escribe la sesión desde las cookies de Next.js:

```ts title="lib/supabase/server.ts"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        }
      }
    }
  )
}
```

**4. Client de navegador** (Client Components):

```ts title="lib/supabase/client.ts"
import { createBrowserClient } from "@supabase/ssr"

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

**5. Un Server Component real:**

```tsx title="app/posts/page.tsx"
import { createClient } from "@/libs/supabase/server"

export default async function PostsPage() {
  const supabase = await createClient()
  const { data: posts } = await supabase.from("posts").select("*")

  return (
    <ul>
      {posts?.map((p) => (
        <li key={p.id}>{p.title}</li>
      ))}
    </ul>
  )
}
```

## CRUD con la API autogenerada

```ts
const { data, error } = await supabase.from('posts').select('*').eq('published', true);
const { data, error } = await supabase.from('posts').insert({ title: 'Nuevo' }).select().single();
const { data, error } = await supabase.from('posts').update({ published: true }).eq('id', postId);
const { error } = await supabase.from('posts').delete().eq('id', postId);
```

## Row Level Security (RLS)

Con el client de `@supabase/ssr` (anon key + cookies de sesión), RLS **sí aplica** — a diferencia de usar la service role key, aquí las políticas de Postgres son las que deciden qué fila puede tocar cada usuario:

```sql
create policy "Los usuarios ven sus propios posts"
on posts for select
using (auth.uid() = author_id);
```

## Operaciones admin: client con service role, sin RLS

Para operaciones que necesitan saltarse RLS (tareas admin, jobs de servidor):

```ts title="app/api/admin/posts/route.ts"
import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // sin prefijo NEXT_PUBLIC_
)

export async function GET() {
  const { data } = await supabaseAdmin.from("posts").select("*") // ve TODO, sin RLS
  return NextResponse.json(data)
}
```

Este client usa `@supabase/supabase-js` directo (no `@supabase/ssr`) porque no necesita manejar cookies de sesión de usuario — actúa siempre como admin.

## Refrescar la sesión en el proxy

```ts title="proxy.ts"
import { createServerClient } from "@supabase/ssr"
import { NextResponse } from "next/server"

export default async function proxy(req: Request) {
  const res = NextResponse.next()
  // crear el client con cookies del request/response, llamar a supabase.auth.getUser()
  // refresca el token de sesión automáticamente si expiró, antes de que la request siga
  return res
}
```

## Capacidades de Supabase en Next.js

| Client                                                    | Para qué                                                                  |
| --------------------------------------------------------- | ------------------------------------------------------------------------- |
| `createServerClient` (`@supabase/ssr`)                    | Server Components, Route Handlers — respeta RLS con la sesión del usuario |
| `createBrowserClient` (`@supabase/ssr`)                   | Client Components                                                         |
| `createClient` con service role (`@supabase/supabase-js`) | Operaciones admin, sin RLS, solo servidor                                 |

## Claves, RLS y Server Components

- `@supabase/ssr` reemplazó al viejo `@supabase/auth-helpers-nextjs` (deprecado) — si aparece código con ese paquete viejo, `@supabase/ssr` es la versión actual.
- La anon key necesita el prefijo `NEXT_PUBLIC_`; la service role key nunca.
- No es mutuamente excluyente con [Prisma](/backend/nextjs/nextjs-prisma) — se puede combinar Prisma para queries complejas y Supabase solo para auth/storage/realtime.
