---
title: "WebPageTest"
description: "Servicio de pruebas de rendimiento que carga páginas en navegadores y ubicaciones configurables para analizar métricas, video y cascadas de red."
type: resources
order: 2
tags: [benchmarks, web, rendimiento, core-web-vitals, navegadores, diagnostico]
url: https://www.webpagetest.org/
resourceCategory: developer-tools
official: true
personalNote: Configura ubicación, dispositivo, conexión y varias ejecuciones antes de comparar; una sola corrida de laboratorio puede engañar.
updatedAt: 2026-09-04
---

> **Benchmark:** [WebPageTest](https://www.webpagetest.org/) · **Documentación:** [docs.webpagetest.org](https://docs.webpagetest.org/) · **Código fuente:** [WPO-Foundation/webpagetest](https://github.com/WPO-Foundation/webpagetest) · **Producto:** [WebPageTest by Catchpoint](https://product.webpagetest.org/)

WebPageTest carga una URL en un **navegador, ubicación, dispositivo y perfil de conexión controlados**. Devuelve métricas de laboratorio y, sobre todo, evidencia para investigar: cascada de solicitudes, capturas progresivas, video, uso del hilo principal y diferencias entre primera visita y visita repetida.

## Quién lo respalda

Patrick Meenan creó el proyecto en 2008 y lo publicó para uso comunitario. **Catchpoint** lo adquirió en 2020 y hoy mantiene el servicio, los agentes de prueba, la documentación, la API y los planes comerciales. El código está disponible, aunque su licencia PolyForm Shield impone restricciones y no debe describirse sin matices como software abierto bajo una licencia OSI.

## Cómo hace el benchmark

El usuario fija variables que otros rankings suelen ocultar: URL, ubicación, navegador, tipo de conexión, cantidad de ejecuciones y si se prueba una segunda visita con caché. También puede escribir un guion para iniciar sesión o recorrer una interacción.

- Un navegador real carga la página desde el agente elegido.
- Se registran tiempos de navegación, solicitudes, CPU, composición visual y video.
- Varias ejecuciones permiten escoger una mediana y separar una anomalía de un patrón.
- La vista repetida conserva datos de caché para revelar si la estrategia de almacenamiento funciona.

## Qué estudia

| Evidencia                      | Pregunta que ayuda a responder                                  |
| ------------------------------ | --------------------------------------------------------------- |
| Core Web Vitals de laboratorio | ¿Cuándo aparece el contenido, responde y deja de moverse?       |
| Cascada de red                 | ¿Qué solicitud bloquea y qué terceros cuestan más?              |
| Video y tira de imágenes       | ¿Qué percibe la persona durante la carga?                       |
| Hilo principal y CPU           | ¿JavaScript bloquea la interacción o el renderizado?            |
| Primera y segunda visita       | ¿La caché, compresión y CDN mejoran la experiencia posterior?   |
| Scripts de navegación          | ¿Cómo se comporta un flujo concreto, no solo la página inicial? |

## Credibilidad

**Alta para diagnóstico reproducible de laboratorio**: la configuración queda explícita, usa navegadores reales, conserva evidencia de bajo nivel y permite repetir exactamente una prueba. Es ampliamente útil porque no reduce el rendimiento a una sola nota.

No sustituye datos de usuarios reales:

- Una ubicación y conexión simuladas no representan toda la población.
- El servidor, la caché y servicios externos pueden variar entre ejecuciones.
- Sus métricas de laboratorio no son las métricas de campo de Chrome UX Report, aunque la interfaz pueda mostrar ambas.
- Comparar URLs con configuraciones distintas invalida la conclusión.
- El servicio es mantenido por una empresa que también vende funciones avanzadas.

## Cómo usarlo bien

Guarda la configuración, ejecuta al menos tres corridas —cinco cuando la decisión importa— y compara la mediana. Usa la puntuación para localizar un problema y la cascada, el video y la CPU para explicarlo; confirma el impacto final con datos reales de usuarios.
