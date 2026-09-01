---
title: Variables de entorno y .env
description: process.env, cargar un archivo .env con dotenv, y validar el resultado con Zod en vez de confiar en strings sueltos.
type: guides
order: 10
tags: [node, env, config, dotenv]
scope: process.env / dotenv
related: [general/packages/zod, architecture/principios/validate-at-boundaries]
updatedAt: 2026-08-16
---

Las variables de entorno son la forma estándar de pasarle configuración a un proceso sin hardcodearla en el código — especialmente secretos (API keys, connection strings) que nunca deberían estar en el repo.

## `process.env`

```ts
console.log(process.env.NODE_ENV);      // 'development', 'production', etc.
console.log(process.env.DATABASE_URL);  // undefined si no está seteada

const puerto = process.env.PORT ?? '3000'; // siempre string, o undefined
```

Todo lo que sale de `process.env` es **string** (o `undefined`) — un `PORT=3000` en el entorno llega como el string `"3000"`, no el número `3000`.

## Setear variables al correr el proceso

```bash
NODE_ENV=production node server.js         # Linux/Mac
PORT=3000 npm run dev

# Windows (PowerShell)
$env:PORT="3000"; node server.js
```

## Archivos `.env` con `dotenv`

En desarrollo, escribir variables en la terminal cada vez es incómodo — `dotenv` carga un archivo `.env` y las inyecta en `process.env` automáticamente.

```bash
npm install dotenv
```

```bash title=".env"
DATABASE_URL=postgresql://localhost:5432/mibase
JWT_SECRET=un-secreto-largo-y-random
PORT=3000
```

```ts title="server.ts"
import 'dotenv/config';   // primera línea del entry point: carga el .env antes que nada más
import { createServer } from 'node:http';

const puerto = process.env.PORT;
```

Node 20.6+ tiene soporte nativo para `.env` sin instalar `dotenv`, con el flag `--env-file`:

```bash
node --env-file=.env server.js
```

## `.env` NUNCA se versiona

```text title=".gitignore"
.env
.env.local
```

Ver [.gitignore](/git/git/git-gitignore) para el patrón completo. Un `.env.example` (sin valores reales, solo los nombres de las variables esperadas) sí se versiona — documenta qué necesita configurar cualquiera que clone el proyecto.

```bash title=".env.example"
DATABASE_URL=
JWT_SECRET=
PORT=3000
```

## Validar `process.env`, no confiar a ciegas

`process.env.PUERTO_MAL_ESCRITO` no da un error — da `undefined`, silenciosamente, y el bug aparece mucho más tarde y más confuso. La [práctica de validar en las fronteras](/architecture/principios/validate-at-boundaries) aplica directo aquí: `process.env` es una frontera del sistema (viene de afuera, no lo controla el tipo de TypeScript).

```ts title="env.ts"
import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.url(),
  JWT_SECRET: z.string().min(16),
  PORT: z.coerce.number().default(3000),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

export const env = envSchema.parse(process.env);
// env.PORT ya es number, no string — y si falta DATABASE_URL, el proceso
// falla aquí, al arrancar, con un mensaje claro — no 500 requests después.
```

Con esto, el resto de la app importa `env` (tipado, ya validado) en vez de tocar `process.env` directo en cualquier archivo — ver [Zod](/general/packages/zod) para el resto de la API de validación.

## Mapa de configuración

| Cosa | Detalle |
| --- | --- |
| `process.env.X` | Siempre `string \| undefined`, nunca otro tipo |
| `dotenv` / `node --env-file` | Cargar un `.env` en desarrollo |
| `.env` en `.gitignore` | Nunca versionar secretos |
| `.env.example` | Sí se versiona, documenta qué variables hacen falta |
| `envSchema.parse(process.env)` | Falla rápido y claro si falta algo, en vez de un `undefined` silencioso más adelante |

## Reglas de despliegue

- `z.coerce.number()` es necesario para cualquier variable numérica — `process.env.PORT` es el string `"3000"`, no el número, y `z.number()` a secas lo rechazaría.
- Validar `process.env` al arrancar (no en cada request) es lo que permite fallar rápido: si `DATABASE_URL` falta, mejor que el proceso ni levante, a que levante y falle recién en el primer request que la necesite.
