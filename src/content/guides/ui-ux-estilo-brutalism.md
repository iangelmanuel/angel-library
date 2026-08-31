---
title: "Brutalism"
description: "Mostrar el material crudo de la web: HTML sin disfraz, bordes duros, tipografía de sistema y cero degradados."
category: ui-ux
stack: ui-ux-estilos
order: 8
tags: [ui, diseño, estilos, brutalismo, css, tipografia]
related:
  - guides/ui-ux-estilos-visuales
  - guides/ui-ux-estilo-minimalism
updatedAt: 2026-08-30
---

El **brutalismo web** toma prestado el nombre de la arquitectura de hormigón visto: en vez de tapar el material, lo enseña. Aquí el material es el HTML — bordes duros, tipografías del sistema, enlaces subrayados en azul, cero degradados y cero sombras suaves.

No es descuido. Es una decisión de mostrar la estructura en lugar de esconderla bajo capas de estilo.

## Cómo se ve

<div style="border:1px solid rgba(255,255,255,.1); border-radius:8px; padding:2rem; background:#f5f5f0; display:flex; justify-content:center; margin:1.5rem 0;">
  <span style="display:block; max-width:26rem; width:100%; font-family:ui-monospace,'Courier New',monospace; color:#000000; background:#ffffff; border:3px solid #000000; padding:1.5rem;">
    <span style="display:block; font-size:1.5rem; font-weight:700; line-height:1.15; text-transform:uppercase; margin-bottom:.75rem;">Archivo público</span>
    <span style="display:block; font-size:.8rem; line-height:1.65; margin-bottom:1.25rem;">1.204 documentos. Sin cookies. Sin analítica. Sin JavaScript.</span>
    <span style="display:inline-block; padding:.6rem 1.2rem; font-size:.8rem; font-weight:700; text-transform:uppercase; color:#ffffff; background:#000000; border:3px solid #000000;">Entrar &rarr;</span>
    <span style="display:block; margin-top:1.25rem; font-size:.72rem; border-top:2px solid #000000; padding-top:.6rem;">actualizado 2026-08-30</span>
  </span>
</div>

## El CSS

Lo característico es lo que **no** hay:

```css title="src/styles/brutalism.css"
.brutal {
  font-family: ui-monospace, "Courier New", monospace;
  color: #000;
  background: #fff;
  /* Bordes gruesos y sólidos, sin radio. */
  border: 3px solid #000;
  border-radius: 0;
  /* Sin difuminar: una sombra sólida desplazada. */
  box-shadow: 6px 6px 0 #000;
}

.brutal a {
  color: #0000ee; /* el azul por defecto del navegador, a propósito */
  text-decoration: underline;
}

.brutal button:hover {
  /* La interacción invierte, no atenúa. */
  color: #fff;
  background: #000;
}
```

Tres decisiones que definen el estilo:

| Decisión | Efecto |
| --- | --- |
| `border-radius: 0` | Todo es rectangular; nada intenta ser un objeto |
| Sombra sin desenfoque | Profundidad declarada, no simulada |
| Tipografía del sistema o monoespaciada | Se ve "sin diseñar" a propósito |

## La ventaja que nadie menciona

El brutalismo es **rápido**. Sin degradados, sin desenfoques, sin sombras difuminadas y con tipografías del sistema, no hay fuentes que descargar ni composición cara. Una página brutalista bien hecha carga en una fracción de lo que carga una glassmorphista.

También suele ser accesible por accidente: el contraste negro sobre blanco es máximo, los enlaces se ven como enlaces y los bordes de los controles son inequívocos.

## Cuándo usarlo

- **Sí** en portafolios, blogs personales, archivos, documentación, proyectos con postura editorial.
- **Sí** cuando la velocidad y la independencia importan más que la sofisticación visual.
- **No** en comercio electrónico o productos donde la confianza se construye con pulcritud: el estilo se lee como "sitio raro" para un público general.
- **No** como excusa para no diseñar. Un brutalismo bueno está tan compuesto como cualquier otro estilo; la diferencia está en el vocabulario, no en el esfuerzo.

## Accesibilidad

Parte con ventaja, pero tiene dos trampas propias:

- **El monoespaciado a tamaño pequeño cansa.** Para textos largos conviene no bajar de 16 px y dar un `line-height` generoso (1.6 o más).
- **Las mayúsculas sostenidas se leen peor.** El `text-transform: uppercase` funciona en titulares cortos; en un párrafo entorpece la lectura y algunos lectores de pantalla deletrean palabras que interpretan como siglas.

```css title="src/styles/brutalism.css"
.brutal :focus-visible {
  /* Coherente con el estilo y perfectamente visible. */
  outline: 4px solid #0000ee;
  outline-offset: 0;
}
```
