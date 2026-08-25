---
title: Buffer, bytes y datos binarios
description: Representar bytes, convertir texto con encodings y evitar copias o límites incorrectos al procesar archivos y red.
category: backend
stack: node
order: 7
tags: [node, buffer, binary, encoding]
scope: Buffer
related:
  - guides/node-filesystem
  - guides/node-streams
  - guides/backend-archivos-object-storage
updatedAt: 2026-08-25
---

JavaScript trabaja normalmente con strings y números; archivos, sockets, imágenes y hashes son secuencias de bytes. `Buffer` es la representación binaria de Node y extiende `Uint8Array`.

## Crear y convertir

```js
const bytes = Buffer.from('Hola', 'utf8');

console.log(bytes);                 // <Buffer 48 6f 6c 61>
console.log(bytes.length);          // 4 bytes
console.log(bytes.toString('utf8')); // Hola
console.log(bytes.toString('base64')); // SG9sYQ==
console.log(bytes.toString('hex'));    // 486f6c61
```

Un **encoding** define cómo se transforman caracteres en bytes. UTF-8 usa una cantidad variable: `Buffer.byteLength('💜', 'utf8')` devuelve `4`, aunque el string no parezca tener cuatro caracteres.

Base64 no cifra: representa bytes como texto y aumenta el tamaño. Sirve para transporte cuando un formato solo admite texto, no para ocultar información.

## Reservar memoria

```js
const safe = Buffer.alloc(1024);       // inicializado con ceros
const fast = Buffer.allocUnsafe(1024); // debe sobrescribirse por completo antes de leer
```

`allocUnsafe` puede ser más rápido, pero la memoria no queda inicializada para uso lógico. Nunca devuelvas contenido no sobrescrito: podría exponer bytes residuales del proceso.

## Leer y escribir valores

```js
const packet = Buffer.alloc(6);
packet.writeUInt16BE(513, 0);
packet.writeUInt32BE(42, 2);

console.log(packet.readUInt16BE(0)); // 513
console.log(packet.readUInt32BE(2)); // 42
```

`BE` significa *big-endian*: el byte más significativo se almacena primero. Los protocolos binarios especifican tamaño y endianness; no se eligen de forma arbitraria.

## Copias y vistas

`buffer.subarray(inicio, fin)` crea una vista que comparte memoria. `Buffer.from(buffer)` crea una copia. Si una capa retiene una vista mientras otra modifica el buffer original, el contenido cambia para ambas.

```js
const source = Buffer.from([10, 20, 30]);
const view = source.subarray(0, 2);
source[0] = 99;
console.log(view); // <Buffer 63 14>
```

## Buffer o stream

Usa un Buffer cuando el dato completo es pequeño y necesitas transformarlo. Usa un stream para archivos o respuestas grandes: mantiene una cantidad limitada en memoria y aplica backpressure.

Siempre valida tamaño antes de acumular chunks. Un endpoint que concatena un body sin límite puede agotar la memoria aunque el tipo de archivo sea correcto.

