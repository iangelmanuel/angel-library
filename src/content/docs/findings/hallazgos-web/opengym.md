---
title: "openGym: registro de entrenamientos autoalojado y sin anuncios"
description: "App open source para planificar la semana, registrar series y peso corporal, estimar el 1RM y ver qué músculos has trabajado. Sin suscripción, sin anuncios y sin telemetría; se prueba en el navegador sin cuenta."
tags: [fitness, gimnasio, autoalojado, pwa, react, docker, passkeys, privacidad]
sidebar:
  order: 9
draft: false
resourceCategory: Sitio oficial
official: true
website: https://opengym.ch
url: https://opengym.ch/demo/
github: https://github.com/DuarteSantos8/openGym
technologies:
  - devops/docker-compose/docker-compose-basico
note: "El código es AGPL-3.0, pero las animaciones de ejercicios no: son de Gym visual y tienen licencia solo para openGym. Un fork comercial necesita su propia licencia para ellas."
warnings:
  - "Para usar passkeys desde el móvil necesitas HTTPS en un dominio. La mayoría de problemas de inicio de sesión vienen de que RP_ID y ORIGIN no coinciden con la URL real."
  - "Los datos se guardan como archivos JSON en ./data. Si no haces copia de esa carpeta, un fallo de disco se lleva todo tu historial."
  - "El 1RM estimado es una aproximación a partir de series con varias repeticiones. No lo uses como carga real para un intento máximo sin calentar y sin alguien que te asista."
updatedAt: 2026-10-12
---

> Creado por **[Duarte Santos](https://github.com/DuarteSantos8)** con licencia **AGPL-3.0**. Unas 10.000 estrellas. Web en [opengym.ch](https://opengym.ch) y [demo en el navegador](https://opengym.ch/demo/).

[openGym](https://github.com/DuarteSantos8/openGym) es un registro de gimnasio y de peso corporal que **se instala en tu propio servidor**. Planificas la semana, sigues entrenamientos guiados y registras cada serie desde el móvil, con los datos sincronizados entre tus dispositivos y un inicio de sesión con passkey.

El planteamiento es el contrario al de las apps comerciales del sector: sin cuenta en servidores ajenos, sin suscripción, sin anuncios y sin telemetría. El autor lo resume en que la app sigue funcionando aunque desaparezca la empresa, porque no hay empresa.

> **Datos actualizados.** En algunos sitios se habla de 1.324 ejercicios y 17 idiomas. Son cifras de versiones anteriores: el README actual indica **más de 5.600 ejercicios** con animación y **19 idiomas**.

## Pruébalo sin instalar nada

La [demo](https://opengym.ch/demo/) es la app real con datos de ejemplo, en el navegador y sin crear cuenta. Es la mejor forma de decidir si merece la pena autoalojarla.

## Qué hace

**Planificación**

- Una rutina por día de la semana sobre una biblioteca de más de 5.600 ejercicios con animación, que se buscan por nombre o desde un **mapa corporal** de músculos, filtrando por el material que tienes.
- Cuatro planes iniciales (Push/Pull/Legs, Torso/Pierna, Cuerpo completo y 5×5) que se cargan como rutinas editables.
- Modo **rotación** (A, B, C, A…) para quien no entrena con días fijos.
- Superseries, series de calentamiento, _drop sets_, _rest-pause_, ejercicios por tiempo (planchas, colgarse de una barra), cardio y semanas de descarga.

**Durante el entrenamiento**

- La sesión del día empieza sola, con los pesos de la última vez ya puestos, temporizador de descanso entre series y detección de récords personales sobre la marcha.
- Esfuerzo opcional como **RIR** (repeticiones que te quedaban en reserva) o **RPE** (esfuerzo percibido del 1 al 10).
- Cálculo de discos para barra olímpica, barra Z, trap bar y máquina Smith a partir de los discos que tienes.

**Progreso**

- Reglas de progresión por rutina o por ejercicio (lineal, Greyskull LP, doble y triple progresión), con una explicación de por qué toca cada peso.
- **1RM estimado** por ejercicio, con su propia curva.
- Un mapa muscular en tres modos: dónde ha ido tu volumen, qué está todavía recuperándose y qué llevas tiempo sin trabajar.
- Gráfica de peso corporal con objetivo, fotos de progreso con comparador antes/después y un mapa de calor de actividad anual.

**Cuentas y datos**

- Passkeys (Face ID, Touch ID, huella) y varios perfiles por instancia. El inicio con contraseña se puede activar.
- Importación desde FitNotes, Strong, Hevy y exportaciones de peso de Apple Health; exportación completa en un JSON.
- Opcionales y desactivados por defecto: un **entrenador con IA** que propone rutinas con tu propia clave (Anthropic, OpenAI, Gemini o un endpoint compatible, Ollama incluido) y un **servidor MCP** de solo lectura para preguntarle a un asistente por tu historial.

## Qué es el 1RM y cómo lo estima

El **1RM** (_one-repetition maximum_) es el peso máximo que puedes levantar una sola vez con buena técnica en un ejercicio. Es la referencia con la que se calculan muchos programas de fuerza («5 series al 75 % del 1RM»). Medirlo directamente es cansado y arriesgado, así que se estima a partir de una serie con más repeticiones y menos peso.

openGym lo calcula en `frontend/src/lib/onerm.js`. La fórmula por defecto es **Epley**, la más conocida:

```text
1RM = peso × (1 + repeticiones / 30)
```

Por ejemplo, 80 kg × 8 repeticiones da 80 × (1 + 8/30) ≈ 101 kg. En los ajustes se puede elegir otra, como **Brzycki**:

```text
1RM = peso × 36 / (37 − repeticiones)
```

El código incluye siete fórmulas (Epley, Brzycki, Lombardi, O'Conner, Mayhew, Wathan y Lander) y una opción **ponderada** que las combina con una tabla de porcentajes según el RIR. Dos decisiones del código son interesantes:

- **No estima por encima de 12 repeticiones** (15 en el modo ponderado). Con muchas repeticiones, las fórmulas miden más resistencia que fuerza máxima y discrepan en dos cifras; el comentario del código dice que es mejor no adivinar que mostrar una fantasía.
- **Solo usa series con peso y repeticiones.** Las de cardio o por tiempo quedan fuera solas, sin necesidad de clasificar cada ejercicio.

## Stack técnico

| Pieza        | Tecnología                                                                 |
| ------------ | -------------------------------------------------------------------------- |
| `frontend/`  | React 19 y Vite, con React Router y Zustand; PWA instalable y con modo sin conexión |
| `api/`       | `node:http` sin framework y solo dos dependencias: `@simplewebauthn/server` (passkeys) y `web-push` |
| `web/`       | nginx sirve el frontend y hace de proxy de `/api`, para que todo esté en un mismo origen (las passkeys lo exigen) |
| Datos        | Archivos JSON en `./data`, sin base de datos                               |
| Móvil        | El mismo código empaquetado con Capacitor                                  |

La **sincronización** es sencilla y robusta: cada perfil es un documento con una revisión. Si otro dispositivo escribió entretanto, el servidor rechaza el cambio y devuelve el documento actual; el dispositivo combina campo a campo, quedándose con la edición más reciente de cada uno, y reintenta. La API está documentada en OpenAPI en [opengym.ch/api.html](https://opengym.ch/api.html).

## Cómo instalarlo

Solo hace falta Docker con Compose:

```bash
git clone https://github.com/DuarteSantos8/openGym
cd openGym
cp .env.example .env
docker compose pull
docker compose up -d
```

Por defecto queda en `http://localhost:8080`. Pulsas **Create profile** y listo; las animaciones ya vienen en la imagen. Las imágenes están publicadas para amd64 y arm64, así que también funciona en una Raspberry Pi o un NAS ARM.

Para usarlo desde el móvil con passkeys hace falta HTTPS en un dominio y ajustar dos variables en `.env`:

| Variable           | Para qué sirve                                       | Por defecto              |
| ------------------ | ---------------------------------------------------- | ------------------------ |
| `RP_ID`            | Hostname al que se atan las passkeys                 | `localhost`              |
| `ORIGIN`           | URL completa desde la que se sirve la app            | `http://localhost:8080`  |
| `INVITE_ONLY`      | Exigir código de invitación para crear perfiles      | Desactivado              |
| `FIRST_USER_ADMIN` | El primer perfil se convierte en administrador       | Desactivado              |

La [guía de autoalojamiento](https://github.com/DuarteSantos8/openGym/blob/main/docs/SELF_HOSTING.md) explica cómo ponerlo detrás de Cloudflare Tunnel, Caddy, Traefik o nginx, y hay guías aparte para HTTPS en red local y Kubernetes. La copia de seguridad es tan simple como copiar la carpeta `./data`.

**En el móvil sin servidor.** En Android hay un APK firmado en las [releases](https://github.com/DuarteSantos8/openGym/releases/latest) que guarda todo en el teléfono, sin cuenta ni servidor (no está en Play Store a propósito). En iPhone, la vía es autoalojarlo y añadir la PWA a la pantalla de inicio desde Safari.

## Cuándo conviene

- Quieres dejar Strong o Hevy sin perder tu historial y sin pagar suscripción.
- Ya tienes un servidor casero o un VPS y te interesa tener tus datos de entrenamiento en él.
- Entrenas en familia o con amigos: varios perfiles en la misma instancia, con registro solo por invitación.

Si no quieres mantener nada, el APK de Android es la opción más sencilla. Si no tienes servidor y usas iPhone, una app comercial te dará menos trabajo.

## Cómo está hecho

El README lo dice abiertamente: buena parte del código, los tests y la documentación se redactan con [Claude Code](https://claude.com/claude-code), y el repositorio incluye un `CLAUDE.md`. Lo que decide qué entra es el mantenedor, y la lógica de entrenamiento está cubierta por tests unitarios que se ejecutan en CI. La app en sí no necesita ningún modelo de IA: nada en la instalación por defecto llama a un servicio externo.

## Fuentes

- [Repositorio y README de openGym](https://github.com/DuarteSantos8/openGym)
- [Sitio oficial](https://opengym.ch) y [demo en el navegador](https://opengym.ch/demo/)
- [Guía de autoalojamiento](https://github.com/DuarteSantos8/openGym/blob/main/docs/SELF_HOSTING.md)
- [Código de la estimación de 1RM](https://github.com/DuarteSantos8/openGym/blob/main/frontend/src/lib/onerm.js)
