---
title: "Glassmorphism"
description: "Superficies de vidrio esmerilado con backdrop-filter: cómo se construyen, cuánto cuestan en rendimiento y cómo mantener el texto legible."
type: guides
order: 4
tags: [ui, diseño, estilos, glassmorphism, css, backdrop-filter]
related:
  - ui-ux/ui-ux-estilos/ui-ux-estilos-visuales
  - ui-ux/ui-ux-estilos/ui-ux-estilo-liquid-glass
updatedAt: 2026-08-30
---

El **glassmorphism** simula vidrio esmerilado: una superficie semitransparente que desenfoca lo que tiene detrás. Sirve para una cosa concreta: comunicar **qué está encima de qué** sin recurrir a sombras pesadas.

Su momento fue macOS Big Sur y Windows 11, y hoy es la técnica base de la que parte Liquid Glass.

## Cómo se ve

<div style="border:1px solid rgba(255,255,255,.1); border-radius:8px; padding:2.5rem 1.5rem; background:linear-gradient(135deg,#7c3aed,#2563eb 45%,#06b6d4); display:flex; align-items:center; justify-content:center; margin:1.5rem 0;">
  <span style="display:block; padding:1.5rem 2rem; max-width:22rem; font-family:ui-sans-serif,system-ui,sans-serif; color:#ffffff; background:rgba(255,255,255,.14); backdrop-filter:blur(12px); -webkit-backdrop-filter:blur(12px); border:1px solid rgba(255,255,255,.3); border-radius:16px; box-shadow:0 8px 32px rgba(0,0,0,.25);">
    <span style="display:block; font-size:1rem; font-weight:700; margin-bottom:.4rem;">Panel de vidrio</span>
    <span style="display:block; font-size:.85rem; opacity:.92;">El fondo se ve borroso detrás de la superficie.</span>
  </span>
</div>

## El CSS

```css title="src/styles/glassmorphism.css"
.vidrio {
  background: rgb(255 255 255 / 0.14);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgb(255 255 255 / 0.3);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgb(0 0 0 / 0.25);
}
```

Cuatro piezas, todas necesarias:

| Pieza | Por qué |
| --- | --- |
| `background` semitransparente | Sin él, el desenfoque no se ve como vidrio sino como niebla |
| `backdrop-filter: blur()` | Es el efecto en sí: desenfoca lo que está **detrás** |
| `border` claro | Define el canto del vidrio; sin borde, la superficie flota sin límite |
| `box-shadow` | Separa la capa del fondo |

La confusión más común es usar `filter: blur()` en vez de `backdrop-filter`. `filter` desenfoca el elemento **y su contenido**, dejando el texto ilegible. `backdrop-filter` desenfoca solo lo que hay detrás.

## Rendimiento

`backdrop-filter` es de las propiedades más caras de CSS: obliga al navegador a componer y desenfocar la región de debajo en cada cuadro.

Consecuencias prácticas:

- **No lo pongas en elementos de una lista larga.** Diez tarjetas de vidrio en un desplazamiento hacen caer los fotogramas en gama media.
- **Radios de desenfoque grandes cuestan más.** Entre `blur(8px)` y `blur(40px)` hay una diferencia real de coste.
- **Cuidado al animarlo.** Animar el valor del desenfoque es mucho más costoso que animar `opacity`.

Un uso sensato es una o dos superficies fijas —una barra superior, un modal—, no el sistema entero.

## Legibilidad

El riesgo del estilo es que el contraste del texto **depende de lo que haya detrás**, y eso cambia al desplazar. Un texto blanco que se lee perfecto sobre la zona azul del fondo desaparece cuando pasa sobre la zona clara.

Tres defensas:

```css title="src/styles/glassmorphism.css"
.vidrio {
  /* 1. Suelo de opacidad: el fondo nunca es completamente transparente. */
  background: rgb(15 23 42 / 0.55);
}

/* 2. Alternativa cuando el navegador no soporta el efecto. */
@supports not (backdrop-filter: blur(12px)) {
  .vidrio {
    background: rgb(15 23 42 / 0.92);
  }
}

/* 3. Respeta a quien pide menos transparencia en el sistema. */
@media (prefers-reduced-transparency: reduce) {
  .vidrio {
    backdrop-filter: none;
    background: rgb(15 23 42 / 0.97);
  }
}
```

El bloque `@supports not` no es opcional: sin él, en un navegador sin `backdrop-filter` queda un panel casi transparente con texto encima del fondo crudo.

## Cuándo usarlo

- **Sí** en capas que se superponen a contenido: barras de navegación fijas, modales, paneles laterales, notificaciones.
- **Sí** sobre fondos con color o imagen — sobre un fondo plano el efecto no se aprecia y solo pagas el coste.
- **No** en tablas, formularios largos o cualquier superficie con mucho texto.
- **No** en listas con desplazamiento.
