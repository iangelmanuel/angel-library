---
title: MCP — conectar servidores externos
description: Cómo agregar un servidor MCP (Model Context Protocol) con el CLI o editando .mcp.json, y los 3 scopes disponibles.
category: skills
stack: claude-code
order: 6
tags: [ai, claude-code, mcp]
tool: Claude Code
updatedAt: 2026-08-17
---

## Agregar un servidor con el CLI

```bash
claude mcp add --transport stdio playwright -- npx @playwright/mcp@latest
claude mcp add --transport http linear https://mcp.linear.app/mcp
claude mcp add --scope project github -- npx @modelcontextprotocol/server-github
```

## O editando el JSON directo

```json title=".mcp.json"
{
  "mcpServers": {
    "github": {
      "type": "stdio",
      "command": "npx",
      "args": ["@modelcontextprotocol/server-github"],
      "env": { "GITHUB_TOKEN": "${GITHUB_TOKEN}" }
    },
    "linear": {
      "type": "http",
      "url": "https://mcp.linear.app/mcp"
    }
  }
}
```

`${VAR}` interpola variables de entorno — no hardcodear tokens acá.

## Los 3 scopes

| Scope | Dónde vive | Compartido |
| --- | --- | --- |
| `local` (default) | `~/.claude.json`, atado a este proyecto | No, privado |
| `project` | `.mcp.json` en la raíz del repo | Sí, se commitea (pide aprobación al abrir) |
| `user` | `~/.claude.json` | No, pero cruza todos tus proyectos |

## Comandos útiles

```bash
claude mcp list                    # ver todos los servidores configurados
claude mcp get github               # detalle de uno
claude mcp reset-project-choices    # olvidar las aprobaciones de servidores "project"
```

## Consideraciones

- Un servidor `project` (en `.mcp.json`, commiteado) pide aprobación interactiva la primera vez que alguien lo abre — no se conecta solo sin que el usuario confirme.
- Si dos scopes definen un servidor con el mismo nombre, gana el más específico: `local` > `project` > `user` — no se mezclan campos, gana la entrada completa.
