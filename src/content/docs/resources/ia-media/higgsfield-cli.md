---
title: "Higgsfield CLI — imagen, video, 3D y audio con IA desde la terminal"
description: "CLI oficial de Higgsfield para generar imágenes, video, 3D y audio con más de 40 modelos (Nano Banana, GPT Image, Veo, Kling, Seedance…), lanzar workflows como doblaje o reframe y automatizarlo desde scripts o agentes."
tags: [ia, higgsfield, cli, imagenes, video, audio, 3d, generacion, agentes, automatizacion]
sidebar:
  order: 1
draft: false
tool: Higgsfield CLI
resourceCategory: ia-media
official: true
website: https://higgsfield.ai/cli
github: https://github.com/higgsfield-ai/cli
technologies:
  - resources/ia-media/higgsfield
  - resources/ia-media/midjourney
note: Licencia MIT. Cada generación consume créditos de tu cuenta de Higgsfield; usa `higgsfield generate cost` antes de lanzar lotes.
updatedAt: 2026-09-26
---

La **Higgsfield CLI** lleva el estudio de [Higgsfield](/resources/ia-media/higgsfield) a la terminal. Genera imágenes, video, modelos 3D, audio y análisis de video terminado con más de 40 modelos, y devuelve URLs o JSON que se pueden encadenar en scripts. Como todo es un comando, un agente de código (Claude Code, Codex…) puede usarla para producir material de forma automática.

## Instalación

```bash
# macOS / Linux
curl -fsSL https://raw.githubusercontent.com/higgsfield-ai/cli/main/install.sh | sh

# Homebrew
brew install higgsfield-ai/tap/higgsfield

# Cualquier sistema, incluido Windows
npm install -g @higgsfield/cli
```

También hay binarios en las [releases](https://github.com/higgsfield-ai/cli/releases). Para fijar una versión: `npm install -g @higgsfield/cli@1.1.2` o `sh -s -- --tag v1.1.2` con el script.

## Primeros pasos

```bash
higgsfield auth login     # abre el navegador para iniciar sesión
higgsfield account        # saldo de créditos y transacciones
higgsfield model list     # catálogo actual de modelos

higgsfield generate create nano_banana_2 --prompt "a quiet beach at sunrise" --wait
```

`--wait` bloquea hasta que termina el trabajo e imprime la URL del resultado. Sin él, el comando devuelve un `job_id` que se consulta después con `generate get` o `generate wait`.

## Ejemplos

**Imagen** (GPT Image 2.5, recomendado para diseño y texto dentro de la imagen):

```bash
higgsfield generate create gpt_image_2_5 \
  --prompt "clean infographic showing global energy mix, flat icons, muted palette" \
  --aspect_ratio 3:4 --quality high --resolution 2k --wait
```

**Video desde un fotograma** (Kling v3.0):

```bash
higgsfield generate create kling3_0 \
  --prompt "slow camera push through a forest clearing at dawn" \
  --start-image ./first.png \
  --duration 5 --mode pro --sound off --wait
```

**Video desde texto** (Seedance 2.5):

```bash
higgsfield generate create seedance_2_5 \
  --prompt "drone shot over a mountain valley at sunrise" \
  --aspect_ratio 16:9 --duration 5 --resolution 1080p --mode t2v --wait
```

**Texto a voz**:

```bash
higgsfield voices list
higgsfield generate create text2speech_v2 \
  --prompt "Hola desde Higgsfield" \
  --variant elevenlabs --voice_type preset --voice_id <voice_id> --wait
```

**Predicción de viralidad** de un video terminado (gancho, atención, retención):

```bash
higgsfield generate create brain_activity --video ./ad.mp4 --wait
```

## Modelos

`higgsfield model list` da el catálogo vivo; [MODELS.md](https://github.com/higgsfield-ai/cli/blob/main/MODELS.md) documenta parámetros y valores por modelo.

| Tipo | Algunos `job_set_type` |
| --- | --- |
| Imagen (23) | `nano_banana_2` (Nano Banana Pro), `nano_banana_2_lite`, `gpt_image_2_5`, `text2image_soul_v2` (Soul V2), FLUX.2… |
| Video (22) | `veo3_1`, `veo3_1_lite`, `kling3_0`, `seedance_2_5`, `wan2_7`, `minimax_hailuo`, `grok_video_v15`, `gemini_omni`, `cinematic_studio_video_3_5`, `video_background_remover` |
| 3D (5) | `image_to_3d`, `multi_image_to_3d`, `tripo_3d` (texto a 3D), `sam_3_3d`, `3d_rigging` |
| Audio (5) | `seed_audio`, `sonilo_music`, `mirelo_text_to_audio`, `text2speech_v2`, `inworld_text_to_speech` |
| Análisis | `brain_activity` (Virality Predictor) |

## Workflows

Flujos de más alto nivel con su propio esquema de parámetros:

```bash
higgsfield workflow list
higgsfield workflow get reframe --json

# Cambiar la relación de aspecto de un video
higgsfield generate workflow reframe --video ./source.mp4 --aspect-ratio 9:16 --resolution 720p --wait

# Editar un video dibujando sobre un fotograma
higgsfield generate workflow draw_to_video --video ./source.mp4 --sketch ./frame.png \
  --timestamp 3.2 --prompt "make the jacket red" --wait

# Cambiar la voz o doblar a otro idioma (código ISO-639-3)
higgsfield generate workflow voice-change --video ./source.mp4 --voice_type preset --voice_id <id> --wait
higgsfield generate workflow dubbing --video ./source.mp4 --target_language spa --wait

# Estimar el coste antes (no disponible para voice-change ni dubbing)
higgsfield generate cost workflow reframe --duration 7.1 --resolution 1080p
```

## Personajes consistentes: Soul ID

Entrena un personaje una vez con varias fotos y reutilízalo en cualquier modelo compatible:

```bash
higgsfield soul-id create --name me --soul-2 --image ./me1.jpg --image ./me2.jpg --image ./me3.jpg
higgsfield soul-id wait <soul_id>
higgsfield generate create text2image_soul_v2 --prompt "professional portrait, soft daylight" --soul-id <soul_id> --wait
```

Sube solo fotos propias o de personas que hayan dado permiso.

## Comandos

| Comando | Para qué |
| --- | --- |
| `auth` | login / logout / inspeccionar el token |
| `account` | Créditos y transacciones |
| `workspace` | Elegir el workspace que se factura |
| `model` | Listar modelos e inspeccionar su esquema |
| `generate` | `create` / `cost` / `wait` / `get` / `list` de trabajos |
| `workflow` | Listar workflows e inspeccionar su esquema |
| `preset` | Estilos y acciones gestionados por el servidor |
| `upload` | Subir imagen, video o audio |
| `voices` | Voces para TTS y cambio de voz |
| `soul-id` | Entrenar y gestionar personajes Soul |
| `marketing-studio` | Anuncios de marca (avatares, productos, brand kits, formatos) |
| `product-photoshoot` | Fotografía de producto |
| `website` | Crear y desplegar sitios (React 19 + TanStack Start sobre Cloudflare Workers) |
| `game` | Desplegar y publicar juegos de navegador |
| `version` | Información de la build |

Flags globales: `--wait`, `--wait-timeout` (10 min por defecto), `--wait-interval` (3 s), `--json` y `--no-color`.

## Automatizar

Con `--json` la salida se procesa con `jq`:

```bash
higgsfield generate list --json | jq -r '.[] | select(.status=="completed") | .result_url'
```

Para agentes: expón la CLI en el entorno, fija un workspace con presupuesto, pide que estime el coste antes de lanzar lotes y que use `--json` para no depender del texto de consola.

## Actualizar y desinstalar

```bash
npm install -g @higgsfield/cli@latest     # o: brew update && brew upgrade higgsfield
npm uninstall -g @higgsfield/cli          # o: brew uninstall higgsfield
```

Si aparece `Session expired` o `Not authenticated`, los tokens son de vida corta: vuelve a `higgsfield auth login`. `Unknown model` significa que el nombre cambió; consulta `higgsfield model list`.

## Fuentes

- [Higgsfield CLI](https://higgsfield.ai/cli) · [Repositorio](https://github.com/higgsfield-ai/cli) · [MODELS.md](https://github.com/higgsfield-ai/cli/blob/main/MODELS.md)
- [Paquete npm @higgsfield/cli](https://www.npmjs.com/package/@higgsfield/cli)
