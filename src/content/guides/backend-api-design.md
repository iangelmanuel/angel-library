---
title: Diseño de APIs backend mantenibles
description: Contratos HTTP, validación, errores, paginación, idempotencia y observabilidad para endpoints que pueden evolucionar.
category: backend
stack: backend-fundamentos
order: 2
tags: [backend, api, http, validation, architecture]
scope: diseño de servicios
related:
  - guides/http-browser-fundamentals
  - practices/validate-at-boundaries
  - guides/security-auth-access-control
updatedAt: 2026-08-18
---

## Contrato antes del handler

Define recursos, métodos, estados, autenticación, límites y forma de error antes de escribir la implementación. Usa nombres consistentes, fechas en un formato acordado y un envelope de error que permita mostrar un mensaje sin filtrar stack traces.

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Revisa los campos enviados",
    "fields": { "email": "Formato inválido" },
    "requestId": "req_123"
  }
}
```

## Fronteras y orden directamente request

Una ruta debería autenticar, autorizar, validar, ejecutar el caso de uso y mapear la respuesta. No mezcles SQL, reglas de negocio y serialización en el mismo bloque. Valida body, params, query y headers en el límite; después trabaja con un tipo confiable.

El servidor no debe aceptar `userId`, precio, rol o ownership del cliente como verdad. Obtén identidad de la sesión, calcula importes con datos del servidor y comprueba permisos sobre el recurso específico.

## Listados y evolución

Para colecciones grandes, usa paginación por cursor cuando el orden pueda cambiar mientras el usuario navega. Define límite máximo, orden estable y qué ocurre si el cursor expira. Filtra y ordena con columnas indexadas; nunca permitas que un query param se convierta directamente en SQL.

Agrega campos opcionales antes de exigirlos. Para cambios incompatibles, versiona o negocia capacidades; documenta deprecaciones y conserva métricas de consumidores antes de retirar una respuesta.

## Idempotencia y errores

POST de pago, creación de orden o envío de correo puede repetirse por doble clic, timeout o retry de un proxy. Acepta una clave de idempotencia, guarda el resultado asociado y devuelve el mismo resultado para la misma operación válida. Usa `409` para conflictos de estado, `422` o `400` según el contrato para datos inválidos, `401` sin identidad y `403` sin permiso.

## Operación

Define timeout por dependencia, cancelación, reintentos limitados con jitter y circuit breaker para proveedores. Registra request id, ruta, estado, latencia y actor seudonimizado; no registres tokens ni cuerpos sensibles. Mide p95/p99, errores, saturación, cola y costo por operación.
