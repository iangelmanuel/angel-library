---
title: zod-schema-validation — patrones avanzados
description: Schemas recursivos con z.lazy(), tuning de performance de validación, mensajes de error con i18n.
type: skills
order: 18
tags: [ai, skill, zod]
tool: Cross-tool
related: [general/packages/zod]
updatedAt: 2026-08-17
---

Cubre patrones de Zod que van más allá del uso diario — schemas recursivos (`z.lazy()`, necesario para estructuras tipo árbol o comentarios anidados), ajuste de performance en validaciones costosas, y mapas de error para internacionalización.

## Instalar

```bash
npx skills add https://github.com/mindrally/skills --skill zod-schema-validation
```

## Fuente

[skills.sh](https://www.skills.sh) — mindrally/skills.

## Cuándo usarlo

- Validando estructuras de datos recursivas (árboles de categorías, comentarios con replies anidados) — `z.lazy()` no es intuitivo la primera vez que hace falta.
- Un proyecto multi-idioma donde los mensajes de error de Zod necesitan traducirse, no solo estar en español fijo.

## Consideraciones

- Instalar junto a [zod-4](/skills/ia-skills/skill-zod-4) — ese cubre la API general, este los casos avanzados específicos.
