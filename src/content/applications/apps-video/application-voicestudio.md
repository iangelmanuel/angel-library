---
title: "VoiceStudio — clonación, transcripción y doblaje de voz en local"
description: "Aplicación abierta para clonar y diseñar voces, transcribir audio, doblar video y producir audiolibros en el propio equipo, sin cuenta ni pago por uso."
type: guides
order: 2
tags: [voicestudio, audio, voz, transcripcion, doblaje, tts, open-source, ia-local]
website: https://voicestudio.sh/
github: https://github.com/debpalash/VoiceStudio
updatedAt: 2026-09-04
---

**VoiceStudio** es un estudio de voz con inteligencia artificial que se ejecuta en el propio equipo. Reúne clonación y diseño de voces, texto a voz, transcripción, dictado, doblaje de video y producción de audiolibros en una sola aplicación.

Su propuesta es **local-first**: no exige cuenta, API key, suscripción ni pago por carácter para usar la aplicación local. Los proyectos, las muestras y los resultados permanecen en el equipo, aunque la primera instalación y la descarga de modelos sí necesitan internet.

## Funcionalidad principal

| Función                 | Qué resuelve                                                                  |
| ----------------------- | ----------------------------------------------------------------------------- |
| Clonación de voz        | Genera una voz a partir de una muestra de audio corta                         |
| Diseño de voz           | Crea voces mediante indicaciones de edad, acento, tono y estilo               |
| Texto a voz             | Convierte guiones en audio con distintos motores, voces e idiomas             |
| Transcripción y dictado | Convierte audio o voz en directo a texto y subtítulos                         |
| Doblaje de video        | Transcribe, traduce, separa hablantes, sintetiza voces y exporta el resultado |
| Audiolibros             | Importa EPUB o PDF, asigna voces y genera capítulos o un archivo `.m4b`        |
| API local               | Integra síntesis y transcripción mediante una API compatible con OpenAI       |

El catálogo reúne **646 idiomas** entre todos los motores disponibles. Esto no significa que cada motor admita todos los idiomas ni que la calidad sea idéntica: conviene elegir el modelo según el idioma, la licencia, la memoria disponible y si se necesita clonación.

## Instalación

La forma recomendada es entrar en la **[página oficial de descargas](https://voicestudio.sh/download)** y elegir el paquete estable para el sistema operativo. Las versiones publicadas también están disponibles en [GitHub Releases](https://github.com/debpalash/VoiceStudio/releases/latest).

| Plataforma | Distribución oficial                   | Requisito principal                                      |
| ---------- | -------------------------------------- | -------------------------------------------------------- |
| Windows    | Instalador MSI                         | Windows 10 u 11 de 64 bits                               |
| macOS      | Imagen DMG                             | macOS 13.3 o posterior; Apple Silicon para backend local |
| Linux      | AppImage                               | x86_64 con glibc 2.39 o posterior                        |
| Docker     | Interfaz web y API en el puerto `3900` | CPU, CUDA o ROCm según la imagen elegida                 |

En el primer inicio, VoiceStudio crea su entorno de Python y descarga el modelo predeterminado. Es normal que tarde y consuma varios gigabytes; las siguientes ejecuciones reutilizan esos archivos.

El repositorio está en beta activa y su rama principal puede ser inestable. Para uso cotidiano es mejor instalar la última versión estable que ejecutar directamente el código de desarrollo.

## Hardware

Como referencia, el proyecto recomienda **16 GB de RAM o más** y alrededor de **10 GB de espacio** para empezar. Una GPU es opcional: con CPU funciona, pero la generación tarda más; una GPU con al menos 4 GB de VRAM puede acelerar algunos motores. Instalar más modelos aumenta el espacio necesario.

## Flujo básico para clonar una voz

1. Abre la herramienta de clonación y añade una muestra limpia, sin música, eco ni varias personas hablando.
2. Usa entre 5 y 15 segundos como punto de partida; una muestra de tres segundos puede funcionar, pero ofrece menos contexto.
3. Escribe una frase corta, selecciona el idioma y el motor, y genera una prueba.
4. Revisa pronunciación, ritmo, similitud y artefactos antes de procesar un guion largo.

Una grabación más larga no siempre produce una voz mejor. La limpieza del audio, un volumen estable y una interpretación parecida al resultado buscado suelen importar más.

## Privacidad y licencias

El procesamiento principal puede hacerse en local, pero **local no siempre significa sin red**: los modelos se descargan de internet y funciones opcionales como trabajadores remotos o backends externos pueden enviar audio al servicio configurado. Antes de trabajar con material sensible, revisa qué motor y endpoint están activos.

La aplicación usa la licencia **AGPL-3.0**, pero cada modelo conserva su propia licencia. La licencia del programa no concede automáticamente permiso comercial sobre todos los pesos o voces; antes de publicar o monetizar un resultado hay que revisar los términos del motor elegido.

## Uso responsable

Clona una voz únicamente con autorización verificable de la persona y para el propósito acordado. Las muestras y los perfiles de voz deben tratarse como datos sensibles; limita su acceso, informa cuando una pieza pueda confundirse con una grabación real y elimina el material cuando deje de ser necesario.

## Cuándo encaja

- **Encaja** si necesitas mantener el audio en tu equipo, comparar varios motores o automatizar TTS y transcripción con una API local.
- **Encaja** si produces suficiente contenido como para preferir administrar modelos y hardware en vez de pagar por uso.
- **No encaja** si buscas resultados inmediatos sin descargar modelos, tienes poco disco o memoria, o necesitas soporte comercial con SLA.

VoiceStudio también ofrece servicios Pro y Cloud separados. No son necesarios para ejecutar la edición abierta en local, pero pueden tener condiciones y precios diferentes.
