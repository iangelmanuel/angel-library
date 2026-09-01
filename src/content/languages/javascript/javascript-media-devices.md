---
title: Cámara, micrófono y dispositivos multimedia
description: Detectar dispositivos, solicitar cámara o micrófono, cambiar fuentes, compartir pantalla, capturar una imagen y liberar recursos.
type: guides
order: 30
tags: [javascript, media-devices, camera, microphone, getusermedia]
scope: Web APIs con permisos
website: https://developer.mozilla.org/es/docs/Web/API/MediaDevices
related:
  - languages/javascript/javascript-audio-recording
  - languages/javascript/javascript-permissions-notifications
  - languages/javascript/javascript-browser-constructors
updatedAt: 2026-08-25
---

## Para recordar

`getUserMedia` requiere contexto seguro, permiso y una acción comprensible para la persona. Devuelve un `MediaStream`; cada track debe detenerse al terminar. Pide solo audio o video necesario, maneja rechazos por nombre y no solicites permisos durante la carga inicial.

## Antes de solicitar acceso

La cámara y el micrófono son capacidades sensibles. `navigator.mediaDevices` está disponible en contextos seguros —normalmente HTTPS o localhost— y `getUserMedia()` requiere permiso del usuario.

```js
const supportsMediaDevices = Boolean(navigator.mediaDevices)
const supportsCamera = Boolean(navigator.mediaDevices?.getUserMedia)

supportsMediaDevices // true o false
supportsCamera       // true o false
```

No solicites permisos al cargar la página. Explica primero para qué se usarán y haz la solicitud como respuesta a una acción clara. Que una API exista no significa que el dispositivo tenga cámara, que la política del documento la permita o que el usuario acepte.

## APIs principales

| API | Devuelve | Solicita permiso | Caso de uso |
| --- | --- | --- | --- |
| `enumerateDevices()` | Promise con `MediaDeviceInfo[]` | no siempre, pero limita datos sin permiso | listar entradas y salidas |
| `getUserMedia(constraints)` | Promise con `MediaStream` | **sí** | cámara y micrófono |
| `getDisplayMedia(options)` | Promise con `MediaStream` | **sí, cada selección** | compartir pantalla/ventana |
| evento `devicechange` | Event | no | detectar conexión o retiro de dispositivos |
| `track.getSettings()` | objeto con configuración aplicada | no | conocer resolución o deviceId real |
| `track.applyConstraints()` | Promise | puede reutilizar permiso | ajustar una pista activa |

## Enumerar cámaras, micrófonos y salidas

```js
async function listMediaDevices() {
  if (!navigator.mediaDevices?.enumerateDevices) return []

  const devices = await navigator.mediaDevices.enumerateDevices()

  return devices.map(device => ({
    id: device.deviceId,
    groupId: device.groupId,
    kind: device.kind,
    label: device.label || 'Dispositivo sin identificar',
  }))
}

await listMediaDevices()
// por ejemplo:
// [
//   { id: '...', groupId: '...', kind: 'audioinput', label: 'Micrófono' },
//   { id: '...', groupId: '...', kind: 'videoinput', label: 'Cámara frontal' },
//   { id: '...', groupId: '...', kind: 'audiooutput', label: 'Altavoces' }
// ]
```

| `kind` | Representa |
| --- | --- |
| `audioinput` | micrófono o entrada de audio |
| `videoinput` | cámara o entrada de video |
| `audiooutput` | altavoz, auricular o salida |

Los labels y dispositivos no predeterminados pueden ocultarse hasta que el usuario conceda permiso. La lista también excluye capacidades bloqueadas por `Permissions-Policy`. El documento debe estar activo y visible para enumerar en navegadores que aplican estas restricciones.

## Solicitar cámara o micrófono

### Solo micrófono

```js
const stream = await navigator.mediaDevices.getUserMedia({
  audio: true,
  video: false,
})

stream instanceof MediaStream // true
stream.getAudioTracks().length // normalmente 1
stream.getVideoTracks().length // 0
```

### Cámara con preferencias

```js
const stream = await navigator.mediaDevices.getUserMedia({
  audio: false,
  video: {
    width: { ideal: 1280 },
    height: { ideal: 720 },
    facingMode: { ideal: 'environment' },
  },
})

const [track] = stream.getVideoTracks()
track.getSettings()
// objeto con valores aplicados, por ejemplo:
// { width: 1280, height: 720, facingMode: 'environment', deviceId: '...' }
```

`ideal` expresa preferencia; `exact`, `min` y `max` convierten parte de la restricción en requisito y pueden causar `OverconstrainedError` si ningún dispositivo la cumple.

```js
const strictStream = await navigator.mediaDevices.getUserMedia({
  video: {
    deviceId: { exact: selectedDeviceId },
  },
})
```

## Mostrar una vista previa

```html
<video id="preview" autoplay muted playsinline></video>
```

```js
const video = document.querySelector('#preview')
const stream = await navigator.mediaDevices.getUserMedia({ video: true })

video.srcObject = stream
await video.play()

video.srcObject === stream // true
video.videoWidth           // resolución disponible después de metadata
```

`muted` evita retroalimentación cuando hay audio local; `playsinline` reduce la posibilidad de que video móvil fuerce pantalla completa. Aun con `autoplay`, maneja el rechazo de `play()`.

## Detener y liberar dispositivos

Quitar `srcObject` no apaga por sí solo la cámara. Detén cada pista.

```js
function stopMediaStream(stream) {
  for (const track of stream.getTracks()) {
    track.stop()
  }
}

stopMediaStream(stream)
video.srcObject = null

stream.getTracks().every(track => track.readyState === 'ended')
// true
```

Haz esta limpieza al cerrar una llamada, cambiar de cámara, desmontar el componente o abandonar la página. El indicador de cámara o micrófono debe desaparecer cuando ya no hay pistas activas.

## Cambiar de cámara

```js
let activeStream

async function selectCamera(video, deviceId) {
  if (activeStream) stopMediaStream(activeStream)

  activeStream = await navigator.mediaDevices.getUserMedia({
    video: { deviceId: { exact: deviceId } },
    audio: false,
  })

  video.srcObject = activeStream
  await video.play()

  return activeStream
}
```

En móviles también puedes alternar con `facingMode: 'user'` o `'environment'`. Detener la pista anterior antes de solicitar otra reduce conflictos, aunque debes mantener una interfaz recuperable si la segunda solicitud falla.

## Detectar cambios de dispositivos

```js
const controller = new AbortController()

navigator.mediaDevices.addEventListener('devicechange', async () => {
  const devices = await listMediaDevices()
  renderDeviceOptions(devices)
}, { signal: controller.signal })

// al desmontar
controller.abort()
```

El evento indica que cambió el conjunto disponible; vuelve a enumerar en lugar de asumir cuál dispositivo se conectó o retiró.

## Errores de `getUserMedia`

| Error | Significado habitual | Respuesta útil |
| --- | --- | --- |
| `NotAllowedError` | permiso denegado, contexto inseguro o política bloqueada | explicar cómo habilitarlo; no insistir |
| `NotFoundError` | no existe una fuente solicitada | permitir continuar sin esa capacidad |
| `NotReadableError` | hardware ocupado o error del sistema | sugerir cerrar otra aplicación |
| `OverconstrainedError` | restricciones imposibles | relajar `exact`, `min` o `max` |
| `AbortError` | el dispositivo no pudo iniciar | ofrecer reintento controlado |
| `InvalidStateError` | documento no activo | esperar a una vista activa |

```js
async function openCamera() {
  try {
    return await navigator.mediaDevices.getUserMedia({ video: true })
  } catch (error) {
    switch (error.name) {
      case 'NotAllowedError':
        showMessage('Necesitamos permiso para usar la cámara.')
        break
      case 'NotFoundError':
        showMessage('No se encontró una cámara disponible.')
        break
      default:
        showMessage('No fue posible iniciar la cámara.')
        reportError(error)
    }
    return null
  }
}
```

No registres constraints, nombres o identificadores de dispositivos si no son necesarios; pueden ser información sensible.

## Compartir pantalla

```js
const displayStream = await navigator.mediaDevices.getDisplayMedia({
  video: true,
  audio: true,
})

const [displayTrack] = displayStream.getVideoTracks()

displayTrack.addEventListener('ended', () => {
  video.srcObject = null
  showMessage('La pantalla dejó de compartirse.')
})
```

El navegador debe permitir que el usuario elija qué compartir y normalmente exige activación reciente. No puedes conservar silenciosamente ese permiso para una sesión futura. El audio del sistema depende del navegador, sistema operativo y superficie elegida.

## Capturar una fotografía del video

```js
function captureFrame(video) {
  const canvas = document.createElement('canvas')
  canvas.width = video.videoWidth
  canvas.height = video.videoHeight

  const context = canvas.getContext('2d')
  context.drawImage(video, 0, 0)

  return new Promise(resolve => {
    canvas.toBlob(resolve, 'image/jpeg', 0.85)
  })
}

const photo = await captureFrame(video)

photo instanceof Blob // true, salvo un fallo de codificación
photo.type             // 'image/jpeg'
```

Espera `loadedmetadata` o dimensiones distintas de cero antes de capturar. Revisa orientación, espejo de cámara frontal, resolución y consentimiento antes de guardar o enviar la imagen.

## Permissions Policy e iframes

Una página embebida no obtiene acceso automáticamente. El documento superior debe permitir la capacidad y el iframe puede necesitar `allow`.

```html
<iframe
  src="https://video.example.com/call"
  allow="camera; microphone; display-capture"
></iframe>
```

El servidor también puede limitar capacidades con `Permissions-Policy`. CORS y Permissions Policy resuelven problemas distintos.

## Privacidad y experiencia

- Solicita solo audio o video realmente necesario.
- Muestra claramente cuándo una pista está activa.
- Incluye controles para silenciar, apagar cámara y terminar.
- Detén pistas al finalizar, no solo ocultes el elemento.
- No subas ni grabes contenido sin una acción y explicación explícitas.
- Trata ids, labels, grabaciones e imágenes como datos sensibles.
- Ofrece una alternativa cuando el permiso se rechaza o el hardware no existe.
