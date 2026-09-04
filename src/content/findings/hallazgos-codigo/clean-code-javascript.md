---
title: "Clean Code en JavaScript"
description: "Guía para reconocer código JavaScript difícil de mantener y mejorarlo mediante nombres, funciones y estructuras más claras, con ejemplos comparados."
type: resources
order: 4
tags: [javascript, clean-code, buenas-practicas, github, aprendizaje]
url: https://github.com/ryanmcdermott/clean-code-javascript
resourceCategory: learning
personalNote: Léelo como guía de criterio, no como reglamento; varias recomendaciones son discutibles y el propio repositorio lo advierte.
related:
  - findings/hallazgos-codigo/node-best-practices
updatedAt: 2026-08-30
---

> Adaptación de **[Ryan McDermott](https://github.com/ryanmcdermott)** a partir del libro de Robert C. Martin, con licencia MIT. Las traducciones son aporte de la comunidad.

Los conceptos del libro _Clean Code_ de Robert C. Martin, adaptados a **JavaScript** y mostrados con pares de ejemplos: primero una versión problemática, después la mejorada.

## Cuál enlazar

Circulan varias copias del repositorio, y conviene saber cuál es cuál:

| Repositorio                                                                                   | Qué es                                                |
| --------------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| [ryanmcdermott/clean-code-javascript](https://github.com/ryanmcdermott/clean-code-javascript) | **El original**, unas 94.800 estrellas                |
| [devictoribero/clean-code-javascript](https://github.com/devictoribero/clean-code-javascript) | Fork con unas 2.100 estrellas, sin cambios desde 2024 |

Para leer, mejor el original: recibe correcciones y tiene todas las traducciones enlazadas desde su README, incluida la de español.

## Qué cubre

Variables, funciones, objetos y estructuras de datos, clases, principios SOLID, pruebas, concurrencia, manejo de errores, formato y comentarios.

## Cómo leerlo

El propio repositorio avisa de que son **guías, no reglas**, y que llevan décadas de discusión detrás. Dos cautelas prácticas:

- **Contexto sobre dogma.** "Funciones de menos de veinte líneas" es una guía útil hasta que partir una función la hace más difícil de seguir.
- **Cuidado con las abstracciones prematuras.** Varias recomendaciones empujan a extraer y generalizar; hacerlo demasiado pronto crea indirección sin beneficio.

Sirve mejor como vocabulario compartido para revisar código en equipo que como lista de verificación automática.
