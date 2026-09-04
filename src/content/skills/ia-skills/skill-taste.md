---
title: "Taste Skill — dirección visual para frontends menos genéricos"
description: "Colección de skills que añade criterios de composición, tipografía, movimiento y densidad a los agentes para evitar interfaces repetitivas o con apariencia de plantilla."
type: skills
order: 2
tags: [ai, skill, frontend, diseño, ui, codex]
tool: Cross-tool
related:
  - skills/ia-skills/skill-frontend-design
  - skills/ia-skills/skill-impeccable
updatedAt: 2026-09-04
---

**Taste Skill** es una colección abierta de archivos `SKILL.md` para agentes de programación. Su skill principal, `design-taste-frontend`, lee el encargo, propone una dirección visual y limita patrones frecuentes de interfaces generadas por IA antes de escribir el frontend.

Funciona con Codex, Claude Code, Cursor, Gemini CLI y otras herramientas compatibles con Agent Skills. Las reglas no dependen de React, Vue o Svelte: actúan sobre las decisiones visuales y el proceso de implementación.

## Instalar el skill principal

```bash
npx skills add Leonxlnx/taste-skill --skill design-taste-frontend
```

La colección completa contiene skills adicionales para rediseño, estilos concretos, generación de referencias visuales e implementación desde una imagen. Instala solo los que correspondan al flujo para no cargar instrucciones que compitan entre sí.

## Cómo dirige el diseño

El skill principal ajusta tres variables explícitas:

| Variable             | Qué controla                                           |
| -------------------- | ------------------------------------------------------ |
| `DESIGN_VARIANCE`    | Cuánto se aleja la composición de una estructura común |
| `MOTION_INTENSITY`   | Profundidad y frecuencia de las animaciones            |
| `VISUAL_DENSITY`     | Cantidad de información por área visible               |

También analiza el brief, reconoce sistemas de diseño conocidos, propone estructura y ejecuta una comprobación previa contra señales comunes de “AI slop”: gradientes previsibles, tarjetas repetidas, jerarquía plana o decisiones visuales sin relación con el producto.

## Cuándo usarlo

- Al crear una landing page, un portafolio o una página editorial desde cero.
- Cuando el agente produce siempre la misma estética aunque cambie el proyecto.
- Para explorar una dirección visual antes de convertirla en componentes.
- En un rediseño, si se le indica explícitamente qué tokens y componentes debe conservar.

No es la opción principal para dashboards densos, tablas de datos o flujos de producto complejos: el propio skill principal está orientado a superficies donde la dirección artística tiene más peso.

## Fuente y consideraciones

- [Sitio oficial de Taste Skill](https://www.tasteskill.dev/)
- [Código fuente y catálogo de skills](https://github.com/Leonxlnx/taste-skill)

La versión 2 del skill principal se distribuye actualmente como experimental. Revisa sus cambios antes de actualizar un flujo estable y comprueba siempre el `SKILL.md` antes de instalarlo: una skill de terceros modifica las instrucciones con las que el agente decide y escribe código.
