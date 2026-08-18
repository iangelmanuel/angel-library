---
title: zod-4 — referencia completa de la API
description: Migración de Zod 3 a 4, referencia completa de la API, discriminated unions, e integración con React Hook Form.
category: skills
stack: ia-skills
order: 17
tags: [ai, skill, zod]
tool: Cross-tool
related: [libraries/zod, guides/express-jwt]
updatedAt: 2026-08-17
---

Referencia completa de la API de Zod 4 — incluye una guía de migración desde Zod 3 (relevante porque muchos ejemplos/tutoriales viejos todavía usan sintaxis 3, como ya se nota en [la guía de Zod de esta biblioteca](/libraries/zod)), discriminated unions, e integración específica con React Hook Form.

## Instalar

```bash
npx skills add https://github.com/prowler-cloud/prowler --skill zod-4
```

## Fuente

[skills.sh](https://www.skills.sh) — prowler-cloud/prowler.

## Cuándo usarlo

- Cualquier proyecto en esta biblioteca que use Zod — que es prácticamente todos: validación de `.env`, [React Hook Form + Zod](/integrations/react-hook-form-zod), body de requests en Express.
- Cuando el agente propone sintaxis vieja de Zod 3 (`.string().email()` en vez de `z.email()`) — este skill mantiene la referencia actualizada a mano.

## Consideraciones

- Para patrones más avanzados (schemas recursivos con `z.lazy()`, tuning de performance), ver también [zod-schema-validation](/skills/skill-zod-schema-validation) — complementario, no superpuesto.
