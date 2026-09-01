---
title: MCP — conectar servidores externos
description: .cursor/mcp.json, transporte stdio o HTTP/SSE, con interpolación de variables en cualquier campo.
type: skills
order: 7
tags: [ai, cursor, mcp]
tool: Cursor
updatedAt: 2026-08-17
---

## Dónde va

```json title=".cursor/mcp.json"
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-github"],
      "env": { "GITHUB_TOKEN": "${env:GITHUB_TOKEN}" }
    },
    "linear": {
      "url": "https://mcp.linear.app/mcp"
    }
  }
}
```

`~/.cursor/mcp.json` para el equivalente global — el de proyecto gana si hay un nombre repetido.

## Vía la UI

```text
Cursor Settings → MCP Tools → Add Custom MCP
```

Abre el JSON directo para editar, mismo archivo que a mano.

## `command`/`args`/`env` (stdio) vs `url` (remoto)

```json
{
  "servidor-local": { "command": "...", "args": [...], "env": {...} },
  "servidor-remoto": { "url": "https://...", "headers": {...} }
}
```

## Resumen

| Campo | Para qué |
| --- | --- |
| `command` + `args` + `env` | Servidor local, transporte stdio |
| `url` + `headers` | Servidor remoto, HTTP/SSE |
| `${env:VAR}` | Interpola variables de entorno en cualquier campo |

## Consideraciones

- La interpolación de variables funciona en `command`, `args`, `env`, `url` y `headers` — no hardcodear tokens en ninguno de esos campos directo.
- Proyecto (`.cursor/mcp.json`) gana sobre global (`~/.cursor/mcp.json`) cuando hay un nombre de servidor repetido.
