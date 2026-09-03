---
title: "Fastpotify — cliente de Spotify nativo y ligero"
description: "Cliente de escritorio de Spotify escrito en Rust que reproduce con librespot; explica su instalación por sistema operativo, sus requisitos y qué gana frente a la app oficial."
type: guides
order: 1
tags: [spotify, rust, escritorio, musica, librespot, rendimiento]
website: https://fastpotify.rocks
github: https://github.com/crmne/fastpotify
updatedAt: 2026-09-01
---

> Creado por **[crmne](https://github.com/crmne)**, licencia MIT. Escrito en Rust.

**Fastpotify** es un cliente de escritorio de Spotify sin motor de navegador dentro. La app oficial es una aplicación web empaquetada; esta está escrita en **Rust** con la interfaz **egui** y reproduce mediante **librespot**, la implementación abierta del protocolo de Spotify.

La diferencia se nota en dos números: **100–250 MB de RAM** frente a los 600 MB–1 GB habituales del cliente oficial, y un arranque por debajo del segundo.

## Qué necesitas antes de instalar

**Spotify Premium** para reproducir. Con una cuenta gratuita puedes navegar el catálogo y buscar, pero no suena — ni en este equipo ni enviándolo a otro dispositivo. La primera vez pide una autorización desde el navegador para habilitar el streaming en el equipo.

## Instalación

### macOS

```bash
brew install --cask crmne/tap/fastpotify
```

### Arch Linux

```bash
yay -S fastpotify-bin
```

`fastpotify-bin` trae el binario ya compilado. Existen también `fastpotify` (compila desde el código) y `fastpotify-git` (último commit).

### Windows

No hay paquete en winget, Scoop ni Chocolatey: se descarga desde la
[página oficial de descargas](https://fastpotify.rocks/download/#windows), que
ofrece dos formas.

**Instalador**, que **no pide permisos de administrador**. Elige el archivo según
el procesador del equipo:

- `fastpotify-v0.5.0-x86_64-pc-windows-msvc-setup.exe` — la mayoría de los PC.
- `fastpotify-v0.5.0-aarch64-pc-windows-msvc-setup.exe` — Windows sobre ARM.

**Portable**, un `.zip` que se descomprime y se ejecuta sin instalar nada. Útil
para probarlo o llevarlo en una memoria USB.

Al abrirlo por primera vez, **SmartScreen avisará de un editor desconocido**
porque el binario no está firmado. Es el aviso normal de Windows ante un
ejecutable sin certificado de firma: pulsa _Más información_ y después _Ejecutar
de todas formas_. Descarga siempre desde el sitio oficial o desde las releases
del repositorio; ese aviso es precisamente el que conviene no ignorar cuando el
archivo viene de otro sitio.

### Desde el código, en cualquier sistema

Necesita **Rust 1.95 o superior**:

```bash
cargo install --path . --locked
```

Para dejar fuera el visualizador MilkDrop, que es lo que más tarda en compilar:

```bash
cargo install --path . --locked --no-default-features
```

En Linux hay que instalar antes las librerías de audio y de ventana:

```bash
# Debian / Ubuntu
sudo apt install libasound2-dev libpulse-dev libxkbcommon-dev libwayland-dev \
  cmake clang libclang-dev

# Fedora
sudo dnf install alsa-lib-devel pulseaudio-libs-devel libxkbcommon-devel \
  wayland-devel cmake clang libclang-devel

# Arch
sudo pacman -S --needed alsa-lib libpulse libxkbcommon wayland cmake clang
```

Para que se vean bien los títulos en otros alfabetos, añade los paquetes `noto-fonts` y `noto-fonts-cjk`.

## Qué hace

- **Reproduce en local** como dispositivo de Spotify Connect, sin cortes entre canciones y hasta 320 kbps.
- **Controla otros dispositivos**: altavoces, el móvil u otro ordenador.
- **Descubre dispositivos en la red** por mDNS, incluidos otros librespot, spotifyd y hardware compatible.
- **Navega la biblioteca** completa: playlists, canciones que te gustan, álbumes, artistas y podcasts.
- **Edita playlists**: crearlas, reordenarlas y compartirlas en modo colaborativo.
- **Retoma la sesión** donde la dejaste, con su cola en un panel lateral o en página propia.
- **Registra los enlaces `spotify:`** para abrirlos desde el sistema.
- **Se integra con el escritorio**: MPRIS en Linux, teclas multimedia y bandeja del sistema.
- **Trae extras de nostalgia**: mini reproductor estilo Winamp con skins `.wsz`, ecualizador de 10 bandas y visualizador MilkDrop con más de 10.000 presets, en proceso aparte.

## Atajos de teclado

| Atajo               | Acción                             |
| ------------------- | ---------------------------------- |
| `Espacio`           | Reproducir / pausar                |
| `Ctrl+←` / `Ctrl+→` | Canción anterior / siguiente       |
| `Ctrl+↑` / `Ctrl+↓` | Subir / bajar volumen              |
| `Ctrl+F` o `/`      | Buscar                             |
| `Ctrl+B`            | Mostrar u ocultar la barra lateral |
| `Ctrl+M`            | Mini reproductor Winamp            |
| `Ctrl+Shift+K`      | Visualizador MilkDrop              |
| `Ctrl+,`            | Ajustes                            |
| `Ctrl+/` o `?`      | Ver todos los atajos               |

En macOS se usa `Cmd` en lugar de `Ctrl`.

## Controlarlo desde la terminal

En macOS y Windows el propio binario acepta órdenes:

```bash
fastpotify play-pause
fastpotify next
fastpotify volume 40
fastpotify like
fastpotify devices
fastpotify now-playing
```

En Linux se controla con `playerctl`, porque expone MPRIS como cualquier otro reproductor del sistema.

## Configuración

Todo vive en un único JSON — en Linux, `~/.config/fastpotify/settings.json` — con el nombre del dispositivo Connect, el bitrate, la normalización de volumen, el autoplay, la reproducción sin cortes, el backend de audio (PulseAudio/PipeWire o ALSA), el tamaño de la caché, el tema y la skin del mini reproductor.

Las cachés se pueden borrar cuando quieras: no arrastran la sesión, así que no tendrás que volver a autenticarte.
