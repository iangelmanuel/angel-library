---
title: "UI Colors — escalas de color para Tailwind"
description: Generador que convierte un color principal en tonos claros y oscuros para estados, fondos y texto, listos para adaptar a Tailwind o a un sistema de diseño.
type: resources
tags: [colors, tailwind, design-system, ui]
url: https://uicolors.app/
resourceCategory: colors
technologies: []
personalNote: Útil para crear escalas semánticas antes de definir los tokens de una interfaz.
related: [resources/colors/colour-contrast-checker, resources/colors/cool-contrast]
updatedAt: 2026-08-15
---

## Qué es una escala de color

Una interfaz rara vez usa un único azul o verde: necesita tonos claros para fondos, tonos medios para bordes y estados, y tonos oscuros para texto. UI Colors calcula esa familia a partir de un color base y la presenta con la numeración habitual de Tailwind.

## Flujo recomendado

1. Elige el color que representa mejor la identidad o la acción principal.
2. Genera la escala y prueba sus tonos sobre los fondos reales del proyecto.
3. Comprueba contraste de texto, foco, error y estados deshabilitados.
4. Asigna nombres por función —como `surface`, `primary` o `danger`— en vez de acoplar toda la interfaz a “blue-500”.
