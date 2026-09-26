---
title: "Jev: qué es un modelo System One"
description: Jev, de TypeSafe, no genera texto — recibe un estado y preguntas tipadas y devuelve decisiones con probabilidades calibradas. Qué es, en qué se diferencia de un LLM, precios, límites y cuándo usarlo.
tags: [jev, typesafe, system-one, clasificacion, decisiones, probabilidades, ia]
sidebar:
  order: 1
draft: false
tool: Jev (TypeSafe)
resourceCategory: Documentación oficial
official: true
website: https://typesafe.ai/
url: https://docs.typesafe.ai/
technologies:
  - agents/jev/jev-primitivas-api
  - agents/jev/jev-sdks-skill
  - agents/jev/jev-confianza-patrones
  - findings/hallazgos-ia/kev
note: Los datos corresponden a jev-1.13.0 (septiembre de 2026). TypeSafe está en acceso anticipado y ajusta precios y límites con frecuencia.
updatedAt: 2026-09-26
---

**Jev** es el modelo insignia de [TypeSafe](https://typesafe.ai/) y el primer **modelo System One**. A diferencia de un LLM, no escribe texto: evalúa **preguntas tipadas** sobre un **estado** y devuelve valores estructurados —una opción, una puntuación o una probabilidad— que el código puede usar directamente para ramificar, ordenar o enrutar.

> Unstructured state in, typed probabilistic decisions out.

El nombre viene de *Pensar rápido, pensar despacio* de Daniel Kahneman: el Sistema 1 es rápido e intuitivo; el Sistema 2, lento y deliberado. Jev se especializa en juicios rápidos y acotados, del tipo que una persona experta haría en unos segundos con el contexto correcto.

## El problema que resuelve

Cuando un programa necesita que un modelo tome una decisión, lo habitual es pedirle a un LLM que «devuelva JSON», parsear el texto y rezar para que el formato sea correcto. Es lento, caro y frágil: el modelo puede inventar una categoría, romper el esquema o dar una respuesta segura cuando no lo está.

Jev invierte el enfoque:

- **Tú defines el espacio de respuestas** (las opciones, los niveles de la rúbrica, la afirmación a comprobar).
- El modelo solo puede responder dentro de ese espacio: **no hay errores de tipo** ni texto que parsear.
- Cada respuesta viene con **probabilidades calibradas** y, en Choice y Score, una **confianza** que dice si conviene actuar.

## LLM frente a System One

| | LLM | Jev (System One) |
| --- | --- | --- |
| Salida | Texto libre | Valores tipados + probabilidades |
| Parseo | Necesario y frágil | No hace falta |
| Entrenamiento | Generar texto plausible | Decisiones calibradas (RLCD) |
| Latencia típica | Segundos | ~100 ms de mediana (70–500 ms) |
| Varias preguntas | Contexto compartido, se contaminan | Se evalúan en paralelo y aisladas |
| Explica su razonamiento | Sí | No |
| Escribe código o respuestas | Sí | No |

TypeSafe afirma que en sus evaluaciones de flujos de trabajo Jev es **193,6× más rápido y 444,6× más barato** que la media de modelos frontera comparados. Son cifras del propio fabricante; su nota de alucinación (0 % de errores de tipo) es una garantía del formato, no una medición de que cada respuesta sea correcta.

## Cómo funciona una petición

```text
estado + preguntas ──(una petición)──▶ Jev ──(una respuesta)──▶ respuestas tipadas
                                        │                        + probabilidades
                                        └ evalúa cada pregunta    + confianza
                                          en paralelo y aislada
```

1. **Estado** (`state`): el material a evaluar. Un string, un objeto JSON o un array de textos.
2. **Preguntas** (`questions`): un mapa de preguntas con nombre, cada una de un tipo — `choice`, `score` o `noul`.
3. **Respuestas** (`answers`): una por pregunta, bajo la misma clave.

Añadir preguntas apenas cambia el tiempo de respuesta y no provoca *context rot*: cada pregunta ve el estado, pero no a las demás preguntas. Ver [primitivas y API](/agents/jev/jev-primitivas-api).

## Preguntas atómicas, composición en código

Jev rinde mejor cuando cada pregunta pide **una sola cosa bien acotada**. Si una decisión requiere razonar mucho o pesa varios factores, se descompone: una pregunta por factor y la combinación se hace en código.

En vez de «puntúa este pitch de startup», pregunta por separado tamaño de mercado, viabilidad técnica y diferenciación, y combínalos con tu fórmula. Cuando cambien las prioridades, cambias un coeficiente, no un prompt.

## Modelo, precio y límites (jev-1.13)

| Dato | Valor |
| --- | --- |
| ID versionado | `jev-1.13.0` |
| Alias | `jev-latest` (estable, por defecto en los SDK) · `jev-preview` (hoy apunta al mismo) |
| Precio | **$0,042 por millón de tokens de entrada**; los tokens de salida son gratis |
| Rate limits | 250.000 tokens/s y 1.200 peticiones/min (ajustándose dinámicamente) |
| Contexto | 64k tokens por petición; 32k para `state` + la pregunta más larga |
| Entrada | Solo texto: string, objeto JSON o array. Sin imágenes, audio ni vídeo |
| Idioma | Entrenado sobre todo en inglés; otros idiomas funcionan con menos precisión |

Un alias se mueve cuando sale una versión nueva y las respuestas pueden cambiar sin tocar tu código. Si ajustaste umbrales de confianza contra una versión, fija su ID (`jev-1.13.0`) y migra cuando decidas. `GET /v1/models` lista los modelos disponibles para tu cuenta.

### Personalización y datos

Jev no se ajusta (fine-tune ni LoRA) con datos de clientes: todas las cuentas usan los mismos pesos. Se adapta a tu dominio desde la petición —contenido propio en `state`, reglas en `instructions` y `criteria`— y descomponiendo decisiones. TypeSafe declara que no entrena con las peticiones ni respuestas de clientes; hay retención cero (ZDR) para clientes enterprise.

## Cuándo usar Jev

- Enrutar una petición a uno de varios destinos y saber cuán seguro es ese enrutado.
- Puntuar algo en una rúbrica (urgencia, calidad, riesgo) y ramificar según el número.
- Comprobar si una afirmación es cierta sobre un documento antes de ejecutar una acción.
- Sustituir un prompt frágil que pide JSON a un LLM.
- Clasificación, triage de soporte, cribado, re-ranking de resultados, guardrails, detección de fraude, bucles de decisión dentro de un agente.

## Qué no es

Jev **no** es un modelo para Claude Code, Cursor, Codex u OpenCode: no hay un `model: "jev-latest"` que convierta tu agente de código en uno impulsado por Jev. Lo que sí puedes hacer es usar tu agente de código para **escribir** software que llame a Jev, con ayuda de la [skill oficial](/agents/jev/jev-sdks-skill).

Tampoco sirve para generar texto, contar, hacer aritmética ni comparar fechas: ver los límites conocidos en [confianza, patrones y límites](/agents/jev/jev-confianza-patrones).

## Cómo empezar

1. Abre el [Playground](https://console.typesafe.ai/playground), pega un texto como estado y añade preguntas.
2. Crea una API key en la [consola](https://console.typesafe.ai/keys).
3. Llama a `POST https://api.typesafe.ai/v1/systemone` o usa el SDK de [Python o JavaScript](/agents/jev/jev-sdks-skill).

El registro se pausa de vez en cuando durante el acceso anticipado.

## Alternativa local

[Kev](/findings/hallazgos-ia/kev) es una familia de modelos de código abierto que imita la arquitectura y la API de Jev y se ejecuta en tu máquina.

## Fuentes

- [Introducing System One Models & Jev](https://typesafe.ai/blog/introducing-system-one-models-and-jev) — anuncio oficial
- [Documentación](https://docs.typesafe.ai/) · [Índice para LLMs](https://docs.typesafe.ai/llms.txt)
- [System One](https://docs.typesafe.ai/concepts/system-one) · [Estado](https://docs.typesafe.ai/concepts/state) · [Modelos](https://docs.typesafe.ai/models)
- [Jev con agentes de código](https://docs.typesafe.ai/introduction/coding-agents)
- [Consola y Playground](https://console.typesafe.ai/) · [Evals](https://evals.typesafe.ai/)
