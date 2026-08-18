---
title: CSS avanzado para rendering y performance
description: Containment, content-visibility, compositing, animaciones y estilos críticos sin convertir cada elemento en una capa.
category: general
stack: css
order: 3
tags: [css, performance, rendering, animations, containment]
scope: rendering CSS
related:
  - guides/core-web-vitals
  - snippets/css-animations
  - guides/performance-resource-loading
updatedAt: 2026-08-18
---

## Del estilo al píxel

Un cambio puede afectar style recalculation, layout, paint y composite. Cambiar `width`, `top` o `font-size` puede recalcular geometría; cambiar `transform` y `opacity` suele permitir que el navegador componga una capa ya pintada. “GPU” no significa gratis: más capas consumen memoria y pueden empeorar scroll o batería.

## Containment

`contain` indica que un subárbol tiene límites conocidos. `contain: layout paint` puede evitar que cambios internos invaliden todo el documento, pero también recorta contenido y cambia el comportamiento de posicionamiento. `content-visibility: auto` permite omitir rendering de contenido fuera de pantalla; usa `contain-intrinsic-size` para reservar una estimación y evitar saltos.

```css
.long-section {
  content-visibility: auto;
  contain-intrinsic-size: auto 40rem;
}
```

Mide antes de aplicarlo a todo. Un contenido que el usuario debe encontrar inmediatamente con búsqueda, lector de pantalla o navegación por anclas necesita pruebas específicas.

## Animaciones resistentes

Anima preferentemente `transform` y `opacity`, respeta `prefers-reduced-motion` y evita transiciones que oculten cambios de estado importantes. `will-change` es una sugerencia temporal para un elemento que realmente cambiará; dejarlo en cientos de nodos crea presión de memoria.

```css
@media (prefers-reduced-motion: no-preference) {
  .card { transition: transform 180ms ease, opacity 180ms ease; }
  .card:hover { transform: translateY(-0.25rem); }
}
```

## Diagnóstico

Usa Performance panel para distinguir layout, paint y tareas de JavaScript. Paint flashing ayuda a detectar repintados excesivos; Layers muestra por qué un elemento se convirtió en capa. Una regla CSS que ahorra un milisegundo en laboratorio no compensa una interfaz más difícil de mantener si el problema real es una imagen grande o un script de terceros.
