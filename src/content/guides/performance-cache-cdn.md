---
title: Caché, CDN, compresión y estrategia de red
description: Reducir latencia y transferencia mediante caché HTTP, CDN, archivos versionados, compresión y invalidación medible.
category: performance
stack: performance-operacion
order: 1
tags: [performance, cache, cdn, compression, http]
related:
  - guides/performance-resource-loading
  - guides/backend-idempotencia-cache
  - guides/core-web-vitals
updatedAt: 2026-08-19
---

Una **CDN** (*Content Delivery Network* o red de distribución de contenido) mantiene copias cerca de las personas y absorbe parte del tráfico del origen. Solo ayuda cuando la respuesta se puede almacenar y la clave de caché representa correctamente sus variantes.

## Archivos inmutables

Los assets generados suelen incluir un hash de contenido:

```http
GET /assets/app.a81f92.js
Cache-Control: public, max-age=31536000, immutable
Content-Encoding: br
```

Si cambia el archivo, cambia la URL. Esto permite una caché larga sin invalidación manual. El HTML, en cambio, normalmente necesita revalidación o un TTL corto porque apunta a los hashes nuevos.

```http
Cache-Control: public, max-age=0, must-revalidate
ETag: "home-v18"
```

## Clave de caché

Una respuesta puede variar por host, ruta, query, idioma, dispositivo o autorización. Agregar toda cookie a la clave destruye el hit rate; ignorar una cookie de identidad puede filtrar datos. Define explícitamente qué respuestas son públicas, privadas o no almacenables.

`Vary: Accept-Encoding` distingue compresión. `Vary: Accept-Language` puede ser correcto, pero las URLs por idioma suelen ser más observables y cacheables.

## Compresión

- Brotli suele comprimir bien texto estático sobre HTTPS.
- Gzip conserva compatibilidad amplia.
- Imágenes AVIF, WebP, JPEG y video ya están comprimidos; recomprimirlos como HTTP aporta poco.
- Comprime en build o en el edge para no gastar CPU por solicitud.

## Evitar contenido obsoleto

Elige entre invalidar, versionar o aceptar un periodo de obsolescencia. `stale-while-revalidate` permite servir una copia anterior mientras se actualiza, adecuado para contenido tolerante a segundos o minutos de retraso.

## Medir

Observa hit ratio, transferencia evitada, TTFB por región, errores del origen e invalidaciones. Una CDN puede ocultar un origen lento hasta que la caché falla; monitorea ambos caminos.

## Referencias

- [web.dev: caché HTTP](https://web.dev/articles/http-cache)
- [MDN: Cache-Control](https://developer.mozilla.org/docs/Web/HTTP/Reference/Headers/Cache-Control)

