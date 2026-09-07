---
title: Prompts, contexto y salidas estructuradas
description: Diseñar instrucciones verificables, administrar la ventana de contexto y obtener JSON confiable sin depender de frases mágicas.
type: guides
order: 1
tags: [ia, prompts, contexto, structured-outputs, json]
related:
  - ai/ai-fundamentos/ai-fundamentals-terminology
  - ai/ai-sdk/ai-sdk-openai
  - ai/ai-agentes/ai-agentes-herramientas-evaluacion
updatedAt: 2026-08-19
---

Un **prompt** es la entrada completa que condiciona una generación: instrucciones, datos, ejemplos, historial y formato de salida. No es solo la última frase escrita por el usuario. La calidad depende de especificar la tarea y de proporcionar el contexto correcto, no de encontrar palabras misteriosas.

## Estructura útil

```text
Rol y objetivo
  Eres un asistente de soporte. Clasifica el caso y propone una respuesta.

Reglas
  No inventes políticas. Si falta información, marca requiresHumanReview=true.

Datos
  <ticket>...</ticket>
  <policies>...</policies>

Salida
  Devuelve category, priority, reply y requiresHumanReview.
```

Separar instrucciones y datos reduce ambigüedad. Los delimitadores no vuelven confiable un texto externo: ese texto puede contener **prompt injection**, es decir, instrucciones maliciosas que intentan reemplazar las reglas del sistema. Los permisos reales deben imponerse en código.

## Jerarquía y contexto

Los SDK suelen representar mensajes con roles. La instrucción de mayor autoridad define comportamiento; el usuario aporta su objetivo y los datos externos se tratan como contenido no confiable.

La **ventana de contexto** es el máximo de tokens que el modelo puede procesar en una solicitud. Allí compiten instrucciones, historial, documentos y espacio para la respuesta. Enviar más texto no siempre mejora el resultado:

- elimina mensajes repetidos y trazas irrelevantes;
- resume conversaciones largas conservando decisiones;
- recupera solo fragmentos relacionados con la pregunta;
- coloca reglas críticas de forma explícita y estable;
- calcula margen para la salida y para herramientas.

## Salidas estructuradas

Cuando otro programa consume la respuesta, define un esquema y valida el resultado. Pedir “devuelve JSON” no garantiza campos, tipos ni valores permitidos.

```ts
import { z } from "zod"

const Ticket = z.object({
  category: z.enum(["billing", "bug", "question"]),
  priority: z.enum(["low", "medium", "high"]),
  reply: z.string().min(1),
  requiresHumanReview: z.boolean()
})

const parsed = Ticket.safeParse(modelOutput)
if (!parsed.success) {
  // Reintentar con límite, reparar de forma controlada o escalar.
}
```

Si el proveedor ofrece salidas estructuradas basadas en JSON Schema, úsalo y conserva la validación en el límite. El esquema garantiza forma, no verdad: una fecha válida o un identificador con formato correcto todavía puede ser inventado.

## Few-shot y casos límite

**Few-shot prompting** significa incluir pocos ejemplos representativos. Es útil para clasificaciones ambiguas o estilo consistente. Incluye también bordes: datos insuficientes, solicitudes que deben rechazarse y conflictos entre fuentes. No agregues cientos de ejemplos si una regla explícita o un clasificador determinista resuelve el problema.

## Lista de verificación

- Define una tarea observable y un criterio de éxito.
- Indica qué hacer cuando falta información.
- Separa instrucciones de contenido externo.
- Solicita una estructura validable.
- Prueba entradas normales, adversariales y largas.
- Versiona el prompt y evalúa antes de cambiarlo en producción.

## Referencias

- [OpenAI: prompt engineering](https://platform.openai.com/docs/guides/prompt-engineering)
- [OpenAI: structured outputs](https://platform.openai.com/docs/guides/structured-outputs)
