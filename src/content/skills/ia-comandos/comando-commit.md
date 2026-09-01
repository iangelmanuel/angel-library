---
title: /commit — mensajes de commit convencionales
description: Genera un commit siguiendo Conventional Commits a partir del diff en staging, sin escribir el mensaje a mano.
type: skills
order: 1
tags: [ai, comando, git]
tool: Cross-tool
updatedAt: 2026-08-17
---

## Copiar y pegar

```md title=".claude/commands/commit.md"
---
description: Create a commit following Conventional Commits from the staged diff
allowed-tools: Bash(git diff:*), Bash(git status:*), Bash(git commit:*)
---

Analyze the staged diff with `git diff --staged` and create a commit following Conventional Commits (`feat:`, `fix:`, `refactor:`, `docs:`, etc.).

Rules:
- One commit, one purpose — if the diff mixes unrelated changes, flag it before committing
- Short first line (≤72 characters), optional body for the "why"
- Don't invent context that isn't in the diff

If there's nothing staged, say so and do nothing.
```

Mismo archivo funciona como comando (`.claude/commands/`) o skill (`.claude/skills/commit/SKILL.md`) en Claude Code, y como `.opencode/commands/commit.md` (agregando `template:` al frontmatter) en OpenCode.

## Resumen

| Dónde | Archivo |
| --- | --- |
| Claude Code | `.claude/commands/commit.md` |
| OpenCode | `.opencode/commands/commit.md` (+ `template:`) |
| Cursor | `.cursor/commands/commit.md` |

## Consideraciones

- `allowed-tools` restringido a `git diff`/`status`/`commit` evita que el comando toque archivos por error mientras arma el mensaje.
- Para un mensaje más elaborado (estilo del proyecto, breaking changes), agregar ejemplos reales del historial del repo al prompt ayuda más que reglas abstractas.
