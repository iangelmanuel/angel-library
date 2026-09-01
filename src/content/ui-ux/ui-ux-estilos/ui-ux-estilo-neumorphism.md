---
title: "Neumorphism"
description: "Elementos que parecen extruidos del propio fondo con dos sombras opuestas, y por qué casi siempre falla en contraste."
type: guides
order: 3
tags: [ui, diseño, estilos, neumorphism, css, accesibilidad]
related:
  - ui-ux/ui-ux-estilos/ui-ux-estilos-visuales
  - ui-ux/ui-ux-estilos/ui-ux-estilo-skeuomorphism
updatedAt: 2026-08-30
---

El **neumorfismo** (de *new skeuomorphism*, también escrito *soft UI*) no dibuja objetos sobre un fondo: hace que parezcan **hechos del mismo material que el fondo**, empujados hacia afuera o hundidos hacia adentro.

El truco es una sola idea: dos sombras del mismo tamaño en direcciones opuestas, una clara y otra oscura, sobre un fondo que no es ni blanco ni negro.

## Cómo se ve

<div style="border:1px solid rgba(255,255,255,.08); border-radius:8px; padding:2.5rem; background:#e0e5ec; display:flex; gap:1.5rem; align-items:center; justify-content:center; flex-wrap:wrap; margin:1.5rem 0;">
  <span style="display:inline-block; padding:.9rem 1.9rem; font-family:ui-sans-serif,system-ui,sans-serif; font-size:.9rem; font-weight:600; color:#4b5563; background:#e0e5ec; border-radius:14px; box-shadow:6px 6px 12px #b8bcc4, -6px -6px 12px #ffffff;">Elevado</span>
  <span style="display:inline-block; padding:.9rem 1.9rem; font-family:ui-sans-serif,system-ui,sans-serif; font-size:.9rem; font-weight:600; color:#4b5563; background:#e0e5ec; border-radius:14px; box-shadow:inset 6px 6px 12px #b8bcc4, inset -6px -6px 12px #ffffff;">Hundido</span>
</div>

## El CSS

```css title="src/styles/neumorphism.css"
:root {
  --neu-fondo: #e0e5ec;
  --neu-oscura: #b8bcc4;
  --neu-clara: #ffffff;
}

.neu {
  background: var(--neu-fondo);
  border-radius: 14px;
  /* Mismo desplazamiento, direcciones opuestas: luz arriba-izquierda. */
  box-shadow:
    6px 6px 12px var(--neu-oscura),
    -6px -6px 12px var(--neu-clara);
}

.neu--hundido {
  box-shadow:
    inset 6px 6px 12px var(--neu-oscura),
    inset -6px -6px 12px var(--neu-clara);
}
```

El fondo del elemento y el de su contenedor **tienen que ser el mismo color**. En cuanto difieren, el efecto se rompe y se ve un rectángulo con sombras raras.

Las dos sombras se derivan del fondo: la oscura es el fondo con menos luminosidad, la clara con más. Por eso el estilo no funciona sobre blanco puro ni negro puro — no queda margen hacia uno de los dos lados.

## El problema serio

Neumorphism es el estilo con peor historial de accesibilidad, y no por descuido de quien lo implementa: **está en su definición**.

Si el elemento y el fondo son del mismo color, el único borde del componente son sombras suaves. WCAG pide 3:1 de contraste para los límites de un control de interfaz, y una sombra difuminada rara vez llega. El resultado práctico: la gente no distingue un botón de una tarjeta decorativa.

Se agrava con:

- **Estados.** Si "activo" es la versión hundida y "normal" la elevada, la diferencia entre ambos son unas sombras invertidas. Con poca luz ambiente o en una pantalla mala, no se percibe.
- **Deshabilitado.** No queda recurso para expresarlo sin salirse del estilo.
- **Foco de teclado.** El anillo de foco tiene que romper el estilo por definición.

### Cómo mitigarlo

Si el diseño ya está decidido, esto lo hace utilizable:

```css title="src/styles/neumorphism.css"
.neu {
  /* Borde de apoyo: da un límite real que la sombra sola no garantiza. */
  border: 1px solid rgb(0 0 0 / 0.08);
}

.neu:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 3px;
}

@media (prefers-contrast: more) {
  .neu {
    box-shadow: none;
    border: 2px solid currentColor;
  }
}
```

Y el texto interior nunca debe ir en el mismo tono del fondo: sobre `#e0e5ec` hace falta un gris oscuro real, no un gris medio.

## Cuándo usarlo

- **Sí** en superficies decorativas: encabezados de tarjeta, contenedores, ilustraciones de producto.
- **Sí** cuando hay un solo elemento neumórfico rodeado de interfaz normal, no una pantalla entera.
- **No** en controles críticos: enviar, pagar, borrar.
- **No** en productos con público amplio o requisitos de accesibilidad formales.

La forma sensata de usarlo es como **acento**, no como sistema.
