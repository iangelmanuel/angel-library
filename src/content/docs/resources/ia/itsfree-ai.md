---
title: "it's free*.ai — directorio de APIs gratuitas de modelos de IA"
description: "Directorio que compara las capas gratuitas de proveedores de modelos de IA, con sus límites por minuto y por día, ventana de contexto y requisitos de registro."
type: resources
tags: [ia, api, llm, gratis, limites]
url: https://itsfree.ai/
resourceCategory: ia
official: false
personalNote: "Sirve para prototipar sin tarjeta, no para producción: la mayoría de capas gratuitas no garantizan disponibilidad y varias entrenan con lo que les envías."
updatedAt: 2026-09-01
---

Un catálogo de **todas las formas gratuitas de ejecutar un modelo de IA**: 463 modelos repartidos entre 25 proveedores en la nube, más 9 runtimes locales. La gracia no es la lista en sí, sino que compara lo que de verdad decide si un proveedor te sirve.

## Qué compara

La tabla es ordenable y muestra, para cada proveedor:

- **Peticiones por minuto y por día** de la capa gratuita.
- **Ventana de contexto** de los modelos disponibles.
- **URL base** del endpoint, para saber si puedes apuntar ahí un cliente que ya tengas.
- **Qué te pide**: nada, un email, o un teléfono.

Se puede filtrar por lo que suele importar de verdad: _sin tarjeta_, _sin registro_ y _compatible con OpenAI_. Cada ficha enlaza a las instrucciones de alta del propio proveedor.

## Ejemplos de lo que lista

| Proveedor            | Capa gratuita                                       |
| -------------------- | --------------------------------------------------- |
| **Groq**             | 1.000 peticiones al día, modelos GPT-OSS y Qwen     |
| **Google AI Studio** | 1.500 peticiones al día, contexto de 1M, multimodal |
| **NVIDIA NIM**       | 40 peticiones por minuto sobre 82 modelos abiertos  |
| **Ollama**           | Local, sin límite de peticiones                     |

También aparecen DeepSeek, Mistral AI, Cohere, Hugging Face, Cloudflare Workers AI y Cerebras. **21 proveedores no piden cuenta en absoluto.**

## Qué revisar antes de apoyarte en uno

El propio sitio avisa de que **las capas gratuitas cambian sin previo aviso**, así que confirma los límites en la documentación del proveedor antes de construir nada encima.

Tres cosas más que conviene comprobar en cada caso:

- **Uso en producción**: muchas capas de evaluación lo prohíben en sus términos.
- **Disponibilidad**: sin SLA, un modelo gratuito puede desaparecer o degradarse cuando más lo necesites.
- **Privacidad**: es habitual que entrenen con lo que envías salvo que digan lo contrario de forma explícita. No mandes datos de clientes ni código privado por un endpoint gratuito sin leer esa cláusula.

El uso natural es el prototipo: probar si un modelo resuelve tu caso antes de pagar por él, o tener un plan B para cuando se agote la cuota del proveedor principal.
