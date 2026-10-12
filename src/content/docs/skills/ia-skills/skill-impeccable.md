---
title: "Impeccable — lenguaje de diseño y auditoría visual para agentes"
description: "Una skill con 24 comandos, modo Live en el navegador y 59 reglas deterministas para que un agente dé forma, revise y pula interfaces sin caer en los patrones genéricos del frontend generado por IA."
tags: [ai, skill, frontend, diseño, ui, auditoria, accesibilidad, claude-code, codex, cursor]
sidebar:
  order: 32
draft: false
tool: Cross-tool
resourceCategory: Sitio oficial
official: true
website: https://impeccable.style/
github: https://github.com/pbakaus/impeccable
technologies:
  - skills/ia-skills/skill-frontend-design
  - skills/ia-skills/skill-taste
  - skills/skills-fundamentos/design-md
  - skills/skills-fundamentos/ai-tools-skills-fundamentals
note: "Licencia Apache 2.0. La skill no necesita runtime propio: un lanzador ejecuta un binario autocontenido que se descarga una vez en `~/.impeccable/bin/`. Node.js solo hace falta para el instalador `npx impeccable`."
warnings:
  - "En Claude Code, Codex, Cursor, Copilot y Grok Build el instalador añade un hook que corre en cada edición de UI. En Claude Code los hooks se ejecutan aunque deniegues el comando al modelo; revísalos antes de sesiones sin supervisión."
  - "El modo Live, al aplicar ediciones de texto, ejecuta el script `impeccable:manual-edit-validate` de `package.json` si existe. Úsalo solo en proyectos de confianza y nunca contra un sitio en producción."
updatedAt: 2026-10-12
---

## En pocas palabras

**Impeccable** es una skill de diseño para agentes de código creada por [Paul Bakaus](https://www.paulbakaus.com). Instala **una sola skill** con **24 comandos**, un modo **Live** para iterar sobre elementos en el navegador y un detector con **59 reglas deterministas** que encuentra patrones típicos de frontend generado por IA sin llamar a ningún modelo. Ronda las **80 000 estrellas en GitHub a octubre de 2026** y tiene documentación completa en [impeccable.style](https://impeccable.style/).

Parte de la skill [frontend-design](/skills/ia-skills/skill-frontend-design) de Anthropic y la amplía con un vocabulario compartido: en vez de pedir "mejóralo", pides `/impeccable typeset` o `/impeccable distill` y el agente sabe qué tipo de cambio se espera.

> Una **skill** es un `SKILL.md` que el agente carga cuando la tarea lo pide; un **hook** es un comando que la herramienta ejecuta sola ante un evento, como editar un archivo. Ver [IA Tools: comandos, skills, plugins, hooks y MCP](/skills/skills-fundamentos/ai-tools-skills-fundamentals).

## Qué problema resuelve

Los modelos se entrenaron con las mismas plantillas SaaS y, sin guía, repiten los mismos rasgos: Inter en todo, degradados de morado a azul, tarjetas dentro de tarjetas, texto gris sobre fondos de color, el icono en un cuadrado redondeado sobre cada título. Impeccable ataca eso de tres formas:

- **Contexto de producto persistente.** `/impeccable init` escribe `PRODUCT.md` con audiencia, propósito, contexto de uso, restricciones y voz, para que los comandos siguientes no confundan hechos del producto con dirección visual.
- **Sistema de diseño documentado.** `DESIGN.md` registra tokens, tipografía y componentes existentes o nuevos (el formato se explica en [DESIGN.md](/skills/skills-fundamentos/design-md)).
- **Comprobaciones deterministas.** El detector revisa reglas como longitud de línea, padding apretado, áreas táctiles pequeñas, saltos de nivel de encabezado, bordes laterales decorativos o easing con rebote.

## Instalación

### Instalador (recomendado)

Desde la raíz del proyecto:

```bash
npx impeccable install
```

Detecta las carpetas de cada herramienta (`~/.claude`, `~/.codex`, `.cursor`…), deja elegir proveedores y si instalar en el proyecto o de forma global. En scripts se puede fijar todo con `--providers=claude,codex,cursor` y `--scope=project|global`. Después, recarga el agente y ejecuta dentro de él:

```text
/impeccable init
```

Para actualizar una instalación existente:

```bash
npx impeccable update
```

En Codex hay que abrir `/hooks` y aprobar el hook del proyecto tras instalar o actualizar.

### Otras vías

- **Claude Code (plugin):** `/plugin marketplace add pbakaus/impeccable` y después instalar Impeccable desde `/plugin`.
- **GitHub Copilot en VS Code:** extensión `renaissance-geek.impeccable` del Marketplace (VS Code 1.109.3+; no instala hooks).
- **Submódulo de Git**, para equipos que quieren versionarla:

```bash
git submodule add https://github.com/pbakaus/impeccable .impeccable
npx impeccable link --source=.impeccable --providers=claude,cursor
```

- **Copia manual** desde `dist/<herramienta>/` del repositorio o el ZIP del sitio. El README cubre Cursor, Claude Code, OpenCode, Gemini CLI, Codex, Copilot, Hermes, Pi, Trae, Rovo Dev, Qoder, Mistral Vibe, Grok Build, Antigravity y DeepSeek Harness.

## Cómo se invoca

Todo pasa por `/impeccable`, con un comando y, opcionalmente, un objetivo:

```text
/impeccable audit blog
/impeccable critique landing
/impeccable polish el formulario de checkout
/impeccable rehaz esta sección hero
```

`/impeccable` solo muestra la lista completa. **En Codex** se usa `$impeccable` o el menú `/skills`. Si un comando se usa mucho, `/impeccable pin audit` crea `/audit` como atajo.

## Los 24 comandos

| Grupo             | Comandos                                                                                     |
| ----------------- | -------------------------------------------------------------------------------------------- |
| Preparar          | `init` (contexto y `PRODUCT.md`), `document` (genera `DESIGN.md` desde el código), `extract` (tokens y componentes reutilizables) |
| Planear y construir | `shape` (UX antes del código), `craft` (de la forma a la construcción con iteración visual) |
| Revisar           | `critique` (jerarquía, claridad, resonancia), `audit` (accesibilidad, rendimiento, responsive) |
| Ajustar intensidad | `bolder`, `quieter`, `distill`                                                              |
| Afinar            | `typeset`, `layout`, `colorize`, `animate`, `clarify` (textos de UX), `delight`, `overdrive` (efectos técnicamente extraordinarios) |
| Robustez          | `harden` (errores, i18n, desbordes, casos límite), `onboard` (primer uso, estados vacíos), `adapt` (dispositivos), `optimize` (rendimiento) |
| Cerrar            | `polish` (pasada final alineada al sistema de diseño)                                        |
| En el navegador   | `live` (variantes sobre elementos reales), `generate` (variantes de un elemento sin elegir a mano) |

Para pantallas nuevas, `init` pregunta si prefieres **comp-first** (genera primero una maqueta de alta fidelidad y construye hasta igualarla; solo si el agente puede generar imágenes) o **code-first** (construye directamente en código). Se guarda como `buildPath` en `.impeccable/config.json`.

## El detector y la CLI

El detector funciona sin agente y sin API key:

```bash
npx impeccable detect src/
npx impeccable detect https://example.com
npx impeccable detect --json .
npx impeccable ignores add-value overused-font Inter --reason "Fuente de marca"
```

Devuelve `0` si no hay hallazgos principales, `2` si los hay y `1` si no pudo analizar algún objetivo, así que encaja en CI. Para escanear una URL usa un Chrome, Chromium o Edge instalado. Las excepciones viven en `.impeccable/config.json` o en un comentario en el propio archivo (`impeccable-disable overused-font: motivo`). Un detector limpio es evidencia, no prueba: sigue haciendo falta mirar la interfaz en varios tamaños.

## El hook de diseño

En Claude Code, Copilot, Codex, Cursor y Grok Build, el instalador añade un hook que pasa el detector cada vez que el agente edita un archivo de UI y devuelve los hallazgos al flujo. En Cursor bloquea la escritura antes de que ocurra; en los demás informa después de la edición o al terminar. En Claude Code se registra en `.claude/settings.local.json`, que no se sube a Git. Para desactivar todos los hooks de Claude Code en una ejecución: `--settings '{"disableAllHooks": true}'`.

## Qué subir a Git

Impeccable escribe en `.impeccable/` capturas, estado del modo Live, cachés y configuración por desarrollador. El README trae un bloque para `.gitignore` delimitado por `# impeccable-ignore-start` y `# impeccable-ignore-end`. Conviene versionar solo lo compartido: `config.json`, `live/config.json`, `design.json`, `surfaces/*.md` y `critique/*.md`, además de `PRODUCT.md` y `DESIGN.md`.

## Cuándo usarlo

Impeccable rinde más cuando ya existe una interfaz y hace falta auditarla, explicar qué falla y aplicar mejoras controladas. [Taste Skill](/skills/ia-skills/skill-taste) actúa sobre todo al generar, para evitar una dirección genérica; Impeccable aporta el lenguaje de revisión y refinamiento, y el detector para no retroceder. Se pueden combinar si ambos reciben los mismos tokens y restricciones.

No compensa en proyectos sin interfaz o en prototipos de usar y tirar, donde `init`, los hooks y los archivos de `.impeccable/` son más carga que ayuda.

## Precauciones

- **Revisa el diff tras instalar.** El instalador escribe skills, comandos y hooks dentro de las carpetas de cada herramienta, y conserva entradas ajenas.
- **No habilites hooks que no entiendas.** En Codex y Grok Build hay que aprobarlos explícitamente; en Claude Code se ejecutan solos.
- **Modo Live solo en local.** No está soportado inyectarlo en un sitio desplegado; para producción usa `detect` con una URL o la extensión del navegador.
- **Las reglas son opinadas.** Si tu marca usa Inter o un degradado concreto, regístralo como excepción en vez de pelear con el detector.

## Fuentes

- [Repositorio y README de Impeccable](https://github.com/pbakaus/impeccable)
- [Sitio y documentación oficial](https://impeccable.style/)
- [Documentación de hooks](https://impeccable.style/docs/hooks)
- [Documentación del detector](https://impeccable.style/docs/detector)
- [Caso de estudio Neo Mirai](https://impeccable.style/cases/neo-mirai)
