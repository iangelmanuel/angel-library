---
title: "Better Claude — plugins de midudev para Claude Code"
description: "Marketplace de plugins pequeños para Claude Code creado por midudev: vista previa de imágenes al pasar el puntero, medidor de uso de la suscripción, commits convencionales con Haiku y otras mejoras de la interfaz."
tags: [ai, plugin, claude-code, midudev, git, productividad, marketplace]
sidebar:
  order: 7
draft: false
tool: Claude Code
resourceCategory: Sitio oficial
official: true
website: https://betterclaude.dev
github: https://github.com/midudev/better-claude
technologies:
  - agents/claude-code/claude-code-plugins
  - skills/ia-plugins/plugin-commit-commands
  - skills/ia-comandos/comando-commit
note: "Licencia MIT, gratis. Proyecto independiente, sin relación con Anthropic. Image Preview necesita la interfaz a pantalla completa de Claude Code (`\"tui\": \"fullscreen\"`) y Sub Meter solo muestra datos con una suscripción, no con facturación por API key."
warnings:
  - "La opción recomendada de `/commit` hace commit y push sobre la rama actual, `main` incluida. En modo no interactivo (`claude -p \"/commit\"`) no pregunta: hace commit y push directamente."
  - "Los mods redibujan partes de la interfaz de Claude Code y lanzan procesos del sistema (PowerShell, `osascript`, ImageMagick). Revisa el código del plugin antes de instalarlo y activa la actualización automática solo si confías en el marketplace."
updatedAt: 2026-10-27
---

> Plugins creados y mantenidos por **Miguel Ángel Durán**, [Midudev](https://github.com/midudev).

## En pocas palabras

**Better Claude** es un repositorio que funciona como **marketplace de plugins para Claude Code**: cada carpeta de `plugins/` es un plugin que se instala por separado. Son piezas pequeñas que resuelven molestias concretas del día a día: ver una imagen pegada sin salir de la terminal, saber cuánto queda de la suscripción o partir los cambios en commits limpios.

> Un **plugin** de Claude Code empaqueta comandos, hooks, skills o servidores MCP para instalarlos con un solo comando. Un **marketplace** es un repositorio que lista plugins. Más contexto en [Plugins en Claude Code](/agents/claude-code/claude-code-plugins).

El repositorio ronda las 200 estrellas a finales de octubre de 2026 y recibe cambios casi a diario.

## Qué incluye

Los más conocidos son Image Preview, Sub Meter y Commit, pero el marketplace lista **11 plugins**. Siete aparecen en el README con su comando de instalación; los otros cuatro (After, Use Haiku, Think Hard y Token Meter) están en el manifiesto del marketplace y en la web.

| Plugin            | Qué hace                                                                                                                         |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| **Image Preview** | Al pasar el puntero sobre un `[Image #N]` pegado, muestra la imagen en una ventana pequeña o dibujada en la terminal              |
| **Sub Meter**     | Uso de la suscripción abajo a la derecha: ventana de 5 horas y semanal, como barra, con el tiempo hasta el reinicio              |
| **Commit**        | `/commit` pregunta qué hacer y separa los cambios en Conventional Commits, uno por grupo lógico, usando Haiku 5.5                  |
| **Quick Peek**    | Las rutas de las respuestas se vuelven enlaces: vista previa al pasar el puntero, clic para mostrarlas en Finder                  |
| **Context Meter** | Ocupación de la ventana de contexto sobre el prompt: amarillo cuando toca `/compact`, rojo cuando conviene una sesión nueva        |
| **Narrator**      | Lee en voz alta lo que hizo Claude tras cada turno, con la voz del sistema                                                      |
| **Time Machine**  | Un snapshot de git por cada turno que cambia archivos; `/timeline` deja los archivos como estaban antes de cualquier turno       |
| **After**         | Cola de prompts: `/after <tarea>` la ejecuta cuando Claude termina                                                               |
| **Use Haiku**     | Un prompt que empieza por `_` se ejecuta en Haiku                                                                                |
| **Think Hard**    | Un prompt que empieza por `+` se ejecuta con el máximo esfuerzo de razonamiento                                                   |
| **Token Meter**   | Tokens de cada turno y total de la sesión bajo el prompt                                                                         |

## Instalación

Primero se añade el marketplace y después cada plugin que quieras:

```text
/plugin marketplace add midudev/better-claude
/plugin install image-preview@better-claude
/plugin install sub-meter@better-claude
/plugin install commit@better-claude
```

El resto sigue el mismo patrón: `quick-peek`, `context-meter`, `narrator`, `time-machine`, `after`, `use-haiku`, `think-hard` y `token-meter`, siempre con el sufijo `@better-claude`. La web ofrece además un botón que copia un prompt de instalación para pegarlo en Claude Code.

Claude Code deja desactivada la actualización automática en los marketplaces que no son de Anthropic. Para activarla: `/plugin` → **Marketplaces** → **better-claude** → **Enable auto-update**.

## Los tres más usados, en detalle

### Image Preview

Mientras escribes, una fila sobre el prompt lista las imágenes pegadas; al pasar el puntero se abre la vista previa y al hacer clic se abre en el visor del sistema. También funciona sobre los prompts ya enviados.

- En Warp, iTerm2, Terminal.app o VS Code la vista previa es una ventana sin bordes fuera de la terminal: panel AppKit en macOS, Windows Forms con PowerShell en Windows y WSL, Tk en Linux X11 (necesita `python3-tk` e ImageMagick).
- En Ghostty y kitty la terminal dibuja la imagen con el protocolo gráfico de kitty; en el resto, con caracteres de bloque en color (se ve la composición, no texto legible).
- Necesita que la terminal informe del movimiento del ratón. Según el README, un multiplexor intermedio puede impedirlo (en sus pruebas, herdr 0.9.1 no lo pasaba).

### Sub Meter

Alterna cada 8 segundos entre la ventana de 5 horas y la semanal (`display` en `/config`: `rotate`, `both`, `session` o `week`). La barra pasa a amarillo desde el 75 % y a rojo desde el 90 %. No hay ventana mensual porque Claude Code solo informa de esas dos, y el uso hecho fuera de Claude Code (claude.ai, la app móvil) aparece en la siguiente respuesta. Para hacer sitio oculta las pistas `(shift+tab to cycle)` y `esc to interrupt`, algo que se puede desactivar.

### Commit

`/commit` lee la rama, `git status` y `git diff HEAD`, y ofrece tres opciones:

| Opción                       | Qué hace                                                                       |
| ---------------------------- | ------------------------------------------------------------------------------ |
| **Commit + push** (recomendada) | Commits en la rama actual, `main` incluida, y push                          |
| **Commit only**              | Commits en la rama actual, sin push                                            |
| **Commit on a new branch**   | Crea una rama con nombre según los cambios (`feat/side-panel`), commitea y hace push |

Siempre corre en Haiku 5.5, sea cual sea el modelo de la sesión, lo que abarata un paso mecánico. Solo añade al stage los archivos de cada grupo, nunca `.env*` ni secretos, escribe mensajes `type(scope): resumen` en imperativo y por debajo de 72 caracteres, y **no añade** `Co-Authored-By` ni ninguna atribución a Claude. Sus herramientas permitidas se limitan a `Bash(git *)` y a la pregunta inicial.

## Cuándo conviene y cuándo no

**Conviene** si usas Claude Code a diario en la terminal y quieres ver más información (uso, contexto, tokens) sin comandos extra, o si quieres un `/commit` instalable y mantenido en lugar de copiar el [comando /commit](/skills/ia-comandos/comando-commit) a mano.

**No conviene** si tu equipo exige mensajes con atribución a la IA, revisar cada push o trabajar solo con plugins oficiales; en ese caso, [Commit Commands](/skills/ia-plugins/plugin-commit-commands) es la alternativa del marketplace de Anthropic.

## Límites y precauciones

- **Dependen de la interfaz de Claude Code.** Los mods enganchan el renderizado de la TUI; un cambio de Claude Code puede romperlos hasta que se actualicen.
- **Image Preview lee la carpeta temporal de la sesión**, donde Claude Code guarda las imágenes, y deja copias reducidas a su lado.
- **El soporte de Windows de Image Preview** está escrito y probado desde WSL, según su README; en Windows nativo, la primera ventana compila un pequeño helper en la carpeta temporal.

## Fuentes

- [betterclaude.dev](https://betterclaude.dev)
- [Repositorio midudev/better-claude](https://github.com/midudev/better-claude)
- [Manifiesto del marketplace](https://github.com/midudev/better-claude/blob/main/.claude-plugin/marketplace.json)
- [README de Image Preview](https://github.com/midudev/better-claude/blob/main/plugins/image-preview/README.md)
- [README de Sub Meter](https://github.com/midudev/better-claude/blob/main/plugins/sub-meter/README.md)
- [README de Commit](https://github.com/midudev/better-claude/blob/main/plugins/commit/README.md)
