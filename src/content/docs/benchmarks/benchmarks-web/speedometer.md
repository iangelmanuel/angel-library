---
title: "Speedometer"
description: "Benchmark colaborativo para medir la capacidad de respuesta de navegadores mediante interacciones simuladas sobre aplicaciones web representativas."
type: resources
order: 1
tags: [benchmarks, web, navegadores, javascript, rendimiento, open-source]
url: https://browserbench.org/Speedometer3.0/
resourceCategory: developer-tools
official: true
personalNote: Cierra otras aplicaciones y repite la prueba; úsala para comparar navegadores en la misma máquina, no para comparar frameworks.
updatedAt: 2026-09-04
---

> **Benchmark:** [Speedometer](https://browserbench.org/Speedometer3.0/) · **Código fuente:** [WebKit/Speedometer](https://github.com/WebKit/Speedometer) · **Metodología:** [About Speedometer 3.0](https://browserbench.org/Speedometer3.0/about.html)

Speedometer mide la **capacidad de respuesta de un navegador al ejecutar aplicaciones web**. Automatiza acciones como crear elementos, editar texto, seleccionar filas y actualizar vistas, y calcula cuánto tarda el navegador en completar el trabajo visible y el asociado al hilo principal.

## Quién lo respalda

Speedometer 3 se gobierna de forma conjunta por representantes de **Blink/V8, Gecko/SpiderMonkey y WebKit/JavaScriptCore**, los motores detrás de las principales familias de navegadores. El proyecto es abierto y su gobernanza exige revisión entre proyectos: los cambios importantes no dependen de un único proveedor.

## Cómo hace el benchmark

Ejecuta interacciones simuladas sobre varias aplicaciones y librerías: implementaciones TodoMVC, editores como CodeMirror y TipTap, gráficos y aplicaciones de noticias construidas con ecosistemas como React/Next.js y Vue/Nuxt.

- Mide la duración de cada interacción y el trabajo síncrono o asíncrono relacionado en el hilo principal.
- Ejecuta varias iteraciones para reducir fluctuaciones.
- Resume los tiempos mediante una media geométrica inversa: **una puntuación mayor significa mejor respuesta**.
- Mantiene el código, las cargas y el sistema de puntuación disponibles en GitHub.

No pretende cronometrar todo lo que hace un navegador. El trabajo concurrente en _workers_, la descarga real por internet, el consumo energético y muchas funciones de la plataforma quedan fuera o solo influyen indirectamente.

## Qué estudia

- Creación, eliminación y modificación de interfaces dinámicas.
- Renderizado y actualización del DOM.
- Ejecución de JavaScript y trabajo del hilo principal.
- Rendimiento de editores, gráficos y aplicaciones con distintos patrones de UI.

## Credibilidad

**Alta como benchmark sintético de respuesta web** por su gobierno entre motores competidores, código abierto, cargas variadas y metodología pública. Al no pertenecer exclusivamente a un navegador, reduce el incentivo de optimizar la prueba para una sola arquitectura.

Sus límites son claros:

- Un equipo caliente, el ahorro de energía, extensiones o procesos en segundo plano alteran el resultado.
- La prueba representa un conjunto finito de aplicaciones; no equivale a navegar por todos los sitios reales.
- Las puntuaciones de versiones mayores distintas no deben compararse sin revisar cambios metodológicos.
- El propio proyecto dice que **no debe utilizarse para comparar frameworks**: mide el conjunto navegador + carga, no productividad, ergonomía ni calidad arquitectónica.

## Cómo usarlo bien

Ejecuta todos los navegadores en el mismo equipo, conectados a corriente, sin otras cargas y con varias repeticiones. Interpreta el resultado junto con memoria, batería, compatibilidad, privacidad y pruebas sobre tu aplicación real.
