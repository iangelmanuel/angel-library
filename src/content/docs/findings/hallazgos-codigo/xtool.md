---
title: "xtool: compilar e instalar apps de iOS desde Linux y Windows"
description: "Sustituto multiplataforma de Xcode, open source y MIT, que compila un paquete SwiftPM como app de iOS, la firma con tu Apple ID, la instala en el iPhone por USB y habla con los servicios de Apple Developer."
tags: [ios, swift, swiftpm, xcode, linux, wsl, firma-de-codigo, apple-developer, cli]
sidebar:
  order: 17
draft: false
resourceCategory: Sitio oficial
official: true
website: https://xtool.sh
github: https://github.com/xtool-org/xtool
technologies:
  - applications/apps-editors/application-vscode
note: "En Windows funciona dentro de WSL, no de forma nativa. Necesitas Swift 6.4, usbmuxd y el Xcode.xip que descargas tú de Apple con tu Apple ID. Licencia MIT."
warnings:
  - "El acuerdo de licencia de Xcode y de los SDK de Apple solo autoriza su uso en equipos de la marca Apple con macOS. xtool no incluye nada de Apple, pero extraer el SDK de Xcode.xip en Linux o Windows choca con ese acuerdo. Valóralo antes de usarlo en un proyecto profesional."
  - "El inicio de sesión con contraseña usa APIs privadas de Apple. La propia documentación sugiere usar un Apple ID desechable para ese modo."
updatedAt: 2026-10-27
---

## En pocas palabras

[xtool](https://xtool.sh) es una herramienta de línea de comandos que replica lo que hace Xcode para el ciclo de desarrollo de una app de iOS: **compila** un paquete de Swift como app, la **firma**, la **instala** y la **abre** en un iPhone conectado por USB. Funciona en Linux, en Windows a través de WSL y también en macOS, donde sirve para trabajar sin el sistema de build de Xcode.

Lo mantiene [Kabir Oberai](https://github.com/kabiroberai), está escrito en Swift, se publica bajo **licencia MIT** y supera las 13.000 estrellas. Es un proyecto activo: la versión 1.24.0 salió en octubre de 2026.

## Qué problema resuelve

Para probar una app propia en un iPhone, Apple exige Xcode, y Xcode solo existe para macOS. Sin un Mac no puedes compilar contra el SDK de iOS ni gestionar la firma de código y los perfiles de aprovisionamiento.

xtool sustituye esas piezas por estándares abiertos:

- **SwiftPM** (Swift Package Manager) como sistema de build en lugar de los proyectos `.xcodeproj`.
- **usbmuxd**, del proyecto [libimobiledevice](https://libimobiledevice.org), para hablar con el iPhone por USB desde Linux.
- Un cliente propio de los **servicios de Apple Developer** que registra el dispositivo y crea certificados y perfiles.

## Conceptos previos

- **SDK de iOS**: las cabeceras y bibliotecas del sistema contra las que se compila una app. Vienen dentro de Xcode, y por eso xtool te pide el `Xcode.xip`.
- **Firma de código**: iOS solo ejecuta apps firmadas con un certificado de Apple. Para desarrollo, el certificado va acompañado de un **perfil de aprovisionamiento** que dice qué app (Bundle ID) puede correr en qué dispositivos.
- **Bundle ID**: el identificador único de la app, como `com.example.Hello`.

## Cómo funciona

1. `xtool setup` inicia sesión en Apple y extrae del `Xcode.xip` un **Swift SDK** para Darwin. A partir de ahí, `swift sdk list` muestra `darwin` y el compilador de Swift de Linux puede generar binarios para iOS.
2. `xtool dev` compila el paquete con SwiftPM, empaqueta el resultado como `.app` según `xtool.yml` (como mínimo, el Bundle ID), registra el iPhone en tu cuenta, genera certificado, App ID y perfil, firma la app y la instala.
3. El archivo `.bsp/xtool.json` hace que el editor pida la información de build a xtool mediante el Build Server Protocol, así que con SourceKit-LSP tienes autocompletado y documentación en editores como [VS Code](/applications/apps-editors/application-vscode).

Con una cuenta gratuita, dos personas no pueden usar el mismo Bundle ID. Por eso xtool añade un prefijo al instalar en un dispositivo real (por ejemplo `XTL-1234.com.example.Hello`).

xtool también expone su lógica como biblioteca, **XKit**, para usar los servicios de Apple Developer y los dispositivos iOS desde tu propio código Swift.

## Instalación en Linux o WSL

Requisitos, según la guía oficial:

- En Windows, WSL y [USBIPD](https://learn.microsoft.com/en-us/windows/wsl/connect-usb) para pasar el iPhone por USB a WSL.
- El toolchain de **Swift 6.4** para tu distribución, desde [swift.org](https://swift.org/install/linux).
- `usbmuxd`, que muchas distribuciones ya traen.
- **Xcode 27.1** en formato `.xip`, descargado desde el navegador en [developer.apple.com](https://developer.apple.com/download/all/?q=Xcode) con tu Apple ID.

```bash
sudo apt-get install usbmuxd

curl -fL \
  "https://github.com/xtool-org/xtool/releases/latest/download/xtool-$(uname -m).AppImage" \
  -o xtool
chmod +x xtool
sudo mv xtool /usr/local/bin/

xtool setup
```

`xtool setup` te pide elegir el modo de inicio de sesión y luego la ruta del `Xcode.xip`:

| Modo     | Requisito                                     | Cómo funciona                                         |
| -------- | --------------------------------------------- | ----------------------------------------------------- |
| API Key  | Apple Developer Program de pago               | API pública de App Store Connect (clave con rol App Manager) |
| Password | Cualquier Apple ID (correo, contraseña y 2FA) | APIs privadas de Apple                                |

En macOS se instala con Homebrew (`brew install xtool-org/tap/xtool`) o con `xtool.app` desde las releases, y usa el Xcode instalado en lugar del `.xip`.

## Uso

```bash
xtool new Hello
cd Hello
xtool dev
```

La primera compilación tarda varios minutos porque SwiftPM construye los módulos del SDK de iOS; después se cachean. La primera vez tendrás que pulsar **Confiar** en el iPhone, activar el **Modo desarrollador** y confiar en tu certificado en **Ajustes > General > VPN y gestión de dispositivos**.

Otros subcomandos útiles:

| Comando                                  | Para qué                                     |
| ---------------------------------------- | -------------------------------------------- |
| `xtool devices`                          | Lista los dispositivos conectados            |
| `xtool install` / `uninstall` / `launch` | Instala un `.ipa`, desinstala o abre una app |
| `xtool ds`                               | Habla con Apple Developer Services           |
| `xtool sdk`                              | Gestiona el Swift SDK de Darwin              |

## Cuándo conviene y cuándo no

Conviene si quieres aprender desarrollo iOS con SwiftUI sin comprar un Mac, si tu entorno de trabajo es Linux o si quieres automatizar builds de iOS con herramientas abiertas. También admite extensiones de app, como widgets.

No sustituye todo Xcode. Trabaja con paquetes SwiftPM, así que un proyecto `.xcodeproj` existente no entra tal cual, y su documentación no cubre el simulador ni el envío a la App Store. Para publicar en la tienda sigue haciendo falta el flujo oficial de Apple.

## Alternativas

| Opción                          | Diferencia                                                                  |
| ------------------------------- | --------------------------------------------------------------------------- |
| Xcode en un Mac                 | La vía oficial y completa: simulador, Interface Builder, App Store Connect   |
| Mac en la nube (alquiler)       | Xcode real sin hardware propio, a cambio de una cuota y de latencia         |
| Frameworks multiplataforma      | Flutter o React Native permiten escribir en otro sistema, pero firmar y publicar para iOS sigue pidiendo herramientas de Apple |

## Límites y precauciones

- **Licencia de Apple.** El acuerdo de Xcode restringe el uso del software a equipos Apple con macOS. xtool evita distribuir nada de Apple, pero el uso que hagas tú del SDK fuera de un Mac sigue sujeto a ese acuerdo. Es una cuestión legal abierta, no técnica.
- **Credenciales.** Según la documentación, las credenciales solo se envían a Apple. Aun así, el modo contraseña depende de APIs privadas que Apple puede cambiar o vigilar.
- **Cuentas gratuitas.** Apple limita lo que puede hacer una cuenta sin el programa de pago (los perfiles de desarrollo caducan pronto y hay que reinstalar).
- **WSL y USB.** Si aparece `AFCClient.Error.muxError`, la guía enlaza una solución que reenvía la conexión del dispositivo desde iTunes en Windows en lugar de USBIPD.

## Fuentes

- [Web y documentación de xtool](https://xtool.sh)
- [Repositorio y README](https://github.com/xtool-org/xtool)
- [Guía de instalación en Linux y Windows (fuente)](https://github.com/xtool-org/xtool/blob/main/Documentation/xtool.docc/Installation-Linux.md)
- [Tutorial de la primera app (fuente)](https://github.com/xtool-org/xtool/blob/main/Documentation/xtool.docc/First-app.tutorial)
- [Control de la estructura de la app](https://github.com/xtool-org/xtool/blob/main/Documentation/xtool.docc/Control.md)
- [Releases](https://github.com/xtool-org/xtool/releases)
- [Hilo de presentación en los foros de Swift](https://forums.swift.org/t/xtool-cross-platform-xcode-replacement-build-ios-apps-on-linux-and-more/79803)
