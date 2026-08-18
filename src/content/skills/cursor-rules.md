---
title: Rules — .mdc con globs
description: Reglas de proyecto con auto-activación por patrón de archivo — más granular que un CLAUDE.md único, con 4 modos de activación.
category: skills
stack: cursor
order: 1
tags: [ai, cursor, reglas, config]
tool: Cursor
updatedAt: 2026-08-17
---

## Dónde va

```text
.cursor/rules/nombre.mdc      → proyecto, se commitea
```

Un `.md` normal (sin frontmatter) dentro de `.cursor/rules/` se **ignora** — tiene que ser `.mdc`.

## Plantilla base

```mdc title=".cursor/rules/api-conventions.mdc"
---
description: Convenciones para endpoints de la API
globs: src/api/**/*.ts
alwaysApply: false
---

Todos los endpoints devuelven `{ data, error }`, nunca lanzan directo.
Usar Zod para validar el body antes de tocar la base de datos.

Ver también @src/lib/errors.ts para el formato de error estándar.
```

`@archivo` transcluye contenido de otro archivo sin duplicarlo — si ese archivo cambia, la regla no queda desactualizada.

## Los 4 modos de activación

| Modo | Config |
| --- | --- |
| **Always Apply** | `alwaysApply: true` — siempre en contexto |
| **Auto Attached** | `globs: "src/**/*.tsx"` — se activa cuando un archivo que matchea está en contexto |
| **Agent Requested** | Solo `description` — el agente lee la descripción y decide si aplica |
| **Manual** | Sin nada de lo anterior — solo se activa mencionando `@nombre-de-regla` en el chat |

## Resumen

| Campo | Para qué |
| --- | --- |
| `description` | Usado por el modo Agent Requested para decidir relevancia |
| `globs` | Patrón de archivos para auto-attach |
| `alwaysApply` | `true` = siempre activa, sin importar el contexto |

## Consideraciones

- `.cursorrules` (un solo archivo en la raíz) sigue funcionando pero está deprecado — sin globs, sin modos, y **Cursor lo ignora en modo Agent**. Migrar a `.cursor/rules/*.mdc` o a `AGENTS.md`.
- Reglas anidadas en subcarpetas heredan su propio scope — útil en monorepos para reglas que solo aplican a un paquete.
- Precedencia en Teams/Enterprise: Team Rules → Project Rules → User Rules.
