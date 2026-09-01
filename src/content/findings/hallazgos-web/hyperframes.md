---
title: "HyperFrames — HTML convertido en video determinista"
description: "Herramienta que convierte una página creada con HTML y CSS en un video reproducible, útil para generar muchas piezas con el mismo diseño mediante código."
type: resources
order: 1
tags: [video, html, css, animacion, cli, ia, agentes, typescript]
url: https://github.com/heygen-com/hyperframes
resourceCategory: developer-tools
personalNote: "La palabra clave es determinista: el mismo HTML produce el mismo MP4, así que un video pasa a ser un artefacto de build y no un archivo que alguien exportó a mano."
updatedAt: 2026-08-30
---

> Creado por **[HeyGen](https://github.com/heygen-com)** con licencia Apache-2.0. Unas 43.200 estrellas, escrito en TypeScript. Su lema lo resume: _escribe HTML, renderiza video_.

**HyperFrames** es un framework de código abierto para convertir **HTML, CSS, contenido multimedia y animaciones** en **videos MP4 deterministas**.

## Por qué "determinista" es la palabra importante

Un video exportado desde un editor depende de quién lo exportó, con qué ajustes y en qué momento. Reproducirlo exactamente es difícil, y cambiar una palabra obliga a rehacer el proceso entero.

Aquí el video es la **salida de un build**: el mismo HTML de entrada produce el mismo MP4 de salida. Eso permite versionar la fuente en Git, revisar cambios en un _pull request_ y regenerar en integración continua.

## Tres formas de usarlo

| Modo                           | Para qué                                                                       |
| ------------------------------ | ------------------------------------------------------------------------------ |
| **CLI local**                  | Renderizar en tu máquina desde la línea de comandos                            |
| **Desde un agente de IA**      | El agente escribe el HTML y encarga el render mediante habilidades específicas |
| **Como núcleo de renderizado** | Motor detrás de un flujo de autoría alojado                                    |

El segundo modo es el que explica su diseño: al ser HTML, un agente de codificación ya sabe producirlo. No hace falta enseñarle la línea de tiempo de un editor de video.

## Qué hay por debajo

Sus temas en GitHub lo describen bien: **ffmpeg** para la codificación, **puppeteer** para renderizar la página, **GSAP** para animación y **MCP** para la integración con agentes.

## Casos donde encaja

- Videos generados a partir de datos: informes, resúmenes semanales, tarjetas de resultados.
- Piezas repetitivas con plantilla, donde solo cambian texto e imágenes.
- Contenido que debe regenerarse cuando cambian los datos de origen.

## Qué tener en cuenta

- **No sustituye a un editor de video.** Para grabar y montar material real, una herramienta como [Borumi](/applications/apps-video/application-borumi) hace otra cosa completamente distinta.
- **Renderizar cuesta.** Detrás hay un navegador headless y ffmpeg; un video largo consume tiempo de CPU de verdad.
- **La animación en HTML tiene límites.** Lo que se puede expresar con CSS y GSAP es mucho, pero no es After Effects.
