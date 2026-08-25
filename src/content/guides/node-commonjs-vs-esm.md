---
title: CommonJS vs ES Modules
description: require/module.exports vs import/export, el campo "type" en package.json, interop entre ambos, y cómo Node resuelve un import.
category: backend
stack: node
order: 3
tags: [node, modules, commonjs, esm]
scope: sistema de módulos
updatedAt: 2026-08-16
---

Node tiene dos sistemas de módulos que conviven, con sintaxis y reglas de resolución distintas. La mayoría de la confusión viene de mezclarlos sin saber cuál está activo en cada archivo.

## CommonJS (`require`)

El sistema original de Node, todavía el default salvo que se indique lo contrario.

```js title="math.cjs"
function sumar(a, b) {
  return a + b;
}

module.exports = { sumar };
```

```js
const { sumar } = require('./math.cjs');
```

- Síncrono: `require()` carga y ejecuta el módulo en el momento, bloqueando hasta terminar.
- `module.exports` es el objeto completo que se exporta; `exports.algo = ...` es un atajo que apunta a lo mismo (pero reasignar `exports = ...` entero rompe esa referencia — usar `module.exports` para eso).

## ES Modules (`import`/`export`)

El estándar del lenguaje JavaScript (no específico de Node), soportado nativamente desde Node 12+.

```js title="math.mjs"
export function sumar(a, b) {
  return a + b;
}
```

```js
import { sumar } from './math.mjs';
```

- Asíncrono por diseño (aunque en la práctica top-level `await` lo hace sentir síncrono) — permite optimizaciones que CommonJS no puede (tree-shaking real, análisis estático de qué se importa).
- `export default` para un único valor principal por módulo; `export { algo }` (named exports) para varios.

## Cómo Node decide cuál usar

Tres formas, en este orden de precedencia:

1. **Extensión del archivo**: `.mjs` siempre es ES Modules, `.cjs` siempre es CommonJS, sin importar nada más.
2. **Campo `"type"` en `package.json`**: `"type": "module"` hace que los `.js` del proyecto se traten como ES Modules; sin ese campo (o `"type": "commonjs"`), los `.js` son CommonJS.
3. Dentro de un proyecto TypeScript, el `tsconfig.json` (`module`/`moduleResolution`) además decide qué sintaxis **compila** hacia cuál — eso es una capa aparte de lo que Node ejecuta en runtime.

```json title="package.json"
{
  "type": "module"
}
```

## Interop: usar uno desde el otro

```js
// Desde ESM, importar un paquete CommonJS: funciona directo
import express from 'express'; // ESM puede importar este paquete CommonJS

// Desde CommonJS, importar un módulo ESM: NO funciona con require()
// require('paquete-esm-only'); // TypeError: no soporta require de ESM síncronamente

// Alternativa desde CommonJS: import() dinámico (siempre devuelve una promesa)
const paqueteEsm = await import('paquete-esm-only');
```

ESM puede consumir CommonJS casi siempre sin fricción; CommonJS **no puede** hacer `require()` de un paquete que solo publica ESM — necesita `import()` dinámico, que es asíncrono.

## Cómo Node resuelve un `import`/`require`

```js
import './archivo.js';        // ruta relativa, extensión obligatoria en ESM
import 'express';              // busca en node_modules/express, sube por el árbol de carpetas
import 'node:fs';              // módulo nativo de Node, el prefijo "node:" es explícito y recomendado
```

Para paquetes (no rutas relativas), Node busca `node_modules/` en la carpeta actual, y si no está, sube un nivel y repite, hasta la raíz del sistema de archivos — así funciona que un paquete instalado en la raíz del proyecto sea visible desde cualquier archivo más adentro.

## Comparación rápida

| | CommonJS | ES Modules |
| --- | --- | --- |
| Sintaxis | `require()` / `module.exports` | `import` / `export` |
| Carga | Síncrona | Asíncrona (pero `import` estático se siente síncrono) |
| Activar con | Default, o `.cjs`, o sin `"type"` en package.json | `"type": "module"` en package.json, o `.mjs` |
| ESM → CJS | Funciona directo | — |
| CJS → ESM | Necesita `import()` dinámico | — |

## Errores comunes

- `SyntaxError: Cannot use import statement outside a module` — el archivo usa `import` pero Node lo está tratando como CommonJS (falta `"type": "module"`, o la extensión es `.js` sin ese campo).
- `ERR_REQUIRE_ESM` — un `require()` intentando cargar un paquete que solo publica ESM. Solución: `import()` dinámico, o migrar el proyecto entero a `"type": "module"`.
- Mezclar `.mjs` y `.cjs` "porque sí" en el mismo proyecto sin necesidad real — generalmente es mejor elegir uno (`"type": "module"` es la dirección donde va el ecosistema hoy) y ser consistente.
