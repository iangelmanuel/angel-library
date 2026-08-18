---
title: code-review — revisión de código como skill
description: Mismo objetivo que el comando /review, pero como skill — se activa solo cuando el contexto lo amerita, no solo al tipearlo.
category: skills
stack: ia-skills
order: 6
tags: [ai, skill, code-review]
tool: Cross-tool
updatedAt: 2026-08-17
---

Revisa código buscando bugs, problemas de legibilidad y de mantenibilidad — empaquetado como skill, así que además de invocarse a mano puede activarse solo cuando el agente detecta que acaba de terminar un cambio significativo.

## Instalar

```bash
npx skills add https://github.com/mattpocock/skills --skill code-review
```

## Fuente

[skills.sh/mattpocock/skills/code-review](https://www.skills.sh/mattpocock/skills/code-review) — mattpocock, 346K+ instalaciones.

## Cuándo usarlo

- Antes de abrir un PR, como paso automático al final de una sesión de cambios.
- Como segunda opinión sobre código que el mismo agente acaba de escribir, no solo sobre código humano.

## Consideraciones

- Ver también el [comando /review](/skills/comando-review) de esta misma biblioteca — mismo propósito, formato de comando explícito en vez de skill auto-activable. Elegir uno u otro según si preferís control manual o activación automática.
