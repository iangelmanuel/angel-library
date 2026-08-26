---
title: Audio, análisis de sonido y grabación
description: Reproducir audio, usar AudioContext, detectar nivel del micrófono, grabar con MediaRecorder y trabajar con síntesis de voz.
category: languages
stack: javascript
order: 31
tags: [javascript, audio, web-audio, media-recorder, speech]
scope: Web APIs multimedia
website: https://developer.mozilla.org/es/docs/Web/API/Web_Audio_API
related:
  - guides/javascript-media-devices
  - guides/javascript-events
  - guides/javascript-browser-constructors
updatedAt: 2026-08-25
---

## Para recordar

`HTMLAudioElement` reproduce medios; Web Audio enruta y procesa sonido; `MediaRecorder` codifica un `MediaStream`. Un `AudioContext` puede comenzar suspendido hasta un gesto del usuario. Detén tracks, desconecta nodos y revoca object URLs al finalizar.

## Elegir la API de audio

| Necesidad | API adecuada |
| --- | --- |
| reproducir un archivo | `<audio>` o `new Audio()` |
| controlar volumen, filtros o mezclar fuentes | Web Audio API |
| visualizar o detectar nivel de sonido | `AnalyserNode` |
| grabar un MediaStream | `MediaRecorder` |
| convertir texto en voz | Speech Synthesis |
| reconocer voz | Speech Recognition, con soporte variable |

Audio del usuario implica permisos y privacidad. Reproducción automática con sonido suele estar restringida hasta una interacción.

## `<audio>` y `new Audio()`

```js
const audio = new Audio('/sounds/notification.mp3')

audio.preload = 'metadata'
audio.volume = 0.5
audio.loop = false

await audio.play() // Promise; puede rechazar por política de autoplay
audio.pause()      // undefined
audio.currentTime  // posición actual en segundos
```

| Propiedad o método | Devuelve o representa | Efecto |
| --- | --- | --- |
| `play()` | Promise | inicia o reanuda |
| `pause()` | `undefined` | pausa |
| `currentTime` | segundos | lectura o búsqueda |
| `duration` | segundos o `NaN` antes de metadata | duración |
| `volume` | número entre 0 y 1 | volumen del elemento |
| `muted` | booleano | silenciar |
| `playbackRate` | multiplicador | velocidad |

```js
audio.addEventListener('loadedmetadata', () => {
  audio.duration // duración conocida
})

audio.addEventListener('ended', () => {
  showReplayButton()
})
```

Para contenido semántico con controles visibles, prefiere `<audio controls>` y conserva captions o transcripción cuando corresponda.

## `new AudioContext()`

Web Audio trabaja como un grafo:

```text
fuente → nodos de procesamiento → destination
```

Crea y reutiliza un contexto en lugar de abrir uno por sonido.

```js
const audioContext = new AudioContext()

audioContext.state      // 'suspended', 'running' o 'closed'
audioContext.sampleRate // por ejemplo: 48000

await audioContext.resume()
audioContext.state      // 'running'
```

Haz `resume()` como respuesta a un gesto del usuario. Al terminar definitivamente:

```js
await audioContext.close()
audioContext.state // 'closed'
```

## Reproducir y controlar una fuente

```html
<audio id="music" src="/music/theme.mp3" controls></audio>
```

```js
const context = new AudioContext()
const element = document.querySelector('#music')
const source = context.createMediaElementSource(element)
const gain = context.createGain()

source.connect(gain)
gain.connect(context.destination)

gain.gain.value = 0.4
gain.gain.value // 0.4
```

Un `MediaElementAudioSourceNode` se asocia una vez a su elemento dentro del contexto. Evita recrearlo en cada render.

## Nodos frecuentes

| Nodo | Se crea con | Resuelve |
| --- | --- | --- |
| `GainNode` | `createGain()` | volumen y fundidos |
| `AnalyserNode` | `createAnalyser()` | forma de onda y frecuencias |
| `BiquadFilterNode` | `createBiquadFilter()` | filtros lowpass, highpass, etc. |
| `StereoPannerNode` | `createStereoPanner()` | paneo izquierda/derecha |
| `OscillatorNode` | `createOscillator()` | tonos generados |
| `DelayNode` | `createDelay()` | retraso |
| `DynamicsCompressorNode` | `createDynamicsCompressor()` | controlar rango dinámico |

### Generar un tono breve

```js
function beep(context, frequency = 440, duration = 0.15) {
  const oscillator = context.createOscillator()
  const gain = context.createGain()
  const now = context.currentTime

  oscillator.frequency.value = frequency
  gain.gain.setValueAtTime(0.15, now)
  gain.gain.exponentialRampToValueAtTime(0.001, now + duration)

  oscillator.connect(gain).connect(context.destination)
  oscillator.start(now)
  oscillator.stop(now + duration)
}

beep(audioContext, 880)
```

No uses señales sonoras como única forma de comunicar un estado; incluye texto o una alternativa visual.

## Detectar nivel del micrófono

Esto mide amplitud aproximada, no reconoce palabras ni garantiza una medición física calibrada de decibelios.

```js
async function createMicrophoneMeter() {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
  const context = new AudioContext()
  const source = context.createMediaStreamSource(stream)
  const analyser = context.createAnalyser()

  analyser.fftSize = 2048
  source.connect(analyser)

  const samples = new Uint8Array(analyser.fftSize)

  function readLevel() {
    analyser.getByteTimeDomainData(samples)

    let sumSquares = 0
    for (const sample of samples) {
      const normalized = (sample - 128) / 128
      sumSquares += normalized ** 2
    }

    return Math.sqrt(sumSquares / samples.length)
  }

  return {
    readLevel,
    stop: async () => {
      stream.getTracks().forEach(track => track.stop())
      await context.close()
    },
  }
}

const meter = await createMicrophoneMeter()
meter.readLevel() // aproximadamente 0 en silencio; aumenta con sonido
await meter.stop()
```

Para dibujar un medidor, lee como máximo una vez por frame con `requestAnimationFrame`. Define un umbral y suavizado según el dispositivo; no asumas que todos los micrófonos entregan la misma escala.

## Analizar frecuencias

```js
const analyser = audioContext.createAnalyser()
analyser.fftSize = 2048

const bins = new Uint8Array(analyser.frequencyBinCount)
analyser.getByteFrequencyData(bins)

bins.length // 1024 cuando fftSize es 2048
Math.max(...bins) // intensidad máxima aproximada entre 0 y 255
```

Conecta una fuente al analyser y el analyser al destino si también debe escucharse. Para arrays grandes evita `Math.max(...bins)` por límites de argumentos; recorre el typed array.

## Grabar con `MediaRecorder`

`MediaRecorder` recibe un `MediaStream` de micrófono, cámara, pantalla o canvas y produce fragmentos `Blob`.

```js
const stream = await navigator.mediaDevices.getUserMedia({ audio: true })

const preferredType = 'audio/webm;codecs=opus'
const options = MediaRecorder.isTypeSupported(preferredType)
  ? { mimeType: preferredType }
  : undefined

const recorder = new MediaRecorder(stream, options)
const chunks = []

recorder.addEventListener('dataavailable', event => {
  if (event.data.size > 0) chunks.push(event.data)
})

const recording = new Promise(resolve => {
  recorder.addEventListener('stop', () => {
    resolve(new Blob(chunks, { type: recorder.mimeType }))
  }, { once: true })
})

recorder.start(1_000)
recorder.state // 'recording'

// después de una acción del usuario:
recorder.stop()
const blob = await recording

blob instanceof Blob // true
blob.type             // MIME elegido por el navegador

stream.getTracks().forEach(track => track.stop())
```

| Método | Estado esperado | Resultado |
| --- | --- | --- |
| `start(timeslice?)` | `inactive` | comienza; emite chunks opcionales |
| `pause()` | `recording` | estado `paused` |
| `resume()` | `paused` | vuelve a `recording` |
| `requestData()` | `recording` | fuerza `dataavailable` |
| `stop()` | recording/paused | finaliza y emite último dato |

Comprueba `MediaRecorder.isTypeSupported()`; los contenedores y codecs varían. Limita duración y tamaño, informa que se está grabando y no subas el archivo sin consentimiento explícito.

## Reproducir o descargar una grabación

```js
const url = URL.createObjectURL(blob)
recordingAudio.src = url

download.href = url
download.download = 'grabacion.webm'

function discardRecording() {
  recordingAudio.removeAttribute('src')
  recordingAudio.load()
  download.removeAttribute('href')
  URL.revokeObjectURL(url)
}

// Llamar cuando se reemplace la grabación o se desmonte la vista.
discardButton.addEventListener('click', discardRecording, { once: true })
```

No revoques la URL mientras un elemento aún la necesita. Hazlo al reemplazar la grabación o desmontar la vista.

## Síntesis de voz

```js
const utterance = new SpeechSynthesisUtterance('La descarga terminó')

utterance.lang = 'es-CO'
utterance.rate = 1
utterance.pitch = 1

speechSynthesis.speak(utterance)

utterance.addEventListener('end', () => {
  console.log('Lectura finalizada')
})
```

Las voces dependen del sistema y pueden cargarse después. `speechSynthesis.getVoices()` puede estar vacío inicialmente; escucha `voiceschanged` cuando necesites presentar un selector.

```js
speechSynthesis.getVoices()
// array de SpeechSynthesisVoice disponibles en el dispositivo

speechSynthesis.cancel() // cancela la cola
```

No reproduzcas voz inesperadamente. La síntesis no reemplaza etiquetas, regiones accesibles ni compatibilidad con lectores de pantalla.

## Reconocimiento de voz

`SpeechRecognition` permite transcribir audio en navegadores compatibles, pero el soporte, prefijos, procesamiento local/remoto e idiomas varían. Trátalo como mejora progresiva.

```js
const SpeechRecognition = window.SpeechRecognition
  ?? window.webkitSpeechRecognition

if (SpeechRecognition) {
  const recognition = new SpeechRecognition()
  recognition.lang = 'es-CO'
  recognition.interimResults = false

  recognition.addEventListener('result', event => {
    const transcript = event.results[0][0].transcript
    transcript // texto reconocido
  })

  recognition.start()
}
```

Explica si el audio puede enviarse a un servicio externo, ofrece entrada manual y maneja errores o falta de compatibilidad.

## Limpieza y seguridad

- Detén todas las pistas con `track.stop()`.
- Cierra `AudioContext` cuando no se reutilizará.
- Desconecta nodos que quedan referenciados.
- Revoca object URLs cuando dejen de usarse.
- Cancela síntesis y reconocimiento al abandonar la vista.
- Limita grabaciones y valida MIME/tamaño en el servidor.
- Nunca supongas que silencio significa ausencia de personas o consentimiento.
