---
title: Instrucciones de proyecto
description: El análogo a CLAUDE.md en OpenCode — con la ventaja de poder aplicarse solo a archivos que matcheen un glob.
type: skills
order: 1
tags: [ai, opencode, memoria, config]
tool: OpenCode
updatedAt: 2026-08-17
---

## Configurar en `opencode.json`

```json title="opencode.json"
{
  "$schema": "https://opencode.ai/config.json",
  "instructions": [
    "AGENTS.md",
    "docs/backend-conventions.md",
    "packages/*/AGENTS.md"
  ]
}
```

`instructions` acepta globs — a diferencia de un `CLAUDE.md`/`AGENTS.md` único, se puede apuntar a instrucciones específicas directamente parte del monorepo sin que carguen en contexto para el resto.

## Un `AGENTS.md` típico

```md title="AGENTS.md"
# Mi Proyecto

## Comandos

- `bun dev` — desarrollo
- `bun test` — tests

## Convenciones

- TypeScript estricto, sin `any`
- Un componente por archivo
```

`AGENTS.md` es el estándar abierto (Linux Foundation) que además leen Cursor y Codex CLI — si ya escribiste uno para otra herramienta, OpenCode lo reusa tal cual.

## Resumen

| Config                                   | Qué hace                                 |
| ---------------------------------------- | ---------------------------------------- |
| `instructions: ["archivo.md"]`           | Carga ese archivo siempre                |
| `instructions: ["packages/*/AGENTS.md"]` | Carga instrucciones específicas por glob |

## Consideraciones

- Si el proyecto ya tiene `AGENTS.md` para Cursor o Codex, no hace falta duplicar contenido — apuntar `instructions` a ese mismo archivo alcanza.
- Sin `instructions` configurado explícitamente, OpenCode igual busca un `AGENTS.md` en la raíz por convención.
