---
title: code-review — plugin oficial de Claude Code
description: Revisión de código estructurada, mantenida por Anthropic — parte del marketplace oficial.
category: skills
stack: ia-plugins
order: 1
tags: [ai, plugin, code-review]
tool: Claude Code
updatedAt: 2026-08-17
---

Plugin de primera parte de Anthropic para revisión de código — trae comandos y agentes ya armados para revisar cambios con criterio consistente, sin escribirlos desde cero.

## Instalar

```bash
/plugin marketplace add anthropics/claude-plugins-official
/plugin install code-review@claude-plugins-official
```

## Qué hace

Agrega comandos de revisión estructurada (bugs, seguridad, legibilidad, arquitectura) como parte del flujo normal de Claude Code — invocable a mano o como parte de un workflow antes de abrir un PR.

## Fuente

Marketplace oficial: [github.com/anthropics/claude-plugins-official](https://github.com/anthropics/claude-plugins-official)

## Consideraciones

- Al ser de primera parte (mantenido por el mismo equipo que Claude Code), es la opción más segura para instalar sin revisar el código fuente a fondo primero — a diferencia de un plugin de un mantenedor de terceros.
