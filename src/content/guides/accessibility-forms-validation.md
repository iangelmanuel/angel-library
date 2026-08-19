---
title: Formularios accesibles y validación comprensible
description: Etiquetas, ayudas, errores, autocomplete y estados para formularios utilizables con teclado y lectores de pantalla.
category: accessibility
stack: a11y-interaccion
order: 3
tags: [accessibility, forms, validation, ux]
scope: formularios
related:
  - guides/accessibility-aria-attributes
  - practices/accessibility-checklist
  - guides/ui-ux-forms-feedback
updatedAt: 2026-08-18
---

## Estructura mínima

```html
<label for="email">Correo</label>
<p id="email-help">Usaremos este correo para enviarte el acceso.</p>
<input
  id="email"
  name="email"
  type="email"
  autocomplete="email"
  aria-describedby="email-help email-error"
  aria-invalid="true"
/>
<p id="email-error">Escribe un correo con formato nombre@dominio.com.</p>
```

El placeholder no reemplaza al label: desaparece al escribir, suele tener bajo contraste y no expresa una relación estable.

## Validación

- Valida en cliente para feedback rápido y siempre de nuevo en servidor.
- Explica qué ocurrió y cómo corregirlo; “valor inválido” no ayuda.
- No comuniques el error solo con rojo: añade texto e icono cuando aporte.
- Al enviar, enfoca un resumen de errores o el primer campo inválido según la longitud del formulario.
- Conserva los valores válidos después de un error.

## Agrupación y datos personales

Usa `fieldset` y `legend` para radios o checkboxes relacionados. Configura `autocomplete` con tokens correctos —`name`, `email`, `current-password`, `new-password`— para reducir esfuerzo y errores. Indica campos obligatorios en texto y con `required`; no dependas de un asterisco sin explicación.

## Estados asíncronos

Durante el envío, evita dobles submits, muestra el progreso al usuario y no deshabilites controles sin una razón clara. El resultado debe anunciarse y persistir el tiempo suficiente para leerlo. Si hay timeout o fallo de red, ofrece reintentar sin volver a completar todo.

## Error por campo y error global

Un error de campo debe estar cerca del control y conectado con `aria-describedby`. Un error global —por ejemplo, “No pudimos guardar”— debe estar en una región visible y anunciarse sin borrar los mensajes de cada campo. Si el formulario tiene muchos errores, muestra un resumen con enlaces que lleven al campo correspondiente; al activar el enlace, conserva un indicador visual y un nombre accesible.

```html
<div role="alert" tabindex="-1" id="form-error">
  Revisa los campos marcados antes de continuar.
</div>
<a href="#email">Ir al campo Correo</a>
```

No uses `focus()` en cada pulsación para perseguir al usuario. Valida al salir del campo o al enviar según el tipo de formulario, y evita mostrar un error antes de que la persona haya tenido oportunidad de escribir. En campos sensibles, no repitas el valor enviado en un mensaje, log o respuesta HTML.

## Formularios que cruzan el servidor

El cliente puede dar una experiencia rápida, pero el servidor debe repetir normalización, validación, autorización y límites. Devuelve errores asociados a nombres de campo estables, conserva los valores que no sean secretos y marca el formulario como enviado para que un lector de pantalla sepa que la respuesta corresponde a su acción.

Para contraseñas, usa `autocomplete="current-password"` o `new-password` según el caso y permite pegar desde un administrador de contraseñas. No impongas reglas arbitrarias de composición si no están justificadas por el riesgo; una contraseña larga y única suele ser más útil que una colección de símbolos imposible de recordar.

## Checklist de revisión

- Cada control tiene label, propósito y estado disponibles para tecnología asistiva.
- El teclado puede corregir un error sin depender de arrastrar o hacer hover.
- El botón de envío comunica progreso, éxito y fallo.
- El servidor devuelve mensajes que no filtran si una cuenta existe cuando eso sea sensible.
- El flujo se puede completar con zoom, móvil, lector de pantalla y conexión lenta.
