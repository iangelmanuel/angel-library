---
title: Hooks — automatizar en eventos del ciclo de vida
description: Scripts que corren automáticamente antes/después de cada tool call, al empezar/terminar sesión, etc. — configurados en settings.json.
category: skills
stack: claude-code
order: 5
tags: [ai, claude-code, hook]
tool: Claude Code
updatedAt: 2026-08-17
---

## Dónde va

```json title=".claude/settings.json"
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [{ "type": "command", "command": "npx prettier --write \"$CLAUDE_FILE_PATH\"" }]
      }
    ]
  }
}
```

## Eventos más usados

| Evento | Cuándo corre |
| --- | --- |
| `SessionStart` | Al arrancar una sesión |
| `UserPromptSubmit` | Justo antes de mandar tu prompt al modelo |
| `PreToolUse` | Antes de que una herramienta se ejecute (puede bloquearla) |
| `PostToolUse` | Después de que una herramienta terminó |
| `Stop` | Cuando Claude termina de responder |
| `SubagentStart` / `SubagentStop` | Al arrancar/terminar un subagente |

## Ejemplo: bloquear un comando peligroso

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [{ "type": "command", "command": "scripts/bloquear-rm-rf.sh" }]
      }
    ]
  }
}
```

```bash title="scripts/bloquear-rm-rf.sh"
#!/bin/bash
input=$(cat)
command=$(echo "$input" | jq -r '.tool_input.command')

if echo "$command" | grep -qE 'rm -rf /'; then
  echo '{"permissionDecision": "deny", "systemMessage": "rm -rf / bloqueado por hook"}'
  exit 0
fi

exit 0
```

El hook recibe JSON por stdin (`tool_input`, etc.) y puede devolver JSON por stdout con `permissionDecision: allow/deny/ask` para controlar si la herramienta sigue.

## Resumen

| Tipo de handler | Qué ejecuta |
| --- | --- |
| `command` | Un shell script |
| `http` | POST a una URL |
| `mcp_tool` | Invoca una tool de un servidor MCP |
| `prompt` | Evaluación de un turno con el modelo |
| `agent` | Dispara un subagente (experimental) |

## Consideraciones

- Exit code `0` = éxito; `2` = bloqueante (en eventos que lo soportan); cualquier otro = error no bloqueante.
- `.claude/settings.json` (se commitea) vs `.claude/settings.local.json` (gitignored) — hooks de equipo van en el primero, hooks personales en el segundo.
- `/hooks` dentro de Claude Code muestra todos los hooks configurados actualmente.
