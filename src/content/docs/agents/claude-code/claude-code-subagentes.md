---
title: Subagentes propios
description: Agentes especializados con su propio contexto, herramientas y modelo — .claude/agents/*.md.
type: skills
order: 4
tags: [ai, claude-code, agente]
tool: Claude Code
updatedAt: 2026-08-17
---

## Dónde va

```text
.claude/agents/nombre.md      → proyecto, se comparte con el equipo
~/.claude/agents/nombre.md     → personal, todos tus proyectos
```

## Plantilla base

```md title=".claude/agents/code-reviewer.md"
---
name: code-reviewer
description: Revisa cambios de código buscando bugs, problemas de seguridad y de legibilidad. Usar después de escribir código nuevo o antes de un PR.
tools: Read, Grep, Glob, Bash(git diff:*)
model: sonnet
---

Eres un revisor de código senior. Al invocarte:

1. Ejecuta `git diff` para ver los cambios actuales
2. Revisa cada archivo modificado
3. Reporta: bugs, riesgos de seguridad, problemas de legibilidad
4. Sé específico: archivo, línea, qué está mal, cómo arreglarlo
```

## Campos de frontmatter

| Campo            | Para qué                                                                   |
| ---------------- | -------------------------------------------------------------------------- |
| `name`           | Requerido — así se invoca (`@code-reviewer`)                               |
| `description`    | Requerido — Claude lo usa para delegar automáticamente sin que lo pidas    |
| `tools`          | Qué herramientas puede usar (sin esto, hereda todas)                       |
| `model`          | `sonnet` / `opus` / `haiku` / `inherit` (el mismo que la sesión principal) |
| `permissionMode` | Nivel de permisos del subagente                                            |

## Invocar

```text
@code-reviewer revisa los cambios del último commit
```

O dejar que Claude lo delegue solo cuando la tarea matchea la `description`.

## Resumen

| Ubicación           | Alcance  |
| ------------------- | -------- |
| `.claude/agents/`   | Proyecto |
| `~/.claude/agents/` | Personal |

## Consideraciones

- El subagente corre en un contexto aislado — solo el resultado final vuelve a la conversación principal, no cada paso intermedio. Bueno para tareas que generarían mucho ruido si corrieran en el hilo principal.
- Si creas un agente con la sesión ya abierta, hace falta reiniciar para que Claude lo detecte.
- Agentes built-in que no requieren configurar nada: `Explore` (búsqueda de código, solo lectura), `Plan` (investigación en modo plan), `general-purpose` (acceso completo).
