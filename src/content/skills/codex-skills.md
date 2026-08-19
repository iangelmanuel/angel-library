---
title: Skills — el mecanismo primario
description: SKILL.md, el estándar abierto que Codex ayuda a impulsar — reemplaza a los Custom Prompts, hoy deprecados.
category: skills
stack: codex
order: 2
tags: [ai, codex, skill]
tool: Codex CLI
related: [skills/claude-code-skills]
updatedAt: 2026-08-17
---

Codex CLI documenta Skills como su mecanismo de extensión principal, siguiendo el mismo estándar abierto `SKILL.md` que Claude Code y OpenCode. Los **Custom Prompts** (`~/.codex/prompts/*.md`) están oficialmente marcados como deprecados en favor de esto — si ves código o tutoriales viejos usando `/prompts:nombre`, la migración natural es a un skill.

## Dónde va

```text
.codex/skills/nombre/SKILL.md      → proyecto
~/.codex/skills/nombre/SKILL.md     → personal
```

## Plantilla base

```md title=".codex/skills/revisar-pr/SKILL.md"
---
name: revisar-pr
description: Revisa el PR actual buscando bugs y riesgos de seguridad
---

Revisa el PR actual con `gh pr diff` y señala bugs, riesgos de seguridad y problemas de legibilidad.
```

## Frontmatter mínimo requerido

```yaml
name: revisar-pr           # requerido
description: ...            # requerido
```

Opcional, junto al `SKILL.md`: `agents/openai.yaml` (política de invocación, dependencias de tools), `scripts/`, `references/`, `assets/` — mismo modelo de progressive disclosure que en Claude Code.

## Invocar

```text
/skills                    → listar y elegir
$nombre-del-skill            → mención directa
```

O activación automática si el pedido matchea la `description`.

## Catálogo oficial

`github.com/openai/skills` — set curado de skills listos para copiar, mantenido por OpenAI.

## Resumen

| Mecanismo | Estado |
| --- | --- |
| Skills (`SKILL.md`) | Recomendado, activo |
| Custom Prompts (`~/.codex/prompts/`) | Deprecado — no crear nuevos |

## Consideraciones

- Los Custom Prompts viejos solo se cargaban de archivos `.md` sueltos en `~/.codex/prompts/` (sin subcarpetas) y se perdían al reiniciar sesión si se editaban en caliente — Skills no tiene esas limitaciones.
- El formato `SKILL.md` es portable: un skill escrito para Codex funciona en Claude Code y OpenCode sin cambios (solo los campos base — `name`, `description`, `license`, `compatibility`, `metadata`).
