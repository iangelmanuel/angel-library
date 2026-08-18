---
title: /code-audit — auditoría general de calidad de código
description: Duplicación, complejidad, código muerto y consistencia de estilo — más allá de bugs puntuales, sin tocar nada.
category: skills
stack: ia-comandos
order: 3
tags: [ai, comando, code-quality]
tool: Cross-tool
related: [skills/comando-review, skills/comando-refactor]
updatedAt: 2026-08-17
---

## Copiar y pegar

```md title=".claude/commands/code-audit.md"
---
description: General code quality audit — duplication, complexity, dead code, style consistency
argument-hint: [file-or-folder]
allowed-tools: Read, Grep, Glob
---

Audit $ARGUMENTS (if no arguments, audit the whole project) for code quality issues:

1. **Duplication** — repeated logic that should be extracted into a shared function/module
2. **Complexity** — functions doing too much, deep nesting, unclear control flow
3. **Dead code** — unused exports, unreachable branches, commented-out code left behind
4. **Naming and consistency** — inconsistent naming conventions, mismatched patterns across similar files
5. **Missing error handling** — places where a failure would fail silently or crash ungracefully

Don't make any changes, just report. Group findings by severity (must-fix vs. nice-to-have), with file and line for each.
```

## Resumen

| Dónde | Archivo |
| --- | --- |
| Claude Code | `.claude/commands/code-audit.md` |
| Cursor | `.cursor/commands/code-audit.md` |
| OpenCode | `.opencode/commands/code-audit.md` (+ `template:`) |

## Consideraciones

- Distinto de [`/review`](/skills/comando-review) (que mira el diff actual) y de [`/security-audit`](/skills/comando-security-audit) (foco en seguridad) — este mira la salud general del código existente, sin importar si cambió hoy.
- Corrida sobre todo el proyecto puede tardar y generar mucho ruido en repos grandes — mejor apuntarlo a una carpeta puntual (`$ARGUMENTS`) cuando se sospecha de un área específica.
