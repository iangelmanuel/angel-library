---
title: CSS moderno y avanzado
description: Cascada, layout, responsive design, custom properties, queries, containment y rendering para interfaces escalables.
category: general
stack: css
order: 1
tags: [css, layout, cascade, responsive, performance]
website: https://developer.mozilla.org/es/docs/Web/CSS
related:
  - guides/css-cascade-layers-container
  - guides/css-layout-advanced
  - guides/css-rendering-performance
updatedAt: 2026-08-18
---

## Cómo pensar CSS a otro nivel

CSS no es una colección de propiedades aisladas. El resultado depende de la cascada, la especificidad, el contexto de formato, el tamaño disponible, el writing mode y el pipeline de rendering. Un layout robusto empieza por decidir qué restricciones son invariantes y cuáles deben adaptarse.

## Orden de estudio

1. Cascada, herencia, especificidad y capas.
2. Grid, Flexbox, sizing intrínseco y containing blocks.
3. Custom properties, funciones matemáticas y escalas fluidas.
4. Container queries, `:has()`, nesting y `@scope`.
5. Stacking contexts, containment, animaciones y performance.

## Regla práctica

Antes de añadir un `z-index`, `!important`, altura fija o media query, identifica qué contexto está produciendo el resultado. La mayoría de los bugs persistentes de CSS no se arreglan con otro valor: se arreglan eliminando una restricción accidental o colocando la regla en la capa correcta.
