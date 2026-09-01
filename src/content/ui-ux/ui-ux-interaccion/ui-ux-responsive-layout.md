---
title: Layout responsive guiado por contenido
description: Diseñar interfaces fluidas con jerarquía, límites legibles, container queries y estados extremos antes que breakpoints arbitrarios.
type: guides
order: 2
tags: [responsive, layout, css, ux]
scope: diseño responsive
related:
  - ui-ux/ui-ux-design-systems/ui-ux-design-systems
  - languages/css/css-layout-tricks
updatedAt: 2026-08-25
---

## Del contenido hacia afuera

Empieza por viewport estrecho y contenido real: títulos largos, traducciones, cero resultados, errores y listas grandes. Añade columnas cuando el contenido tenga espacio, no porque un dispositivo famoso mida cierta cantidad.

```css
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 18rem), 1fr));
  gap: clamp(1rem, 2vw, 2rem);
}
```

## Reglas

- Limita ancho de lectura, no todo el layout.
- Usa `min()`, `max()`, `clamp()` y grid flexible antes de sumar media queries.
- Container queries permiten que un componente responda a su contenedor, útil en sidebars y dashboards.
- Conserva orden lógico del DOM; no uses CSS para invertir lectura y foco.
- Targets táctiles necesitan espacio y separación, incluso si el icono es pequeño.

## Container query

```css
.card-list {
  container-type: inline-size;
}

@container (min-width: 36rem) {
  .card {
    grid-template-columns: 10rem 1fr;
  }
}
```

El componente responde al espacio que recibe, por lo que funciona en main, sidebar o modal sin conocer el viewport completo. Define breakpoints donde el contenido deja de ser legible, no por nombres de dispositivos.

## Densidad y prioridad

Responsive no significa ocultar funciones sin alternativa. Reordena por importancia, agrupa acciones secundarias y conserva una ruta clara hacia ellas. Si una tabla necesita desplazamiento horizontal, mantén encabezados y acción principal comprensibles.

## Probar extremos

320 px, zoom 200%, landscape bajo, texto ampliado, idioma largo y reducción de movimiento. Una UI responsive no solo “cabe”: mantiene prioridad, controles alcanzables y contexto sin ocultar acciones críticas.

Comprueba también teclado con barras sticky, áreas seguras móviles, contenido vacío y datos extremos. Usa DevTools para explorar, pero termina en dispositivos y navegadores reales cuando el flujo sea crítico.
