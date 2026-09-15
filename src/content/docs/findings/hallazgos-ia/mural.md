---
title: "Mural: practicar idiomas hablando, con tu propia clave de OpenAI"
description: "App nativa de iPhone y Android para practicar conversación con un modelo de voz en tiempo real, sin cuenta ni suscripción: cada quien pone su clave de API."
tags: [idiomas, voz, openai, swiftui, jetpack-compose, webrtc, movil]
sidebar:
  order: 13
draft: false
resourceCategory: learning
website: https://mural.chat
url: https://github.com/Chuloo/mural
updatedAt: 2026-09-14
---

> Licencia MIT. Su lema: _the language app you eventually delete_ — la app de idiomas que acabas borrando.

[Mural](https://github.com/Chuloo/mural) es una app de práctica conversacional: hablas con un orbe animado que ajusta la dificultad según lo que respondes. No hay lecciones, rachas ni gamificación; el ejercicio es sostener una conversación hablada.

Lo interesante como proyecto no es la idea sino el montaje: **dos apps nativas** (SwiftUI y Jetpack Compose) contra un modelo de voz en tiempo real, con la clave de API en el dispositivo y los datos guardados localmente.

## Cómo está hecha

| Pieza              | Implementación                                     |
| ------------------ | -------------------------------------------------- |
| iPhone             | SwiftUI (iOS 26.1+), con Liquid Glass              |
| Android            | Jetpack Compose (Android 8.0+)                     |
| Almacenamiento     | SwiftData, local en el dispositivo                 |
| Transporte de voz  | WebRTC                                             |
| Modelos            | API de OpenAI: GPT-Live-1 y GPT-5.6 Luna           |

Hay un backend en PostgreSQL previsto para servicios futuros, pero la app funciona sin cuenta.

## Idiomas

Noruego bokmål, español de España, inglés, francés, alemán, italiano, portugués de Brasil y mandarín (chino simplificado, con pinyin opcional).

## Instalarla

No está en la App Store: hay que clonar y compilar. En iPhone:

```bash
git clone https://github.com/Chuloo/mural
cd apps/ios
xcodebuild -project Mural.xcodeproj -scheme Mural \
  -destination 'generic/platform=iOS Simulator' \
  -derivedDataPath .build/DerivedData \
  CODE_SIGNING_ALLOWED=NO ARCHS=arm64 build
```

En Android:

```bash
cd apps/android
./gradlew :app:testDebugUnitTest :app:lintDebug :app:assembleDebug
```

Distribuir por TestFlight o publicar en la App Store requiere membresía del Apple Developer Program; para el simulador o tu propio dispositivo, compilar alcanza.

## Sobre la clave de API

La app pide **tu clave de OpenAI** y necesita acceso a GPT-Live-1 y GPT-5.6 Luna. Dos cosas que conviene entender antes de probarla:

- Una suscripción de ChatGPT **no** da crédito de API: son productos separados.
- El uso de un modelo de voz en tiempo real se cobra por minuto de audio, no por mensaje. Una conversación larga cuesta bastante más que un chat de texto equivalente: pon un límite de gasto en la cuenta antes de la primera sesión.

## Límites

- Sin sincronización en la nube: si cambias de teléfono, el progreso no viaja.
- Requiere conexión permanente durante la conversación.
- Al ser una app de terceros con tu clave, revisa el código que envía audio antes de confiarle una clave con permisos amplios; una clave restringida es la precaución mínima.
- Es un proyecto joven y se distribuye compilando: espera fricción de build, no una instalación de tienda.

## Fuentes

- [Repositorio y README de Mural](https://github.com/Chuloo/mural)
- [Sitio oficial](https://mural.chat)
