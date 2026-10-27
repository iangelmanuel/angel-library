---
title: "HyperFrames — HTML convertido en video determinista"
description: "Framework open source de HeyGen que convierte HTML, CSS, multimedia y animaciones en videos MP4 deterministas, pensado para que los agentes de código produzcan video con skills, CLI y un editor en el navegador."
tags: [video, html, css, animacion, cli, ia, agentes, typescript, skills, gsap, ffmpeg]
sidebar:
  order: 1
draft: false
resourceCategory: developer-tools
official: true
website: https://hyperframes.heygen.com
github: https://github.com/heygen-com/hyperframes
technologies:
  - packages/astro-gsap/gsap
  - skills/skills-fundamentos/ai-tools-skills-fundamentals
  - applications/apps-video/application-borumi
note: "Licencia Apache 2.0, sin tarifas por render ni umbrales de uso comercial. Requiere Node.js 22 o superior y FFmpeg. Versión 0.8.208 a octubre de 2026: todavía en 0.x y con releases casi diarias."
warnings:
  - "Sin `--skill`, una instalación no interactiva de `npx skills add heygen-com/hyperframes` instala las 7 skills publicadas. Para agentes, el README recomienda `npx hyperframes skills update`, que instala solo el núcleo."
  - "La skill `/media-use` puede generar música, voz, avatares o video con servicios de HeyGen, que son de pago y externos al proyecto open source."
  - "Renderizar consume CPU de verdad: cada fotograma pasa por un Chrome headless y FFmpeg. Para lotes grandes existe el render distribuido en AWS Lambda, con su propio coste."
updatedAt: 2026-10-27
---

> Creado por **[HeyGen](https://github.com/heygen-com)** con licencia Apache 2.0. Ronda las **73 500 estrellas** a finales de octubre de 2026 (unas 43 000 en agosto) y está escrito en TypeScript. Su lema lo resume: _Write HTML. Render video. Built for agents._

**HyperFrames** es un framework de código abierto para convertir **HTML, CSS, contenido multimedia y animaciones** en **videos MP4 deterministas**. HeyGen lo usa en producción y, según su README, equipos como tldraw o TanStack tienen ejemplos de uso.

## Por qué "determinista" es la palabra importante

Un video exportado desde un editor depende de quién lo exportó, con qué ajustes y en qué momento. Reproducirlo exactamente es difícil, y cambiar una palabra obliga a rehacer el proceso entero.

Aquí el video es la **salida de un build**: el renderizador busca cada fotograma en un Chrome headless y lo codifica con FFmpeg, así que el mismo HTML de entrada produce el mismo MP4. Eso permite versionar la fuente en Git, revisar cambios en un _pull request_, hacer tests de regresión y regenerar en integración continua.

## Formas de usarlo

| Modo                        | Para qué                                                                                       |
| --------------------------- | ---------------------------------------------------------------------------------------------- |
| **Desde un agente de IA**   | El agente escribe el HTML y sigue el ciclo de producción que le enseñan las skills              |
| **CLI local**               | Crear, previsualizar, revisar (lint) y renderizar desde la terminal                            |
| **Studio**                  | Editor en el navegador para previsualizar y editar composiciones (disponible, en evolución)    |
| **hyperframes.dev**         | Playground comunitario para iterar, compartir y renderizar proyectos                           |
| **Núcleo de renderizado**   | Motor detrás de flujos de autoría alojados, en local, Docker o AWS Lambda                      |

El modo agente es el que explica su diseño: un agente de código ya sabe escribir HTML, así que no hace falta enseñarle la línea de tiempo de un editor de video. El README menciona además una app nativa para Mac y Linux.

## Con un agente de código

Funciona con Claude Code, Codex, Cursor, Gemini CLI, IBM Bob y otros agentes que admiten skills; la guía de plugins cubre también Copilot y VS Code. En Claude Code se instala como plugin versionado:

```bash
claude plugin marketplace add heygen-com/hyperframes
claude plugin install hyperframes@hyperframes
```

Después se invoca con `/hyperframes:hyperframes`. Para el resto de agentes (OpenCode incluido), con skills independientes:

```bash
npx hyperframes skills update
```

Ese comando instala el **núcleo** desde la rama `main`. La alternativa interactiva, `npx skills add heygen-com/hyperframes`, abre un selector sin nada marcado; el grupo **Core Skills** es todo lo que hace falta. Un prompt de ejemplo del README:

```text
Using /hyperframes, create a 10-second product intro with a fade-in title, a background video, and subtle background music.
```

> Una **skill** es un `SKILL.md` con instrucciones que el agente carga cuando la tarea lo pide. Más contexto en [IA Tools: comandos, skills, plugins, hooks y MCP](/skills/skills-fundamentos/ai-tools-skills-fundamentals).

### Las skills

HyperFrames publica 7 skills. Cuatro forman el núcleo y tres se instalan bajo demanda con `npx hyperframes skills update <nombre>`:

| Skill                      | Grupo        | Para qué                                                                                     |
| -------------------------- | ------------ | -------------------------------------------------------------------------------------------- |
| `/hyperframes`             | Núcleo       | Contrato de render y ciclo de trabajo; se lee primero en cualquier petición de video          |
| `/hyperframes-cli`         | Núcleo       | La CLI por tareas: crear, revisar, previsualizar, renderizar en local o en la nube, publicar  |
| `/hyperframes-registry`    | Núcleo       | Unos 450 bloques y componentes listos: transiciones, títulos, subtítulos, gráficos, mapas, 3D |
| `/media-use`               | Núcleo       | Conseguir o generar música, efectos, imágenes, voz, avatares y video, con HeyGen o herramientas locales |
| `/figma`                   | Bajo demanda | Llevar diseños de Figma a un video                                                            |
| `/slideshow`               | Bajo demanda | Presentaciones navegables (no un MP4 renderizado)                                             |
| `/remotion-to-hyperframes` | Bajo demanda | Migrar proyectos de Remotion y otras herramientas, verificando fotograma a fotograma          |

## Con la CLI

```bash
npx hyperframes init my-video
cd my-video
npx hyperframes preview
npx hyperframes render
```

`preview` abre el navegador con recarga en vivo y `render` genera el MP4. Los bloques del catálogo se añaden como código editable:

```bash
npx hyperframes add data-chart
```

## Cómo se define un video

Una composición es HTML con atributos `data-*` para el tiempo y las pistas (`data-start`, `data-duration`, `data-track-index`). La animación tiene que ser **buscable** (_seekable_): el renderizador salta a cada fotograma en lugar de reproducir en tiempo real. Para eso usa adaptadores de GSAP, animaciones CSS, Lottie, Three.js, Anime.js o WAAPI, o uno propio. No hay paso de build: un `index.html` se reproduce tal cual.

## Qué hay por debajo

| Paquete                 | Qué hace                                                       |
| ----------------------- | -------------------------------------------------------------- |
| `hyperframes`           | La CLI                                                         |
| `@hyperframes/core`     | Tipos, parsers, linter, runtime y adaptadores de animación      |
| `@hyperframes/engine`   | Captura página a video con Puppeteer y FFmpeg                  |
| `@hyperframes/producer` | Pipeline completo: captura, codificación y mezcla de audio      |
| `@hyperframes/studio`   | Interfaz del editor en el navegador                            |
| `@hyperframes/player`   | Web component `<hyperframes-player>` para incrustar            |
| `@hyperframes/aws-lambda` | Render distribuido en AWS Lambda                             |

## HyperFrames frente a Remotion

HyperFrames se inspira en Remotion y los dos renderizan con Chrome headless y FFmpeg. La diferencia está en cómo se escribe el video:

|                     | HyperFrames                         | Remotion                          |
| ------------------- | ----------------------------------- | --------------------------------- |
| Autoría             | HTML + CSS + animación buscable     | Componentes React                 |
| Paso de build       | Ninguno                             | Necesita bundler                  |
| Entrega a un agente | Archivos HTML                       | Proyecto JSX/React                |
| Render distribuido  | Local y AWS Lambda                  | Remotion Lambda, más maduro       |
| Licencia            | Apache 2.0                          | Remotion License (source-available) |

## Casos donde encaja

- Videos de lanzamiento, anuncios de funcionalidades y recorridos de PR con diffs animados.
- Visualizaciones de datos, gráficos animados y mapas.
- Piezas repetitivas con plantilla y videos para redes con subtítulos animados.
- Contenido que debe regenerarse cuando cambian los datos de origen.

## Qué tener en cuenta

- **No sustituye a un editor de video.** Para grabar y montar material real, una herramienta como [Borumi](/applications/apps-video/application-borumi) hace otra cosa completamente distinta.
- **La animación en HTML tiene límites.** Con CSS, GSAP o Three.js se expresa mucho, pero no es After Effects.
- **Las skills de skills.sh pueden ir por detrás.** Según el README, el registro puede tardar horas en reflejar `main`; `npx hyperframes skills update` instala la versión más reciente.
- **Clonar el repositorio para desarrollar** descarga unos 240 MB de videos de referencia vía Git LFS; con `GIT_LFS_SKIP_SMUDGE=1` te los saltas.

## Fuentes

- [Repositorio y README de HyperFrames](https://github.com/heygen-com/hyperframes)
- [Documentación oficial](https://hyperframes.heygen.com/introduction)
- [Quickstart](https://hyperframes.heygen.com/quickstart)
- [hyperframes.dev](https://www.hyperframes.dev/)
