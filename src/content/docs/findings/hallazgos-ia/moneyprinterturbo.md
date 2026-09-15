---
title: "MoneyPrinterTurbo: vídeos verticales generados de punta a punta"
description: "Herramienta que parte de un tema, escribe el guion con un LLM, busca material de archivo, genera voz y subtítulos y compone el vídeo final en varios formatos."
tags: [video, ia, tts, python, automatizacion, subtitulos, docker]
sidebar:
  order: 16
draft: false
resourceCategory: ia
url: https://github.com/harry0703/MoneyPrinterTurbo
note: "El interés técnico está en la cadena completa (guion → material → voz → subtítulos → composición); el interés práctico depende de una licencia de música y de metraje que el repositorio no te da."
updatedAt: 2026-09-14
---

> Licencia MIT.

[MoneyPrinterTurbo](https://github.com/harry0703/MoneyPrinterTurbo) genera vídeos cortos en alta definición a partir de un tema o unas palabras clave. Su valor como lectura es la **cadena de montaje**: cada etapa es un punto donde se puede cambiar el proveedor o meter material propio.

## La cadena

1. **Guion** — un LLM escribe el texto, en varios idiomas.
2. **Material** — busca metraje de archivo o genera vídeo que encaje con el guion.
3. **Audio** — locución por TTS y música de fondo.
4. **Subtítulos** — sincronizados automáticamente.
5. **Composición** — render final en 9:16, 16:9 o 1:1.

## Proveedores

**Modelos de lenguaje:** Kimi / Moonshot AI, OpenAI, Anthropic Claude, Google Gemini, DeepSeek, Alibaba Qwen, Azure OpenAI, Volcano Engine, xAI Grok, MiniMax y Xiaomi MiMo, además de agregadores como OpenRouter.

**Voz (TTS):** Edge TTS (gratuito), Azure Speech, SiliconFlow, Google Gemini, Xiaomi MiMo, MiniMax, ElevenLabs, Chatterbox, Kokoro, Fish Audio y VoxCPM de ModelBest.

Edge TTS es el que permite probar sin gastar; el salto de calidad de voz llega con los de pago.

## Ejecutarlo

Interfaz web:

```bash
sh webui.sh      # macOS y Linux
```

```bash
webui.bat        # Windows
```

Servidor de API:

```bash
uv run python main.py
```

Por línea de comandos:

```bash
uv run python cli.py --video-subject "Tu tema"
```

Con contenedores:

```bash
docker compose -f docker-compose.release.yml up
```

Requiere Python 3.11 o superior. La GPU es opcional pero acelera el render, y en algunos sistemas hay que instalar FFmpeg aparte. El modelo Whisper para subtítulos pesa unos 3 GB y puede tener que descargarse a mano si la red falla.

## Lo que hay que resolver tú

- **La música de fondo** que incluye el proyecto proviene de vídeos de YouTube, con los problemas de derechos que eso implica. Sustitúyela por música con licencia antes de publicar nada.
- El metraje de archivo tiene su propia licencia según la fuente: la etapa automática no comprueba si puedes usarlo comercialmente.
- Publicar vídeo generado sin decirlo choca con las políticas de varias plataformas y, en algunos países, con normas de etiquetado de contenido sintético.
- Un guion escrito por un LLM sobre un tema factual necesita revisión: el vídeo hace que un error suene más seguro de lo que es.

## Fuentes

- [Repositorio y README de MoneyPrinterTurbo](https://github.com/harry0703/MoneyPrinterTurbo)
