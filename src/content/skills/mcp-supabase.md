---
title: Supabase MCP — base de datos desde el agente
description: Queries, migraciones y gestión del proyecto Supabase directo desde el agente, con el token en variable de entorno.
category: skills
stack: ia-mcp
order: 4
tags: [ai, mcp, supabase, database]
tool: Cross-tool
updatedAt: 2026-08-17
---

Conecta el agente a un proyecto Supabase — correr queries, ver el schema, aplicar migraciones, gestionar el proyecto — sin salir de la sesión para ir al dashboard.

## Instalar

```json
{
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": ["-y", "@supabase/mcp-server-supabase@latest", "--project-ref", "TU_PROJECT_REF"],
      "env": { "SUPABASE_ACCESS_TOKEN": "${SUPABASE_ACCESS_TOKEN}" }
    }
  }
}
```

`--project-ref` se saca de Project Settings → General en el dashboard de Supabase.

## Fuente

`@supabase/mcp-server-supabase` en npm — oficial de Supabase.

## Cuándo usarlo

- Explorar el schema de una base ya existente sin cambiar de ventana.
- Combinado con las guías de esta biblioteca — [Supabase](/guides/express-supabase) (o la versión Astro/Next.js) para la integración en código, este MCP para explorar/gestionar la base interactivamente.

## Consideraciones

- El token va en la variable de entorno (`SUPABASE_ACCESS_TOKEN`), nunca en el comando directo — así no queda en el historial de git si el archivo de config se commitea.
- Con acceso completo al proyecto, este MCP puede aplicar migraciones reales — no es de solo lectura por default, prestar atención a qué proyecto está apuntando (dev vs producción).
