---
title: security-guidance — plugin oficial de Claude Code
description: Guía de seguridad integrada al flujo normal — señala riesgos mientras se escribe código, no solo al final.
category: skills
stack: ia-plugins
order: 2
tags: [ai, plugin, seguridad]
tool: Claude Code
updatedAt: 2026-08-17
---

Plugin oficial de Anthropic enfocado en seguridad — agrega guía y chequeos relacionados a prácticas seguras de código como parte del flujo normal, no solo como un audit puntual al final.

## Instalar

```bash
/plugin marketplace add anthropics/claude-plugins-official
/plugin install security-guidance@claude-plugins-official
```

## Fuente

Marketplace oficial: [github.com/anthropics/claude-plugins-official](https://github.com/anthropics/claude-plugins-official)

## Consideraciones

- Complementa (no reemplaza) el [comando /security-audit](/skills/comando-security-audit) de esta biblioteca — el comando es una auditoría puntual bajo demanda, este plugin integra la guía de seguridad de forma continua.
