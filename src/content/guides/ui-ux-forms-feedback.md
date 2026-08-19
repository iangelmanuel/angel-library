---
title: UX de formularios, feedback y estados
description: Reducir errores y ansiedad con campos claros, validación oportuna, estados de carga y recuperación accionable.
category: ui-ux
stack: ui-ux-interaccion
order: 3
tags: [ux, forms, feedback, errors]
scope: interacción y formularios
related:
  - guides/accessibility-forms-validation
  - guides/ui-ux-design-systems
updatedAt: 2026-08-18
---

## Antes de pedir datos

Elimina campos que no cambian una decisión. Agrupa por propósito, explica por qué se pide información sensible y elige valores por defecto seguros. Un formulario corto pero ambiguo no es mejor que uno claro.

## Momento del feedback

- Valida formato al terminar de editar, no en cada tecla desde vacío.
- Valida reglas de negocio en servidor y conserva el contexto al fallar.
- Muestra progreso para operaciones perceptibles y éxito cuando la acción terminó de verdad.
- En acciones destructivas, explica la consecuencia y la posibilidad de recuperación.

## Estados completos

Cada flujo necesita idle, hover/focus, loading, success, empty, validation error, server error, offline y timeout cuando apliquen. Un spinner sin texto no indica qué ocurre ni cuánto puede esperar la persona.

## Mensajes

Un buen error responde: qué pasó, qué se conservó y qué puede hacer ahora. Evita códigos internos o culpar al usuario. Si la solución es reintentar, ofrece el botón; si necesita soporte, incluye un identificador de incidente seguro.

## Prevención

Deshabilita el envío duplicado sin bloquear la navegación innecesariamente. El guardado automático debe indicar “guardando”, “guardado” o “error” y resolver conflictos. Para procesos largos, permite continuar en segundo plano y notifica el resultado.
