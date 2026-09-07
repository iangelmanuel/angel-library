---
title: "Prisma CLI: comandos esenciales"
description: Se usa vía npx sin instalación global — init, generate, y la diferencia clave entre migrate dev, migrate deploy y db push.
type: guides
order: 3
tags: [cli, prisma, orm, base-de-datos]
scope: npx prisma
related: [applications/apps-cli/cli-supabase, terminal/cli/cli-astro]
updatedAt: 2026-08-17
---

## Instalación

Prisma no se instala global — es una dependencia de desarrollo del proyecto, y se corre con `npx`:

```bash
npm install -D prisma
npx prisma init
```

`prisma init` crea la carpeta `prisma/` con el `schema.prisma` inicial y un `.env` de ejemplo para la variable `DATABASE_URL`.

## Generar el cliente

```bash
npx prisma generate
```

Lee `schema.prisma` y genera el cliente de TypeScript/JavaScript (`@prisma/client`) con los tipos de cada modelo. Hay que correrlo de nuevo cada vez que cambia el schema.

## `migrate dev` vs `migrate deploy` vs `db push`

Las tres tocan la base de datos, pero para momentos distintos del ciclo de vida:

```bash
npx prisma migrate dev       # desarrollo: genera migración + la aplica + regenera el cliente
npx prisma migrate deploy    # producción/CI: aplica migraciones ya existentes, sin generar nada nuevo
npx prisma db push           # prototipado: sincroniza el schema sin crear historial de migraciones
```

- **`migrate dev`** es el comando del día a día en desarrollo: compara el schema contra la base, genera un archivo SQL de migración nuevo en `prisma/migrations/`, lo aplica, y (según la versión) regenera el cliente.
- **`migrate deploy`** es el que corre en CI/producción: aplica las migraciones que ya están commiteadas en el repo, sin crear ninguna nueva ni pedir confirmación interactiva — pensado para pipelines automatizados.
- **`db push`** salta el sistema de migraciones por completo: empuja el schema actual directo a la base. Útil para prototipar rápido o para bases sin necesidad de historial versionado (Prisma lo recomienda para MongoDB), pero no deja rastro de qué cambió ni cuándo.

## Explorar los datos

```bash
npx prisma studio
```

Abre una interfaz visual en el navegador para ver y editar filas de la base de datos sin escribir SQL manualmente.

## Sincronizar sin migraciones

```bash
npx prisma db push
```

(ver comparación arriba).

## Seed de datos

```bash
npx prisma db seed
```

Corre el script de seed configurado en `package.json` (bajo `"prisma": { "seed": "..." }`) para poblar la base con datos iniciales o de prueba.

## Resumen

| Comando                     | Cuándo usarlo                                    |
| --------------------------- | ------------------------------------------------ |
| `npx prisma init`           | Primera vez, crea `schema.prisma`                |
| `npx prisma generate`       | Regenerar el cliente tras cambiar el schema      |
| `npx prisma migrate dev`    | Desarrollo — genera y aplica migración nueva     |
| `npx prisma migrate deploy` | CI/producción — aplica migraciones existentes    |
| `npx prisma db push`        | Prototipado rápido, sin historial de migraciones |
| `npx prisma studio`         | UI visual para ver/editar datos                  |
| `npx prisma db seed`        | Poblar la base con datos iniciales               |

## Consideraciones

- `migrate deploy` nunca genera migraciones nuevas ni pide confirmación — es el único de los tres pensado para correr sin intervención humana en un pipeline.
- Mezclar `db push` con migraciones ya existentes puede desincronizar el historial — conviene elegir un enfoque (migraciones versionadas, o `db push` para prototipo) y no combinarlos en el mismo proyecto.
- En versiones recientes de Prisma, `migrate dev` dejó de disparar automáticamente `generate` y el seed en algunos flujos — si algo no se actualiza solo, correrlo a mano.
