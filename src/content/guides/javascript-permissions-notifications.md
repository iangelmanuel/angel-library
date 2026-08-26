---
title: Permisos, notificaciones y capacidades sensibles
description: Consultar permisos, solicitar notificaciones, usar service workers, geolocalización, portapapeles y otras capacidades con una UX responsable.
category: languages
stack: javascript
order: 32
tags: [javascript, permissions, notifications, geolocation, clipboard]
scope: Web APIs con permisos
website: https://developer.mozilla.org/es/docs/Web/API/Permissions_API
related:
  - guides/javascript-media-devices
  - guides/javascript-browser-constructors
  - guides/security-common-web-attacks
updatedAt: 2026-08-25
---

## Para recordar

Un permiso es una decisión de confianza, no un trámite técnico. Solicítalo después de explicar el beneficio y en respuesta a una acción. Detecta soporte, maneja `granted`, `denied` y `prompt`, ofrece alternativa y evita repetir solicitudes después de una negativa.

## Modelo de permisos

Las APIs sensibles combinan varias restricciones:

- contexto seguro HTTPS;
- permiso del usuario;
- gesto o activación reciente;
- `Permissions-Policy` del documento superior;
- configuración del navegador o sistema operativo;
- disponibilidad del hardware y compatibilidad.

La Permissions API permite **consultar** algunos estados, pero no concede permisos por sí sola. La API concreta determina cómo y cuándo muestra su solicitud.

## `navigator.permissions.query()`

```js
const status = await navigator.permissions.query({ name: 'geolocation' })

status.state // 'granted', 'denied' o 'prompt'

status.addEventListener('change', () => {
  console.log(status.state)
})
```

| Estado | Significado |
| --- | --- |
| `granted` | la capacidad puede usarse bajo las restricciones actuales |
| `denied` | está bloqueada; no repitas solicitudes continuamente |
| `prompt` | usar la API podría mostrar una decisión al usuario |

Los nombres consultables y su compatibilidad varían. Envuelve la consulta en detección y no la conviertas en requisito si puedes intentar la operación directamente y manejar su error.

```js
async function readPermission(name) {
  if (!navigator.permissions?.query) return 'unsupported'

  try {
    const result = await navigator.permissions.query({ name })
    return result.state
  } catch {
    return 'unsupported'
  }
}

await readPermission('geolocation')
// 'granted', 'denied', 'prompt' o 'unsupported'
```

## Diseñar una solicitud correcta

1. Explica el beneficio antes del prompt del navegador.
2. Solicita solo después de una acción relacionada.
3. Pide la capacidad mínima y en el momento necesario.
4. Si se deniega, conserva una alternativa funcional.
5. No engañes ni bloquees toda la página para forzar aceptación.
6. Explica cómo cambiar el permiso desde el navegador cuando sea imprescindible.

Un permiso concedido puede revocarse y no equivale a consentimiento ilimitado para almacenar, compartir o reutilizar datos.

## Notifications API

### Detectar soporte y estado

```js
const supportsNotifications = 'Notification' in window

supportsNotifications // true o false
Notification.permission
// 'default', 'granted' o 'denied'
```

`default` significa que no hay una decisión afirmativa y debe tratarse como no concedido.

### Solicitar permiso

Hazlo desde un clic o acción explícita, no al cargar la página.

```js
enableNotificationsButton.addEventListener('click', async () => {
  if (!('Notification' in window)) {
    showMessage('Este navegador no ofrece notificaciones web.')
    return
  }

  const permission = await Notification.requestPermission()

  permission // 'granted', 'denied' o 'default'
  updateNotificationUI(permission)
})
```

La sintaxis antigua con callback está obsoleta; usa la Promise.

## `new Notification()`

Para una página abierta en un entorno compatible:

```js
function showLocalNotification() {
  if (Notification.permission !== 'granted') return null

  const notification = new Notification('Compilación terminada', {
    body: 'El proyecto está listo para revisar.',
    icon: '/icons/app-192.png',
    tag: 'build-status',
    data: { url: '/builds/42' },
  })

  notification.addEventListener('click', () => {
    window.focus()
    window.location.assign(notification.data.url)
    notification.close()
  })

  return notification
}

const notification = showLocalNotification()
notification instanceof Notification // true si se creó
```

| Opción | Propósito |
| --- | --- |
| `body` | contenido breve |
| `icon` | ícono principal |
| `badge` | ícono monocromático pequeño en plataformas compatibles |
| `tag` | agrupar o reemplazar una notificación relacionada |
| `renotify` | volver a alertar al reemplazar; requiere `tag` |
| `silent` | pedir que no emita sonido/vibración |
| `requireInteraction` | sugerir que permanezca; soporte variable |
| `data` | datos clonables para manejar el clic |

No coloques secretos en `data` ni información sensible visible en una pantalla bloqueada. El sistema puede recortar texto, ignorar opciones o presentar la notificación de forma distinta.

## Notificaciones mediante Service Worker

Para una PWA, notificaciones en segundo plano o mejor soporte móvil, usa `ServiceWorkerRegistration.showNotification()`.

```js
async function showPersistentNotification() {
  if (Notification.permission !== 'granted') return false

  const registration = await navigator.serviceWorker.ready

  await registration.showNotification('Nuevo mensaje', {
    body: 'Tienes una respuesta pendiente.',
    icon: '/icons/app-192.png',
    badge: '/icons/badge-96.png',
    tag: 'messages',
    data: { url: '/messages' },
  })

  return true
}

await showPersistentNotification() // true si se solicitó correctamente
```

En el service worker:

```js
self.addEventListener('notificationclick', event => {
  event.notification.close()

  const url = event.notification.data?.url ?? '/'

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then(async windows => {
        const existing = windows.find(client => client.url.includes(url))
        if (existing) return existing.focus()
        return clients.openWindow(url)
      }),
  )
})
```

`showNotification` muestra una notificación local. Para recibir información cuando la app no está abierta necesitas además Push API, una suscripción y un servidor que envíe mensajes push. Notificación y push no son lo mismo.

## Geolocalización

```js
function getCurrentPosition(options = {}) {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, options)
  })
}

const position = await getCurrentPosition({
  enableHighAccuracy: false,
  timeout: 8_000,
  maximumAge: 60_000,
})

position.coords.latitude  // número
position.coords.longitude // número
position.coords.accuracy  // precisión estimada en metros
```

`enableHighAccuracy` puede consumir más batería y tardar más. Solicita ubicación aproximada cuando sea suficiente. Para seguimiento continuo usa `watchPosition` y guarda el id para detenerlo.

```js
const watchId = navigator.geolocation.watchPosition(handlePosition, handleError)

navigator.geolocation.clearWatch(watchId)
```

No conserves historial de ubicación sin necesidad, una política clara y controles de borrado.

## Portapapeles

La Clipboard API moderna requiere HTTPS y normalmente activación del usuario.

```js
copyButton.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText('npm run build')
    showMessage('Comando copiado')
  } catch {
    showMessage('No fue posible copiar automáticamente')
  }
})
```

Leer el portapapeles es más sensible y tiene restricciones mayores:

```js
pasteButton.addEventListener('click', async () => {
  const text = await navigator.clipboard.readText()
  preview.textContent = text
})
```

Trata el contenido como no confiable. No lo insertes con `innerHTML`, no copies silenciosamente información engañosa y conserva una alternativa de selección manual.

## Wake Lock

Screen Wake Lock evita que la pantalla se apague durante una tarea visible, como una receta, mapa o presentación.

```js
let wakeLock

async function keepScreenAwake() {
  if (!navigator.wakeLock) return false
  wakeLock = await navigator.wakeLock.request('screen')
  return true
}

async function releaseWakeLock() {
  await wakeLock?.release()
  wakeLock = null
}
```

El lock puede liberarse al ocultar la página, bloquear el dispositivo o por decisión del sistema. Escucha `visibilitychange` y vuelve a solicitarlo solo si el usuario aún espera ese comportamiento.

## Web Share

```js
shareButton.addEventListener('click', async () => {
  const data = {
    title: 'Guía de JavaScript',
    text: 'Referencia de Web APIs',
    url: location.href,
  }

  if (navigator.share && navigator.canShare?.(data) !== false) {
    await navigator.share(data)
  } else {
    await navigator.clipboard.writeText(data.url)
  }
})
```

El usuario puede cancelar el diálogo; esa cancelación no siempre debe mostrarse como error crítico.

## Capacidades relacionadas

| API | Entrada principal | Consideración |
| --- | --- | --- |
| cámara/micrófono | `getUserMedia()` | permiso, indicador y pistas activas |
| compartir pantalla | `getDisplayMedia()` | selección explícita por sesión |
| MIDI | `requestMIDIAccess()` | hardware y permiso, soporte variable |
| Bluetooth | `navigator.bluetooth.requestDevice()` | gesto, filtro y soporte variable |
| USB | `navigator.usb.requestDevice()` | acceso potente y específico |
| serial | `navigator.serial.requestPort()` | hardware y soporte variable |
| archivos | `showOpenFilePicker()` | gesto y soporte variable |
| pantalla activa | `wakeLock.request()` | batería y visibilidad |

Estas APIs deben ser mejoras progresivas. Verifica compatibilidad y ofrece una ruta alternativa.

## Lista de seguridad y experiencia

- Solicita desde una acción relacionada y comprensible.
- No repitas un prompt después de una denegación.
- Solicita el mínimo alcance posible.
- Maneja revocación, cancelación y falta de soporte.
- Evita registrar datos sensibles obtenidos por la API.
- Detén watchers, tracks, locks y listeners al terminar.
- No uses una capacidad sensible como única forma de completar una tarea básica.
- Explica retención, envío y eliminación cuando se capturen datos personales.
