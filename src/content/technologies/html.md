---
title: HTML moderno
description: Elementos y atributos nativos que resuelven accesibilidad, formularios, multimedia, rendimiento y componentes sin JavaScript innecesario.
category: general
stack: html
order: 1
tags: [html, web, semantics, browser, accessibility]
website: https://developer.mozilla.org/es/docs/Web/HTML
related:
  - guides/html-modern-elements
  - guides/html-advanced-forms-media
  - guides/html-web-components-metadata
updatedAt: 2026-08-18
---

## Qué significa HTML moderno

HTML no es solo la estructura visual de una página. El navegador convierte sus elementos en un árbol semántico, un formulario operable, un destino de navegación, una fuente de metadatos o un recurso que puede cargar con prioridades propias. Aprovechar el elemento correcto reduce JavaScript y entrega comportamiento útil incluso antes de hidratar una aplicación.

## Qué estudiar primero

- Elementos con comportamiento nativo: `details`, `dialog`, `button`, `form` y `output`.
- Atributos que describen intención: `autocomplete`, `inputmode`, `enterkeyhint`, `loading` y `fetchpriority`.
- Relaciones semánticas: `aria-describedby`, `headers` en tablas y `itemprop` solo cuando corresponda.
- Multimedia adaptable: `picture`, `source`, `track` y `poster`.
- Componentes nativos: `template`, `slot`, custom elements y shadow DOM.

## Principio práctico

Antes de añadir una librería, pregunta si HTML ya resuelve el comportamiento. Un `<button>` conserva teclado, foco y nombre accesible; un `<div>` con un click obliga a reconstruirlos. Un `<details>` puede ser suficiente para una sección expandible; un `<dialog>` puede gestionar un modal si el flujo no necesita una API compleja.

HTML no reemplaza la validación del servidor, la autorización ni el diseño visual. Su valor está en expresar correctamente la intención y ofrecer una base resistente para CSS, JavaScript y tecnologías asistivas.
