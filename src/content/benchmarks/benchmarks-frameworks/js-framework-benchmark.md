---
title: "js-framework-benchmark"
description: "Benchmark abierto que compara operaciones de renderizado, memoria y tamaño de transferencia en implementaciones de frameworks frontend."
type: resources
order: 2
tags: [benchmarks, frontend, javascript, frameworks, dom, open-source]
url: https://github.com/krausest/js-framework-benchmark
resourceCategory: developer-tools
official: true
personalNote: Es excelente para estudiar el coste de actualizar tablas grandes; no convierte una diferencia sintética en una recomendación automática de framework.
updatedAt: 2026-09-04
---

> **Código y metodología:** [krausest/js-framework-benchmark](https://github.com/krausest/js-framework-benchmark) · **Resultados publicados:** [JS Framework Benchmark](https://krausest.github.io/js-framework-benchmark/)

`js-framework-benchmark` compara cómo distintas bibliotecas y frameworks frontend crean y actualizan una **tabla grande en el DOM**. Separa implementaciones _keyed_ y _non-keyed_, mide memoria y transferencia, y permite inspeccionar el código exacto que produjo cada resultado.

## Quién lo respalda

Es un proyecto comunitario iniciado y mantenido por **Stefan Krause**, no el estudio de una empresa de frameworks. Autores y usuarios proponen implementaciones mediante pull requests; las reglas y un validador buscan que todas resuelvan la misma interfaz.

El respaldo proviene de la continuidad del mantenedor, las contribuciones abiertas, el historial de resultados y un arnés que cualquiera puede ejecutar. No existe un laboratorio neutral que certifique por separado cada envío.

## Cómo hace el benchmark

Un controlador automatiza Chrome, ejecuta cada operación varias veces y extrae tiempos de la línea de rendimiento del navegador. Las pruebas de ejecución incluyen:

- Crear 1.000 o 10.000 filas.
- Reemplazar todas las filas.
- Actualizar cada décima fila.
- Seleccionar, intercambiar y eliminar filas.
- Añadir 1.000 filas a una tabla existente de 10.000.
- Limpiar completamente la tabla.

También registra memoria tras diferentes estados y estima el peso transferido con Lighthouse. Desde versiones modernas del arnés, el resumen usa una media geométrica ponderada para evitar que una sola operación domine el resultado.

La distinción _keyed_ importa: una implementación _keyed_ conserva la identidad de cada fila al reordenarla; una _non-keyed_ puede reutilizar nodos y cambiar su contenido. Son estrategias semánticamente diferentes y sus rankings no deben mezclarse.

## Qué estudia

| Dimensión     | Alcance                                                           |
| ------------- | ----------------------------------------------------------------- |
| Tiempo        | Creación y mutación masiva de una tabla                           |
| Memoria       | Coste inicial, tras crear filas y después de actualizar           |
| Transferencia | JavaScript y demás bytes necesarios para cargar la implementación |
| Corrección    | Cumplimiento de estructura, comportamiento y reglas del proyecto  |

## Credibilidad

**Alta para esta carga sintética concreta**: código, reglas, automatización e implementaciones son públicos; la cobertura de frameworks es amplia y el resultado se vincula a una versión de Chrome.

La clasificación necesita contexto:

- Una tabla de miles de filas no representa formularios, hidratación, navegación ni aplicaciones completas.
- El hardware, sistema operativo y versión de Chrome afectan el resultado.
- La calidad de las implementaciones aportadas no siempre es uniforme; algunas usan atajos que deben leerse en sus notas.
- No mide accesibilidad, experiencia de desarrollo, mantenimiento, ecosistema ni comportamiento en otros navegadores.
- Diferencias pequeñas pueden quedar dentro del ruido de ejecución.

## Cómo usarlo bien

Compara primero dentro del mismo grupo —_keyed_ o _non-keyed_— y la misma versión de resultados. Abre el código de los candidatos y usa las operaciones individuales, memoria y tamaño; la media global oculta intercambios que pueden importar más para tu interfaz.
