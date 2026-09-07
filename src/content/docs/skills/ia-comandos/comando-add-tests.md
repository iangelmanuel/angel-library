---
title: /add-tests — escribir tests para un archivo o función
description: Genera tests nuevos con casos borde reales, siguiendo las convenciones del repo — distinto de /fix-tests, que solo arregla fallas existentes.
type: skills
order: 6
tags: [ai, comando, testing]
tool: Cross-tool
related: [skills/ia-comandos/comando-fix-tests]
updatedAt: 2026-08-17
---

## Copiar y pegar

```md title=".claude/commands/add-tests.md"
---
description: Write tests for a file or function, covering the real edge cases
argument-hint: [file-or-function]
allowed-tools: Read, Write, Edit, Bash(npm test:*), Bash(pnpm test:*)
---

Write tests for $ARGUMENTS using the project's existing test framework and conventions (check how other test files in the repo are structured first).

Cover:

1. The main happy path
2. Realistic edge cases (empty input, boundary values, error conditions) — not exhaustive combinatorics for its own sake
3. Any bug-prone logic (conditionals, loops, async/error handling)

Match the existing test style in the repo (assertions, naming, file location) instead of introducing a new pattern. Run the new tests to confirm they pass before finishing.
```

## Resumen

| Dónde       | Archivo                                           |
| ----------- | ------------------------------------------------- |
| Claude Code | `.claude/commands/add-tests.md`                   |
| Cursor      | `.cursor/commands/add-tests.md`                   |
| OpenCode    | `.opencode/commands/add-tests.md` (+ `template:`) |

## Consideraciones

- Complementa a [`/fix-tests`](/skills/ia-comandos/comando-fix-tests): este escribe tests nuevos donde no hay, el otro arregla fallas en tests que ya existen — flujos distintos, no se pisan.
- "Revisar cómo están estructurados los otros tests del repo antes de escribir" es el paso que más evita que el modelo invente un estilo/framework de testing distinto al que ya usa el proyecto.
