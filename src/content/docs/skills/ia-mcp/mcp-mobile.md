---
title: Mobile MCP — controlar iOS y Android desde el agente
description: Servidor MCP de Mobile Next que deja al agente tocar, escribir, instalar apps y leer logs en simuladores, emuladores y dispositivos reales de iOS y Android.
tags: [ai, mcp, mobile, ios, android, testing, automatizacion]
sidebar:
  order: 9
draft: false
tool: Cross-tool
resourceCategory: Repositorio oficial
official: true
url: https://github.com/mobile-next/mobile-mcp
technologies:
  - skills/ia-mcp/mcp-playwright
  - agents/claude-code/claude-code-mcp
  - agents/codex/codex-mcp
note: "Requiere Node.js 20 o superior, más Xcode command line tools para iOS o Android Platform Tools (adb) para Android. Los simuladores de iOS solo funcionan en macOS (y Linux, según el README); en Windows solo hay emuladores Android y dispositivos reales."
warnings:
  - "Envía telemetría anónima (PostHog y Scarf) por defecto. Se desactiva con la variable MOBILEMCP_DISABLE_TELEMETRY."
  - "El agente puede instalar y desinstalar apps, leer el portapapeles y cambiar la ubicación GPS. En un teléfono personal, eso incluye tus datos reales: usa un dispositivo o emulador de pruebas."
  - "En modo HTTP (--listen), sin MOBILEMCP_AUTH cualquiera que alcance el puerto controla el dispositivo."
updatedAt: 2026-10-12
---

**Mobile MCP** es para apps nativas lo que [Playwright MCP](/skills/ia-mcp/mcp-playwright) es para el navegador: le da al agente las manos y los ojos para manejar un teléfono. Puede listar dispositivos, abrir apps, tocar botones, escribir, deslizar, sacar capturas, grabar video y leer los logs del sistema, en iOS y Android, sobre simuladores, emuladores o dispositivos físicos conectados por USB.

Un **MCP** (_Model Context Protocol_) es el estándar abierto con el que un agente como Claude Code o Codex se conecta a herramientas externas: el servidor expone funciones con nombre y descripción, y el modelo decide cuándo llamarlas. Ver [MCP en Claude Code](/agents/claude-code/claude-code-mcp).

Lo mantiene **Mobile Next** (licencia Apache-2.0, unas 9.000 estrellas en GitHub).

## Cómo ve la pantalla

El servidor intenta primero leer el **árbol de accesibilidad nativo**: la lista estructurada de elementos (botones, campos, textos) con sus etiquetas y coordenadas. Es rápido, barato en tokens y determinista. Cuando una pantalla no expone ese árbol (un juego, un canvas, una vista personalizada), recurre a **capturas de pantalla** y toques por coordenadas, que dependen de que el modelo interprete la imagen.

Por debajo usa [mobilecli](https://github.com/mobile-next/mobilecli), la CLI de dispositivos del mismo equipo, apoyada en las herramientas de Xcode en iOS y en `adb` en Android.

## Requisitos

- **Node.js 20+**.
- **iOS:** Xcode command line tools y un simulador arrancado (`xcrun simctl`), o un iPhone conectado por USB y marcado como de confianza.
- **Android:** Android Platform Tools (`adb`) y un emulador en marcha, o un dispositivo con depuración USB activada.
- Un cliente compatible con MCP.

## Instalar

### Claude Code

Como plugin (incluye además el comando `/mobile-mirror`):

```text
/plugin marketplace add mobile-next/mobile-mcp
/plugin install mobile-mcp@mobile-mcp
```

Sin plugins:

```bash
claude mcp add mobile-mcp -- npx -y @mobilenext/mobile-mcp@latest
```

### Codex

```bash
codex mcp add mobile-mcp npx "@mobilenext/mobile-mcp@latest"
```

O en `~/.codex/config.toml` (ver [MCP en Codex](/agents/codex/codex-mcp)):

```toml
[mcp_servers.mobile-mcp]
command = "npx"
args = ["@mobilenext/mobile-mcp@latest"]
```

### Gemini CLI

```bash
gemini mcp add mobile-mcp npx -y @mobilenext/mobile-mcp@latest
```

### Cursor

_Cursor Settings → MCP → Add new MCP Server_, tipo _command_, con `npx -y @mobilenext/mobile-mcp@latest`. El README también trae un botón de instalación en un clic.

### JSON genérico

Sirve para Claude Desktop, Cline, Kiro, Windsurf y la mayoría de clientes:

```json
{
  "mcpServers": {
    "mobile-mcp": {
      "command": "npx",
      "args": ["-y", "@mobilenext/mobile-mcp@latest"]
    }
  }
}
```

### Comprobar

Pídele al agente _"list available devices"_. Si la lista sale vacía, arranca antes un simulador o emulador.

### Modo HTTP

Para compartir un servidor entre máquinas o correrlo en un equipo con los dispositivos conectados:

```bash
MOBILEMCP_AUTH=un-token-largo npx @mobilenext/mobile-mcp@latest --listen 3000
```

El cliente se conecta a `http://<host>:3000/mcp` con ese token como _Bearer_.

## Herramientas

| Grupo | Herramienta | Qué hace |
| --- | --- | --- |
| Dispositivo | `mobile_list_available_devices` | Lista simuladores, emuladores y dispositivos reales |
| Dispositivo | `mobile_get_screen_size` | Tamaño de pantalla en píxeles |
| Dispositivo | `mobile_get_orientation` / `mobile_set_orientation` | Leer o cambiar vertical/horizontal |
| Dispositivo | `mobile_fold_device` | Plegar o desplegar un dispositivo plegable |
| Dispositivo | `mobile_set_location` | Simular o limpiar la ubicación GPS |
| Dispositivo | `mobile_clipboard` | Leer o reemplazar el portapapeles |
| Apps | `mobile_list_apps` | Apps instaladas |
| Apps | `mobile_get_foreground_app` | App en primer plano |
| Apps | `mobile_launch_app` / `mobile_terminate_app` | Abrir o cerrar una app por paquete o bundle ID |
| Apps | `mobile_install_app` / `mobile_uninstall_app` | Instalar `.apk`, `.ipa`, `.app` o `.zip`, o desinstalar |
| Pantalla | `mobile_take_screenshot` / `mobile_save_screenshot` | Captura al modelo o a un archivo |
| Pantalla | `mobile_list_elements_on_screen` | Elementos de la UI con coordenadas y propiedades |
| Pantalla | `mobile_click_on_screen_at_coordinates` | Tocar en x,y o sobre una referencia de elemento |
| Pantalla | `mobile_double_tap_on_screen` | Doble toque |
| Pantalla | `mobile_long_press_on_screen_at_coordinates` | Pulsación larga |
| Pantalla | `mobile_swipe_on_screen` | Deslizar arriba, abajo, izquierda o derecha |
| Pantalla | `mobile_start_screen_recording` / `mobile_stop_screen_recording` | Grabar la pantalla en video |
| Entrada | `mobile_type_keys` | Escribir texto, con envío opcional |
| Entrada | `mobile_press_button` | HOME, BACK, VOLUME_UP/DOWN, ENTER… |
| Entrada | `mobile_open_url` | Abrir una URL http/https en el navegador del dispositivo |
| Logs | `mobile_get_device_logs` | logcat (Android) o unified log (iOS) |
| Logs | `mobile_list_crashes` / `mobile_get_crash` | Informes de cierre inesperado |
| Lote | `mobile_batch_commands` | Varias herramientas en una sola llamada |
| Nube | `mobile_login_to_cloud_provider`, `mobile_list_remote_devices`, `mobile_allocate_remote_device`, `mobile_release_remote_device` | Reservar dispositivos reales en Mobile Next Cloud (servicio aparte) |

`mobile_batch_commands` importa más de lo que parece: cada llamada a una herramienta es un viaje de ida y vuelta con el modelo, así que agrupar «tocar, escribir, enviar, listar elementos» en una sola llamada reduce latencia y tokens.

## Ejemplos de prompts

```text
Abre la app en el simulador de iPhone, entra con usuario demo@example.com,
ve a Ajustes y confirma que el interruptor de notificaciones está activado.
Saca una captura al final.
```

```text
Instala ./build/app-debug.apk en el emulador Android, ábrela, completa el
onboarding y, si la app se cierra, trae el último crash y los logs de logcat.
```

```text
Gira el dispositivo a horizontal en la pantalla de checkout y dime si algún
botón queda fuera de la pantalla.
```

## Cuándo usarlo

- **Verificar un cambio de UI en móvil** sin salir del agente: el agente modifica el código, recompila, abre la app y comprueba el resultado.
- **Reproducir bugs** que dependen de orientación, ubicación o un flujo largo de pantallas, y recoger logs y crashes en el mismo paso.
- **Exploración y smoke tests** de una build nueva antes de pasarla a QA.

Para una suite de regresión que corra en cada PR conviene algo determinista: el mismo equipo publica [mobilewright](https://github.com/mobile-next/mobilewright) para tests móviles reproducibles, y frameworks como [e2e](/testing/testing-ai/e2e-tester-army) combinan pasos de IA con aserciones fijas.

## Consideraciones

- Un iPhone **real** exige más preparación (conexión por USB, marcar el equipo como de confianza). Empieza por el simulador.
- Cuando el agente cae a capturas de pantalla, cada paso cuesta más tokens y es menos fiable. Las apps con buenas etiquetas de accesibilidad se automatizan mucho mejor, lo cual es un incentivo más para cuidarlas.
- `mobile_open_url` bloquea esquemas no estándar (deep links propios) salvo que actives `MOBILEMCP_ALLOW_UNSAFE_URLS`.

## Fuentes

- [github.com/mobile-next/mobile-mcp](https://github.com/mobile-next/mobile-mcp) — README oficial.
- [mobilecli](https://github.com/mobile-next/mobilecli) y [mobilewright](https://github.com/mobile-next/mobilewright), proyectos relacionados.
