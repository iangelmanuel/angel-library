---
title: "NerfBench"
description: "Monitor de BridgeBench que vuelve a medir los modelos de IA contra su propia puntuación de lanzamiento para detectar si un proveedor los degrada, o «nerfea», después de publicarlos."
tags:
  [benchmarks, inteligencia-artificial, llm, regresiones, programacion, bridgebench]
sidebar:
  order: 3
draft: false
resourceCategory: ia
official: true
url: https://www.bridgebench.ai/nerf-bench
technologies:
  - benchmarks/benchmarks-ia/artificial-analysis
  - benchmarks/benchmarks-ia/cursorbench
  - testing/testing-ai/testing-ai-evals
note: "Lo publica BridgeMind LLC, una empresa privada que financia BridgeBench con patrocinios. Las tareas, las pruebas y las respuestas no son públicas, así que nadie puede reproducir los resultados de forma independiente."
updatedAt: 2026-10-12
---

> **Tablero:** [Nerf Bench](https://www.bridgebench.ai/nerf-bench) · **Metodología:** [The Methodology of NerfBench](https://www.bridgebench.ai/blog/the-methodology-of-nerfbench)

NerfBench responde una pregunta que se repite con cada modelo nuevo: _¿este modelo empeoró desde que salió?_ En la jerga de los videojuegos, «nerfear» es debilitar a un personaje en una actualización; aplicado a la IA, es la sospecha de que un proveedor rebaja un modelo sin anunciarlo, por ejemplo cuantizándolo (reduciendo la precisión numérica de sus pesos para que cueste menos servirlo), cambiando el enrutado o recortando el razonamiento.

En lugar de comparar un modelo con otros, NerfBench compara **cada modelo consigo mismo**: su primera medición queda congelada como 100 % y cada medición posterior se expresa como porcentaje de ese punto de partida.

## Quién lo respalda

Es una herramienta de **BridgeBench**, el sitio de benchmarks de **BridgeMind LLC**. BridgeBench también publica un ranking general de modelos de programación, un Design Bench y un Usage Bench (que sigue cuánto de su asignación inicial conserva cada plan de suscripción). El proyecto se presentó en septiembre de 2026, en plena discusión pública sobre si Claude Opus 5.5 había sido degradado tras su lanzamiento.

## Qué mide

La batería tiene **50 tareas** de programación y razonamiento, todas calificadas automáticamente. Ningún modelo califica el trabajo de otro.

| Categoría              | Tareas | Cómo se califica                    |
| ---------------------- | ------ | ----------------------------------- |
| Corrección de errores  | 15     | Se ejecuta el código contra pruebas |
| Razonamiento sobre código | 10  | Se compara la respuesta             |
| Escritura de código    | 5      | Se ejecuta el código contra pruebas |
| Algoritmos             | 5      | Se ejecuta el código contra pruebas |
| Cadenas de texto       | 5      | Se ejecuta el código contra pruebas |
| Testing                | 5      | Se compara la respuesta             |
| Seguridad              | 3      | Se ejecuta el código contra pruebas |
| SQL                    | 2      | Se compara la respuesta             |

Son 33 tareas de código y 17 de respuesta. Una tarea de código pasa solo si pasan **todas** sus pruebas; una de respuesta, solo si la respuesta normalizada coincide exactamente con la esperada. El código se extrae de la respuesta y se ejecuta en un proceso de Node aparte, con los controles de permisos de Node activos y límites de memoria, salida y tiempo.

El modelo responde cada intento en una sola respuesta, **sin herramientas ni repositorio**. Eso aísla al modelo, pero también significa que no mide el trabajo agéntico (explorar archivos, ejecutar pruebas, iterar) que sí evalúan benchmarks como [CursorBench](/benchmarks/benchmarks-ia/cursorbench).

## Cómo funciona

1. **Sesión.** Una sesión es la batería completa con tres intentos por tarea: 150 intentos independientes. No son reintentos ni se vuelve a muestrear hasta que algo pase.
2. **Referencia.** La primera sesión de un modelo se congela como su 100 %. No se elige el mejor día y la referencia no cambia nunca.
3. **Comparación.** Cada sesión completa posterior es un punto en la gráfica.
4. **Frecuencia.** Al menos tres sesiones por semana por modelo, y más cuando la comunidad denuncia un _nerf_. Por eso los puntos no están espaciados de forma uniforme.

Un fallo de red, un límite de peticiones o un error del servidor no cuentan como respuesta incorrecta: se reintenta hasta cinco veces y, si sigue fallando, la sesión queda incompleta y no se puntúa.

### La métrica: _power_

```text
Power = 100 × (0,6 × S + 0,2 × K + 0,2 × C)

S  corrección: tasa de aciertos frente a la referencia
K  tokens: tokens de salida de la referencia / tokens de la sesión
C  coste: coste de la referencia / coste de la sesión
```

Cada ratio está acotado entre 0 y 2, así que _power_ va de 0 % a 200 %. La corrección pesa el 60 %; los tokens y el coste, el 40 % restante. K y C están invertidos: gastar **menos** tokens o dinero que en la referencia puntúa por encima de 1. Solo cuentan los tokens de salida (incluidos los de razonamiento, si el proveedor los reporta como salida); los de entrada no.

Si falta un dato, su peso se reparte. Codex no reporta coste, así que sus sesiones se puntúan con 75 % corrección y 25 % tokens.

### La banda del 90 % al 110 %

Ninguna sesión da exactamente lo mismo dos veces. Según la metodología, para un modelo que acierta el 70 % de los intentos, el azar por sí solo mueve el _power_ hasta unos 9 puntos en cualquier dirección el 95 % de las veces. Por eso:

- Entre 90 % y 110 % se considera **variación normal**.
- Un resultado fuera de la banda solo se publica si la sesión **anterior** también estaba fuera, del mismo lado, y era completa y comparable. Una sola sesión mala no pone a un modelo en rojo.

### Qué modelo se mide

El mismo modelo puede llegar por caminos distintos y cada camino es una serie propia: **OpenRouter** (con su enrutado por defecto, sin fijar el proveedor de origen ni la temperatura), **Claude Code** (sin herramientas ni configuración local) y **Codex** (con herramientas desactivadas y directorio vacío). Cada serie fija proveedor, modelo y nivel de esfuerzo tras su primera sesión, y guarda un perfil de medición (huellas de la batería y el prompt, versiones del adaptador y la CLI, límite de salida de 65.536 tokens, timeouts). Una sesión con un perfil distinto no se compara con la referencia anterior.

## Cómo leer el tablero

Cada modelo aparece con su fecha de lanzamiento (el día de la referencia), una gráfica de sesiones y una tabla con el _power_ de cada prueba y su diferencia frente al lanzamiento. Una etiqueta resume el estado: **Normal variance** dentro de la banda, o una alerta cuando hay una caída o subida confirmada.

A 9 de octubre de 2026 el tablero seguía **cuatro modelos**, todos dentro de la variación normal:

| Modelo            | Referencia | Última prueba | Frente al lanzamiento |
| ----------------- | ---------- | ------------- | --------------------- |
| Claude Opus 5.5   | 22 sep     | 95,7 %        | −4,3 %                |
| GPT-6 Astra       | 3 sep      | 102,0 %       | +2,0 %                |
| Claude Sonnet 5.5 | 28 sep     | 103,1 %       | +3,1 %                |
| GPT-6.1 Sol       | 1 oct      | 105,5 %       | +5,5 %                |

Opus 5.5 llegó a marcar 94,2 % el 2 de octubre, el punto más bajo de la serie, y BridgeMind lo calificó como variación normal. Estas cifras cambian con cada sesión: consulta el tablero para el estado actual.

Para leerlo bien:

- **Mira la tendencia, no un punto.** Varias sesiones seguidas cayendo hacia el 90 % dicen más que un 94 % aislado.
- **Separa corrección de eficiencia.** Un modelo puede perder _power_ sin fallar más, solo por gastar más tokens; o ganarlo aunque acierte menos, si su precio baja. La metodología dice que esas sesiones se marcan para revisión, pero el número final las mezcla.
- **Compara cada serie solo consigo misma.** Un 105 % de un modelo no es «mejor» que un 98 % de otro: cada uno tiene su propia referencia.

## Credibilidad y límites

**Útil como señal de alerta**, con un diseño más cuidadoso que la impresión subjetiva de «hoy está más tonto»: referencia congelada, calificación determinista sin jueces de IA, tres intentos por tarea, una banda de ruido justificada y confirmación en dos sesiones antes de publicar.

Sus límites:

- **No es reproducible por terceros.** Los prompts, las pruebas y las respuestas se mantienen privados para que no acaben en datos de entrenamiento. Es razonable, pero obliga a confiar en BridgeMind.
- **Muestra pequeña.** 50 tareas y 150 intentos solo detectan caídas grandes; una degradación de unos pocos puntos queda dentro del ruido. Trabajos académicos como [_When LLMs get significantly worse_](https://arxiv.org/abs/2602.10144) usan pruebas estadísticas por muestra para detectar caídas mucho menores.
- **Mide «el modelo tal como se sirve».** Un cambio de enrutado en OpenRouter, del prompt de sistema o del límite de salida cuenta igual que un cambio de pesos. Detecta que algo cambió, no **qué** cambió ni quién lo cambió.
- **El precio entra en la nota.** Una bajada de precio sube el _power_ y una subida lo baja, aunque el modelo sea idéntico.
- **Sesgo hacia programación en una sola respuesta.** Un modelo puede mantenerse estable aquí y empeorar en conversación, escritura o uso de herramientas.
- **Pocos modelos y poco historial.** Empezó en septiembre de 2026 con cuatro modelos; aún no hay series largas que muestren un _nerf_ confirmado.
- **Conflicto de intereses posible.** BridgeMind vende patrocinios y promueve el _vibe coding_; no es una auditoría independiente.

## Cómo usarlo bien

Úsalo como **detector de humo**: si un modelo que usas a diario sale de la banda durante dos sesiones, es motivo para revisar tus propias tareas, no una prueba concluyente. Para decisiones de verdad, combina NerfBench con un conjunto de evaluaciones propio que ejecutes periódicamente contra tu caso de uso (ver [Evals para aplicaciones con IA](/testing/testing-ai/testing-ai-evals)), y con tablas de capacidad y precio como [Artificial Analysis](/benchmarks/benchmarks-ia/artificial-analysis).

## Fuentes

- [Nerf Bench — tablero de resultados](https://www.bridgebench.ai/nerf-bench)
- [The Methodology of NerfBench](https://www.bridgebench.ai/blog/the-methodology-of-nerfbench) (4 de octubre de 2026)
- [When LLMs get significantly worse: A statistical approach to detect model degradations](https://arxiv.org/abs/2602.10144)
