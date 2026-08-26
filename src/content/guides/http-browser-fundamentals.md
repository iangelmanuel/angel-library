---
title: HTTP y ciclo completo de carga del navegador
description: "Desde una URL hasta una página interactiva: DNS, conexiones, TLS, HTTP, caché, servidor, parsing, renderizado y métricas."
category: languages
stack: javascript
order: 33
tags: [http, browser, dns, cache, rendering]
scope: plataforma web
website: https://developer.mozilla.org/es/docs/Web/HTTP
related:
  - technologies/javascript
  - guides/javascript-events
  - guides/core-web-vitals
  - guides/performance-resource-loading
updatedAt: 2026-08-25
---

## Mapa completo

Cuando escribes una URL y presionas Enter no ocurre una sola petición aislada. El recorrido habitual es:

```text
URL
  ↓
políticas, cachés y service worker
  ↓
DNS → dirección IP
  ↓
TCP + TLS, o QUIC
  ↓
request HTTP
  ↓
CDN / WAF / proxy / balanceador / aplicación / datos
  ↓
response HTTP
  ↓
HTML → DOM + CSSOM → render tree → layout → paint → composite
  ↓
JavaScript, eventos, hidratación e interacción
```

No todas las navegaciones recorren cada paso. DNS y conexiones pueden estar reutilizados; una caché o service worker puede responder sin red; una SPA puede actualizar la vista sin solicitar otro documento HTML.

## 1. Interpretar la URL

```text
https://docs.example.com:443/guides/http?page=2#cache
└─┬─┘   └───────┬───────┘ └┬┘ └────┬────┘ └──┬──┘ └─┬─┘
scheme           host       port     path      query   fragment
```

| Parte | Viaja en HTTP | Función |
| --- | --- | --- |
| esquema | determina conexión | `http`, `https` |
| host | sí, como autoridad/Host | dominio de destino |
| puerto | forma parte de autoridad | 443 por defecto en HTTPS |
| path | sí | recurso solicitado |
| query | sí | filtros o parámetros |
| fragment | **no** | navegación dentro del documento, solo cliente |

El navegador normaliza la URL, aplica políticas como HSTS, comprueba esquemas especiales, consulta historial y decide si la navegación puede ser interceptada por un service worker.

```js
const url = new URL('https://docs.example.com/guides/http?page=2#cache')

url.origin   // 'https://docs.example.com'
url.pathname // '/guides/http'
url.search   // '?page=2'
url.hash     // '#cache'
```

Nunca pongas secretos en query o fragmentos suponiendo que son privados. Una query puede quedar en historial, logs, analítica y encabezados de referencia según la política aplicada.

## 2. Cachés e interceptación temprana

Antes de abrir una conexión, el navegador puede consultar:

- memory cache del proceso actual;
- disk cache persistente;
- preloaded resources;
- caché administrada por un service worker;
- reglas de navegación y redirecciones conocidas;
- conexión ya abierta al mismo origen.

La etiqueta “from memory cache” o “from disk cache” en DevTools indica que gran parte del recorrido de red no fue necesario. Un service worker puede responder desde Cache Storage, crear una respuesta o ir a red según su estrategia.

## 3. DNS: del dominio a una dirección

DNS traduce `docs.example.com` a direcciones IPv4 o IPv6. Puede consultar cachés del navegador, sistema operativo, router, proveedor o resolver recursivo antes de llegar a servidores autoritativos.

| Registro | Función habitual |
| --- | --- |
| `A` | dominio → IPv4 |
| `AAAA` | dominio → IPv6 |
| `CNAME` | alias hacia otro nombre |
| `HTTPS` / `SVCB` | parámetros modernos del servicio y alternativas |
| `TXT` | verificación y políticas de correo, entre otros |

Un CDN suele responder con una dirección cercana o adecuada para la red del usuario. El TTL define por cuánto tiempo puede conservarse una respuesta DNS, aunque cada capa puede aplicar límites propios.

Optimizar DNS solo importa cuando hay dominios nuevos. Añadir muchos orígenes de terceros aumenta búsquedas, conexiones, privacidad expuesta y puntos de fallo.

```html
<link rel="dns-prefetch" href="//cdn.example.com">
<link rel="preconnect" href="https://cdn.example.com" crossorigin>
```

`preconnect` adelanta DNS y conexión, pero consume recursos; resérvalo para pocos orígenes críticos que realmente se usarán pronto.

## 4. Abrir una conexión segura

### HTTP/1.1 y HTTP/2 sobre TCP

TCP establece una conexión confiable. HTTPS añade un handshake TLS para autenticar el servidor y acordar cifrado. Certificados, SNI, ALPN y reanudación de sesión forman parte de esta negociación.

### HTTP/3 sobre QUIC

HTTP/3 utiliza QUIC sobre UDP e integra seguridad. Reduce algunos costos de conexión y evita que la pérdida de un paquete bloquee todos los streams de la misma conexión como puede ocurrir a nivel TCP.

| Versión | Transporte | Multiplexación | Característica práctica |
| --- | --- | --- | --- |
| HTTP/1.1 | TCP | limitada; varias conexiones | texto, una respuesta activa por conexión sin pipelining práctico |
| HTTP/2 | TCP | varios streams | compresión de headers y multiplexación |
| HTTP/3 | QUIC/UDP | varios streams independientes | mejor comportamiento ante pérdida y cambios de red |

La versión negociada no cambia la semántica de `GET`, headers o status. Cambia cómo se transportan los mensajes.

Una conexión puede reutilizarse para muchos recursos. Por eso Navigation Timing puede mostrar duración DNS o conexión igual a cero: no significa necesariamente que no exista DNS/TLS, sino que ya estaba resuelto.

## 5. Construir la request HTTP

Una request contiene método, destino, headers y, para algunas operaciones, body.

```http
GET /guides/http?page=2 HTTP/1.1
Host: docs.example.com
Accept: text/html,application/xhtml+xml
Accept-Encoding: gzip, br
Accept-Language: es-CO,es;q=0.9
Cookie: session=...
User-Agent: ...
```

### Métodos

| Método | Intención | Seguro | Idempotente | Body habitual |
| --- | --- | --- | --- | --- |
| `GET` | leer representación | sí | sí | no |
| `HEAD` | headers de un GET sin body | sí | sí | no |
| `POST` | crear o ejecutar acción | no | no necesariamente | sí |
| `PUT` | reemplazar recurso conocido | no | sí | sí |
| `PATCH` | modificar parcialmente | no | depende del contrato | sí |
| `DELETE` | eliminar | no | debería serlo | opcional |
| `OPTIONS` | capacidades y preflight CORS | sí | sí | no habitual |

“Seguro” significa que no debería cambiar estado de negocio; “idempotente” significa que repetir la misma operación produce el mismo efecto final. Una request idempotente todavía puede generar logs, métricas o costos.

No realices mutaciones con `GET`: crawlers, prefetch y cachés pueden ejecutarlo sin intención de confirmar una acción.

## 6. Recorrido en infraestructura y servidor

La request puede atravesar varias capas:

1. **CDN o edge:** contenido cacheado, compresión, routing geográfico.
2. **WAF y protección DDoS:** filtra patrones y limita abuso.
3. **Reverse proxy / gateway:** termina TLS, enruta y aplica políticas.
4. **Balanceador:** elige una instancia saludable.
5. **Aplicación:** autentica, autoriza, valida y ejecuta el caso de uso.
6. **Caché de aplicación:** evita trabajo repetido cuando es válido.
7. **Base de datos o servicios:** obtienen o cambian estado.
8. **Serialización:** produce HTML, JSON, archivo o stream.

Cada salto puede agregar latencia, timeout y un tipo de error. Usa un request id o trace id para seguir una operación entre servicios sin registrar secretos.

### Tiempos del servidor

El Time to First Byte combina red hasta el servidor, colas, procesamiento y regreso del primer byte. Un TTFB alto no demuestra por sí solo que la base de datos sea lenta; hay que medir cada segmento.

El header `Server-Timing` permite exponer duraciones controladas a DevTools y Performance API:

```http
Server-Timing: db;dur=32, app;dur=48, cache;desc="miss"
```

No expongas nombres internos o detalles sensibles innecesarios.

## 7. La response

```http
HTTP/1.1 200 OK
Content-Type: text/html; charset=utf-8
Content-Encoding: br
Cache-Control: no-cache
ETag: "page-v42"
Content-Security-Policy: default-src 'self'

<!doctype html>...
```

### Familias de status

| Rango | Significado | Ejemplos |
| ---: | --- | --- |
| `1xx` | información provisional | `100`, `103` |
| `2xx` | operación aceptada o completada | `200`, `201`, `204`, `206` |
| `3xx` | redirección o caché | `301`, `302`, `304`, `307`, `308` |
| `4xx` | problema atribuible a la request | `400`, `401`, `403`, `404`, `409`, `422`, `429` |
| `5xx` | servidor o upstream no pudo responder | `500`, `502`, `503`, `504` |

| Status | Uso habitual |
| ---: | --- |
| `200 OK` | respuesta normal con body |
| `201 Created` | recurso creado; puede incluir `Location` |
| `202 Accepted` | trabajo aceptado pero aún no terminado |
| `204 No Content` | éxito sin body |
| `206 Partial Content` | rango parcial, común en media |
| `304 Not Modified` | usa la representación cacheada; sin body nuevo |
| `400 Bad Request` | sintaxis o entrada inválida |
| `401 Unauthorized` | falta autenticación válida |
| `403 Forbidden` | identidad conocida sin permiso |
| `404 Not Found` | recurso inexistente o deliberadamente oculto |
| `409 Conflict` | conflicto con el estado actual |
| `422 Unprocessable Content` | estructura válida con errores semánticos |
| `429 Too Many Requests` | límite excedido; puede incluir `Retry-After` |
| `500 Internal Server Error` | fallo no esperado |
| `502 Bad Gateway` | respuesta inválida de upstream |
| `503 Service Unavailable` | indisponibilidad temporal |
| `504 Gateway Timeout` | upstream excedió el tiempo |

No devuelvas `200` para todos los resultados. El status permite a clientes, cachés, proxies y observabilidad entender la operación.

## Headers importantes

| Área | Headers frecuentes |
| --- | --- |
| tipo y tamaño | `Content-Type`, `Content-Length` |
| compresión | `Accept-Encoding`, `Content-Encoding` |
| caché | `Cache-Control`, `ETag`, `Last-Modified`, `Vary`, `Age` |
| negociación | `Accept`, `Accept-Language` |
| autenticación | `Authorization`, `WWW-Authenticate`, `Cookie`, `Set-Cookie` |
| rango | `Range`, `Accept-Ranges`, `Content-Range` |
| redirección | `Location` |
| seguridad | `Content-Security-Policy`, `Strict-Transport-Security`, `X-Content-Type-Options` |
| CORS | `Access-Control-Allow-Origin` y familia |
| descarga | `Content-Disposition` |
| referencia | `Referer`, `Referrer-Policy` |

Los nombres de header no distinguen mayúsculas. Algunos son hop-by-hop y no deben reenviarse indiscriminadamente entre proxies.

## Caché HTTP

### Directivas de `Cache-Control`

| Directiva | Significado práctico |
| --- | --- |
| `max-age=N` | frescura en segundos desde navegador/origen |
| `s-maxage=N` | frescura para cachés compartidas |
| `public` | puede almacenarse en caché compartida |
| `private` | solo caché privada del usuario |
| `no-cache` | puede guardar, pero debe revalidar antes de reutilizar |
| `no-store` | no almacenar |
| `immutable` | no cambiará durante su vida fresca |
| `must-revalidate` | no servir stale una vez vencido sin validar |
| `stale-while-revalidate=N` | servir stale mientras actualiza en segundo plano |
| `stale-if-error=N` | permitir stale durante un error |

`no-cache` no significa “no guardar”; significa “revalidar”. Para datos altamente sensibles, revisa `no-store`, historial, Service Worker y cachés intermedias como un conjunto.

### Assets con hash

```http
Cache-Control: public, max-age=31536000, immutable
```

Un archivo como `app.a1b2c3.js` puede cachearse por largo tiempo porque un cambio genera otra URL.

### HTML cambiante

```http
Cache-Control: no-cache
ETag: "home-v42"
```

En la siguiente navegación:

```http
If-None-Match: "home-v42"
```

Si no cambió:

```http
HTTP/1.1 304 Not Modified
ETag: "home-v42"
```

El navegador reutiliza el body existente. `Last-Modified` y `If-Modified-Since` ofrecen otra validación, menos precisa que un ETag bien definido.

### `Vary`

```http
Vary: Accept-Encoding, Accept-Language
```

Indica qué headers cambian la representación. `Vary: *` impide reutilización normal; variar por cookies o demasiados headers puede fragmentar el caché y reducir su eficacia.

## Compresión y negociación

El cliente anuncia formatos:

```http
Accept-Encoding: gzip, br
Accept: text/html,application/xhtml+xml
```

El servidor selecciona:

```http
Content-Type: text/html; charset=utf-8
Content-Encoding: br
Vary: Accept-Encoding
```

Brotli o gzip reducen HTML, CSS, JS, SVG y JSON. Formatos ya comprimidos como JPEG, WebP, AVIF, video o ZIP suelen ganar poco al recomprimirse en HTTP.

Envía el `Content-Type` correcto y `X-Content-Type-Options: nosniff` cuando corresponda; no confíes en que el navegador adivine contenido ejecutable.

## Redirecciones

| Status | Método en siguiente request | Uso |
| ---: | --- | --- |
| `301` | clientes históricos pueden convertir POST en GET | movimiento permanente |
| `302` | clientes históricos pueden convertir POST en GET | redirección temporal general |
| `303` | cambia a GET | patrón Post/Redirect/Get |
| `307` | conserva método y body | temporal estricta |
| `308` | conserva método y body | permanente estricta |

Cada redirección puede añadir otra vuelta de red. Evita cadenas como HTTP → HTTPS → www → locale cuando el primer salto puede ir directamente al destino.

## 8. Streaming y descubrimiento de recursos

El navegador puede empezar a parsear HTML antes de recibir el documento completo. El preload scanner descubre recursos mientras el parser principal trabaja.

```html
<link rel="stylesheet" href="/styles.css">
<script type="module" src="/app.js"></script>
<img src="/hero.avif" alt="" fetchpriority="high">
```

El orden del HTML, los hints y la prioridad influyen en cuándo se descubren y solicitan recursos. No marques todo como prioridad alta: la prioridad solo tiene sentido por comparación.

## 9. HTML, CSS y JavaScript

### HTML → DOM

El parser convierte tokens en nodos. HTML inválido puede ser reparado de forma distinta a la estructura que imaginabas; revisa el DOM final en DevTools.

### CSS → CSSOM

Las hojas de estilo aplicables participan en el CSSOM y suelen bloquear el primer render para evitar pintar una página sin estilos. Divide por necesidad real, elimina CSS no usado y evita imports en cascada.

### Scripts

| Tipo | Bloquea parser | Orden | Momento |
| --- | --- | --- | --- |
| clásico sin atributo | **sí** | documento | al encontrarlo |
| clásico `defer` | no | conserva orden | después de parsear, antes de `DOMContentLoaded` |
| clásico `async` | no | orden de descarga | al terminar de descargar |
| módulo | no por defecto | grafo y dependencias | diferido por defecto |
| módulo `async` | no | al estar listo | no espera orden normal |

```html
<script src="/legacy.js" defer></script>
<script type="module" src="/app.js"></script>
```

Un script puede bloquear el hilo principal aunque se descargue de forma asíncrona. `async` y `defer` cambian descarga/ejecución respecto al parser, no vuelven barato el trabajo ejecutado.

## 10. Critical Rendering Path

```text
DOM + CSSOM
      ↓
render tree
      ↓
layout
      ↓
paint
      ↓
composite
```

| Paso | Decide |
| --- | --- |
| DOM | estructura y contenido |
| CSSOM | reglas y valores calculados |
| render tree | qué cajas visibles participan |
| layout | tamaño y posición |
| paint | píxeles de texto, fondos, bordes y sombras |
| composite | combinación de capas en pantalla |

Cambiar texto, clases o estilos puede invalidar parte de este trabajo. Propiedades geométricas suelen provocar layout; colores y sombras pueden requerir paint; `transform` y `opacity` pueden resolverse mediante composición cuando la capa está disponible.

No agregues `will-change` indiscriminadamente: promover capas consume memoria y puede empeorar el rendimiento.

## 11. Imágenes, fuentes y contenido diferido

- Una imagen sin dimensiones conocidas puede producir cambios de layout; define `width`/`height` o `aspect-ratio`.
- `loading="lazy"` es adecuado para imágenes fuera del primer viewport, no para el elemento LCP principal.
- `srcset` y `sizes` evitan descargar una imagen mayor de lo necesario.
- Las fuentes pueden bloquear texto o cambiar métricas; usa formatos modernos, subconjuntos y una estrategia de `font-display`.
- Un iframe o script de terceros puede abrir nuevas conexiones y ejecutar trabajo no controlado.

## 12. Estados y eventos del documento

| Estado/evento | Qué garantiza |
| --- | --- |
| `readyState: 'loading'` | parser todavía trabaja |
| `readyState: 'interactive'` | DOM parseado |
| `DOMContentLoaded` | DOM parseado y scripts diferidos ejecutados |
| `readyState: 'complete'` | documento y subrecursos principales terminaron |
| `load` | recursos como imágenes y hojas terminaron o fallaron |
| `pageshow` | documento se muestra, incluso desde back-forward cache |

`DOMContentLoaded` no espera todas las imágenes. No esperes `load` para conectar una interfaz que solo necesita DOM.

```js
document.addEventListener('DOMContentLoaded', () => {
  document.readyState // 'interactive'
}, { once: true })

window.addEventListener('load', () => {
  document.readyState // 'complete'
}, { once: true })
```

## Navegación completa, SPA y bfcache

Una navegación tradicional reemplaza el documento. Una SPA puede interceptar un enlace, llamar `history.pushState`, obtener datos y cambiar el DOM sin recargar HTML principal.

Aunque no exista recarga completa, la SPA debe conservar:

- URL compartible;
- historial atrás/adelante;
- título y metadatos relevantes;
- foco y anuncio del cambio de vista;
- cancelación de requests anteriores;
- manejo de error y carga;
- render inicial rápido.

La back-forward cache puede conservar una página completa en memoria al navegar y restaurarla. Usa `pageshow`/`pagehide` y evita asumir que todo inicio viene de una carga de red.

## Medir con Navigation Timing

```js
const [navigation] = performance.getEntriesByType('navigation')

const metrics = {
  dns: navigation.domainLookupEnd - navigation.domainLookupStart,
  connection: navigation.connectEnd - navigation.connectStart,
  tls: navigation.secureConnectionStart > 0
    ? navigation.connectEnd - navigation.secureConnectionStart
    : 0,
  ttfb: navigation.responseStart - navigation.requestStart,
  download: navigation.responseEnd - navigation.responseStart,
  domReady: navigation.domContentLoadedEventEnd - navigation.startTime,
  total: navigation.loadEventEnd - navigation.startTime,
  protocol: navigation.nextHopProtocol,
  transferSize: navigation.transferSize,
}

metrics
// por ejemplo:
// {
//   dns: 12,
//   connection: 48,
//   tls: 30,
//   ttfb: 120,
//   download: 25,
//   domReady: 430,
//   total: 780,
//   protocol: 'h2',
//   transferSize: 18420
// }
```

Estas duraciones son del navegador actual, no una verdad universal. Conexiones reutilizadas, caché, privacidad y navegaciones especiales pueden producir ceros o datos limitados.

### Resource Timing

```js
const slowResources = performance
  .getEntriesByType('resource')
  .filter(resource => resource.duration > 500)
  .map(resource => ({
    name: resource.name,
    type: resource.initiatorType,
    duration: Math.round(resource.duration),
    bytes: resource.transferSize,
  }))

slowResources
// recursos que tardaron más de 500 ms
```

Los recursos cross-origin necesitan `Timing-Allow-Origin` para exponer algunas métricas detalladas.

## Leer una waterfall de DevTools

| Fase | Posible causa si es alta |
| --- | --- |
| Queueing/Stalled | demasiadas prioridades o conexiones, límite del navegador |
| DNS Lookup | dominio nuevo o resolución lenta |
| Initial connection | latencia y handshake |
| SSL | negociación TLS y certificados |
| Request sent | body grande o subida lenta |
| Waiting/TTFB | red + cola + servidor |
| Content Download | respuesta grande o conexión lenta |

Revisa también initiator, prioridad, protocol, tamaño transferido, compresión, caché y redirects. Optimizar el segmento equivocado no mejora el resultado.

## Seguridad durante el ciclo

- HTTPS cifra en tránsito, pero no corrige XSS, inyección ni autorización.
- Mixed content puede bloquear recursos HTTP dentro de una página HTTPS.
- CORS controla lectura desde otro origen en navegadores; no autentica ni protege el servidor de requests directas.
- CSP reduce impacto de inyección al limitar fuentes ejecutables.
- Cookies de sesión deben revisar `HttpOnly`, `Secure`, `SameSite`, dominio, path y expiración.
- El servidor debe validar host, método, body, tipo, tamaño, autenticación y autorización.
- Proxies y CDN necesitan límites, timeouts y claves de caché correctas para evitar mezclar respuestas de usuarios.

## Diagnóstico por síntoma

| Síntoma | Revisa primero |
| --- | --- |
| tarda antes del primer byte | redirects, DNS/conexión, CDN, servidor, base de datos |
| HTML llega rápido pero nada se ve | CSS bloqueante, JS síncrono, fuente, render crítico |
| contenido aparece y salta | dimensiones de media, fuentes, contenido insertado tarde |
| carga rápida pero interacción lenta | tareas largas, hidratación, listeners y JavaScript enviado |
| segunda visita no mejora | headers de caché, ETag, hash de assets, service worker |
| solo falla cross-origin | CORS, cookies, credentials, preflight y certificados |
| funciona con recarga pero no al volver | bfcache, estado conservado, `pageshow` y cleanup |

La carga termina técnicamente en `load`, pero la experiencia continúa: interacción, requests posteriores, lazy loading, fuentes y tareas de JavaScript también determinan si la página se siente rápida y estable.
