---
title: MCP — conectar servidores externos
description: Servidores local (stdio) y remote (URL) en opencode.json, con toggle de tools por servidor y por agente.
category: skills
stack: opencode
order: 6
tags: [ai, opencode, mcp]
tool: OpenCode
updatedAt: 2026-08-17
---

## Configurar en `opencode.json`

```json title="opencode.json"
{
  "mcp": {
    "github": {
      "type": "local",
      "command": ["npx", "@modelcontextprotocol/server-github"],
      "environment": { "GITHUB_TOKEN": "{env:GITHUB_TOKEN}" }
    },
    "linear": {
      "type": "remote",
      "url": "https://mcp.linear.app/mcp"
    }
  }
}
```

`{env:VAR}` interpola una variable de entorno — igual idea que `${VAR}` en Claude Code, sintaxis distinta.

## Dos tipos de servidor

| Tipo | Campos |
| --- | --- |
| `local` | `command` (array), `cwd`, `environment`, `timeout` |
| `remote` | `url`, `headers`, `oauth`, `timeout` |

Más simple que Claude Code (que distingue `stdio`/`http`/`sse`/`ws`) — aquí solo local vs remote.

## Desactivar tools puntuales

```json
{
  "tools": {
    "github*": false
  }
}
```

Apaga todas las tools que empiecen con `github` sin sacar el servidor entero — útil para exponer solo lo necesario a un agente.

## Resumen

| Config | Qué hace |
| --- | --- |
| `mcp.<nombre>.type: "local"` | Servidor por comando (stdio) |
| `mcp.<nombre>.type: "remote"` | Servidor por URL |
| `tools: {"servidor*": false}` | Apaga tools específicas sin sacar el servidor |

## Consideraciones

- No hay scopes separados (`local`/`project`/`user`) como en Claude Code — el servidor vive donde esté declarado en la config, y la precedencia la define el orden de merge general de `opencode.json` (ver la referencia de config).
- Tampoco hay un paso de aprobación interactiva para servidores compartidos por repo — si está en el `opencode.json` commiteado, se conecta directo.
