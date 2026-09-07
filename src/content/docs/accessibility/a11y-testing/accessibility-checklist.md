---
title: Checklist de accesibilidad web
description: Revisión práctica de semántica, teclado, foco, formularios, contraste y movimiento antes de publicar una interfaz.
type: practices
order: 2
tags: [accessibility, html, forms, ui]
practice: Probar primero con teclado y HTML semántico; ARIA complementa, no reemplaza.
why: Una interfaz operable y comprensible beneficia a personas con discapacidades y también mejora robustez, SEO y usabilidad general.
related:
  - architecture/principios/validate-at-boundaries
updatedAt: 2026-08-18
---

## Antes de agregar ARIA

- Usar `button` para acciones y `a` para navegación.
- Mantener jerarquía lógica de encabezados.
- Asociar cada input con un `label` visible.
- Usar listas, tablas y landmarks por su significado real.

## Teclado y foco

- Todo control se alcanza con Tab y se activa con teclado.
- El foco es visible y no queda atrapado salvo dentro de un modal abierto.
- Al cerrar un modal, el foco vuelve al elemento que lo abrió.
- Un skip link permite saltar navegación repetida.
- El orden visual coincide con el orden del DOM.

## Formularios

- Errores describen el problema y cómo corregirlo.
- `aria-invalid` y `aria-describedby` conectan input y mensaje.
- No depender solo del color para comunicar estado.
- Autocomplete correcto para nombre, email, dirección y credenciales.

## Contenido visual

- `alt` describe la función de la imagen; decorativas usan `alt=""`.
- Contraste suficiente también en hover, focus y disabled.
- Zoom a 200% y reflow sin scroll horizontal innecesario.
- Animación respeta `prefers-reduced-motion`.

## Prueba mínima

1. Recorrer la página sin mouse.
2. Probar con zoom y viewport estrecho.
3. Ejecutar axe/Lighthouse como detector, no como aprobación final.
4. Escuchar el flujo principal con lector de pantalla.

Un score automático alto no demuestra accesibilidad: las herramientas no pueden decidir si un nombre es útil, si el orden tiene sentido o si una interacción es comprensible.

## Contraste, movimiento y contenido multimedia

- Comprobar texto normal, texto grande, iconos funcionales, bordes de controles y estados de foco contra el fondo real.
- No comunicar información solo con color, posición, sonido o animación.
- Respetar `prefers-reduced-motion` y ofrecer controles para pausar contenido que se mueve o reproduce automáticamente.
- Añadir subtítulos a video, transcripción a audio y una alternativa textual cuando la imagen transmita información que no está en el texto.
- Verificar que los estados `hover`, `focus`, `active`, `disabled` y error siguen siendo distinguibles con zoom y alto contraste.

## Componentes y cambios de contexto

- Acordeones, tabs, menús, comboboxes y diálogos siguen el patrón de teclado que corresponde, no solo un conjunto de roles.
- Los cambios de ruta actualizan el título, anuncian el nuevo contexto y dejan el foco en un lugar predecible.
- Los mensajes asíncronos usan una región viva pequeña y no interrumpen información que el usuario ya está leyendo.
- Los modales tienen retorno de foco y no permiten llegar por Tab al contenido bloqueado.

## Puerta de calidad

Antes de publicar, registra la ruta probada, navegador, lector de pantalla o herramienta usada, problemas encontrados y responsable. Corrige primero bloqueos —por ejemplo, un botón inaccesible o un formulario imposible de enviar— y después mejoras de comprensión. Repite la prueba cuando cambie un componente compartido, porque un cambio en el diseño del botón puede afectar cientos de páginas.
