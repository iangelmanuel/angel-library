---
title: "Neumorphism.io — generador de sombras neumórficas"
description: Generador del estilo neumórfico, que usa luces y sombras suaves para hacer que un control parezca salir de la superficie; entrega el CSS como punto de partida.
type: resources
tags: [css, ui, shadows, design]
url: https://neumorphism.io/
resourceCategory: css
technologies: []
personalNote: Buena referencia visual, pero revisar accesibilidad porque las sombras suaves pueden reducir los límites de los controles.
related: [resources/css/css-glass, resources/css/css-gradient]
updatedAt: 2026-08-15
---

## Qué genera

La herramienta combina una sombra clara y otra oscura para simular que un elemento sobresale o se hunde en una superficie del mismo color. Devuelve el `background`, el radio de borde y las declaraciones `box-shadow` necesarias.

## Límite importante

Este estilo puede hacer que botones y campos se confundan con el fondo. Usa el resultado como referencia visual, no como sustituto de bordes, etiquetas, estados de foco y contraste. Si un control deja de reconocerse al quitar la sombra, necesita una señal adicional.
