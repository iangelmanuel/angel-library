---
title: Mapa de tipos y APIs nativas de JavaScript
description: Índice ordenado para encontrar métodos de String, Number, Math, Array, Object, Map, Set, Date, RegExp, Intl y URL.
category: general
stack: javascript
order: 5
tags: [javascript, methods, built-ins, reference]
scope: mapa de referencia
related:
  - guides/javascript-strings
  - guides/javascript-numbers-math
  - guides/javascript-arrays-objects
  - guides/javascript-objects
  - guides/javascript-collections
  - guides/javascript-date-regexp-intl
  - guides/javascript-url-web-apis
  - guides/javascript-browser-constructors
updatedAt: 2026-08-18
---

## Cómo usar esta sección

Las APIs nativas están separadas por el tipo de problema que resuelven. Cada documento contiene:

1. una definición y un modelo mental;
2. una tabla con retorno y mutación;
3. llamadas con el resultado visible;
4. diferencias entre métodos parecidos;
5. un caso de uso real y errores frecuentes.

## Ruta recomendada

| Orden | Documento | Qué resuelve |
| ---: | --- | --- |
| 1 | Strings | búsqueda, corte, reemplazo y normalización de texto |
| 2 | Number y Math | conversión, validación, redondeo y cálculos |
| 3 | Arrays | transformación, búsqueda, orden y acumulación |
| 4 | Objetos | claves dinámicas, copia, inspección y protección |
| 5 | Map, Set y colecciones débiles | índices, valores únicos y metadatos débiles |
| 6 | Date, RegExp e Intl | fechas, patrones y localización |
| 7 | URL y datos binarios | URLs, parámetros, requests, blobs y codificación |
| 8 | Constructores nativos | mapa de `new`, observers, workers y comunicación |

## Dos preguntas antes de usar un método

- **¿Qué retorna?** Algunos métodos retornan un valor nuevo, otros el elemento eliminado y otros el mismo objeto.
- **¿Muta el original?** `sort`, `reverse`, `splice`, `push` y `Object.assign(target, ...)` cambian datos existentes; `toSorted`, `toReversed`, `toSpliced` y spread crean otra referencia.

Conocer esas dos respuestas evita la mayoría de los errores al trabajar con estado compartido.
