---
title: GitHub MCP — el oficial
description: Repos, PRs, issues, Actions desde el agente — servidor oficial de GitHub, reemplazó al viejo @modelcontextprotocol/server-github.
type: skills
order: 1
tags: [ai, mcp, github]
tool: Cross-tool
updatedAt: 2026-08-17
---

El servidor MCP oficial de GitHub — repositorios, Pull Requests, issues, Actions, todo desde el agente. Reemplazó al antiguo `@modelcontextprotocol/server-github` (ese paquete quedó deprecado, el desarrollo se movió a este repo oficial de GitHub).

## Remoto (sin instalar nada, recomendado)

```json
{
  "mcpServers": {
    "github": {
      "url": "https://api.githubcopilot.com/mcp/"
    }
  }
}
```

Pide autenticación OAuth la primera vez — no hace falta generar ni pegar un token a mano.

## Local con Docker (alternativa)

```json
{
  "mcpServers": {
    "github": {
      "command": "docker",
      "args": ["run", "-i", "--rm", "-e", "GITHUB_PERSONAL_ACCESS_TOKEN", "ghcr.io/github/github-mcp-server"],
      "env": { "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_TOKEN}" }
    }
  }
}
```

## Fuente

[github.com/github/github-mcp-server](https://github.com/github/github-mcp-server) — oficial de GitHub.

## Cuándo usarlo

- Cualquier flujo que toque PRs/issues desde el agente — leer comentarios de revisión, crear un PR con descripción real, chequear el estado de CI.
- Parte de la combinación "esencial" junto a [Context7](/skills/ia-mcp/mcp-context7) y [Playwright](/skills/ia-mcp/mcp-playwright) — cubre la mayoría de los workflows de desarrollo típicos.

## Consideraciones

- La versión remota (URL) es más simple de mantener actualizada que la local con Docker — usar Docker solo si hace falta correr sin conexión o con más control sobre la versión exacta.
