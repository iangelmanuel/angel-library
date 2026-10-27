---
title: "runonweb.ai — modelos de IA abiertos que corren en el navegador"
description: "Biblioteca y sitio de demos de midudev para usar IA en el navegador con modelos de pesos abiertos y especializados: voz a texto, quitar fondos, OCR, traducción, embeddings y más, con WebGPU o WASM y sin enviar datos a un servidor."
tags: [ia, midudev, navegador, webgpu, wasm, local, open-source, javascript, transformers-js]
draft: false
resourceCategory: ia
official: true
url: https://runonweb.ai
github: https://github.com/midudev/runonweb.ai
technologies:
  - resources/ia/itsfree-ai
  - resources/ia/canirun-ai
note: "El código es MIT, pero no cubre los modelos: cada uno conserva su licencia y algunas añaden condiciones (límite de facturación, restricciones de uso). Paquete `runonweb` en versión 0.1.0 a octubre de 2026."
warnings:
  - "El módulo `caption` usa la LFM Open License v1.0: gratis solo para personas y empresas con menos de 10 millones de USD de facturación anual."
  - "La primera llamada descarga el modelo desde Hugging Face: de unos pocos MB a varios GB según el módulo (`image` ronda los 3,4 GB). Tenlo en cuenta en móviles y conexiones medidas."
  - "Proyecto muy joven (primera versión publicada en octubre de 2026): la API puede cambiar entre versiones."
updatedAt: 2026-10-27
---

> Proyecto creado y mantenido por **Miguel Ángel Durán**, [Midudev](https://github.com/midudev).

## En pocas palabras

**runonweb.ai** son dos cosas en un mismo repositorio: un **sitio con demos en vivo** y el paquete **`runonweb`**, una biblioteca para ejecutar modelos de IA **dentro del navegador** con un import por tarea (`runonweb/stt`, `runonweb/remove-bg`, `runonweb/embed`…). No hay claves de API, ni backend, ni subida de archivos: el modelo se descarga una vez, el navegador lo guarda en caché y la inferencia ocurre en el dispositivo del usuario.

Cada módulo se basa en un **modelo de pesos abiertos** (cuyos parámetros entrenados se pueden descargar y ejecutar) especializado en una sola tarea, en lugar de un modelo de lenguaje generalista. El repositorio ronda las 700 estrellas a finales de octubre de 2026.

## Qué problema resuelve

Añadir IA a una web suele implicar una API de pago por tokens, un servidor intermedio para esconder la clave y enviar los datos del usuario a un tercero. Para tareas acotadas (transcribir un audio, quitar el fondo de una foto, leer texto de una imagen) existen modelos pequeños que caben en el navegador. runonweb los empaqueta con la misma interfaz, elige el backend adecuado y documenta qué funciona y qué no en cada uno.

## Cómo funciona

- **WebGPU** es la API del navegador para usar la GPU desde JavaScript. Cuando está disponible, runonweb la usa; si no, recurre a **WASM** (WebAssembly, código compilado que corre en la CPU dentro del navegador).
- Por debajo usa Transformers.js y ONNX Runtime Web, y para traducción, los modelos de Firefox Translations de Mozilla.
- El paquete **no incluye pesos**: el navegador los descarga de Hugging Face en el primer uso.
- El README documenta lo aprendido al probar backends, por ejemplo que la cuantización `q8` en WebGPU devuelve resultados basura en silencio, así que usa `fp16`/`fp32` en WebGPU y `q8` en WASM.

## Módulos

| Módulo               | Tarea                         | Modelo base                                | Descarga aproximada        |
| -------------------- | ----------------------------- | ------------------------------------------ | -------------------------- |
| `runonweb/stt`       | Voz a texto                   | Whisper tiny.en (OpenAI)                   | ~150 MB WebGPU / ~40 MB WASM |
| `runonweb/remove-bg` | Quitar el fondo de una imagen | BEN2                                       | ~219 MB (solo WASM)        |
| `runonweb/caption`   | Describir una imagen          | LFM2.5-VL-450M (Liquid AI)                 | ~316 MB / ~505 MB          |
| `runonweb/depth`     | Mapa de profundidad           | Depth Anything V2 Small                    | ~50 MB / ~27 MB            |
| `runonweb/detect`    | Detección de objetos          | RF-DETR Nano (Roboflow)                    | ~29 MB (solo WASM)         |
| `runonweb/ocr`       | Leer texto en imágenes        | PP-OCRv6 (PaddlePaddle)                    | ~6 MB a ~139 MB según tamaño |
| `runonweb/embed`     | Embeddings de texto           | all-MiniLM-L6-v2                           | ~45 MB / ~23 MB            |
| `runonweb/classify`  | Clasificar texto              | Kev-0.8B (sobre Qwen3.5-0.8B)              | ~750 MB                    |
| `runonweb/translate` | Traducción                    | Firefox Translations (Mozilla)             | ~21–55 MB por par de idiomas |
| `runonweb/clean`     | Limpiar transcripciones       | S1-mini (Superwhisper)                     | ~365 MB / ~413 MB          |
| `runonweb/emoji`     | Texto a emojis                | text2emoji-tiny (entrenado por runonweb)   | ~4 MB (solo WASM)          |
| `runonweb/tts`       | Texto a voz                   | Kokoro 82M, Supertonic 2, KittenTTS nano   | ~28 MB a ~326 MB           |
| `runonweb/image`     | Texto a imagen                | Bonsai Image 4B (sobre FLUX.2 Klein)       | ~3,4 GB (solo WebGPU)      |

Las cifras son las del README a octubre de 2026 y son aproximadas.

## Instalación

```bash
npm install runonweb
```

## Uso

Quitar el fondo de una imagen que llega de un `<input type="file">`:

```ts
import { removeBackground } from "runonweb/remove-bg"

const png = await removeBackground(imageFile)
const url = URL.createObjectURL(png)
```

Para operaciones repetidas, reutiliza una instancia y libera la memoria al terminar:

```ts
import { RemoveBackground } from "runonweb/remove-bg"

const remover = new RemoveBackground({
  onProgress: ({ status, progress }) => console.log(status, progress)
})

const first = await remover.remove(firstFile)
const second = await remover.remove(secondFile)

remover.dispose()
```

Similitud entre dos frases con embeddings:

```ts
import { embed, cosineSimilarity } from "runonweb/embed"

const { embeddings } = await embed(["Hello world", "Hola mundo"])
const similarity = cosineSimilarity(embeddings[0], embeddings[1])
```

Traducción:

```ts
import { translate } from "runonweb/translate"

const { text } = await translate("Hello world", { from: "en", to: "es" })
```

`onProgress` es importante en producción: la primera carga puede tardar y conviene mostrar el avance de la descarga.

## Cuándo conviene y cuándo no

**Conviene** para:

- Funciones que manejan datos sensibles (audio, documentos, fotos) que no deben salir del dispositivo.
- Prototipos y herramientas sin presupuesto para APIs: el coste de inferencia lo pone el equipo del usuario.
- Tareas acotadas donde un modelo especializado pequeño basta.

**No conviene** cuando necesitas un modelo generalista potente, resultados idénticos en cualquier equipo o una primera respuesta inmediata: la descarga inicial y el hardware del usuario mandan. Si lo que buscas es una API remota gratuita, mira [it's free\*.ai](/resources/ia/itsfree-ai); para ejecutar modelos grandes en tu propia máquina, [CanIRun.ai](/resources/ia/canirun-ai) indica cuáles caben.

## Límites y precauciones

- **Licencias de los modelos.** Además de `caption`, `tts` con `size: 'multi'` usa OpenRAIL-M (prohíbe suplantación, engaño o uso ilegal) y `clean` obliga a seguir llamando al modelo "S1-mini" de "Superwhisper". Revisa la [página de modelos](https://runonweb.ai/models) antes de publicar.
- **Soporte de WebGPU.** No todos los navegadores ni dispositivos lo tienen; varios módulos van solo por WASM y `image` exige WebGPU.
- **Rendimiento variable.** Según el README, en una GPU de portátil WebGPU en fp16 es de 5 a 7 veces más rápido que WASM q8 para modelos de visión; en equipos modestos la diferencia con un servidor se nota.
- **Privacidad.** Los datos no salen del dispositivo, pero los pesos se descargan de Hugging Face, así que hay una petición de red a un tercero en el primer uso.

## Fuentes

- [runonweb.ai](https://runonweb.ai)
- [Documentación y demos](https://runonweb.ai/docs)
- [Modelos y licencias](https://runonweb.ai/models)
- [Repositorio midudev/runonweb.ai](https://github.com/midudev/runonweb.ai)
- [README del paquete `runonweb`](https://github.com/midudev/runonweb.ai/tree/main/packages/runonweb)
