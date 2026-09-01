---
title: Agentes y subagentes
description: Agentes primary (Tab-cycled) vs subagent (@mención) — modelo de sesiones hijas navegables, distinto a Claude Code.
type: skills
order: 3
tags: [ai, opencode, agente]
tool: OpenCode
updatedAt: 2026-08-17
---

OpenCode distingue dos categorías: **primary agents** (los que manejas con Tab y conducen la sesión —`Build` con acceso completo, `Plan` de solo lectura—) y **subagents** (se invocan con `@mención` o mediante delegación —`General`, `Explore`, `Scout`—).

## Dónde va

```text
.opencode/agents/nombre.md          → proyecto
~/.config/opencode/agents/nombre.md  → global
```

## Plantilla base

```md title=".opencode/agents/code-reviewer.md"
---
description: Revisa código buscando bugs y problemas de seguridad
mode: subagent
model: anthropic/claude-sonnet-5
permission:
  edit: deny
  bash: ask
---

Eres un revisor de código senior. Busca bugs, riesgos de seguridad y problemas de legibilidad. Nunca edites archivos directamente, solo reporta.
```

## Campos que más se usan

| Campo | Para qué |
| --- | --- |
| `description` | Requerido — usado para delegación automática |
| `mode` | `primary` / `subagent` / `all` |
| `model` | Formato `provider/model-id` |
| `permission` | `allow`/`ask`/`deny` por acción (edit, bash, etc.) |
| `prompt` | Path a un archivo de system prompt externo |

## Invocar

```text
@code-reviewer revisa los últimos cambios
```

Para agentes `primary`, `Tab` cicla entre los disponibles en la sesión activa.

## Resumen

| Categoría | Cómo se usa |
| --- | --- |
| `primary` | `Tab` para cambiar, conduce la sesión |
| `subagent` | `@nombre` o delegación automática |

## Consideraciones

- OpenCode modela cada llamada a un subagente como una **sesión hija** navegable (`session_child_first`/`session_parent` como keybinds) — a diferencia de Claude Code, donde el subagente es una caja negra que solo devuelve el resultado final.
- El formato de `model` (`provider/model-id`) es distinto al de Claude Code (`sonnet`/`opus`/`haiku`) — hay que especificar el proveedor siempre.
