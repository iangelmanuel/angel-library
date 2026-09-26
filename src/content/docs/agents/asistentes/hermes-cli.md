---
title: "Hermes CLI: el agente autónomo de Nous Research en la terminal"
description: Hermes Agent es un agente de código abierto que aprende de la experiencia — crea sus propias skills, recuerda entre sesiones y se puede usar desde la terminal, el escritorio o Telegram, Discord y Slack. Instalación, comandos, memoria, seguridad y configuración.
tags: [hermes, nous-research, agente, cli, tui, memoria, skills, mcp, telegram, open-source]
sidebar:
  order: 1
draft: false
tool: Hermes Agent
resourceCategory: Sitio oficial
official: true
website: https://hermes-agent.nousresearch.com/
github: https://github.com/NousResearch/hermes-agent
technologies:
  - agents/asistentes/hermes-desktop
  - agents/agents-fundamentos/coding-agents-fundamentals
  - agents/agents-fundamentos/agent-safe-workflow
note: Licencia MIT. Funciona en Linux, macOS (Apple Silicon), Windows nativo, WSL2 y Android (Termux). Tú eliges el proveedor de modelos.
warnings:
  - El modo YOLO (`hermes --yolo` o `/yolo`) desactiva la aprobación de comandos peligrosos. No lo uses fuera de un sandbox.
  - Un agente con acceso a terminal, navegador y mensajería puede actuar en tu nombre. Limita toolsets, usuarios autorizados del gateway y credenciales.
updatedAt: 2026-09-26
---

**Hermes Agent** es el agente de IA «que se mejora a sí mismo» de [Nous Research](https://nousresearch.com). Su rasgo distintivo es un **bucle de aprendizaje**: crea skills a partir de la experiencia, las mejora mientras las usa, se recuerda persistir conocimiento, busca en sus propias conversaciones pasadas y construye un modelo de quién eres a lo largo de las sesiones.

Es **autoalojado**: corre en tu máquina o en tu servidor. Tiene tres interfaces que comparten el mismo núcleo, configuración, sesiones, skills y memoria:

| Interfaz | Cómo se abre |
| --- | --- |
| CLI clásica | `hermes` |
| TUI moderna (overlays, ratón, entrada no bloqueante) | `hermes --tui` |
| App de escritorio | `hermes desktop` — ver [Hermes Desktop](/agents/asistentes/hermes-desktop) |
| Panel web de administración | `hermes dashboard` |
| Gateway de mensajería | `hermes gateway` (Telegram, Discord, Slack, WhatsApp, Signal, email…) |

Una sesión empezada en una interfaz se retoma en otra.

## Instalación

Linux, macOS o WSL2:

```bash
curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash
source ~/.bashrc   # o ~/.zshrc
hermes
```

Windows nativo (PowerShell), sin WSL:

```powershell
iex (irm https://hermes-agent.nousresearch.com/install.ps1)
```

El instalador clona el código, arranca `uv` y deja a su gestor de paquetes (PM) instalar Python, Node.js, npm, ripgrep, FFmpeg y las herramientas de navegador (`agent-browser` con Chromium). Opciones útiles:

| Opción | Efecto |
| --- | --- |
| `--skip-browser` / `-SkipBrowser` | No instalar el navegador (Hermes lo recuerda en `hermes update`) |
| `--non-interactive` / `-NonInteractive` | Saltar pasos que piden datos |
| `--include-desktop` / `-IncludeDesktop` | Compilar también la app de escritorio |
| `--verbose` / `-Verbose` | Mostrar toda la salida en lugar del log |

Dónde queda todo:

| Método | Código | Datos del usuario |
| --- | --- | --- |
| Script POSIX | `~/.hermes/hermes-agent/` | `~/.hermes/` |
| Script Windows | `%LOCALAPPDATA%\hermes\hermes-agent\` | `%LOCALAPPDATA%\hermes\` |
| Docker | `/opt/hermes/` | `/opt/data/` montado |
| Termux | `$PREFIX/lib/hermes-agent/` | `~/.hermes/` |

`HERMES_HOME` cambia la carpeta de datos. También hay paquetes Docker, Nix y un repositorio APT firmado para Termux (`pkg install hermes-agent`).

> En Windows, algunos antivirus marcan como malware `uv.exe` dentro de `%LOCALAPPDATA%\hermes\bin`. Es un falso positivo documentado; el README explica cómo verificar el binario con `gh attestation verify` y excluir la **carpeta** (no el hash, que cambia en cada versión).

## Primeros comandos

```bash
hermes              # CLI interactiva
hermes setup        # asistente que configura todo de una vez
hermes model        # elegir proveedor y modelo
hermes tools        # activar o desactivar herramientas
hermes config set   # cambiar un valor de configuración
hermes config get   # leer un valor
hermes gateway      # arrancar el gateway de mensajería
hermes update       # actualizar
hermes doctor       # diagnosticar problemas
```

`hermes setup --portal` inicia sesión en **Nous Portal** por OAuth: una suscripción que da acceso a más de 300 modelos y al **Tool Gateway** (búsqueda web, generación de imágenes, TTS y navegador en la nube) sin juntar cinco API keys. Es opcional: Hermes funciona con OpenRouter, OpenAI, Anthropic, Google o cualquier endpoint compatible con OpenAI, y se cambia con `hermes model` sin tocar código.

### Modos de ejecución

```bash
hermes chat -q "Hola"                    # una sola consulta, no interactiva
hermes chat --query-file prompt.txt      # consulta desde archivo (sin interpretar por el shell)
hermes chat --model "anthropic/claude-sonnet-4"
hermes chat --provider openrouter
hermes chat --toolsets "web,terminal,skills"
hermes -s github-pr-workflow,github-auth # precargar skills
hermes --continue                        # retomar la última sesión (-c)
hermes --resume <session_id>             # retomar una sesión concreta (-r)
hermes -w -z "Fix issue #123"            # trabajar en un git worktree aislado
```

Los worktrees de `hermes -w` viven en `<repo>/.worktrees/`. `hermes worktree list` los audita y `hermes worktree prune` limpia los seguros sin borrar cambios sin commit ni commits sin publicar.

## Dentro de la sesión

### Comandos slash

| Comando | Qué hace |
| --- | --- |
| `/new` o `/reset` | Conversación nueva |
| `/model [proveedor:modelo]` | Cambiar de modelo |
| `/personality [nombre]` | Cambiar personalidad (`concise`, `pirate`, `kawaii`…) |
| `/retry`, `/undo` | Reintentar o deshacer el último turno |
| `/compress`, `/usage`, `/insights` | Comprimir contexto, ver consumo y estadísticas |
| `/context` | Desglose del contexto por categoría |
| `/skills` o `/<skill>` | Explorar skills o cargar una |
| `/bg <prompt>` | Ejecutar un prompt en una sesión en segundo plano |
| `/btw <pregunta>` | Pregunta lateral sin interrumpir la conversación |
| `/busy queue\|steer\|interrupt` | Qué pasa si escribes mientras el agente trabaja |
| `/sessions` | Selector de sesiones |
| `/voice on` | Modo voz (`Ctrl+B` para grabar) |

### Atajos

| Tecla | Acción |
| --- | --- |
| `Enter` | Enviar |
| `Alt+Enter`, `Ctrl+J`, `Shift+Enter` | Nueva línea |
| `Ctrl+G` | Editar el mensaje en `$EDITOR` |
| `Ctrl+S` | Aparcar el borrador y enviar otra cosa antes |
| `Ctrl+C` | Interrumpir (dos veces en 2 s para salir) |
| `Ctrl+T` | Monitor de subagentes y procesos en segundo plano |
| `Alt+V` | Pegar una imagen del portapapeles |
| `!<comando>` | Ejecutar un comando de shell tú mismo, sin gastar tokens ni ensuciar el contexto |

`Shift+Enter` funciona directamente en Kitty, foot, WezTerm y Ghostty; en iTerm2, Alacritty, VS Code, Warp y Windows Terminal Preview hay que activar el protocolo de teclado de Kitty.

La barra de estado muestra modelo, tokens usados frente a la ventana, coste estimado, compresiones, tareas en segundo plano, duración y el aviso de YOLO si está activo.

## Memoria

Hermes guarda dos memorias curadas por el propio agente e inyectadas en cada sesión:

| Archivo | Para qué | Límite |
| --- | --- | --- |
| `MEMORY.md` | Notas del agente: hechos del entorno, convenciones, lecciones | 2.200 caracteres (~800 tokens) |
| `USER.md` | Tu perfil: preferencias, estilo, expectativas | 1.375 caracteres (~500 tokens) |

Además, **session search** busca en todas las conversaciones pasadas (SQLite FTS5, sin llamadas al LLM). La memoria cuesta tokens en cada prompt; la búsqueda solo cuando se usa. `/journey` abre un mapa de lo aprendido (skills y memorias) que se puede editar o borrar. Hay proveedores externos de memoria como plugins (Honcho, Mem0, Supermemory…).

La memoria se actualiza en los límites de sesión: si le pides que recuerde algo, lo verá en la **siguiente** sesión.

## Skills

Una skill es un documento `SKILL.md` con procedimiento, errores comunes y verificación, que se carga bajo demanda (*progressive disclosure*). Hermes:

- crea skills a partir de lo que resolvió, y un **Curator** en segundo plano las revisa, archiva las obsoletas y registra su uso;
- aprende skills nuevas con `/learn` desde una carpeta, una URL, la conversación actual o un corpus grande;
- instala skills del [Skills Hub](https://agentskills.io) (`/skills browse`);
- admite skills por proyecto, con un paso de confianza antes de cargarlas.

## Archivos de contexto

Hermes lee automáticamente, en este orden de prioridad:

| Archivo | Uso |
| --- | --- |
| `.hermes.md` / `HERMES.md` | Instrucciones del proyecto (máxima prioridad) |
| `AGENTS.override.md` | Override personal, normalmente en `.gitignore` |
| `AGENTS.md` | Convenciones y arquitectura del proyecto |
| `CLAUDE.md` | También se detecta |
| `SOUL.md` | Personalidad global de la instancia (`HERMES_HOME/SOUL.md`) |
| `.cursorrules`, `.cursor/rules/*.mdc` | Reglas de Cursor |

Se descubren desde la raíz de Git hasta la carpeta actual y en subcarpetas a medida que el agente las visita. `--ignore-rules` los omite.

## Herramientas y backends

Más de 40 herramientas agrupadas en *toolsets*: web (`web_search`, `web_extract`), terminal y archivos, navegador, visión, generación de imágenes y voz, delegación a subagentes (`delegate_task`), ejecución de código, memoria, `cronjob` para tareas programadas, Home Assistant y cualquier servidor **MCP**.

El terminal del agente puede ejecutarse en distintos **backends**:

| Backend | Uso |
| --- | --- |
| `local` | Tu máquina (por defecto) |
| `docker` | Contenedores aislados |
| `ssh` | Un servidor remoto, lejos del propio código de Hermes |
| `singularity` | HPC, sin root |
| `modal`, `daytona`, `vercel_sandbox` | Sandboxes en la nube |

Hermes también se puede usar como librería de Python, dentro de editores compatibles con **ACP** y con presets de *Mixture of Agents*.

## Seguridad

Los comandos peligrosos pasan por aprobación (`approvals.mode` en `config.yaml`):

| Modo | Comportamiento |
| --- | --- |
| `smart` (por defecto) | Un LLM auxiliar evalúa el riesgo: aprueba lo trivial, deniega lo claramente peligroso y pregunta el resto |
| `manual` | Siempre pregunta |
| `off` | Sin comprobaciones (equivale a `--yolo`) |

Disparan aprobación, entre otros, `rm -r`, `chmod 777`, `mkfs`, `dd if=`, `DROP TABLE`, `DELETE FROM` sin `WHERE`, `systemctl stop` o `kill -9 -1`. Hay además una **lista negra fija** que ni YOLO desbloquea (`rm -rf /`, fork bombs, formatear el disco raíz…) y reglas `approvals.deny` propias. Las tareas cron, las consultas `-q` y las plataformas sin humano deniegan por defecto.

Para el gateway: empareja solo tus usuarios (DM pairing), usa un backend aislado si el agente es accesible desde fuera y guarda las claves en `~/.hermes/.env`.

## Migrar desde otros agentes

```bash
hermes import-agent claude-code --dry-run   # vista previa desde ~/.claude
hermes import-agent codex                   # desde ~/.codex
hermes import-agent --sync                  # reimportar lo que cambió
hermes claw migrate                         # desde OpenClaw
```

De Claude Code importa `CLAUDE.md` a la memoria, las reglas `Bash(...)` de `permissions` a la allowlist/denylist, los servidores MCP y las skills; los slash commands se omiten (conviértelos en skills). **Nunca** importa credenciales.

## Fuentes

- [Repositorio](https://github.com/NousResearch/hermes-agent) · [Sitio oficial](https://hermes-agent.nousresearch.com/)
- [Documentación](https://hermes-agent.nousresearch.com/docs/) — [Instalación](https://hermes-agent.nousresearch.com/docs/getting-started/installation), [CLI](https://hermes-agent.nousresearch.com/docs/user-guide/cli), [Configuración](https://hermes-agent.nousresearch.com/docs/user-guide/configuration)
- [Memoria](https://hermes-agent.nousresearch.com/docs/user-guide/features/memory) · [Skills](https://hermes-agent.nousresearch.com/docs/user-guide/features/skills) · [Archivos de contexto](https://hermes-agent.nousresearch.com/docs/user-guide/features/context-files)
- [Herramientas](https://hermes-agent.nousresearch.com/docs/user-guide/features/tools) · [Seguridad](https://hermes-agent.nousresearch.com/docs/user-guide/security) · [Gateway de mensajería](https://hermes-agent.nousresearch.com/docs/user-guide/messaging)
- [Importar desde otros agentes](https://hermes-agent.nousresearch.com/docs/user-guide/import-from-other-agents)
- [Referencia de comandos](https://hermes-agent.nousresearch.com/docs/reference/cli-commands) · [Variables de entorno](https://hermes-agent.nousresearch.com/docs/reference/environment-variables)
- [Nous Portal](https://portal.nousresearch.com) · [Discord](https://discord.gg/NousResearch)
