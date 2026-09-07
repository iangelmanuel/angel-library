---
title: Rendimiento de JavaScript e interacción
description: Reducir tareas largas, hidratación, renders innecesarios y trabajo que empeora INP en dispositivos reales.
type: guides
order: 4
tags: [performance, javascript, inp, rendering]
scope: runtime e interacción
related:
  - performance/performance-fundamentos/core-web-vitals
  - languages/javascript/javascript-runtime-event-loop
  - frontend/astro/astro-islas
  - frontend/nextjs/nextjs-server-client-components
updatedAt: 2026-08-18
---

## El costo no es solo kilobytes

JavaScript debe descargarse, descomprimirse, parsearse, compilarse y ejecutarse. En móviles modestos el costo de CPU puede superar al de red. Mide main thread, tareas largas y memoria, no solo tamaño del bundle.

## Reducir trabajo

- Renderiza HTML en el servidor o durante el build cuando no necesite estado del cliente.
- Hidrata solo componentes interactivos y lo más tarde que permita la UX.
- Divide tareas superiores a unos 50 ms y actualiza la interfaz entre lotes.
- Guarda en caché cálculos caros solo cuando la medición demuestra beneficio.
- Virtualiza listas grandes; para listas pequeñas, la complejidad adicional no compensa.
- Evita listeners globales duplicados y limpia timers, observers y suscripciones.

## Respuesta a una interacción

El usuario necesita feedback inmediato. Cambia el estado visual primero, pospone analytics y trabajo secundario, y mantén handlers pequeños. Debounce sirve para búsquedas o autosave; throttle para eventos continuos. Ninguno reemplaza cancelar requests obsoletas.

## Diagnóstico

1. Reproduce con limitación de CPU y un dispositivo real.
2. Encuentra la interacción lenta en el panel Performance.
3. Identifica script, tarea y función responsables.
4. Elimina trabajo antes de optimizarlo.
5. Compara percentiles de campo después del despliegue.

## Técnicas con criterio

La memoización ayuda cuando una función costosa recibe entradas repetidas y el costo de conservar la caché es menor que recalcular. La virtualización ayuda cuando una lista tiene cientos o miles de filas, pero puede perjudicar accesibilidad si elimina elementos que el usuario espera recorrer. Un Web Worker es útil para parsear o transformar datos pesados sin bloquear la interfaz, pero añade comunicación y serialización.

En React, mide antes de envolver componentes en `memo` o llenar el árbol de `useMemo`: una comparación adicional también cuesta y puede ocultar un flujo de datos confuso. En Astro, reduce islas y usa la directiva de hidratación adecuada. En Next.js, revisa si la interacción realmente necesita cruzar la frontera de Client Component.

## Ejemplo: dividir trabajo

```ts
async function procesarEnLotes(items: Item[], consumir: (item: Item) => void) {
  for (let i = 0; i < items.length; i += 100) {
    for (const item of items.slice(i, i + 100)) consumir(item)
    await new Promise(requestAnimationFrame)
  }
}
```

El patrón permite que el navegador pinte entre lotes. Aun así, no sustituye optimizar el algoritmo: si el trabajo total es innecesario, dividirlo solo reparte el costo. Cancela el proceso cuando la vista deja de existir o la consulta cambia.

## Memoria y limpieza

Un rendimiento bueno también evita fugas. Limpia listeners, observers, intervalos y suscripciones; limita cachés; libera blobs y workers cuando ya no se necesitan. En DevTools compara snapshots antes y después de repetir una navegación: un heap que crece en cada ciclo es una señal para investigar.
