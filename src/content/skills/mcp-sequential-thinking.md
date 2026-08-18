---
title: Sequential Thinking — razonamiento paso a paso
description: Servidor de referencia de Anthropic — estructura problemas complejos en pasos explícitos y revisables.
category: skills
stack: ia-mcp
order: 5
tags: [ai, mcp, razonamiento]
tool: Cross-tool
updatedAt: 2026-08-17
---

Uno de los servidores de referencia mantenidos por Anthropic — da al agente una herramienta explícita para pensar en pasos, revisar pasos anteriores, y ramificar el razonamiento en problemas complejos, en vez de resolver todo en un solo bloque de pensamiento.

## Instalar

```json
{
  "mcpServers": {
    "sequential-thinking": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-sequential-thinking"]
    }
  }
}
```

## Fuente

[github.com/modelcontextprotocol/servers](https://github.com/modelcontextprotocol/servers) — uno de los servidores de referencia oficiales.

## Cuándo usarlo

- Problemas de diseño/arquitectura con varias alternativas a evaluar, donde vale la pena que el razonamiento quede explícito y no solo en la respuesta final.
- Debugging de un bug difícil de reproducir, donde ir descartando hipótesis paso a paso ayuda más que intentar resolverlo de una.

## Consideraciones

- No agrega capacidades nuevas (no toca archivos, no hace requests) — es una herramienta de estructura del pensamiento, útil junto a otros MCP servers que sí actúan sobre el mundo real.
