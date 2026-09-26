---
title: "Kev: modelos de decisión tipo Jev que corren en tu máquina"
description: Familia de modelos de código abierto de Jared Palmer, construidos sobre Qwen, que responden sí/no, eligen una opción o puntúan en una escala con probabilidades calibradas y la misma API que Jev.
tags: [kev, jev, clasificacion, modelos-locales, qwen, lora, open-source, decisiones]
sidebar:
  order: 19
draft: false
resourceCategory: ia
official: true
website: https://huggingface.co/spaces/jaredpalmer/kev
github: https://github.com/jaredpalmer/kev
technologies:
  - agents/jev/jev-introduccion
  - agents/jev/jev-primitivas-api
note: "Licencia Apache 2.0. Pesos: Kev-0.8B, 4B, 9B y 27B en Hugging Face. Python 3.12 o 3.13 con uv; CUDA, ROCm o Apple Silicon (MLX)."
updatedAt: 2026-09-26
---

## En pocas palabras

[Kev](https://github.com/jaredpalmer/kev) es la alternativa de código abierto a [Jev](/agents/jev/jev-introduccion), el modelo System One de TypeSafe. Es una familia de modelos pequeños **de decisión**: no generan texto, sino que responden preguntas cerradas sobre un texto con probabilidades.

- **Se ejecuta en tu ordenador**: los datos no salen de ahí.
- Responde **sí o no** (`noul`), **elige una opción** (`choice`) o **pone una nota** en una escala (`score`), varias preguntas en la misma petición.
- **API compatible con Jev**: el SDK de Python de TypeSafe funciona contra un servidor Kev sin cambios.
- Perfecto para clasificar, enrutar y filtrar.

Se basa en la arquitectura descrita en [Jev's Architecture Unmasked](https://archerhume.com/posts/jevs-architecture-unmasked). No usa salidas de Jev para entrenarse.

## Tamaños

Se anunció con tres tamaños (0.8B, 4B y 9B); después se añadió un cuarto de 27B.

| Modelo | Base | Precisión en fuentes nuevas (dev/test) | Dónde corre |
| --- | --- | --- | --- |
| Kev-0.8B | Qwen3.5-0.8B-Base | 0,648 / 0,697 | Cualquier Mac con Apple Silicon, L4 |
| **Kev-4B** | Qwen3.5-4B-Base | 0,817 / 0,838 | Mac de 32 GB, L40S, H100 |
| Kev-9B | Qwen3.5-9B-Base | 0,822 / 0,852 | Mac de 32 GB, L40S, H100 |
| Kev-27B | Qwen3.8-27B | 0,848 / 0,896 | B200, H200, H100 de 80 GB |
| Jev (referencia) | Alojado | 0,857 / – | API de TypeSafe |

Recomendación del autor: **empieza por Kev-4B**; sube a 9B con una GPU mayor o a 27B con 80 GB; usa 0.8B cuando importe más el tamaño que la precisión. Kev-27B queda a un punto de Jev en fuentes que no vio al entrenar, aunque no es una comparación controlada.

## Probarlo

Sin instalar nada: la [demo en Hugging Face](https://huggingface.co/spaces/jaredpalmer/kev) ejecuta Kev-4B y Kev-0.8B.

En local:

```bash
git clone https://github.com/jaredpalmer/kev.git && cd kev
uv sync --extra serve
uv run --extra serve python -m kev.serve --run jaredpalmer/kev-4b --port 8009
```

La primera vez descarga el adaptador y el modelo base. Usa CUDA o ROCm si hay GPU y MLX en Apple Silicon.

```bash
curl -s localhost:8009/v1/systemone -H 'content-type: application/json' -d '{
  "state": "Shoes arrived two weeks late and in the wrong size. Also I see two charges on my card.",
  "model": "kev-latest",
  "questions": {
    "department":  {"type": "choice", "instructions": "Which team should handle this?",
                    "criteria": {"returns": "Exchanges, refunds, wrong or damaged items",
                                 "shipping": "Delivery status, delays, lost packages",
                                 "billing": "Charges, invoices, payment problems"}},
    "escalate":    {"type": "noul",  "instructions": "Does this need urgent human attention?"},
    "frustration": {"type": "score", "instructions": "How frustrated is the customer?",
                    "criteria": ["Calm", "Frustrated", "Very angry"]}
  }}'
```

La respuesta muestra por qué importan las probabilidades: el ticket habla de devolución, retraso y cobro doble, y `department` reparte 0,47 / 0,28 / 0,25 con confianza 0,21. Tu código puede automatizar lo seguro y mandar lo dudoso a una persona.

Desde Python, con el SDK de TypeSafe apuntando a tu servidor:

```python
from typesafe_sdk import Noul, TypeSafeClient

client = TypeSafeClient(api_key="local", base_url="http://127.0.0.1:8009", model="kev-latest")
r = client.system_one(
    state="I was charged twice. Please fix this ASAP.",
    questions={"billing": Noul(instructions="Is this ticket about billing?")},
)
print(r.nouls["billing"].noul)
```

## API

`POST /v1/systemone`, igual que Jev. Diferencias y extras:

| Método | Ruta | Para qué |
| --- | --- | --- |
| `GET` | `/v1/models` | Tarjetas de modelo y detalles del checkpoint cargado |
| `POST` | `/v1/systemone/permute` | Ejecutar un Choice con distintos órdenes de opciones (1–64) |
| `POST` | `/v1/systemone/separate` | Evaluar cada pregunta en su propia pasada |

| Variable | Efecto |
| --- | --- |
| `KEV_API_KEY` | Exigir un bearer token |
| `KEV_TEMPERATURE=1.0` | Devolver probabilidades crudas en vez de calibradas |
| `KEV_DATE_FACTS=1` | Añadir al estado los días entre fechas que aparezcan |
| `KEV_DTYPE=fp32` | Servir en fp32 (bf16 por defecto en GPU) |

Choice y Score aceptan de 1 a 255 opciones o niveles. El servidor admite estados de hasta 65.536 tokens y 8.192 más por pregunta, pero se entrenó con estados de hasta 384 tokens: la precisión baja en documentos largos (Kev-27B aguanta mejor).

## Ajustarlo a tus datos

Si tus preguntas son distintas (tus categorías, tus reglas de escalado, otro idioma), un fine-tune corto suele ayudar más que retocar prompts. En un ejemplo de soporte, 15 minutos en una H100 subieron Kev-4B de 67,7 % a 73,6 % de precisión.

Con un agente de código:

```bash
npx skills add jaredpalmer/kev@kev-finetune
```

y pídele «fine-tune Kev on my support tickets». La skill encuentra las preguntas que ya haces a Jev, prepara etiquetas y entrena en [Modal](https://modal.com).

A mano, con un JSONL con el mismo formato que la API más un `label` por pregunta:

```bash
uv run python -m kev.train --data train.jsonl --base Qwen/Qwen3.5-4B-Base --init_from jaredpalmer/kev-4b \
    --epochs 2 --lr 2e-5 --batch 1 --accum 8 --dtype bf16 --checkpointing 1 --device cuda --out runs/mine
uv run python -m kev.benchmark --run runs/mine --data heldout.jsonl --out runs/mine-eval
```

`--init_from` parte del modelo publicado para no perder lo que ya sabe. Con `--batch 1 --accum 8` en bf16, el de 0.8B cabe en una GPU de 4 GB.

## Desplegar un endpoint

Solo con una cuenta de Modal:

```bash
pip install modal && modal setup
curl -LO https://raw.githubusercontent.com/jaredpalmer/kev/main/skills/kev-deploy/scripts/kev_serve.py
KEV_API_KEY=$(openssl rand -hex 24) modal deploy kev_serve.py
```

Sirve Kev-4B en una L40S con la misma API y **escala a cero** cuando no se usa (la primera petición tras estar inactivo tarda unos 35 s).

## Cómo funciona

Cada checkpoint es un **adaptador LoRA de rango 16** más una pequeña **pointer head** sobre un modelo Qwen. El estado y cada pregunta se procesan de forma que una pregunta ve el estado y a sí misma, pero no a las demás. La pointer head puntúa cada opción y un softmax da las probabilidades; una temperatura ajustada con datos reservados las calibra. Se entrenó con `decision-v7`: 10.000 ejemplos de diez datasets públicos más ejemplos de políticas y reglas generados.

También trae un **playground** en Next.js (`cd playground && npm run dev -- -p 3001`) con una demo de ajedrez donde el tablero es el estado y los movimientos legales son las opciones.

## Cuándo conviene

- Clasificar o enrutar datos que no pueden salir de tu infraestructura.
- Volumen alto donde pagar por cada llamada no compensa.
- Quieres afinar el modelo con tus propias etiquetas.

Si no quieres gestionar GPUs y tus datos pueden ir a un tercero, Jev alojado es más preciso en los tamaños pequeños y no requiere mantenimiento.

## Fuentes

- [Repositorio y README](https://github.com/jaredpalmer/kev)
- [Pesos en Hugging Face](https://huggingface.co/collections/jaredpalmer/kev-6aad9d0ea49f2589665e07cd) · [Demo](https://huggingface.co/spaces/jaredpalmer/kev) · [Suites de evaluación](https://huggingface.co/datasets/jaredpalmer/kev-suites)
- [Jev's Architecture Unmasked](https://archerhume.com/posts/jevs-architecture-unmasked)
