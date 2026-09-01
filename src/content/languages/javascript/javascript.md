---
title: JavaScript
description: Ruta completa de ECMAScript y la plataforma web, organizada para aprender desde cero o consultar sintaxis, métodos y APIs rápidamente.
type: technologies
order: 1
tags: [javascript, ecmascript, web, browser, runtime]
website: https://developer.mozilla.org/es/docs/Web/JavaScript
related:
  - languages/javascript/javascript-getting-started
  - languages/javascript/javascript-fundamentals
  - languages/javascript/javascript-expressions-operators
  - languages/javascript/javascript-control-functions
  - languages/javascript/javascript-loops-iteration
  - languages/javascript/javascript-built-ins
  - languages/javascript/javascript-strings
  - languages/javascript/javascript-numbers-math
  - languages/javascript/javascript-arrays-objects
  - languages/javascript/javascript-objects
  - languages/javascript/javascript-collections
  - languages/javascript/javascript-date-regexp-intl
  - languages/javascript/javascript-errors-debugging
  - languages/javascript/javascript-prototypes-classes
  - languages/javascript/javascript-iterators-generators
  - languages/javascript/javascript-binary-data
  - languages/javascript/javascript-advanced-language
  - languages/javascript/javascript-async-promises
  - languages/javascript/javascript-runtime-event-loop
  - languages/javascript/javascript-modules
  - languages/javascript/javascript-dom-events
  - languages/javascript/javascript-events
  - languages/javascript/javascript-json-storage
  - languages/javascript/browser-storage-and-web-apis
  - languages/javascript/javascript-url-web-apis
  - languages/javascript/javascript-fetch-apis
  - languages/javascript/javascript-browser-constructors
  - languages/javascript/javascript-web-components
  - languages/javascript/javascript-media-devices
  - languages/javascript/javascript-audio-recording
  - languages/javascript/javascript-permissions-notifications
  - languages/javascript/http-browser-fundamentals
  - general/typescript/typescript
updatedAt: 2026-08-25
---

## Qué estás estudiando

**JavaScript** es el nombre habitual del lenguaje. **ECMAScript** es el estándar que define su sintaxis, tipos, objetos incorporados y semántica. El navegador, Node.js, Deno o Bun actúan como **runtimes**: ejecutan ECMAScript y agregan capacidades del entorno.

```text
ECMAScript
├── tipos, operadores y funciones
├── Array, Object, Map, Set, RegExp e Intl
├── Promise, módulos, clases e iteradores
└── reglas de ejecución del lenguaje

Runtime del navegador
├── DOM y eventos
├── Fetch, URL, archivos y storage
├── cámara, micrófono, audio y permisos
└── rendering, tasks y comunicación con la Web
```

`fetch` y `document` no forman parte del lenguaje ECMAScript, aunque se usen desde JavaScript. Esta colección enseña ambas capas y marca su frontera para evitar asumir que una API del navegador existe también en servidor.

### Glosario mínimo de la ruta

| Término   | Significado                                                                                                             |
| --------- | ----------------------------------------------------------------------------------------------------------------------- |
| API       | _Application Programming Interface_: contrato que permite usar una capacidad desde código                               |
| DOM       | _Document Object Model_: representación en objetos del documento HTML                                                   |
| ESM       | _ECMAScript Modules_: sistema estándar de módulos con `import` y `export`                                               |
| JSON      | _JavaScript Object Notation_: formato textual de intercambio de datos                                                   |
| URL       | _Uniform Resource Locator_: dirección de un recurso                                                                     |
| HTTP      | _Hypertext Transfer Protocol_: protocolo de requests y responses de la Web                                              |
| CORS      | _Cross-Origin Resource Sharing_: política de headers que controla qué respuestas puede leer otro origen en el navegador |
| MIME type | tipo de medio que describe el formato de un contenido, como `application/json`                                          |
| UTF-8     | codificación Unicode de longitud variable utilizada habitualmente en la Web                                             |
| UTC       | _Coordinated Universal Time_: referencia temporal global independiente de una zona local                                |
| ASI       | _Automatic Semicolon Insertion_: reglas con las que JavaScript inserta ciertos puntos y coma omitidos                   |
| TDZ       | _Temporal Dead Zone_: periodo en el que un binding `let`, `const` o `class` existe pero todavía no puede leerse         |
| OPFS      | _Origin Private File System_: sistema de archivos privado del origen dentro del navegador                               |

No necesitas memorizar estas siglas. Vuelve a esta tabla cuando una guía utilice una de ellas y continúa con el modelo mental del tema.

## Elige tu modo de entrada

### Quiero aprender desde cero

Sigue el orden de la navegación. No intentes memorizar todos los métodos: aprende primero el modelo mental, practica una operación y usa las tablas como referencia.

En cada etapa:

1. lee la definición antes del ejemplo;
2. predice el resultado del código;
3. ejecútalo y compara;
4. cambia un valor para comprobar que entendiste la regla;
5. resuelve el caso de uso sin copiar;
6. vuelve a la tabla cuando necesites recordar una firma.

Comienza en [Primeros pasos con JavaScript](/languages/javascript/javascript-getting-started), continúa con [Fundamentos](/languages/javascript/javascript-fundamentals) y no saltes a DOM o Fetch hasta poder trabajar con funciones, arrays, objetos y Promises.

### Ya programo y quiero recordar

Usa el [Mapa de tipos y APIs nativas](/languages/javascript/javascript-built-ins), la búsqueda o esta tabla:

| Necesito recordar                                    | Documento                                                                            |
| ---------------------------------------------------- | ------------------------------------------------------------------------------------ |
| truthy, falsy, nullish, `??=`, `                     |                                                                                      | =`, `?.` | [Fundamentos](/languages/javascript/javascript-fundamentals) |
| coerción, igualdad, spread, rest, precedencia        | [Expresiones y operadores](/languages/javascript/javascript-expressions-operators)   |
| scope, closures, parámetros y formas de función      | [Control y funciones](/languages/javascript/javascript-control-functions)            |
| `for`, `for...of`, `for...in`, async iteration       | [Ciclos](/languages/javascript/javascript-loops-iteration)                           |
| firma, retorno y mutación de un método               | [Mapa de APIs nativas](/languages/javascript/javascript-built-ins)                   |
| `try/catch`, `Error`, `cause`, limpieza              | [Errores y depuración](/languages/javascript/javascript-errors-debugging)            |
| prototypes, `class`, campos privados, `new`          | [Prototypes y clases](/languages/javascript/javascript-prototypes-classes)           |
| generators, Iterator helpers, `for await`            | [Iteradores](/languages/javascript/javascript-iterators-generators)                  |
| `this`, `call`, `bind`, Symbols, Proxy, Reflect      | [Metaprogramación](/languages/javascript/javascript-advanced-language)               |
| buffers, typed arrays, Base64, hexadecimal y Atomics | [Datos binarios](/languages/javascript/javascript-binary-data)                       |
| Promises, concurrencia, carreras y cancelación       | [Código asíncrono](/languages/javascript/javascript-async-promises)                  |
| imports, exports, carga dinámica y JSON modules      | [Módulos](/languages/javascript/javascript-modules)                                  |
| DOM, formularios y creación de nodos                 | [DOM](/languages/javascript/javascript-dom-events)                                   |
| propagación, delegación, teclado y pointer           | [Eventos](/languages/javascript/javascript-events)                                   |
| JSON exacto, serialización y almacenamiento local    | [JSON y almacenamiento](/languages/javascript/javascript-json-storage)               |
| requests, headers, CORS, errores y paginación        | [Fetch y HTTP](/languages/javascript/javascript-fetch-apis)                          |
| `new URL`, observers, workers y constructores        | [Constructores del navegador](/languages/javascript/javascript-browser-constructors) |

## Curva de aprendizaje completa

### Etapa 1: leer y controlar el lenguaje

1. **Primeros pasos:** ECMAScript, runtime, consola, módulos, expresiones, sentencias y errores.
2. **Fundamentos:** valores, tipos, variables, referencias, conversión, truthy, falsy y nullish.
3. **Expresiones y operadores:** igualdad, coerción, acceso dinámico, spread, rest y operadores bitwise.
4. **Control y funciones:** decisiones, parámetros, retorno, scope, closures y recursión.
5. **Ciclos:** iteración síncrona y asíncrona, `break`, `continue` y elección frente a métodos de Array.

Al terminar debes poder leer una función pequeña, explicar qué valores recibe y devuelve, y predecir qué ramas o iteraciones se ejecutan.

### Etapa 2: dominar datos y métodos incorporados

6. **Mapa de referencia:** cómo elegir un documento y comprobar retorno o mutación.
7. **Strings:** texto, Unicode, búsqueda, corte, reemplazo y normalización.
8. **Number, BigInt y Math:** precisión, conversión, bases, redondeo, suma precisa y cálculo.
9. **Arrays:** transformación, búsqueda, copia, orden, acumulación y métodos mutables.
10. **Objetos:** claves dinámicas, desestructuración, copia, descriptores y agrupación.
11. **Map, Set y colecciones débiles:** índices dinámicos, unicidad, upsert y metadatos ligados a objetos.
12. **Date, RegExp e Intl:** instantes, Temporal, patrones y presentación localizada.

Al terminar debes poder elegir una estructura de datos y un método por intención, sabiendo qué retorna y si modifica el original.

### Etapa 3: modelo profundo de ECMAScript

13. **Errores y depuración:** excepciones, causas, stack traces, límites y liberación de recursos.
14. **Prototypes y clases:** delegación, construcción, privacidad, herencia y composición.
15. **Iteradores y generators:** protocolos, secuencias lazy, concatenación, Iterator helpers y async generators.
16. **Datos binarios:** ArrayBuffer, typed arrays, Base64, hexadecimal, DataView, transferencia y Atomics.
17. **Metaprogramación:** `this`, Symbols, Proxy y Reflect.

Estos temas explican por qué funcionan muchas abstracciones de frameworks y librerías. No son requisitos para crear tu primera interacción, pero sí para depurar comportamiento avanzado.

### Etapa 4: asincronía, runtime y arquitectura

18. **Promises y async/await:** secuencia, concurrencia, errores, reintentos, carreras y cancelación.
19. **Event loop:** pila, tasks, microtasks, rendering y trabajo que bloquea.
20. **Módulos ES:** dependencias, bindings vivos, imports dinámicos, atributos y fronteras cliente/servidor.

Al terminar debes distinguir “asíncrono” de “paralelo”, iniciar tareas independientes juntas y evitar Promises sin manejar.

### Etapa 5: plataforma web cotidiana

21. **DOM:** seleccionar, crear, insertar, medir y actualizar documentos con seguridad.
22. **Eventos:** propagación, delegación, formularios, teclado, pointer y eventos personalizados.
23. **JSON y almacenamiento básico:** precisión, serialización, `localStorage`, cookies e IndexedDB.
24. **Storage y coordinación:** Cache Storage, OPFS, pestañas, cuotas y persistencia.
25. **URL y Web APIs:** parámetros, FormData, Blob, AbortController y observers.
26. **Fetch y HTTP:** requests, responses, headers, CORS, cache, paginación y errores.
27. **Constructores del navegador:** índice rápido de APIs creadas con `new`.

Al terminar debes poder construir una interfaz sin framework que lea datos, responda a eventos, persista preferencias y consuma una API de forma segura.

### Etapa 6: capacidades especializadas

28. **Web Components:** custom elements, ciclo de vida, Shadow DOM, templates, slots y formularios.
29. **Cámara y micrófono:** permisos, constraints, tracks, cambio de dispositivo y captura.
30. **Audio y grabación:** AudioContext, análisis, MediaRecorder y voz.
31. **Permisos y notificaciones:** geolocalización, portapapeles, Wake Lock, Web Share y diseño responsable.
32. **HTTP y navegador:** ciclo completo de navegación, caché, seguridad, rendering y protocolos.
33. **TypeScript:** tipos durante desarrollo sobre un runtime que continúa siendo JavaScript.

## Versiones modernas y compatibilidad

La edición del estándar y la disponibilidad real no son lo mismo. ECMAScript define la API; cada navegador o runtime decide cuándo la implementa. Una sintaxis nueva puede impedir cargar todo el módulo en un entorno antiguo, mientras que un método nuevo a veces admite polyfill.

| Edición                       | Capacidades destacadas documentadas aquí                                                                                                  |
| ----------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| ECMAScript 2025               | Iterator helpers, operaciones de Set, `RegExp.escape`, `Promise.try`, import attributes, JSON modules y `Float16Array`                    |
| ECMAScript 2026               | `Math.sumPrecise`, `Iterator.concat`, `Array.fromAsync`, `Error.isError`, upsert de Map, Base64/hexadecimal en `Uint8Array` y JSON exacto |
| prevista para ECMAScript 2027 | Temporal y gestión explícita de recursos con `using`                                                                                      |

Para una consulta rápida, mira primero la edición y después la matriz de soporte del proyecto. Para aprender, entiende el problema que resuelve la API y conserva también el patrón portable: por ejemplo, `try/finally` antes de `using`, o una acumulación normal antes de `Math.sumPrecise`.

## Modelo mental que conecta todo

```text
entrada externa
  ↓ validar y convertir
valores y estructuras
  ↓ transformar con funciones y métodos
efectos del runtime
  ↓ DOM, red, storage o dispositivos
resultado observable
  ↓ manejar éxito, error, cancelación y limpieza
```

Las operaciones puras transforman datos sin tocar el exterior. Los **efectos** escriben en DOM, red, archivos, storage, reloj o estado compartido. Separar ambas partes facilita pruebas y hace más visible dónde pueden aparecer errores.

## Reglas esenciales

- `const` evita reasignar el binding; no congela el objeto.
- Los primitivos se comparan por valor; objetos y funciones por identidad.
- `===` no realiza coerción; `Object.is` trata de forma especial `NaN` y `-0`.
- `??` reemplaza únicamente `null` o `undefined`; `||` reemplaza cualquier falsy.
- Una Promise representa un resultado futuro; `await` pausa una función async, no el hilo completo.
- `forEach` no espera callbacks async.
- `fetch` no rechaza automáticamente por estados HTTP como 404 o 500.
- una copia con spread es superficial.
- `class` usa prototypes; no introduce otro modelo de objetos.
- un módulo tiene scope propio y sus imports son bindings vivos de solo lectura.

## Errores frecuentes de aprendizaje

- Memorizar métodos sin saber qué problema resuelven.
- Saltar a un framework sin poder seguir el flujo de valores y eventos.
- Confundir APIs del lenguaje con APIs del navegador.
- Copiar código asíncrono sin decidir secuencia, concurrencia y cancelación.
- usar optional chaining para ocultar un dato obligatorio ausente.
- asumir que “moderno” significa compatible con todos los runtimes del proyecto.

ECMAScript evoluciona en ediciones anuales. Antes de usar una API reciente, comprueba los runtimes objetivo y configura pruebas, polyfills o transformaciones cuando sean necesarias. No presentes una propuesta futura como soporte universal solo porque ya haya terminado el proceso de TC39.
