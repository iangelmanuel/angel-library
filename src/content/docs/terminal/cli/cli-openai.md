---
title: "OpenAI CLI: qué tan vigente está"
description: El CLI moderno de OpenAI (distinto del que traía el paquete de Python), su instalación, autenticación por variable de entorno y cuándo tiene sentido usarlo frente al SDK.
type: guides
order: 10
tags: [cli, openai, ia, api]
scope: openai
related: [terminal/cli/cli-openrouter]
updatedAt: 2026-08-17
---

Ojo con la confusión histórica: versiones viejas del SDK de Python (`pip install openai`) instalaban de yapa un comando `openai` en el sistema (`openai api chat.completions.create ...`), pensado para probar la API rápido. Ese CLI legado quedó obsoleto — si `openai --version` en tu máquina muestra algo raro o no coincide con lo que sigue, probablemente sea ese binario viejo resolviéndose desde un `pip install` anterior.

Hoy OpenAI mantiene un **CLI independiente**, separado del SDK de Python, pensado para requests sueltos desde la terminal, scripts y generación de artefactos locales (imágenes, audio) sin escribir código.

## Instalación

```bash
# macOS / Linux (Homebrew)
brew install openai/tools/openai

# Alternativa multiplataforma (requiere Go 1.25+)
go install github.com/openai/openai-cli/cmd/openai@latest
```

Si en Windows no hay Homebrew ni Go instalados, la vía recomendada sigue siendo el SDK (`pip install openai` o `npm install openai`) en lugar de este CLI.

## Autenticarse

Vía variable de entorno — no hay comando de login interactivo:

```bash
export OPENAI_API_KEY="sk-..."
```

La key se genera en el [dashboard de OpenAI](https://platform.openai.com/api-keys). Para operaciones de administración (crear proyectos, otras API keys) se usa `OPENAI_ADMIN_KEY` en su lugar, y `OPENAI_BASE_URL` permite apuntar el CLI a un endpoint distinto del oficial (por ejemplo, un proxy).

## Comandos de ejemplo

```bash
# Generar texto con la API de Responses
openai responses create --model <modelo> --input "Decime hola en una frase"

# Generar una imagen
openai images generate --model <modelo> --prompt "Un cubo verde" --output imagen.png

# Transcribir audio
openai audio:transcriptions create --model <modelo> --file ./audio.mp3
```

Sustituye `<modelo>` por el modelo vigente en cada momento — cambia con frecuencia y no vale la pena fijarlo aquí.

## Consideraciones

- Este CLI es para **requests sueltos y scripts de terminal**, no para construir una aplicación — para eso, OpenAI recomienda el SDK oficial (Python o Node) directamente contra la API.
- El CLI legado que instalaba el paquete de Python (`openai api ...`) es distinto de este y está obsoleto — si conviven los dos en el `PATH`, confirma cuál se está ejecutando con `which openai` / `where openai`.
- No hay flujo de login interactivo: toda la autenticación pasa por `OPENAI_API_KEY` (o `OPENAI_ADMIN_KEY`) como variable de entorno.
