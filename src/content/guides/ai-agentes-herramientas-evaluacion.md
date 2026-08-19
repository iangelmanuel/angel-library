---
title: Agentes, herramientas, guardrails y evaluaciones
description: Diseñar agentes como flujos controlados con herramientas tipadas, permisos mínimos, estados observables y evaluaciones repetibles.
category: ai
stack: ai-agentes
order: 1
tags: [ia, agents, tools, guardrails, evals]
related:
  - guides/ai-prompts-contexto-salidas
  - guides/ai-rag-embeddings
  - guides/ai-sdk-fundamentos
updatedAt: 2026-08-19
---

Un **agente** combina un modelo con instrucciones, estado y herramientas para avanzar hacia un objetivo. El modelo propone acciones; la aplicación decide qué está permitido, ejecuta la herramienta y devuelve el resultado. No se debe confundir autonomía con acceso ilimitado.

## Herramientas como contratos

```ts
const tools = {
  getOrder: {
    input: z.object({ orderId: z.string().uuid() }),
    execute: async ({ orderId }, context) => {
      await requirePermission(context.user, 'orders:read', orderId);
      return orders.findById(orderId);
    },
  },
};
```

La descripción ayuda al modelo a elegir; el esquema valida argumentos; la función ejecutora aplica autenticación, autorización, timeout y auditoría. El modelo nunca sustituye esos controles.

## Workflow antes que bucle abierto

Un **workflow** tiene pasos y transiciones explícitas. Es preferible cuando el proceso se conoce:

```text
clasificar → recuperar datos → preparar propuesta → aprobación humana → ejecutar
```

Un bucle agente más libre es útil cuando no se conoce de antemano qué herramientas harán falta, pero necesita límites:

- máximo de pasos, tokens, tiempo y costo;
- herramientas permitidas por tarea;
- detección de acciones repetidas;
- cancelación con `AbortSignal`;
- estado persistido para reanudar sin repetir efectos;
- aprobación humana antes de pagos, borrados o mensajes externos.

## Memoria

La memoria de una conversación puede dividirse en:

| Memoria | Contenido | Persistencia |
| --- | --- | --- |
| De trabajo | Mensajes y resultados del turno | Contexto actual |
| Resumen | Decisiones y estado compacto | Conversación |
| Perfil | Preferencias confirmadas | Cuenta, con consentimiento |
| Conocimiento | Documentos recuperables | Índice externo |

No guardes cada salida como hecho. Separa afirmaciones del usuario, datos verificados y conclusiones del modelo; permite revisar y eliminar información personal.

## Guardrails

Un **guardrail** es un control antes o después del modelo. Puede validar entrada, detectar datos sensibles, restringir herramientas, moderar contenido o comprobar la forma de salida. La seguridad importante debe ser determinista y ejecutarse alrededor del modelo.

## Evaluaciones

Una **eval** es una prueba repetible del comportamiento de un sistema de IA. Mantén un conjunto con casos normales, bordes, ataques y fallos históricos.

```ts
type EvalCase = {
  input: string;
  expectedCategory: string;
  mustCite?: string[];
  forbiddenActions?: string[];
};
```

Mide por componentes: selección de herramienta, argumentos, resultado final, citas, latencia y costo. Combina reglas exactas, jueces humanos y, cuando sea apropiado, un modelo evaluador calibrado. Compara versiones del prompt, modelo y herramientas antes de desplegar.

## Referencias

- [OpenAI: evaluación de modelos](https://platform.openai.com/docs/guides/evals)
- [OpenAI: prácticas de seguridad](https://platform.openai.com/docs/guides/safety-best-practices)

