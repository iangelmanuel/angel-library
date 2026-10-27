---
title: "Stanford CS336 — Language Modeling from Scratch"
description: "Curso de Stanford que construye un modelo de lenguaje de principio a fin con Python y PyTorch: tokenización, arquitectura, GPU, paralelismo, leyes de escala, datos, inferencia y post-entrenamiento; 18 clases grabadas en YouTube."
tags: [cursos, stanford, ia, llm, pytorch, python, deep-learning, transformers, machine-learning]
sidebar:
  order: 10
draft: false
resourceCategory: learning
official: true
website: https://cs336.stanford.edu/
url: https://www.youtube.com/playlist?list=PLoROMvodv4rMqXOcazWaTUHhq-yembLCV
github: https://github.com/stanford-cs336
technologies:
  - findings/hallazgos-ia/llms-from-scratch
  - ai/ai-fundamentos/ai-fundamentals-terminology
  - courses/cursos-plataformas/nvidia-cursos-gratis-ia
note: "Las clases están en inglés. La pista de audio en español es el doblaje automático de YouTube (generado por IA), no una traducción humana: selecciónala en el engranaje del reproductor, en Pista de audio."
warnings:
  - "Es un curso de posgrado exigente: da por hecho Python fluido, cálculo, álgebra lineal, probabilidad y un curso previo de machine learning."
  - "Los repositorios públicos de las tareas pueden ir por detrás de las clases: el README de la tarea 1 todavía dice Spring 2025. Comprueba en la web qué versión corresponde a la edición que sigues."
updatedAt: 2026-10-27
---

> Curso de **Stanford University**, impartido por **Tatsunori Hashimoto** y **Percy Liang**. Edición de primavera de 2026, publicada por Stanford Online.

**CS336** es la asignatura de Stanford en la que construyes un **modelo de lenguaje desde cero**: no lo usas por API ni ajustas uno ya hecho, sino que escribes el tokenizador, el Transformer y el optimizador, lo entrenas, lo escalas, preparas sus datos y lo alineas. La playlist recoge las 18 clases grabadas de la edición de 2026.

## Conceptos en dos frases

- Un **modelo de lenguaje** (LLM) es una red neuronal entrenada para predecir el siguiente fragmento de texto. ChatGPT o Claude son modelos de lenguaje con mucho trabajo encima.
- La **tokenización** es el paso que convierte texto en números (tokens) que la red puede procesar. Muchas rarezas de los LLM, como contar letras mal, vienen de aquí.
- El **post-entrenamiento** es lo que ocurre después del entrenamiento masivo: ajuste supervisado (SFT) y aprendizaje por refuerzo (RLHF, RLVR) para que el modelo siga instrucciones o razone.
- **PyTorch** es la librería de Python más usada para construir y entrenar redes neuronales. Es el lenguaje de trabajo de todo el curso.

## Qué cubren las clases

| Clases       | Tema                                                                 |
| ------------ | -------------------------------------------------------------------- |
| 1            | Visión general y tokenización                                        |
| 2            | PyTorch (con `einops`) y contabilidad de recursos                    |
| 3–4          | Arquitecturas, hiperparámetros y alternativas a la atención          |
| 5–6          | GPU, TPU, kernels, Triton y XLA                                      |
| 7–8          | Paralelismo para entrenar en varias GPU                              |
| 9 y 11       | Leyes de escala (_scaling laws_)                                     |
| 10           | Inferencia                                                           |
| 12           | Evaluación                                                           |
| 13–14        | Datos: fuentes, filtrado, deduplicación y mezcla                     |
| 15–16        | Mid-training y post-entrenamiento, incluido RLVR                     |
| 17           | Alineamiento y multimodalidad                                        |
| Invitada     | Clase de Dan Fu                                                      |

Cada clase dura entre 1 h 10 min y 1 h 30 min. Las diapositivas y el código de las clases están en el repositorio [stanford-cs336/lectures](https://github.com/stanford-cs336/lectures).

## Las tareas

Lo que diferencia a CS336 de ver vídeos sobre LLM son las cinco tareas, públicas en la [organización de GitHub del curso](https://github.com/stanford-cs336):

1. **Basics**: implementar un tokenizador, la arquitectura Transformer y el optimizador, y entrenar un modelo mínimo.
2. **Systems**: perfilar el modelo, escribir FlashAttention2 en Triton y montar entrenamiento distribuido eficiente en memoria.
3. **Scaling**: estudiar los componentes del Transformer y ajustar una ley de escala consultando una API de entrenamiento.
4. **Data**: convertir volcados en bruto de Common Crawl en datos de preentrenamiento mediante filtrado y deduplicación.
5. **Alignment and Reasoning RL**: ajuste supervisado y aprendizaje por refuerzo para resolver problemas de matemáticas, con una parte opcional sobre DPO.

Son repositorios de la versión para estudiantes, con tests para comprobar tu implementación. La tarea 1, por ejemplo, gestiona el entorno con [uv](https://docs.astral.sh/uv/) y arranca con todos los tests fallando hasta que completas las funciones de `tests/adapters.py`:

```bash
git clone https://github.com/stanford-cs336/assignment1-basics.git
cd assignment1-basics
uv run pytest
```

Los datos de entrenamiento (TinyStories y una muestra de OpenWebText) se descargan aparte; los enlaces están en el README de la tarea. La propia web avisa de que es una asignatura de 5 créditos y muy centrada en la implementación: cuenta con que cada tarea lleve muchas horas.

## Requisitos

Según la web del curso:

- Dominio de Python y experiencia con deep learning y optimización de sistemas.
- Cálculo y álgebra lineal de nivel universitario.
- Probabilidad y estadística básicas.
- Un curso previo de machine learning (CS221, CS229, CS230, CS224N o equivalente).

Si te falta base, [LLMs from Scratch](/findings/hallazgos-ia/llms-from-scratch) de Sebastian Raschka recorre un camino parecido a un ritmo más suave y con modelos más pequeños, y es buena preparación.

## Cómo aprovecharlo

- **Sigue las clases con las tareas al lado.** Ver las 18 clases sin implementar nada te deja una idea general; hacer la tarea 1 te deja entender cómo funciona un LLM por dentro.
- **Usa el doblaje como apoyo, no como sustituto.** El audio en español es automático y la terminología técnica (atención, kernel, scaling law) puede salir mal traducida. Los subtítulos en inglés y las diapositivas ayudan a fijar los términos.
- **Mira las ediciones anteriores.** La web enlaza las de 2024 y 2025, útiles si una clase de 2026 no te queda clara.

## Cuándo conviene y cuándo no

**Conviene** si ya programas en Python, tienes base de machine learning y quieres entender de verdad cómo se entrena un modelo de lenguaje, o si trabajas cerca de infraestructura de IA (inferencia, GPU, datos).

**No conviene** como primer contacto con la IA o con la programación. Para usar modelos en tus aplicaciones no hace falta este nivel: empieza por la [terminología básica de IA](/ai/ai-fundamentos/ai-fundamentals-terminology) o por cursos introductorios como los de [NVIDIA](/courses/cursos-plataformas/nvidia-cursos-gratis-ia).

## Fuentes

- [Web del curso CS336](https://cs336.stanford.edu/)
- [Playlist de la edición de primavera de 2026](https://www.youtube.com/playlist?list=PLoROMvodv4rMqXOcazWaTUHhq-yembLCV) (Stanford Online)
- [Organización stanford-cs336 en GitHub](https://github.com/stanford-cs336)
