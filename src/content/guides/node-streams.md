---
title: Streams
description: Readable, Writable y .pipe() — por qué importan para archivos grandes y respuestas HTTP, en vez de cargar todo en memoria.
category: backend
stack: node
order: 6
tags: [node, streams, performance]
scope: node:stream
updatedAt: 2026-08-16
---

Un stream procesa datos en **pedazos** (chunks) a medida que llegan, en vez de esperar a tener todo el contenido en memoria antes de empezar. Para un archivo de 2GB, la diferencia es literal entre "usa 2GB de RAM" y "usa unos pocos KB, sin importar el tamaño del archivo".

## Los tipos básicos

```text
Readable   → de donde se leen datos (un archivo, una request HTTP entrante)
Writable   → a donde se escriben datos (un archivo, una response HTTP)
Duplex     → los dos a la vez (un socket TCP)
Transform  → Duplex que además modifica los datos que pasan (compresión, encriptado)
```

## Leer un archivo grande como stream

```ts
import { createReadStream } from 'node:fs';

const stream = createReadStream('archivo-grande.csv', { encoding: 'utf-8' });

stream.on('data', (chunk) => {
  console.log('Pedazo recibido:', chunk.length, 'bytes');
});

stream.on('end', () => {
  console.log('Terminó de leer todo');
});

stream.on('error', (err) => {
  console.error('Algo falló:', err);
});
```

Comparar con `readFile` (de [Filesystem](/guides/node-filesystem)): ese carga el archivo **completo** en memoria antes de devolver algo — para un archivo de unos KB no importa, para uno de varios GB puede tirar el proceso por falta de memoria.

## `.pipe()`: conectar un Readable a un Writable

```ts
import { createReadStream, createWriteStream } from 'node:fs';

createReadStream('origen.txt').pipe(createWriteStream('copia.txt'));
```

`.pipe()` maneja automáticamente el **backpressure**: si el destino (Writable) es más lento consumiendo que el origen (Readable) produciendo, pausa la lectura hasta que el destino esté listo para más — sin esto, un stream rápido escribiendo a uno lento acumularía todo en memoria de todas formas, perdiendo la ventaja de usar streams en primer lugar.

## Streams en un servidor HTTP

`req` y `res` en un servidor Node son streams (`req` es Readable, `res` es Writable) — por eso en [el servidor HTTP nativo](/guides/node-http-server) leer el body de una request implica escuchar eventos `data`/`end`, en vez de tener el body ya armado.

```ts
import { createServer } from 'node:http';
import { createReadStream } from 'node:fs';

const server = createServer((req, res) => {
  if (req.url === '/descargar') {
    // el archivo se transmite en pedazos directo a la respuesta,
    // sin cargarlo entero en memoria del servidor
    createReadStream('archivo-grande.zip').pipe(res);
  }
});
```

## Resumen

| Concepto | Qué es |
| --- | --- |
| `Readable` | Fuente de datos, en pedazos (`data`/`end`/`error`) |
| `Writable` | Destino de datos |
| `.pipe(destino)` | Conecta ambos, maneja backpressure automáticamente |
| Backpressure | El mecanismo que evita que un productor rápido sature a un consumidor lento |

## Consideraciones

- Para la mayoría del código de aplicación (leer un archivo de config chico, un JSON pequeño), `readFile`/`writeFile` normal es más simple y perfectamente adecuado — streams importan específicamente cuando el tamaño de los datos es grande o desconocido de antemano (archivos, uploads, respuestas HTTP grandes).
- `req.on('data', ...)` manual (como en el servidor HTTP nativo) es exactamente consumir un stream Readable a mano — frameworks como Express hacen esto por vos con un middleware de parseo de body.
