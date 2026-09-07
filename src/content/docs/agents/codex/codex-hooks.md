---
title: Hooks
description: Comparten explícitamente los mismos nombres de evento que Claude Code — el paralelismo más directo entre las 4 herramientas.
type: skills
order: 5
tags: [ai, codex, hook]
tool: Codex CLI
updatedAt: 2026-08-17
---

La documentación oficial de Codex es explícita: sus hooks comparten vocabulario de eventos con Claude Code — `SessionStart`, `PreToolUse`, `PostToolUse`, `UserPromptSubmit`, `Stop`, más extras propios de Codex (`SubagentStart`/`SubagentStop`, `PreCompact`/`PostCompact`, `PermissionRequest`).

## Dónde va

```text
~/.codex/hooks.json              → global
.codex/hooks.json                 → proyecto (requiere que el proyecto sea "trusted")
```

O inline en `config.toml` bajo `[[hooks.EventName]]`.

## Plantilla base

```json title=".codex/hooks.json"
{
  "PostToolUse": [
    {
      "matcher": "Bash",
      "hooks": [
        { "type": "command", "command": "scripts/auditar.sh", "timeout": 30 }
      ]
    }
  ]
}
```

```toml title="config.toml — equivalente en TOML"
[[hooks.PostToolUse]]
matcher = "Bash"
command = "scripts/auditar.sh"
timeout_sec = 30
```

## Eventos disponibles (los más usados)

```text
SessionStart / SessionEnd
PreToolUse / PostToolUse
UserPromptSubmit
Stop
SubagentStart / SubagentStop     ← propios de Codex, no existen en Claude Code
PreCompact / PostCompact          ← propios de Codex
PermissionRequest                  ← propio de Codex
```

## Resumen

| Fuente de config                   | Se mergea con las demás                      |
| ---------------------------------- | -------------------------------------------- |
| `~/.codex/hooks.json`              | Sí — todas las fuentes presentes se combinan |
| `~/.codex/config.toml` (`[hooks]`) | Sí                                           |
| `<repo>/.codex/hooks.json`         | Sí, si el proyecto es trusted                |
| `<repo>/.codex/config.toml`        | Sí, si el proyecto es trusted                |

## Consideraciones

- Solo el tipo de handler `"command"` está implementado hoy — `"prompt"` y `"agent"` se parsean pero todavía no ejecutan nada (reservados a futuro).
- `/hooks` dentro de Codex inspecciona los hooks activos. Un admin puede forzar `allow_managed_hooks_only = true` en `requirements.toml` para ignorar hooks de usuario/proyecto y permitir solo los gestionados centralmente.
- Si ya se conocen los hooks de Claude Code, esta es el área que requiere menos aprendizaje: los nombres de los eventos base son los mismos.
