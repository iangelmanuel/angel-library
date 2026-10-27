---
title: "Algorithms, de Jeff Erickson — libro de algoritmos gratuito en PDF"
description: "Libro universitario de diseño y análisis de algoritmos de la Universidad de Illinois: recursión, programación dinámica, grafos, flujos y NP-dificultad, con pseudocódigo, figuras a color y cientos de ejercicios; PDF gratuito con licencia CC BY 4.0."
tags: [libros, algoritmos, grafos, programacion-dinamica, ciencias-computacion, gratis, pdf, universidad]
sidebar:
  order: 2
draft: false
resourceCategory: learning
official: true
website: https://jeffe.cs.illinois.edu/teaching/algorithms/
url: https://jeffe.cs.illinois.edu/teaching/algorithms/book/Algorithms-JeffE.pdf
github: https://github.com/jeffgerickson/algorithms
technologies:
  - findings/hallazgos-codigo/javascript-algorithms-trekhleb
  - resources/learning/librosgratis-dev
  - courses/cursos-plataformas/cs50x-espanol
note: "Está en inglés. No es una primera introducción: da por sabidas la inducción matemática y las estructuras de datos básicas (pilas, colas, tablas hash, árboles de búsqueda), que el libro no explica."
updatedAt: 2026-10-27
---

> Escrito por **[Jeff Erickson](https://jeffe.cs.illinois.edu/)**, profesor de la Universidad de Illinois en Urbana-Champaign (UIUC). Primera edición de junio de 2019, con licencia Creative Commons Attribution 4.0.

**Algorithms** es el libro que Jeff Erickson escribió a partir de sus apuntes de la asignatura de algoritmos de UIUC. Son 472 páginas sobre cómo **diseñar** algoritmos y **demostrar** que funcionan y cuánto cuestan, con pseudocódigo, figuras a color y una colección grande de ejercicios. El PDF completo es gratuito y también se puede descargar por capítulos.

## Conceptos en dos frases

- Un **algoritmo** es una receta precisa para resolver un problema; el **análisis** de algoritmos estudia cuánto tiempo y memoria consume esa receta según crece la entrada.
- La **programación dinámica** resuelve un problema guardando las soluciones de subproblemas que se repiten, en lugar de recalcularlas.
- Un problema **NP-difícil** es uno para el que no se conoce ningún algoritmo eficiente; saber reconocerlos evita perder tiempo buscando una solución exacta rápida que probablemente no existe.

## Qué contiene

| Capítulo | Tema                                  | Páginas |
| -------- | ------------------------------------- | ------- |
| 0        | Introducción                          | 20      |
| 1        | Recursión                             | 50      |
| 2        | Backtracking                          | 26      |
| 3        | Programación dinámica                 | 62      |
| 4        | Algoritmos voraces                    | 28      |
| 5        | Algoritmos básicos de grafos          | 38      |
| 6        | Búsqueda en profundidad (DFS)         | 32      |
| 7        | Árboles de expansión mínima           | 16      |
| 8        | Caminos mínimos                       | 36      |
| 9        | Caminos mínimos entre todos los pares | 18      |
| 10       | Flujo máximo y corte mínimo           | 26      |
| 11       | Aplicaciones de flujos y cortes       | 26      |
| 12       | NP-dificultad                         | 50      |

La recursión no es un capítulo de paso: todo el libro la usa como herramienta principal de diseño, y la programación dinámica se presenta como "recursión sin repetición".

## Material adicional

Además del libro, la misma página publica apuntes que no entraron en él, con licencia CC BY-NC-SA 4.0:

- **Extended Dance Remix**: temas avanzados ligados al libro, como FFT, matroides, flujos de coste mínimo, programación lineal y algoritmos de aproximación.
- **Director's Cut**: temas que el libro no trata, como hashing, treaps y skip lists, análisis amortizado, splay trees, conjuntos disjuntos y cotas inferiores. Incluye apéndices sobre demostración por inducción y resolución de recurrencias.
- **Models of Computation**: unas 155 páginas sobre autómatas, lenguajes formales y máquinas de Turing.

Si te faltan las estructuras de datos básicas que el libro da por sabidas, el propio autor recomienda _Open Data Structures_ de Pat Morin y _Mathematics for Computer Science_ (Lehman, Leighton y Meyer).

## Formatos y erratas

- **PDF a color**: gratuito, completo o por capítulos. Hay una versión en formato de dos páginas por hoja para imprimir.
- **Papel**: edición en blanco y negro a la venta en Amazon por unos 27,50 USD.
- **Traducción al japonés**, de inzkyk, a la venta en Booth.
- **Erratas**: se reportan como issues en [jeffgerickson/algorithms](https://github.com/jeffgerickson/algorithms/issues). El repositorio no contiene código; es solo el gestor de erratas del libro y los apuntes, y ronda las 8.000 estrellas.

El autor pide expresamente que no le escribas para pedir las soluciones de los ejercicios.

## Cómo aprovecharlo

- **Lee con lápiz.** El libro razona con demostraciones e invariantes; saltárselas es perderse lo que lo distingue de una lista de algoritmos.
- **Combínalo con implementaciones.** El pseudocódigo es deliberadamente abstracto. Para ver los mismos algoritmos escritos en un lenguaje real, [javascript-algorithms de trekhleb](/findings/hallazgos-codigo/javascript-algorithms-trekhleb) es un buen complemento.
- **Haz ejercicios.** Cada capítulo termina con varios; según el prefacio, la mayoría los usó el autor en tareas, prácticas o exámenes, y los marcados con un corazón son especialmente difíciles. No están ordenados por dificultad sino agrupados por técnica.

## Cuándo conviene y cuándo no

**Conviene** si ya programas, conoces las estructuras de datos básicas y quieres aprender a diseñar algoritmos y razonar sobre su corrección: para entrevistas técnicas exigentes, para una asignatura de algoritmos o para entender por qué un problema es difícil.

**No conviene** como primer libro de programación ni si buscas recetas listas para copiar. Para empezar desde cero, un curso como [CS50x](/courses/cursos-plataformas/cs50x-espanol) es mejor punto de partida, y si prefieres leer en español, [librosgratis.dev](/resources/learning/librosgratis-dev) reúne libros gratuitos en ese idioma.

## Fuentes

- [Página oficial del libro](https://jeffe.cs.illinois.edu/teaching/algorithms/)
- [Repositorio de erratas jeffgerickson/algorithms](https://github.com/jeffgerickson/algorithms)
