---
title: Plugins — código, no manifest
description: Módulos JS/TS con hooks imperativos — sin marketplace, se distribuyen por npm o copiando archivos. Acá también viven los "hooks".
category: skills
stack: opencode
order: 5
tags: [ai, opencode, plugin, hook]
tool: OpenCode
updatedAt: 2026-08-17
---

A diferencia de Claude Code (plugin = manifest que empaqueta skills+agentes+hooks+MCP, con marketplace propio), un plugin de OpenCode es directamente **código** — una función async que devuelve un objeto de hooks. No hay marketplace: se distribuye por npm o copiando el archivo.

## Dónde va

```text
.opencode/plugins/mi-plugin.ts       → proyecto
~/.config/opencode/plugins/mi-plugin.ts  → global
```

## Plantilla base

```ts title=".opencode/plugins/format-on-save.ts"
import type { Plugin } from '@opencode-ai/plugin';

export const FormatOnSave: Plugin = async ({ $ }) => {
  return {
    'file.edited': async ({ file }) => {
      if (file.endsWith('.ts') || file.endsWith('.tsx')) {
        await $`npx prettier --write ${file}`;
      }
    },
  };
};
```

## Hooks disponibles (los más usados)

| Hook | Cuándo corre |
| --- | --- |
| `tool.execute.before` / `.after` | Antes/después de que una tool corra |
| `file.edited` | Después de editar un archivo |
| `session.created` / `.idle` | Al crear una sesión / cuando queda inactiva |
| `message.updated` | Cuando llega un mensaje nuevo |
| `tui.toast.show` | Mostrar una notificación en la TUI |

## Instalar vía npm

```json title="opencode.json"
{
  "plugin": ["mi-plugin-de-npm"]
}
```

OpenCode instala el paquete automáticamente (con Bun) en el cache local al arrancar.

## Resumen

| Mecanismo | Cómo se distribuye |
| --- | --- |
| Archivo local | `.opencode/plugins/*.ts`, copiado a mano |
| Paquete npm | Listado en `opencode.json` → `plugin` |

## Consideraciones

- Esto es lo más distinto de Claude Code de todo el sitio: aquí no hay `.claude-plugin/plugin.json` ni `/plugin install` — es control total vía código, a cambio de no tener un catálogo central para descubrir plugins de otros.
- Si vienes de Claude Code buscando "dónde configuro un hook declarativo en JSON" — no existe, la funcionalidad equivalente vive aquí, como código.
