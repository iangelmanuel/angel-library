---
title: vitest-testing — referencia rápida
description: Aserciones, tests async, mocks básicos, y cómo evitar falsos positivos — para cualquier proyecto que use Vitest.
category: skills
stack: ia-skills
order: 19
tags: [ai, skill, testing, vitest]
tool: Cross-tool
related: [libraries/vitest-backend, libraries/supertest]
updatedAt: 2026-08-17
---

Referencia rápida de Vitest — aserciones comunes, testing de código asíncrono, mocks básicos, y patrones para evitar falsos positivos (tests que pasan pero no prueban lo que creés que prueban).

## Instalar

```bash
npx skills add https://github.com/existential-birds/beagle --skill vitest-testing
```

## Fuente

[skills.sh](https://www.skills.sh) — existential-birds/beagle.

## Cuándo usarlo

- Escribiendo tests con Vitest en cualquier parte del stack — frontend o [backend](/libraries/vitest-backend), la API es la misma.
- Como chequeo rápido de "¿este test realmente prueba algo, o solo pasa porque no falla nunca?" — el foco en falsos positivos es lo más específico de este skill frente a documentación genérica de Vitest.

## Consideraciones

- Para tests de integración HTTP específicamente (no solo unitarios), ver [Supertest](/libraries/supertest) en esta misma biblioteca — cubre el caso puntual de testear una app Express completa que este skill no cubre en detalle.
