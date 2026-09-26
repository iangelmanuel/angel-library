---
title: "Jev: SDK de Python, JavaScript, AI SDK de Vercel y skill para agentes"
description: Cómo llamar a Jev desde código — typesafe-sdk (Python), @typesafe-ai/sdk (JS/TS), el proveedor @ai-sdk/typesafe-ai del AI SDK — y cómo instalar la skill oficial en Claude Code, Codex y otros agentes.
tags: [jev, typesafe, sdk, python, typescript, vercel, ai-sdk, skill, claude-code]
sidebar:
  order: 3
draft: false
tool: Jev (TypeSafe)
resourceCategory: Documentación oficial
official: true
url: https://docs.typesafe.ai/sdk
github: https://github.com/typesafe-ai/skills
technologies:
  - agents/jev/jev-primitivas-api
  - agents/jev/jev-confianza-patrones
  - ai/ai-sdk/ai-sdk-vercel
note: "Versiones de referencia: SDK de JavaScript 0.6.0 (Node.js 20+), SDK de Python para Python 3.10+, @ai-sdk/typesafe-ai 3.x (evaluación experimental)."
updatedAt: 2026-09-26
---

Los SDK oficiales tipan preguntas y respuestas y **reintentan con backoff** por defecto (respetando `retry-after` en los `429`). Todos leen la API key del entorno y usan `jev-latest` si no indicas modelo.

```bash
export TYPESAFE_API_KEY="..."   # créala en https://console.typesafe.ai/keys
```

## Python — `typesafe-sdk`

Requiere Python 3.10 o posterior.

```bash
pip install typesafe-sdk
# o
uv add typesafe-sdk
```

Cliente síncrono:

```python
from typesafe_sdk import Choice, Noul, Score, TypeSafeClient

with TypeSafeClient() as client:
    response = client.system_one(
        state={"document": "I was charged twice. Please fix this ASAP."},
        questions={
            "billing": Noul(instructions="Is this ticket about billing?"),
            "tone": Choice(
                instructions="What is the customer's tone?",
                criteria={"calm": None, "frustrated": None, "angry": None},
            ),
            "urgency": Score(
                instructions="How urgent is this ticket?",
                criteria=["can wait", "this week", "today"],
            ),
        },
    )

print(response.nouls["billing"].noul)
print(response.choices["tone"].choice)
print(response.scores["urgency"].score)
```

Cliente asíncrono, para servidores con `asyncio`:

```python
from typesafe_sdk import AsyncTypeSafeClient, Noul

async def is_billing(text: str) -> float:
    async with AsyncTypeSafeClient() as client:
        r = await client.system_one(
            state=text,
            questions={"billing": Noul(instructions="Is this about billing?")},
        )
    return r.nouls["billing"].noul
```

- `response.answers` tiene todas las respuestas; `nouls`, `choices` y `scores` las separan por tipo con tipos concretos.
- `TypeSafeClient(model="jev-1.13.0")` fija una versión; `base_url` apunta a otro servidor compatible (por ejemplo [Kev](/findings/hallazgos-ia/kev) en local).
- `client.models.list()` lista los modelos.
- Excepciones, reintentos (`RetryPolicy`) y constantes están en la [referencia del SDK](https://docs.typesafe.ai/sdk/python/api).

## JavaScript / TypeScript — `@typesafe-ai/sdk`

Requiere Node.js 20 o posterior. Incluye ESM, CommonJS y declaraciones de TypeScript.

```bash
npm install @typesafe-ai/sdk
```

```ts
import { choice, noul, score, TypeSafeClient } from "@typesafe-ai/sdk"

const client = new TypeSafeClient()

const { answers } = await client.systemOne({
  state: { ticket: "Export button crashes in Safari" },
  questions: {
    category: choice("What kind of ticket?", {
      bug: "Something broken",
      feature: "New feature request"
    }),
    severity: score("How severe?", ["Cosmetic issue", "Workaround exists", "Blocking"]),
    blocking: noul("Does the user say they cannot continue working?")
  }
})

answers.category.choice // "bug" — el tipo se infiere de las opciones
```

Los tipos de las respuestas **se infieren de las preguntas**: `answers.category.choice` solo puede ser `"bug" | "feature"`. Errores tipados: `AuthenticationError`, `RateLimitError`, `UnprocessableEntityError`, `APITimeoutError`, etc.

## AI SDK de Vercel — `@ai-sdk/typesafe-ai`

Vercel publica un proveedor oficial que expone Jev como **modelo de evaluación** del [AI SDK](/ai/ai-sdk/ai-sdk-vercel). La evaluación es experimental.

```bash
pnpm add @ai-sdk/typesafe-ai ai
```

```ts
import { typeSafeAi } from "@ai-sdk/typesafe-ai"
import { experimental_evaluate } from "ai"

const result = await experimental_evaluate({
  model: typeSafeAi.evaluationModel("jev-latest"),
  state: "I was charged twice. Please refund the duplicate.",
  questions: {
    department: {
      type: "choice",
      instructions: "Which team should handle this?",
      criteria: { billing: "Charges and refunds", support: "Other requests" }
    },
    requestsRefund: {
      type: "boolean", // en el AI SDK, Noul se llama "boolean"
      instructions: "Is the customer requesting money back?"
    }
  }
})

console.log(result.answers)
```

Diferencias con el SDK de TypeSafe:

- La variable de entorno es **`TYPESAFE_AI_API_KEY`** (no `TYPESAFE_API_KEY`).
- Noul se escribe `type: "boolean"`.
- La confianza no está en la respuesta: se lee en `result.providerMetadata.typesafe.confidence[questionId]`.
- `createTypeSafeAi({ apiKey, baseURL, headers, fetch })` crea una instancia configurada; la base por defecto es `https://api.typesafe.ai/v1`.
- No hay modelos de lenguaje, embeddings ni imagen en este proveedor: solo evaluación.

Jev también está disponible a través del **Vercel AI Gateway**.

## HTTP directo

Cualquier lenguaje puede llamar a `POST https://api.typesafe.ai/v1/systemone`. Ver [primitivas y API](/agents/jev/jev-primitivas-api). Si lo haces sin SDK, implementa tú el reintento con backoff ante `429`.

## Skill para agentes de código

La skill oficial le da a Claude Code, Codex y otros agentes el contexto completo de la API, las primitivas y los patrones, para que **escriban integraciones con Jev** correctas.

Claude Code (como plugin):

```bash
claude plugin marketplace add typesafe-ai/skills
claude plugin install typesafe@typesafe-ai
```

Otros agentes (Skills CLI):

```bash
npx skills add typesafe-ai/skills --skill typesafe-ai
# añade -g para instalarla globalmente
```

Usa **un solo** método para no duplicarla. Para actualizar: `claude plugin marketplace update typesafe-ai` y `claude plugin update typesafe@typesafe-ai` (luego `/reload-plugins`), o `npx skills update`.

En Claude Code se invoca con `/typesafe:typesafe-ai`; en cualquier agente basta con decir «usa la skill de TypeSafe». Prompts útiles de la documentación:

```text
Using the TypeSafe skill, explore the project and find opportunities for using
intelligent judgement to stand in for complex parsing or other fragile code.
```

```text
Using the TypeSafe skill, run some experiments using the TypeSafe API key that I've
exported to `TYPESAFE_API_KEY`. Propose changes based on the most promising results.
```

Recomendaciones de TypeSafe al trabajar con agentes:

1. Conversa el plan con el agente y revísalo antes de implementar.
2. Pon las constantes (preguntas y umbrales) en un solo sitio: los agentes no escriben buenas preguntas solos, espera editarlas.
3. No aceptes afirmaciones sin comprobar; pide al agente que valide sus supuestos con consultas baratas.

Si el agente no carga la skill, confirma que el instalador apuntó al agente correcto y reinícialo.

## Fuentes

- [Client SDKs](https://docs.typesafe.ai/sdk) — [Python](https://docs.typesafe.ai/sdk/python) ([código](https://github.com/typesafe-ai/typesafe-sdk-python)) · [JavaScript](https://docs.typesafe.ai/sdk/javascript) ([código](https://github.com/typesafe-ai/typesafe-sdk-js))
- [Proveedor TypeSafe del AI SDK](https://ai-sdk.dev/providers/ai-sdk-providers/typesafe-ai) · [npm @ai-sdk/typesafe-ai](https://www.npmjs.com/package/@ai-sdk/typesafe-ai)
- [Agent skill](https://docs.typesafe.ai/agent-skill) · [SKILL.md](https://github.com/typesafe-ai/skills/blob/main/skills/typesafe-ai/SKILL.md)
