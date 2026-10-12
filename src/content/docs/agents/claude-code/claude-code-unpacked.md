---
title: "Claude Code Unpacked: cómo funciona Claude Code por dentro"
description: "Sitio interactivo no oficial que recorre el bucle del agente, la arquitectura de carpetas, las más de 50 herramientas, el catálogo de comandos y las funciones ocultas de Claude Code, a partir del código que se filtró en marzo de 2026."
tags: [ai, claude-code, arquitectura, agente, herramientas, internals]
sidebar:
  order: 10
draft: false
tool: Claude Code
resourceCategory: learning
url: https://ccunpacked.dev/
technologies:
  - agents/claude-code/claude-code-comandos-nativos
  - agents/claude-code/claude-code-hooks
  - agents/claude-code/claude-code-subagentes
  - agents/claude-code/claude-code-mcp
  - agents/agents-fundamentos/coding-agents-fundamentals
note: "No es de Anthropic. Analiza una versión concreta del código (fecha de análisis: 31 de marzo de 2026); Claude Code ha cambiado mucho desde entonces."
warnings:
  - "La fuente es el código de Claude Code que quedó expuesto por error en el paquete de npm (un source map en la versión 2.1.88). Ese código sigue siendo propiedad de Anthropic: leer el análisis es una cosa, descargar o redistribuir los espejos del código es otra."
  - "El propio sitio avisa de que algunas cosas pueden estar mal o desactualizadas y de que la curación se hizo con ayuda de IA."
  - "Las «funciones ocultas» eran código detrás de flags en ese momento: pueden haber salido con otro nombre, haber cambiado o no salir nunca. No las tomes como funciones disponibles."
updatedAt: 2026-10-12
---

[Claude Code Unpacked](https://ccunpacked.dev/) responde a una pregunta concreta: **¿qué pasa exactamente cuando escribes un mensaje en Claude Code?** Es un sitio interactivo, creado por Zakaria O. I. A. ([@razakiau](https://github.com/razakiau)), que mapea el código fuente de la herramienta en cinco secciones navegables. Llegó a la portada de Hacker News.

Es útil para entender el modelo mental que hay detrás de las entradas de esta categoría: por qué existen los [hooks](/agents/claude-code/claude-code-hooks), cómo encajan los [subagentes](/agents/claude-code/claude-code-subagentes) o de dónde salen los [comandos nativos](/agents/claude-code/claude-code-comandos-nativos).

## De dónde sale

El 31 de marzo de 2026, la versión 2.1.88 del paquete `@anthropic-ai/claude-code` se publicó en npm con un *source map* (un archivo que relaciona el JavaScript empaquetado con el código original) que permitía recuperar el código TypeScript completo de la CLI. Lo detectó el investigador Chaofan Shou ([@Fried_rice](https://x.com/Fried_rice)), y el código circuló en espejos de GitHub. Afectaba solo a la herramienta de terminal: no a los modelos ni a datos de clientes.

Claude Code Unpacked se construyó sobre ese código ese mismo día. Por eso es una **foto fija**: describe cómo era Claude Code en marzo de 2026, no necesariamente cómo es hoy.

## Las cinco secciones

### 1. El bucle del agente

Un recorrido animado en 11 pasos, "de la pulsación de tecla a la respuesta renderizada", con el archivo fuente de cada etapa:

| Paso | Qué ocurre |
| --- | --- |
| 1. Input | La entrada llega del componente `TextInput` de Ink (la librería de React para terminales) o de `stdin` en modo no interactivo |
| 2. Message | Se construye el mensaje |
| 3. History | Se añade al historial de la conversación |
| 4. System | Se arma el system prompt |
| 5. API | Llamada al modelo |
| 6. Tokens | Recuento y streaming de tokens |
| 7. Tools? | ¿La respuesta pide usar una herramienta? |
| 8. Loop | Si la pide, se ejecuta y el resultado vuelve al modelo |
| 9. Render | Se pinta la respuesta en la terminal |
| 10. Hooks | Se disparan los hooks configurados |
| 11. Await | Espera el siguiente mensaje |

El paso 8 es la esencia de un agente: **el modelo no ejecuta nada por sí mismo**. Pide una herramienta, el programa la ejecuta y le devuelve el resultado, y eso se repite hasta que el modelo responde sin pedir ninguna. Lo explica con más calma [Agentes de programación: conceptos fundamentales](/agents/agents-fundamentos/coding-agents-fundamentals).

### 2. Explorador de arquitectura

El árbol de `src/` con el número de archivos por carpeta. Las más grandes en ese momento: `utils` (564), `components` (389), `commands` (189), `tools` (184), `services` (130), `hooks` (104), `ink` (96), `bridge` (31) y `skills` (20). Da una idea de dónde está el peso: buena parte del código es interfaz de terminal y utilidades, no "IA".

### 3. Sistema de herramientas

Todas las herramientas integradas, agrupadas por función:

| Grupo | Ejemplos |
| --- | --- |
| Archivos | FileRead, FileEdit, FileWrite, Glob, Grep, NotebookEdit |
| Ejecución | Bash, PowerShell, REPL |
| Búsqueda | WebFetch, WebSearch, ToolSearch |
| Agentes y tareas | Agent, SendMessage, TaskCreate, TaskList, TeamCreate… |
| Planificación | EnterPlanMode, ExitPlanMode, EnterWorktree, ExitWorktree |
| MCP | Llamadas a servidores MCP, ListMcpResources, ReadMcpResource, McpAuth |
| Sistema | AskUserQuestion, TodoWrite, Skill, Config… |
| Experimentales | Sleep, Monitor, LSP, PushNotification… |

Las marcadas con candado en el sitio estaban tras un flag o no publicadas. Cada herramienta enlaza a su archivo fuente.

### 4. Catálogo de comandos

Los comandos slash agrupados en configuración (`/init`, `/model`, `/mcp`, `/hooks`…), flujo diario (`/compact`, `/context`, `/plan`, `/resume`, `/effort`…), revisión y git (`/review`, `/commit`, `/security-review`…), diagnóstico (`/cost`, `/usage`, `/rewind`…) y avanzados. Es un buen complemento a [Comandos nativos](/agents/claude-code/claude-code-comandos-nativos), con la salvedad de que incluye comandos internos que un usuario normal no ve.

### 5. Funciones ocultas

Código presente pero no lanzado en esa versión, con flags, variables de entorno o comentado:

- **Coordinator Mode**: un agente principal divide la tarea y lanza trabajadores en paralelo en *git worktrees* aislados.
- **Kairos**: modo persistente con memoria consolidada entre sesiones y acciones autónomas en segundo plano.
- **UltraPlan**: sesiones de planificación largas, de hasta 30 minutos.
- **Bridge**: controlar una sesión desde el móvil o el navegador.
- **Daemon Mode**: sesiones en segundo plano con `--bg`, sobre `tmux`.
- **UDS Inbox**: sesiones que se comunican por sockets Unix.
- **Auto-Dream**: entre sesiones, repasar lo ocurrido y organizar lo aprendido.
- **Buddy**: una mascota virtual en la terminal.

Contrasta siempre con la documentación oficial antes de dar algo por disponible.

## Cómo aprovecharlo

- **Para juniors**: el bucle del agente en 11 pasos es la forma más clara de entender que un agente es "modelo + herramientas + un bucle", sin magia.
- **Para seniors**: el catálogo de herramientas y la arquitectura sirven como referencia de cómo se estructura un agente de producción, útil si construyes el tuyo o diseñas hooks y servidores MCP.
- **No lo uses como documentación**: para saber cómo funciona hoy una opción, la fuente es la [documentación oficial de Claude Code](https://docs.anthropic.com/en/docs/claude-code/overview).

## Fuentes

- [Claude Code Unpacked](https://ccunpacked.dev/)
- [InfoQ: Claude Code source leak](https://infoq.com/news/2026/04/claude-code-source-leak)
- [Documentación oficial de Claude Code](https://docs.anthropic.com/en/docs/claude-code/overview)
