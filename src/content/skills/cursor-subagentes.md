---
title: Subagentes
description: Markdown + YAML frontmatter — y Cursor también lee .claude/agents/ y .codex/agents/ directo, sin conversión.
category: skills
stack: cursor
order: 4
tags: [ai, cursor, agente]
tool: Cursor
updatedAt: 2026-08-17
---

## Dónde va

```text
.cursor/agents/nombre.md      → proyecto
~/.cursor/agents/nombre.md     → personal
.claude/agents/nombre.md       → Cursor también lo lee directo (compat cruzada)
.codex/agents/nombre.md        → ídem
```

Si hay un archivo con el mismo nombre en más directamente de estas carpetas, gana el de `.cursor/agents/` (proyecto).

## Plantilla base

```md title=".cursor/agents/code-reviewer.md"
---
name: code-reviewer
description: Revisa cambios buscando bugs y problemas de seguridad
model: inherit
readonly: true
---

Eres un revisor de código senior. Busca bugs, riesgos de seguridad y problemas de legibilidad. No edites nada, solo reportá.
```

## Campos que más se usan

| Campo | Para qué |
| --- | --- |
| `name` | Requerido |
| `description` | Requerido — usado para delegación automática |
| `model` | `inherit` (default, usa el de la sesión) u otro específico |
| `readonly` | No puede editar archivos |
| `is_background` | Corre sin bloquear, en paralelo |

## Invocar

```text
/code-reviewer revisa los últimos cambios
```

O delegación automática si la tarea matchea la `description`.

## Built-ins sin configurar nada

`Explore` (búsqueda de código), `Bash` (secuencias de shell), `Browser` (control de navegador vía MCP).

## Consideraciones

- Que Cursor lea `.claude/agents/` y `.codex/agents/` directo significa que un agente escrito para Claude Code funciona en Cursor sin tocar nada — pero el formato de Codex es TOML, no markdown, así que ese sí necesitaría convertirse.
