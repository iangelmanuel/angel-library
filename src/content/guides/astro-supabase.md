---
title: Supabase en Astro
description: Instalación, client del servidor, RLS, auth incluida y storage — todo lo necesario para usar Supabase con output "server".
category: backend
stack: astro
order: 8
tags: [astro, supabase, database]
website: https://supabase.com
related: [guides/astro-backend-arquitectura]
updatedAt: 2026-08-17
---

Supabase es una base de datos Postgres gestionada con una capa de servicios encima: auth, storage y una API REST/realtime autogenerada sobre las tablas, todo desde un único client JS.

## Instalación

```bash
npm install @supabase/supabase-js
```

## Configuración rápida — de cero a un endpoint funcionando

**1. Crear el proyecto en [supabase.com](https://supabase.com)** y copiar URL + keys desde Project Settings → API.

**2. Variables de entorno:**

```bash title=".env"
SUPABASE_URL=https://tuproyecto.supabase.co
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key
```

**3. El client:**

```ts title="src/libs/supabase.ts"
import { createClient } from '@supabase/supabase-js';

export const supabaseAdmin = createClient(
  import.meta.env.SUPABASE_URL,
  import.meta.env.SUPABASE_SERVICE_ROLE_KEY,
);
```

`import.meta.env` es la forma de leer variables de entorno en Astro — las que no llevan el prefijo `PUBLIC_` solo son legibles del lado del servidor, que es justo donde debe vivir la service role key.

**4. Un endpoint real:**

```ts title="src/pages/api/posts.ts"
import type { APIRoute } from 'astro';
import { supabaseAdmin } from '../../lib/supabase';

export const GET: APIRoute = async () => {
  const { data, error } = await supabaseAdmin.from('posts').select('*');
  if (error) return new Response(JSON.stringify({ error: 'Error al leer' }), { status: 500 });
  return new Response(JSON.stringify(data), { headers: { 'Content-Type': 'application/json' } });
};
```

Requiere `output: 'server'` en `astro.config.mjs`.

## CRUD con la API autogenerada

```ts
const { data, error } = await supabaseAdmin.from('posts').select('*').eq('published', true);
const { data, error } = await supabaseAdmin.from('posts').insert({ title: 'Nuevo', author_id: userId }).select().single();
const { data, error } = await supabaseAdmin.from('posts').update({ published: true }).eq('id', postId);
const { error } = await supabaseAdmin.from('posts').delete().eq('id', postId);
```

## Row Level Security (RLS)

RLS son políticas SQL que deciden, fila por fila, qué puede leer/escribir cada usuario — el mecanismo que hace seguro exponer una key en un cliente.

```sql
create policy "Los usuarios ven sus propios posts"
on posts for select
using (auth.uid() = author_id);
```

Con la service role key (como aquí), RLS **no aplica** — el filtro queda a cargo del código del endpoint:

```ts
export const GET: APIRoute = async ({ locals }) => {
  const { data, error } = await supabaseAdmin
    .from('posts')
    .select('*')
    .eq('author_id', locals.user?.id); // filtro explícito

  if (error) return new Response(JSON.stringify({ error: 'Error al leer' }), { status: 500 });
  return new Response(JSON.stringify(data), { headers: { 'Content-Type': 'application/json' } });
};
```

`locals.user` viene del middleware de auth ([better-auth](/guides/astro-better-auth) o [Auth.js](/guides/astro-auth-js)) — ver [Backend en Astro](/guides/astro-backend-arquitectura).

## Auth incluida (Supabase Auth)

Alternativa a better-auth/Auth.js si el proyecto ya está integrado con el ecosistema Supabase para todo:

```ts
const { data, error } = await supabaseAdmin.auth.signUp({ email, password });
```

Verificar la sesión en el middleware:

```ts title="src/middleware.ts"
import { defineMiddleware } from 'astro:middleware';
import { supabaseAdmin } from './lib/supabase';

export const onRequest = defineMiddleware(async (context, next) => {
  const token = context.cookies.get('sb-access-token')?.value;

  if (token) {
    const { data: { user } } = await supabaseAdmin.auth.getUser(token);
    context.locals.user = user;
  }

  return next();
});
```

## Storage

```ts
const { data, error } = await supabaseAdmin.storage.from('avatars').upload('user-1.png', buffer);
const { data } = supabaseAdmin.storage.from('avatars').getPublicUrl('user-1.png');
```

## Capacidades de Supabase en Astro

| API | Qué hace |
| --- | --- |
| `createClient(url, serviceRoleKey)` | Instancia el client del servidor |
| `.from('tabla').select/insert/update/delete()` | CRUD vía la API REST autogenerada |
| `{ data, error }` | Cada llamada devuelve esto, no lanza |
| RLS | Controla qué fila puede tocar cada usuario — no aplica con service role |
| `supabase.auth.*` | Alternativa a better-auth/Auth.js si el proyecto ya usa Supabase para todo |

## Claves, RLS y contexto de usuario

- Para la mayoría de los proyectos Astro con `output: 'server'`, [better-auth](/guides/astro-better-auth) o [Auth.js](/guides/astro-auth-js) son la elección recomendada para auth — Supabase Auth tiene sentido cuando el proyecto ya está fuertemente integrado con el resto del ecosistema Supabase.
- Con la service role key, la autorización queda en manos del código del endpoint — RLS no protege nada aquí.
- No es mutuamente excluyente con [Prisma](/guides/astro-prisma) — se puede combinar Prisma para queries complejas y Supabase solo para auth/storage/realtime.
