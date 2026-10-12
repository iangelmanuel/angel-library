---
title: "it's free*.ai — directorio de APIs gratuitas de modelos de IA"
description: "Directorio que compara las capas gratuitas de proveedores de modelos de IA, con sus límites por minuto y por día, ventana de contexto y requisitos de registro, además de runtimes locales y herramientas alrededor de los modelos."
tags: [ia, api, llm, gratis, limites, openai-compatible, local]
draft: false
resourceCategory: ia
official: false
url: https://itsfree.ai/
github: https://github.com/midudev/itsfree.ai
technologies: [resources/ia/canirun-ai, ai/ai-sdk/ai-sdk-openrouter, terminal/cli/cli-openrouter]
note: "Sirve para prototipar sin tarjeta, no para producción: la mayoría de capas gratuitas no garantizan disponibilidad y varias entrenan con lo que les envías. Las cifras de esta página son las que mostraba el sitio en octubre de 2026."
warnings:
  - "Las capas gratuitas cambian sin previo aviso: confirma el límite en la documentación del proveedor antes de construir encima."
  - "No envíes datos de clientes ni código privado a un endpoint gratuito sin leer su política de entrenamiento."
updatedAt: 2026-10-12
---

Un catálogo de **todas las formas gratuitas de ejecutar un modelo de IA**. A octubre de 2026 el sitio contaba **463 modelos gratuitos**, **25 proveedores** en la nube con una capa gratuita real y **9 runtimes locales**, con una fecha de verificación visible en la portada. Lo creó [midudev](https://x.com/midudev) y el código está en GitHub (`midudev/itsfree.ai`).

La gracia no es la lista en sí, sino que compara en una misma tabla lo que de verdad decide si un proveedor te sirve.

## Qué es una "capa gratuita" de una API de IA

Muchos proveedores de modelos (Google, Groq, NVIDIA, Mistral…) dejan llamar a su API sin pagar, con un tope de peticiones por minuto o por día, un crédito único o un saldo mensual. Son útiles para probar un modelo o hacer un prototipo, pero cada una tiene reglas distintas y están repartidas por decenas de páginas de precios. it's free\*.ai las junta en un solo sitio.

## Qué compara

La tabla de **Free APIs** es ordenable y muestra, para cada proveedor:

| Columna       | Qué dice                                                          |
| ------------- | ----------------------------------------------------------------- |
| **Free tier** | El límite gratuito: peticiones por minuto/día, créditos o saldo   |
| **Context**   | Ventana de contexto máxima de sus modelos gratuitos               |
| **Models**    | Cuántos modelos gratuitos ofrece                                  |
| **Signup**    | Qué te pide para darte de alta: nada, email, teléfono o tarjeta   |
| **Includes**  | Datos extra, como la URL base del endpoint                        |

Se puede filtrar por tipo (APIs, runtimes, chat y playground, agentes de código, herramientas) y por lo que suele importar de verdad: **sin tarjeta**, **sin registro** y **compatible con OpenAI**. Cada ficha enlaza a las instrucciones de alta del propio proveedor.

"Compatible con OpenAI" significa que el proveedor acepta el mismo formato de petición que el SDK de OpenAI: cambias la URL base y la clave, y el resto del código queda igual. Es lo que permite usar un mismo cliente contra varios proveedores.

## Ejemplos de lo que lista

Datos tal como los mostraba el sitio en octubre de 2026:

| Proveedor                 | Capa gratuita                          | Contexto | Alta     |
| ------------------------- | -------------------------------------- | -------- | -------- |
| **Google AI Studio**      | 1.500 peticiones al día                | 1M       | email    |
| **Groq**                  | 1.000 peticiones al día                | 131K     | email    |
| **NVIDIA NIM**            | 40 peticiones por minuto, 82 modelos   | 1M       | teléfono |
| **OpenRouter**            | 18 modelos a coste cero                | 1M       | email    |
| **Cloudflare Workers AI** | 10.000 neuronas al día                 | 262K     | email    |
| **Cerebras**              | Crédito único de 5 USD                 | 65K      | tarjeta  |
| **Hugging Face**          | 0,10 USD de créditos al mes            | 131K     | email    |
| **LLM7.io**               | 10 peticiones/min (40 con token)       | 1M       | ninguno  |

Entre los demás proveedores aparecen Vercel AI Gateway, Mistral AI, Cohere, DeepSeek, SambaNova, ModelScope, Z.ai, OVHcloud AI Endpoints, Alibaba Model Studio, OpenCode Zen y Nebius, entre otros. Hay modelos de imagen (FLUX.1 Schnell, Stable Diffusion XL, Imagen 4 Fast) dentro de las fichas de los proveedores, sin una sección aparte.

Según el propio FAQ, no hay un ganador absoluto: Google AI Studio lidera en peticiones por día, NVIDIA NIM en peticiones por minuto y Cerebras en tokens por día.

## Runtimes locales y herramientas

Además de las APIs, el sitio tiene dos secciones que conviene conocer:

- **Run it on your own machine**: los 9 runtimes para ejecutar modelos en tu equipo — Ollama, LM Studio, llama.cpp, Jan, GPT4All, vLLM, MLX, llamafile y KoboldCpp. No necesitas GPU para modelos pequeños (llama.cpp o GPT4All corren en CPU); la GPU aporta velocidad. Para saber qué modelo cabe en tu máquina enlaza a [CanIRun.ai](/resources/ia/canirun-ai).
- **Around the models**: herramientas alrededor de los modelos, como agentes de código (OpenCode, Cline, Kilo Code, Continue, Aider), Google Colab, LMArena, Hugging Face Spaces, los rankings de OpenRouter, Artificial Analysis y Tiktokenizer.

## Cuándo conviene y cuándo no

**Conviene** para:

- Probar si un modelo resuelve tu caso antes de pagar por él.
- Tener un plan B cuando se agota la cuota del proveedor principal (por ejemplo, detrás de un enrutador como [OpenRouter](/ai/ai-sdk/ai-sdk-openrouter)).
- Proyectos personales, demos y aprendizaje.

**No conviene** como base de un producto: sin SLA, un modelo gratuito puede desaparecer, degradarse o cambiar su límite cuando más lo necesites.

## Qué revisar antes de apoyarte en uno

El propio sitio avisa de que **las capas gratuitas cambian sin previo aviso**, así que confirma los límites en la documentación del proveedor antes de construir nada encima.

Tres cosas más que conviene comprobar en cada caso:

- **Uso en producción**: muchas capas de evaluación lo prohíben en sus términos.
- **Disponibilidad**: no hay garantía de uptime en las capas gratuitas.
- **Privacidad**: algunos proveedores entrenan con lo que envías; el FAQ menciona la capa gratuita de Gemini como ejemplo. Para material confidencial, la recomendación del sitio es un runtime local.

## Fuentes

- [itsfree.ai](https://itsfree.ai/)
- [Repositorio midudev/itsfree.ai](https://github.com/midudev/itsfree.ai)
