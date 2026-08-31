---
title: "DESIGN.md"
description: "Formato para describir una identidad visual a los agentes de codificación: tokens legibles por máquina y la justificación en prosa, en un solo archivo."
category: skills
stack: skills-fundamentos
order: 3
tags: [ia, agentes, diseño, design-tokens, especificacion, google]
url: https://github.com/google-labs-code/design.md
resourceCategory: ia
personalNote: "Resuelve un problema muy concreto: el agente aplica los valores correctos pero no sabe por qué existen, así que en cuanto sale del caso previsto improvisa."
related:
  - guides/ui-ux-design-systems
updatedAt: 2026-08-30
---

> Publicado por **[Google Labs](https://github.com/google-labs-code)** con licencia Apache-2.0. Unas 27.600 estrellas. La especificación completa está en [stitch.withgoogle.com](https://stitch.withgoogle.com/docs/design-md/specification).

**DESIGN.md** es una especificación de formato para describir una identidad visual a los **agentes de codificación**. Le da al agente una comprensión estructurada y persistente de un sistema de diseño.

## El formato

Un archivo `DESIGN.md` combina dos cosas en un solo documento:

| Parte | Formato | Para quién |
| --- | --- | --- |
| Tokens de diseño | Encabezado YAML | Legible por máquina: valores exactos |
| Justificación | Texto en Markdown | Legible por humanos: por qué y cómo aplicarlos |

Los tokens le dan al agente los **valores exactos**. El texto le explica **por qué existen** y **cómo aplicarlos**.

## Por qué esa combinación importa

Un archivo solo de tokens —un JSON de colores y espaciados— hace que el agente acierte mientras el caso esté previsto. En cuanto aparece algo que la tabla no cubre, no tiene criterio para decidir y elige al azar.

La prosa es la que aporta ese criterio: si el documento explica que el color de acento se reserva para acciones y nunca para decoración, el agente puede resolver un caso nuevo de forma coherente en vez de tomar el primer valor que encaje.

## Cómo usarlo

Se crea un `DESIGN.md` en la raíz del proyecto, igual que un `README.md` o un `CLAUDE.md`, y el agente lo lee como parte del contexto. La especificación define qué campos van en el encabezado YAML y cómo estructurar la parte narrativa.

Encaja de forma natural junto a los archivos de instrucciones que ya usan los agentes de codificación: uno describe cómo trabajar en el repositorio, este describe cómo debe verse lo que produce.

## Qué tener en cuenta

- **Es una especificación, no una herramienta.** No hay nada que instalar: el valor está en escribir el archivo y en que el agente lo respete.
- **Es joven.** Su adopción depende de que las herramientas la reconozcan; hoy funciona porque los agentes leen Markdown del repositorio, no porque haya soporte formal.
