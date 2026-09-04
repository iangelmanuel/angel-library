---
title: Comandos nativos — cheat-sheet
description: Los comandos slash built-in que ya vienen con Claude Code, sin configurar nada.
type: skills
order: 9
tags: [ai, claude-code, comando]
tool: Claude Code
updatedAt: 2026-08-17
---

## Gestión de la sesión

```text
/clear          → limpia el contexto, empieza de cero
/compact         → resume la conversación para liberar contexto
/resume          → retoma una sesión anterior
/rewind          → vuelve a un punto anterior de la conversación
```

## Configuración e inspección

```text
/config          → ver/editar configuración activa
/status          → estado de la sesión actual
/doctor           → diagnóstico de instalación
/model            → cambiar el modelo activo
```

## Extensiones

```text
/agents           → listar/gestionar subagentes
/hooks             → ver hooks configurados
/mcp               → gestionar servidores MCP
/plugin            → instalar/gestionar plugins
```

## Modo y planificación

```text
/plan              → entra en modo plan (solo lectura, para diseñar antes de ejecutar)
```

## Resumen

| Comando                             | Para qué                         |
| ----------------------------------- | -------------------------------- |
| `/clear`                            | Contexto limpio                  |
| `/compact`                          | Resumir para ahorrar contexto    |
| `/config`                           | Ver/editar settings              |
| `/doctor`                           | Diagnóstico                      |
| `/agents` `/hooks` `/mcp` `/plugin` | Gestionar cada tipo de extensión |
| `/plan`                             | Modo solo-lectura para diseñar   |

## Consideraciones

- Esta es la lista de comandos que **ya existen** sin crear nada — para comandos propios, ver [Skills](/agents/claude-code/claude-code-skills) o [Comandos slash](/agents/claude-code/claude-code-slash-commands).
- La lista completa y actualizada siempre está un `/help` de distancia dentro de la propia herramienta — esta página es un punto de partida, no la fuente de verdad definitiva (cambia con cada release).
