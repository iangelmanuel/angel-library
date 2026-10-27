---
title: "ThinkRail: el IDE agéntico de JetBrains construido sobre pi"
description: "IDE ligero y open source de JetBrains que envuelve al agente de código pi con editor, terminales, diffs y workspaces aislados en git worktrees, y que mantiene el conocimiento del proyecto en especificaciones vivas (SPEC.md)."
tags: [thinkrail, jetbrains, ide, agentes, pi, worktrees, specs, mcp, skills]
sidebar:
  order: 3
draft: false
resourceCategory: Sitio oficial
official: true
website: https://thinkrail.ai/
github: https://github.com/JetBrains/thinkrail
technologies:
  - agents/agents-fundamentos/coding-agents-fundamentals
  - git/git/git-worktree
  - findings/hallazgos-ia/orca
  - applications/apps-orchestration/herdr
note: "Proyecto de incubadora de JetBrains, Apache-2.0, versión estable 0.2.0 (octubre de 2026). Necesita git en el PATH y un proveedor de modelos: JetBrains AI o tus propias credenciales a través de pi."
warnings:
  - "Las analíticas básicas (arranques, chats, mensajes enviados) y los informes de error se envían siempre, ligados a un ID de instalación. Solo el uso adicional se puede desactivar, en Ajustes → Privacidad o con --no-analytics."
  - "Es software temprano con builds nightly casi diarias. En Linux los binarios no están firmados y en macOS el CLI está firmado pero aún no notarizado."
  - "El agente ejecuta comandos y edita archivos con tus permisos, y el coste de los tokens corre por cuenta de tu proveedor. Revisa los diffs antes de fusionar."
updatedAt: 2026-10-27
---

## En pocas palabras

[ThinkRail](https://thinkrail.ai/) es un **IDE agéntico** de JetBrains: una aplicación de escritorio (o una web servida desde tu máquina) cuyo centro es una conversación con un agente de código, rodeada de las piezas de un IDE de verdad: editor Monaco con pestañas, árbol de archivos con marcas de git, terminales, diffs y revisión.

No reinventa el agente. Envuelve a [`pi`](https://www.npmjs.com/package/@earendil-works/pi-coding-agent), un agente de código de línea de comandos, y le añade workspaces aislados, especificaciones del proyecto que persisten entre sesiones y skills reutilizables. Es un proyecto de la incubadora de JetBrains, independiente de IntelliJ, con licencia **Apache-2.0** y unas 3.500 estrellas.

> Un **agente de código** es un modelo de lenguaje que, además de responder, usa herramientas: lee archivos, ejecuta comandos y edita código en bucle hasta cumplir una tarea. Si el concepto es nuevo, empieza por [fundamentos de agentes de código](/agents/agents-fundamentos/coding-agents-fundamentals).

## Qué problema resuelve

Los agentes de terminal son potentes pero poco visibles: cuesta seguir varias sesiones en paralelo, revisar lo que cambiaron y que recuerden las decisiones del proyecto de una conversación a la siguiente. Los editores con IA, por su parte, suelen atar el agente a un proveedor propio.

ThinkRail intenta cubrir ambos huecos:

- **Paralelismo sin pisarse**: cada tarea va en su propio worktree.
- **Memoria del proyecto**: la intención vive en archivos `SPEC.md` versionados junto al código, no en el historial del chat.
- **Proveedor libre**: usa la configuración de `pi`, así que no tiene cuentas propias.

## La idea de «se mejora con el uso»

El lema es «el IDE agéntico que mejora cada vez que lo usas». Conviene leerlo con precisión. Según el README, hoy aprende tu proyecto a través de las **especificaciones vivas**; la siguiente fase es dar **soporte completo de extensiones** para que ThinkRail cree las herramientas que necesite según cómo trabajas. Es decir: que el IDE se amplíe a sí mismo es la hoja de ruta, no algo que ya haga.

## Cómo funciona

El README lo describe en tres anillos:

| Anillo        | Paquete                                 | Papel                                                                        |
| ------------- | --------------------------------------- | ---------------------------------------------------------------------------- |
| Engine host   | `packages/server`, `packages/shared`    | Servidor HTTP y WebSocket sobre `Bun.serve`, con una sesión de `pi` por chat |
| El cable      | `packages/contracts`                    | Protocolo tipado y versionado entre el host y la interfaz                    |
| Cliente de UI | `apps/web`                              | React 19, Zustand y Tailwind v4; solo depende de los contratos               |

`pi` se encarga de los modelos, las skills, la compactación del contexto, el coste y el estado de la sesión. ThinkRail se encarga del workspace, el editor y la comunicación, y según el README nunca monta prompts a tus espaldas. La app de escritorio usa Electrobun; el CLI `thinkrail` abre la misma app en el navegador.

## Características

| Función                  | Qué hace                                                                                                                       |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------ |
| Workspaces aislados      | Cada uno es un [git worktree](/git/git/git-worktree) con su rama. Los terminados se archivan solos al fusionarse su PR         |
| Flujo de PR              | Publicar, hacer push, abrir el PR, ver el CI y la revisión, y pasar al agente las comprobaciones que fallan (vía tu `gh`)      |
| Varios chats por workspace | Cada uno con su modelo y contador de tokens y coste; subagentes y un plan compartido que puedes editar                         |
| Especificaciones vivas   | Un grafo de `SPEC.md` que el agente lee y mantiene con herramientas `spec_*`                                                   |
| Skills y workflows       | Lee las [Agent Skills](/skills/skills-fundamentos/ai-tools-skills-fundamentals) que ya usas con otros agentes                  |
| Servidores MCP           | Conecta los del `mcp.json` de `pi` y pide permiso antes de llamadas que no sean de solo lectura                                |
| Revisión                 | Comentarios anclados en archivos y diffs que se envían al chat como contexto                                                   |
| Idiomas                  | Inglés, chino simplificado y español incluidos                                                                                 |

Un **servidor MCP** (_Model Context Protocol_) es un proceso que expone herramientas a un agente con un protocolo estándar; ver [MCP en Claude Code](/agents/claude-code/claude-code-mcp).

## Instalación

Hay instaladores de escritorio en las [releases](https://github.com/JetBrains/thinkrail/releases): DMG para macOS 14+ (Apple Silicon o Intel), un ZIP con instalador para Windows x64 y un tarball para Linux x64/ARM64 (Ubuntu 24.04 o posterior, con GTK 3 y WebKitGTK 4.1).

El CLI se instala con un script que verifica el SHA-256 del binario:

```bash
# macOS, Linux o Git Bash en Windows
curl -fsSL https://raw.githubusercontent.com/JetBrains/thinkrail/main/install.sh | bash
```

```powershell
# Windows (cmd o PowerShell)
powershell -c "irm https://raw.githubusercontent.com/JetBrains/thinkrail/main/install.ps1 | iex"
```

Después ábrelo, opcionalmente con un repositorio:

```bash
thinkrail ~/code/my-repo
```

`thinkrail update` actualiza el binario y `thinkrail uninstall` lo quita y pregunta si borrar el estado en `~/.thinkrail`. Antes de ejecutar un `curl | bash`, revisa el script.

## Cuándo conviene y cuándo no

Conviene si ya usas agentes de terminal y quieres verlos trabajar en paralelo con diffs, terminales y PRs en la misma ventana, o si te interesa el desarrollo guiado por especificaciones.

No es un sustituto de un IDE completo como IntelliJ o [VS Code](/applications/apps-editors/application-vscode): su README no promete el ecosistema de extensiones ni las herramientas de lenguaje de esos editores, y su modelo de trabajo gira alrededor del agente. Si prefieres un editor clásico con IA integrada, [Cursor](/applications/apps-editors/application-cursor) encaja mejor.

## Alternativas

| Herramienta                                            | Diferencia                                                                     |
| ------------------------------------------------------ | ------------------------------------------------------------------------------ |
| [Cursor](/applications/apps-editors/application-cursor) | Editor basado en VS Code con agente propio; el editor es el centro            |
| [Orca](/findings/hallazgos-ia/orca)                    | Orquestador visual de varios agentes de CLI en worktrees                       |
| [Herdr](/applications/apps-orchestration/herdr)        | Terminales persistentes para coordinar agentes, sin editor                     |

## Límites y precauciones

- **Madurez.** Va por la 0.2 estable y saca nightlies casi a diario; espera cambios de interfaz y de formato.
- **Privacidad.** Los prompts, el código y las credenciales no forman parte de las analíticas según el README, pero los eventos básicos y los errores se envían siempre. Con el uso adicional activado, el paquete puede abrir una vez el blog de ThinkRail para atribuir tu instalación a una visita web.
- **Seguridad.** Los servidores MCP que define un repositorio quedan desactivados hasta que los apruebas. Mantén esa revisión: un MCP es código que el agente puede invocar.

## Fuentes

- [Web oficial](https://thinkrail.ai/)
- [Repositorio y README](https://github.com/JetBrains/thinkrail)
- [Arquitectura](https://github.com/JetBrains/thinkrail/blob/main/architecture.md)
- [Releases](https://github.com/JetBrains/thinkrail/releases)
- [Paquete de `pi` en npm](https://www.npmjs.com/package/@earendil-works/pi-coding-agent)
