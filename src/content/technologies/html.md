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
updatedAt: 2026-08-19
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

## Documento, elemento, atributo y propiedad

Un **elemento** es una unidad del documento, como `<button>`. Un **atributo** aparece en el HTML y configura su estado inicial, como `disabled`. Cuando el navegador analiza el documento crea un objeto DOM con **propiedades** que JavaScript puede leer o modificar.

```html
<input id="nickname" value="Ana" disabled />

<script>
  const input = document.querySelector('#nickname');

  console.log(input.getAttribute('value')); // "Ana": atributo del HTML
  console.log(input.value);                 // "Ana": valor actual de la propiedad

  input.value = 'Andrea';
  console.log(input.getAttribute('value')); // Sigue siendo "Ana"
</script>
```

El atributo conserva el valor declarado; la propiedad `value` refleja el estado vivo del control. Esta diferencia importa al depurar formularios y componentes.

## Parser y corrección del documento

El **parser** o analizador de HTML convierte texto en nodos. HTML tolera ciertos errores y el navegador intenta corregirlos, pero el DOM resultante puede no coincidir con la indentación del archivo.

```html
<!-- Un <p> no puede contener un <div>; el navegador cerrará el párrafo. -->
<p>
  Introducción
  <div>Bloque</div>
</p>
```

Cuando un framework hidrata HTML inválido, el árbol producido en el servidor puede diferir del que corrigió el navegador. Validar el marcado evita errores difíciles de rastrear.

## Atributos globales menos obvios

| Atributo | Qué expresa | Caso de uso |
| --- | --- | --- |
| `hidden` | El elemento no se presenta actualmente | Panel colapsado que JavaScript puede revelar |
| `inert` | El subárbol no recibe foco ni interacción | Contenido detrás de un diálogo modal |
| `data-*` | Metadatos propios accesibles desde `dataset` | Identificador para comportamiento del componente |
| `translate="no"` | El contenido no debería traducirse | Nombre de producto o fragmento de código |
| `contenteditable` | El contenido puede editarse | Editor simple, con gestión adicional de selección y pegado |
| `spellcheck` | Sugiere revisión ortográfica | Texto natural, no códigos o identificadores |

`data-*` sirve para datos pequeños asociados al elemento, no para almacenar objetos grandes ni información secreta: el atributo es visible en el documento.

## HTML, DOM y árbol de accesibilidad

El árbol DOM representa estructura para scripts y estilos. El **árbol de accesibilidad** expone una versión centrada en nombres, roles, estados y relaciones para tecnologías asistivas. CSS puede cambiar apariencia, pero no convierte automáticamente un `div` en botón.

```html
<nav aria-label="Documentación principal">
  <a href="/html">HTML</a>
  <a href="/css" aria-current="page">CSS</a>
</nav>
```

`nav` identifica una región de navegación, `aria-label` la distingue de otras y `aria-current="page"` comunica el enlace activo. La semántica debe representar el estado real, no añadirse como decoración.

## Mejora progresiva

La **mejora progresiva** comienza con una base funcional en HTML y añade CSS o JavaScript cuando están disponibles. Un enlace sigue navegando, un formulario conserva `action` y `method`, y un botón usa comportamiento nativo.

Este enfoque reduce puntos únicos de fallo y crea una base más accesible. No prohíbe experiencias avanzadas; obliga a decidir qué capacidad es esencial y cuál es una mejora.
