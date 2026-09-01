---
title: "LLMs from Scratch"
description: "Ruta avanzada para construir un modelo de lenguaje similar a GPT con Python y PyTorch, desde sus componentes internos hasta el entrenamiento y ajuste."
type: resources
order: 5
tags: [ia, llm, pytorch, python, deep-learning, aprendizaje]
url: https://github.com/rasbt/LLMs-from-scratch
resourceCategory: learning
personalNote: "La mejor forma de dejar de tratar un modelo como una caja negra; construirlo entero explica de golpe por qué existe la ventana de contexto y qué cuesta cada token."
updatedAt: 2026-08-30
---

> Escrito por **Sebastian Raschka** ([rasbt](https://github.com/rasbt)). Es el repositorio oficial de código de su libro *Build a Large Language Model (From Scratch)*. Unas 104.000 estrellas, en cuadernos de Jupyter.

Repositorio para **desarrollar, preentrenar y ajustar un modelo de lenguaje grande de tipo GPT**, escrito desde cero en PyTorch y explicado paso a paso.

## Qué recorre

El camino completo de un modelo, en orden:

1. Trabajar con datos de texto y construir un tokenizador.
2. Implementar el mecanismo de **atención** desde cero.
3. Montar la arquitectura del modelo GPT.
4. **Preentrenar** con datos sin etiquetar.
5. **Ajuste fino** para clasificación.
6. **Ajuste fino** para seguir instrucciones.

## Por qué merece la pena

Casi todo el material sobre IA enseña a *usar* modelos mediante una API. Este enseña qué hay dentro, y eso cambia decisiones prácticas del día a día: por qué existe un límite de contexto, por qué el coste crece como crece, qué significa realmente hacer *fine-tuning* y en qué se diferencia de dar más contexto.

No hace falta terminar el libro para que rinda. Solo con el capítulo de atención, muchas cosas dejan de ser magia.

## Cómo usarlo

Son cuadernos de Jupyter, pensados para ejecutarse mientras se leen. Se puede seguir sin comprar el libro: el código y las explicaciones del repositorio se sostienen solos, aunque el libro es el hilo narrativo.

Está pensado para correr en hardware modesto: los modelos que se construyen son pequeños a propósito, para que el bucle de aprendizaje sea rápido.

## Qué tener en cuenta

- **Requiere base de Python y algo de PyTorch.** No es un primer contacto con programación.
- **La licencia no es una estándar reconocida** por GitHub, cosa habitual en repositorios que acompañan a un libro. Para leer y aprender no hay problema; para reutilizar el código en un producto conviene revisarla.
