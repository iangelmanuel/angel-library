---
title: settings.json — referencia rápida
description: Las opciones que más se tocan — permisos, modelo, hooks, statusline — y los 4 niveles de precedencia.
category: skills
stack: claude-code
order: 8
tags: [ai, claude-code, config]
tool: Claude Code
updatedAt: 2026-08-17
---

## Los 4 niveles (de mayor a menor precedencia)

```text
Managed (org)              → política de la empresa, no editable por el usuario
~/.claude/settings.json     → tuyo, todos los proyectos
.claude/settings.json       → del proyecto, se commitea, todo el equipo
.claude/settings.local.json → del proyecto, gitignored, solo vos
```

## Plantilla con lo más usado

```json title=".claude/settings.json"
{
  "$schema": "https://json.schemastore.org/claude-code-settings.json",
  "permissions": {
    "allow": ["Bash(npm run test *)", "Bash(git status)", "Read"],
    "deny": ["Bash(rm -rf *)"]
  },
  "model": "sonnet",
  "outputStyle": "default",
  "statusLine": {
    "type": "command",
    "command": "~/.claude/statusline.sh"
  }
}
```

## Campos que más se usan

| Campo | Para qué |
| --- | --- |
| `permissions.allow` / `.deny` | Qué comandos/herramientas corren sin preguntar / nunca |
| `model` | Modelo por defecto de la sesión |
| `hooks` | Ver [Hooks](/skills/claude-code-hooks) |
| `statusLine` | Comando que genera la barra de estado custom |
| `env` | Variables de entorno inyectadas en cada sesión |
| `enabledPlugins` | Plugins auto-instalados (ver [Plugins](/skills/claude-code-plugins)) |
| `outputStyle` | Estilo de respuesta |

## Patrones de permisos

```json
{
  "permissions": {
    "allow": [
      "Bash(git diff:*)",
      "Bash(npm run *)",
      "Read",
      "Edit(src/**)"
    ],
    "deny": ["Bash(curl:*)", "Edit(.env*)"]
  }
}
```

`Bash(comando:*)` permite ese comando con cualquier argumento; `Bash(comando exacto)` sin `:*` solo permite exactamente eso.

## Comandos de inspección

```text
/config     → ver la configuración activa
/status     → estado de la sesión
/doctor     → diagnóstico de instalación/configuración
```

## Consideraciones

- `settings.local.json` nunca se commitea (gitignored por convención) — ahí van tokens, preferencias personales de modelo, cualquier cosa que no debería imponerse al equipo.
- El `$schema` en el JSON habilita autocompletado en editores que lo soportan (VS Code, etc.) — vale la pena incluirlo siempre.
