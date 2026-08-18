---
title: /review — revisar el diff o PR actual
description: Bugs, legibilidad y seguridad sobre los cambios actuales — sin editar nada, solo reporta.
category: skills
stack: ia-comandos
order: 2
tags: [ai, comando, code-review]
tool: Cross-tool
updatedAt: 2026-08-17
---

## Copiar y pegar

```md title=".claude/commands/review.md"
---
description: Review the current diff and flag bugs, readability issues, and security risks
argument-hint: [file-or-folder]
allowed-tools: Bash(git diff:*), Bash(gh pr diff:*), Read, Grep
---

Review the current changes $ARGUMENTS (if no arguments, use `git diff`; if there's an open PR, use `gh pr diff`) and flag:

1. Potential bugs — unhandled edge cases, incorrect logic
2. Readability issues — confusing names, functions doing too much
3. Security risks — unvalidated input, hardcoded secrets, injection

Don't make any changes, just report. Prioritize findings: breaking issues first, style issues after.
```

## Resumen

| Dónde | Archivo |
| --- | --- |
| Claude Code | `.claude/commands/review.md` |
| Cursor | `.cursor/commands/review.md` |
| OpenCode | `.opencode/commands/review.md` (+ `template:`) |

## Consideraciones

- `$ARGUMENTS` vacío + fallback a `git diff` cubre tanto "revisar esto puntual" como "revisar lo que no está commiteado".
- Para un suite completo de comandos de revisión (seguridad, arquitectura, features) más elaborado que esto, ver [Claude Command Suite](/skills/comando-claude-command-suite) — un recurso comunitario con 55+ comandos/agentes ya armados.
