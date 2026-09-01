---
title: Linear MCP — issues y proyectos
description: Crear, buscar y actualizar issues de Linear directo desde el agente — servidor remoto oficial, sin instalar nada local.
type: skills
order: 7
tags: [ai, mcp, linear, project-management]
tool: Cross-tool
updatedAt: 2026-08-17
---

Conecta el agente a Linear — crear issues, buscarlos, actualizar su estado, ver a qué proyecto/ciclo pertenecen. Servidor remoto oficial, no hace falta instalar ni correr nada local.

## Instalar

```json
{
  "mcpServers": {
    "linear": {
      "command": "npx",
      "args": ["-y", "mcp-remote", "https://mcp.linear.app/mcp"]
    }
  }
}
```

Pide autenticación OAuth con la cuenta de Linear la primera vez.

## Fuente

[linear.app/docs/mcp](https://linear.app/docs/mcp) — oficial de Linear.

## Cuándo usarlo

- "Arregla el bug del issue ENG-123" — el agente trae la descripción completa del issue sin que nadie la copie a mano.
- Cerrar el loop completo: implementar el fix, y que el propio agente actualice el estado del issue a "Done" al terminar.

## Consideraciones

- El servidor soporta tanto flujo OAuth (como usuario) como API key directa (para automatizaciones sin login interactivo) — OAuth es lo recomendado para uso normal en una sesión.
