---
title: "Laya: decisiones tipadas estilo Jev con encoders que corren en local"
description: "Motor de decisión no autorregresivo de código abierto: responde preguntas choice, score y noul sobre cualquier texto en una sola pasada, en más de 100 idiomas, con un servidor compatible con la API de Jev y fine-tuning con tus datos."
tags: [laya, jev, clasificacion, decisiones, modelos-locales, modernbert, open-source, python]
sidebar:
  order: 21
draft: false
resourceCategory: ia
website: https://nandhakishorm.github.io/laya/
github: https://github.com/NandhaKishorM/laya
technologies:
  - agents/jev/jev-introduccion
  - agents/jev/jev-primitivas-api
  - agents/jev/jev-confianza-patrones
  - findings/hallazgos-ia/kev
note: "Licencia Apache 2.0, de Convai Innovations. Python 3.10 o superior; corre en CPU, CUDA, Apple Silicon (MPS) o Intel XPU. Datos del README de la versión 0.4.5 (octubre de 2026)."
warnings:
  - "Los checkpoints base quedan cerca del azar en decisiones tipadas sin ajustar (0,36 frente a 0,32 de una elección aleatoria): el proyecto lo presenta como una base para especializar con fine-tuning, no como un clasificador listo para usar."
  - "Las comparativas con Jev usan cifras publicadas por terceros, no medidas en la misma prueba: tómalas como orientación."
  - "Con más de unas 20 opciones por pregunta, las etiquetas se recortan para caber en el presupuesto de tokens y la precisión cae mucho (0,425 frente a 0,870 de Jev en Banking77)."
updatedAt: 2026-10-12
---

## En pocas palabras

[Laya](https://github.com/NandhaKishorM/laya) es una alternativa de código abierto a [Jev](/agents/jev/jev-introduccion), el modelo System One de TypeSafe. Igual que Jev y que [Kev](/findings/hallazgos-ia/kev), no genera texto: recibe un **estado** (un ticket, un correo, un JSON) y un conjunto de **preguntas tipadas**, y devuelve para cada una un valor estructurado con su distribución de probabilidad.

- **Corre en tu máquina**: los datos no salen de ahí.
- Tres tipos de pregunta: **`choice`** (elegir una opción), **`score`** (una nota en una escala) y **`noul`** (probabilidad de que la respuesta sea "sí").
- **Una sola pasada hacia delante** para todas las preguntas: unos 33 ms por pregunta en una GPU T4, según el README.
- **Más de 100 idiomas**, con un router que elige el checkpoint según el idioma del texto.
- **Se puede entrenar con tus datos**: el fine-tuning es donde está la mayor parte de la precisión.
- **Servidor HTTP compatible con Jev**: un cliente que ya habla con Jev solo necesita cambiar la URL base.

Un detalle de nombre: la pregunta de sí/no se llama `noul`, no `null`. Es el término que usa la API de Jev y Laya lo conserva para ser compatible.

## Qué es un modelo "no autorregresivo"

Un LLM normal es **autorregresivo**: genera la respuesta token a token, y cada token depende de los anteriores. Para clasificar algo hay que pedirle "devuelve JSON", esperar el texto y parsearlo, con el riesgo de que invente una categoría o rompa el formato.

Laya es un **encoder** (de la familia de BERT): lee todo el texto de una vez y una cabeza de decisión puntúa cada opción en la misma pasada. Como no escribe nada, no hay texto que parsear ni categorías inventadas: la respuesta siempre es una de las opciones que tú definiste.

## Los checkpoints

| Checkpoint | Encoder | Parámetros | Contexto | Para qué |
| --- | --- | --- | --- | --- |
| [`laya`](https://huggingface.co/convaiinnovations/laya) | ModernBERT-large | 421M | 512 tokens | Inglés |
| [`laya-multilingual`](https://huggingface.co/convaiinnovations/laya-multilingual) | mmBERT-base | 322M | 1.024 (hasta 8.192) | Más de 100 idiomas, unas 2 veces más rápido |
| [`laya-typed-decisions`](https://huggingface.co/convaiinnovations/laya-typed-decisions) | ModernBERT-large | 421M | 1.024 tokens | Ajustado a los flujos del benchmark de decisiones tipadas |

El `Router` detecta el alfabeto y el idioma del estado y envía el texto en inglés a `laya` y el resto a `laya-multilingual`. Se puede forzar un checkpoint con `model=` o dar una pista de idioma con `lang=` / `lang_guess=`.

Los modelos se entrenan con **RLCD**: aprendizaje por refuerzo con recompensas basadas en reglas de puntuación estrictamente propias, la técnica que busca que una probabilidad de 0,8 signifique de verdad "acierta 8 de cada 10 veces".

## Instalación

```bash
pip install laya
```

Extras opcionales según lo que necesites:

```bash
pip install "laya[serve]"      # servidor HTTP compatible con Jev
pip install "laya[mcp]"        # servidor MCP para agentes
pip install "laya[langchain]"  # integración con LangChain y LangGraph
```

También hay extras para LlamaIndex, CrewAI, ONNX Runtime y una ruta rápida en GPU con TileLang, y un paquete para Node.js y navegador (`laya-ts`).

## Uso desde Python

```python
from laya import Router

router = Router()  # descarga el checkpoint la primera vez

state = "Hi, we were billed twice for March. Please refund the duplicate today or we will cancel our plan."
questions = {
    "department": {"type": "choice", "instructions": "Which department should handle this?",
                   "criteria": {"billing": "invoices, payments, refunds",
                                "technical": "bugs, outages, system errors",
                                "other": "everything else"}},
    "urgency": {"type": "score", "instructions": "How urgent is this?",
                "criteria": ["not urgent", "soon", "blocking"]},
    "churn_risk": {"type": "noul", "instructions": "Does the user threaten to cancel or leave?"},
}

result = router.predict(state, questions)
print(result["answers"]["department"]["choice"])  # billing
print(result["answers"]["churn_risk"]["noul"])    # probabilidad de "sí"
print(result["routing"]["model"])                 # english
```

La misma llamada con un texto en español o en hindi se enruta sola a `laya-multilingual`.

## Desde la terminal

El paquete instala un comando `laya`:

```bash
laya "I was charged twice, please refund"          # solo la decisión de enrutado, sin descargar nada
laya "My payment failed twice" --predict           # respuestas completas
laya "My payment failed twice" --preset triage     # conjunto de preguntas predefinido
laya "Where is my card" --questions intents.json   # tus propias preguntas en un JSON
cat tickets.txt | laya --batch - --predict --json  # un lote desde stdin
```

Los presets incluidos cubren cinco casos: router entre modelos pequeños y frontera, guardarraíles de prompts (jailbreaks e inyecciones), moderación de contenido, triaje de tickets y triaje de correo.

## Servidor compatible con Jev

```bash
pip install "laya[serve]"
LAYA_DEVICE=cuda LAYA_PRELOAD=1 laya-serve   # escucha en 0.0.0.0:8000
```

```bash
curl -s localhost:8000/v1/systemone -H 'content-type: application/json' -d '{
  "state": {"body": "billed twice, refund please or we cancel"},
  "questions": {"dept": {"type": "choice", "instructions": "which team?",
                "criteria": {"billing": "refunds", "tech": "bugs"}}}
}'
```

Expone `POST /v1/systemone` y `/v1/systemone/batch` (hasta 64 estados) con el mismo protocolo que la API alojada de Jev. Con `LAYA_API_KEY` exige un token bearer. Al migrar un cliente de Jev cambian tres cosas:

- **Opciones por pregunta**: Jev acepta hasta 255; Laya reparte un presupuesto de tokens entre ellas y el servidor corta en 100.
- **Niveles de `score`**: todos necesitan descripción; un nivel `null` devuelve 422.
- **`confidence`** se calcula con otra fórmula (1 menos la entropía normalizada), así que un umbral que funcionaba en Jev no sirve tal cual. Para un número calibrado en todos los tipos, usa `answer_confidence`.

Para agentes, `laya-mcp-server` expone las mismas decisiones como herramientas MCP (`laya_predict`, `laya_route`, `laya_preset`…).

## Entrenarlo con tus datos

Este es el punto que más pesa. En el benchmark de decisiones tipadas (2.000 decisiones en cuatro flujos de trabajo):

| Modelo | Precisión |
| --- | --- |
| Elección aleatoria | 0,318 |
| `laya` base, sin ajustar | 0,362 |
| Clase mayoritaria | 0,461 |
| Jev (cifra publicada por TypeSafe) | 0,727 |
| `laya-typed-decisions` (ajustado) | 0,766 |

Es decir: los modelos base no aportan casi nada en ese benchmark; toda la capacidad viene del ajuste. El repositorio trae un [notebook para Kaggle](https://github.com/NandhaKishorM/laya/blob/main/notebooks/laya_finetune_typed_decisions_2xT4_kaggle.ipynb) (dos T4 gratuitas, unas 4 a 5 horas para 4 épocas sobre ~30.000 preguntas) y un script para Apple Silicon que hace todo el ciclo: preparar el dataset, entrenar con RLCD, calibrar temperaturas, evaluar y exportar.

```bash
python notebooks/laya_finetune_typed_decisions_mps.py --micro-batch 1 --grad-accum 32
```

## Laya, Kev y Jev

| | Jev | Kev | Laya |
| --- | --- | --- | --- |
| Tipo | API alojada, sin pesos abiertos | LoRA sobre Qwen (0.8B a 27B) | Encoders BERT (322M y 421M) |
| Dónde corre | Servidores de TypeSafe | Tu GPU o Mac | CPU, GPU o Mac |
| Latencia | 236–276 ms p50 medidos por terceros | Depende del tamaño | ~33 ms por pregunta en T4 |
| Opciones por pregunta | Hasta 255 | Hasta 255 | Bien hasta ~20; tope de 100 en el servidor |
| Sin ajustar | Listo para usar | Bastante preciso desde 4B | Cerca del azar en decisiones tipadas |

Laya gana en coste de hardware y velocidad; a cambio, exige entrenarlo para tu dominio. Si no quieres entrenar nada, Jev alojado o un Kev de 4B en adelante son mejores puntos de partida.

## Límites

- **Etiquetas booleanas**: en preguntas `choice`, claves como `true`/`false` o `yes`/`no` pueden confundir al modelo. Usa etiquetas con significado o neutras (`A`/`B`).
- **Negaciones**: en los ejemplos del issue #377, "no quiero cancelar" se clasificó como `cancel_account` en varios casos, incluso con probabilidad 0,9998. Valida frases negadas con tus datos.
- **Calibración**: el README reconoce que ambos checkpoints salen demasiado seguros de sí mismos y que `laya-multilingual` no trae temperaturas ajustadas. Calibra antes de fijar umbrales.
- **Documentos largos**: `laya-multilingual` lee hasta 8.192 tokens con `max_len=8192`, pero por encima de ~4.000 tokens la precisión varía mucho.

## Fuentes

- [Repositorio y README de Laya](https://github.com/NandhaKishorM/laya)
- [Documentación](https://nandhakishorm.github.io/laya/)
- [Checkpoints en Hugging Face](https://huggingface.co/convaiinnovations/laya) · [Demo](https://huggingface.co/spaces/convaiinnovations/laya-demo)
- [BENCHMARKS.md](https://github.com/NandhaKishorM/laya/blob/main/BENCHMARKS.md)
