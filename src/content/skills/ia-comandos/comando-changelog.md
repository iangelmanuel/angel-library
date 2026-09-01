---
title: /changelog — generar desde el historial de git
description: Lee los commits desde el último tag, los clasifica y arma un changelog formateado.
type: skills
order: 8
tags: [ai, comando, git, changelog]
tool: Cross-tool
updatedAt: 2026-08-17
---

## Copiar y pegar

```md title=".claude/commands/changelog.md"
---
description: Generate a changelog from the latest tag to HEAD
argument-hint: [from-tag]
allowed-tools: Bash(git log:*), Bash(git tag:*), Bash(git describe:*)
---

1. Find the most recent tag with `git describe --tags --abbrev=0` (or use $ARGUMENTS if one was passed)
2. List the commits since that tag with `git log <tag>..HEAD --oneline`
3. Classify each one by type (Conventional Commits: feat/fix/refactor/docs/etc.) — if they don't follow the convention, infer the type from the message
4. Build a Markdown changelog, grouped by type, in this format:

## [Unreleased]

### Added

- ...

### Fixed

- ...

Skip merge commits and CI commits that don't matter to the end user.
```

## Resumen

| Dónde       | Archivo                         |
| ----------- | ------------------------------- |
| Claude Code | `.claude/commands/changelog.md` |
| Cursor      | `.cursor/commands/changelog.md` |

## Consideraciones

- Funciona mejor si el repo ya usa Conventional Commits en sus mensajes — sin eso, la clasificación depende de que el modelo infiera el tipo, menos confiable.
- Para changelogs orientados a usuario final (no a desarrolladores), pedí explícitamente que traduzca "refactor: extraer hook useAuth" a lenguaje que le importe a quien usa el producto, no al código.
