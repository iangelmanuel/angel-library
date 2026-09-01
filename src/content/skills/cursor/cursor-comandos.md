---
title: Comandos personalizados
description: Prompts guardados en .cursor/commands/, disponibles en el menú / del IDE y del Cursor CLI.
type: skills
order: 3
tags: [ai, cursor, comando]
tool: Cursor
updatedAt: 2026-08-17
---

## Dónde va

```text
.cursor/commands/nombre.md      → proyecto, aparece en el menú / de este repo
```

También hay una "librería global" de comandos a nivel usuario, configurable desde Cursor Settings.

## Plantilla base

```md title=".cursor/commands/review.md"
Revisa los cambios actuales con `git diff` y señala:
1. Bugs potenciales
2. Problemas de legibilidad
3. Riesgos de seguridad

No hagas cambios, solo deja comentarios.
```

Sin frontmatter obligatorio — el archivo entero es el prompt, parecido a como funcionaban los comandos clásicos de Claude Code.

## Configurar desde Settings (alternativa)

```text
Cursor Settings → Rules → ## Slash Commands
```

## Resumen

| Ubicación | Alcance |
| --- | --- |
| `.cursor/commands/*.md` | Proyecto, se commitea |
| Librería global (Settings) | Personal, todos los proyectos |

## Consideraciones

- El **Cursor CLI** (la terminal, distinta del IDE) reconoce estos mismos comandos, además de tener su propio set grande de comandos nativos — ver [Comandos nativos](/skills/cursor/cursor-comandos-nativos).
