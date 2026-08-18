---
title: AGENTS.md — el que Cursor lee sin config
description: Cursor lee AGENTS.md (y CLAUDE.md) directo en Chat, Composer y Agent — sin frontmatter ni globs, scoping solo por carpeta.
category: skills
stack: cursor
order: 2
tags: [ai, cursor, memoria, config]
tool: Cursor
updatedAt: 2026-08-17
---

Además de `.mdc` (con globs y modos de activación), Cursor lee `AGENTS.md` en la raíz del proyecto — el estándar abierto que también usan OpenCode y Codex CLI — y también `CLAUDE.md`, sin que haga falta ninguna configuración extra.

## Dónde va

```text
AGENTS.md              → raíz del repo, cubre Chat + Composer + Agent (los 3 modos)
apps/web/AGENTS.md      → anidado, aplica solo a esa carpeta
```

## Plantilla base

```md title="AGENTS.md"
# Mi Proyecto

## Comandos
- `pnpm dev` — desarrollo
- `pnpm test` — tests

## Convenciones
- TypeScript estricto
- Componentes en PascalCase
```

## `AGENTS.md` vs `.mdc`: cuándo cada uno

| | `AGENTS.md` | `.cursor/rules/*.mdc` |
| --- | --- | --- |
| Scoping | Por carpeta (anidado) | Por glob (`src/**/*.tsx`) |
| Frontmatter | No | Sí (`description`, `globs`, `alwaysApply`) |
| Portabilidad | Estándar cross-tool (Cursor, OpenCode, Codex) | Específico de Cursor |
| Modos de activación | Siempre activo si existe en esa carpeta | 4 modos distintos |

Si el archivo de reglas necesita compartirse con otras herramientas (Codex, OpenCode), `AGENTS.md` es la opción — si necesita glob-matching fino a un tipo de archivo específico, `.mdc`.

## Consideraciones

- No hace falta elegir uno solo — Cursor lee ambos formatos a la vez, cada uno cubre lo que el otro no.
- `AGENTS.md` es estándar de la Agentic AI Foundation (Linux Foundation) desde 2026 — vale la pena escribir uno aunque hoy solo uses Cursor, portabilidad gratis a futuro.
