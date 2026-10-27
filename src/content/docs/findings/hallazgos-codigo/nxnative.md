---
title: "nxnative: juegos de Switch como apps nativas de iPhone, iPad y Mac"
description: "Herramienta MIT que convierte los NSP de un juego de Switch en una IPA sin firmar o en una app de Mac: reescribe el código ARM64 del juego, sustituye el sistema de la consola por una capa propia y traduce los gráficos de NVN a Metal."
tags: [nintendo-switch, ios, macos, metal, videojuegos, compatibilidad, ingenieria-inversa, sideload, ryujinx]
sidebar:
  order: 18
draft: false
resourceCategory: Repositorio oficial
official: true
url: https://github.com/seedds/nxnative
technologies:
  - findings/hallazgos-codigo/anyps5
note: "Proyecto de octubre de 2026, MIT y en desarrollo muy rápido. Necesitas un Mac (macOS 26.6+, Xcode 27.1) para empaquetar, y para jugar un iPhone 15 Pro o posterior, un iPad con M1 o posterior (iOS/iPadOS 26+) o un Mac con Apple silicon."
warnings:
  - "Usa solo juegos que hayas comprado, volcados de tu propia consola. El repositorio no incluye juegos ni claves; descargar NSP o un prod.keys de terceros es piratería."
  - "Extraer prod.keys y volcar juegos exige saltarse las protecciones de la Switch. Eso tiene regulación propia en muchos países (DMCA en EE. UU., Directiva de derechos de autor en la UE) incluso con copias legítimas, y Nintendo litiga activamente contra este tipo de proyectos."
  - "La IPA sale sin firmar y se instala por sideload. Sin la capacidad Increased Memory Limit, iOS da unos 3,4 GB a la app y cierra los juegos más grandes."
updatedAt: 2026-10-27
---

## En pocas palabras

[nxnative](https://github.com/seedds/nxnative) convierte un juego de Nintendo Switch que ya tienes en una **app nativa de Apple**. Le das los archivos NSP del juego (base, actualización y DLC) y tus claves `prod.keys`, y un script de Python genera una IPA que instalas en el iPhone o el iPad por sideload, o una app de Mac.

Su README insiste en que **no es un emulador**: el código del juego se ejecuta directamente en el chip de Apple y los gráficos de la Switch se reconstruyen sobre Metal. Se publica bajo **licencia MIT**, está escrito sobre todo en Objective-C y C con herramientas en Python, y ronda las 7.000 estrellas apenas dos semanas después de crearse.

## Emulador frente a ejecución nativa

- Un **emulador** como Ryujinx o yuzu carga el juego en un programa que imita la consola en tiempo de ejecución.
- nxnative hace el trabajo **antes**, en el Mac: reescribe los módulos ejecutables del juego y los enlaza en una app normal de iOS o macOS.

Es posible porque la Switch usa una CPU **ARM64**, la misma arquitectura que los chips A y M de Apple: las instrucciones del juego ya se entienden, lo que falta es todo lo que el juego espera de la consola. Es la misma idea que [AnyPS5](/findings/hallazgos-codigo/anyps5) aplica a la PS5 sobre x86-64.

El enfoque no es original de nxnative: el README reconoce que empezó como una copia de las partes genéricas de [d2r-mobile](https://github.com/jhaizhou-ops/d2r-mobile), un proyecto que hizo lo mismo para Diablo II: Resurrected.

## Cómo funciona

| Pieza                                   | Qué hace                                                                                                                         |
| --------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| Reescritor de NSO (`dm/tools/patch_nso.py`) | Procesa cada módulo ejecutable del juego (formato NSO) para que pueda vivir dentro de una app de Apple                        |
| Host (`dm/host`)                        | Sustituye al núcleo Horizon y a los servicios del sistema: hilos, memoria, archivos y partidas, mandos, audio, vídeo y teclado   |
| Gráficos (`dm/gfx`)                     | Implementa NVN, la API gráfica de la Switch, sobre Metal. Los juegos que usan Vulkan u OpenGL tienen capas propias               |
| Shaders                                 | El traductor de shaders de Ryujinx pasa los shaders de la GPU Maxwell a SPIR-V, y SPIRV-Cross los convierte a Metal Shading Language |
| App de iOS                              | Una IPA para iPhone y iPad con el código reescrito, las bibliotecas de shaders, el RomFS (los recursos del juego) y un lanzador de ajustes |

Dos conceptos útiles: **HLE** (_high-level emulation_) significa reimplementar el comportamiento de las funciones del sistema en lugar de simular el hardware que las ejecuta, y eso es lo que hace el host. El **RomFS** es el sistema de archivos de solo lectura con los recursos del juego; nxnative lo empaqueta como una imagen que la app lee sin descomprimir.

## Compatibilidad real

El README muestra unos 80 juegos probados en Mac o iPhone, entre ellos Mario Kart 8 Deluxe, Super Mario Odyssey, Zelda: Breath of the Wild y Tears of the Kingdom, Pokémon Escarlata, Hades o Celeste. Unos 20 corren a **60 FPS** (frente a 30 en la Switch) con una versión concreta del juego, como Breath of the Wild 1.9.0 o Tears of the Kingdom 1.4.3. Cada juego se probó en una sola versión: con otra, se empaqueta igual pero los ajustes de 60 FPS no se aplican.

Los requisitos de hardware vienen de las texturas comprimidas en formato BC, que los iPhone anteriores al A17 Pro no leen. Los juegos fuera de la lista no están soportados: el script intenta igualmente generar una IPA, pero puede no arrancar.

Problemas conocidos según el README: sin amiibo ni funciones en línea, y errores gráficos menores en algunos títulos.

## Uso

En un Mac con macOS 26.6 o posterior, Xcode 27.1, Homebrew y Python 3.12 o posterior:

```bash
xcodebuild -downloadComponent MetalToolchain
git clone https://github.com/seedds/nxnative.git && cd nxnative
brew install xcodegen zstd glslang
brew install --cask dotnet-sdk
python3 -m pip install lz4 capstone fonttools "backports.zstd; python_version < '3.14'"
```

Pon los NSP de un juego en una carpeta (también acepta XCI, NSZ y XCZ) y ejecuta:

```bash
python3 scripts/build_ipa_from_nsp.py ~/Games/MarioWonder -k ~/keys/prod.keys
```

La primera compilación tarda de 30 a 60 minutos y necesita libre unas dos veces el tamaño de los NSP más 10 GB. La IPA aparece en la misma carpeta y se instala con AltStore, Sideloadly, LiveContainer u otra herramienta de sideload. Con `--platform mac-app` sale una app de Mac en su lugar, y con una cuenta de Apple Developer puedes generar un proyecto de Xcode con `--prepare-xcode`.

Si prefieres no usar la terminal, [NX2Apple](https://github.com/LNPANDY/NX2Apple) es una app de Mac de la comunidad que ejecuta el mismo proceso. Es un proyecto aparte.

## Cuándo conviene y cuándo no

Es interesante como caso de estudio: un cargador que reescribe binarios, una reimplementación del sistema operativo de una consola y una cadena real de traducción de shaders, todo documentado en [docs/development.md](https://github.com/seedds/nxnative/blob/main/docs/development.md).

No es una forma cómoda de jugar: exige un Mac, un dispositivo reciente, una consola de la que volcar tus juegos y claves, y una herramienta de sideload. Si solo quieres jugar a tu biblioteca de Switch, la consola sigue siendo lo sencillo.

## Alternativas

| Proyecto                                                    | Enfoque                                                              |
| ----------------------------------------------------------- | -------------------------------------------------------------------- |
| [d2r-mobile](https://github.com/jhaizhou-ops/d2r-mobile)     | La misma técnica, pero solo para Diablo II: Resurrected              |
| [NX2Apple](https://github.com/LNPANDY/NX2Apple)             | Interfaz gráfica para Mac sobre el proceso de nxnative               |
| Emuladores de Switch                                        | Ejecutan cualquier juego en tiempo de ejecución, con más coste de rendimiento |

## Aspectos legales

El proyecto no está afiliado a Nintendo y no incluye nada de ningún juego. La responsabilidad sobre lo que conviertas es tuya:

1. Usa solo juegos que hayas comprado y volcado tú. Descargar NSP o claves es piratería, se use la herramienta que se use.
2. `prod.keys` son las claves criptográficas de tu consola. Obtenerlas, y volcar los juegos, requiere una Switch con un exploit, y saltarse medidas anticopia puede ser ilegal en tu país aunque la copia sea legítima.
3. Nintendo ha llevado a juicio a proyectos de este ámbito: en 2024 los desarrolladores del emulador yuzu cerraron el proyecto tras un acuerdo con la compañía. Ten en cuenta que un repositorio así puede desaparecer.

## Fuentes

- [Repositorio y README de nxnative](https://github.com/seedds/nxnative)
- [Documentación de desarrollo](https://github.com/seedds/nxnative/blob/main/docs/development.md)
- [Notas por juego](https://github.com/seedds/nxnative/blob/main/dm/games/README.md)
- [d2r-mobile](https://github.com/jhaizhou-ops/d2r-mobile)
- [NX2Apple](https://github.com/LNPANDY/NX2Apple)
