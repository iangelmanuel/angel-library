---
title: Node.js
description: Ruta de Node.js para aprender el runtime desde cero o consultar rápidamente módulos, I/O, red, streams, procesos y concurrencia.
type: technologies
tags: [node, javascript, backend, runtime]
website: https://nodejs.org
github: https://github.com/nodejs/node
related:
  - backend/node/node-primeros-pasos
  - backend/node/node-runtime-event-loop
  - backend/node/node-errores-asincronia
  - backend/node/node-http-server
  - backend/node/node-streams
  - backend/node/node-process
updatedAt: 2026-08-25
---

## Qué estás estudiando

Node.js es un runtime para ejecutar JavaScript fuera del navegador. Combina el motor V8 con APIs de sistema operativo para archivos, procesos, red, criptografía y streams. No es un framework backend ni incluye DOM.

```text
código JavaScript
  → V8 ejecuta el lenguaje
  → Node expone APIs y coordina I/O
  → sistema operativo, red y filesystem
```

El modelo favorece servicios orientados a **I/O** (*Input/Output* o entrada/salida): mientras una consulta de red espera, el proceso puede atender otros callbacks. El trabajo intensivo de CPU sigue bloqueando el hilo de JavaScript si no se distribuye a workers o procesos.

## Elige tu modo de entrada

### Quiero aprender desde cero

Empieza en [Primeros pasos](/backend/node/node-primeros-pasos). Después estudia `package.json` y módulos antes del event loop: primero necesitas saber cómo se crea y conecta un programa; luego, cómo se comporta al ejecutarse.

Para cada documento:

1. ejecuta el ejemplo sin framework;
2. identifica si el trabajo es síncrono, I/O asíncrono o CPU;
3. provoca un error y observa cómo se propaga;
4. añade timeout, límite y cierre donde aplique;
5. explica qué mantiene vivo al proceso.

### Ya uso Node y quiero recordar

| Necesito | Documento |
| --- | --- |
| instalación, scripts y primer proceso | [Primeros pasos](/backend/node/node-primeros-pasos) |
| scripts, dependencias, exports y semver | [`package.json`](/backend/node/node-package-json) |
| `import`, `export`, `require` y resolución | [CommonJS vs ESM](/backend/node/node-commonjs-vs-esm) |
| microtareas, timers, bloqueo y concurrencia | [Runtime y event loop](/backend/node/node-runtime-event-loop) |
| promesas, cancelación y causas | [Errores asíncronos](/backend/node/node-errores-asincronia) |
| leer/escribir y construir rutas | [Filesystem](/backend/node/node-filesystem) |
| bytes, UTF-8, base64 y memoria | [Buffer](/backend/node/node-buffer-binario) |
| `createServer`, request y response | [HTTP nativo](/backend/node/node-http-server) |
| `fetch`, `URL`, headers y AbortSignal | [Web APIs](/backend/node/node-fetch-web-apis) |
| configuración y secretos | [Variables de entorno](/backend/node/node-env-vars) |
| datos por partes y backpressure | [Streams](/backend/node/node-streams) |
| EventEmitter y ciclo de listeners | [Eventos](/backend/node/node-events) |
| señales, argumentos y cierre ordenado | [Process](/backend/node/node-process) |
| CPU paralela | [Worker threads](/backend/node/node-worker-threads) |
| ejecutar programas y aislar procesos | [Child process](/backend/node/node-child-process) |

## Curva de aprendizaje

### Etapa 1: programa y módulos

1. Instalar Node, ejecutar archivos y usar scripts.
2. Entender `package.json`, lockfile y dependencias.
3. Elegir ES Modules o CommonJS y resolver imports.
4. Reconocer globals, módulos `node:` y rutas de archivos.

Al terminar puedes crear una CLI pequeña y explicar cómo Node encuentra y ejecuta su entrada.

### Etapa 2: asincronía y fallos

5. Event loop, promesas, timers y microtareas.
6. I/O frente a CPU y diferencia entre concurrencia y paralelismo.
7. Propagación de errores, cancelación y timeouts.
8. Límites de entrada y concurrencia.

### Etapa 3: datos y red

9. Filesystem y `path`.
10. Buffer, encodings y datos binarios.
11. Servidor HTTP nativo y Web APIs de cliente.
12. Streams, pipeline y backpressure.
13. EventEmitter y comunicación por eventos.

### Etapa 4: proceso y operación

14. Variables de entorno y configuración validada.
15. Señales, estado del proceso y graceful shutdown.
16. Worker threads para CPU y child processes para programas externos.
17. Logging, observabilidad, seguridad y pruebas del servicio.
18. Frameworks como Express después de reconocer qué abstracciones añaden.

## Glosario mínimo

| Término | Significado |
| --- | --- |
| runtime | entorno que ejecuta JavaScript y ofrece APIs adicionales |
| event loop | coordinador que entrega callbacks listos al hilo de JavaScript |
| I/O | entrada/salida: red, archivos o comunicación externa |
| CPU-bound | trabajo cuyo límite principal es el cálculo del procesador |
| Buffer | región de bytes en memoria |
| stream | interfaz para procesar datos por partes |
| backpressure | señal para frenar al productor cuando el consumidor no alcanza |
| worker | hilo o proceso que ejecuta trabajo separado del flujo principal |
| graceful shutdown | cierre que deja de aceptar trabajo y libera recursos de forma ordenada |

## Qué Node incluye y qué no

Node ofrece `fetch`, `URL`, `AbortController`, `process`, filesystem y red. No ofrece routing de aplicación, validación de contratos, autenticación, ORM ni arquitectura. Express agrega una cadena de routing/middleware; Astro y Next.js integran servidor con un framework web. Aprender Node evita tratar esas capas como magia.

## Regla operativa

Todo recurso debe tener ciclo de vida: creación, uso, error, cancelación y cierre. Todo input necesita límite y validación. Toda dependencia remota necesita timeout. Esta regla conecta los módulos nativos con un backend mantenible.
