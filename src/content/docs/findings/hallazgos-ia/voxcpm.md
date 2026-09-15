---
title: "VoxCPM: síntesis de voz y clonación local, sin tokens discretos"
description: "Modelo de TTS de 2B parámetros que genera audio a 48 kHz en 30 idiomas, diseña voces desde una descripción y clona a partir de una muestra, ejecutándose en tu GPU."
tags: [tts, voz, clonacion, modelo-local, python, gpu, openbmb]
sidebar:
  order: 18
draft: false
resourceCategory: ia
website: https://voxcpm.readthedocs.io/
url: https://github.com/OpenBMB/VoxCPM
note: "Que corra local no vuelve inocua la clonación: la muestra de voz de otra persona sigue siendo su voz, y aquí no hay ningún servicio que te frene."
updatedAt: 2026-09-14
---

> Publicado por **[OpenBMB](https://github.com/OpenBMB)** con licencia Apache-2.0, uso comercial permitido.

[VoxCPM](https://github.com/OpenBMB/VoxCPM) es un sistema de texto a voz **sin tokenizador**: en lugar de convertir el audio en símbolos discretos, genera representaciones continuas de voz mediante una arquitectura autorregresiva de difusión de extremo a extremo. En la práctica eso se traduce en prosodia más natural y menos artefactos de cuantización.

## El modelo

- **2.000 millones de parámetros**, sobre el backbone MiniCPM-4.
- Trabaja dentro del espacio latente de AudioVAE V2.
- Tubería de cuatro etapas: LocEnc → TSLM → RALM → LocDiT.
- Audio de salida a **48 kHz**.
- **30 idiomas**: árabe, chino, inglés, francés, alemán, japonés, coreano, español, vietnamita, tailandés y más.

## Tres modos de uso

| Modo                 | Qué necesita                                 | Para qué sirve                          |
| -------------------- | -------------------------------------------- | --------------------------------------- |
| Voice Design         | Solo una descripción en lenguaje natural     | Crear una voz que no existe             |
| Clonación controlada | Muestra de audio + guía de estilo            | Ajustar emoción, ritmo y tono           |
| Clonación completa   | Muestra de audio + su transcripción          | Reproducción más fiel de una voz        |

La prosodia se infiere del contexto: el mismo texto con distinta puntuación suena distinto.

## Instalación

```bash
pip install voxcpm
```

Requisitos: Python ≥3.10 y <3.13, PyTorch ≥2.5.0, CUDA ≥12.0. Unos **8 GB de VRAM**; en una RTX 4090 el factor de tiempo real ronda 0,30 (o ~0,13 con la optimización de Nano-vLLM), es decir, genera más rápido de lo que dura el audio.

```bash
voxcpm design --text "Tu texto" --output out.wav
voxcpm clone --text "Texto" --reference-audio voz.wav --output out.wav
python app.py --port 8808   # interfaz web
```

Los pesos están en [HuggingFace](https://huggingface.co/openbmb/VoxCPM2) y en ModelScope; hay un [playground](https://huggingface.co/spaces/OpenBMB/VoxCPM-Demo) para escucharlo antes de instalar nada.

## Lo que el propio proyecto prohíbe

Los autores **prohíben expresamente** usar la clonación para suplantación, fraude o desinformación, y recomiendan marcar con claridad todo contenido generado por IA.

Traducido a decisiones concretas:

- Clonar una voz exige el consentimiento de la persona, por escrito si el uso es público.
- En varias jurisdicciones la voz es un dato biométrico y un rasgo de identidad: grabar y procesar muestras tiene reglas, aunque el modelo corra en tu máquina.
- Locuciones de atención al cliente, avisos o mensajes en nombre de alguien deberían indicar que la voz es sintética.
- La licencia Apache-2.0 permite el uso comercial del **modelo**; no te da ningún derecho sobre la voz que clones.

## Fuentes

- [Repositorio y README de VoxCPM](https://github.com/OpenBMB/VoxCPM)
- [Documentación](https://voxcpm.readthedocs.io/)
- [Pesos en HuggingFace](https://huggingface.co/openbmb/VoxCPM2)
- [Página de muestras](https://openbmb.github.io/voxcpm2-demopage/)
