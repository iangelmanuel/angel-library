---
title: "Maximalism"
description: "Abundancia deliberada de color, tipografía y capas para que una interfaz se recuerde, sin que la tarea se pierda en el ruido."
category: ui-ux
stack: ui-ux-estilos
order: 7
tags: [ui, diseño, estilos, maximalismo, tipografia, color]
related:
  - guides/ui-ux-estilos-visuales
  - guides/ui-ux-estilo-minimalism
updatedAt: 2026-08-30
---

El **maximalismo** es la respuesta a que todo el software se parezca: más color, más tipografías, más capas, más textura. La apuesta es la memoria — que alguien recuerde la interfaz al día siguiente.

La diferencia entre maximalismo y desorden es que el primero **está compuesto**: hay jerarquía, solo que expresada con abundancia en vez de con vacío.

## Cómo se ve

<div style="border:1px solid rgba(255,255,255,.1); border-radius:8px; padding:2.5rem 1.5rem; background:#150d2e; background-image:radial-gradient(circle at 15% 20%, rgba(236,72,153,.45), transparent 45%), radial-gradient(circle at 85% 75%, rgba(250,204,21,.35), transparent 45%); display:flex; justify-content:center; margin:1.5rem 0;">
  <span style="display:block; max-width:26rem; width:100%; font-family:ui-sans-serif,system-ui,sans-serif; color:#fdf4ff; text-align:center;">
    <span style="display:inline-block; padding:.3rem .8rem; font-size:.68rem; font-weight:800; letter-spacing:.16em; text-transform:uppercase; color:#150d2e; background:#facc15; border-radius:999px; margin-bottom:1rem;">Edición limitada</span>
    <span style="display:block; font-size:2.1rem; font-weight:900; line-height:1.05; letter-spacing:-.02em; margin-bottom:.75rem;">Hazlo<span style="color:#f472b6;">.</span> Ruidoso<span style="color:#facc15;">.</span></span>
    <span style="display:block; font-family:ui-monospace,monospace; font-size:.8rem; line-height:1.6; color:#e9d5ff; margin-bottom:1.5rem;">tres tipografías, dos acentos, cero disculpas</span>
    <span style="display:inline-block; padding:.75rem 1.6rem; font-size:.85rem; font-weight:800; color:#150d2e; background:#f472b6; border:2px solid #150d2e; border-radius:8px; box-shadow:5px 5px 0 #facc15;">Quiero uno</span>
  </span>
</div>

## Cómo se compone sin que sea ruido

Tres reglas hacen casi todo el trabajo:

**1. Una sola zona de caos.** El fondo puede tener degradados y formas; el bloque de contenido se mantiene ordenado. Si todo compite, nada destaca.

**2. Jerarquía por contraste extremo, no por acumulación.** El título va en 2.1 rem y peso 900; el texto de apoyo en 0.8 rem monoespaciado. Ese salto es el que ordena la lectura.

**3. Tipografías con papeles distintos.** Tres familias como máximo, y cada una con una función fija: una para titular, una para texto, una para detalle. Si dos hacen lo mismo, sobra una.

```css title="src/styles/maximalism.css"
.hero-max {
  background-color: #150d2e;
  background-image:
    radial-gradient(circle at 15% 20%, rgb(236 72 153 / 0.45), transparent 45%),
    radial-gradient(circle at 85% 75%, rgb(250 204 21 / 0.35), transparent 45%);
}

.titular-max {
  font-size: clamp(2rem, 6vw, 4rem);
  font-weight: 900;
  line-height: 1.05;
  letter-spacing: -0.02em;
}

.boton-max {
  color: #150d2e;
  background: #f472b6;
  border: 2px solid #150d2e;
  /* Sombra dura, sin difuminar: el recurso más reconocible del estilo. */
  box-shadow: 5px 5px 0 #facc15;
}
```

La sombra dura (`box-shadow` sin desenfoque) es la firma del estilo y además es barata: no cuesta nada al navegador, a diferencia de un desenfoque.

## Cuándo usarlo

- **Sí** en páginas de aterrizaje, portafolios, lanzamientos, campañas, productos de nicho con personalidad.
- **Sí** cuando el objetivo es que te recuerden, no que completes un formulario.
- **No** en la parte de la aplicación donde la gente trabaja. Un maximalismo bonito en la portada y un panel sobrio dentro es una combinación perfectamente válida.
- **No** si no hay alguien con criterio visual manteniéndolo: se degrada rápido cuando cada persona añade su color.

## Accesibilidad

Es donde más fácil se rompe, y el problema casi nunca es el color de fondo sino el **texto encima de un degradado**:

- Comprueba el contraste en la zona **más clara** del fondo, no en el promedio. Un texto blanco sobre el degradado rosa-amarillo del ejemplo falla justo donde el amarillo es más intenso.
- Si el fondo tiene mucha variación, pon una capa de color sólido semitransparente debajo del texto.
- Los tamaños grandes ayudan: WCAG permite 3:1 en texto grande (18.66 px en negrita o 24 px normal).
- Las animaciones de fondo tienen que respetar `prefers-reduced-motion`.

```css title="src/styles/maximalism.css"
/* Capa de apoyo para garantizar contraste sobre un fondo variable. */
.texto-sobre-degradado {
  background: rgb(21 13 46 / 0.7);
  padding: 1rem 1.5rem;
  border-radius: 8px;
}
```
