---
title: Skills — crear un skill propio
description: SKILL.md con progressive disclosure — el mecanismo primario de Claude Code hoy, sucesor de los comandos slash clásicos.
type: skills
order: 2
tags: [ai, claude-code, skill]
tool: Claude Code
related: [agents/claude-code/claude-code-slash-commands]
updatedAt: 2026-08-17
---

Un skill es una carpeta con `SKILL.md` — la descripción queda siempre en contexto (barata), el contenido completo del archivo solo se carga cuando el skill se activa (progressive disclosure). Es el sucesor de los comandos slash clásicos: `.claude/commands/deploy.md` y `.claude/skills/deploy/SKILL.md` producen el mismo `/deploy`, pero el segundo permite carpetas de recursos (`scripts/`, `references/`, `assets/`) al lado.

## Dónde va

```text
.claude/skills/mi-skill/SKILL.md      → proyecto, se comparte con el equipo
~/.claude/skills/mi-skill/SKILL.md     → personal, todos tus proyectos
```

## Plantilla base

```md title=".claude/skills/revisar-pr/SKILL.md"
---
description: Revisa el PR actual y deja comentarios sobre bugs, legibilidad y seguridad
argument-hint: [número-de-pr]
allowed-tools: Bash(gh pr diff:*), Read
---

Revisa el PR $ARGUMENTS con `gh pr diff $ARGUMENTS` y señala:

1. Bugs potenciales
2. Problemas de legibilidad
3. Riesgos de seguridad

No hagas cambios, solo deja los comentarios.
```

## Campos de frontmatter que más se usan

| Campo                      | Para qué                                                                 |
| -------------------------- | ------------------------------------------------------------------------ |
| `description`              | Qué hace — Claude lo usa para decidir cuándo activarlo solo              |
| `argument-hint`            | Se muestra en el menú `/`, documenta qué argumento espera                |
| `allowed-tools`            | Restringe qué herramientas puede usar (útil para skills de solo lectura) |
| `disable-model-invocation` | `true` = solo se activa si el usuario escribe `/nombre`, nunca solo      |
| `context: fork`            | Corre el skill en un subagente aislado en vez del hilo principal         |

## Activación automática vs manual

```yaml
disable-model-invocation: true # solo /nombre-del-skill, nunca automático
user-invocable: false # nunca aparece en el menú /, solo Claude lo activa
```

Sin ninguno de los dos, el skill puede activarse **ambas** formas — Claude lo dispara solo si la descripción matchea lo que el usuario pidió, o el usuario lo tipea a mano.

## Resumen

| Ubicación           | Alcance                       |
| ------------------- | ----------------------------- |
| `.claude/skills/`   | Proyecto, se commitea         |
| `~/.claude/skills/` | Personal, todos los proyectos |

## Consideraciones

- Un skill con `scripts/`/`references/` al lado del `SKILL.md` no carga esos archivos en contexto automáticamente — el `SKILL.md` los referencia y Claude los lee solo si hace falta, eso es justamente lo que ahorra contexto frente a un comando clásico.
- Fuera de Claude Code (subir a claude.ai, Skills API) solo son portables 6 campos: `name`, `description`, `license`, `compatibility`, `metadata`, `allowed-tools` — el resto son extensiones propias de Claude Code.
