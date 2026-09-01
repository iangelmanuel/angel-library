---
title: "Claymorphism"
description: "Formas infladas de aspecto plastilina: radios enormes, colores pastel y una sombra interior que da volumen sin imitar ningún objeto real."
type: guides
order: 5
tags: [ui, diseño, estilos, claymorphism, css]
related:
  - ui-ux/ui-ux-estilos/ui-ux-estilos-visuales
  - ui-ux/ui-ux-estilos/ui-ux-estilo-neumorphism
updatedAt: 2026-08-30
---

El **claymorfismo** hace que los elementos parezcan de plastilina: hinchados, con esquinas muy redondeadas, colores pastel y una luz suave que entra desde arriba.

Se parece al neumorfismo en la sensación táctil, pero resuelve su peor defecto: aquí el elemento **sí tiene color propio**, distinto del fondo, así que el contraste no depende de dos sombras.

## Cómo se ve

<div style="border:1px solid rgba(255,255,255,.08); border-radius:8px; padding:2.5rem; background:#efe7ff; display:flex; gap:1.5rem; align-items:center; justify-content:center; flex-wrap:wrap; margin:1.5rem 0;">
  <span style="display:inline-block; padding:1.1rem 2rem; font-family:ui-sans-serif,system-ui,sans-serif; font-size:.95rem; font-weight:700; color:#4c1d95; background:#c4b5fd; border-radius:28px; box-shadow:inset 0 -8px 12px rgba(255,255,255,.55), inset 0 8px 14px rgba(76,29,149,.22), 0 14px 24px rgba(76,29,149,.28);">Empezar</span>
  <span style="display:inline-block; padding:1.1rem 2rem; font-family:ui-sans-serif,system-ui,sans-serif; font-size:.95rem; font-weight:700; color:#155e63; background:#99f6e4; border-radius:28px; box-shadow:inset 0 -8px 12px rgba(255,255,255,.6), inset 0 8px 14px rgba(21,94,99,.2), 0 14px 24px rgba(21,94,99,.25);">Explorar</span>
</div>

## El CSS

```css title="src/styles/claymorphism.css"
.clay {
  padding: 1.1rem 2rem;
  color: #4c1d95;
  background: #c4b5fd;
  /* El radio grande es lo que produce la sensación de "inflado". */
  border-radius: 28px;
  box-shadow:
    /* Brillo inferior: la parte más gruesa de la masa. */
    inset 0 -8px 12px rgb(255 255 255 / 0.55),
    /* Sombra superior interna: el borde por donde entra la luz. */
    inset 0 8px 14px rgb(76 29 149 / 0.22),
    /* Sombra proyectada, amplia y difusa. */
    0 14px 24px rgb(76 29 149 / 0.28);
}
```

Las tres sombras no son intercambiables:

| Sombra | Qué aporta |
| --- | --- |
| `inset` inferior clara | El volumen: sin ella la forma se ve plana |
| `inset` superior oscura | El grosor del material |
| Externa difusa | Separación del fondo |

El radio manda: por debajo de unos 20 px el efecto deja de leerse como plastilina y parece un botón redondeado normal.

## Cuándo usarlo

- **Sí** en productos con tono amable: educación infantil, salud y bienestar, aplicaciones de hábitos, onboarding ilustrado.
- **Sí** en páginas de aterrizaje donde la calidez importa más que la densidad.
- **No** en herramientas profesionales: el estilo comunica "juguete", y eso trabaja en contra de la confianza en un panel financiero o administrativo.
- **No** en interfaces densas: el radio y el relleno grandes ocupan mucho espacio por elemento.

## Accesibilidad

Es de los estilos más benignos, pero tiene dos trampas:

- **Los pasteles fallan con texto claro.** Un `#c4b5fd` de fondo necesita texto oscuro; con blanco encima no llega a 4.5:1. Comprueba cada pareja de color.
- **El estado activo cambia poco.** Como el volumen ya es fuerte, presionar suele traducirse en un cambio sutil. Conviene reforzarlo:

```css title="src/styles/claymorphism.css"
.clay:active {
  box-shadow:
    inset 0 -4px 8px rgb(255 255 255 / 0.4),
    inset 0 6px 12px rgb(76 29 149 / 0.3),
    0 6px 12px rgb(76 29 149 / 0.25);
  transform: translateY(3px);
}

.clay:focus-visible {
  outline: 3px solid #4c1d95;
  outline-offset: 3px;
}
```

El `translateY` es lo que hace que se sienta pulsado; sin él el cambio de sombras pasa desapercibido.
