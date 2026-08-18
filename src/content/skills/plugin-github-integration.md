---
title: GitHub — integración partner (Claude Code)
description: Plugin vetted del marketplace oficial que empaqueta el MCP de GitHub junto a comandos para el flujo de PRs/issues.
category: skills
stack: ia-plugins
order: 4
tags: [ai, plugin, github]
tool: Claude Code
updatedAt: 2026-08-17
---

Integración de GitHub como plugin, listada como partner integration vetted en el marketplace oficial de Anthropic — trae el servidor MCP de GitHub configurado junto a comandos relacionados, en un solo paso de instalación.

## Instalar

```bash
/plugin marketplace add anthropics/claude-plugins-official
/plugin install github@claude-plugins-official
```

## Qué trae

- Servidor MCP de GitHub ya configurado (equivalente a instalarlo a mano, ver [MCP de GitHub](/skills/mcp-github))
- Comandos relacionados al flujo de PRs/issues

## Consideraciones

- Si prefieres configurar el MCP de GitHub tú mismo con más control sobre el token y el scope, ver la entrada dedicada de [MCP de GitHub](/skills/mcp-github) en vez de este plugin — mismo resultado final, instalación más manual.
