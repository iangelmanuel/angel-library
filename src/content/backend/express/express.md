---
title: Express
description: Ruta completa de Express para aprender routing y middleware desde cero o consultar validación, errores, seguridad, APIs y arquitectura.
type: technologies
tags: [express, node, backend, http, middleware]
website: https://expressjs.com
github: https://github.com/expressjs/express
related:
  - backend/node/nodejs
  - backend/express/express-primeros-pasos
  - backend/express/express-routing-request-response
  - backend/express/express-middlewares
  - backend/express/express-error-handling
  - backend/backend-fundamentos/backend-api-design
updatedAt: 2026-08-25
---

## Qué estás estudiando

Express es un framework HTTP minimalista para Node.js. Convierte el manejo manual de `IncomingMessage` y `ServerResponse` en rutas, helpers de request/response y una cadena de middleware.

```text
request de Node
  → middleware global
  → router y middleware de ruta
  → validación y autorización
  → caso de uso
  → response o middleware de error
```

Su flexibilidad significa que no impone ORM, validación, autenticación ni estructura. La aplicación debe hacer explícitos esos contratos.

## Elige tu modo de entrada

### Quiero aprender desde cero

Empieza en [Primeros pasos](/backend/express/express-primeros-pasos) y construye una API pequeña sin base de datos. Aprende primero método, path, `Request`, `Response`, Router y orden de middleware. Luego añade validación, errores y logs; la autenticación y persistencia vienen después.

En cada ejercicio:

1. dibuja el orden real de los handlers;
2. distingue dato externo validado de dato de negocio;
3. comprueba qué rama termina la respuesta;
4. provoca un error síncrono y uno asíncrono;
5. prueba status, headers y body, no solo la función interna.

### Ya uso Express y quiero recordar

| Necesito | Documento |
| --- | --- |
| proyecto mínimo y flujo de request | [Primeros pasos](/backend/express/express-primeros-pasos) |
| rutas, params, query, body y Router | [Routing, Request y Response](/backend/express/express-routing-request-response) |
| `app.use`, `next` y orden | [Middlewares](/backend/express/express-middlewares) |
| validar y transformar entradas | [Contratos de entrada](/backend/express/express-validacion-contratos) |
| errores async y handler final | [Manejo de errores](/backend/express/express-error-handling) |
| logs estructurados y correlación | [Logging](/backend/express/express-logging) |
| headers, límites y endurecimiento | [Seguridad](/backend/express/express-seguridad) |
| orígenes, preflight y credenciales | [CORS](/backend/express/express-cors) |
| recursos, verbos y status | [REST y CRUD](/backend/express/express-rest-crud) |
| listas grandes | [Paginación y filtrado](/backend/express/express-api-paginacion) |
| envelope estable de errores | [Respuestas de error](/backend/express/express-api-error-responses) |
| tokens | [JWT](/backend/express/express-jwt) |
| sesión server-side | [Cookies y sesiones](/backend/express/express-cookies-sesiones) |
| proteger rutas | [Middleware de autenticación](/backend/express/express-auth-middleware) |
| autorización | [Roles y permisos](/backend/express/express-roles-permisos) |
| estructura por capas | [MVC y capas](/backend/express/backend-mvc-structure) |

## Curva de aprendizaje

### Etapa 1: transporte HTTP

1. Crear y ejecutar la aplicación.
2. Definir rutas por método y path.
3. Leer params, query, body y headers.
4. Modularizar con `express.Router()`.
5. Comprender middleware global, de router, de ruta y de error.

Al terminar debes construir una API en memoria y predecir exactamente qué handlers se ejecutan.

### Etapa 2: fronteras confiables

6. Limitar parsers y validar toda entrada externa.
7. Separar errores esperados de fallos internos.
8. Diseñar respuestas de error estables.
9. Registrar request id, latencia, status y contexto seguro.
10. Cerrar el servidor y dependencias de forma ordenada.

### Etapa 3: diseño de API

11. Recursos REST, métodos, idempotencia y status codes.
12. Paginación, filtrado, orden y búsqueda.
13. Caché HTTP, límites, uploads y servicios externos.
14. Documentar contratos y probarlos desde HTTP.

### Etapa 4: seguridad e identidad

15. Headers defensivos, tamaño, rate limiting y proxies confiables.
16. CORS cuando el navegador consume otro origen.
17. Cookies, sesiones y JWT como modelos diferentes.
18. Autenticación, autorización por recurso, roles y permisos.

### Etapa 5: arquitectura e integraciones

19. Separar router, controller, caso de uso y repository cuando el tamaño lo justifique.
20. Integrar base de datos y transacciones.
21. Elegir Auth.js, Better Auth, Prisma o Supabase por necesidad.
22. Extraer jobs, correo, archivos y proveedores externos.
23. Aplicar recetas completas solo después de entender las piezas nativas.

## Glosario mínimo

| Término | Significado |
| --- | --- |
| handler | función que participa en el procesamiento de una request |
| middleware | handler que observa, transforma, responde o delega con `next()` |
| router | miniaplicación que agrupa rutas y middleware |
| parser | transforma bytes del body a un valor JavaScript |
| validación | comprueba que un valor cumple el contrato |
| controller | adapta HTTP a una operación de aplicación |
| service/caso de uso | coordina reglas de negocio |
| repository | encapsula acceso y consultas a datos |

## Cuándo elegir Express

Encaja en APIs y servicios donde se desea controlar dependencias y estructura sin adoptar un framework integral. Esa libertad cuesta decisiones y consistencia. Si el equipo necesita inyección, módulos y convenciones rígidas desde el inicio, compara alternativas por mantenimiento, no solo por el ejemplo mínimo.

## Regla de arquitectura

Los objetos `req` y `res` pertenecen a la frontera HTTP. Valida y traduce allí; pasa valores del dominio hacia dentro. Así la misma lógica puede usarse desde una ruta, un job, una CLI o una prueba sin simular Express.
