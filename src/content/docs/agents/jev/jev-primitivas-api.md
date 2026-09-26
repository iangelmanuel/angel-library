---
title: "Jev: primitivas (Choice, Score, Noul) y API HTTP"
description: Referencia de la API System One de TypeSafe — endpoint, cuerpo de la petición, los tres tipos de pregunta, la forma de cada respuesta, instrucciones estructuradas y errores.
tags: [jev, typesafe, api, choice, score, noul, http, referencia]
sidebar:
  order: 2
draft: false
tool: Jev (TypeSafe)
resourceCategory: Documentación oficial
official: true
url: https://docs.typesafe.ai/api
technologies:
  - agents/jev/jev-introduccion
  - agents/jev/jev-sdks-skill
  - agents/jev/jev-confianza-patrones
updatedAt: 2026-09-26
---

TypeSafe expone tres **primitivas de IA**. Como las primitivas de un lenguaje, son modulares y componibles: cada una hace un tipo de pregunta y devuelve un tipo de respuesta. Las tres se pueden mezclar en la misma llamada.

| Primitiva | Objetivo | Devuelve |
| --- | --- | --- |
| **Choice** | Elegir una opción de una lista | `choice`, `probabilities`, `confidence` |
| **Score** | Puntuar el estado en una rúbrica ordenada | `score`, `probabilities`, `confidence`, `legend` |
| **Noul** | ¿Es cierta esta afirmación? | `noul` (0–1) |

## Endpoint

```http
POST https://api.typesafe.ai/v1/systemone
Authorization: Bearer <API_KEY>
Content-Type: application/json
```

```bash
curl -X POST https://api.typesafe.ai/v1/systemone \
  -H "Authorization: Bearer $TYPESAFE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "state": "Llevo 3 días intentando conectar Stripe y la integración falla. Estoy perdiendo ventas.",
    "model": "jev-latest",
    "questions": {
      "urgency": { "type": "noul", "instructions": "Does this message express urgency?" }
    }
  }'
```

## Cuerpo de la petición

| Campo | Tipo | Obligatorio | Qué es |
| --- | --- | --- | --- |
| `state` | string \| object \| array | Sí | El contenido a evaluar |
| `model` | string | Sí | `jev-latest`, `jev-preview` o un ID versionado como `jev-1.13.0` |
| `questions` | map<string, Question> | Sí | Preguntas con la clave que tú elijas |

La **clave** de cada pregunta (`urgency`, `department`…) no se envía al modelo ni influye en la inferencia: solo sirve para leer la respuesta.

### El estado

| Formato | Útil para | Ejemplo |
| --- | --- | --- |
| String | Un mensaje o pasaje | `"Me cobraron dos veces."` |
| Objeto | Campos con nombre, registros relacionados, estado de la app | `{"message": "...", "order_id": "A-104"}` |
| Array | Secuencia de mensajes o registros | `["Hola", "Mi cliente es TS1337", "Me cobraron dos veces"]` |

Usa un objeto casi siempre: cada parte tiene nombre y las preguntas pueden referirse a ella. Pon junto todo lo que la decisión necesita comparar (conversación, pedido y política de reembolsos en un mismo estado). El estado lleva el contenido; las preguntas, los juicios.

## Noul — sí o no

Devuelve la probabilidad de que la respuesta sea **sí**.

| Campo | Tipo | Obligatorio |
| --- | --- | --- |
| `type` | `"noul"` | Sí |
| `instructions` | string \| object \| array | Sí |
| `criteria` | `{ "true"?: ..., "false"?: ... }` | No |

```json
{
  "is_urgent": {
    "type": "noul",
    "instructions": "Does this convey urgency?",
    "criteria": {
      "true": "Explicitly time-sensitive",
      "false": "No urgency expressed"
    }
  }
}
```

```json
{ "is_urgent": { "type": "noul", "noul": 0.95 } }
```

Noul no trae `confidence`: la probabilidad ya es la señal. El umbral lo decides tú según el riesgo.

## Choice — elegir una opción

| Campo | Tipo | Obligatorio |
| --- | --- | --- |
| `type` | `"choice"` | Sí |
| `instructions` | string \| object \| array | Sí |
| `criteria` | map<opción, descripción \| null> | Sí — máximo **255 opciones** |

```json
{
  "department": {
    "type": "choice",
    "instructions": "Which team should handle this?",
    "criteria": {
      "billing": "Payments, invoicing, refunds",
      "technical": "Bugs, outages, integrations",
      "sales": "Pricing, upgrades, new accounts"
    }
  }
}
```

```json
{
  "department": {
    "type": "choice",
    "choice": "billing",
    "probabilities": { "billing": 0.88, "technical": 0.12, "sales": 0.0 },
    "confidence": 0.81
  }
}
```

`choice` es la opción más probable; `probabilities` suma 1. Usa `null` cuando la opción se explica sola por su nombre.

## Score — puntuar en una rúbrica

| Campo | Tipo | Obligatorio |
| --- | --- | --- |
| `type` | `"score"` | Sí |
| `instructions` | string \| object \| array | Sí |
| `criteria` | array ordenado de niveles | Sí — mínimo 2, la API acepta hasta **10** |

```json
{
  "frustration": {
    "type": "score",
    "instructions": "How frustrated is the customer?",
    "criteria": ["Calm", "Frustrated", "Very angry"]
  }
}
```

```json
{
  "frustration": {
    "type": "score",
    "score": 1.05,
    "legend": { "0": "Calm", "1": "Frustrated", "2": "Very angry" },
    "probabilities": { "0": 0.0, "1": 0.95, "2": 0.05 },
    "confidence": 0.92
  }
}
```

`score` es la media ponderada por probabilidad y **puede caer entre niveles** (1,05). Los niveles empiezan en 0; `legend` los traduce a su descripción. Úsalo para comparar contra un umbral, no para calcular magnitudes exactas entre niveles.

## Respuesta completa

```json
{
  "model": "jev-1.13.0",
  "answers": {
    "department": { "type": "choice", "choice": "technical", "confidence": 0.78,
                    "probabilities": { "technical": 0.85, "sales": 0.0, "billing": 0.15 } },
    "frustration": { "type": "score", "score": 1.0, "confidence": 1.0,
                     "legend": { "0": "Calm", "1": "Frustrated", "2": "Very angry" },
                     "probabilities": { "0": 0.0, "1": 1.0, "2": 0.0 } },
    "is_urgent": { "type": "noul", "noul": 1.0 }
  },
  "usage": { "input_tokens": 392, "output_tokens": 65 }
}
```

`model` informa el **ID versionado** que respondió aunque pidieras un alias: regístralo junto a cada decisión.

## Instrucciones y criterios estructurados

`instructions`, las opciones de Choice, los niveles de Score y los criterios de Noul aceptan JSON. Para una pregunta con datos de referencia, pon la pregunta en un campo y los datos en otros, y nómbralos entre comillas invertidas:

```json
"instructions": {
  "potential_duplicate": {
    "name": "John Smith",
    "location": "Oakland, California",
    "last_employer": "Google"
  },
  "question": "Is the resume for the same person as `potential_duplicate`?"
}
```

Así la pregunta queda corta y el modelo sabe exactamente a qué parte del estado o de las instrucciones se refiere.

## Varias preguntas en una llamada

Todas las preguntas ven el mismo estado, se evalúan **en paralelo y aisladas**, y la respuesta llega en una sola respuesta. El estado se procesa una vez, así que agrupar preguntas abarata y acelera: en el [cookbook de preguntas en paralelo](https://docs.typesafe.ai/cookbooks/parallel_questions) de TypeSafe, 13 preguntas en una llamada fueron 12,2× más baratas y 10× más rápidas que por separado, con las mismas respuestas.

El presupuesto de contexto: 64k tokens para estado + todas las preguntas; 32k para estado + la pregunta más larga.

## Errores

| Código | Significado |
| --- | --- |
| `401 Unauthorized` | Falta la API key o es inválida |
| `422 Unprocessable Entity` | El cuerpo no pasa la validación (campo obligatorio ausente, pregunta mal formada); el cuerpo indica el campo |
| `429 Too Many Requests` | Superaste el rate limit; reintenta con backoff y respeta `retry-after` si viene |

Los SDK oficiales reintentan con backoff por defecto.

## Listar modelos

```bash
curl https://api.typesafe.ai/v1/models -H "Authorization: Bearer $TYPESAFE_API_KEY"
```

Devuelve `models[]` con `name`, `description` y `release_date`. Hoy lista los alias; los IDs versionados se aceptan aunque no aparezcan.

## Fuentes

- [Referencia de la API](https://docs.typesafe.ai/api)
- [Primitivas](https://docs.typesafe.ai/primitives) — [Choice](https://docs.typesafe.ai/primitives/choice), [Score](https://docs.typesafe.ai/primitives/score), [Noul](https://docs.typesafe.ai/primitives/noul)
- [Estructura avanzada](https://docs.typesafe.ai/primitives/advanced)
- [Estado](https://docs.typesafe.ai/concepts/state) · [Modelos](https://docs.typesafe.ai/models)
- [Quick start](https://docs.typesafe.ai/introduction/quickstart)
