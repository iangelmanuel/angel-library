---
title: Variables de entorno en Next.js
description: Carga desde .env, variables privadas y NEXT_PUBLIC_, validación temprana y diferencias entre build y runtime.
category: frontend
stack: nextjs
order: 24
tags: [nextjs, config, environment, security]
scope: next.js environment variables
related:
  - guides/nextjs-server-client-components
  - practices/validate-at-boundaries
updatedAt: 2026-08-18
---

Next.js carga archivos `.env*` y expone sus valores en `process.env`. Sin prefijo son server-only; con `NEXT_PUBLIC_` se reemplazan dentro del bundle del navegador durante el build.

```bash title=".env.local"
DATABASE_URL=postgresql://...
NEXT_PUBLIC_APP_NAME=Mi aplicación
```

```ts
const databaseUrl = process.env.DATABASE_URL;       // servidor
const appName = process.env.NEXT_PUBLIC_APP_NAME;   // servidor y navegador
```

## Orden y archivos

Usa `.env.local` para secretos locales y no lo versiones. `.env` puede contener defaults no sensibles. Los archivos específicos de entorno permiten separar test, development y production; evita duplicar secretos si la plataforma de despliegue ya los administra.

## Build time vs runtime

Una variable `NEXT_PUBLIC_` queda congelada al construir el bundle. Promover la misma imagen Docker entre ambientes no cambia ese valor: necesitas configuración obtenida en runtime desde el servidor si debe variar después del build.

Las variables privadas pueden leerse durante render server-side, Route Handlers y Server Actions. Si una ruta quedó prerenderizada, el valor usado será el disponible en build.

## Validar al iniciar

```ts title="src/env.ts"
import { z } from 'zod';

export const env = z.object({
  DATABASE_URL: z.url(),
  AUTH_SECRET: z.string().min(32),
}).parse(process.env);
```

Importá este módulo desde el código de servidor para fallar temprano con un mensaje claro. No uses una validación que lea `process.env` completo desde un Client Component.

## Seguridad

- El prefijo público es una decisión de exposición, no una conveniencia de acceso.
- Cambiar el nombre directamente key después de haberla publicado no la vuelve secreta: rotala.
- Los secretos no deben aparecer en logs, errores, props serializados ni respuestas JSON.

Referencia oficial: [Environment Variables](https://nextjs.org/docs/app/guides/environment-variables).
