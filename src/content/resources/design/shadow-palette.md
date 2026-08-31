---
title: "Shadow Palette Generator — escala de sombras coherente"
description: Generador de una escala coherente de sombras CSS para elevaciones bajas, medias y altas.
category: resources
tags: [css, shadows, box-shadow, design-system, ui]
url: https://www.joshwcomeau.com/shadow-palette/
resourceCategory: css
technologies: []
personalNote: Útil para definir tokens de elevación consistentes; ajusta el color de la sombra al fondo y no uses la sombra como única señal visual de límites o interacción.
related:
  - resources/design/neumorphism
  - resources/design/css-glass
  - resources/design/css-gradient
updatedAt: 2026-08-28
---

## Qué genera

Shadow Palette Generator crea variables CSS para tres niveles de elevación:

- **Baja:** elementos apenas separados de la superficie, como tarjetas o controles.
- **Media:** menús, popovers y elementos flotantes cercanos.
- **Alta:** modales y superficies que deben percibirse por encima del resto de la interfaz.

Cada nivel combina varias capas de `box-shadow`. Superponer sombras pequeñas y grandes produce una transición más natural que depender de una sola sombra con desenfoque elevado.

## Controles importantes

| Control | Qué modifica |
| --- | --- |
| Oomph | Intensidad y presencia general de la sombra |
| Crispy | Nitidez o suavidad de los bordes |
| Light Position | Dirección desde la que parece llegar la luz |
| Background Color | Superficie sobre la que se calculan y previsualizan las sombras |
| Tint Shadow | Añade color a la sombra en lugar de usar negro neutro |
| Resolution | Cantidad de capas que componen cada elevación |

## Flujo recomendado

1. Introduce el color real de la superficie principal del proyecto.
2. Ajusta una dirección de luz única y mantenla en toda la interfaz.
3. Genera los niveles bajo, medio y alto sin exagerar la intensidad.
4. Copia las variables de `:root` y renómbralas según los tokens del sistema de diseño.
5. Prueba las sombras en modo claro y oscuro; una misma escala rara vez funciona correctamente en ambos.

```css
:root {
  --shadow-surface-low: var(--shadow-elevation-low);
  --shadow-surface-medium: var(--shadow-elevation-medium);
  --shadow-surface-high: var(--shadow-elevation-high);
}

.card {
  box-shadow: var(--shadow-surface-low);
}

.popover {
  box-shadow: var(--shadow-surface-medium);
}

.modal {
  box-shadow: var(--shadow-surface-high);
}
```

## Buenas prácticas

- La elevación debe expresar jerarquía, no decorar todos los elementos por igual.
- Mantén constante la dirección de la luz para que las superficies no parezcan pertenecer a escenas diferentes.
- Una sombra con matiz similar al fondo suele percibirse más natural que negro puro.
- Conserva bordes o diferencias de superficie cuando sean necesarios: usuarios con baja visión pueden no distinguir sombras suaves.
- Revisa el resultado sobre el fondo definitivo y en pantallas distintas antes de convertirlo en un token global.
