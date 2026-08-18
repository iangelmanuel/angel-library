---
title: Semántica, teclado y gestión del foco
description: Construir interacciones operables con HTML nativo, orden lógico, foco visible y comportamiento predecible.
category: accessibility
order: 1
tags: [accessibility, html, keyboard, focus]
scope: fundamentos de interacción accesible
related:
  - practices/accessibility-checklist
  - guides/accessibility-dialogs-live-regions
updatedAt: 2026-08-18
---

## HTML antes que ARIA

Un elemento nativo ya incluye nombre, rol, estados y comportamiento de teclado. Usa `button` para acciones, `a href` para navegación, `input` para entrada y landmarks como `main`, `nav` y `aside`. Un `div role="button"` obliga a reconstruir foco, Enter, Space y estados.

## Recorrido por teclado

- El orden de Tab debe seguir el DOM y la lectura visual.
- No uses valores positivos de `tabindex`; crean un orden paralelo frágil.
- `tabindex="0"` incorpora un elemento al flujo; `-1` permite enfocarlo por código.
- Nunca elimines el outline sin un reemplazo de contraste suficiente.
- Los controles ocultos no deben seguir siendo enfocables.

```css
:focus-visible {
  outline: 3px solid #60a5fa;
  outline-offset: 3px;
}
```

## Cuándo mover el foco

Muévelo solo cuando cambia el contexto: abrir un diálogo, navegar en una SPA, mostrar un error global o insertar una vista que reemplaza a otra. Después de cerrar un modal, devuélvelo al disparador. Para contenido añadido sin cambio de contexto, suele bastar un anuncio en vivo.

## Nombres accesibles

Los icon buttons necesitan nombre (`aria-label` o texto visualmente oculto). El nombre debe describir la acción —“Cerrar diálogo”— y no la apariencia —“Icono X”—. Prueba el árbol de accesibilidad del navegador: si nombre, rol o estado son confusos, el componente también lo será para tecnologías asistivas.

## Patrones frecuentes

Usa el elemento que ya expresa la intención. Un enlace debe cambiar de ubicación y un botón debe ejecutar una acción; si una tarjeta completa navega, puedes hacer que el enlace envuelva el contenido en lugar de agregar un `onClick` a un `div`. Para un acordeón, un botón controla un panel y actualiza `aria-expanded`; para una pestaña, el patrón necesita además seleccionar una sola pestaña y relacionarla con su panel.

Un `tabindex="-1"` es útil para llevar el foco a un encabezado después de cambiar una vista, pero no debe convertirse en una forma de hacer enfocable cada elemento decorativo. Si el foco se mueve por código, anuncia el nuevo contexto con un encabezado claro y evita que el usuario pierda la referencia de dónde estaba.

## Caso: navegación directamente SPA

Después de cambiar de ruta, enfoca el encabezado principal o el contenedor de contenido, no el botón del menú que dejó de existir. Mantén un enlace para saltar al contenido y actualiza el título del documento. En una interfaz con transiciones, espera a que el nuevo contenido esté montado antes de enfocar; moverlo demasiado pronto produce un foco perdido o invisible.

## Matriz de prueba

Prueba cada componente con teclado solamente: Tab, Shift+Tab, Enter, Space, Escape y flechas cuando el patrón las requiera. Repite con zoom del navegador y con un lector de pantalla. Verifica también el estado inicial, el estado vacío, el error y el contenido que aparece después directamente petición, porque el foco suele fallar en esas transiciones y no en el caso feliz.
