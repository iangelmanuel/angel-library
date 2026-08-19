---
title: Jerarquía visual, tipografía, espacio y color
description: Convertir importancia y relaciones en una composición legible mediante escala, contraste, alineación, ritmo y tokens.
category: ui-ux
stack: ui-ux-design-systems
order: 2
tags: [ui, visual-hierarchy, typography, spacing, color]
related:
  - guides/ui-ux-design-systems
  - guides/accessibility-visual-reflow-motion
  - guides/ui-ux-responsive-layout
updatedAt: 2026-08-19
---

La jerarquía visual indica qué mirar primero, qué elementos pertenecen juntos y qué acciones tienen mayor importancia. Se construye con diferencias consistentes, no haciendo todo más grande o más brillante.

## Palancas principales

| Palanca | Comunica | Riesgo |
| --- | --- | --- |
| Tamaño y peso | Nivel de importancia | Demasiados niveles compiten |
| Contraste | Énfasis o estado | Contraste bajo reduce legibilidad |
| Espacio | Agrupación y separación | Escala arbitraria pierde ritmo |
| Alineación | Relación y orden | Excepciones generan ruido |
| Color | Marca, estado o categoría | No debe ser la única señal |

## Tipografía

Define una escala pequeña y roles semánticos: título, encabezado, cuerpo, etiqueta y código. La longitud de línea, altura de línea y ancho de columna afectan tanto como el tamaño.

```css
:root {
  --text-sm: 0.875rem;
  --text-base: 1rem;
  --text-lg: 1.25rem;
  --leading-body: 1.6;
  --measure: 68ch;
}

.prose { max-inline-size: var(--measure); }
```

No reduzcas texto secundario hasta volverlo ilegible. La menor importancia puede expresarse también con posición, espacio y peso.

## Espaciado y agrupación

Una escala evita valores distintos para cada componente:

```css
:root {
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
}
```

El espacio dentro de un grupo suele ser menor que el espacio entre grupos. Esta relación es más importante que seguir una fórmula rígida.

## Color semántico

Define tokens por intención —`surface`, `text-muted`, `danger`—, no por un tono concreto. Así un tema puede cambiar sin reescribir componentes. Cada estado necesita contraste, icono o texto y comportamiento coherente.

## Revisión práctica

Entrecierra los ojos o observa en escala de grises: ¿la acción principal sigue clara? Después prueba zoom, contenido largo, error, traducción y alto contraste. La composición debe sobrevivir a datos reales.

