---
title: Atributos HTML avanzados para formularios y recursos
description: Autocomplete, inputmode, accept, capture, loading, decoding, fetchpriority y picture para mejorar intención, UX y rendimiento.
type: guides
order: 3
tags: [html, forms, images, performance, mobile]
scope: formularios y recursos
related:
  - accessibility/a11y-interaccion/accessibility-forms-validation
  - performance/performance-carga/performance-image-optimization
  - languages/javascript/http-browser-fundamentals
updatedAt: 2026-08-18
---

## Intención del teclado móvil

`inputmode` sugiere el teclado que conviene mostrar sin cambiar el tipo semántico del campo. Usa `numeric` para códigos, `decimal` para cantidades y `tel` para teléfonos. `enterkeyhint` cambia la etiqueta de la tecla Enter a valores como `search`, `next`, `done` o `send`.

```html
<input
  name="verificationCode"
  inputmode="numeric"
  autocomplete="one-time-code"
  enterkeyhint="done"
  pattern="[0-9]{6}"
  aria-describedby="code-help"
  required
/>
```

El servidor debe validar el formato. `pattern` y el tipo de input solo mejoran la experiencia del navegador; no son una frontera de seguridad.

## Autocompletado y archivos

`autocomplete` permite que el navegador y los administradores de contraseñas entiendan la intención: `given-name`, `family-name`, `email`, `street-address`, `current-password`, `new-password` y `one-time-code` son ejemplos útiles. No lo desactives de forma general; puede impedir que una persona use una herramienta de accesibilidad o un gestor de credenciales.

En archivos, `accept` filtra sugerencias del selector, pero no valida el archivo real. `capture="environment"` puede sugerir la cámara trasera en móviles, aunque el navegador puede ignorarlo. Valida MIME real, tamaño, dimensiones y contenido en el servidor.

## Imágenes adaptables

`picture` permite elegir formato o dirección de arte; `loading="lazy"` difiere imágenes fuera de pantalla; `decoding="async"` permite que el navegador decodifique sin bloquear otro trabajo; `fetchpriority="high"` señala un recurso crítico puntual.

```html
<picture>
  <source
    media="(max-width: 40rem)"
    srcset="product-crop-small.avif"
    type="image/avif"
  />
  <source
    srcset="product-wide.avif"
    type="image/avif"
  />
  <img
    src="product-wide.jpg"
    width="1200"
    height="800"
    alt="Mochila azul abierta sobre una mesa"
    fetchpriority="high"
  />
</picture>
```

Usa `width` y `height` aunque CSS controle el tamaño: esas dimensiones reservan espacio y evitan saltos. No marques todas las imágenes con prioridad alta; normalmente solo la imagen LCP merece esa señal.

## Audio, video y subtítulos

`track kind="subtitles"` conecta subtítulos WebVTT; `poster` define la imagen inicial de un video; `preload="metadata"` evita descargar todo cuando solo necesitas duración y dimensiones. Evita reproducción automática con sonido y ofrece controles nativos cuando no necesitas una UI especial.
