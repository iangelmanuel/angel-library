---
title: "Supabase CLI: comandos esenciales"
description: Herramienta de terminal para ejecutar Supabase en local, registrar cambios de la base de datos y generar tipos de TypeScript a partir de su estructura.
type: guides
order: 8
tags: [cli, supabase, deploy, base-de-datos]
scope: supabase
website: https://supabase.com/docs/guides/local-development/cli/getting-started
related: [terminal/cli/cli-prisma]
updatedAt: 2026-08-28
---

**Supabase CLI** administra el entorno local y la conexión con proyectos alojados: inicia Postgres, Auth, Storage y Studio mediante contenedores, versiona cambios de esquema como migraciones y genera tipos desde la base de datos. No reemplaza al SDK de Supabase que utiliza la aplicación en tiempo de ejecución.

## Instalación

La opción más reproducible en un equipo es guardarla como dependencia de desarrollo. Así la versión queda fijada por el lockfile y se invoca con el ejecutor del proyecto:

```bash
pnpm add -D supabase
```

Usa `pnpm supabase`, `bunx supabase` o `npx supabase`, respectivamente. La distribución por npm requiere Node.js 20 o posterior y **no admite instalación global con `npm install -g`**.

Si prefieres un comando global, usa el método del sistema operativo:

```bash
# macOS o Linux con Homebrew
brew install supabase/tap/supabase

# Windows con Scoop
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase
```

Linux también dispone de paquetes `.deb`, `.rpm` y `.apk` en los releases oficiales. En cualquier caso, verifica la instalación:

```bash
supabase --version
```

Levantar el stack local (`supabase start`) requiere un runtime compatible con Docker en ejecución; revisa la [instalación de Docker](/devops/docker-conceptos/docker-instalacion). Instalar la CLI no instala Docker ni crea una cuenta.

## Autenticación

```bash
supabase login
```

El flujo abre el navegador o solicita un **personal access token** generado en la configuración de la cuenta. La CLI intenta guardarlo en el almacén seguro del sistema; si no existe, puede escribirlo en `~/.supabase/access-token`.

El login solo es necesario para operaciones contra la plataforma, como listar, vincular o desplegar proyectos. `supabase init`, `start`, `stop` y otras operaciones puramente locales pueden funcionar sin sesión.

En CI usa un secreto de entorno, no `supabase login`:

```bash
SUPABASE_ACCESS_TOKEN="$SUPABASE_ACCESS_TOKEN" supabase projects list
```

El ejemplo expresa la forma de pasarlo al proceso; el valor debe provenir del almacén de secretos del proveedor de CI y nunca de un archivo confirmado en Git.

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

El entorno local usa credenciales conocidas, no TLS y una configuración pensada para desarrollo. No lo expongas a internet ni lo trates como una instalación de producción.

## Vincular con un proyecto remoto

```bash
supabase link --project-ref <project-id>
```

Asocia la carpeta local con un proyecto alojado en Supabase — paso previo a `db push`, `db pull`, funciones y secretos. El identificador aparece en la URL del Dashboard. Antes de una operación destructiva, comprueba el proyecto vinculado con `supabase projects list`.

## Migraciones

```bash
supabase migration new nombre_de_la_migracion
supabase db reset
supabase db push --dry-run
supabase db push
supabase db pull
```

- `migration new` crea un archivo de migración vacío con timestamp en `supabase/migrations/`.
- `db reset` elimina y reconstruye la base **local** aplicando migraciones y datos semilla; permite comprobar que el historial es reproducible.
- `db push --dry-run` muestra qué migraciones remotas se aplicarían sin ejecutarlas.
- `db push` aplica las migraciones locales pendientes contra la base remota.
- `db pull` hace el camino inverso: lee el esquema remoto y genera una migración local a partir de los cambios.

Revisa siempre las migraciones generadas. `supabase db reset --linked` apunta a la base remota vinculada y elimina sus datos: resérvalo para entornos desechables de desarrollo o staging, nunca para producción.

## Generar tipos de TypeScript

```bash
supabase gen types --lang typescript --local > src/types/database.ts
```

Lee el esquema de Postgres y genera definiciones TypeScript — evita mantener los tipos de las tablas a mano.

## Resumen

| Comando | Qué hace |
| --- | --- |
| `supabase login` | Autentica la CLI con tu cuenta |
| `supabase init` | Crea la configuración local del proyecto |
| `supabase start` / `stop` | Levanta / detiene el stack local (Docker) |
| `supabase status` | Muestra servicios, URLs y credenciales locales |
| `supabase link --project-ref` | Vincula la carpeta local a un proyecto remoto |
| `supabase migration new` | Crea un archivo de migración nuevo |
| `supabase db reset` | Reconstruye la base local desde migraciones y seeds |
| `supabase db push` / `db pull` | Sincroniza migraciones entre local y remoto |
| `supabase gen types --lang typescript` | Genera tipos TS desde el esquema |

## Consideraciones

- `supabase start` sin Docker corriendo falla directo — es el prerrequisito que más rompe en un setup nuevo.
- Instalar global (Homebrew/Scoop) da el comando `supabase` en cualquier carpeta; instalar como dependencia de npm obliga a anteponer `npx` siempre, pero fija la versión por proyecto.
- El CLI requiere Node.js 20+ cuando se corre vía npm/npx.
- Conserva `supabase/config.toml`, `migrations/`, schemas y seeds en Git; no confirmes tokens, contraseñas ni archivos locales con secretos.
- Los cambios hechos directamente en el Dashboard pueden producir **drift**, es decir, una diferencia entre el estado remoto y las migraciones del repositorio. Ejecuta `db pull` y revisa el resultado antes de seguir modificando ambos lados.
