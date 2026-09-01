---
title: Evaluaciones, observabilidad y costo en aplicaciones de IA
description: Diseñar casos representativos, graders, regresiones y métricas de calidad, latencia y costo para cambiar prompts o modelos con evidencia.
type: guides
order: 2
tags: [ai, evals, quality, observability, cost]
related:
  - ai/ai-fundamentos/ai-fundamentals-terminology
  - ai/ai-agentes/ai-agentes-herramientas-evaluacion
  - ai/ai-prompts/ai-prompts-contexto-salidas
updatedAt: 2026-08-25
---

Una evaluación o **eval** ejecuta entradas conocidas, captura la salida y aplica criterios para decidir si el sistema cumple. Es la prueba de regresión de una función probabilística: no exige que cada frase sea idéntica, sino que las propiedades importantes se mantengan.

## Consulta rápida

| Quiero medir        | Método posible                         |
| ------------------- | -------------------------------------- |
| JSON válido         | parser + schema determinista           |
| cita incluida       | regla o comparación de campos          |
| respuesta correcta  | referencia, rubric o grader revisado   |
| tool call apropiada | inspeccionar nombre y argumentos       |
| seguridad           | casos adversariales + clasificación    |
| experiencia         | revisión humana y métricas de producto |

## Construir el conjunto

Empieza con ejemplos reales y pequeños:

```ts
type EvalCase = {
  id: string
  input: string
  expected: {
    mustMention?: string[]
    forbidden?: string[]
    schema?: string
  }
  tags: string[]
}
```

Incluye caso feliz, entrada ambigua, datos ausentes, idioma, texto largo, intento de inyección y dependencia caída. Etiquetar permite descubrir que el promedio mejora mientras una capacidad crítica empeora.

Separa un conjunto de desarrollo, que orienta cambios, de otro de validación que no se usa para ajustar continuamente. Si cada fallo termina agregado al prompt y al mismo conjunto, el sistema puede sobreajustarse a ejemplos conocidos.

## Tipos de grader

Un **grader** asigna resultado o puntuación. Prefiere el más determinista que pueda medir el requisito:

1. código: schema, igualdad, regex, tool call o cálculo;
2. comparación con referencia cuando existe una respuesta esperada;
3. modelo evaluador con rubric explícita para cualidades semánticas;
4. revisión humana para criterio subjetivo, riesgo o calibración.

Un modelo evaluador también puede equivocarse. Valídalo contra decisiones humanas y oculta información irrelevante como el nombre del modelo candidato para reducir sesgos.

## Comparar un cambio

```text
baseline fijo
  → cambiar una variable: prompt, modelo, tool o retrieval
  → ejecutar mismos casos
  → comparar calidad por tag
  → comparar latencia, tokens, costo y fallos
  → revisar muestras ganadas y perdidas
```

No cambies modelo, prompt y estrategia RAG al mismo tiempo si necesitas saber qué produjo el resultado. Una tasa global no basta: define mínimos para seguridad, formato y tareas de alto impacto.

## Producción y observabilidad

Una traza de IA relaciona request, versión de prompt, modelo, tools, retrieval, latencia, uso y resultado. Registra identificadores y metadata segura, no prompts completos con datos personales por defecto.

Mide al menos:

- éxito y error por operación;
- tiempo al primer token y duración total;
- tokens de entrada/salida y costo estimado;
- número de tool calls y retries;
- rechazo, fallback y cancelación;
- feedback de usuario ligado a una versión.

La monitorización detecta cambios de distribución que un dataset fijo no contiene. Convierte fallos representativos y anonimizados en nuevos casos de evaluación.

## Criterio de salida

Un cambio se publica cuando cumple umbrales de calidad, seguridad, latencia y costo, no solo cuando “suena mejor” en tres prompts manuales. Documenta la configuración evaluada para reproducir el resultado.

## Fuentes y vigencia

- [Evaluaciones de agentes — OpenAI](https://platform.openai.com/docs/guides/agent-evals)
- [Buenas prácticas de evaluación — OpenAI](https://platform.openai.com/docs/guides/evaluation-best-practices)
- [Guía de modelos y migración — OpenAI](https://developers.openai.com/api/docs/guides/latest-model)

Los modelos y sus límites cambian. Conserva un conjunto representativo de evaluaciones y vuelve a ejecutarlo al cambiar modelo, prompt, herramientas o recuperación; modifica una variable a la vez si necesitas atribuir la mejora.
