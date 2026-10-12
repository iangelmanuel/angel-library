---
title: "Understand Anything — grafo de conocimiento interactivo de un repositorio"
description: "Plugin y conjunto de skills que analiza un código fuente con Tree-sitter y varios agentes, guarda un grafo de archivos, funciones y dependencias en JSON y lo abre en un dashboard para explorarlo, buscar y preguntar."
tags: [ai, skill, plugin, claude-code, codex, onboarding, arquitectura, grafo-de-conocimiento, tree-sitter]
sidebar:
  order: 29
draft: false
tool: Cross-tool
resourceCategory: Sitio oficial
official: true
website: https://understand-anything.com/
github: https://github.com/Egonex-AI/Understand-Anything
technologies:
  - skills/skills-fundamentos/ai-tools-skills-fundamentals
  - skills/ia-skills/skill-archify
  - agents/agents-fundamentos/coding-agents-fundamentals
note: Licencia MIT. El primer `/understand` analiza el repositorio completo y puede consumir muchos tokens en proyectos grandes; las ejecuciones siguientes son incrementales.
warnings:
  - El instalador de una línea para Codex, Gemini CLI, OpenCode y otros se ejecuta con `curl … | bash` o `iwr … | iex`. Léelo antes de ejecutarlo.
  - El grafo resume la estructura y la intención del código. Si lo subes a Git, revisa que no describa partes del sistema que no deban compartirse.
  - Los resúmenes, capas y dominios los escribe un modelo. Pueden ser incorrectos; verifica contra el código antes de tomar decisiones.
updatedAt: 2026-10-12
---

## En pocas palabras

**Understand Anything** convierte un repositorio (o una base de conocimiento en Markdown) en un **grafo de conocimiento interactivo**: cada archivo, función, clase y dependencia es un nodo que puedes abrir, buscar y relacionar con los demás. Se distribuye como plugin de Claude Code y como skills para otros agentes (Codex, Cursor, GitHub Copilot, Gemini CLI, OpenCode, Kiro y más). El proyecto es de [Egonex-AI](https://github.com/Egonex-AI/Understand-Anything), tiene licencia MIT y ronda las **86 000 estrellas en GitHub a octubre de 2026**.

La idea que repite el README es que el grafo debe **enseñar** cómo encajan las piezas, no impresionar con lo complejo que es el sistema.

> Si es la primera vez que oyes "skill" o "plugin": una **skill** es un `SKILL.md` con instrucciones que el agente carga cuando la tarea lo pide, y un **plugin** empaqueta varias skills, comandos o agentes para instalarlos juntos. La diferencia está explicada en [IA Tools: comandos, skills, plugins, hooks y MCP](/skills/skills-fundamentos/ai-tools-skills-fundamentals).

## Qué problema resuelve

Entrar a un código de cientos de miles de líneas suele empezar leyendo archivos al azar. Understand Anything propone otro orden:

- ver primero las **capas** (API, servicio, datos, UI, utilidades) y cómo se conectan;
- seguir **recorridos guiados** ordenados por dependencias;
- buscar por nombre o por significado ("¿qué partes manejan la autenticación?");
- medir el **impacto de un diff** antes de hacer commit;
- traducir el código a **dominios de negocio**: flujos y pasos.

Sirve para el onboarding, para revisar PR con contexto y para documentar un sistema que nadie terminó de explicar.

## Cómo funciona

El análisis combina dos técnicas:

| Capa                    | Qué hace                                                                                                                               | Determinista |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | ------------ |
| Tree-sitter             | Parsea el código en un árbol sintáctico y extrae imports, exports, definiciones, llamadas y herencia. También detecta cambios por huella | Sí           |
| LLM                     | Lee esa estructura junto al código y escribe resúmenes, etiquetas, capa arquitectónica, dominio de negocio y recorridos                 | No           |

Por eso las aristas estructurales salen iguales en cada ejecución, mientras que las descripciones dependen del modelo.

`/understand` orquesta cinco agentes especializados; `/understand-domain` añade un sexto y `/understand-knowledge` un séptimo:

| Agente                  | Función                                                     |
| ----------------------- | ----------------------------------------------------------- |
| `project-scanner`       | Descubre archivos, lenguajes y frameworks                   |
| `file-analyzer`         | Extrae funciones, clases e imports; crea nodos y aristas     |
| `architecture-analyzer` | Asigna capas arquitectónicas                                 |
| `tour-builder`          | Genera los recorridos guiados                                |
| `graph-reviewer`        | Valida que el grafo esté completo y sin referencias rotas    |
| `domain-analyzer`       | Extrae dominios, flujos y pasos de negocio                   |
| `article-analyzer`      | Extrae entidades, afirmaciones y relaciones de una wiki      |

Los analizadores de archivos corren en paralelo, hasta cinco a la vez y en lotes de 20 a 30 archivos. El resultado se guarda en `.ua/knowledge-graph.json` (los proyectos antiguos siguen usando `.understand-anything/`).

## Instalación

### Claude Code

Es la integración nativa, como plugin del marketplace:

```text
/plugin marketplace add Egonex-AI/Understand-Anything
/plugin install understand-anything
```

### Codex, Gemini CLI, OpenCode, Kiro y otros

El instalador clona el repositorio en `~/.understand-anything/repo` y crea los enlaces simbólicos que necesita cada herramienta. Puedes pasar la plataforma para saltar la pregunta:

```bash
curl -fsSL https://raw.githubusercontent.com/Egonex-AI/Understand-Anything/main/install.sh | bash -s codex
```

En Windows (PowerShell):

```powershell
iwr -useb https://raw.githubusercontent.com/Egonex-AI/Understand-Anything/main/install.ps1 | iex
```

Valores admitidos según el README: `gemini`, `codex`, `opencode`, `pi`, `openclaw`, `antigravity`, `vibe`, `vscode`, `hermes`, `cline`, `kimi`, `trae`, `nanobot` y `kiro`. Reinicia la CLI o el IDE después.

### Cursor, VS Code + Copilot y Copilot CLI

Cursor y VS Code con Copilot (v1.108+) descubren el plugin solos cuando clonas el repositorio, gracias a `.cursor-plugin/plugin.json` y `.copilot-plugin/plugin.json`. En la CLI de Copilot:

```bash
copilot plugin install Egonex-AI/Understand-Anything:understand-anything-plugin
```

## Comandos

En la mayoría de herramientas se invocan con `/`. **En Codex el prefijo es `$`** (`$understand`). Si ninguno funciona, pídelo en lenguaje natural: "usa la skill understand para analizar este proyecto".

| Comando                          | Para qué                                                         |
| -------------------------------- | ---------------------------------------------------------------- |
| `/understand`                    | Analiza el proyecto y construye o actualiza el grafo             |
| `/understand src/frontend`       | Limita el análisis a una carpeta (útil en monorepos)             |
| `/understand --auto-update`      | Instala un hook post-commit que parchea el grafo en cada commit  |
| `/understand --language es`      | Fija el idioma de resúmenes y dashboard (ver nota abajo)         |
| `/understand-dashboard`          | Abre el dashboard web con el grafo                               |
| `/understand-chat <pregunta>`    | Pregunta sobre el código usando el grafo                         |
| `/understand-diff`               | Analiza el impacto de los cambios actuales                       |
| `/understand-explain <ruta>`     | Explica a fondo un archivo o una función                         |
| `/understand-onboard`            | Genera una guía de incorporación para el equipo                  |
| `/understand-domain`             | Extrae dominios, flujos y pasos de negocio                       |
| `/understand-knowledge <carpeta>` | Analiza una wiki estilo Karpathy (Markdown con `index.md`)       |

Sobre el idioma: el README lista como admitidos `en`, `zh`, `zh-TW`, `ja`, `ko`, `ru` y `vi`; el español no aparece en esa lista, aunque el README sí está traducido. En la primera ejecución, si conversas en otro idioma, `/understand` pregunta cuál usar y guarda la respuesta en `.ua/config.json`.

## Flujo recomendado

```text
/understand
/understand-dashboard
/understand-chat ¿Cómo funciona el flujo de pago?
/understand-diff
```

1. Ejecuta el primer análisis con un plan por suscripción o un modelo local (el README menciona Ollama) para no pagar por token un repositorio entero.
2. Explora el dashboard: el color indica la capa y cada nodo muestra código, relaciones y una explicación en lenguaje llano. El nivel de detalle se adapta a quien lo mira (junior, PM o usuario avanzado).
3. Antes de un PR grande, pasa `/understand-diff` para ver qué partes del sistema tocas.

## Compartir el grafo con el equipo

El grafo es JSON: si lo subes a Git, el resto del equipo no repite el análisis. Sube todo `.ua/` menos los archivos temporales:

```text
.ua/intermediate/
.ua/diff-overlay.json
```

Si el grafo pasa de 10 MB, el README recomienda Git LFS. Con el grafo ya en el repositorio, cualquiera puede abrir el dashboard **sin Claude Code, sin modelo y sin API key**, solo con Node.js 18 o superior:

```bash
npx https://github.com/Egonex-AI/Understand-Anything/releases/latest/download/understand-anything-viewer.tgz /ruta/al/proyecto
```

El visor sirve los datos en modo solo lectura desde el disco, en una URL local con token (`http://127.0.0.1:5173/?token=…`).

## Cuándo conviene y cuándo no

Conviene cuando:

- llegas a un repositorio grande o heredado y necesitas un mapa antes de tocar nada;
- incorporas gente con frecuencia y quieres un grafo versionado que no dependa de quién lo explique;
- quieres revisar el alcance de un cambio con algo más que el diff.

No compensa cuando:

- el proyecto es pequeño y se lee en una tarde;
- necesitas un diagrama curado para comunicar una decisión: ahí encaja mejor [Archify](/skills/ia-skills/skill-archify), que compila un diagrama a partir de una descripción revisada;
- no puedes enviar el código a un proveedor de modelos y no tienes un modelo local.

## Límites y precauciones

- **Coste del primer análisis.** En repositorios grandes el consumo de tokens es alto; empieza por una subcarpeta.
- **Capa semántica no verificada.** Las capas, dominios y recorridos son interpretación del modelo. El `graph-reviewer` valida integridad referencial, no que los resúmenes sean ciertos (la revisión completa con LLM se activa con `--review`).
- **Hook post-commit.** `--auto-update` añade trabajo a cada commit; en equipos, acuerda quién lo activa.
- **Instaladores por tubería.** Revisa `install.sh` o `install.ps1` antes de ejecutarlos y prefiere el marketplace cuando exista.

## Fuentes

- [Repositorio y README de Understand Anything](https://github.com/Egonex-AI/Understand-Anything)
- [Sitio oficial](https://understand-anything.com/)
- [Demo interactiva](https://understand-anything.com/demo/)
