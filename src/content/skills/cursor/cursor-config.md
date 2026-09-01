---
title: Configuración — IDE y CLI
description: Settings del editor (estilo VS Code) más el config propio del Cursor CLI — dos superficies distintas.
type: skills
order: 8
tags: [ai, cursor, config]
tool: Cursor
updatedAt: 2026-08-17
---

Cursor tiene dos configuraciones separadas: la del **IDE** (fork de VS Code, `settings.json` estándar + paneles propios para Rules/MCP/Marketplace) y la del **Cursor CLI** (la herramienta de terminal, un binario aparte).

## IDE

Reglas, Custom Modes, MCP y Marketplace viven en paneles de **Cursor Settings**, no solo en JSON — cada uno documentado en su propia página de esta subcategoría.

## Cursor CLI: `cli-config.json`

```json title="~/.cursor/cli-config.json"
{
  "version": 1,
  "editor": { "vimMode": false },
  "permissions": {
    "allow": ["Bash(git status)", "Read"]
  }
}
```

Ubicación por SO:

```text
~/.cursor/cli-config.json                        → macOS / Windows
$XDG_CONFIG_HOME/cursor/cli-config.json            → Linux / BSD
```

Override con la variable de entorno `CURSOR_CONFIG_DIR` si hace falta otra ubicación.

## Qué se puede scopear a nivel proyecto

Solo `permissions` — el resto de la config del CLI es global únicamente. Para permisos de un proyecto puntual, ese bloque puede vivir en un archivo separado dentro del repo (ver la doc oficial de `cli-config.json` para el path exacto vigente).

## Custom Modes (IDE, beta)

```text
Cursor Settings → Chat → Custom Modes
```

Un modo custom define: qué herramientas tiene disponibles, qué modelo usa, instrucciones propias, y un keybind — parecido a un subagente pero pensado para el chat principal, no para delegar tareas.

## Resumen

| Config | Dónde vive |
| --- | --- |
| Reglas, MCP, Marketplace (IDE) | Paneles de Cursor Settings |
| Cursor CLI | `cli-config.json` |
| Permisos del CLI por proyecto | Único campo scopeable a nivel proyecto |

## Consideraciones

- No confundir ambas superficies: cambiar algo en Cursor Settings (IDE) no afecta al Cursor CLI, y viceversa — son dos binarios/configs distintos que comparten marca.
