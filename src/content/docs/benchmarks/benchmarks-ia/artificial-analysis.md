---
title: "Artificial Analysis"
description: "Plataforma independiente para comparar modelos y proveedores de IA por capacidad, velocidad, latencia, precio y calidad en distintas modalidades."
type: resources
order: 1
tags:
  [benchmarks, inteligencia-artificial, llm, agentes, inferencia, rendimiento]
url: https://artificialanalysis.ai/
resourceCategory: ia
official: true
personalNote: Úsalo para reducir candidatos, no para declarar un ganador universal; revisa la evaluación concreta y sus límites antes de tomar una decisión.
updatedAt: 2026-09-04
---

> **Benchmark:** [Artificial Analysis](https://artificialanalysis.ai/) · **Metodología:** [documentación oficial](https://artificialanalysis.ai/methodology)

Artificial Analysis compara **modelos, agentes, proveedores de inferencia y hardware de IA**. No se limita a una puntuación: permite contrastar capacidad, precio, velocidad de salida, latencia hasta el primer token y, según la modalidad, preferencia humana o éxito en tareas.

## Qué documenta

| Área                    | Qué permite comparar                                                                 |
| ----------------------- | ------------------------------------------------------------------------------------ |
| Modelos de lenguaje     | Razonamiento, conocimiento, ciencia, código y tareas de agentes                      |
| Proveedores de API      | Precio, latencia, velocidad de generación y rendimiento con solicitudes concurrentes |
| Agentes de programación | Resolución de tareas dentro de repositorios y entornos de terminal                   |
| Imagen, video y audio   | Preferencia humana, fidelidad al prompt, calidad y coste                             |
| Infraestructura         | Aceleradores, nubes y relación entre rendimiento, disponibilidad y precio            |

También publica análisis sobre modelos abiertos, contexto largo, búsqueda, habla y música. Cada tabla debe leerse con su propia metodología: no todas las modalidades usan las mismas muestras ni el mismo sistema de puntuación.

## Quién lo respalda

Lo opera **Artificial Analysis**, una empresa dedicada a investigación comparativa y asesoría sobre IA. Se presenta como independiente de los laboratorios y proveedores evaluados. Su respaldo práctico consiste en mantener la infraestructura de pruebas, comprar o recibir acceso a APIs, repetir mediciones durante el día y publicar tanto resultados como criterios de evaluación.

Puede usar claves facilitadas por proveedores, pero declara que contrasta el comportamiento observado con el servicio accesible para clientes anónimos. La empresa también vende acceso de datos, estudios y benchmarks personalizados: eso financia el trabajo, aunque conviene conservar presente ese modelo comercial al interpretar su independencia.

## Cómo hace el benchmark

### Capacidad de los modelos

Su **Artificial Analysis Intelligence Index** combina evaluaciones de agentes, programación, razonamiento científico y conocimiento general. La versión se muestra junto al índice porque cambian las pruebas y sus pesos. Entre sus evaluaciones aparecen tareas propias y conjuntos conocidos como Humanity's Last Exam, GPQA Diamond, SciCode y Terminal-Bench.

- Ejecuta los modelos bajo condiciones y prompts normalizados.
- Suele informar resultados `pass@1`: una respuesta por problema, sin escoger retrospectivamente la mejor.
- Repite muestras para reducir el ruido y publica intervalos de confianza cuando corresponde.
- Algunas respuestas se califican con programas deterministas; otras requieren jueces de IA o criterios humanos.

### Rendimiento de las APIs

Mide la experiencia completa desde un servidor de pruebas en Google Cloud, región `us-central1`: tiempo hasta el primer token, tokens por segundo, duración total y coste. Usa prompts nuevos, longitudes de contexto diferentes y ventanas móviles de resultados. Las cargas habituales se repiten varias veces al día; las de contexto muy largo, con menor frecuencia.

### Imagen y otras modalidades

En la arena de imagen presenta resultados lado a lado a evaluadores humanos y estima una clasificación mediante modelos estadísticos de comparación por pares. Mantiene constantes aspectos como prompt, relación de imagen, cantidad generada y resolución máxima cuando la API lo permite.

## Qué estudia

- **Inteligencia general y por dominio**: agentes, código, ciencia, conocimiento y contexto largo.
- **Rendimiento operativo**: latencia, velocidad, coste y comportamiento bajo concurrencia.
- **Preferencia multimodal**: generación y edición de imagen, video, voz y música.
- **Mercado e infraestructura**: disponibilidad de modelos, proveedores, aceleradores y precio.

## Credibilidad

**Alta para comparar candidatos bajo una metodología común**, por la amplitud de proveedores, la frecuencia de actualización y la publicación de métodos, pesos y limitaciones. Es especialmente útil cuando capacidad, velocidad y coste deben evaluarse juntas.

No es una verdad absoluta:

- El índice compuesto depende de evaluaciones y **pesos elegidos por Artificial Analysis**.
- Parte de los conjuntos propios no puede auditarse pregunta por pregunta, para evitar contaminación.
- Un juez de IA o una votación humana introduce preferencias y errores distintos a una prueba determinista.
- La latencia observada desde una sola región no representa a todos los usuarios.
- La mayoría de evaluaciones de lenguaje privilegia texto en inglés y no sustituye una prueba con datos reales del proyecto.

## Cómo usarlo bien

Filtra primero por requisitos duros —modalidad, contexto, precio o proveedor—, compara después las pruebas relacionadas con tu caso y valida los finalistas con una evaluación propia. Una diferencia pequeña en el índice importa menos que fallar en la tarea que realmente necesita tu producto.
