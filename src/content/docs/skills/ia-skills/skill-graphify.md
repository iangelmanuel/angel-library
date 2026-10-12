---
title: "Graphify: el repositorio como grafo de conocimiento consultable"
description: "Skill y CLI que convierte código, documentación, esquemas SQL, PDFs y vídeos en un grafo de conocimiento local, para que el agente consulte relaciones en lugar de leer y buscar archivo por archivo."
tags: [ai, skill, grafo, knowledge-graph, tree-sitter, contexto, mcp, claude-code, codex, cursor]
sidebar:
  order: 26
draft: false
tool: Cross-tool
runtime: Python 3.10+
resourceCategory: Sitio oficial
official: true
website: https://graphify.com
github: https://github.com/Graphify-Labs/graphify
technologies:
  - skills/skills-fundamentos/ai-tools-skills-fundamentals
  - agents/claude-code/claude-code-hooks
  - agents/claude-code/claude-code-mcp
  - skills/ia-skills/skill-archify
note: Licencia Apache-2.0. El paquete oficial en PyPI es `graphifyy` (con doble y); otros paquetes `graphify*` no están afiliados. El comando sigue siendo `graphify`.
warnings:
  - El código se analiza en local, pero docs, PDFs e imágenes se envían al modelo de tu asistente o al backend configurado. Con requisitos de residencia de datos, usa `--code-only` o `--backend ollama`.
  - Cada consulta se registra en `~/.cache/graphify-queries.log`; se desactiva con `GRAPHIFY_QUERY_LOG_DISABLE=1`.
updatedAt: 2026-10-12
---

## En pocas palabras

[Graphify](https://github.com/Graphify-Labs/graphify) mapea un proyecto entero en un **grafo de conocimiento**: nodos para conceptos (clases, funciones, módulos, documentos) y aristas para sus relaciones (`calls`, `imports`, `inherits`…). El agente consulta ese grafo con preguntas como "¿qué conecta la autenticación con la base de datos?" en vez de hacer `grep` y abrir decenas de archivos.

Funciona como skill (`/graphify`) en Claude Code, Cursor, Codex, Gemini CLI, Copilot y más de veinte asistentes, y también como CLI independiente. Lo desarrolla Graphify Labs (YC S26), con licencia Apache-2.0 y **~126 k estrellas a octubre de 2026**.

## Qué problema resuelve

Un agente que no conoce un repositorio gasta gran parte de su contexto explorando: busca, lee archivos enteros, vuelve a buscar. En repositorios grandes eso es caro y aun así deja huecos. Graphify construye una vez el mapa y lo deja en disco para consultarlo sin releer el código.

Tres decisiones lo distinguen:

- **El código se mapea gratis y en local.** Usa *tree-sitter* (un parser que produce el árbol sintáctico, AST, de unos 40 lenguajes): determinista, sin LLM y sin que el código salga de tu máquina.
- **Cada arista está explicada.** Se marca como `EXTRACTED` (explícita en el código) o `INFERRED` (resuelta por Graphify), para distinguir lo leído de lo deducido.
- **No es un índice vectorial.** Sin embeddings ni vector store: es un grafo real que se recorre. Ver la diferencia con RAG en la sección de cuándo conviene.

## Cómo funciona

```text
/graphify .
```

genera tres archivos:

```text
graphify-out/
├── graph.html       grafo interactivo: clic en nodos, filtros, búsqueda
├── GRAPH_REPORT.md  conceptos clave, conexiones sorprendentes, preguntas sugeridas
└── graph.json       el grafo completo, consultable sin releer archivos
```

| Capacidad                | Qué aporta                                                                                       |
| ------------------------ | ------------------------------------------------------------------------------------------------ |
| *God nodes*              | Los conceptos más conectados: por dónde pasa todo                                                |
| Comunidades              | El grafo dividido en subsistemas (algoritmo de Leiden), con etiquetas sin LLM                    |
| Enlaces entre archivos   | `calls`, `imports`, `inherits`, `mixes_in` resueltos entre archivos                              |
| `query`, `path`, `explain` | Preguntar en lenguaje natural, trazar el camino entre dos cosas o explicar un concepto         |
| Justificaciones          | Comentarios `# NOTE:` / `# WHY:` y citas de ADR o RFC se convierten en nodos enlazados al código |
| Más allá del código      | Docs, PDFs, imágenes, audio y vídeo entran al mismo grafo mediante una pasada semántica          |

Ejemplo real del README, sobre el código de FastAPI:

```text
$ graphify path "FastAPI" "ModelField"
Shortest path (3 hops):
  FastAPI --uses--> DefaultPlaceholder <--references-- get_request_handler() --references--> ModelField
```

## Instalación

Requiere Python 3.10 o superior. Se recomienda [uv](https://docs.astral.sh/uv/) para aislar el entorno:

```bash
uv tool install graphifyy      # o: pipx install graphifyy
graphify install               # registra la skill en tu asistente (Claude Code por defecto)
```

Para instalar la skill dentro del repositorio actual (en `.claude/skills/graphify/` o `.agents/skills/graphify/`) en vez de en tu perfil:

```bash
graphify install --project
```

Por plataforma:

```bash
graphify install --platform codex     # Codex (se invoca con $graphify)
graphify cursor install               # Cursor: escribe .cursor/rules/graphify.mdc con alwaysApply
graphify install --platform gemini    # Gemini CLI
graphify install --platform opencode  # OpenCode
graphify install --platform copilot   # GitHub Copilot CLI
graphify vscode install               # Copilot Chat en VS Code
graphify install --platform agents    # estándar genérico .agents/skills/
```

En Codex, la extracción en paralelo necesita `multi_agent = true` bajo `[features]` en `~/.codex/config.toml`. Hay extras opcionales para PDFs, Office, vídeo, SQL, PostgreSQL en vivo, un servidor MCP (`graphifyy[mcp]`), Neo4j y backends de modelo (Ollama, OpenAI, Gemini, Anthropic, Bedrock):

```bash
uv tool install "graphifyy[pdf,mcp]"
```

### Que el agente use siempre el grafo

```bash
graphify claude install
```

En Claude Code y Gemini CLI instala un *hook* que, antes de búsquedas o lecturas de archivos sueltos, empuja al agente hacia `graphify query`. En Codex, OpenCode y Cursor lo hace con archivos de instrucciones (`AGENTS.md`, `.cursor/rules/`). Para mantener el grafo al día, `graphify hook install` lo reconstruye en cada commit y cambio de rama.

## Comandos habituales

| Comando                                       | Qué hace                                               |
| --------------------------------------------- | ------------------------------------------------------ |
| `/graphify .`                                 | Construye el grafo de la carpeta actual                |
| `/graphify ./docs --update`                   | Reextrae solo los archivos cambiados                   |
| `/graphify . --wiki`                          | Genera una wiki en Markdown a partir del grafo         |
| `/graphify query "<pregunta>"`                | Devuelve el subgrafo relevante para una pregunta       |
| `/graphify path "A" "B"`                      | Traza el camino más corto entre dos nodos              |
| `/graphify explain "RateLimiter"`             | Explica un concepto y sus conexiones                   |
| `/graphify add <url>`                         | Añade un paper o un vídeo (lo transcribe)              |
| `graphify hook install`                       | Reconstrucción automática en commit y checkout         |
| `graphify prs`                                | Panel de PRs con impacto en el grafo                   |
| `graphify uninstall --purge`                  | Quita Graphify de todas las plataformas y su salida    |

Desde scripts, `graphify query` devuelve código de salida `0` con respuesta, `3` si el nombre es ambiguo y `4` si no hay nodo.

## Cuándo conviene y cuándo no

**Conviene** en repositorios medianos o grandes, monorepos con mucha documentación, onboarding en código ajeno, revisiones de PR donde importa el radio de impacto, y cuando quieres reducir el gasto de contexto del agente en exploración.

**No conviene** en proyectos pequeños que el agente lee entero sin problema, ni si no vas a mantener el grafo actualizado: un grafo obsoleto es peor que ninguno.

Frente a un índice RAG con embeddings, Graphify responde mejor a preguntas **estructurales** (quién llama a quién, qué depende de qué) y explica cada relación; un buscador vectorial responde mejor a "¿dónde se habla de X?". Si lo que quieres es un **diagrama** para documentación, [Archify](/skills/ia-skills/skill-archify) es más directo; si buscas un dashboard con recorridos guiados para onboarding, [Understand Anything](/skills/ia-skills/skill-understand-anything) sigue una idea parecida con más peso en la capa explicativa. Graphify también puede servirse como [servidor MCP](/agents/claude-code/claude-code-mcp).

El README publica benchmarks propios (LOCOMO, LongMemEval, cobertura de hechos frente a grep) en `BENCHMARKS.md`; son del proyecto y conviene leerlos con esa perspectiva.

## Límites y precauciones

- **Revisa lo que instalas.** La skill y sus hooks entran en el contexto y el flujo de un agente con acceso a tu repositorio. Lee el `SKILL.md` instalado y qué hooks añade cada `graphify <plataforma> install`.
- **Privacidad por tipo de archivo.** Código y audio/vídeo (faster-whisper) se procesan en local; docs, PDFs e imágenes pasan por un modelo. En modo headless, `graphify extract` elige proveedor según la API key presente; fija `--backend` explícitamente si te importa a dónde van los datos (por ejemplo, Kimi enruta a servidores en China).
- **Nombre del paquete.** Solo `graphifyy`. Hay paquetes con nombres parecidos no afiliados.
- **Sin telemetría**, según el README, pero sí registro local de consultas (ver advertencias).
- **Graphify Cloud.** El README promociona una versión en la nube de pago (siempre activa, multirrepo); no es necesaria para usar la skill.

## Fuentes

- [Repositorio y README de Graphify](https://github.com/Graphify-Labs/graphify)
- [Documentación oficial](https://docs.graphify.com)
- [Sitio oficial](https://graphify.com)
- [Paquete `graphifyy` en PyPI](https://pypi.org/project/graphifyy/)
