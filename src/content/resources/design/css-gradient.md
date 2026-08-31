---
title: "CSS Gradient — generador y galería de degradados"
description: Editor visual para combinar varios colores en un degradado lineal o circular y copiar el código CSS que reproduce el resultado.
category: resources
tags: [css, gradients, colors, ui]
url: https://cssgradient.io/
resourceCategory: css
technologies: []
personalNote: Útil para construir fondos suaves, hero sections y accents sin usar imágenes.
related: [resources/design/css-glass, resources/animations/animista]
updatedAt: 2026-08-15
---

## Cómo leer el resultado

Un degradado combina varios puntos de color. En uno lineal, el primer valor indica la dirección; cada porcentaje marca dónde debe aparecer un color. La herramienta permite ajustar esos valores visualmente y después copiar una declaración como esta:

```css
background: linear-gradient(90deg, #2a7b9b 0%, #57c785 50%, #eddd53 100%);
```

Antes de usarla, reduce los puntos que no aporten una diferencia visible y comprueba el contraste de cualquier texto colocado encima. Si el degradado forma parte de la identidad del sitio, convierte sus colores en variables para no repetir valores sueltos.
