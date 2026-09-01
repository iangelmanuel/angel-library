---
title: Primeros pasos con Node.js
description: Instalar, ejecutar scripts, reconocer el runtime y crear un proyecto mínimo antes de entrar en módulos y APIs nativas.
type: guides
order: 1
tags: [node, javascript, runtime, npm]
scope: inicio con Node.js
related:
  - backend/node/nodejs
  - backend/node/node-package-json
  - backend/node/node-commonjs-vs-esm
updatedAt: 2026-08-25
---

Node.js ejecuta JavaScript fuera del navegador. Comparte el lenguaje y varias Web APIs, pero incorpora acceso a archivos, procesos y red, y no incluye el DOM. Antes de usar Express conviene reconocer qué aporta el runtime por sí mismo.

## Comprobar el entorno

```bash
node --version
npm --version
```

Instala una versión mantenida de Node y declara la versión esperada en el proyecto. `npm` es el gestor de paquetes que se distribuye con Node; `pnpm` y Yarn son alternativas, no runtimes distintos.

## Crear y ejecutar un proyecto mínimo

```bash
mkdir node-lab
cd node-lab
npm init -y
```

```json title="package.json"
{
  "type": "module",
  "scripts": {
    "dev": "node --watch src/index.js",
    "start": "node src/index.js"
  }
}
```

```js title="src/index.js"
const startedAt = new Date();
console.log(`Proceso ${process.pid} iniciado en ${startedAt.toISOString()}`);
```

```bash
npm run dev
```

`node --watch` reinicia el proceso cuando cambian archivos. El script `start` representa una ejecución normal sin modo observación.

## Qué ocurre al ejecutar el archivo

```text
shell inicia node
  → Node crea un proceso
  → resuelve e importa el módulo de entrada
  → ejecuta su código de nivel superior
  → mantiene vivo el event loop si quedan servidores, timers o I/O
  → termina cuando no queda trabajo o se solicita el cierre
```

`process.cwd()` indica el directorio desde el que se ejecutó el comando. `import.meta.url` identifica el archivo actual. No son equivalentes y confundirlos rompe rutas al iniciar la aplicación desde otra carpeta.

```js
console.log(process.cwd());
console.log(import.meta.url);
```

## APIs globales y módulos nativos

Algunas capacidades son globales (`fetch`, `URL`, `AbortController`, `Buffer`, `process`). Otras se importan con el prefijo `node:`.

```js
import { readFile } from 'node:fs/promises';

const file = new URL('./config.json', import.meta.url);
const config = JSON.parse(await readFile(file, 'utf8'));
```

El prefijo `node:` deja claro que `fs/promises` pertenece al runtime y no a `node_modules`.

## Instalar una dependencia

```bash
npm install zod
npm install --save-dev typescript @types/node
```

Una dependencia de producción es necesaria cuando corre la aplicación. Una dependencia de desarrollo participa en tipos, tests, lint o build. El lockfile registra el árbol exacto instalado y debe versionarse.

## Primer recorrido recomendado

1. [package.json](/backend/node/node-package-json): scripts, dependencias y versión.
2. [CommonJS vs ES Modules](/backend/node/node-commonjs-vs-esm): cómo se conectan archivos.
3. [Runtime y event loop](/backend/node/node-runtime-event-loop): cuándo el proceso puede bloquearse.
4. [Errores asíncronos](/backend/node/node-errores-asincronia): cómo propagar, cancelar y cerrar.
5. Filesystem, Buffer, HTTP, streams, eventos y procesos.

## Comprobación rápida

Antes de seguir deberías poder explicar qué diferencia hay entre Node, npm y un framework; ejecutar un archivo; importar un módulo nativo; saber dónde corre el código y distinguir `process.cwd()` de la ubicación del módulo.

