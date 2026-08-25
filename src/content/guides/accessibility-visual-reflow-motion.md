---
title: Contraste, zoom, reflow, color y movimiento
description: Diseñar una interfaz perceptible a 200–400 % de zoom, con contraste suficiente, foco visible y preferencias de movimiento.
category: accessibility
stack: a11y-contenido
order: 2
tags: [accessibility, contrast, reflow, zoom, reduced-motion]
related:
  - guides/accessibility-contenido-multimedia
  - guides/ui-ux-responsive-layout
  - guides/accessibility-testing-manual-automatico
updatedAt: 2026-08-25
---

Una interfaz visual accesible conserva contenido y operación cuando cambian visión, pantalla o preferencias. Probar solo en un monitor amplio oculta desbordes, texto recortado y objetivos demasiado pequeños.

## Contraste y color

WCAG define relaciones mínimas según tamaño y función. Mide colores finales, incluidos estados `hover`, `disabled`, placeholder, texto sobre imagen y foco. El color no debe ser la única señal:

```html
<label for="email">Correo</label>
<input id="email" aria-describedby="email-error" aria-invalid="true" />
<p id="email-error">Escribe un correo válido.</p>
```

El mensaje y `aria-invalid` complementan el borde rojo.

## Zoom y reflow

**Reflow** significa que el contenido se reorganiza sin exigir desplazamiento en dos dimensiones para leer una línea. Prueba zoom de navegador y un viewport equivalente a 320 CSS px.

- Evita alturas fijas en contenido de texto.
- Permite wrapping en botones, tabs y navegación.
- Usa `min-width: 0` en hijos flex/grid que deben encogerse.
- No bloquees zoom con el viewport meta.
- Conserva el foco visible aunque aparezca una barra fija.

Tablas, mapas o diagramas pueden necesitar desplazamiento bidimensional por su naturaleza, pero el resto de la página no.

## Preferencias de movimiento

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    scroll-behavior: auto !important;
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
  }
}
```

No elimines feedback esencial: reemplaza desplazamientos intensos por cambios discretos. Evita destellos y ofrece pausa para movimiento que comienza automáticamente.

## Modos forzados

En alto contraste o `forced-colors`, sombras y fondos pueden desaparecer. Usa bordes reales, texto y controles nativos. Prueba que foco, selección y estados sigan distinguiéndose.

## Objetivos y espaciado

Un icono pequeño puede estar dentro de un área interactiva mayor. Separa acciones vecinas para reducir activaciones accidentales y no coloques controles críticos únicamente al aparecer con hover, porque hover no existe igual en táctil o teclado.

```css
.icon-button {
  inline-size: 2.75rem;
  block-size: 2.75rem;
  display: inline-grid;
  place-items: center;
}
```

## Contenido ampliado

No deshabilites zoom con `user-scalable=no`. Prueba texto al 200 % y zoom/reflow sin perder labels, botones o mensajes. Un modal con altura fija debe permitir desplazamiento interno sin ocultar el botón de cierre ni atrapar el foco fuera de vista.

## Movimiento con propósito

Clasifica animaciones:

- feedback breve que confirma una acción;
- transición espacial que explica relación;
- decoración no esencial;
- movimiento continuo que requiere pausa.

Con `prefers-reduced-motion`, conserva la información y reduce distancia, parallax, zoom o repetición. “Reducido” no siempre significa cero.

## Checklist visual

Contraste final, foco visible, información sin depender de color, zoom, reflow, texto largo, forced colors y preferencia de movimiento. Repite en estados de error, disabled y loading.

## Referencias

- [WCAG: reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html)
- [WCAG: contraste mínimo](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)

