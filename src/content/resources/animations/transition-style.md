---
title: "transition.style — transiciones con clip-path"
description: "Colección de transiciones que revelan u ocultan contenido mediante formas; se pueden copiar como CSS y aplicar también al cambio entre páginas."
category: resources
tags: [css, transiciones, animaciones, clip-path, view-transitions]
url: https://www.transition.style/
resourceCategory: animations
personalNote: "El catálogo se ve y se copia en segundos; lo más útil es que las mismas transiciones sirven para View Transitions, no solo para hover."
related:
  - resources/hallazgos/12-principios-animacion
updatedAt: 2026-08-30
---

> Creado por **[Adam Argyle](https://github.com/argyleink)** ([argyleink/transition.css](https://github.com/argyleink/transition.css)), con licencia Apache-2.0. El paquete en npm es `transition-style`.

Catálogo de **transiciones listas para usar** construidas con `clip-path`: círculos que se abren, barridos, persianas, formas que revelan el contenido. Se ven todas en la página y se copian con un clic.

## Cómo se usa

Hay dos formas, y la segunda es la interesante:

**Como CSS suelto.** Se copia la transición del catálogo y se pega en la hoja de estilos.

**Como paquete.**

```bash
npm install transition-style
```

Después se importa y se aplica con un atributo o una clase, sin escribir la animación a mano.

## Lo que lo hace distinto

Las transiciones están pensadas para funcionar con la **API de View Transitions** del navegador, no solo para un `:hover`. Eso permite usar la misma transición de máscara al **cambiar de página**, que es donde más se nota.

En un sitio con View Transitions —como Astro con `<ClientRouter />`— eso significa poder cambiar la animación entre páginas eligiendo una del catálogo, en vez de escribir `@keyframes` propios.

## Qué tener en cuenta

- **`clip-path` recorta, no difumina.** Si el contenido debe seguir visible fuera del área, esta técnica no aplica.
- **Respeta `prefers-reduced-motion`.** Una transición de página que barre toda la pantalla es justo el tipo de movimiento que molesta a quien lo desactiva.
- El repositorio tiene su último cambio en 2025; para un conjunto de transiciones CSS eso no es problema, porque `clip-path` es estable.
