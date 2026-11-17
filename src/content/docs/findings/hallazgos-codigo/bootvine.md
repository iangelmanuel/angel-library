---
title: "bootvine: el arranque de Linux como un árbol vivo de servicios"
description: "Programa en Rust (GPL-3.0-or-later) que sustituye la pared de logs del arranque por un árbol en consola con los servicios pendientes de systemd u OpenRC, una línea de tiempo de los más lentos y el motivo de cada fallo."
tags: [linux, systemd, openrc, arranque, initramfs, consola, tui, rust, nixos, arch]
sidebar:
  order: 23
draft: false
language: Rust
runtime: Linux con systemd ≥ 246 u OpenRC
resourceCategory: Repositorio oficial
official: true
url: https://codeberg.org/wvhulle/bootvine
note: "Versión 0.1.x (primera release el 30 de octubre de 2026). Licencia GPL-3.0-or-later. Está en los repositorios oficiales de Arch (`extra`) y tiene módulo para NixOS; en el resto de distribuciones se compila con Cargo."
warnings:
  - "Para ver el arranque desde el initrd se instala un hook en dracut o mkinitcpio y se regenera la imagen de arranque. Un initramfs roto puede dejar el sistema sin arrancar: conserva un kernel o una entrada de arranque de respaldo y un medio live antes de probarlo."
  - "Mientras dibuja, baja el nivel de log del kernel en consola a 1 y silencia los mensajes de estado de systemd. Si algo se cuelga, pulsa `q`, `Ctrl-C` o `Esc` para recuperar la salida normal."
  - "Actúa como agente de contraseñas de systemd y responde, entre otros, al desbloqueo LUKS del disco. Es un proyecto nuevo: valóralo antes de ponerlo en un equipo con cifrado completo."
updatedAt: 2026-11-16
---

## En pocas palabras

[bootvine](https://codeberg.org/wvhulle/bootvine) cambia la forma en que ves arrancar Linux. En lugar de cientos de líneas `[ OK ] Started …` que pasan demasiado rápido para leerlas, muestra en la consola un **árbol con los servicios que aún están pendientes**, anidados según qué espera a qué. Lo que ya terminó desaparece del árbol, y en ese espacio aparece una línea de tiempo con los servicios más lentos.

Lo escribe Willem Vanhulle en Rust y lo publica en Codeberg con **licencia GPL-3.0-or-later**. Tiene unas 220 estrellas y su última versión, la 0.1.4, es del 14 de noviembre de 2026. Se inspira en [nix-output-monitor](https://github.com/maralorn/nix-output-monitor).

## Qué problema resuelve

El arranque estándar cuenta lo que pasa en orden cronológico, no en orden de dependencia. Si el sistema tarda, no sabes qué está esperando a qué; si algo falla, el mensaje se pierde entre el resto. Para averiguarlo acabas usando `systemd-analyze blame` o `journalctl` después.

bootvine muestra eso en vivo: qué unidad bloquea el arranque, cuánto lleva cada una y, si falla, por qué (código de salida, señal, timeout) junto con sus últimas líneas del journal.

## Conceptos previos

- **systemd**: el sistema de init de la mayoría de distribuciones. Arranca como PID 1 y lanza los servicios (**unidades**) respetando dependencias como `After=` y `Before=`.
- **OpenRC**: el sistema de init alternativo de Alpine, Gentoo, Artix o Devuan.
- **initrd / initramfs**: un sistema de archivos mínimo que el kernel carga en memoria antes de montar el disco real, por ejemplo para desbloquear un disco cifrado.
- **Stage 2**: el arranque del sistema real, después de cambiar del initrd al disco.

## Cómo funciona

No es un tema de Plymouth ni un parche del kernel: es un **servicio de systemd** que dibuja una interfaz de texto en `tty12` y lleva ese terminal al frente.

1. `bootvine.service` arranca en `sysinit.target` sin dependencias por defecto, así que empieza en paralelo con udev, alrededor de un segundo después del kernel.
2. Se conecta directamente a PID 1 por el socket privado `/run/systemd/private` (en el initrd aún no hay bus D-Bus) y se suscribe a las señales `JobNew`, `JobRemoved` y `PropertiesChanged`.
3. Construye el árbol a partir de las relaciones `After=`: cada unidad cuelga de la que la está esperando, empezando por el target por defecto (`graphical.target`, por ejemplo).
4. Sobrevive al cambio del initrd al disco real y se reconecta a systemd.
5. Cuando se alcanza el target, o cuando el gestor de sesión gráfico toma su terminal, devuelve la consola.

También sigue el apagado (`bootvine-shutdown.service`) y la reanudación tras hibernar. Usa bibliotecas en Rust puro (zbus para D-Bus y sdjournal para el journal), así que no necesita librerías del sistema.

Con OpenRC solo cubre el arranque, sin initrd y sin motivo detallado de los fallos, porque OpenRC no guarda journal.

## Pruébalo sin instalar

Con [Nix](https://nixos.org/download/) puedes arrancar una máquina NixOS de ejemplo en QEMU, con servicios lentos y fallidos, sin tocar tu sistema:

```bash
nix run git+https://codeberg.org/wvhulle/bootvine#sample-vm-slow-services
```

## Instalación

En Arch Linux:

```bash
sudo pacman -S bootvine
sudo systemctl enable bootvine
```

En NixOS hay un módulo: añade el flake a tus inputs, importa `bootvine.nixosModules.default` y activa `services.bootvine.enable = true;`.

En cualquier distribución con systemd (Debian, Ubuntu, Fedora, openSUSE…), desde el código fuente con Rust y un compilador de C:

```bash
cargo install --locked --git https://codeberg.org/wvhulle/bootvine bootvine
bootvine install
```

`bootvine install` copia el binario a `/usr/bin` y las unidades a `/usr/lib/systemd/system`, y pide `sudo` por su cuenta. Con eso ya ves stage 2 y el apagado. Para ver también el initrd hace falta un initramfs con systemd:

```bash
bootvine install --initrd dracut
sudo dracut --force
```

Con mkinitcpio, `bootvine install --initrd mkinitcpio`, añade `sd-bootvine` después de `systemd` en `HOOKS` de `/etc/mkinitcpio.conf` y ejecuta `sudo mkinitcpio -P`. Debian y Ubuntu con initramfs-tools no tienen systemd en el initrd, así que allí solo verás stage 2.

Para quitarlo, `bootvine uninstall`, y regenera el initramfs si instalaste el hook. La configuración (colores, tiempos) va en `/etc/bootvine.toml` y se valida con `bootvine check`.

## Cuándo conviene y cuándo no

Conviene si quieres entender qué frena tu arranque, si depuras servicios propios o si simplemente prefieres un arranque legible. También es útil en servidores con consola, porque muestra el motivo de un fallo sin entrar al journal.

No conviene en una máquina de producción que no puedes permitirte dejar sin arrancar, ni si ya usas Plymouth con una pantalla gráfica y no miras la consola.

## Alternativas

| Opción                      | Diferencia                                                                     |
| --------------------------- | ------------------------------------------------------------------------------ |
| Salida estándar de systemd  | Lista cronológica, sin jerarquía ni línea de tiempo                            |
| Plymouth                    | Pantalla gráfica de arranque que oculta los detalles en lugar de ordenarlos     |
| `systemd-analyze blame` / `critical-chain` | El mismo análisis, pero después de arrancar y no en vivo         |

## Límites y precauciones

- **Madurez.** Las cinco versiones publicadas son de octubre y noviembre de 2026. Espera cambios y algún fallo.
- **Requisitos.** systemd 246 o superior como PID 1, o OpenRC compilando con `--features openrc`. Necesita un terminal virtual: no sirve en entornos sin consola.
- **Emergencias.** Se aparta cuando systemd entra en `emergency.service` o `rescue.service` y deja en pantalla un resumen de lo que falló.
- **Respaldo.** Antes de regenerar el initramfs asegúrate de poder arrancar con otra entrada o con un USB live.

## Fuentes

- [Repositorio y README](https://codeberg.org/wvhulle/bootvine)
- [Guía de instalación](https://codeberg.org/wvhulle/bootvine/src/branch/main/docs/install.md)
- [Arquitectura](https://codeberg.org/wvhulle/bootvine/src/branch/main/docs/architecture.md)
- [Guía de la pantalla](https://codeberg.org/wvhulle/bootvine/src/branch/main/docs/guide.md)
- [Paquete en Arch Linux](https://archlinux.org/packages/extra/x86_64/bootvine/)
- [Licencia GPL-3.0-or-later](https://codeberg.org/wvhulle/bootvine/src/branch/main/LICENSE)
