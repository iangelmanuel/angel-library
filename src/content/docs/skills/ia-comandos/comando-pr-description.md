---
title: /pr-description — generar la descripción de un PR
description: Resumen y plan de testing a partir del diff y los commits de la rama actual, pensado para que se lea en menos de un minuto.
type: skills
order: 9
tags: [ai, comando, git, pr]
tool: Cross-tool
related: [skills/ia-comandos/comando-changelog]
updatedAt: 2026-08-17
---

## Copiar y pegar

```md title=".claude/commands/pr-description.md"
---
description: Generate a pull request description from the current branch's diff and commits
allowed-tools: Bash(git diff:*), Bash(git log:*), Bash(gh pr view:*)
---

Look at the diff and commit history for the current branch versus its base branch, and write a PR description with:

1. **Summary** — 1-3 bullet points on what changed and why (the why matters more than the what)
2. **Test plan** — a checklist of what should be verified before merging

Keep it short — a reviewer should understand the change in under a minute. Don't restate the whole diff, just the parts that need context.
```

## Resumen

| Dónde       | Archivo                                                |
| ----------- | ------------------------------------------------------ |
| Claude Code | `.claude/commands/pr-description.md`                   |
| Cursor      | `.cursor/commands/pr-description.md`                   |
| OpenCode    | `.opencode/commands/pr-description.md` (+ `template:`) |

## Consideraciones

- Distinto de [`/changelog`](/skills/ia-comandos/comando-changelog): este es para UN pull request puntual (audiencia: el reviewer), el otro es un historial acumulado entre tags (audiencia: cualquiera que lea el changelog del proyecto).
- Combinarlo con `gh pr create --body "$(...)"` deja todo el flujo de abrir un PR sin escribir la descripción a mano.
