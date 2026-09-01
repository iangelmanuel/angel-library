---
title: API protegida en Next.js
description: Auth + validación + rate limiting combinados en un Route Handler, con la misma lógica que la versión Express.
type: recipes
order: 9
tags: [nextjs, security, auth]
problem: Ver todas las capas de protección aplicadas dentro de un Route Handler, sin la cadena de middlewares por ruta que tiene Express.
technologies:
  - backend/nextjs/nextjs-backend-arquitectura
  - general/packages/zod
  - backend/express/express-roles-permisos
updatedAt: 2026-08-16
---

## El mismo checklist que en Express

[API protegida (Express)](/backend/express/express-api-protegida) documenta el checklist completo: auth → rol → rate limit → validación. En Next.js, sin cadena de middlewares específica por Route Handler, esas capas se resuelven dentro del handler (además de `proxy.ts` para protección amplia, ver [Backend en Next.js](/backend/nextjs/nextjs-backend-arquitectura)).

```ts title="app/api/admin/usuarios/[id]/route.ts"
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { auth } from '@/libs/auth';
import { checarRateLimit } from '@/libs/rate-limit';
import { prisma } from '@/libs/prisma';

const actualizarUsuarioSchema = z.object({
  rol: z.enum(['user', 'moderador', 'admin']).optional(),
  activo: z.boolean().optional(),
});

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  // 1. ¿quién eres?
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: { code: 'NO_AUTENTICADO' } }, { status: 401 });
  }

  // 2. ¿puedes hacer esto?
  if (session.user.rol !== 'admin') {
    return NextResponse.json({ error: { code: 'SIN_PERMISO' } }, { status: 403 });
  }

  // 3. ¿estás abusando de este endpoint?
  const ip = request.headers.get('x-forwarded-for') ?? 'desconocida';
  const dentroDelLimite = await checarRateLimit(ip, { max: 30, windowMs: 15 * 60 * 1000 });
  if (!dentroDelLimite) {
    return NextResponse.json({ error: { code: 'RATE_LIMIT' } }, { status: 429 });
  }

  // 4. ¿el body tiene forma válida?
  const body = await request.json();
  const resultado = actualizarUsuarioSchema.safeParse(body);
  if (!resultado.success) {
    return NextResponse.json(
      { error: { code: 'VALIDATION_ERROR', fields: resultado.error.flatten().fieldErrors } },
      { status: 400 },
    );
  }

  const { id } = await params;
  const usuario = await prisma.user.update({ where: { id }, data: resultado.data });
  return NextResponse.json(usuario);
}
```

## Rate limiting real: no en memoria en producción

A diferencia de un servidor Express de proceso largo, Next.js en producción (especialmente en plataformas serverless/edge como Vercel) puede correr **múltiples instancias** del mismo Route Handler en paralelo, cada una con su propia memoria — un rate limiter en memoria simple no comparte el conteo entre instancias, así que en la práctica el límite real termina siendo mucho más alto que el configurado. Para Next.js en ese tipo de despliegue, un store compartido (Upstash Redis, o el rate limiting nativo de la plataforma) es la opción correcta desde el principio, no una optimización posterior.

```bash
npm install @upstash/ratelimit @upstash/redis
```

```ts title="lib/rate-limit.ts"
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(30, '15 m'),
});

export async function checarRateLimit(ip: string) {
  const { success } = await ratelimit.limit(ip);
  return success;
}
```

## Resumen

| Capa | Dónde vive en Next.js |
| --- | --- |
| Auth | `proxy.ts` (protección amplia) + `auth()` dentro del handler |
| Rol/permisos | `if` dentro del handler |
| Rate limiting | Store compartido (Upstash) — no memoria local, por el modelo serverless |
| Validación | Zod, `safeParse` dentro del handler |

## Consideraciones

- Esta es la diferencia más importante frente a Express/Astro: el rate limiting en memoria que "funciona" en un servidor de proceso único **no funciona de verdad** en un despliegue serverless con múltiples instancias — vale la pena resolverlo con un store compartido desde el principio en Next.js, no como optimización tardía.
- El resto del razonamiento (orden de las capas, por qué validar al final) es idéntico al de [API protegida (Express)](/backend/express/express-api-protegida).
