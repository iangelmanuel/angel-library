---
title: "Claude Code: comandos slash personalizados"
description: Cómo crear comandos /propios en Claude Code con archivos Markdown, a nivel de proyecto y de usuario.
type: skills
order: 3
tags: [ai, claude-code, workflow, tooling, comando]
tool: Claude Code
updatedAt: 2026-08-10
---

## Qué son

Comandos reutilizables definidos como archivos Markdown. Se invocan como `/nombre-del-archivo` dentro de Claude Code. El contenido del archivo es el prompt que se ejecuta.

## Ubicación

```text
.claude/commands/review.md     → /review (solo en este proyecto)
~/.claude/commands/fix.md      → /fix (disponible en todos tus proyectos)
```

Los subdirectorios crean namespaces: `.claude/commands/git/sync.md` → `/git:sync`.

## Anatomía

```md title=".claude/commands/review.md"
---
description: Revisa el diff actual y propone mejoras
argument-hint: [archivo-o-carpeta]
allowed-tools: Bash(git diff:*), Read
---

Revisa los cambios actuales $ARGUMENTS y señala:

1. Bugs potenciales
2. Problemas de legibilidad
3. Riesgos de seguridad
```

## Claves

- `$ARGUMENTS` se sustituye por lo que escribas tras el comando: `/review src/api`.
- `allowed-tools` restringe lo que el comando puede usar (útil para comandos de solo lectura).
- Commitea `.claude/commands/` para compartirlos con el equipo; los de `~/.claude` son personales.
- Las herramientas de IA cambian rápido: verifica la documentación oficial antes de depender de opciones avanzadas.
