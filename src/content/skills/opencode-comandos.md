---
title: Comandos personalizados
description: Markdown + frontmatter, con un campo template que no existe en Claude Code — la diferencia principal entre ambos.
category: skills
stack: opencode
order: 2
tags: [ai, opencode, comando]
tool: OpenCode
updatedAt: 2026-08-17
---

## Dónde va

```text
.opencode/commands/nombre.md      → proyecto
~/.config/opencode/commands/nombre.md  → global
```

## Plantilla base

```md title=".opencode/commands/review.md"
---
description: Revisa el diff actual
agent: build
---
template: |
  Revisá los cambios actuales con `git diff` y señalá:
  1. Bugs potenciales
  2. Problemas de legibilidad

  Argumentos: $ARGUMENTS
```

A diferencia de Claude Code (donde el cuerpo entero del archivo **es** el prompt), OpenCode requiere el campo `template:` explícito con el texto que se manda al modelo — el resto del frontmatter es metadata.

## O inline en `opencode.json`

```json title="opencode.json"
{
  "command": {
    "review": {
      "template": "Revisá el diff actual: !`git diff`",
      "description": "Revisa el diff actual",
      "agent": "build"
    }
  }
}
```

## Interpolación

```text
$ARGUMENTS       → todo lo que sigue al comando
$1 $2 $3          → argumentos posicionales
!`comando`        → corre un shell command antes, inyecta el resultado
@archivo          → referencia un archivo
```

Misma sintaxis que Claude Code para esto — solo cambia dónde vive el prompt (`template:` explícito vs. cuerpo del archivo).

## Resumen

| Campo | Para qué |
| --- | --- |
| `template` | El prompt en sí (requerido) |
| `agent` | Qué agente ejecuta el comando |
| `model` | Override del modelo para este comando puntual |
| `subtask` | Fuerza que corra como subagente aunque el agente activo sea primario |

## Consideraciones

- Olvidar `template:` es el error más común migrando un comando desde Claude Code — sin ese campo, el comando no tiene prompt.
