---
title: nodejs-backend-patterns
description: Arquitectura por capas, dependency injection, middlewares, JWT y jerarquías de errores para Express/Fastify — 15 buenas prácticas documentadas.
category: skills
stack: ia-skills
order: 15
tags: [ai, skill, express, node]
tool: Cross-tool
related: [patterns/backend-mvc-structure]
updatedAt: 2026-08-17
---

Cubre patrones de backend Node — setup de Express/Fastify, arquitectura por capas, dependency injection, patrones de middleware, autenticación JWT, y jerarquías de manejo de errores — con 15 buenas prácticas documentadas explícitamente.

## Instalar

```bash
npx skills add https://github.com/wshobson/agents --skill nodejs-backend-patterns
```

## Fuente

[skills.sh](https://www.skills.sh) — wshobson/agents.

## Cuándo usarlo

- Arrancando un backend Express nuevo — complementa directo la [estructura MVC](/patterns/backend-mvc-structure) y las guías de [middlewares](/guides/express-middlewares)/[auth](/guides/express-jwt) de esta biblioteca.
- Como referencia de fondo mientras se escribe código, para que las decisiones de arquitectura sean consistentes entre sesiones distintas.

## Consideraciones

- Combinar con [express-typescript](/skills/skill-express-typescript) si el proyecto además necesita convenciones estrictas de TypeScript (naming, RO-RO pattern, organización de archivos).
