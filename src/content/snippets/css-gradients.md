---
title: Degradados CSS — Referencia rápida
description: Linear, radial y conic gradients, texto con degradado y bordes con degradado, sin imágenes.
category: general
stack: css
language: css
tags: [css, gradients, design]
updatedAt: 2026-08-16
---

Los tres tipos de degradado y un par de trucos que se preguntan seguido: texto con degradado y bordes con degradado.

## Linear y radial

`linear-gradient()` va en una dirección (ángulo o palabra clave); `radial-gradient()` se expande desde un punto. `at top left` controla dónde nace el radial.

```css
.bg-linear {
  background: linear-gradient(135deg, #60a5fa, #c4b5fd);
}

.bg-radial {
  background: radial-gradient(circle at top left, #67e8f9, transparent 60%);
}
```

## Conic

`conic-gradient()` gira alrededor de un punto en vez de expandirse — sirve para gráficos tipo torta, selectores de color (color wheel) o barras de progreso circulares.

```css
.progress-ring {
  background: conic-gradient(#60a5fa 0% 65%, #232329 65% 100%);
  border-radius: 50%;
}
```

## Texto con degradado

`background-clip: text` recorta el fondo con la forma del texto; `color: transparent` deja ver ese fondo en vez del color de texto normal. Necesita el prefijo `-webkit-` todavía para compatibilidad amplia.

```css
.text-gradient {
  background: linear-gradient(90deg, #60a5fa, #f0abfc);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
}
```

## Borde con degradado

`border-image` existe, pero recortar esquinas con `border-radius` es un dolor de cabeza. El truco de dos backgrounds (uno `padding-box`, otro `border-box`) funciona con esquinas redondeadas sin problema.

```css
.border-gradient {
  border: 2px solid transparent;
  border-radius: 0.75rem;
  background:
    linear-gradient(#0a0a0b, #0a0a0b) padding-box,
    linear-gradient(135deg, #60a5fa, #c4b5fd) border-box;
}
```

## Resumen

| Técnica | Cuándo usarla |
| --- | --- |
| `linear-gradient()` | Fondos con transición de color en una dirección |
| `radial-gradient()` | Efecto de "luz" o foco desde un punto |
| `conic-gradient()` | Gráficos circulares, progreso, selectores de color |
| `background-clip: text` | Texto con degradado |
| Doble background (`padding-box` / `border-box`) | Borde con degradado, con esquinas redondeadas |

## Consideraciones

- El truco de borde con degradado necesita que el color del primer `linear-gradient()` (el de `padding-box`) coincida con el fondo real detrás del elemento — si el fondo cambia, hay que actualizar ese valor.
- `background-clip: text` deja el texto invisible en navegadores sin soporte (muy raros hoy) porque `color: transparent` no tiene fallback — si te importa ese caso, agrega un `color` sólido antes de la regla y que la cascada lo pise.
- Los degradados no son accesibles como "color de texto" para herramientas de contraste automático: si el texto necesita cumplir contraste WCAG, verificalo manualmente contra el fondo real.
