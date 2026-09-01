---
title: /explain — explicar un archivo, función o parte del repo
description: Explicación clara y corta de cómo funciona algo, útil para onboarding o antes de tocar código ajeno.
type: skills
order: 5
tags: [ai, comando, onboarding]
tool: Cross-tool
updatedAt: 2026-08-17
---

## Copiar y pegar

```md title=".claude/commands/explain.md"
---
description: Explain how a file, function, or part of the codebase works
argument-hint: [file-or-symbol]
allowed-tools: Read, Grep, Glob
---

Explain $ARGUMENTS in plain terms:

1. What it does, in one or two sentences
2. How it fits into the surrounding code — what calls it, what it depends on
3. Any non-obvious behavior, edge cases, or gotchas worth knowing before changing it

Keep it concise — this is meant to build understanding fast, not to be exhaustive documentation. Skip anything self-evident from well-named code.
```

## Resumen

| Dónde | Archivo |
| --- | --- |
| Claude Code | `.claude/commands/explain.md` |
| Cursor | `.cursor/commands/explain.md` |
| OpenCode | `.opencode/commands/explain.md` (+ `template:`) |

## Consideraciones

- Útil al entrar a un repo nuevo (propio de hace meses o ajeno) antes de tocar algo que no se recuerda o nunca se entendió del todo.
- El punto 3 (gotchas) es el que más vale — una explicación de "qué hace" ya la da el código bien nombrado; lo que no se ve leyendo es lo que importa pedir.
