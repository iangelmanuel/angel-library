---
title: Plugins & Marketplace
description: Empaquetar skills, agentes, hooks y MCP servers en un solo plugin instalable — y cómo publicar/consumir un marketplace propio.
category: skills
stack: claude-code
order: 7
tags: [ai, claude-code, plugin]
tool: Claude Code
updatedAt: 2026-08-17
---

Un plugin agrupa skills + agentes + hooks + servidores MCP en una sola carpeta instalable. Un marketplace es simplemente un catálogo de plugins (un archivo JSON en un repo de GitHub, casi siempre).

## Instalar desde un marketplace

```bash
/plugin marketplace add anthropics/claude-plugins-official
/plugin install nombre-del-plugin@claude-plugins-official
```

## Estructura de un plugin propio

```text
mi-plugin/
├── .claude-plugin/
│   └── plugin.json
├── skills/
│   └── deploy/SKILL.md
├── agents/
│   └── reviewer.md
└── hooks/
    └── hooks.json
```

```json title=".claude-plugin/plugin.json"
{
  "name": "mi-plugin",
  "description": "Skills y agentes para mi flujo de trabajo",
  "version": "1.0.0",
  "author": "vos"
}
```

## Publicar tu propio marketplace

```json title=".claude-plugin/marketplace.json"
{
  "name": "mi-marketplace",
  "owner": "tu-usuario",
  "plugins": [
    { "name": "mi-plugin", "source": "./mi-plugin" }
  ]
}
```

Cualquier repo de git (GitHub, GitLab, o incluso una carpeta local) puede ser un marketplace — no hace falta publicar en ningún registro central.

## Habilitarlo para todo el equipo

```json title=".claude/settings.json"
{
  "extraKnownMarketplaces": { "mi-marketplace": { "source": "tu-usuario/mi-marketplace" } },
  "enabledPlugins": ["mi-plugin@mi-marketplace"]
}
```

Con esto en `settings.json` (commiteado), cualquiera que abra el proyecto tiene el plugin instalado automáticamente.

## Resumen

| Comando | Qué hace |
| --- | --- |
| `/plugin marketplace add <repo>` | Agrega un marketplace |
| `/plugin install <plugin>@<marketplace>` | Instala un plugin |
| `enabledPlugins` en settings.json | Auto-instala para todo el equipo |

## Consideraciones

- Un plugin es la forma correcta de compartir un set de skills/agentes/hooks entre varios proyectos o con un equipo — copiar `.claude/skills/` a mano entre repos es exactamente lo que esto reemplaza.
- El marketplace oficial de Anthropic es `anthropics/claude-plugins-official` — buen punto de partida antes de armar uno propio.
