---
title: "K2 Horizon: modelos abiertos de IFM"
description: Familia de seis modelos de lenguaje de 0.9B a 375B parámetros que publica pesos, checkpoints, datos, recetas, código y evaluaciones para estudiar y reutilizar todo su ciclo de entrenamiento.
type: resources
sidebar:
  order: 6
tags: [ia, modelos-abiertos, llm, agentes, moe, mova, ifm, mbzuai]
website: https://ifm.ai/blog/k2/
url: https://huggingface.co/IFM
github: https://github.com/ifm-ai/horizon-post-train
resourceCategory: ia
official: true
personalNote: El valor de K2 Horizon está tanto en los pesos como en la trazabilidad del entrenamiento; conviene leer las condiciones de cada dataset antes de reutilizar sus datos.
updatedAt: 2026-09-09
---

> Lanzado por el **Institute of Foundation Models (IFM)** de MBZUAI. El anuncio presenta una familia abierta que publica más material que los pesos finales de un modelo.

## Qué se publicó

K2 Horizon reúne seis tamaños para cubrir desde inferencia local hasta servicio distribuido:

| Modelo | Parámetros totales | Parámetros activos | Arquitectura | Uso orientativo |
| --- | ---: | ---: | --- | --- |
| K2-Horizon-0.9B | 0.9B | 0.9B | Densa | dispositivos y pruebas locales |
| K2-Horizon-3.7B | 3.7B | 3.7B | Densa | automatizaciones pequeñas |
| K2-Horizon-7B | 7B | 7B | Densa | asistentes y desarrollo local |
| K2-Horizon-32B | 32B | 32B | Densa | tareas complejas con una sola familia de pesos |
| K2-Horizon-MoVA-36B-A4B | 36B | 4B | MoE + MoVA | capacidad mayor con activación dispersa |
| K2-Horizon-375B-A23B | 375B | 23B | MoE dispersa | servicio de frontera y despliegues multi-GPU |

En una arquitectura **densa** todos los parámetros participan en cada token. En una arquitectura **Mixture of Experts (MoE)** se enruta cada token hacia un subconjunto de expertos; por eso el modelo de 375B puede tener 23B de parámetros activos. **MoVA** (Mixture of Values) aplica una idea de enrutamiento a la parte de valores de la atención y es la variante específica del modelo de 36B.

La liberación incluye pesos finales e intermedios, configuración, arquitectura, código de entrenamiento, datos o referencias a sus fuentes, recetas, registros y evaluaciones. Esa trazabilidad permite estudiar qué cambió entre checkpoints y reproducir partes del proceso, aunque no convierte automáticamente todos los datos en redistribuibles.

## Licencias y responsabilidades

IFM indica que los modelos y el código se publican bajo **Apache 2.0**. Los conjuntos de datos pueden conservar licencias propias, como ODC-BY u otras condiciones de atribución. Antes de entrenar un modelo derivado:

1. revisa la licencia del checkpoint que vas a usar;
2. separa la licencia del código de la licencia de cada dataset;
3. conserva avisos, atribuciones y restricciones de los datos;
4. documenta qué checkpoint y qué receta usaste.

Los pesos abiertos tampoco eliminan los riesgos de privacidad, seguridad o uso indebido. La licencia permite estudiar y adaptar el material, pero el despliegue sigue necesitando evaluación propia.

## Cómo elegir un tamaño

- **0.9B–3.7B:** útiles cuando memoria, latencia o ejecución en el dispositivo son prioritarias. Espera menos margen para instrucciones largas y herramientas complejas.
- **7B:** punto de entrada razonable para experimentar con agentes y tareas de código en una GPU de consumo, según la cuantización y el contexto.
- **32B:** ofrece más capacidad por token, pero exige más memoria y una política clara de cuantización o de ejecución distribuida.
- **36B-A4B:** activa pocos parámetros por token gracias a MoVA/MoE; revisa que el motor de inferencia soporte esa arquitectura.
- **375B-A23B:** está pensado para servidores con varias GPU y no es una opción local solo porque active 23B parámetros.

No elijas por el número total de parámetros. Compara memoria, longitud de contexto, velocidad de generación, soporte del motor y calidad en tus tareas.

## Qué dicen las evaluaciones

El anuncio publica resultados para agentes, uso de terminal, preguntas sobre repositorios, razonamiento científico y tareas generales. Por ejemplo, reporta **70.6 en SWE-bench Verified para 7B** y **68.6 para 3.7B**. Son resultados del protocolo descrito por IFM, no una garantía para cualquier prompt o repositorio.

El propio anuncio documenta una auditoría de *reward hacking* en Terminal-Bench 2.1: la cifra del modelo de 375B-A23B baja de 70.2% a 66.9% al retirar intentos que encontraron respuestas expuestas. Esta advertencia es útil para interpretar el resto de la tabla: las evaluaciones de agentes deben comprobar que el modelo resuelve la tarea y no encuentra un atajo en el entorno.

Para una comparación responsable:

- usa el mismo checkpoint, plantilla de chat, herramientas y límite de tokens;
- registra si el modelo tuvo acceso a Internet o a repositorios públicos;
- repite tareas con semillas o varios intentos cuando el benchmark lo permita;
- mide coste, memoria y latencia junto con la exactitud;
- prueba casos de tu producto, no solo la tabla del anuncio.

## Primer recorrido para desarrolladores

1. Empieza por una tarjeta de modelo en [Hugging Face de IFM](https://huggingface.co/IFM) y confirma el nombre exacto del checkpoint.
2. Verifica que tu motor soporte `K2HorizonForCausalLM`, MoE o MoVA según la variante elegida.
3. Prueba primero un modelo denso pequeño y una cuantización conocida.
4. Compara respuestas con y sin herramientas antes de activar acciones en un agente.
5. Si vas a estudiar el post-entrenamiento, revisa el [código de IFM para Horizon](https://github.com/ifm-ai/horizon-post-train) y conserva la versión de los datos y checkpoints.

Los motores y adaptadores cambian a distinta velocidad que los modelos. Una tarjeta puede anunciar soporte para vLLM, SGLang u Ollama, pero la combinación concreta de versión, cuantización, parser de herramientas y hardware debe verificarse en la fecha del despliegue.

## Límites que conviene recordar

- Un modelo de 0.9B no ofrece la misma robustez que uno grande solo por pertenecer a la misma familia.
- Los resultados publicados no sustituyen una evaluación de seguridad, sesgo, privacidad y alucinaciones.
- MoE reduce los parámetros activos por token, pero no necesariamente la memoria total del checkpoint ni la complejidad de servirlo.
- La apertura de recetas y datos mejora la investigación, pero la reproducción completa puede exigir hardware y dependencias que no están disponibles en un portátil.
- Los nombres, tarjetas y adaptadores pueden cambiar; fija versiones al documentar un despliegue.

## Fuentes

- [Anuncio oficial de K2 Horizon](https://ifm.ai/blog/k2/)
- [Modelos publicados por IFM](https://huggingface.co/IFM)
- [Código de post-entrenamiento de Horizon](https://github.com/ifm-ai/horizon-post-train)
