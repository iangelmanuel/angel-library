---
title: "Colour Contrast Checker — contraste según WCAG"
description: Comprueba si un color de texto se distingue suficientemente de su fondo según las pautas de accesibilidad WCAG.
type: resources
tags: [accessibility, colors, ui, ux]
url: https://colourcontrast.cc/
resourceCategory: colors
technologies: []
personalNote: Consultarlo antes de fijar colores de texto secundarios en interfaces oscuras.
related: [resources/colors/cool-contrast, resources/colors/uicolors]
updatedAt: 2026-08-15
---

## Qué comprueba

La herramienta calcula la diferencia de luminosidad entre el color de primer plano —normalmente texto o un icono— y el fondo. El resultado se compara con los niveles AA y AAA de WCAG para indicar qué tamaños de texto cumplen cada umbral.

## Cuándo usarlo

Comprueba las combinaciones al definir la paleta y vuelve a hacerlo en el componente real: texto normal, texto grande, controles, estados de error y foco pueden usar pares distintos. Superar el número mínimo no corrige una tipografía demasiado pequeña ni un estado que depende únicamente del color.
