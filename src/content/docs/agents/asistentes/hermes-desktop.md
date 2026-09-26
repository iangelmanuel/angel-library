---
title: "Hermes Desktop: la app nativa de Hermes Agent"
description: App de escritorio para macOS, Windows y Linux con el mismo núcleo que la CLI — chat con herramientas en streaming, vista previa lateral, navegador de archivos, terminal, revisión de Git y worktrees, HUD flotante, voz, cron, perfiles y Bot Mode.
tags: [hermes, nous-research, desktop, electron, agente, worktrees, voz, bots]
sidebar:
  order: 2
draft: false
tool: Hermes Agent
resourceCategory: Sitio oficial
official: true
website: https://hermes-agent.nousresearch.com/desktop
github: https://github.com/NousResearch/hermes-agent
technologies:
  - agents/asistentes/hermes-cli
note: En macOS solo hay versión para Apple Silicon; Intel no está soportado. La app usa la misma configuración, claves, sesiones, skills y memoria que la CLI.
updatedAt: 2026-09-26
---

**Hermes Desktop** es la aplicación nativa de [Hermes Agent](/agents/asistentes/hermes-cli). No es un producto aparte ni un clon ligero: usa **el mismo agente** que la CLI y el gateway. Una sesión empezada en el escritorio se retoma en la terminal y al revés.

## Instalación

**Paquetes de escritorio** desde la [página de Hermes Desktop](https://hermes-agent.nousresearch.com/desktop):

- **Windows**: abre el `.appinstaller` con App Installer; instala el paquete MSIX firmado y registra su fuente de actualizaciones.
- **macOS**: abre el DMG y copia `Hermes.app` a Aplicaciones (Apple Silicon).
- **Linux**: la app también corre en Linux; consulta la [matriz de plataformas](https://hermes-agent.nousresearch.com/docs/getting-started/platform-support) para el método de tu distribución, o arráncala desde la CLI.

Los paquetes incluyen el agente, Python y dependencias ya compiladas: el primer arranque no construye nada.

**Si ya tienes la CLI**, basta con:

```bash
hermes desktop
hermes desktop --cwd ~/proyectos/mi-app   # carpeta inicial del navegador de archivos
```

Existe también un instalador `Hermes-Setup` que descarga el código y compila la app, y una variante **Light** que solo se conecta a un backend remoto.

## La ventana

Diseño centrado en el chat con una barra lateral para navegar. Pensado para llevar varias conversaciones de agente a la vez, configurar mensajería, crear artefactos y trabajar sobre proyectos.

### Chat

- Respuestas en streaming con la actividad de herramientas en vivo y resúmenes de cada llamada.
- **Arrastrar archivos** al chat para adjuntarlos.
- **Panel de vista previa** a la derecha: páginas web, archivos y salidas de herramientas junto a la conversación.
- **Modo comentario** en el navegador integrado: clic en un elemento de la página y deja una nota anclada.
- Historial del compositor con flechas y edición de mensajes en cola.
- Línea de tiempo lateral para saltar entre prompts de una conversación larga y `Ctrl/Cmd+F` para buscar.
- Selector de modelo en el compositor con esfuerzo de razonamiento y modo rápido por modelo. El modelo **por defecto** se cambia en *Settings → Model*; cambiar de modelo a mitad de chat invalida la caché del prompt.

### Barra de estado

Interruptor de **YOLO por sesión** (desactiva la aprobación de comandos peligrosos), medidor de contexto con desglose por categoría, tasa de aciertos de caché y tokens por segundo (opcionales), y elementos configurables con clic derecho.

### Ventanas, pestañas y paneles

| Atajo | Acción |
| --- | --- |
| `Cmd/Ctrl+T` | Nueva pestaña de sesión |
| `Ctrl+Tab` / `Ctrl+1…9` | Cambiar de sesión |
| `Cmd/Ctrl+Shift+N` | Nueva ventana |
| `Cmd/Ctrl+B` / `Cmd/Ctrl+J` | Barra lateral izquierda / derecha |
| ``Ctrl+` `` | Terminal integrada |
| `Cmd/Ctrl+G` | Panel de revisión de Git |
| `Cmd/Ctrl+Shift+B` | Nuevo worktree |
| `Cmd/Ctrl+Shift+H` | Modo HUD |

Hay dos **modos de interfaz**: *Advanced* (todo) y *Simple* (centrado en el chat, oculta terminal, diffs y paneles técnicos). Cada modo recuerda su distribución.

### Terminal y archivos

- **Terminal real** en la barra derecha; varias terminales en pestañas. Las shells siguen vivas aunque ocultes el panel. *Add to chat* envía la salida seleccionada como contexto.
- **Navegador de archivos** para seguir lo que el agente lee y edita.
- **Artefactos**: galería buscable de imágenes, archivos y enlaces generados en las sesiones.

### Git y worktrees

Para sesiones dentro de un repositorio:

- **Panel de revisión** con rama, ahead/behind, archivos cambiados y diffs por *Uncommitted*, *Branch* o *Last turn* (solo lo que cambió el agente en su último turno).
- **Worktrees**: crea una rama en una copia paralela del repo para que un agente trabaje sin tocar tu checkout. Cada worktree aparece como su propio carril en la barra lateral.
- **Subagentes en vivo**: un marco sobre el compositor muestra los trabajadores delegados, su tarea y su última actividad; puedes seleccionarlos y redirigirlos (*Steer*).

### Proyectos

La app descubre repositorios Git escaneando tu carpeta personal hasta cierta profundidad. Se controla por perfil:

```yaml
# ~/.hermes/config.yaml
desktop:
  repo_scan_enabled: true
  repo_scan_roots: []          # vacío = carpeta personal
  repo_scan_exclude_paths: []
```

### HUD y Quick Entry

- **HUD** (`Cmd/Ctrl+Shift+H`): separa el chat en una barra flotante, sin marco y siempre encima, sobre la app en la que trabajes. `Cmd/Ctrl+Shift+G` la lleva a donde esté el cursor.
- **Quick Entry**: un compositor pequeño que se invoca con un atajo global desde cualquier app, sin abrir la ventana principal.

### Voz

Dictado, lectura en voz alta de las respuestas, palabra de activación y conversación de voz completa, igual que el modo voz del resto de Hermes.

### Memoria

El **Memory Graph** (`/journey`, `/memory-graph`) muestra skills y memorias como un grafo con línea de tiempo, filtrable por usadas o aprendidas; los nodos se editan o borran desde el panel.

## Gestión sin terminal

| Panel | Qué hace |
| --- | --- |
| Settings | Proveedores y claves (cuentas OAuth, API keys, endpoints propios con modo Chat Completions, Responses o Anthropic Messages), modelos, herramientas, MCP, gateway, voz, tema |
| Capabilities → Skills | Skills instaladas del perfil y catálogo del Skills Hub |
| Capabilities → Plugins | Plugins instalados y catálogo público |
| Cron | Ver, pausar, reanudar, editar y borrar tareas programadas |
| Profiles | Perfiles aislados (config, skills y sesiones propias) |
| Messaging | Canales del gateway; Telegram tiene configuración con QR |
| Agents / Command Center | Orquestación multiagente |

Cuando hay varios perfiles, las páginas de ajustes muestran un selector **Applies to** para editar otro perfil sin cambiar el activo.

Otros ajustes útiles: temas importados del Marketplace de VS Code, fuente del chat y de la terminal (Nerd Fonts), mostrar u ocultar el razonamiento del modelo, reabrir el último chat al iniciar, **mantener el equipo despierto** en ejecuciones largas y minimizar a la bandeja sin detener las sesiones.

## Bot Mode

Activado por defecto: cada perfil de Hermes aparece como un **bot** con avatar, su propio chat y sus **Routines** (tareas recurrentes sobre el cron de Hermes). Se crean bots con nombre, rol, modelo, SOUL, skills, toolsets y servidores MCP propios, se agrupan en secciones y se abren chats de grupo donde varios bots deliberan.

## Conectar a otra máquina

La app puede usar un backend de Hermes remoto en lugar del local, y conectarse a varias instancias. El inicio de sesión en un gateway protegido usa el navegador del sistema con PKCE (RFC 8252), sin webview embebido.

## Linux y Wayland

La app es Electron y corre como cliente Wayland nativo. En Hyprland (incluido Omarchy) el HUD se fija por IPC del compositor. Si tu compositor ignora *always-on-top*, fuerza XWayland:

```yaml
desktop:
  ozone_platform_hint: x11
  electron_flags: ["--ozone-platform=x11"]
  renderer_max_old_space_mb: 2048   # límite de memoria del renderer en sesiones muy largas
```

## Fuentes

- [Hermes Desktop — documentación](https://hermes-agent.nousresearch.com/docs/user-guide/desktop)
- [Instalación](https://hermes-agent.nousresearch.com/docs/getting-started/installation)
- [Bot Mode](https://hermes-agent.nousresearch.com/docs/user-guide/bot-mode) · [Conectar el escritorio a varias instancias](https://hermes-agent.nousresearch.com/docs/user-guide/multi-connection-desktop)
- [Inicio de sesión nativo](https://hermes-agent.nousresearch.com/docs/guides/desktop-native-signin)
- [Repositorio](https://github.com/NousResearch/hermes-agent)
