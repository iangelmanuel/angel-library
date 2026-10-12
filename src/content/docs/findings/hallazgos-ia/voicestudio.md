---
title: "VoiceStudio: clonación de voz, doblaje y transcripción en local"
description: "App de escritorio de código abierto que reúne clonación y diseño de voz, doblaje de video, audiolibros, dictado y transcripción sobre varios motores TTS y ASR que corren en tu equipo, con API local y servidor MCP."
tags: [tts, voz, clonacion, doblaje, transcripcion, modelo-local, electron, mcp]
sidebar:
  order: 24
draft: false
resourceCategory: ia
official: true
website: https://voicestudio.sh/
github: https://github.com/debpalash/VoiceStudio
technologies:
  - findings/hallazgos-ia/voxcpm
  - ai/ai-fundamentos/ai-multimodal-privacidad
note: "La app es AGPL-3.0; cada modelo de voz tiene su propia licencia, a veces solo para uso no comercial. Con GPU NVIDIA usa CUDA y en Apple Silicon usa Metal; sin GPU funciona en CPU, más lento."
warnings:
  - "Clona solo voces de personas que hayan dado su consentimiento. Suplantar a alguien con su voz puede ser fraude, y en varias jurisdicciones la voz es un dato biométrico protegido."
  - "La licencia AGPL de la app no cubre los pesos de los modelos ni el audio que generas: revisa la licencia de cada motor antes de un uso comercial (audio.cpp con Breeze-TTS-2, por ejemplo, es solo para investigación y uso no comercial)."
  - "Los motores grandes piden mucha VRAM: con una GPU por debajo del mínimo del motor, la generación se va a memoria del sistema y puede ser más lenta que en CPU. En Windows, la aceleración de PyTorch solo funciona con NVIDIA."
  - "En Intel Mac solo funciona la interfaz, conectada a un backend remoto; Windows en ARM es experimental."
updatedAt: 2026-10-12
---

> Proyecto de **[debpalash](https://github.com/debpalash)** con licencia AGPL-3.0. Unas 59.000 estrellas en GitHub en octubre de 2026.

[VoiceStudio](https://github.com/debpalash/VoiceStudio) se presenta como una alternativa local a ElevenLabs: una aplicación de escritorio que junta en una sola interfaz las tareas habituales de voz con IA, ejecutando los modelos en tu propio hardware. Los servicios remotos son opcionales y la analítica de uso solo se activa si das tu consentimiento.

## Qué hace

| Área | Qué incluye |
| --- | --- |
| Clonación de voz | Crear una voz a partir de una grabación de referencia (se recomiendan 5–15 s de voz limpia; acepta hasta 75 s) |
| Diseño de voz | Describir una voz en texto (género, edad, tono, acento) y generarla sin muestra |
| Doblaje de video | Extraer el audio, separar la voz, transcribir, traducir y sintetizar cada segmento sincronizado |
| Producción | Historias, audiolibros, colas por lotes, "recetas" reutilizables y carpetas vigiladas |
| Dictado | Un widget flotante con transcripción en vivo |
| Audio | Aislamiento de voz, diarización (quién habla cuándo) y marca de agua de IA |
| Integración | API local y servidor MCP para agentes |

El README habla de **646 idiomas**, y la documentación del servidor MCP repite la cifra para la transcripción. Que un idioma esté soportado no garantiza la misma calidad en todos: en idiomas con pocos datos conviene probar antes de comprometerse.

## Motores

VoiceStudio no es un modelo, sino una capa sobre varios. El catálogo de la documentación lista **17 motores de síntesis** y **10 de transcripción**:

- **Síntesis (TTS)**: VoiceStudio/OmniVoice (por defecto), VoxCPM2, CosyVoice 3, IndexTTS 2.5, MOSS-TTS-Nano, MOSS-TTS-v1.5 (8B), dots.tts (2B), Confucius4-TTS, GPT-SoVITS, KittenTTS, Supertonic-3, PocketTTS, Sherpa-ONNX, MLX-Audio (Kokoro, CSM, Dia…), audio.cpp y dos variantes de OmniVoice (GGUF y subproceso).
- **Transcripción (ASR)**: WhisperX (por defecto), Faster-Whisper, MLX Whisper, PyTorch Whisper, Parakeet TDT y TDT v3, Moonshine, FunASR, Sherpa-ONNX para dictado en vivo y cualquier servidor compatible con OpenAI.

No todos clonan voces (KittenTTS y Supertonic-3 traen voces predefinidas) ni todos corren en todas las plataformas. Cada uno se instala aparte desde el gestor de modelos. VoxCPM2 tiene su propia entrada: [VoxCPM](/findings/hallazgos-ia/voxcpm).

Para el doblaje, la traducción puede hacerse con NLLB en local o con un proveedor de LLM que configures; en ese segundo caso, el texto sí sale de tu equipo.

## Instalación

En macOS o Linux:

```bash
curl -fsSL https://voicestudio.sh/install | sh
```

En Windows, desde PowerShell:

```powershell
irm https://voicestudio.sh/install | iex
```

También hay instaladores en [Releases](https://github.com/debpalash/VoiceStudio/releases/latest) (`.dmg`, `.exe`, `.AppImage`, `.deb`) e imágenes Docker (`ghcr.io/debpalash/voicestudio`, solo `linux/amd64`) para servidores sin interfaz.

Desde el código fuente, con Bun:

```bash
git clone https://github.com/debpalash/VoiceStudio.git
cd VoiceStudio
bun install
bun run setup:api
bun run dev
```

Antes de ejecutar un `curl | sh` de cualquier proyecto, abre el script y léelo.

## Hardware

| Equipo | Soporte |
| --- | --- |
| GPU NVIDIA (Windows / Linux) | Aceleración CUDA |
| Apple Silicon | Aceleración Metal (MPS) |
| Sin GPU dedicada | Funciona en CPU, más lento; instala PyTorch para CPU (unos 5 GB de disco) |
| Windows en ARM | Experimental, solo CPU |
| Intel Mac | Solo la interfaz, con backend remoto |

La guía de rendimiento da pistas útiles:

- La **primera generación** tras arrancar siempre es la más lenta (carga de pesos y compilación de kernels); mide a partir de la segunda.
- Por defecto solo mantiene **un motor TTS en memoria**; en equipos de 32 GB o más se puede desactivar para cambiar de motor sin recargar.
- Durante un doblaje, mueve el modelo TTS a CPU para dejar VRAM al de transcripción.
- Si algo va muy lento, revisa en Ajustes → Rendimiento si estás en `cuda`, `mps` o `cpu`: una actualización de drivers puede dejarte en CPU sin avisar.

## Para agentes

El servidor MCP se monta sobre el backend en `/mcp`: con la app abierta, un agente como Claude Code o Cursor puede usar herramientas como `generate_speech`, `clone_voice`, `design_voice` o `transcribe`. También se puede instalar como skill:

```bash
npx skills add debpalash/VoiceStudio
```

## Cuándo conviene

- Locuciones, audiolibros o doblajes de contenido propio sin pagar por minuto.
- Transcribir grabaciones que no deben salir de tu equipo.
- Probar y comparar varios motores TTS desde una sola interfaz.

Si solo necesitas un motor concreto en un script, instalar ese modelo directamente (por ejemplo, `pip install voxcpm`) es más ligero que toda la app.

## Consentimiento y licencias

El README es explícito: clona voces solo con permiso. En la práctica:

1. Pide consentimiento, por escrito si el uso va a ser público o comercial.
2. Marca el contenido generado como sintético; la app incluye una marca de agua de IA.
3. Revisa la licencia de cada modelo en el gestor de modelos: muestra avisos por fuente, pero el propio proyecto aclara que eso **no certifica** el permiso comercial.
4. Un doblaje de un video ajeno sigue necesitando los derechos del video original.

## Fuentes

- [Repositorio y README de VoiceStudio](https://github.com/debpalash/VoiceStudio)
- [Sitio oficial](https://voicestudio.sh/)
- [Catálogo de funciones y motores](https://github.com/debpalash/VoiceStudio/blob/main/docs/feature-catalog.md)
- [Guías por motor](https://github.com/debpalash/VoiceStudio/blob/main/docs/engines/README.md)
- [Guía de rendimiento](https://github.com/debpalash/VoiceStudio/blob/main/docs/performance.md)
- [Servidor MCP](https://github.com/debpalash/VoiceStudio/blob/main/docs/mcp.md)
