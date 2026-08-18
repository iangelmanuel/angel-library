---
title: Supabase + Express
description: Un endpoint Express que lee/escribe en Supabase con la service role key, y otro que verifica un usuario autenticado vía Supabase Auth.
category: backend
stack: express
order: 29
tags: [express, supabase, database]
problem: Conectar Express a un proyecto Supabase ya creado, para datos y para verificar sesiones de un frontend que usa Supabase Auth.
technologies: [guides/express-supabase]
updatedAt: 2026-08-16
---

## Contexto

Escenario típico: el frontend (una SPA separada) usa `supabase.auth` directo para login, y Express es la API que sirve datos — necesita verificar el token que el frontend le manda, y leer/escribir en las tablas con permisos elevados.

## Paso 1: instalar y configurar

```bash
npm install express @supabase/supabase-js
```

```env title=".env"
SUPABASE_URL=https://tuproyecto.supabase.co
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key
```

```ts title="lib/supabase.ts"
import { createClient } from '@supabase/supabase-js';

export const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);
```

## Paso 2: middleware que verifica el token del frontend

```ts title="middlewares/requireAuth.ts"
import type { Request, Response, NextFunction } from 'express';
import { supabaseAdmin } from '../lib/supabase';

declare global {
  namespace Express {
    interface Request {
      user?: { id: string; email?: string };
    }
  }
}

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'No autenticado' });

  const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !user) return res.status(401).json({ error: 'Token inválido' });

  req.user = { id: user.id, email: user.email };
  next();
}
```

## Paso 3: endpoint que usa el `user.id` para filtrar datos propios

```ts title="app.ts"
import express from 'express';
import { supabaseAdmin } from './lib/supabase';
import { requireAuth } from './middlewares/requireAuth';

const app = express();
app.use(express.json());

app.get('/mis-posts', requireAuth, async (req, res) => {
  const { data, error } = await supabaseAdmin
    .from('posts')
    .select('*')
    .eq('author_id', req.user!.id); // filtra explícito, no depende de RLS acá (service role la salta)

  if (error) return res.status(500).json({ error: 'Error al leer posts' });
  res.json(data);
});

app.post('/posts', requireAuth, async (req, res) => {
  const { data, error } = await supabaseAdmin
    .from('posts')
    .insert({ title: req.body.title, author_id: req.user!.id })
    .select()
    .single();

  if (error) return res.status(500).json({ error: 'Error al crear post' });
  res.status(201).json(data);
});
```

## Por qué el filtro `.eq('author_id', ...)` es explícito acá

Con la `SERVICE_ROLE_KEY`, RLS **no aplica** — así que a diferencia de un cliente frontend con la `ANON_KEY` (donde RLS filtraría solo por confiar en las políticas), acá el propio código de Express es responsable de esa lógica. Olvidar el `.eq()` expondría posts de cualquier usuario, no solo del autenticado.

## Consideraciones

- Este patrón (frontend hace login directo contra Supabase, backend solo verifica el token) es común cuando Supabase Auth ya resuelve todo el login/registro y Express solo necesita saber "quién es" para aplicar su propia lógica.
- Alternativa: si Express también maneja el login (en vez del frontend), usar [JWT manual](/recipes/express-auth-completa) o [better-auth](/guides/express-better-auth) en su lugar, y Supabase solo como base de datos (sin usar `supabase.auth` en absoluto).
