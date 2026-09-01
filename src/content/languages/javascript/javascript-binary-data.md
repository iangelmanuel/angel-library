---
title: Datos binarios, typed arrays y memoria compartida
description: ArrayBuffer, TypedArray, DataView, codificación de texto, transferencia, SharedArrayBuffer y Atomics con casos de uso.
type: guides
order: 17
tags: [javascript, arraybuffer, typed-array, dataview, binary, atomics]
scope: datos estructurados del lenguaje
website: https://developer.mozilla.org/es/docs/Web/JavaScript/Guide/Typed_arrays
related:
  - languages/javascript/javascript-url-web-apis
  - languages/javascript/javascript-browser-constructors
  - languages/javascript/javascript-runtime-event-loop
updatedAt: 2026-08-25
---

## En 30 segundos

- `ArrayBuffer` reserva bytes; no ofrece acceso numérico directo.
- Una **TypedArray** interpreta esos bytes como una secuencia homogénea: `Uint8Array`, `Float32Array`, etc.
- `DataView` lee y escribe diferentes tipos y permite elegir endianness.
- Varias vistas pueden compartir el mismo buffer: escribir desde una cambia lo que leen las demás.
- `SharedArrayBuffer` y `Atomics` permiten memoria compartida entre agentes, pero requieren diseño de concurrencia y políticas de seguridad específicas.

## Bytes, buffer y vista

```js
const buffer = new ArrayBuffer(4)
const bytes = new Uint8Array(buffer)

bytes[0] = 255
bytes[1] = 16

buffer.byteLength // 4
bytes.length      // 4 elementos de un byte
bytes             // Uint8Array [255, 16, 0, 0]
```

El buffer es almacenamiento. La vista define cómo interpretar ese almacenamiento. Crear una vista no copia los bytes.

```js
const words = new Uint16Array(buffer)

words.buffer === bytes.buffer // true
words.byteLength              // 4
words.length                  // 2 elementos de dos bytes
```

El resultado numérico de `words[0]` depende del orden de bytes de la plataforma. Para formatos de red o archivos, usa `DataView` y especifica endianness.

## Elegir una TypedArray

| Vista | Bits por elemento | Rango o uso |
| --- | ---: | --- |
| `Int8Array` | 8 | enteros con signo |
| `Uint8Array` | 8 | bytes; imágenes, red y codificación |
| `Uint8ClampedArray` | 8 | valores limitados a 0–255; píxeles Canvas |
| `Int16Array`, `Uint16Array` | 16 | audio PCM y formatos compactos |
| `Int32Array`, `Uint32Array` | 32 | enteros y buffers de bajo nivel |
| `BigInt64Array`, `BigUint64Array` | 64 | enteros grandes; devuelve BigInt |
| `Float16Array` | 16 | valores flotantes compactos cuando el runtime lo soporta |
| `Float32Array` | 32 | gráficos, audio y modelos numéricos |
| `Float64Array` | 64 | precisión equivalente a Number |

Las TypedArrays tienen muchos métodos de Array, pero tamaño fijo. No poseen `push`, `pop` ni `splice`.

```js
const samples = new Float32Array([0.25, -0.5, 1])

samples.map(value => value * 2)
// Float32Array [0.5, -1, 2]

samples.slice(0, 2)
// Float32Array [0.25, -0.5]: copia bytes

samples.subarray(0, 2)
// Float32Array [0.25, -0.5]: vista compartida
```

`slice` copia; `subarray` comparte. Esa diferencia importa al pasar datos a workers o conservar una porción después de reutilizar el buffer original.

## `DataView` y endianness

**Endianness** es el orden de los bytes que forman un número de varios bytes. Los protocolos definen si el byte más significativo va primero (*big-endian*) o al final (*little-endian*).

```js
const packet = new ArrayBuffer(6)
const view = new DataView(packet)

view.setUint16(0, 513, false) // big-endian
view.setUint32(2, 100_000, true) // little-endian

view.getUint16(0, false) // 513
view.getUint32(2, true)  // 100000
```

| Método | Bytes | Tipo |
| --- | ---: | --- |
| `getInt8`, `getUint8` | 1 | entero |
| `getInt16`, `getUint16` | 2 | entero |
| `getInt32`, `getUint32` | 4 | entero |
| `getBigInt64`, `getBigUint64` | 8 | BigInt |
| `getFloat16` | 2 | flotante, compatibilidad reciente |
| `getFloat32` | 4 | flotante |
| `getFloat64` | 8 | flotante |

Los métodos `set...` equivalentes escriben. Valida offsets y tamaño del paquete; un acceso fuera del buffer lanza `RangeError`.

## Texto y bytes

`TextEncoder` convierte texto a UTF-8. `TextDecoder` interpreta bytes y puede trabajar en streaming.

```js
const encoder = new TextEncoder()
const decoder = new TextDecoder()

const encoded = encoder.encode('Hola 👋')
// Uint8Array con bytes UTF-8

decoder.decode(encoded)
// 'Hola 👋'
```

No conviertas bytes arbitrarios con `String.fromCharCode(...bytes)`: mezcla codificación, puede desbordar argumentos y rompe texto multibyte.

## Base64 y hexadecimal con `Uint8Array`

Base64 y hexadecimal son representaciones textuales de bytes; no son cifrado ni compresión. ECMAScript 2026 incorporó conversiones directas en `Uint8Array`, evitando cadenas intermedias y las limitaciones de `btoa` y `atob` con texto Unicode.

| API | Devuelve | ¿Muta? |
| --- | --- | --- |
| `Uint8Array.fromBase64(text, options?)` | `Uint8Array` nuevo | no |
| `Uint8Array.fromHex(text)` | `Uint8Array` nuevo | no |
| `bytes.toBase64(options?)` | string | no |
| `bytes.toHex()` | string | no |
| `bytes.setFromBase64(text, options?)` | `{ read, written }` | **sí** |
| `bytes.setFromHex(text)` | `{ read, written }` | **sí** |

```js
const bytes = Uint8Array.fromHex('486f6c61')

new TextDecoder().decode(bytes) // 'Hola'
bytes.toBase64()                // 'SG9sYQ=='

const restored = Uint8Array.fromBase64('SG9sYQ==')
restored.toHex() // '486f6c61'
```

Las variantes `setFrom...` escriben en un buffer ya reservado y reportan cuántos caracteres leyeron y cuántos bytes escribieron; son útiles para decodificación incremental. Las opciones de Base64 permiten elegir el alfabeto normal o URL-safe y controlar el último bloque. Valida el formato esperado y comprueba compatibilidad antes de reemplazar una implementación existente.

## Copiar, transferir y redimensionar

`structuredClone` puede copiar un buffer o **transferirlo**. Una transferencia mueve la propiedad de la memoria y deja el buffer original detached.

```js
const source = new ArrayBuffer(1_024)
const moved = structuredClone(source, { transfer: [source] })

source.byteLength // 0: fue transferido
moved.byteLength  // 1024
```

Transferir evita copiar buffers grandes al enviarlos a un worker. No leas el original después. Runtimes modernos también pueden ofrecer buffers redimensionables y métodos `resize` o `transfer`; comprueba compatibilidad antes de diseñar un contrato que dependa de ellos.

## `SharedArrayBuffer` y `Atomics`

Un `SharedArrayBuffer` puede ser visto por más de un agente, por ejemplo la página y un Web Worker. Escribir y leer sin coordinación produce carreras.

```js
const shared = new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT)
const state = new Int32Array(shared)

Atomics.store(state, 0, 1)
Atomics.add(state, 0, 2)
Atomics.load(state, 0) // 3
```

`Atomics` ofrece operaciones indivisibles como `load`, `store`, `add`, `sub`, `and`, `or`, `xor`, `exchange` y `compareExchange`. `wait`, `notify` y `waitAsync` coordinan agentes en contextos compatibles.

En la Web, `SharedArrayBuffer` suele requerir aislamiento entre orígenes mediante headers COOP y COEP. No lo uses para estado normal de UI; reserva esta complejidad para procesamiento paralelo medido.

## Archivos, red y multimedia

APIs del runtime conectan estos datos con el mundo exterior:

```js
const response = await fetch('/image.bin')
const buffer = await response.arrayBuffer()
const bytes = new Uint8Array(buffer)

bytes.at(0) // primer byte
```

- `Blob` agrupa datos binarios con un MIME type.
- `File` añade nombre y metadatos de archivo.
- `Response.arrayBuffer()` lee un body completo.
- `ReadableStream` procesa chunks sin acumular todo.
- Canvas, Web Audio, WebGL y WebGPU consumen typed arrays especializados.

`Blob`, `File`, `Response` y streams son APIs del runtime; `ArrayBuffer`, TypedArray, `DataView` y `Atomics` forman parte de ECMAScript.

## Errores frecuentes

- Confundir cantidad de elementos con cantidad de bytes.
- Olvidar que dos vistas comparten el mismo buffer.
- Usar `subarray` esperando una copia independiente.
- Interpretar un formato sin especificar endianness.
- confundir Base64 o hexadecimal con protección de datos.
- transferir un buffer y luego intentar reutilizarlo.
- usar memoria compartida sin operaciones atómicas ni un protocolo claro.

## Caso de uso: leer una cabecera binaria

```js
function readHeader(buffer) {
  if (buffer.byteLength < 8) {
    throw new RangeError('La cabecera necesita al menos 8 bytes')
  }

  const view = new DataView(buffer)

  return {
    version: view.getUint8(0),
    flags: view.getUint8(1),
    payloadLength: view.getUint32(4, false),
  }
}

const packet = new ArrayBuffer(8)
const view = new DataView(packet)
view.setUint8(0, 2)
view.setUint8(1, 0b0000_0011)
view.setUint32(4, 512, false)

readHeader(packet)
// { version: 2, flags: 3, payloadLength: 512 }
```

El contrato especifica offsets, tamaño y endianness. Sin esa información, una secuencia de bytes no tiene significado suficiente.
