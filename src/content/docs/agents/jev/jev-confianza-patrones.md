---
title: "Jev: confianza, patrones de arquitectura y límites"
description: Cómo leer la confianza de Jev y usarla para decidir cuándo actuar, los cuatro patrones oficiales (fan-out, enrutado por confianza, puntuación compuesta, enrutado por intención), cookbooks y los fallos conocidos de jev-1.13.
tags: [jev, typesafe, confianza, patrones, arquitectura, limites, calibracion]
sidebar:
  order: 4
draft: false
tool: Jev (TypeSafe)
resourceCategory: Documentación oficial
official: true
url: https://docs.typesafe.ai/patterns
technologies:
  - agents/jev/jev-introduccion
  - agents/jev/jev-primitivas-api
  - agents/jev/jev-sdks-skill
warnings:
  - El estado es contenido, no instrucciones, pero jev-1.13 no lo trata como hostil por defecto; un texto diseñado para manipular la clasificación puede moverla. Prueba casos adversariales antes de automatizar decisiones sensibles.
updatedAt: 2026-09-26
---

Jev está pensado para vivir **dentro** de un sistema: el código manda y Jev toma decisiones estrechas y estructuradas. La habilidad clave es pensar en decisiones atómicas que se componen en comportamiento complejo.

## Probabilidad y confianza

Choice y Score devuelven `probabilities` (una distribución que suma 1) y `confidence`, un número de 0 a 1 que resume la **forma** de esa distribución:

- concentrada en una opción → confianza alta;
- repartida → confianza baja (a menudo ninguna opción encaja bien, o la pregunta es ambigua).

Para Choice con K opciones, la confianza se calcula como `(p_max − 1/K) / (1 − 1/K)`: 0 si todo es uniforme, 1 si una opción tiene toda la probabilidad. Noul no trae `confidence`: su valor ya es una probabilidad.

La calibración se mide sobre grupos de predicciones: significa que, de muchas respuestas con 0,9, alrededor del 90 % acierta. **No garantiza** que una respuesta concreta sea correcta.

### «No lo sé» es una señal útil

Un sistema que no puede expresar incertidumbre no es fiable. La confianza permite que el código se comporte distinto según lo seguro que esté el modelo:

| Rango | Comportamiento |
| --- | --- |
| Alta | Actuar automáticamente |
| Media | Proceder con cautela: pedir confirmación, marcar para revisión o recoger más datos |
| Baja | No actuar: pasar a una persona, pedir aclaración o usar otro sistema (por ejemplo, un LLM con razonamiento) |

### Los umbrales dependen del riesgo

No hay un único umbral. En el mismo sistema, una acción de solo lectura puede ejecutarse con menos confianza que una destructiva. TypeSafe sugiere 0,5 como suelo para descartar lo genuinamente incierto y umbrales más altos cuanto más cara sea equivocarse.

```python
from typesafe_sdk import Choice, TypeSafeClient

UMBRALES = {"leer": 0.5, "etiquetar": 0.7, "reembolsar": 0.9}

client = TypeSafeClient(model="jev-1.13.0")  # umbrales ajustados contra esta versión
r = client.system_one(
    state=ticket,
    questions={"accion": Choice(
        instructions="What should the support system do with this ticket?",
        criteria={"leer": "Just log it", "etiquetar": "Tag it for a team", "reembolsar": "Issue a refund"},
    )},
)
a = r.choices["accion"]
if a.confidence >= UMBRALES[a.choice]:
    ejecutar(a.choice)
else:
    enviar_a_revision(ticket, a)
```

## Patrones oficiales

| Patrón | Idea | Beneficio |
| --- | --- | --- |
| **Speculative fan-out** | Enviar muchas preguntas en una llamada, incluso especulativas, y que el código decida cuáles importan | Coste, velocidad |
| **Confidence-gated routing** | Usar la confianza como segundo eje: la respuesta dice *qué*; la confianza, *si actuar* | Fiabilidad, seguridad |
| **Composite scoring** | Partir un juicio complejo en puntuaciones atómicas y combinarlas con pesos en código | Coste, fiabilidad, velocidad |
| **Intent routing** | Clasificar la intención y enviar cada petición al manejador óptimo: lógica determinista, un LLM especialista o una persona | Coste, velocidad |

### Fan-out especulativo

Como el estado se procesa una vez y las preguntas corren en paralelo, preguntar de más cuesta poco. Pregunta todo lo que *podrías* necesitar y usa solo lo que aplique según las respuestas.

### Puntuación compuesta

```python
from typesafe_sdk import Score

niveles = ["weak", "average", "strong"]
preguntas = {
    "mercado": Score(instructions="How large is the addressable market?", criteria=niveles),
    "tecnica": Score(instructions="How feasible is the technical plan?", criteria=niveles),
    "diferenciacion": Score(instructions="How differentiated is the product?", criteria=niveles),
}
r = client.system_one(state=pitch, questions=preguntas)
PESOS = {"mercado": 0.5, "tecnica": 0.3, "diferenciacion": 0.2}
total = sum(PESOS[k] * r.scores[k].score for k in PESOS)
```

Si cambian las prioridades, cambias `PESOS`, no un prompt.

## Cookbooks destacados

La documentación incluye recetas completas y medidas:

| Cookbook | Qué muestra |
| --- | --- |
| Parallel questions | 13 preguntas en una llamada: 12,2× más barato y 10× más rápido, mismas respuestas |
| Re-ranking | Top-1 de 5 % a 18 % y top-10 de 38 % a 62 % sobre shortlists BM25 legales |
| Line-by-line search | Búsqueda semántica sobre 218 líneas con un Choice y un Noul para saber si hay respuesta |
| Guardrails for LLMs | Filtrar cada mensaje de entrada y salida de una app con LLM con una sola petición |
| Function calling | Convertir peticiones en lenguaje natural en llamadas a funciones tipadas |
| Skill suggestion | Elegir como mucho una skill de las 182 del catálogo de Hermes |
| Date extraction | Extraer partes de fechas con Choice y hacer la aritmética en código |
| SDE cascade | Extracción en cascada (mini → verificación → razonamiento) con calidad de modelo grande a fracción del coste |
| Hierarchical classification | Beam search sobre jerarquías profundas usando las probabilidades de Choice |
| Classification using confidence | Clasificar informes SEC en 75 grupos y bajar a la división superior si la confianza es baja |

## Límites conocidos de jev-1.13

TypeSafe publica los «bordes dentados» del modelo (revisado el 17 de septiembre de 2026):

| # | Fallo | Qué hacer |
| --- | --- | --- |
| 1 | **Lectura literal**: responde lo que escribiste, no lo que quisiste decir | Escribe la condición exacta y los casos límite en los criterios |
| 2 | **Matemáticas y números**: no cuenta bien ni compara valores numéricos (hex, RGB) | Haz la aritmética en código; pasa números ya calculados o categorías con nombre |
| 3 | **Fechas y horas**: las lee como texto, no como cantidades ordenadas | Extrae día, mes y año con Choice y compara en código |
| 4 | **Indirección**: dobles negaciones o varios saltos de razonamiento | Pregunta de la forma más directa; nombra la parte relevante del estado |
| 5 | **Estado grande con detalle irrelevante**: el ruido distrae (*context rot*) | Filtra antes en código o con un Noul de relevancia |
| 6 | **Contenido adversarial** | Criterios explícitos y pruebas antes de desplegar |
| 7 | **Instrucciones y criterios contradictorios** | Trata los criterios como extensión de la instrucción |
| 8 | **Invariantes estructurales**: `P(sí)` y `1 − P(no)` de dos preguntas no tienen por qué sumar 1 | No traslades un umbral de un Noul a un Choice; formula cada decisión de una sola manera |
| 9 | **Generación**: no está entrenado para producir texto | Extrae candidatos con regex o un LLM y deja que Jev elija |

Para contar, itera en código y haz una pregunta por elemento:

```python
from typesafe_sdk import Noul

items = ["typesafe", "apple", "california", "banana", "orange"]
r = client.system_one(
    {"items": items},
    {f"item_{i}": Noul(instructions=f"Is `items[{i}]` the name of a fruit?") for i in range(len(items))},
)
frutas = sum(r.nouls[f"item_{i}"].noul > 0.5 for i in range(len(items)))
```

Resumen de lo que conviene evitar: preguntar algo que el código calcula exacto, esconder varios juicios en una pregunta, tareas de «Sistema 2» con muchas capas, y meter en `state` más contexto del que la pregunta necesita.

## Fuentes

- [Confidence](https://docs.typesafe.ai/confidence)
- [Patterns](https://docs.typesafe.ai/patterns) — [Fan-out](https://docs.typesafe.ai/patterns/fan-out), [Confidence routing](https://docs.typesafe.ai/patterns/confidence-routing), [Composite scoring](https://docs.typesafe.ai/patterns/composite-scoring), [Intent routing](https://docs.typesafe.ai/patterns/intent-routing)
- [How to build with TypeSafe](https://docs.typesafe.ai/concepts/how-to-build-with-system-one)
- [Cookbooks](https://docs.typesafe.ai/cookbooks)
- [Jev 1.13 jaggedness](https://docs.typesafe.ai/model-jaggedness/jev-1.13)
