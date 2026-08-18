---
title: Estrategia de carga de CSS, fuentes y scripts
description: Priorizar recursos críticos, reducir bloqueo y evitar que terceros compitan con el contenido principal.
category: performance
order: 3
tags: [performance, css, fonts, javascript, loading]
scope: carga de recursos
related:
  - guides/core-web-vitals
  - guides/http-browser-fundamentals
  - guides/performance-image-optimization
updatedAt: 2026-08-18
---

## Presupuesto de prioridad

El navegador tiene ancho de banda y conexiones limitadas. Prioriza documento, CSS crítico, fuente necesaria y recurso LCP. Analytics, chat, mapas y widgets sociales pueden esperar consentimiento, interacción o tiempo ocioso.

## CSS

- Elimina reglas realmente no usadas y divide CSS por ruta cuando el bundle crece.
- Evita `@import` en hojas porque crea cadenas de descubrimiento.
- Inlineá solo CSS crítico pequeño; demasiado CSS inline impide reutilizar caché.
- Animá `transform` y `opacity` cuando sea posible, sin convertir todo en una capa.

## Fuentes

- Serví WOFF2 y subconjuntos necesarios.
- Usa `font-display` según el costo aceptable de swap.
- Precargá únicamente la fuente crítica exacta; cada preload incorrecto compite con LCP.
- Reducí familias, pesos y variantes antes de microoptimizar.

## JavaScript

`defer` ejecuta scripts clásicos después del parseo y conserva orden. Los módulos ya se difieren. `async` sirve para scripts independientes donde el orden no importa. Divide por ruta o interacción y auditá terceros: un script pequeño puede disparar muchas requests y tareas largas.

## Hints de red

`preconnect` adelanta conexión a un origen crítico; `preload` descarga un recurso conocido de la navegación actual; `prefetch` anticipa una navegación futura de menor prioridad. Usarlos sin medición puede empeorar la carga.

## Leer el waterfall

Busca primero la cadena crítica: documento HTML, CSS que bloquea, fuente o imagen LCP y JavaScript que impide pintar. Una conexión a un dominio de terceros no debería aparecer antes que el contenido propio salvo que sea imprescindible. Si el navegador descubre un recurso tarde, mejora el HTML o el orden de carga antes de añadir más hints.

```html
<link rel="preconnect" href="https://fonts.example.com" crossorigin />
<link
  rel="preload"
  href="/fonts/inter-latin.woff2"
  as="font"
  type="font/woff2"
  crossorigin
  fetchpriority="high"
/>
```

Preload debe coincidir exactamente con el recurso que el navegador usará: URL, `as`, tipo y credenciales. Un preload que no se consume pronto genera una advertencia y compite con recursos más importantes. `fetchpriority="high"` es una señal puntual para el recurso LCP, no una propiedad que se debe aplicar a todas las imágenes.

## Terceros y fuentes

Carga analítica después del consentimiento o cuando el contenido principal ya sea usable. Revisa si un widget agrega iframes, conexiones, tareas largas y listeners aunque no sea visible. Para fuentes, reduce familias y pesos, sirve WOFF2 con caché y considera una pila del sistema si la marca no justifica el costo.

## Estrategia por tipo de página

- Landing: HTML y CSS crítico primero; diferir analítica, chat y mapas.
- Catálogo: imagen principal priorizada; thumbnails lazy y filtros cargados por interacción.
- Aplicación: shell pequeño; hidratar la navegación y los controles necesarios antes de módulos secundarios.
- Blog o documentación: HTML estático y búsqueda diferida; no cargar un framework completo para contenido sin interacción.
