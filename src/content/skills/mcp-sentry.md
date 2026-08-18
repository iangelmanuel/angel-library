---
title: Sentry MCP — errores de producción desde el agente
description: El agente lee issues de Sentry, contexto del error, y puede investigar la causa directo desde el stack trace real.
category: skills
stack: ia-mcp
order: 6
tags: [ai, mcp, sentry, errores]
tool: Cross-tool
updatedAt: 2026-08-17
---

Conecta el agente a Sentry — leer issues de errores en producción, ver el stack trace completo y el contexto (usuario, request, breadcrumbs), e investigar la causa directo desde ahí en vez de copiar y pegar el error a mano.

## Instalar (remoto, recomendado)

```json
{
  "mcpServers": {
    "sentry": {
      "command": "npx",
      "args": ["-y", "mcp-remote@latest", "https://mcp.sentry.dev/mcp"]
    }
  }
}
```

Pide login OAuth con la cuenta de Sentry la primera vez.

## Fuente

[github.com/getsentry/sentry-mcp](https://github.com/getsentry/sentry-mcp) — oficial de Sentry. Documentación: [mcp.sentry.dev](https://mcp.sentry.dev)

## Cuándo usarlo

- "Este error apareció en producción, andá a buscarlo" — el agente trae el stack trace real en vez de que alguien lo copie del dashboard.
- Triage de issues nuevos: pedirle que agrupe, priorice, y sugiera cuáles investigar primero según frecuencia/impacto.

## Consideraciones

- Requiere que el proyecto ya esté reportando errores a Sentry (SDK instalado) — el MCP conecta con datos que ya existen, no instrumenta el proyecto por vos.
