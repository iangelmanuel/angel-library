---
title: "12 principios de animación — movimiento aplicado a interfaces"
description: "Artículo interactivo que traduce los principios clásicos de animación de Disney a animación web y de producto, con demostraciones en vivo."
category: findings
stack: hallazgos-web
order: 3
tags: [animacion, ui, ux, diseño, interaccion, css]
url: https://www.raphaelsalaja.com/library/12-principles-of-animation
resourceCategory: animations
personalNote: "Los ejemplos en vivo son lo que lo hace distinto de los cien artículos que repiten la misma lista; se ve el principio, no se lee."
related:
  - guides/ui-ux-estilos-visuales
updatedAt: 2026-08-30
---

> Escrito y construido por **[Raphael Salaja](https://www.raphaelsalaja.com)**. Es gratuito, con un enlace de donación para apoyar su trabajo.

Artículo **interactivo** que toma los doce principios clásicos de la animación —formulados por los animadores de Disney— y los traduce a la animación de interfaces web y de producto. Cada principio viene con demostraciones en vivo en la propia página.

## Los doce principios

| | Principio | En una interfaz |
| --- | --- | --- |
| 1 | Elasticidad | Deformar para transmitir peso y flexibilidad |
| 2 | Anticipación | Preparar al usuario antes de la acción |
| 3 | Escena | Dirigir la atención hacia lo importante |
| 4 | Acción | Cuadro a cuadro o por poses clave |
| 5 | Continuidad | Nada se detiene ni arranca de golpe |
| 6 | Suavidad | Entradas y salidas graduales |
| 7 | Arcos | Movimientos curvos para mayor realismo |
| 8 | Contexto | Detalles que apoyan la acción principal |
| 9 | Tiempo | La duración correcta da fluidez o torpeza |
| 10 | Exageración | Enfatizar para comunicar mejor |
| 11 | Volumen | Coherencia, profundidad y realismo |
| 12 | Atractivo | Animaciones agradables y con personalidad |

## Por qué sirve para programar interfaces

La mayoría de las animaciones malas de una aplicación no fallan por la técnica sino por el criterio: duran demasiado, arrancan de golpe, se mueven en línea recta o compiten con lo que el usuario intenta leer. Los principios 5, 6, 9 y 3 cubren exactamente esos cuatro errores.

Traducido a CSS: **continuidad** y **suavidad** son la función de aceleración, **tiempo** es la duración, **arcos** es no interpolar en línea recta, y **escena** es decidir qué merece moverse y qué no.

## Cómo leerlo

Está pensado para escritorio: varios ejemplos necesitan espacio y puntero para apreciarse. Es un artículo conceptual con demostraciones, no un tutorial: explica el porqué y muestra el efecto, sin entrar en implementaciones extensas.

## Un principio que la web añade

A los doce clásicos, una interfaz suma uno que el cine no tiene: **poder apagarlos**. Cualquier animación de producto debe respetar `prefers-reduced-motion`, porque para parte de las personas el movimiento no es agradable sino molesto o incapacitante.

```css title="src/styles/movimiento.css"
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```
