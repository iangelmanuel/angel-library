---
title: Plugins
description: Bundles de skills + apps + MCP servers — el mecanismo más nuevo y menos documentado de las 4 herramientas.
type: skills
order: 4
tags: [ai, codex, plugin]
tool: Codex CLI
updatedAt: 2026-08-17
---

Los plugins de Codex empaquetan skills, apps y servidores MCP en una unidad distribuible, con un manifest que también puede cargar configuración de hooks (`hooks/hooks.json` por default). Es el área menos madura/documentada públicamente de las 4 herramientas a agosto 2026 — tratar esta página como punto de partida, no como referencia exhaustiva.

## Qué empaqueta

```text
mi-plugin/
├── plugin.json          → manifest
├── skills/
│   └── deploy/SKILL.md
├── mcp.json               → servidores MCP que el plugin trae
└── hooks/
    └── hooks.json          → hooks que el plugin instala
```

## Config relacionada

```toml title="config.toml"
[features]
apps = true
```

## Resumen

| Componente     | Empaquetado         |
| -------------- | ------------------- |
| Skills         | `skills/*/SKILL.md` |
| Servidores MCP | `mcp.json`          |
| Hooks          | `hooks/hooks.json`  |

## Consideraciones

- A diferencia de Claude Code (marketplace + `/plugin install` maduro) y Cursor (marketplace con dos specs), Codex no tiene todavía un comando de instalación ni un catálogo central documentado con la misma solidez — verificar `developers.openai.com/codex/*` (o su redirección vigente a `learn.chatgpt.com/docs/*`) antes de construir un flujo de distribución sobre esto.
- Si el objetivo es reusar skills/MCP entre proyectos hoy, copiar `.codex/skills/` y `config.toml` a mano (o usar Skills directamente, ver esa página) es más confiable que depender del sistema de plugins todavía.
