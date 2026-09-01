---
title: /refactor — refactorizar sin cambiar comportamiento
description: Simplifica y reorganiza un archivo o carpeta preservando el comportamiento externo, listando los problemas antes de tocar nada.
type: skills
order: 4
tags: [ai, comando, refactor]
tool: Cross-tool
related: [skills/ia-comandos/comando-code-audit]
updatedAt: 2026-08-17
---

## Copiar y pegar

```md title=".claude/commands/refactor.md"
---
description: Refactor a file or area for clarity and simplicity, preserving behavior
argument-hint: [file-or-folder]
allowed-tools: Read, Edit, Grep, Bash(npm test:*), Bash(pnpm test:*)
---

Refactor $ARGUMENTS. The goal is readability and simplicity — not new features, not behavior changes.

1. Identify the concrete issues first (duplication, unclear naming, functions doing too much, unnecessary abstraction) — list them before touching anything
2. Apply the refactor incrementally, one concern at a time
3. Keep the public API and external behavior identical unless explicitly told otherwise
4. If tests exist, run them after each change to confirm nothing broke

If a "refactor" would actually change behavior (fixing a bug along the way), stop and call it out separately instead of bundling it in silently.
```

## Resumen

| Dónde       | Archivo                                          |
| ----------- | ------------------------------------------------ |
| Claude Code | `.claude/commands/refactor.md`                   |
| Cursor      | `.cursor/commands/refactor.md`                   |
| OpenCode    | `.opencode/commands/refactor.md` (+ `template:`) |

## Consideraciones

- El paso 1 (listar problemas antes de tocar código) es el que más evita refactors que se van de tema — sin eso, es fácil terminar reescribiendo más de lo pedido.
- Sirve tanto para un archivo puntual como para una carpeta o módulo completo. Pasar un `$ARGUMENTS` específico produce resultados más controlados que apuntar a todo el repositorio.
