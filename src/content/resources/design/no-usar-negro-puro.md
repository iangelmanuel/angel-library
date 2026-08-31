---
title: "UX Planet — alternativas al negro puro en texto y fondos"
description: "Por qué el #000000 cansa la vista en interfaces oscuras y qué grises usar en su lugar, con valores concretos."
category: resources
tags: [color, accesibilidad, dark-mode, contraste, diseño]
url: https://uxplanet.org/alternatives-to-using-pure-black-000000-for-text-and-backgrounds-54ef0e733cdb
resourceCategory: colors
personalNote: "El dato accionable es #121212 como fondo oscuro, la recomendación de Material Design; cambiar eso solo ya mejora una interfaz oscura."
related:
  - resources/design/cool-contrast
updatedAt: 2026-08-30
---

> Escrito por **Dmitry Sergushkin** en UX Planet.

Artículo sobre por qué conviene evitar el negro puro `#000000` en texto y fondos, y qué usar en su lugar.

## El problema

Texto blanco sobre negro puro tiene **demasiado contraste**, y eso cansa la vista en lecturas largas.

Hay además un argumento perceptivo: el negro absoluto no existe en la naturaleza, así que el ojo no está preparado para ese tono como fondo. El resultado es que los elementos de color encima parecen vibrar —el efecto que hace que la tipografía "baile" sobre fondo negro—.

## Qué usar

La recomendación principal, la misma que da el equipo de diseño de Google para Material Design:

| Color | Valor | Nota |
| --- | --- | --- |
| Cod Gray | `#121212` | La opción por defecto para fondos oscuros |
| Dark Gunmetal | `#222428` | Alternativa algo más clara |
| Jet | `#2A2A2A` | Para superficies elevadas |
| Black Olive | `#242526` | Con un matiz cálido |
| Midnight Blue | `#212121` | Neutro |

`#121212` no es un capricho: deja margen para representar **elevación**. En una interfaz oscura, una tarjeta por encima del fondo se indica aclarando la superficie, y desde el negro puro no se puede aclarar sin saltar de golpe.

## Cómo aplicarlo

Lo mismo vale del otro lado: en fondo claro, texto en un gris muy oscuro (`#1a1a1a`, `#18181b`) se lee más cómodo que negro puro, sin perder contraste suficiente.

La comprobación sigue siendo la misma: WCAG pide **4.5:1** para texto normal y **3:1** para texto grande. Bajar del negro puro a `#121212` no compromete esos umbrales, y se puede verificar con [Cool Contrast](/resources/design/cool-contrast).

## Matiz importante

Evitar el negro puro es una recomendación general, no una regla absoluta. En pantallas **OLED** el negro puro apaga el píxel, lo que ahorra batería y da negros reales; algunos modos de ahorro de energía lo buscan a propósito. Y para personas con ciertas condiciones visuales, el contraste máximo es preferible.

Como con casi todo en accesibilidad, la salida no es elegir por ellas sino permitir la elección cuando se pueda.
