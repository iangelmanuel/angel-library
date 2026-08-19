---
title: Chrome DevTools — diagnóstico por panel
description: Elegir el panel correcto para investigar DOM, red, JavaScript, almacenamiento, accesibilidad y rendimiento con evidencia.
category: tools
stack: tools-debugging
order: 1
tags: [devtools, chrome, debugging, network, performance]
related:
  - guides/tools-vite-build
  - guides/core-web-vitals
  - practices/accessibility-checklist
updatedAt: 2026-08-19
---

Las herramientas del navegador permiten observar lo que realmente recibió y ejecutó el cliente. Antes de modificar código, formula una hipótesis y selecciona el panel que puede confirmarla.

| Síntoma | Panel inicial | Evidencia buscada |
| --- | --- | --- |
| Estilo incorrecto | Elements | Regla ganadora, layout, estado y DOM |
| API falla o tarda | Network | URL, método, status, headers, timing y payload |
| Excepción | Sources / Console | Stack trace, scope y source map |
| Interacción lenta | Performance | Tarea larga, render, layout o script responsable |
| Datos persistidos | Application | Cookies, storage, caché y service worker |
| Problema accesible | Elements / Lighthouse | Árbol de accesibilidad y auditoría inicial |

## Network sin adivinar

Activa “Disable cache” solo durante una prueba deliberada. Revisa:

- cola, conexión, **TTFB** (*Time To First Byte* o tiempo al primer byte) y descarga;
- request y response headers;
- redirecciones y preflight CORS;
- iniciador de la solicitud;
- respuesta real, no solo el status.

“Copy as fetch” ayuda a reproducir, pero puede copiar cookies o tokens. Elimina secretos antes de guardar o compartir el comando.

## Breakpoints útiles

Además de una línea de código, puedes detenerte en:

- excepciones capturadas y no capturadas;
- cambios de atributos o subárbol DOM;
- listeners de eventos;
- solicitudes XHR/fetch cuya URL coincida;
- expresiones mediante logpoints sin editar el código.

## Grabar rendimiento

1. Reduce ruido: recarga, cierra extensiones innecesarias y define el flujo.
2. Graba una interacción corta.
3. Busca tareas largas en el hilo principal.
4. Expande scripting, style, layout y paint hasta encontrar el iniciador.
5. Cambia una causa y vuelve a medir en condiciones comparables.

El panel explica una sesión de laboratorio. Para conocer dispositivos y redes reales, compleméntalo con telemetría de campo.

## Referencias

- [Chrome DevTools](https://developer.chrome.com/docs/devtools/)
- [Panel Performance](https://developer.chrome.com/docs/devtools/performance/)

