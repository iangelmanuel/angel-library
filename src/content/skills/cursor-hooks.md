---
title: Hooks
description: Comandos que corren en checkpoints del ciclo de vida — bloquear comandos peligrosos, formatear al editar, auditar tool calls.
category: skills
stack: cursor
order: 6
tags: [ai, cursor, hook]
tool: Cursor
updatedAt: 2026-08-17
---

## Dónde va

```json title=".cursor/hooks.json"
{
  "hooks": {
    "afterFileEdit": [{ "command": "npx prettier --write \"$FILE_PATH\"" }],
    "beforeShellExecution": [{ "command": "scripts/bloquear-comandos-peligrosos.sh" }]
  }
}
```

## Eventos disponibles

| Evento | Cuándo corre |
| --- | --- |
| `sessionStart` / `sessionEnd` | Al empezar/terminar la sesión |
| `beforeSubmitPrompt` | Antes de mandar el prompt al modelo |
| `beforeShellExecution` | Antes de correr un comando de shell (puede bloquear) |
| `beforeMCPExecution` | Antes de invocar una tool de MCP |
| `beforeReadFile` | Antes de leer un archivo (útil para redactar contenido sensible) |
| `afterFileEdit` | Después de editar un archivo |
| `stop` | Cuando el agente termina de responder |

## Ejemplo: bloquear un comando

```bash title="scripts/bloquear-comandos-peligrosos.sh"
#!/bin/bash
input=$(cat)
command=$(echo "$input" | jq -r '.command')

if echo "$command" | grep -qE 'rm -rf /'; then
  echo '{"decision": "block", "message": "Comando bloqueado por hook"}'
  exit 0
fi

exit 0
```

El hook recibe JSON por stdin y puede devolver JSON por stdout para bloquear/permitir.

## Resumen

| Uso típico | Evento |
| --- | --- |
| Formatear código automáticamente | `afterFileEdit` |
| Bloquear comandos destructivos | `beforeShellExecution` |
| Redactar archivos sensibles | `beforeReadFile` |
| Logging/auditoría | `beforeMCPExecution`, `beforeShellExecution` |

## Consideraciones

- Los hooks son bundleables dentro de un Cursor Plugin (no de la spec Agent Plugins portable) — si el plugin necesita ser portable a otras herramientas, los hooks no viajan con él.
- Shippeado en Cursor 1.7 (~octubre 2025) — relativamente nuevo, verificar la doc oficial si algo no se comporta como aquí.
