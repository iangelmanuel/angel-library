---
title: "Supabase CLI: comandos esenciales"
description: Instalación según sistema operativo, login, levantar el stack local con Docker, migraciones y generar tipos de TypeScript desde el esquema.
category: terminal
stack: cli
order: 2
tags: [cli, supabase, deploy, base-de-datos]
scope: supabase
related: [guides/cli-prisma]
updatedAt: 2026-08-17
---

## Instalación

A diferencia de otras CLIs, Supabase **no recomienda** instalarla global vía npm. El método varía por sistema operativo:

```bash
# macOS y Linux (Homebrew)
brew install supabase/tap/supabase

# Windows (Scoop)
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase

# Linux también acepta paquetes nativos .deb/.rpm/.apk desde los releases de GitHub
```

Alternativa multiplataforma: instalarla como dependencia del proyecto (no queda un comando `supabase` global, se corre con `npx`):

```bash
npm install supabase --save-dev
npx supabase --version
```

Levantar el stack local (`supabase start`) requiere **Docker** corriendo — ver [instalación de Docker](/guides/docker-instalacion).

## Login

```bash
supabase login
```

Conecta la CLI a tu cuenta de Supabase con un access token personal, guardado localmente.

## Inicializar un proyecto

```bash
supabase init
```

Crea la carpeta `supabase/` con `config.toml` — la configuración del proyecto local.

## Levantar el stack local

```bash
supabase start
supabase status
supabase stop
```

`start` levanta Postgres, Auth, Storage, el Studio local y el resto de servicios como contenedores Docker. `status` muestra las URLs y credenciales de conexión. `stop` los detiene conservando los datos.

## Vincular con un proyecto remoto

```bash
supabase link
```

Asocia la carpeta local con un proyecto hosteado en Supabase — paso previo a `db push`/`db pull`.

## Migraciones

```bash
supabase migration new nombre_de_la_migracion
supabase db push
supabase db pull
```

- `migration new` crea un archivo de migración vacío con timestamp en `supabase/migrations/`.
- `db push` aplica las migraciones locales pendientes contra la base remota.
- `db pull` hace el camino inverso: lee el esquema remoto y genera una migración local a partir de los cambios.

## Generar tipos de TypeScript

```bash
supabase gen types typescript --local > src/types/database.ts
```

Lee el esquema de Postgres y genera definiciones TypeScript — evita mantener los tipos de las tablas a mano.

## Resumen

| Comando | Qué hace |
| --- | --- |
| `supabase login` | Autentica la CLI con tu cuenta |
| `supabase init` | Crea la configuración local del proyecto |
| `supabase start` / `stop` | Levanta / detiene el stack local (Docker) |
| `supabase link` | Vincula la carpeta local a un proyecto remoto |
| `supabase migration new` | Crea un archivo de migración nuevo |
| `supabase db push` / `db pull` | Sincroniza migraciones entre local y remoto |
| `supabase gen types typescript` | Genera tipos TS desde el esquema |

## Consideraciones

- `supabase start` sin Docker corriendo falla directo — es el prerrequisito que más rompe en un setup nuevo.
- Instalar global (Homebrew/Scoop) da el comando `supabase` en cualquier carpeta; instalar como dependencia de npm obliga a anteponer `npx` siempre, pero fija la versión por proyecto.
- El CLI requiere Node.js 20+ cuando se corre vía npm/npx.
