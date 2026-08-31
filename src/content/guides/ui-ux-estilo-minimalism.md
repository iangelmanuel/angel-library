---
title: "Minimalism"
description: "Quitar hasta que solo quede lo necesario: espacio, jerarquía tipográfica y el riesgo de dejar la interfaz ambigua."
category: ui-ux
stack: ui-ux-estilos
order: 6
tags: [ui, diseño, estilos, minimalismo, tipografia, accesibilidad]
related:
  - guides/ui-ux-estilos-visuales
  - guides/ui-ux-estilo-maximalism
updatedAt: 2026-08-30
---

El **minimalismo** no es "poner poco". Es quitar todo lo que no comunica, y hacer que lo que queda cargue con el trabajo: espacio en blanco, tamaño de letra, peso tipográfico y un solo color de acento.

Es el estilo por defecto de casi todo el software de trabajo, y con razón: cuando la tarea dura horas, cualquier adorno se vuelve ruido.

## Cómo se ve

<div style="border:1px solid rgba(255,255,255,.1); border-radius:8px; padding:2.5rem 2rem; background:#fafafa; display:flex; justify-content:center; margin:1.5rem 0;">
  <span style="display:block; max-width:24rem; width:100%; font-family:ui-sans-serif,system-ui,sans-serif; color:#18181b;">
    <span style="display:block; font-size:.7rem; font-weight:600; letter-spacing:.12em; text-transform:uppercase; color:#71717a; margin-bottom:.75rem;">Facturación</span>
    <span style="display:block; font-size:1.6rem; font-weight:600; line-height:1.2; margin-bottom:.6rem;">Plan actual</span>
    <span style="display:block; font-size:.9rem; line-height:1.6; color:#52525b; margin-bottom:1.75rem;">Se renueva el 14 de septiembre. Puedes cambiarlo cuando quieras.</span>
    <span style="display:inline-block; padding:.7rem 1.4rem; font-size:.85rem; font-weight:600; color:#fafafa; background:#18181b; border-radius:6px;">Cambiar plan</span>
  </span>
</div>

No hay sombras, ni bordes decorativos, ni degradados. La jerarquía sale del tamaño, el peso y el espacio.

## Las herramientas reales

Sin adornos, quedan cuatro palancas. Conviene usarlas con una escala, no a ojo:

```css title="src/styles/minimalism.css"
:root {
  /* Escala tipográfica: saltos claros, no incrementos de 1px. */
  --texto-xs: 0.75rem;
  --texto-sm: 0.875rem;
  --texto-base: 1rem;
  --texto-lg: 1.25rem;
  --texto-xl: 1.6rem;

  /* Escala de espaciado: todo múltiplo de 4px. */
  --espacio-1: 0.25rem;
  --espacio-2: 0.5rem;
  --espacio-4: 1rem;
  --espacio-6: 1.5rem;
  --espacio-8: 2rem;

  /* Un solo acento para toda la interfaz. */
  --acento: #2563eb;
}
```

| Palanca | Cómo se usa |
| --- | --- |
| Espacio | Agrupa lo relacionado y separa lo distinto; sustituye a las cajas |
| Tamaño | Marca el nivel de jerarquía |
| Peso | Distingue dentro de un mismo nivel |
| Color | Reservado para lo accionable, no para decorar |

La regla que más rinde: **el espacio entre grupos siempre mayor que el espacio dentro de un grupo**. Si la etiqueta está más cerca del campo de al lado que del suyo, la interfaz miente aunque se vea limpia.

## El riesgo: ambigüedad

El fallo característico del minimalismo no es feo, es **confuso**. Al quitar bordes, sombras y fondos, se pierden las señales de qué es interactivo.

Síntomas típicos:

- Botones que son solo texto de color y no se distinguen de un enlace.
- Campos de formulario sin borde, que parecen texto hasta que se hace clic.
- Iconos sin etiqueta que nadie interpreta igual.
- Estados deshabilitados indistinguibles de los normales.

### Cómo evitarlo

```css title="src/styles/minimalism.css"
/* Un control necesita un límite perceptible, aunque sea sutil. */
.campo {
  border: 1px solid #d4d4d8;
  border-radius: 6px;
  padding: var(--espacio-2) var(--espacio-4);
}

.campo:focus-visible {
  outline: 2px solid var(--acento);
  outline-offset: 1px;
  border-color: var(--acento);
}
```

Tres reglas prácticas:

1. **Todo control lleva un límite visible**, sea borde o fondo. WCAG pide 3:1 de contraste para ese límite.
2. **Los iconos solos llevan etiqueta accesible** con `aria-label`, y en acciones importantes también texto visible.
3. **El estado nunca depende solo del color.** Un error necesita texto, no solo el borde rojo.

## Cuándo usarlo

- **Sí** en herramientas de trabajo, paneles, documentación, formularios largos, lectura.
- **Sí** cuando el rendimiento importa: es el estilo más barato de renderizar.
- **No** cuando el producto necesita diferenciarse visualmente en un mercado saturado — todo el software minimalista se parece.
- **No** si el equipo no tiene disciplina para mantener las escalas: un minimalismo sin sistema se convierte en inconsistencia.
