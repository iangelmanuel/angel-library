---
title: UX de formularios, feedback y estados
description: Reducir errores y ansiedad con campos claros, validación oportuna, estados de carga y recuperación accionable.
category: ui-ux
stack: html
order: 3
tags: [ux, forms, feedback, errors]
scope: interacción y formularios
related:
  - guides/accessibility-forms-validation
  - guides/ui-ux-design-systems
updatedAt: 2026-08-18
---

## Antes de pedir datos

Elimina campos que no cambian una decisión. Agrupá por propósito, explicá por qué se pide información sensible y elige valores por defecto seguros. Un formulario corto pero ambiguo no es mejor que uno claro.

## Momento del feedback

- Valida formato al terminar de editar, no en cada tecla desde vacío.
- Valida reglas de negocio en servidor y conserva el contexto al fallar.
- Muestra progreso para operaciones perceptibles y éxito cuando la acción terminó de verdad.
- En acciones destructivas, explicá consecuencia y posibilidad de recuperación.

## Estados completos

Cada flujo necesita idle, hover/focus, loading, success, empty, validation error, server error, offline y timeout cuando apliquen. Un spinner sin texto no indica qué ocurre ni cuánto puede esperar la persona.

## Mensajes

Un buen error responde: qué pasó, qué se conservó y qué puede hacer ahora. Evita códigos internos o culpar al usuario. Si la solución es reintentar, ofrece el botón; si necesita soporte, incluí un identificador de incidente seguro.

## Prevención

Deshabilitá submit duplicado sin bloquear navegación innecesariamente. Autosave debe indicar “guardando/guardado/error” y resolver conflictos. Para procesos largos, permití continuar en segundo plano y notificar el resultado.

