---
title: astro — guía de uso oficial del framework
description: Configuración, comandos CLI y referencias a la documentación oficial de Astro, como skill instalable.
type: skills
order: 11
tags: [ai, skill, astro]
tool: Cross-tool
updatedAt: 2026-08-17
---

Skill con guía de uso de Astro — ubicación de archivos de configuración, comandos CLI, y referencias a la documentación oficial, para que el agente no tenga que adivinar la versión/API correcta.

## Instalar

```bash
npx skills add https://github.com/astrolicious/agent-skills --skill astro
```

## Fuente

[skills.sh/astrolicious/agent-skills/astro](https://www.skills.sh/astrolicious/agent-skills/astro) — 12.9K instalaciones.

## Cuándo usarlo

- Cualquier proyecto Astro donde el agente necesite recordar dónde va cada tipo de archivo (`astro.config.mjs`, `src/content.config.ts`, etc.) y qué comando corresponde a cada tarea.
- Complementa las guías de esta biblioteca — [guías de Astro en Frontend](/categories/frontend) cubren conceptos específicos a fondo (islas, content collections, endpoints); este skill es más una referencia rápida de comandos y estructura.

## Consideraciones

- Es el único skill de Astro con tracción real que encontré al investigar — si buscas algo más específico (Astro + un integration puntual), [find-skills](/skills/ia-skills/skill-find-skills) o [autoskills.sh](/resources/ia/autoskills-sh) son mejor punto de partida que confiar en que exista aquí.
