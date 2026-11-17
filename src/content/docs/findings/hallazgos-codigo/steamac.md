---
title: "steamac: SteamOS oficial de Valve en una VM ligera para Mac con Apple Silicon"
description: "Lanzador open source (Apache-2.0) que arranca la imagen ARM64 de SteamOS para Steam Frame en una máquina virtual sobre Hypervisor.framework, con aceleración GPU vía Venus y MoltenVK, para jugar a tu biblioteca de Steam en macOS."
tags: [steamos, steam, macos, apple-silicon, videojuegos, maquina-virtual, proton, vulkan, moltenvk, libkrun]
sidebar:
  order: 22
draft: false
runtime: macOS 15+ en Apple Silicon
resourceCategory: Sitio oficial
official: true
website: https://fxgl.github.io/steamac/
github: https://github.com/fxgl/steamac
technologies:
  - devops/docker-conceptos/docker-contenedores-vs-vms
note: "Proyecto muy joven: el repositorio se creó en octubre de 2026 y publica versiones casi a diario (v1.9.15 el 16 de noviembre de 2026). Pide unos 150 GB libres para el disco de SteamOS. El código es Apache-2.0; SteamOS no se distribuye con él."
warnings:
  - "SteamOS se descarga de los servidores de Valve tras aceptar su EULA («End User License Agreement for SteamOS and Steam Client Back-Up Image»): uso personal y sin redistribución. No es un proyecto de Valve ni está respaldado por ella."
  - "Los juegos con anti-trampas que bloquean máquinas virtuales no funcionan. DirectX 12 está limitado (feature level 12_0 u 11_0 y shader model 6.0), así que muchos títulos modernos no arrancan."
  - "Los informes de fallos y diagnósticos se envían por defecto al servidor Sentry de los desarrolladores. Desactívalo en Settings → General si no lo quieres. Las estadísticas de juego solo se envían si das tu consentimiento."
  - "La app se distribuye como DMG firmado y notarizado por FX GAMES FZ LLC, con autoactualización. Ejecuta un hipervisor con permisos amplios: si prefieres no confiar en el binario, compílalo desde el código fuente."
updatedAt: 2026-11-16
---

## En pocas palabras

[steamac](https://github.com/fxgl/steamac) (la app se llama **FX Steam Launcher**) ejecuta el **SteamOS ARM64 oficial de Valve**, la imagen que Valve publica para su visor Steam Frame, dentro de una **máquina virtual ligera** en un Mac con Apple Silicon. Dentro de esa VM corre Steam con Proton, así que puedes instalar y jugar títulos de Windows con DirectX y aceleración por GPU.

Lo publica FX GAMES FZ LLC (usuario [fxgl](https://github.com/fxgl)) con **licencia Apache-2.0**. Tiene unas 2.700 estrellas, más de 460 commits y una web con estadísticas de compatibilidad por juego.

## Qué problema resuelve

Steam para macOS solo ejecuta los juegos con versión nativa de Mac, que son una minoría. Las opciones habituales para el resto pasan por capas de traducción como Wine o CrossOver dentro de macOS.

steamac toma otro camino: en lugar de traducir Windows a macOS, arranca el sistema completo que Valve ya prepara para hardware ARM, con su Proton y su emulador x86, y resuelve la parte difícil, que es llevar la GPU de la VM hasta Metal.

## Conceptos previos

- **Máquina virtual (VM)**: un sistema operativo completo que corre aislado sobre otro gracias a un hipervisor. Ver [contenedores frente a VMs](/devops/docker-conceptos/docker-contenedores-vs-vms).
- **Proton**: la capa de compatibilidad de Valve, basada en Wine, que ejecuta juegos de Windows en Linux. DXVK y vkd3d-proton traducen DirectX 9–11 y 12 a Vulkan.
- **FEX**: emulador que traduce instrucciones x86 a ARM64. Los juegos de Windows son x86; el Mac y esta SteamOS son ARM.
- **Venus**: un protocolo que serializa las llamadas Vulkan de la VM y las ejecuta en la GPU del anfitrión.
- **MoltenVK**: implementación de Vulkan sobre Metal, la API gráfica de Apple.

## Cómo funciona

La cadena gráfica, según el README:

```text
juego (DX9/10/11) ─ DXVK (Proton 11, x86 vía FEX) ─ Vulkan
   └─ Mesa Venus (invitado) ─ virtio-gpu
        └─ libkrun ─ virglrenderer (Venus) ─ MoltenVK | KosmicKrisp ─ Metal
```

| Pieza                | Papel                                                                                              |
| -------------------- | -------------------------------------------------------------------------------------------------- |
| libkrun              | VM ligera sobre Hypervisor.framework de macOS (no usa Asahi Linux ni arranque nativo)              |
| virglrenderer + Venus | Lleva Vulkan desde la VM hasta el anfitrión                                                       |
| MoltenVK (fork de UTM) | Vulkan sobre Metal, con parches para geometry shaders y otras funciones que pide DXVK. KosmicKrisp es una alternativa experimental en macOS 26+ |
| Kernel propio        | Linux con soporte de Apple TSO para que FEX emule x86 con el modelo de memoria correcto            |
| Capa sobre `/usr`    | Ajustes para que la imagen del visor arranque en una VM, sin incluir archivos de Valve             |
| Lanzador (Swift)     | Ventana Metal, teclado, ratón, mandos (Xbox, DualSense, DualShock 4), sonido por CoreAudio y red   |

La imagen de SteamOS se descarga de Valve como paquete RAUC firmado y el lanzador verifica la firma y el sha256. Las actualizaciones A/B y la reversión de SteamOS funcionan como en el hardware de Valve.

## Instalación

Requisitos para usar la app: Mac con Apple Silicon, macOS 15 o superior y unos 150 GB libres (el disco es disperso, no ocupa todo de golpe). No funciona dentro de una VM de macOS porque necesita Hypervisor.framework en el Mac físico.

1. Descarga el DMG desde la [web](https://fxgl.github.io/steamac/) o desde las [releases](https://github.com/fxgl/steamac/releases) y mueve la app a Aplicaciones.
2. En la primera ejecución elige **Create New Disk…**, acepta el EULA de SteamOS y el Steam Subscriber Agreement, y espera a que se descargue y prepare el disco.
3. Inicia sesión en Steam. El lanzador usa por defecto el cliente ARM64 de Steam Deck, que permite entrar con un código QR desde la app móvil de Steam.

Para compilarlo tú hacen falta Xcode 26+, Homebrew, rustup y OrbStack o Docker con arm64 para construir el kernel, Mesa y el disco:

```bash
./build.sh
./run.sh
```

## Características

- Resolución de la VM igual al tamaño de la ventana, con MetalFX opcional.
- Mandos con vibración y DualSense por HID directo.
- Modo Escritorio de SteamOS (Plasma), carpeta compartida con el Mac y portapapeles.
- Streaming opcional a otros dispositivos con [Moonlight](https://moonlight-stream.org/), desactivado por defecto.
- Perfiles por juego y suspensión de la VM.

## Cuándo conviene y cuándo no

Conviene si tienes un Mac con Apple Silicon reciente, una biblioteca de Steam con juegos de Windows DX9–DX11 sin anti-trampas y ganas de probar un proyecto en desarrollo activo.

No conviene si dependes de juegos competitivos con anti-trampas, de títulos exigentes en DirectX 12 o de un sistema estable: los propios desarrolladores documentan cierres, compilación de shaders en la primera partida y funciones aún no verificadas en hardware real.

## Alternativas

| Opción                      | Diferencia                                                                                  |
| --------------------------- | ------------------------------------------------------------------------------------------- |
| Steam nativo para macOS     | Solo juegos con versión de Mac, pero sin VM ni emulación                                    |
| CrossOver / Wine en macOS   | Traduce los juegos de Windows directamente en macOS, sin SteamOS                            |
| Game Porting Toolkit de Apple | Herramienta de Apple para evaluar ports; la usan otras capas comunitarias                  |
| Streaming desde un PC       | Steam Remote Play o Moonlight desde un PC con Windows o Linux: máxima compatibilidad, necesita otra máquina |

## Límites y precauciones

- **Legal.** El proyecto no redistribuye SteamOS. Tú lo descargas de Valve y aceptas su licencia de uso personal. Steam, SteamOS y Steam Frame son marcas de Valve; steamac no está afiliado.
- **Compatibilidad.** El README lista lo verificado (por ejemplo Death's Door y Heroes of Might and Magic: Olden Era) y una página de [estadísticas por juego](https://fxgl.github.io/steamac/games.html) alimentada por usuarios. Consúltala antes de contar con un título.
- **Rendimiento.** La primera vez que aparece un efecto el juego se atasca entre 50 y 100 ms mientras Metal compila el shader; después queda cacheado.
- **Privacidad.** Sentry está activado por defecto y envía trazas de fallos y algunos errores, incluido código de shaders. Se puede apagar en ajustes o con `--no-crash-reports`.
- **Cliente de Steam Frame.** La opción `frame` usa el cliente beta de Valve para el visor; la opción por defecto, `deck`, es el cliente público ARM64 de Steam Deck.

## Fuentes

- [Repositorio y README](https://github.com/fxgl/steamac)
- [Web del proyecto](https://fxgl.github.io/steamac/)
- [Releases](https://github.com/fxgl/steamac/releases)
- [Licencia Apache-2.0](https://github.com/fxgl/steamac/blob/main/LICENSE)
- [Página de descarga de SteamOS para Steam Frame (Valve)](https://store.steampowered.com/steamos/download/?ver=steamframe)
