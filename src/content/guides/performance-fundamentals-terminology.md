---
title: "Rendimiento web: fundamentos y terminología"
description: Modelo mental para entender red, renderizado, métricas de usuario, trabajo del hilo principal, caché y presupuestos de rendimiento.
category: performance
stack: performance-fundamentos
tags: [performance, rendimiento, web-vitals, rum, red, renderizado]
order: 1
updatedAt: 2026-08-25
---

El **rendimiento web** es la rapidez con la que una persona puede recibir contenido, comprenderlo e interactuar con él. No equivale solo al tiempo total de carga: una página puede mostrar contenido pronto y bloquearse al pulsar un botón, o terminar de descargar rápido y cambiar de posición mientras se lee.

Optimizar significa identificar el cuello de botella que afecta al usuario, modificarlo y volver a medir. Minificar un archivo pequeño no compensa una imagen enorme, un servidor lento o cinco segundos de JavaScript en el hilo principal.

## Aprende o consulta

La ruta de aprendizaje es: experiencia y métricas → red y recursos → imágenes/fuentes → render y JavaScript → caché/CDN → backend/base de datos → presupuestos y RUM. Optimiza una hipótesis a la vez y conserva una medición antes/después.

| Síntoma | Documento |
| --- | --- |
| LCP, INP o CLS deficientes | [Core Web Vitals](/guides/core-web-vitals) |
| imágenes pesadas o dimensiones incorrectas | [Optimización de imágenes](/guides/performance-image-optimization) |
| CSS, fuentes o scripts bloquean | [Carga de recursos](/guides/performance-resource-loading) |
| interacción lenta o long tasks | [Runtime JavaScript](/guides/performance-javascript-runtime) |
| red repetida o servidor lejano | [Caché y CDN](/guides/performance-cache-cdn) |
| consultas o endpoint lentos | [Backend y base de datos](/guides/performance-backend-database) |
| regresiones después del deploy | [Presupuestos y monitoreo](/guides/performance-budgets-monitoring) |

Una puntuación de laboratorio ayuda a diagnosticar; no representa por sí sola a todos los usuarios. Cruza laboratorio, datos de campo y trazas del servidor antes de atribuir la causa.

## Latencia, ancho de banda y peso

La **latencia** es el tiempo que tarda una comunicación en comenzar o completar un recorrido. El **ancho de banda** es la cantidad de datos que se puede transferir por unidad de tiempo. Una conexión puede tener buen ancho de banda y alta latencia.

Cada recurso implica trabajo:

```text
Descubrir URL → resolver DNS → conectar → negociar TLS → solicitar
             → descargar → descomprimir → analizar → ejecutar o renderizar
```

**DNS** significa *Domain Name System* y traduce dominios a direcciones de red. **TLS** significa *Transport Layer Security* y protege la comunicación. Reutilizar conexiones, reducir orígenes y evitar cadenas de dependencias disminuye esperas.

## Métricas de laboratorio y de campo

Los datos de **laboratorio** se obtienen en un entorno controlado. Permiten repetir una prueba y diagnosticar. Los datos de **campo** provienen de sesiones reales con distintos dispositivos, redes y ubicaciones.

**RUM** significa *Real User Monitoring* o monitoreo de usuarios reales. Responde qué experimentan las personas en producción. Una prueba local rápida no invalida un problema que afecta a teléfonos de gama media en una red móvil.

| Fuente | Ventaja | Limitación |
| --- | --- | --- |
| Laboratorio | Repetible y detallada | Es una simulación concreta |
| Campo o RUM | Representa usuarios reales | Tiene variación y necesita volumen |
| Trazas del servidor | Explican trabajo de backend | No muestran toda la experiencia visual |

## Core Web Vitals

**Core Web Vitals** reúne métricas centradas en experiencia:

- **LCP** (*Largest Contentful Paint*): cuándo aparece el elemento de contenido más grande visible, normalmente el contenido principal inicial.
- **INP** (*Interaction to Next Paint*): cuánto tarda la página en mostrar una actualización visual después de una interacción.
- **CLS** (*Cumulative Layout Shift*): cuánto se desplaza inesperadamente el contenido visible.

Otras métricas complementarias:

- **TTFB** (*Time to First Byte*): tiempo hasta recibir el primer byte de la respuesta.
- **FCP** (*First Contentful Paint*): primer contenido visible renderizado.
- **TBT** (*Total Blocking Time*): tiempo de laboratorio bloqueado por tareas largas después del primer contenido.

Una métrica indica un síntoma, no siempre la causa. Un LCP tardío puede venir del servidor, una imagen sin prioridad, CSS bloqueante o un elemento descubierto mediante JavaScript.

## Ruta crítica de renderizado

El navegador analiza HTML y construye el **DOM** (*Document Object Model*). Analiza CSS y construye el **CSSOM** (*CSS Object Model*). Después combina información para calcular estilos, layout y pintura.

Una hoja de estilos puede bloquear el primer render porque el navegador necesita conocer estilos antes de pintar. Un script clásico sin `defer` puede detener el análisis del HTML. La solución no es aplicar `async` a todo: primero se entiende si el script depende del orden o del DOM.

```html
<!-- Se descarga en paralelo y se ejecuta después de analizar el documento. -->
<script src="/app.js" defer></script>
```

## Hilo principal y tareas largas

JavaScript, cálculo de estilos, layout y parte del renderizado compiten por el **hilo principal**. Una **tarea larga** impide responder con rapidez a entrada del usuario.

```ts
// Procesa el trabajo por partes y devuelve control entre grupos.
async function processItems(items: Item[]) {
  const chunkSize = 100;

  for (let index = 0; index < items.length; index += chunkSize) {
    processChunk(items.slice(index, index + chunkSize));
    await new Promise(requestAnimationFrame);
  }
}
```

Dividir trabajo puede mejorar la capacidad de respuesta, pero no reduce el costo total. Para cálculo intensivo se estudia un Web Worker; para trabajo innecesario se elimina o se traslada al servidor.

## Imágenes y estabilidad visual

Las imágenes suelen ser el recurso más pesado. La optimización combina:

- dimensiones acordes con el espacio visible;
- formatos adecuados como AVIF, WebP, SVG, PNG o JPEG según el contenido;
- compresión visualmente aceptable;
- `srcset` y `sizes` para entregar variantes;
- `width` y `height` para reservar espacio;
- carga diferida solo fuera del contenido inicial.

```html
<img
  src="hero-960.webp"
  srcset="hero-480.webp 480w, hero-960.webp 960w, hero-1440.webp 1440w"
  sizes="(max-width: 640px) 100vw, 960px"
  width="960"
  height="540"
  alt="Panel de métricas del proyecto"
  fetchpriority="high"
/>
```

El navegador usa `srcset` y `sizes` para elegir una variante. Las dimensiones reservan la relación de aspecto y reducen CLS. `fetchpriority="high"` se reserva para un candidato realmente importante, no para todas las imágenes.

## Caché y compresión

La **caché** evita repetir trabajo o transferencias. Un recurso versionado por contenido puede tener una vida larga; un documento HTML suele necesitar revalidación más frecuente.

```http
Cache-Control: public, max-age=31536000, immutable
```

Esta política es apropiada para un archivo como `app.a1b2c3.js`, cuya URL cambia al cambiar el contenido. No es apropiada para una URL estable que debe reflejar cambios inmediatos.

**Brotli** y **gzip** comprimen texto durante la transferencia. No sustituyen la optimización de imágenes ya comprimidas ni reducen el tiempo de ejecutar JavaScript.

## Presupuesto de rendimiento

Un **presupuesto** convierte el rendimiento en una restricción verificable: peso máximo de JavaScript inicial, tamaño de imagen, cantidad de solicitudes o límite de una métrica.

El presupuesto debe vincularse con una experiencia y con datos reales. “Cero dependencias” no es un objetivo útil por sí mismo; “la ruta de compra sigue respondiendo bien en el dispositivo objetivo” sí lo es.

## Método de optimización

1. Define la ruta de usuario y el dispositivo o red de referencia.
2. Mide en producción y reproduce en laboratorio.
3. Localiza si el costo está en servidor, red, carga, hilo principal o renderizado.
4. Corrige primero la causa con mayor impacto.
5. Compara antes y después con la misma metodología.
6. Automatiza un presupuesto para evitar regresiones.

Una puntuación sintética es una señal de diagnóstico. El objetivo sigue siendo que la aplicación responda de manera estable para personas reales.
