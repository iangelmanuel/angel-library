---
title: Filesystem — fs y path
description: Leer y escribir archivos en sus tres variantes (síncrona, callback, promesas) y armar rutas cross-platform con path.
category: backend
stack: node
order: 3
tags: [node, fs, filesystem]
scope: fs / path
updatedAt: 2026-08-16
---

`fs` es el módulo nativo de Node para el sistema de archivos, con **tres** APIs distintas para casi cada operación — elegir la correcta importa.

## Las tres variantes

```ts
import { readFileSync } from 'node:fs';                // síncrona: bloquea hasta terminar
import { readFile } from 'node:fs';                     // callback: la más vieja, evitar en código nuevo
import { readFile as readFileAsync } from 'node:fs/promises'; // promesas: la que se usa hoy

// Síncrona — bloquea todo el proceso hasta que termina
const contenido = readFileSync('archivo.txt', 'utf-8');

// Promesas — no bloquea, se puede await
const contenido2 = await readFileAsync('archivo.txt', 'utf-8');
```

La versión **síncrona** solo tiene sentido en scripts de un solo uso o en el arranque de la app (leer un archivo de config antes de levantar el servidor) — usarla dentro del manejo de una request bloquea el event loop entero, afectando a *todas* las requests concurrentes, no solo la que la pidió.

## Operaciones comunes (API de promesas)

```ts
import { readFile, writeFile, mkdir, readdir, stat, unlink } from 'node:fs/promises';

await readFile('archivo.txt', 'utf-8');           // leer como texto
await readFile('imagen.png');                      // sin encoding: devuelve un Buffer (binario)
await writeFile('archivo.txt', 'contenido nuevo'); // sobrescribe si existe, crea si no
await mkdir('carpeta/anidada', { recursive: true }); // crea toda la ruta si hace falta
await readdir('carpeta');                           // lista nombres de archivos/carpetas
await stat('archivo.txt');                           // metadata: tamaño, fechas, si es directorio
await unlink('archivo.txt');                          // borrar un archivo
```

`{ recursive: true }` en `mkdir` es el equivalente a `mkdir -p` — sin eso, falla si algún directorio intermedio de la ruta no existe todavía.

## `path`: armar rutas sin romper en otro sistema operativo

Concatenar rutas con `/` a mano rompe en Windows (usa `\`). `path` arma la ruta correcta según el sistema operativo donde corre el proceso.

```ts
import path from 'node:path';

path.join('carpeta', 'subcarpeta', 'archivo.txt');
// 'carpeta/subcarpeta/archivo.txt' en Linux/Mac, 'carpeta\subcarpeta\archivo.txt' en Windows

path.resolve('carpeta', 'archivo.txt');
// ruta absoluta, resuelta desde el directorio de trabajo actual

path.extname('archivo.txt');   // '.txt'
path.basename('/a/b/archivo.txt'); // 'archivo.txt'
path.dirname('/a/b/archivo.txt');  // '/a/b'
```

`path.join` es el que se usa casi siempre para armar una ruta a partir de partes; `path.resolve` cuando específicamente necesitás una ruta absoluta.

## `import.meta.url`: saber dónde está el archivo actual (ESM)

En CommonJS existían `__dirname`/`__filename` automáticamente. En ES Modules no existen — el equivalente es:

```ts
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
```

## Resumen

| Función | Qué hace |
| --- | --- |
| `readFile` / `writeFile` (promises) | Leer/escribir, la variante a usar en código de servidor |
| `readFileSync` | Solo para scripts o arranque, bloquea el proceso |
| `mkdir(ruta, { recursive: true })` | Crear carpetas, incluyendo intermedias |
| `path.join(...)` | Armar una ruta cross-platform |
| `path.resolve(...)` | Ruta absoluta desde el directorio actual |

## Consideraciones

- `readFile` sin segundo argumento de encoding devuelve un `Buffer`, no un string — para texto, siempre pasar `'utf-8'` explícito.
- Operaciones de archivo grande se benefician de streams en vez de `readFile`/`writeFile` completo en memoria — ver [Streams](/guides/node-streams).
- Rutas relativas en `fs` se resuelven contra `process.cwd()` (desde dónde se ejecutó el comando `node ...`), **no** contra la carpeta del archivo que las escribe — para eso hace falta `import.meta.url` + `path.dirname` como arriba.
