---
title: Context7 — docs actualizadas de cualquier librería
description: Trae documentación oficial y ejemplos reales en tiempo real, para que el agente no alucine APIs viejas o inexistentes.
type: skills
order: 2
tags: [ai, mcp, docs]
tool: Cross-tool
updatedAt: 2026-08-17
---

Resuelve el problema más común de trabajar con un modelo entrenado hasta una fecha fija: una librería sacó una versión nueva, cambió su API, y el modelo sigue "sabiendo" la versión vieja. Context7 busca la documentación oficial real de la librería en el momento y se la pasa al agente, en vez de depender de lo que recuerda del entrenamiento.

## Instalar

```bash
claude mcp add --scope user context7 -- npx -y @upstash/context7-mcp --api-key TU_API_KEY
```

O en JSON directo:

```json
{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp"]
    }
  }
}
```

API key gratuita en [context7.com/dashboard](https://context7.com/dashboard) (funciona sin key con límites más bajos).

## Fuente

[upstash.com](https://upstash.com) — `@upstash/context7-mcp` en npm.

## Cuándo usarlo

- Trabajando con una librería que actualiza seguido (frameworks de frontend, SDKs de servicios) donde "lo que el modelo recuerda" puede estar desactualizado.
- Parte de la combinación "esencial" junto a [GitHub MCP](/skills/ia-mcp/mcp-github) y [Playwright](/skills/ia-mcp/mcp-playwright).

## Consideraciones

- Dos tools principales: `resolve-library-id` (encuentra el ID de Context7 para una librería por nombre) y `query-docs` (trae la documentación directamente versión específica) — el agente las encadena solo, no hace falta invocarlas a mano.
