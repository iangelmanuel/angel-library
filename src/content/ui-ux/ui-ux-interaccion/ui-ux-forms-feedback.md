---
title: UX de formularios, feedback y estados
description: Reducir errores y ansiedad con campos claros, validación oportuna, estados de carga y recuperación accionable.
type: guides
order: 3
tags: [ux, forms, feedback, errors]
scope: interacción y formularios
related:
  - accessibility/a11y-interaccion/accessibility-forms-validation
  - ui-ux/ui-ux-design-systems/ui-ux-design-systems
updatedAt: 2026-08-25
---

## Antes de pedir datos

Elimina campos que no cambian una decisión. Agrupa por propósito, explica por qué se pide información sensible y elige valores por defecto seguros. Un formulario corto pero ambiguo no es mejor que uno claro.

## Momento del feedback

- Valida formato al terminar de editar, no en cada tecla desde vacío.
- Valida reglas de negocio en servidor y conserva el contexto al fallar.
- Muestra progreso para operaciones perceptibles y éxito cuando la acción terminó de verdad.
- En acciones destructivas, explica la consecuencia y la posibilidad de recuperación.

No deshabilites submit solo porque el formulario está incompleto sin explicar qué falta. Permitir el intento y mover foco al primer error puede ser más comprensible. Conserva valores válidos cuando el servidor rechaza otro campo.

## Estados completos

Cada flujo necesita idle, hover/focus, loading, success, empty, validation error, server error, offline y timeout cuando apliquen. Un spinner sin texto no indica qué ocurre ni cuánto puede esperar la persona.

## Mensajes

Un buen error responde: qué pasó, qué se conservó y qué puede hacer ahora. Evita códigos internos o culpar al usuario. Si la solución es reintentar, ofrece el botón; si necesita soporte, incluye un identificador de incidente seguro.

```text
Débil: Error 422
Mejor: No pudimos guardar el perfil. El nombre se conservó; revisa el formato del correo.
```

El resumen superior ayuda cuando hay varios errores, pero cada campo mantiene su mensaje asociado. Anuncia cambios asíncronos importantes sin interrumpir innecesariamente.

## Prevención

Deshabilita el envío duplicado sin bloquear la navegación innecesariamente. El guardado automático debe indicar “guardando”, “guardado” o “error” y resolver conflictos. Para procesos largos, permite continuar en segundo plano y notifica el resultado.

## Caso completo

```text
idle → submit → pending
  ├→ validación: conservar datos + enfocar error
  ├→ red: permitir retry sin duplicar efecto
  └→ éxito: confirmar resultado + siguiente acción
```

Prueba doble clic, Enter, volver atrás, refresh, offline y sesión expirada. La UX segura no oculta errores ni pierde trabajo silenciosamente.
