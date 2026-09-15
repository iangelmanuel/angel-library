---
title: "Fincept Terminal: una terminal financiera de escritorio, nativa y abierta"
description: "Aplicación C++20 con Qt6 y Python embebido que reúne analítica de mercado, cartera, derivados, paper trading y más de cien conectores de datos en un solo binario."
tags: [finanzas, escritorio, cpp, qt, python, datos, agpl]
sidebar:
  order: 5
draft: false
resourceCategory: developer-tools
website: https://fincept.in
url: https://github.com/Fincept-Corporation/FinceptTerminal
updatedAt: 2026-09-14
---

> Publicado por **[Fincept Corporation](https://github.com/Fincept-Corporation)** con licencia **AGPL-3.0-or-later**. Versión más reciente consultada: v4.5.0.

[Fincept Terminal](https://github.com/Fincept-Corporation/FinceptTerminal) es una aplicación de escritorio para investigación financiera que se presenta como alternativa abierta a una terminal profesional. Lo notable no es solo el alcance funcional, sino la decisión de ingeniería: **C++20 con Qt6 y Python 3.11 embebido, en un único binario nativo** — sin Electron y sin Node.

## Qué incluye

- Analítica de mercado e investigación de acciones.
- 37 agentes de IA orientados a trading, economía y geopolítica.
- Optimización de cartera, valoración de derivados y análisis de renta fija.
- Editor visual de nodos para armar flujos de automatización.
- Motor de paper trading con 16 integraciones de bróker.
- Más de 100 conectores de datos.
- Módulos de inteligencia global: seguimiento marítimo, análisis geopolítico.

Para la parte de IA admite OpenAI, Anthropic, Gemini, Groq, DeepSeek, OpenRouter y Ollama — con tus propias claves.

## Datos

Entre las fuentes: FRED, IMF, Banco Mundial, DBnomics, AkShare, Polygon, Kraken, Yahoo Finance y APIs gubernamentales, además de las claves que aportes tú.

Conviene tener claro el reparto: el nivel gratuito trabaja con **fuentes públicas**; las funciones premium y los conjuntos de datos privados van por suscripción Enterprise (del orden de 10 a 40 USD por usuario y mes).

## Instalación

Lo más simple es descargar el instalador de [releases](https://github.com/Fincept-Corporation/FinceptTerminal/releases): `.exe` para Windows, AppImage/`.deb`/`.rpm` para Linux, `.dmg` para macOS.

Compilar desde el código:

```bash
git clone https://github.com/Fincept-Corporation/FinceptTerminal.git
cd FinceptTerminal
./setup.sh
```

La cadena de herramientas está fijada: CMake 3.27.7, Ninja 1.11.1, Qt 6.8.3 y Python 3.11.9. Salirse de esas versiones es la causa habitual de que el build falle.

## La licencia importa aquí

**AGPL-3.0-or-later** no es un detalle menor: si distribuyes una versión modificada —incluso ofreciéndola como servicio en red— el copyleft te obliga a publicar tus cambios. Para uso personal, académico o interno no cambia nada; para incorporarlo a un producto cerrado, sí.

## Límites

- Es una aplicación de escritorio pesada: descarga grande y compilación larga si vas desde el código.
- Los agentes de IA consumen tus claves y su cuota; su salida es análisis, no recomendación de inversión.
- Los conectores dependen de APIs de terceros que cambian de límites y de términos sin avisar.
- El paper trading simula: la ejecución real tiene deslizamiento, comisiones y latencia que el simulador no reproduce.

## Fuentes

- [Repositorio y README de Fincept Terminal](https://github.com/Fincept-Corporation/FinceptTerminal)
- [Sitio oficial](https://fincept.in)
- [Releases](https://github.com/Fincept-Corporation/FinceptTerminal/releases)
