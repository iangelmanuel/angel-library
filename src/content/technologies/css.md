---
title: CSS moderno y avanzado
description: Cascada, layout, responsive design, custom properties, queries, containment y rendering para interfaces escalables.
category: languages
stack: css
order: 1
tags: [css, layout, cascade, responsive, performance]
website: https://developer.mozilla.org/es/docs/Web/CSS
related:
  - guides/css-cascade-layers-container
  - guides/css-layout-advanced
  - guides/css-rendering-performance
updatedAt: 2026-08-19
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

## La cascada es un algoritmo

**CSS** significa *Cascading Style Sheets* u hojas de estilo en cascada. “Cascada” no significa simplemente que la última regla gana. El navegador considera origen, importancia, contexto de encapsulación, capa, especificidad, proximidad de ámbito y orden de aparición.

```css
@layer reset, base, components, utilities;

@layer components {
  .button { background: var(--color-action); }
}

@layer utilities {
  .bg-transparent { background: transparent; }
}
```

Las **cascade layers** o capas de cascada establecen prioridad entre grupos. En este orden, una utilidad puede reemplazar un componente sin aumentar especificidad ni usar `!important`.

## Valor declarado, calculado y usado

Una propiedad atraviesa varias etapas. El valor **declarado** aparece en la regla; el valor **calculado** ya resolvió cascada, herencia y parte de las variables; el valor **usado** depende del layout y del espacio real.

```css
.card {
  width: min(100%, 60rem);
  padding-inline: clamp(1rem, 3vw, 2rem);
}
```

`min()` elige el menor resultado. `clamp(mínimo, preferido, máximo)` limita una escala fluida. El valor final depende del contenedor y del viewport, por lo que no siempre puede conocerse leyendo una sola declaración.

## Contextos de formato

Un **formatting context** define cómo se colocan los descendientes. Flexbox resuelve distribución en un eje; Grid coordina filas y columnas; el flujo normal organiza bloques y texto; el posicionamiento absoluto saca un elemento del flujo normal.

Elegir el contexto correcto reduce correcciones. Para una cuadrícula bidimensional se usa Grid; para alinear una fila de controles, Flexbox suele expresar mejor la intención.

## Sizing intrínseco

El tamaño **intrínseco** proviene del contenido. Palabras como `min-content`, `max-content`, `fit-content()` y `minmax()` permiten diseñar alrededor de esa realidad.

```css
.layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) fit-content(18rem);
}
```

`minmax(0, 1fr)` permite que la columna flexible se reduzca por debajo del tamaño mínimo automático de su contenido. Es una solución frecuente cuando texto largo provoca desbordamiento en Grid.

## Propiedades lógicas y modos de escritura

`margin-inline`, `padding-block` e `inset-inline-start` describen ejes lógicos en lugar de izquierda y derecha físicas. Funcionan mejor con idiomas de derecha a izquierda y modos de escritura verticales.

```css
.callout {
  border-inline-start: 0.25rem solid var(--color-info);
  padding-inline-start: 1rem;
}
```

La regla mantiene el énfasis al inicio de la línea aunque cambie la dirección del documento.

## Feature queries y mejora progresiva

`@supports` detecta si el navegador comprende una declaración. Permite ofrecer una base y mejorarla de forma localizada:

```css
.gallery { display: flex; flex-wrap: wrap; }

@supports (grid-template-columns: subgrid) {
  .gallery {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
  }
}
```

La consulta detecta sintaxis, no calidad de implementación ni preferencia del usuario. Para movimiento, contraste y color se combinan media queries de preferencias con una interfaz que siga siendo comprensible sin la mejora.
