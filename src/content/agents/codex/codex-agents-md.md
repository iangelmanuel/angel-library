---
title: AGENTS.md — instrucciones de proyecto
description: Sin globs, solo anidamiento por carpeta — más simple (y más tosco) que las reglas .mdc de Cursor.
type: skills
order: 1
tags: [ai, codex, memoria, config]
tool: Codex CLI
updatedAt: 2026-08-17
---

## Dónde va

```text
AGENTS.md              → raíz del repo
apps/web/AGENTS.md      → anidado, aplica solo dentro de esa carpeta
```

## Plantilla base

```md title="AGENTS.md"
# Mi Proyecto

## Comandos

- `npm run dev` — desarrollo
- `npm test` — tests

## Convenciones

- TypeScript estricto
- Nunca commitear secretos
```

## Sin glob-matching (a diferencia de Cursor)

Codex **no** tiene el equivalente a los `globs:` de `.cursor/rules/*.mdc` — el único mecanismo de scoping es anidar el archivo en la carpeta que corresponda. Un `AGENTS.md` en `apps/web/` aplica a todo lo de esa carpeta, sin poder decir "solo para archivos `.tsx`" dentro de ella.

## Nombre de archivo custom

```toml title="config.toml"
project_doc_fallback_filenames = ["CONTEXT.md", "INSTRUCTIONS.md"]
```

Si el repo ya usa otro nombre de convención, Codex puede buscar esos en vez de `AGENTS.md`.

## Resumen

| Mecanismo                               | Alcance                                     |
| --------------------------------------- | ------------------------------------------- |
| `AGENTS.md` en la raíz                  | Todo el repo                                |
| `AGENTS.md` anidado                     | Esa carpeta y subcarpetas                   |
| `model_instructions_file` (config.toml) | Instrucciones globales, todos los proyectos |

## Consideraciones

- `AGENTS.md` es el mismo estándar abierto que leen Cursor y OpenCode — si ya escribiste uno para otra herramienta, no hace falta reescribirlo para Codex.
- Sin glob-matching, un monorepo con convenciones muy distintas por tipo de archivo dentro de la misma carpeta no tiene forma nativa de expresarlo — hay que separar en subcarpetas si eso es un problema real.
