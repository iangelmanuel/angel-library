---
title: "Liquid Glass"
description: "El lenguaje visual que Apple presentó en la WWDC 2025: vidrio con refracción, profundidad y respuesta al movimiento, y hasta dónde se puede imitar en la web."
type: guides
order: 9
tags: [ui, diseño, estilos, apple, liquid-glass, css]
website: https://developer.apple.com/videos/play/wwdc2025/219/
related:
  - ui-ux/ui-ux-estilos/ui-ux-estilos-visuales
  - ui-ux/ui-ux-estilos/ui-ux-estilo-glassmorphism
updatedAt: 2026-08-30
---

**Liquid Glass** es el lenguaje de diseño que Apple presentó en la **WWDC 2025**, su cambio visual más grande desde iOS 7. Se aplica de forma unificada en iOS 26, iPadOS 26, macOS Tahoe 26, tvOS 26, watchOS 26 y visionOS.

La idea es un material dinámico que imita el vidrio real: translucidez, **refracción**, profundidad y reacción al movimiento, adaptándose al contenido y a la luz que tiene debajo.

## En qué se diferencia del glassmorphism

Es la pregunta obligada, porque a primera vista se parecen:

|                       | Glassmorphism       | Liquid Glass                                           |
| --------------------- | ------------------- | ------------------------------------------------------ |
| Qué hace con el fondo | Lo desenfoca        | Lo desenfoca **y lo refracta**, como un cristal grueso |
| Reacción              | Estático            | Responde al movimiento y a la interacción              |
| Adaptación            | Opacidad fija       | Se ajusta al contenido y a la luz de debajo            |
| Origen                | Técnica de CSS      | Sistema definido por un fabricante, con APIs propias   |
| Bordes                | Línea clara de 1 px | Cantos que concentran y curvan la luz                  |

En resumen: glassmorphism simula una **lámina**; Liquid Glass simula un **volumen** de vidrio.

## En plataformas Apple

Apple publicó recursos de diseño actualizados para iOS 26, iPadOS 26 y macOS Tahoe 26. **SwiftUI** incorpora modificadores de vista específicos para materiales de vidrio, y **UIKit** tiene las APIs equivalentes para quien trabaja de forma imperativa.

Lo importante para un equipo de producto: en las plataformas de Apple el material es **del sistema**, no algo que se reimplementa. Adoptarlo es usar los componentes nativos y dejar que el sistema resuelva el resto.

## Aproximación en la web

En la web no existe el material: hay que aproximarlo. Se puede llegar bastante lejos combinando desenfoque, saturación, un canto que refleje luz y un brillo que se mueva con el puntero.

<div style="border:1px solid rgba(255,255,255,.1); border-radius:8px; padding:3rem 1.5rem; background:#0b1220; background-image:radial-gradient(circle at 25% 30%, rgba(56,189,248,.55), transparent 50%), radial-gradient(circle at 75% 70%, rgba(168,85,247,.5), transparent 50%); display:flex; justify-content:center; margin:1.5rem 0;">
  <span style="display:block; max-width:22rem; padding:1.5rem 1.75rem; font-family:ui-sans-serif,system-ui,sans-serif; color:#f8fafc; background:linear-gradient(135deg, rgba(255,255,255,.22), rgba(255,255,255,.08)); backdrop-filter:blur(18px) saturate(180%); -webkit-backdrop-filter:blur(18px) saturate(180%); border:1px solid rgba(255,255,255,.35); border-radius:22px; box-shadow:inset 0 1px 0 rgba(255,255,255,.55), inset 0 -1px 0 rgba(255,255,255,.15), 0 12px 40px rgba(0,0,0,.4);">
    <span style="display:block; font-size:1rem; font-weight:700; margin-bottom:.4rem;">Material líquido</span>
    <span style="display:block; font-size:.85rem; line-height:1.6; opacity:.9;">Desenfoque, saturación y un canto que atrapa la luz.</span>
  </span>
</div>

```css title="src/styles/liquid-glass.css"
.liquid {
  /* Degradado en la propia superficie: simula el grosor del vidrio. */
  background: linear-gradient(
    135deg,
    rgb(255 255 255 / 0.22),
    rgb(255 255 255 / 0.08)
  );
  /* saturate() es lo que separa esto de un desenfoque plano:
     revive el color de lo que hay detrás, como el vidrio real. */
  backdrop-filter: blur(18px) saturate(180%);
  -webkit-backdrop-filter: blur(18px) saturate(180%);
  border: 1px solid rgb(255 255 255 / 0.35);
  border-radius: 22px;
  box-shadow:
    /* Canto superior iluminado y canto inferior tenue: el volumen. */
    inset 0 1px 0 rgb(255 255 255 / 0.55),
    inset 0 -1px 0 rgb(255 255 255 / 0.15),
    0 12px 40px rgb(0 0 0 / 0.4);
}
```

Las dos piezas que lo alejan del glassmorphism clásico son `saturate()` en el `backdrop-filter` y el par de sombras internas que iluminan los cantos.

Para la parte reactiva, un brillo que sigue al puntero:

```css title="src/styles/liquid-glass.css"
.liquid {
  position: relative;
  overflow: hidden;
}

.liquid::after {
  content: "";
  position: absolute;
  inset: 0;
  background: radial-gradient(
    circle at var(--x, 50%) var(--y, 50%),
    rgb(255 255 255 / 0.25),
    transparent 45%
  );
  opacity: 0;
  transition: opacity 0.3s;
  pointer-events: none;
}

.liquid:hover::after {
  opacity: 1;
}

@media (prefers-reduced-motion: reduce) {
  .liquid::after {
    display: none;
  }
}
```

```ts title="src/scripts/liquid.ts"
document.querySelectorAll<HTMLElement>(".liquid").forEach((panel) => {
  panel.addEventListener("pointermove", (event) => {
    const caja = panel.getBoundingClientRect()
    panel.style.setProperty("--x", `${event.clientX - caja.left}px`)
    panel.style.setProperty("--y", `${event.clientY - caja.top}px`)
  })
})
```

## El costo

Todo lo del [glassmorphism](/ui-ux/ui-ux-estilos/ui-ux-estilo-glassmorphism) aplica multiplicado: `blur(18px) saturate(180%)` es más caro que un desenfoque solo, y añadir un brillo animado encima significa recomponer en cada movimiento del puntero.

Reglas para no arruinar el rendimiento:

- Úsalo en **una o dos superficies fijas**, nunca en elementos de una lista.
- El seguimiento del puntero debe limitarse con `requestAnimationFrame` si la superficie es grande.
- Da siempre una alternativa sólida con `@supports not (backdrop-filter: blur(1px))`.

## Cuándo usarlo

- **Sí** en aplicaciones nativas del ecosistema Apple: ahí es lo que el sistema espera y lo resuelve el sistema.
- **Sí** en una web que quiera sentirse afín a ese ecosistema, en superficies puntuales.
- **No** como sistema visual de un producto multiplataforma: imitarlo fuera de Apple sale caro en rendimiento y siempre queda a medias.
- **No** en interfaces densas de datos.
