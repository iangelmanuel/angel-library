---
title: vercel-composition-patterns
description: Patrones de composición de componentes React — cuándo componer vs. cuándo agregar props, slots, compound components.
type: skills
order: 8
tags: [ai, skill, react]
tool: Cross-tool
updatedAt: 2026-08-17
---

Guía decisiones de composición de componentes en React — cuándo un componente debería aceptar `children`/slots en vez directamente prop más, cuándo un compound component (`<Tabs><Tabs.Item /></Tabs>`) tiene sentido frente a props planas.

## Instalar

```bash
npx skills add https://github.com/vercel-labs/agent-skills --skill vercel-composition-patterns
```

## Fuente

[skills.sh — vercel-labs/agent-skills](https://www.skills.sh) — 291K+ instalaciones.

## Cuándo usarlo

- Diseñando la API de un componente reutilizable (parte de un sistema de diseño, una librería interna) donde la forma de las props importa a largo plazo.
- Cuando un componente ya acumuló demasiadas props booleanas (`isOpen`, `isDisabled`, `variant`, `size`...) y conviene repensar la composición.

## Consideraciones

- Se complementa bien con [vercel-react-best-practices](/skills/ia-skills/skill-vercel-react-best-practices) — este es específico de composición, el otro cubre prácticas de React más generales.
