---
title: opencode.json — referencia rápida
description: A diferencia de Claude Code, la config se mergea entre hasta 8 fuentes en vez de sobre-escribirse por scope.
type: skills
order: 7
tags: [ai, opencode, config]
tool: OpenCode
updatedAt: 2026-08-17
---

## Plantilla con lo más usado

```json title="opencode.json"
{
  "$schema": "https://opencode.ai/config.json",
  "model": "anthropic/claude-sonnet-5",
  "agent": {
    "build": { "model": "anthropic/claude-opus-5" }
  },
  "permission": {
    "edit": "allow",
    "bash": "ask"
  },
  "instructions": ["AGENTS.md"],
  "mcp": {}
}
```

## Campos que más se usan

| Campo | Para qué |
| --- | --- |
| `model` / `small_model` | Modelo por defecto / modelo liviano para tareas simples |
| `agent` | Override de config por agente (modelo, permisos) |
| `permission` | `allow`/`ask`/`deny` global por tipo de acción |
| `instructions` | Archivos de reglas de proyecto (ver [Instrucciones](/skills/opencode/opencode-instrucciones)) |
| `tools` | Habilitar/deshabilitar tools por nombre o patrón |
| `mcp` | Servidores MCP (ver [MCP](/skills/opencode/opencode-mcp)) |
| `plugin` | Plugins vía npm (ver [Plugins](/skills/opencode/opencode-plugins)) |

## Precedencia: se mergea, no se sobre-escribe

```text
1. Config remota (.well-known/opencode) — la única de las 4 herramientas con esto
2. ~/.config/opencode/opencode.json (global)
3. OPENCODE_CONFIG (env var, path custom)
4. opencode.json del proyecto
5. .opencode/ (agents, commands, plugins)
6. OPENCODE_CONFIG_CONTENT (env var, contenido inline)
7. Config gestionada (admin, MDM)
```

Cada fuente **aporta** campos en vez de reemplazar el archivo entero — a diferencia de Claude Code, donde `settings.local.json` gana entero sobre `settings.json` para las claves que define, aquí los objetos se combinan más granularmente.

## Resumen

| Diferencia con Claude Code | Detalle |
| --- | --- |
| Modelo de precedencia | Merge entre 8 fuentes, no override por scope |
| Config remota | Soporta un endpoint `.well-known/opencode`, único entre las 4 herramientas |
| Interpolación | `{env:VAR}` y `{file:path}` |

## Consideraciones

- El endpoint de config remota es útil para organizaciones que quieren pushear config a todos sin depender de que cada developer actualice un archivo local — ninguna otra de las 4 herramientas documentadas aquí tiene esto.
