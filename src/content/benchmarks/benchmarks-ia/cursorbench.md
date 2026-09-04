---
title: "CursorBench"
description: "Benchmark de Cursor para evaluar agentes de programación con tareas ambiguas y de varios archivos obtenidas de sesiones reales de ingeniería."
type: resources
order: 2
tags: [benchmarks, inteligencia-artificial, agentes, programacion, cursor, llm]
url: https://cursor.com/cursorbench
resourceCategory: ia
official: true
personalNote: Sirve para comparar modelos dentro del agente de Cursor; no traslades su ranking directamente a otro editor, arnés o flujo de trabajo.
updatedAt: 2026-09-04
---

> **Benchmark:** [CursorBench](https://cursor.com/cursorbench) · **Explicación técnica:** [Building CursorBench](https://cursor.com/blog/cursorbench)

CursorBench evalúa cuánto ayuda un modelo cuando actúa como **agente de programación**: explorar un repositorio, comprender una petición incompleta, editar varios archivos y producir una solución correcta sin desperdiciar pasos o tokens.

La tabla pública acompaña la puntuación con **coste, tokens consumidos y pasos**, una distinción importante: dos modelos pueden resolver lo mismo con perfiles de eficiencia muy diferentes.

## Quién lo respalda

Lo desarrolla **Cursor**, producto de **Anysphere**, y el equipo lo utiliza para seleccionar y ajustar los modelos que ofrece en su editor. La empresa aporta las sesiones de ingeniería, el arnés de agente, la infraestructura de ejecución y experimentos con tráfico real para verificar que una mejora fuera de línea también ayude en producción.

Ese vínculo es una fortaleza —prueba exactamente el entorno que Cursor entrega— y a la vez un límite: no es una evaluación independiente del producto que la publica.

## Cómo hace el benchmark

CursorBench combina dos capas:

1. **Evaluación fuera de línea.** Cursor identifica en sesiones reales una solicitud del desarrollador y los cambios que terminaron aceptados en el repositorio. Esa solución sirve como referencia o _ground truth_.
2. **Validación en línea.** Los cambios de modelo o del agente se prueban de manera controlada con uso real para detectar regresiones que el conjunto fijo no captura.

Las tareas son deliberadamente breves o ambiguas y suelen exigir cambios en varios archivos. Muchas proceden de código interno o fuentes controladas, lo cual reduce el riesgo de que el modelo ya haya memorizado la respuesta. El conjunto se renueva por versiones; por eso solo deben compararse resultados obtenidos con la misma versión de CursorBench.

La solución se califica con evaluadores automáticos y agentes jueces que revisan dimensiones como corrección, calidad del código, cumplimiento de instrucciones y eficiencia. El agente se ejecuta en un arnés cercano al producto real, con sus herramientas de búsqueda y edición.

## Qué estudia

- Edición, refactorización y corrección de errores.
- Comprensión de bases de código y localización de fallos.
- Planificación y revisión de código.
- Seguimiento de instrucciones y uso avanzado de herramientas.
- Coste calculado con las tarifas publicadas de entrada, caché y salida.
- Tokens y cantidad de pasos requeridos para completar una tarea.

La página publica un historial de versiones. Las versiones nuevas añaden familias de tareas y mejoran los calificadores, en vez de fingir que una sola batería permanece representativa para siempre.

## Credibilidad

**Alta para medir agentes dentro del entorno Cursor**: las tareas nacen de trabajo real, el arnés se parece al producto, se publican medidas de eficiencia y la evaluación fuera de línea se contrasta con experimentos en producción.

Sus límites impiden tratarlo como ranking universal:

- Cursor diseña el benchmark y vende el producto donde se ejecutan los modelos.
- Los repositorios, tareas completas, soluciones de referencia y señales en línea no son públicos en su totalidad; un tercero no puede reproducir todo el resultado.
- Los jueces automáticos también pueden equivocarse o favorecer ciertos estilos de solución.
- La puntuación depende del arnés, las herramientas y los prompts de Cursor, no solo del modelo base.
- La propia página advierte que diferencias pequeñas pueden no ser estadísticamente significativas.

## Cómo usarlo bien

Úsalo para escoger qué modelo probar en Cursor y para observar el intercambio entre calidad y coste. Después repite tus tareas habituales —lenguaje, tamaño de repositorio, pruebas y reglas del equipo— antes de estandarizar un modelo.
