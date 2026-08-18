---
title: prisma-database-setup
description: Skill oficial de Prisma — schema, migraciones y configuración inicial siguiendo las convenciones recomendadas del equipo.
category: skills
stack: ia-skills
order: 9
tags: [ai, skill, prisma, database]
tool: Cross-tool
updatedAt: 2026-08-17
---

Guía la configuración inicial de un proyecto con Prisma — estructura del schema, convenciones de nombres de modelos, setup de migraciones — mantenido por el propio equipo de Prisma.

## Instalar

```bash
npx skills add https://github.com/prisma/skills --skill prisma-database-setup
```

## Fuente

[skills.sh/prisma/skills/prisma-database-setup](https://www.skills.sh) — oficial de Prisma, 189K+ instalaciones.

## Cuándo usarlo

- Arrancando un proyecto nuevo con Prisma — cubre el setup inicial completo, no solo `npx prisma init`.
- Como referencia de convenciones cuando un schema ya existente creció desordenado.

## Consideraciones

- Complementa las guías de esta biblioteca — [Prisma en Express](/guides/express-prisma), [Prisma en Astro](/guides/astro-prisma), [Prisma en Next.js](/guides/nextjs-prisma) cubren la integración con cada framework; este skill cubre convenciones del schema en sí, independiente del framework.
