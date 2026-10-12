---
title: "Awesome Claude Skills — lista curada de skills y plugins de Composio"
description: "Lista awesome mantenida por Composio con cientos de skills y plugins para Claude y otros agentes, ordenados por categoría: qué es, cómo está organizada, cómo instalar una skill de la lista y cómo evaluar una skill de terceros."
tags: [ai, skill, claude-code, awesome-list, catalogo, composio, plugins]
sidebar:
  order: 30
draft: false
tool: Cross-tool
resourceCategory: Repositorio oficial
official: true
url: https://github.com/ComposioHQ/awesome-claude-skills
technologies:
  - skills/skills-fundamentos/ai-tools-skills-fundamentals
  - skills/ia-skills/skill-find-skills
  - resources/ia/skills-sh
  - findings/hallazgos-ia/clawscan
note: "El README declara licencia Apache 2.0 para el repositorio, pero no hay archivo LICENSE en la raíz y cada skill enlazada puede tener la suya. Revisa la licencia de la skill concreta antes de copiarla."
warnings:
  - Una entrada en la lista no es una auditoría. Las skills externas son código y texto de terceros que entran al contexto de un agente con acceso a tu repositorio.
  - Las skills de «App Automation via Composio» dependen de Composio (Rube MCP) y de una API key; ejecutan acciones reales en servicios como Gmail, Slack o GitHub.
  - Las instrucciones de instalación manual del README usan `~/.config/claude-code/skills/`, que no es la ruta que lee Claude Code. Usa `~/.claude/skills/` o `.claude/skills/`.
updatedAt: 2026-10-12
---

## En pocas palabras

[Awesome Claude Skills](https://github.com/ComposioHQ/awesome-claude-skills) es una **lista curada** de skills y plugins para Claude (Claude.ai, Claude Code y la API) y para otros agentes que leen el mismo formato, como Codex, Cursor, Gemini CLI o Antigravity. La mantiene [Composio](https://composio.dev), una empresa de integraciones para agentes. Ronda las **77 000 estrellas en GitHub a octubre de 2026** y el README habla de "más de 1000" skills y plugins; [skills.sh](/resources/ia/skills-sh) indexa unas 870 instalables desde el repositorio.

No es una skill que se instala entera: es un **índice**. Unas entradas apuntan a carpetas del propio repositorio y otras a repositorios de terceros.

## Qué es una lista "awesome"

Una lista *awesome* es un README de GitHub que reúne enlaces seleccionados sobre un tema, con una línea de descripción cada uno y un índice por categorías. El formato nació con [sindresorhus/awesome](https://github.com/sindresorhus/awesome) y se reconoce por la insignia de [awesome.re](https://awesome.re). Lo que la distingue de un buscador es la curaduría: alguien decide qué entra, normalmente mediante pull requests revisadas.

La contrapartida: la calidad depende de cuánto revisa el mantenedor y de que la lista se actualice. Un enlace puede seguir ahí aunque el proyecto esté abandonado.

## Recordatorio: qué es una skill

Una **skill** es una carpeta con un `SKILL.md` (frontmatter YAML con `name` y `description`, más instrucciones en Markdown) y, opcionalmente, `scripts/`, `references/` o plantillas. El agente solo ve al principio el nombre y la descripción; el cuerpo completo se carga cuando la tarea coincide. Por eso un agente puede tener muchas instaladas sin llenar el contexto. El README de la lista lo resume así: **MCP da acceso, las herramientas ejecutan acciones y las skills definen el procedimiento**. La comparación completa está en [IA Tools: comandos, skills, plugins, hooks y MCP](/skills/skills-fundamentos/ai-tools-skills-fundamentals).

## Cómo está organizada

El README tiene un índice y una sección por categoría. Cada entrada es un enlace, una descripción breve y, cuando es de la comunidad, el autor.

| Categoría                          | Ejemplos de la lista                                                                                    |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------- |
| Document Processing                | `docx`, `pdf`, `pptx`, `xlsx` (las oficiales de Anthropic), conversor de Markdown a EPUB                 |
| Development & Code Tools           | `mcp-builder`, `skill-creator`, `webapp-testing`, Playwright, `test-driven-development` (de Superpowers) |
| Data & Analysis                    | Resumen de CSV, `postgres` de solo lectura, `deep-research`, `root-cause-tracing`                        |
| Business & Marketing               | Ideas de dominios, investigación de leads, extracción de anuncios de la competencia                     |
| Communication & Writing            | `brainstorming`, `article-extractor`, integración con NotebookLM                                        |
| Creative & Media                   | `canvas-design`, `theme-factory`, creador de GIF para Slack, `youtube-transcript`                        |
| Productivity & Organization        | Organizador de archivos y facturas, `n8n-skills`, `kaizen`                                              |
| Collaboration & Project Management | `git-pushing`, `test-fixing`, skills de Google Workspace                                                |
| Security & Systems                 | Forense, extracción de metadatos, caza de amenazas con reglas Sigma                                     |
| App Automation via Composio        | Flujos para 78 aplicaciones SaaS: CRM, Jira, Linear, Slack, Gmail, GitHub, Stripe, Notion…              |

Las de la última categoría son de Composio y funcionan con su servidor MCP (Rube); cada una documenta la secuencia de herramientas, los parámetros y los errores conocidos. Fuera de las categorías, el repositorio incluye el plugin `connect-apps`, también de Composio, que conecta Claude a esas aplicaciones con una API key.

Además de la lista, el README trae una plantilla de `SKILL.md` y un `CONTRIBUTING.md` con requisitos para proponer skills: caso de uso real, ejemplos, pruebas en las plataformas de Claude y confirmación antes de operaciones destructivas.

## Cómo instalar una skill de la lista

Primero mira **a dónde apunta el enlace**, porque eso decide el método.

**Skill dentro del propio repositorio** (enlace relativo, como `./changelog-generator/`). Con la CLI de skills.sh, que instala en Claude Code, Codex, Cursor y otros:

```bash
npx skills add composiohq/awesome-claude-skills --skill changelog-generator
```

Sin `--skill`, la CLI ofrece elegir entre todas; no instales la colección completa.

**Skill en un repositorio de terceros.** Usa el repositorio de origen, no la lista. Por ejemplo, las oficiales de Anthropic:

```bash
npx skills add https://github.com/anthropics/skills --skill pdf
```

**Instalación manual en Claude Code.** Copia la carpeta de la skill (la que contiene `SKILL.md`) a la carpeta personal o a la del proyecto:

```bash
mkdir -p ~/.claude/skills
cp -r changelog-generator ~/.claude/skills/
```

Para un solo proyecto, la ruta es `.claude/skills/` en la raíz del repositorio. Reinicia la sesión para que la detecte.

**Plugins.** Si la entrada es un plugin de Claude Code, se instala desde su marketplace:

```text
/plugin marketplace add <owner>/<repo>
```

**Claude.ai.** En la configuración de capacidades se puede subir una skill como `.zip`.

## Criterios para evaluar una skill de terceros

Antes de instalar algo que encontraste en esta o en cualquier otra lista:

1. **Lee el `SKILL.md` completo.** Comprueba que la descripción coincide con lo que hace y que no pide ignorar las instrucciones del repositorio, desactivar comprobaciones o enviar datos fuera.
2. **Revisa los scripts.** Todo lo que haya en `scripts/` puede ejecutarse con tus permisos. Busca descargas, `curl | bash`, acceso a credenciales o llamadas de red.
3. **Mira el alcance de activación.** Una descripción demasiado amplia hace que la skill se cargue en tareas que no le corresponden y compita con otras.
4. **Comprueba dependencias y cuentas.** Si necesita un MCP, una API key o un servicio de pago (como las de Composio), decide si aceptas ese proveedor.
5. **Valora el mantenimiento.** Último commit, issues abiertas, autor identificable y licencia explícita.
6. **Busca duplicados.** Dos skills que cubren lo mismo (por ejemplo, dos de TDD) dan instrucciones contradictorias.
7. **Pruébala en aislado.** Úsala primero en un repositorio de prueba o en una rama, y revisa el diff que produce.
8. **Escanéala.** Herramientas como [ClawScan](/findings/hallazgos-ia/clawscan) ayudan a detectar instrucciones o scripts sospechosos.

## Alternativas para descubrir skills

- [skills.sh](/resources/ia/skills-sh): directorio con buscador y cifras de instalación, y la CLI `npx skills`.
- [find-skills](/skills/ia-skills/skill-find-skills): una meta-skill que busca skills según la tarea.
- El repositorio oficial [anthropics/skills](https://github.com/anthropics/skills), con las skills de ejemplo de Anthropic.

Una lista curada sirve para descubrir; un directorio con métricas, para comparar. Ninguno sustituye leer la skill.

## Límites

- **Sesgo comercial.** La lista es de un proveedor y da un lugar destacado a sus propios productos (Composio, Rube MCP, `connect-apps`).
- **Contenido desigual.** Conviven skills oficiales, proyectos de comunidad maduros y experimentos de un solo commit.
- **Ejemplos desactualizados.** El ejemplo de API del README usa un modelo y un parámetro antiguos; para la API, consulta la [documentación oficial de Skills](https://docs.claude.com/en/api/skills-guide).

## Fuentes

- [Repositorio y README de Awesome Claude Skills](https://github.com/ComposioHQ/awesome-claude-skills)
- [Guía de contribución](https://github.com/ComposioHQ/awesome-claude-skills/blob/master/CONTRIBUTING.md)
- [Página del repositorio en skills.sh](https://skills.sh/ComposioHQ/awesome-claude-skills)
- [Anthropic Skills (repositorio oficial)](https://github.com/anthropics/skills)
