---
title: Notion MCP — documentación y notas
description: Leer y escribir páginas de Notion desde el agente — servidor oficial del propio Notion.
type: skills
order: 8
tags: [ai, mcp, notion, docs]
tool: Cross-tool
updatedAt: 2026-08-17
---

Conecta el agente a un workspace de Notion — leer páginas, buscar contenido, crear/actualizar páginas. Servidor oficial mantenido por el propio equipo de Notion.

## Instalar

```bash
npx @notionhq/notion-mcp-server
```

Por default corre en modo stdio. Para exponerlo como HTTP (útil si varios clientes necesitan conectarse al mismo servidor):

```bash
npx @notionhq/notion-mcp-server --transport http --port 8080
```

## Fuente

[github.com/makenotion/notion-mcp-server](https://github.com/makenotion/notion-mcp-server) — oficial de Notion.

## Cuándo usarlo

- Si la documentación del proyecto (specs, decisiones de arquitectura, runbooks) vive en Notion en vez de en el repo — el agente puede leerla como contexto adicional.
- Generar borradores de documentación directo en Notion después de implementar algo, en vez de copiar y pegar a mano.

## Consideraciones

- Necesita una integración de Notion creada desde el workspace (Settings → Connections) con permiso sobre las páginas que el agente deba tocar — por default no ve nada hasta que se comparten páginas específicas con la integración.
