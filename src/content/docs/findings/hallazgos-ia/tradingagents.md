---
title: "TradingAgents: una mesa de trading simulada con agentes que debaten"
description: "Marco de investigación donde equipos de agentes LLM (analistas, investigadores alcistas y bajistas, trader, riesgo) discuten una decisión antes de emitirla."
tags: [agentes, llm, finanzas, python, investigacion, multiagente]
sidebar:
  order: 14
draft: false
resourceCategory: ia
website: https://arxiv.org/abs/2412.20138
url: https://github.com/TauricResearch/TradingAgents
updatedAt: 2026-09-14
---

> Publicado por **[Tauric Research](https://github.com/TauricResearch)** con licencia Apache-2.0, acompañado de un [paper en arXiv](https://arxiv.org/abs/2412.20138).

[TradingAgents](https://github.com/TauricResearch/TradingAgents) reparte una decisión de inversión entre varios agentes con roles distintos, imitando cómo se organiza una mesa real. Es un marco **de investigación**: lo que se estudia es la coordinación entre agentes, no una estrategia lista para operar.

## Los roles

| Equipo               | Qué hace                                                            |
| -------------------- | ------------------------------------------------------------------- |
| Analista fundamental | Lee métricas financieras del activo                                 |
| Analista de sentimiento | Agrega noticias, StockTwits y Reddit                             |
| Analista de noticias | Sigue indicadores macroeconómicos                                   |
| Analista técnico     | Trabaja con indicadores (MACD, RSI y similares)                     |
| Investigadores       | Uno alcista y uno bajista **debaten** los informes anteriores       |
| Trader               | Sintetiza el debate y propone la operación                          |
| Riesgo y cartera     | Evalúa exposición y aprueba o rechaza la propuesta                  |

La pieza que distingue al proyecto es el debate: forzar una postura alcista y otra bajista sobre los mismos datos es un mecanismo explícito contra la respuesta complaciente de un solo agente.

## Puesta en marcha

```bash
git clone https://github.com/TauricResearch/TradingAgents.git
cd TradingAgents
conda create -n tradingagents python=3.12
conda activate tradingagents
pip install .
```

O con contenedores:

```bash
docker compose run --rm tradingagents
```

## Proveedores

**Modelos:** OpenAI, Google Gemini, Anthropic Claude, xAI Grok, DeepSeek, Qwen, GLM, MiniMax, OpenRouter, Ollama, Azure OpenAI, AWS Bedrock y cualquier endpoint compatible con OpenAI.

**Datos:** Alpha Vantage (precios e indicadores), Yahoo Finance, FRED (macro), fuentes de noticias y sentimiento, y Polymarket.

Cada proveedor exige su propia clave y tiene sus límites de cuota. El coste crece rápido: una corrida completa encadena varios agentes, y el debate multiplica las llamadas por ronda. Empieza con un solo activo y un modelo barato para medir gasto antes de ampliar.

## Cómo leerlo

- Revisa los informes intermedios, no solo la decisión final: ahí se ve si el análisis se sostiene o si el agente rellenó huecos.
- Fija temperatura y versión del modelo si quieres comparar corridas; con muestreo distinto, dos ejecuciones no son comparables.
- Registra qué datos vio cada agente. Un sentimiento de Reddit desactualizado explica más resultados raros que el propio modelo.

## Advertencias del propio proyecto

El repositorio es explícito: **no es asesoramiento financiero, de inversión ni de trading**. El rendimiento varía según modelo, temperatura, calidad de los datos y el muestreo inherente al LLM, y los resultados de backtest no tienen por qué reproducir las cifras publicadas.

A eso hay que sumar lo de siempre con datos de mercado: un backtest que usa noticias o precios que en su momento no estaban disponibles filtra información futura y produce resultados que no existen en vivo.

## Fuentes

- [Repositorio y README de TradingAgents](https://github.com/TauricResearch/TradingAgents)
- [Paper: TradingAgents (arXiv 2412.20138)](https://arxiv.org/abs/2412.20138)
