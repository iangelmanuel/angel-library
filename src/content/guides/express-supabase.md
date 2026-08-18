---
title: Supabase en Express
description: Instalación, client con service role, RLS, auth incluida y storage — todo lo necesario para usar Supabase en un backend Express.
category: backend
stack: express
order: 14
tags: [express, supabase, database]
website: https://supabase.com
updatedAt: 2026-08-17
---

Supabase es una base de datos Postgres gestionada con una capa de servicios encima: auth (usuarios, sesiones, providers OAuth), storage (archivos), y una API REST/realtime autogenerada sobre las tablas — todo accesible desde un único client JS.

## Instalación

```bash
npm install @supabase/supabase-js
```

## Configuración rápida — de cero a un endpoint funcionando

**1. Crear el proyecto en [supabase.com](https://supabase.com)** y copiar la URL y las keys desde Project Settings → API.

**2. Variables de entorno:**

```env title=".env"
SUPABASE_URL=https://tuproyecto.supabase.co
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key
```

Un backend Express, corriendo en un entorno confiable, usa la **service role key** (no la anon key que usaría un frontend) — se salta Row Level Security por completo, porque el servidor mismo es responsable de aplicar la autorización correcta antes de tocar los datos.

**3. El client:**

```ts title="lib/supabase.ts"
import { createClient } from '@supabase/supabase-js';

export const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!, // NUNCA exponer esta key al cliente
);
```

**4. Un endpoint real:**

```ts title="app.ts"
import express from 'express';
import { supabaseAdmin } from './lib/supabase';

const app = express();
app.use(express.json());

app.get('/posts', async (req, res) => {
  const { data, error } = await supabaseAdmin.from('posts').select('*');
  if (error) return res.status(500).json({ error: 'Error al leer posts' });
  res.json(data);
});

app.listen(3000);
```

## CRUD con la API autogenerada

```ts
const { data, error } = await supabaseAdmin
  .from('posts')
  .select('*')
  .eq('published', true)
  .order('created_at', { ascending: false });

const { data, error } = await supabaseAdmin
  .from('posts')
  .insert({ title: 'Nuevo post', author_id: userId })
  .select()
  .single();

const { data, error } = await supabaseAdmin
  .from('posts')
  .update({ published: true })
  .eq('id', postId);

const { error } = await supabaseAdmin.from('posts').delete().eq('id', postId);
```

Cada llamada devuelve `{ data, error }` en vez de lanzar — el chequeo de `error` reemplaza al `try/catch`.

## Row Level Security (RLS)

RLS son políticas SQL en Postgres que deciden, fila por fila, qué puede leer/escribir cada usuario — es lo que hace seguro exponer la `ANON_KEY` en un cliente (frontend). Sin una política explícita, una tabla con RLS activado **rechaza todo** por defecto.

```sql
create policy "Los usuarios ven sus propios posts"
on posts for select
using (auth.uid() = author_id);
```

Con la **service role key** (como en este backend Express), RLS **no aplica** — el código del servidor es responsable de esa lógica, por ejemplo filtrando explícitamente:

```ts
app.get('/mis-posts', requireAuth, async (req, res) => {
  const { data, error } = await supabaseAdmin
    .from('posts')
    .select('*')
    .eq('author_id', req.user!.id); // filtro explícito — la service role no lo hace sola

  if (error) return res.status(500).json({ error: 'Error al leer' });
  res.json(data);
});
```

## Auth incluida (Supabase Auth)

Si el login lo maneja Supabase directamente (en vez de JWT manual, ver [JWT en Express](/guides/express-jwt), o [better-auth](/guides/express-better-auth)/[Auth.js](/guides/express-auth-js)):

```ts
const { data, error } = await supabaseAdmin.auth.signUp({ email, password });
const { data, error } = await supabaseAdmin.auth.signInWithPassword({ email, password });
```

Verificar el token que manda un frontend que ya hizo login con Supabase Auth:

```ts
app.get('/perfil', async (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);

  if (error || !user) return res.status(401).json({ error: 'No autenticado' });
  res.json({ userId: user.id });
});
```

`auth.uid()` (usado en las políticas RLS de arriba) es justamente el id del usuario autenticado en la sesión actual — la auth y las políticas de datos están pensadas para trabajar juntas cuando **no** se usa la service role key.

## Storage

```ts
const { data, error } = await supabaseAdmin.storage.from('avatars').upload('user-1.png', buffer);
const { data } = supabaseAdmin.storage.from('avatars').getPublicUrl('user-1.png');
```

## Resumen

| API | Qué hace |
| --- | --- |
| `createClient(url, serviceRoleKey)` | Instancia el client del lado del servidor |
| `.from('tabla').select/insert/update/delete()` | CRUD vía la API REST autogenerada |
| `{ data, error }` | Cada llamada devuelve esto, no lanza |
| RLS (`create policy ...`) | Controla qué fila puede tocar cada usuario, en la base misma — no aplica con service role |
| `supabase.auth.*` | Registro, login, verificar sesión |
| `supabase.storage.*` | Archivos |

## Consideraciones

- Con la service role key, el servidor es responsable de **toda** la lógica de autorización que RLS normalmente haría — un bug acá expone datos de cualquier usuario, no solo el propio.
- `SUPABASE_SERVICE_ROLE_KEY` es tan sensible como cualquier secreto de base de datos — ver [Variables de entorno en Node](/guides/node-env-vars).
- No es mutuamente excluyente con [Prisma](/guides/express-prisma) — es común usar Prisma para queries complejas con relaciones y tipos generados, y el client de Supabase solo para lo que Prisma no cubre (auth, storage, realtime). Ambos apuntan a la misma base Postgres.
