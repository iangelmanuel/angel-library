---
title: "flex-wrap: balance — repartir las filas de un flex"
description: "Nuevo valor de flex-wrap que reparte los items entre líneas para que ninguna quede casi vacía; incluye sintaxis, soporte y cómo aplicarlo con progressive enhancement."
type: guides
order: 4
tags: [css, flexbox, layout, responsive, progressive-enhancement]
website: https://developer.mozilla.org/en-US/docs/Web/CSS/flex-wrap
related:
  - languages/css/css-layout-advanced
  - languages/css/css-layout-tricks
updatedAt: 2026-09-01
---

`flex-wrap: balance` reparte los items entre las líneas de un contenedor flex para que **todas midan más o menos lo mismo**, en vez de llenar cada línea hasta el borde y dejar la última con lo que sobre.

## El problema: el item huérfano

Con `flex-wrap: wrap` el navegador llena una línea, y cuando ya no cabe nada, baja al siguiente. Si en la última línea cabe un solo item, ahí se queda: siete tarjetas en una fila y una sola debajo, estirada y suelta.

La solución de siempre eran media queries que fijaban el ancho de las tarjetas por rango de pantalla. Es frágil: basta añadir una tarjeta o alargar un título para que los cortes vuelvan a quedar mal.

## Cómo se usa

```css title="styles/cards.css"
.cards {
  display: flex;
  flex-wrap: balance;
  gap: 1rem;
}
```

El navegador mira **todos** los items antes de decidir dónde corta, y reparte para que las líneas queden equilibradas. Con ocho tarjetas que darían 7 + 1, saca 4 + 4.

### Sintaxis completa

`balance` es un modificador que acompaña a `wrap` o a `wrap-reverse`:

```css
flex-wrap: balance; /* equivale a: wrap balance */
flex-wrap: wrap balance;
flex-wrap: wrap-reverse balance; /* el orden entre las dos palabras da igual */
```

La gramática formal de la propiedad quedó así:

```
flex-wrap = nowrap | [ wrap | wrap-reverse ] || balance
```

Dos consecuencias que conviene tener claras:

- Si escribes `balance` solo, la otra palabra clave vale `wrap` por defecto.
- `nowrap balance` **no es válido**: sin salto de línea no hay nada que equilibrar.

## Fijar un mínimo de líneas

La propiedad hermana `flex-line-count` obliga a repartir en un número mínimo de líneas aunque todo cupiera en una:

```css
.layout {
  display: flex;
  flex-wrap: balance;
  flex-line-count: 2;
}
```

Sirve para maquetas que deben verse en dos filas sí o sí, sin recurrir a anchos calculados.

## Soporte y progressive enhancement

Llegó en **Chrome 150** y Edge equivalente; el resto de navegadores todavía no lo implementa. No hay polyfill.

La buena noticia es que degrada solo: un navegador que no entiende `balance` descarta la declaración entera y se queda con la anterior.

```css title="styles/cards.css"
.cards {
  display: flex;
  flex-wrap: wrap; /* respaldo para todos */
  gap: 1rem;
}

@supports (flex-wrap: balance) {
  .cards {
    flex-wrap: balance;
  }
}
```

El bloque `@supports` es opcional —bastaría declarar `wrap` y después `balance`—, pero deja explícito que se trata de una mejora y no de un requisito.

## Cuándo vale la pena

- **Grids de tarjetas** cuyo número cambia según el contenido.
- **Nubes de tags** y filtros, donde una etiqueta suelta abajo se ve como un error.
- **Menús de navegación** centrados que envuelven en pantallas medianas.
- **Galerías** con imágenes de anchos distintos.

Si el número de elementos es fijo y ya lo controlas con `grid-template-columns`, no aporta nada: `balance` resuelve el caso en que **no sabes cuántos items habrá**.

## Errores frecuentes

- **Esperar que iguale alturas.** Equilibra el reparto entre líneas, no el tamaño de cada item; para eso siguen estando `flex: 1` o `align-items: stretch`.
- **Usarlo con `nowrap`.** La declaración se descarta entera.
- **Darlo por hecho en producción.** Hoy solo lo tiene una familia de navegadores: sin el respaldo `wrap`, el resto se queda sin envolver como esperabas.
