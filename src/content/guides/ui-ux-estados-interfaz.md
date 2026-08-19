---
title: Estados de interfaz — carga, vacío, error y éxito
description: Diseñar el recorrido completo de una función, incluidos espera, ausencia de datos, permisos, recuperación y confirmación.
category: ui-ux
stack: ui-ux-interaccion
order: 1
tags: [ux, loading, empty-state, errors, feedback]
related:
  - guides/ui-ux-forms-feedback
  - guides/accessibility-dialogs-live-regions
  - guides/performance-javascript-runtime
updatedAt: 2026-08-19
---

Una pantalla no tiene un solo estado exitoso. Diseñar únicamente con datos ideales deja decisiones improvisadas cuando la red tarda, la colección está vacía o una acción falla.

## Mapa de estados

```text
inicial → cargando → éxito con datos
                  ├→ vacío
                  ├→ sin permiso
                  └→ error recuperable / final
```

## Carga

Para esperas breves conserva estabilidad visual. Un skeleton es útil si representa la estructura real; usar barras aleatorias puede generar cambios de layout. Para acciones iniciadas por la persona, desactiva solo lo necesario, muestra progreso y evita envíos duplicados.

Si existe progreso medible, comunícalo. Si no, un indicador indeterminado y un mensaje concreto son más honestos que un porcentaje inventado.

## Estado vacío

Distingue causas:

- **Primer uso:** explica el beneficio y ofrece la primera acción.
- **Sin resultados:** conserva filtros y permite modificarlos.
- **Contenido eliminado:** explica qué ocurrió y cómo regresar.
- **Sin permiso:** no aparenta que no existen datos; indica el acceso requerido.

```text
Todavía no tienes proyectos
Crea uno para organizar tareas y compartir avances.
[Crear proyecto]
```

## Error y recuperación

Un mensaje útil indica qué falló en lenguaje comprensible, qué se conservó y qué puede hacer la persona. “Error 500” es útil para logs, no como única explicación en la interfaz.

```text
No pudimos guardar los cambios.
Tu borrador permanece en este dispositivo. Revisa la conexión e inténtalo de nuevo.
[Reintentar]
```

No borres inputs después de un fallo. Para errores parciales, muestra qué elementos se completaron y evita repetirlos al reintentar.

## Éxito

La confirmación debe ser proporcional. Un cambio pequeño puede usar texto cercano o toast; una operación irreversible necesita una pantalla o registro verificable. No anuncies “guardado” antes de la confirmación del servidor si existe riesgo de fallo.

## Accesibilidad

Mueve el foco solo cuando el contexto realmente cambia. Usa regiones en vivo para mensajes breves sin interrumpir y conserva texto visible. Respeta movimiento reducido y evita spinners sin nombre accesible.

