---
title: JavaScript
description: Lenguaje de la web, su modelo de ejecución, módulos, asincronía y límites entre navegador y servidor.
category: general
stack: javascript
order: 1
tags: [javascript, web, browser, runtime]
website: https://developer.mozilla.org/es/docs/Web/JavaScript
related:
  - guides/javascript-fundamentals
  - guides/javascript-control-functions
  - guides/javascript-loops-iteration
  - guides/javascript-built-ins
  - guides/javascript-strings
  - guides/javascript-numbers-math
  - guides/javascript-arrays-objects
  - guides/javascript-objects
  - guides/javascript-collections
  - guides/javascript-date-regexp-intl
  - guides/javascript-url-web-apis
  - guides/javascript-browser-constructors
  - guides/javascript-dom-events
  - guides/javascript-events
  - guides/javascript-web-components
  - guides/javascript-media-devices
  - guides/javascript-audio-recording
  - guides/javascript-permissions-notifications
  - guides/javascript-json-storage
  - guides/javascript-async-promises
  - guides/javascript-fetch-apis
  - guides/javascript-advanced-language
  - guides/javascript-modules
  - guides/javascript-runtime-event-loop
  - guides/http-browser-fundamentals
  - technologies/typescript
updatedAt: 2026-08-18
---

## Modelo mental

JavaScript ejecuta trabajo síncrono en una pila y coordina tareas asíncronas mediante el event loop. El lenguaje no incluye por sí solo `fetch`, DOM ni archivos: esas capacidades las ofrece el runtime —navegador, Node.js, Bun o Deno—.

## Lo esencial

- Valores primitivos se copian; objetos y funciones se comparten por referencia.
- `const` evita reasignar la variable, no vuelve inmutable al objeto.
- Los closures conservan acceso al entorno donde nació una función.
- Los módulos ES (`import`/`export`) expresan dependencias de forma estática.
- Una `Promise` representa un resultado futuro; `async/await` mejora su lectura, pero no vuelve paralelo el código automáticamente.
- TypeScript comprueba tipos durante desarrollo, pero el runtime sigue siendo JavaScript.

## Orden recomendado

1. Tipos, variables, coerción, igualdad y operadores.
2. Control de flujo, funciones, scope y closures.
3. Ciclos, iterables e iteración asíncrona.
4. Strings, números, arrays, objetos y colecciones.
5. APIs nativas como Date, RegExp, Intl, URL y constructores del navegador.
6. DOM, eventos, Web Components, dispositivos, audio y permisos.
7. JSON, almacenamiento, Promises, Fetch, errores y cancelación.
8. Prototypes, clases, iteradores, generators y metaprogramación.
9. Módulos ES, event loop, HTTP y límites entre runtimes.

## Errores frecuentes

- Usar `forEach(async () => ...)` esperando que aguarde todas las operaciones.
- Mutar objetos compartidos y producir efectos laterales difíciles de rastrear.
- Confiar en datos externos sin validarlos en runtime.
- Ignorar errores de Promises o capturar excepciones sin contexto.
- Enviar demasiado JavaScript al cliente cuando HTML o CSS resuelven la interacción.

## Ruta completa en esta biblioteca

1. **Fundamentos:** valores, tipos, variables, operadores, conversión e igualdad.
2. **Control y funciones:** condiciones, parámetros, retorno, alcance, closures y recursión.
3. **Ciclos:** `for`, `while`, `for...of`, `for...in`, `for await...of`, control y límites.
4. **Mapa de referencias:** punto de entrada para elegir el tipo o API que necesitas consultar.
5. **Tipos de datos:** strings, Number, BigInt, Math, arrays, objetos, Map, Set y colecciones débiles.
6. **APIs nativas:** Date, RegExp, Intl, URL, datos binarios y catálogo de constructores `new`.
7. **Plataforma web:** DOM, eventos, Web Components, cámara, micrófono, audio, permisos y notificaciones.
8. **Datos y red:** JSON, storage, Fetch, HTTP, headers, paginación y validación de respuestas.
9. **Lenguaje avanzado:** prototypes, clases, errores, iteradores, generators, symbols, Proxy y Reflect.
10. **Módulos y runtime:** ESM, imports dinámicos, event loop, microtasks, tasks, workers y fronteras cliente/servidor.

Cada etapa separa la definición, una forma de usarla y el tipo de problema que resuelve. Así puedes volver a una referencia puntual sin leer de nuevo todo el lenguaje.
