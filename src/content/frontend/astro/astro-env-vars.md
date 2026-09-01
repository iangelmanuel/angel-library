---
title: Variables de entorno
description: import.meta.env, el prefijo PUBLIC_, y astro:env para variables tipadas y validadas en build.
type: guides
order: 17
tags: [astro, config, security]
scope: astro (import.meta.env / astro:env)
updatedAt: 2026-08-25
---

Astro usa el sistema de variables de entorno de Vite por debajo — `.env` en la raíz del proyecto, accedidas con `import.meta.env` en vez del `process.env` de Node.

## `.env` y `import.meta.env`

```bash title=".env"
SECRET_API_KEY=abc123
PUBLIC_SITE_NAME=angel.library
```

```astro
---
const clave = import.meta.env.SECRET_API_KEY;      // solo disponible en el servidor
const nombre = import.meta.env.PUBLIC_SITE_NAME;   // disponible en servidor y cliente
---
```

El prefijo `PUBLIC_` es la única señal que decide si una variable viaja al bundle de cliente — todo lo demás queda server-only por diseño, no por convención a cuidar tú mismo.

## Variables incluidas por defecto

```ts
import.meta.env.MODE;      // "development" | "production"
import.meta.env.DEV;       // boolean
import.meta.env.PROD;      // boolean
import.meta.env.SITE;      // el `site` de astro.config.mjs
import.meta.env.BASE_URL;  // el `base` de astro.config.mjs
```

## `astro:env` — Tipadas y validadas

Para proyectos dondirectamente variable de entorno faltante debería fallar el build (no un `undefined` silencioso en producción), `astro:env` define un schema tipado.

```ts title="astro.config.mjs"
import { defineConfig, envField } from 'astro/config';

export default defineConfig({
  env: {
    schema: {
      API_URL: envField.string({ context: 'client', access: 'public' }),
      API_SECRET: envField.string({ context: 'server', access: 'secret' }),
      PORT: envField.number({ context: 'server', access: 'public', default: 4321 }),
    },
  },
});
```

```ts
import { API_URL } from 'astro:env/client';
import { API_SECRET } from 'astro:env/server';
```

## Mapa de acceso por entorno

| API | Uso |
| --- | --- |
| `import.meta.env.X` | Leer cualquier variable de `.env` |
| Prefijo `PUBLIC_` | La única forma de exponer una variable al cliente |
| `import.meta.env.DEV`/`PROD`/`MODE` | Variables incluidas, sin configurar nada |
| `astro:env` + `envField` | Schema tipado, valida en build que las variables requeridas existan |

## Secretos, tipos y despliegues

- Una variable sin `PUBLIC_` que se usa por error dentro de código que termina en el bundle de cliente se reemplaza por un string vacío, no explota — fácil de no notar. `astro:env` con `access: 'secret'` sí previene esto en build.
- `astro:env` no funciona en `astro.config.mjs` ni en scripts fuera del contexto de Astro (componentes, endpoints, middleware) — solo dentro de esos.
- Nunca comitear el `.env` real — el `.gitignore` de este proyecto ya lo excluye (`.env`, `.env.production`, `.env.local`).
