---
title: "Turso — SQLite en la nube con plan gratuito"
description: Base de datos gestionada basada en SQLite (libSQL y el nuevo motor Turso Database), con plan gratuito de 100 bases de datos y 5 GB, réplicas embebidas para leer en local y SDK para TypeScript y otros lenguajes.
tags: [servicios, base-de-datos, sqlite, libsql, turso, gratis, edge]
sidebar:
  order: 1
draft: false
resourceCategory: servicios
official: true
website: https://turso.tech
github: https://github.com/tursodatabase/turso
technologies:
  - terminal/cli/cli-turso
  - terminal/cli/cli-neon
  - database/database-sql/database-sql-consultas
  - database/database-operacion/database-migraciones-backups
note: "Los planes cambian: los límites de esta página son los de turso.tech/pricing a octubre de 2026. Compruébalos antes de elegirlo para un proyecto."
warnings:
  - "El plan gratuito solo guarda 1 día de restauración a un punto en el tiempo: haz tus propias copias si los datos importan."
  - "Un token de base de datos creado con --expiration never da acceso permanente: guárdalo como secreto y revócalo si se filtra."
updatedAt: 2026-10-12
---

**Turso** es una base de datos en la nube basada en **SQLite**. Ofrece lo que SQLite no trae de serie —acceso por red, réplicas, backups, ramas, panel web— sin renunciar a su modelo simple de "un archivo por base de datos". Es una opción habitual para proyectos personales, apps con una base por usuario o por cliente, y código que corre en el edge (Cloudflare Workers, Vercel, Deno Deploy).

## Conceptos en dos frases

- **SQLite** es un motor SQL que vive dentro de tu aplicación como un archivo, sin servidor. Es rapidísimo y está en todas partes, pero por sí solo no se comparte por red.
- **libSQL** es el fork open source de SQLite que creó el equipo de Turso para añadirle acceso remoto y replicación. **Turso Database** es su sucesor: una reescritura de SQLite en Rust (antes llamada Limbo), con escrituras concurrentes y búsqueda vectorial integrada. **Turso Cloud** es el servicio gestionado que aloja bases de ambos motores.

## Plan gratuito

A octubre de 2026, según [turso.tech/pricing](https://turso.tech/pricing):

| Recurso                               | Plan gratuito |
| ------------------------------------- | ------------- |
| Bases de datos                        | 100           |
| Almacenamiento total                  | 5 GB          |
| Filas leídas al mes                   | 500 millones  |
| Filas escritas al mes                 | 10 millones   |
| Sincronización (réplicas) al mes      | 3 GB          |
| Restauración a un punto en el tiempo  | 1 día         |
| Soporte                               | Comunidad     |
| Tarjeta de crédito                    | No            |

El siguiente escalón es **Developer**, desde 4,99 USD al mes con pago anual, que sube a 1.000 bases de datos, 2.500 millones de filas leídas y 10 GB de sincronización. Después vienen Scaler, Pro y Enterprise.

Sobre la inactividad: Turso anunció en marzo de 2025 que las bases gratuitas dejaban de tener arranques en frío y "se mantienen disponibles siempre, sin importar cuánto tiempo estén inactivas". Algunas páginas antiguas de la documentación todavía hablan de archivar grupos tras 10 días sin uso (`turso group unarchive`); si ves una base archivada, ese es el comando.

Ojo con la métrica: se cobran **filas leídas**, no consultas. Un `SELECT` sin índice que recorre una tabla de 100.000 filas consume 100.000 filas leídas aunque devuelva una. Los índices son la diferencia entre agotar la cuota o no (ver [índices y EXPLAIN](/database/database-sql/database-indices-explain)).

## Cómo empezar

Con el [CLI de Turso](/terminal/cli/cli-turso) (en Windows se usa dentro de WSL):

```bash
# Instalar (macOS)
brew install tursodatabase/tap/turso
# Instalar (Linux / WSL)
curl -sSfL https://get.tur.so/install.sh | bash

turso auth signup        # o turso auth login si ya tienes cuenta
turso db create mi-app   # motor libSQL; añade --tursodb para el motor nuevo
turso db shell mi-app    # shell SQL interactivo
```

Para conectar la aplicación necesitas la URL y un token de esa base:

```bash
turso db show mi-app --url             # libsql://mi-app-<org>.turso.io
turso db tokens create mi-app          # token para la aplicación
```

Guárdalos como variables de entorno `TURSO_DATABASE_URL` y `TURSO_AUTH_TOKEN`, nunca en el repositorio.

## SDK para TypeScript

Turso mantiene varios paquetes: `@libsql/client` (el cliente clásico para libSQL, con réplicas embebidas), `@tursodatabase/serverless` (cliente ligero por HTTP para entornos serverless y edge), `@tursodatabase/database` (el motor embebido) y `@tursodatabase/sync`. Con el cliente clásico:

```bash
npm install @libsql/client
```

```ts
import { createClient } from "@libsql/client"

const db = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
})

await db.execute({
  sql: "SELECT * FROM users WHERE id = ?",
  args: [1],
})
```

Usa siempre parámetros (`?`) en lugar de concatenar valores en el SQL, por la misma razón que en cualquier base de datos: evitar inyección. Hay SDK para otros lenguajes (la lista está en [docs.turso.tech/sdk](https://docs.turso.tech/sdk/introduction)), y ORMs como Drizzle (`drizzle-orm/libsql`) y Prisma (`@prisma/adapter-libsql`) se conectan a libSQL.

## Réplicas embebidas

Una **réplica embebida** es una copia local de la base remota que vive como archivo dentro de tu servidor. Las lecturas salen del archivo local (microsegundos, sin red) y las escrituras van a la base principal en la nube, que luego se sincroniza.

```ts
const db = createClient({
  url: "file:replica.db",            // lecturas locales
  syncUrl: process.env.TURSO_DATABASE_URL!, // base principal
  authToken: process.env.TURSO_AUTH_TOKEN,
  syncInterval: 60,                  // sincroniza cada 60 segundos
})

await db.sync() // también se puede sincronizar a mano
```

Detalles que importan:

- Consistencia **read-your-writes**: la réplica que escribe ve su cambio al instante; las demás lo ven cuando sincronizan (consistencia eventual entre réplicas).
- Necesitan **sistema de archivos**: no sirven en funciones serverless sin disco.
- Cada sincronización mueve páginas de 4 KB, así que hasta una escritura de 1 byte cuenta 4 KB contra los 3 GB mensuales de sync.
- No abras el archivo local mientras se sincroniza: puedes corromperlo.

Para proyectos nuevos que necesiten escribir en local y sincronizar después (offline-first), Turso recomienda **Turso Sync**, construido sobre el motor nuevo, con `push()` y `pull()` explícitos. Las réplicas embebidas siguen soportadas en producción.

## Cuándo conviene y cuándo no

**Conviene** si:

- Quieres SQL relacional gratis para un proyecto personal o un prototipo.
- Tu app encaja con **muchas bases pequeñas** (una por usuario o por tenant): 100 bases gratuitas dan mucho juego.
- Despliegas en el edge o quieres lecturas locales con réplicas embebidas.

**No conviene** si necesitas funciones avanzadas de PostgreSQL (extensiones, tipos ricos, `LISTEN/NOTIFY`) o mucha escritura concurrente sobre una sola base con libSQL. En ese caso, un Postgres serverless como Neon (ver [CLI de Neon](/terminal/cli/cli-neon)) suele encajar mejor.

## Fuentes

- [turso.tech](https://turso.tech) y [precios](https://turso.tech/pricing)
- [Documentación](https://docs.turso.tech/) y [quickstart](https://docs.turso.tech/quickstart)
- [Réplicas embebidas](https://docs.turso.tech/features/embedded-replicas/introduction)
- [Anuncio del plan Developer (marzo de 2025)](https://turso.tech/blog/turso-cloud-debuts-the-new-developer-plan)
- [Repositorio tursodatabase/turso](https://github.com/tursodatabase/turso)
