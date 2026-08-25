---
title: Diseño de respuestas de error
description: Un formato de error consistente en toda la API, códigos de error propios (no solo status HTTP), y qué exponer vs qué ocultar.
category: backend
stack: express
order: 11
tags: [express, api, errors]
related: [guides/express-error-handling]
updatedAt: 2026-08-16
---

El [manejo de errores centralizado](/guides/express-error-handling) resuelve *dónde* se atrapan los errores — esta guía es sobre *qué forma* tiene la respuesta que el cliente recibe, para que sea consistente en toda la API.

## Un formato, siempre igual

```ts
// Mal: cada endpoint devuelve una forma distinta
res.status(400).json({ error: 'Falta el email' });
res.status(400).json('Email inválido');
res.status(400).json({ message: 'Bad request', field: 'email' });

// Bien: un solo formato, en todos lados
res.status(400).json({
  error: {
    code: 'VALIDATION_ERROR',
    message: 'Email inválido',
  },
});
```

Un cliente (frontend, app mobile, otro servicio) que consume la API puede manejar errores genéricamente (`if (response.error) ...`) solo si la forma es predecible — tres formatos distintos según el endpoint obliga a manejar cada caso por separado.

## Código de error propio, no solo status HTTP

El status HTTP (`400`, `404`, `409`) dice la categoría general; un `code` propio permite que el cliente reaccione distinto ante errores específicos sin parsear el mensaje de texto (que puede cambiar, o estar en otro idioma):

```ts
class AppError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
  ) {
    super(message);
  }
}

throw new AppError(409, 'EMAIL_YA_REGISTRADO', 'Ese email ya está en uso');
throw new AppError(404, 'USUARIO_NO_ENCONTRADO', 'Usuario no encontrado');
throw new AppError(400, 'VALIDATION_ERROR', 'Datos inválidos');
```

```ts
// En el frontend, reaccionar al código específico, no al texto
if (error.code === 'EMAIL_YA_REGISTRADO') {
  mostrarLinkDeLogin();
}
```

## Errores de validación: detalle por campo

Para errores que vienen de [Zod](/libraries/zod) o [express-validator](/libraries/express-validator), el cliente generalmente necesita saber **qué campo** falló, no solo que "algo" falló:

```ts
app.use((err, req, res, next) => {
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Datos inválidos',
        fields: err.flatten().fieldErrors, // { email: ['Email no válido'], age: [...] }
      },
    });
  }
  next(err);
});
```

## Qué exponer vs qué ocultar

```ts
export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (err instanceof AppError) {
    // Errores "esperados": el mensaje es seguro de mostrar
    return res.status(err.status).json({ error: { code: err.code, message: err.message } });
  }

  // Errores inesperados (bug, falla de DB): loguear completo, NO exponer detalles
  console.error(err);
  res.status(500).json({
    error: { code: 'INTERNAL_ERROR', message: 'Algo salió mal' },
  });
};
```

Un error de base de datos, un stack trace o el mensaje real de una excepción interna puede filtrar detalles de implementación: nombres de tablas, versiones de librerías o rutas del sistema. Solo los errores operativos creados explícitamente por la aplicación deben exponer un mensaje controlado.

## Contrato de referencia

| Elemento | Para qué |
| --- | --- |
| Formato único (`{ error: { code, message } }`) | El cliente maneja errores genéricamente |
| `code` propio | Reaccionar a un error específico sin parsear texto |
| `fields` en errores de validación | El cliente sabe qué campo mostrar en rojo |
| Errores esperados vs inesperados | Solo los esperados exponen su mensaje real |

## Exposición segura de errores

- Mensajes en el idioma de la API (o traducidos del lado del cliente usando `code`) — mezclar textos hardcodeados en un idioma con `code`s en inglés es común y está bien, siempre que el cliente pueda decidir qué mostrar.
- Este formato es una convención propia, no un estándar universal — existen estándares más formales (`application/problem+json`, RFC 7807) si el proyecto necesita interoperar con clientes que esperan ese formato específico.
