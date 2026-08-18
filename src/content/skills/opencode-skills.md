---
title: Skills — el mismo estándar que Claude Code
description: SKILL.md, mismo formato abierto — OpenCode incluso lee directamente .claude/skills/, sin migrar nada.
category: skills
stack: opencode
order: 4
tags: [ai, opencode, skill]
tool: OpenCode
related: [skills/claude-code-skills]
updatedAt: 2026-08-17
---

OpenCode implementa el mismo **Agent Skills** estándar abierto que Claude Code — y de hecho **lee directo** las carpetas de Claude Code, sin necesitar copiar ni convertir nada.

## Dónde busca (en orden, sube hasta la raíz del repo)

```text
.opencode/skills/nombre/SKILL.md
.claude/skills/nombre/SKILL.md      → interoperable, sin cambios
.agents/skills/nombre/SKILL.md       → estándar genérico, sin atarse a ninguna herramienta
```

Y sus equivalentes globales: `~/.config/opencode/skills/`, `~/.claude/skills/`, `~/.agents/skills/`.

## Plantilla base

```md title=".opencode/skills/revisar-pr/SKILL.md"
---
name: revisar-pr
description: Revisa el PR actual y deja comentarios sobre bugs y seguridad
---

Revisa el PR actual con `gh pr diff` y señalá bugs, riesgos de seguridad y problemas de legibilidad.
```

## Frontmatter: más chico que el de Claude Code

| Campo | Requerido |
| --- | --- |
| `name` | Sí — en minúsculas con guiones, debe matchear el nombre de la carpeta |
| `description` | Sí — entre 1 y 1024 caracteres |
| `license` / `compatibility` / `metadata` | No |

No existen aquí campos propios de Claude Code como `disable-model-invocation`, `context: fork` o `paths` — el control de acceso se maneja aparte, a nivel de `opencode.json` (ver Resumen).

## Cómo se invocan

A diferencia de Claude Code (`/nombre-del-skill` tipeado por el usuario), en OpenCode el agente descubre los skills disponibles a través directamente **tool nativa** llamada `skill` — el propio agente decide cuándo llamarla según la descripción de cada skill.

## Controlar el acceso

```json title="opencode.json"
{
  "permission": {
    "skill": {
      "revisar-pr": "allow",
      "*": "ask"
    }
  }
}
```

## Consideraciones

- Si ya tienes skills escritos para Claude Code, **no hace falta duplicarlos** — pon el proyecto en OpenCode y va a encontrar `.claude/skills/` solo.
- Sin el equivalente a `disable-model-invocation`, no hay forma nativa de forzar que un skill sea "solo invocable a mano" — el agente siempre puede decidir llamarlo si la descripción matchea.
