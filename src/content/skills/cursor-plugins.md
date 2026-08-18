---
title: Plugins & Marketplace
description: Dos specs conviviendo — Agent Plugins (portable) y Cursor Plugins (propietario, más completo) — más el marketplace oficial.
category: skills
stack: cursor
order: 5
tags: [ai, cursor, plugin]
tool: Cursor
updatedAt: 2026-08-17
---

Cursor tiene un marketplace (`cursor.com/marketplace`) con dos formatos de plugin conviviendo — vale la pena saber cuál estás mirando antes de escribir uno.

## Las dos specs

| | Agent Plugins | Cursor Plugins |
| --- | --- | --- |
| Manifest | `plugin.json` en la raíz | `.cursor-plugin/plugin.json` |
| Portabilidad | Sí — funciona también en Claude Code y otras herramientas | No, específico de Cursor |
| Qué empaqueta | `skills/`, `mcp.json` | Reglas (.mdc), agentes, comandos, hooks, variables |
| Cuándo usar | Si el plugin debe funcionar fuera de Cursor también | Si necesitas las piezas específicas de Cursor (hooks, .mdc) |

## Instalar uno

```text
Cursor Settings → Marketplace → buscar → Install
```

## Probar uno propio en desarrollo

```bash
mkdir -p ~/.cursor/plugins/local/mi-plugin
# copiar los archivos del plugin ahí
```

Reiniciar Cursor para que lo detecte.

## Estructura mínima (Cursor Plugins)

```text
mi-plugin/
├── .cursor-plugin/
│   └── plugin.json
├── rules/
│   └── conventions.mdc
├── commands/
│   └── deploy.md
└── mcp.json
```

## Resumen

| Escenario | Spec a usar |
| --- | --- |
| Compartir con Claude Code también | Agent Plugins |
| Usar hooks o reglas `.mdc` | Cursor Plugins |

## Consideraciones

- El marketplace tiene gobernanza a nivel Team/Enterprise: políticas Default Off / Default On / Required, y refresco automático desde repos de GitHub — relevante si administrás Cursor para un equipo.
- Cursor también soporta extensiones generales de VS Code (vía Open VSX) — eso es un mecanismo aparte, no relacionado a IA.
