---
title: Elementos HTML poco comunes que conviene conocer
description: Details, dialog, output, progress, meter, time, data y otros elementos nativos para expresar estados y relaciones.
type: guides
order: 2
tags: [html, semantics, accessibility, native]
scope: HTML moderno
related:
  - languages/html/html
  - accessibility/a11y-interaccion/accessibility-dialogs-live-regions
updatedAt: 2026-08-18
---

## Contenido expandible

`details` y `summary` crean una sección que puede abrirse sin JavaScript. El atributo `open` controla el estado inicial y el evento `toggle` permite sincronizar una analítica o una vista complementaria.

```html
<details>
  <summary>Ver criterios de aceptación</summary>
  <ul>
    <li>La operación debe ser reversible.</li>
    <li>El resultado debe anunciarse.</li>
  </ul>
</details>
```

Úsalo para preguntas frecuentes, información secundaria o detalles técnicos. No lo uses como sustituto de tabs o navegación si el usuario necesita comparar paneles al mismo tiempo.

## Diálogo nativo

`dialog` representa una interacción que aparece sobre el contenido. `showModal()` crea un modal y `show()` uno no modal; `returnValue` puede representar la decisión de un formulario con `method="dialog"`.

```html
<button id="open-delete">Eliminar proyecto</button>
<dialog
  id="delete-dialog"
  aria-labelledby="delete-title"
>
  <h2 id="delete-title">¿Eliminar proyecto?</h2>
  <form method="dialog">
    <button value="cancel">Cancelar</button>
    <button value="confirm">Eliminar</button>
  </form>
</dialog>
```

El código todavía debe devolver el foco al disparador, manejar errores y proteger acciones destructivas. El elemento nativo aporta una base, no una decisión completa de UX.

## Estados medibles

- `progress`: progreso de una tarea cuyo total se conoce; `value` y `max` deben representar números reales.
- `meter`: una medida dentro de un rango, como almacenamiento usado o nivel de batería; no es una barra de carga.
- `output`: resultado calculado por una interacción o formulario.
- `time datetime="2026-08-18"`: fecha legible para personas y máquinas.
- `data value="sku-42"`: texto visible con un valor legible por máquinas.

```html
<label for="volume">Volumen</label>
<input
  id="volume"
  type="range"
  min="0"
  max="100"
  value="60"
/>
<output for="volume">60%</output>
```

Estos elementos ayudan a lectores de pantalla, motores de búsqueda y scripts que necesitan distinguir un dato de una cadena decorativa.

## Relaciones y componentes

`figure`/`figcaption` asocia una ilustración con su descripción; `dl`/`dt`/`dd` representa términos y definiciones; `cite` identifica una obra; `abbr title` explica una abreviatura. Elige estos elementos cuando la relación sea real, no para obtener estilos por defecto.
