---
title: API protegida en Astro
description: Auth + validación + rate limiting combinados en un endpoint de Astro, con la misma lógica que la versión Express.
category: backend
stack: astro
order: 9
tags: [astro, security, auth]
problem: Ver todas las capas de protección aplicadas dentro de un endpoint de Astro, sin la cadena de middlewares por ruta que tiene Express.
technologies:
  - guides/astro-backend-arquitectura
  - libraries/zod
  - guides/express-roles-permisos
updatedAt: 2026-08-16
---

## El mismo checklist que en Express, sin middleware por ruta

[API protegida (Express)](/recipes/express-api-protegida) documenta el checklist completo: auth → rol → rate limit → validación. En Astro, sin cadena de middlewares específica por endpoint, esas capas se resuelven dentro del handler mismo (además del middleware global de auth que puebla `locals.user`).

```ts title="src/pages/api/admin/usuarios/[id].ts"
import type { APIRoute } from 'astro';
import { z } from 'zod';
import { checarRateLimit } from '../../../../lib/rate-limit';
import { prisma } from '../../../../lib/prisma';

const actualizarUsuarioSchema = z.object({
  rol: z.enum(['user', 'moderador', 'admin']).optional(),
  activo: z.boolean().optional(),
});

export const PATCH: APIRoute = async ({ params, request, locals, clientAddress }) => {
  // 1. ¿quién eres? (ya resuelto por el middleware global, ver Backend en Astro)
  if (!locals.user) {
    return new Response(JSON.stringify({ error: { code: 'NO_AUTENTICADO' } }), { status: 401 });
  }

  // 2. ¿puedes hacer esto?
  if (locals.user.rol !== 'admin') {
    return new Response(JSON.stringify({ error: { code: 'SIN_PERMISO' } }), { status: 403 });
  }

  // 3. ¿estás abusando de este endpoint?
  const dentroDelLimite = await checarRateLimit(clientAddress, { max: 30, windowMs: 15 * 60 * 1000 });
  if (!dentroDelLimite) {
    return new Response(JSON.stringify({ error: { code: 'RATE_LIMIT' } }), { status: 429 });
  }

  // 4. ¿el body tiene forma válida?
  const body = await request.json();
  const resultado = actualizarUsuarioSchema.safeParse(body);
  if (!resultado.success) {
    return new Response(
      JSON.stringify({ error: { code: 'VALIDATION_ERROR', fields: resultado.error.flatten().fieldErrors } }),
      { status: 400 },
    );
  }

  const usuario = await prisma.user.update({ where: { id: params.id }, data: resultado.data });
  return new Response(JSON.stringify(usuario), { headers: { 'Content-Type': 'application/json' } });
};
```

## Un rate limiter simple (en memoria, para un solo proceso)

```ts title="src/libs/rate-limit.ts"
const intentos = new Map<string, { count: number; resetAt: number }>();

export async function checarRateLimit(
  ip: string,
  { max, windowMs }: { max: number; windowMs: number },
): Promise<boolean> {
  const ahora = Date.now();
  const registro = intentos.get(ip);

  if (!registro || ahora > registro.resetAt) {
    intentos.set(ip, { count: 1, resetAt: ahora + windowMs });
    return true;
  }

  if (registro.count >= max) return false;

  registro.count++;
  return true;
}
```

## Resumen

| Capa | Dónde vive en Astro |
| --- | --- |
| Auth | Middleware global (`locals.user`), chequeado al inicio del handler |
| Rol/permisos | `if` dentro del handler (o un helper reusable como `requierePermiso` en Express) |
| Rate limiting | Función propia, o un servicio externo (Upstash, Cloudflare) en producción real |
| Validación | Zod, `safeParse` dentro del handler |

## Consideraciones

- El rate limiter en memoria del ejemplo no se comparte entre instancias ni sobrevive un reinicio. En producción con más de una instancia, usa un store compartido como Redis o un servicio compatible.
- El razonamiento de "por qué ese orden" (barato primero, validación al final) es el mismo que en [API protegida (Express)](/recipes/express-api-protegida) — no cambia por el framework, solo la sintaxis de dónde se escribe cada chequeo.
