---
title: webapp-testing — testing de aplicaciones web
description: Skill oficial de Anthropic para escribir y correr tests directamente webapp de punta a punta.
tags: [ai, skill, testing]
sidebar:
  order: 5
draft: false
tool: Claude Code
updatedAt: 2026-08-17
---

Guía la escritura de tests para una aplicación web — desde unitarios hasta de integración — con criterio sobre qué vale la pena testear y cómo estructurar los casos.

## Instalar

```bash
npx skills add https://github.com/anthropics/skills --skill webapp-testing
```

## Fuente

[skills.sh/anthropics/skills/webapp-testing](https://www.skills.sh/anthropics/skills/webapp-testing) — oficial de Anthropic, 133K+ instalaciones.

## Cuándo usarlo

- Un proyecto sin tests que necesita cobertura desde cero — ayuda a priorizar qué testear primero (lógica de negocio antes que detalles de UI).
- Combinado con [tdd](/skills/ia-skills/skill-tdd) para features nuevas escritas test-first.

## Consideraciones

- Complementa, no reemplaza, conocer el test runner específico del proyecto — para Vitest en un backend Express, ver [Vitest (backend)](/packages/node-vitest/vitest-backend) y [Supertest](/packages/node-supertest/supertest) para el detalle de esa combinación puntual.
