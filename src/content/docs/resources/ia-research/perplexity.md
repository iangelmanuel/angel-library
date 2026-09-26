---
title: "Perplexity — buscador e investigación con IA, API, CLI y MCP"
description: "Motor de respuestas que busca en la web en tiempo real y cita sus fuentes, con modos de investigación profunda; y su plataforma para desarrolladores: Agent API, Search API, CLI pplx y servidor MCP para agentes de código."
tags: [ia, perplexity, research, busqueda, investigacion, api, mcp, cli, fuentes]
sidebar:
  order: 1
draft: false
tool: Perplexity
resourceCategory: ia-research
official: true
website: https://www.perplexity.ai/
url: https://docs.perplexity.ai/
technologies:
  - ai/ai-rag/ai-rag-embeddings
  - skills/skills-fundamentos/ai-tools-skills-fundamentals
note: "Sonar Chat Completions pasó a llamarse Agent API; Sonar se mantiene hasta el 27 de septiembre de 2026. Las integraciones nuevas deben usar `POST /v1/agent`."
updatedAt: 2026-09-26
---

**Perplexity** es un motor de respuestas: en lugar de una lista de enlaces, busca en la web en tiempo real, lee las fuentes y responde con **citas numeradas** a cada una. Sirve para investigar un tema, contrastar documentación o ponerse al día con algo que salió después del corte de conocimiento de un modelo.

Tiene dos caras: la **app** (web, escritorio y móvil) para uso personal y la **API Platform** para meter su búsqueda en tus programas y agentes.

## La app

| Función | Para qué |
| --- | --- |
| Búsqueda con fuentes | Preguntas rápidas con respuesta resumida y citas |
| Research (investigación profunda) | Hace decenas de búsquedas, lee muchas fuentes y entrega un informe largo; tarda minutos |
| Selección de modelo | En los planes de pago, elegir el modelo que redacta la respuesta |
| Focos / fuentes | Limitar a web, publicaciones académicas, redes o finanzas |
| Spaces | Agrupar hilos, archivos e instrucciones de un proyecto |
| Archivos | Subir PDFs o documentos y preguntar sobre ellos |

Hay plan gratuito con límites diarios en los modos avanzados; los planes de pago amplían consultas de investigación, modelos y archivos. Los nombres y límites de cada plan cambian a menudo: consúltalos en el sitio.

### Cómo sacarle partido

1. Pregunta algo concreto y verificable («¿qué cambió en la API de X entre la v3 y la v4?»), no un tema abierto.
2. **Abre las citas** antes de fiarte: la síntesis puede mezclar fuentes o citar una que no dice exactamente eso.
3. Para decisiones técnicas, prioriza la documentación oficial entre las fuentes y pide que lo indique.
4. Usa Research para panoramas amplios; la búsqueda normal para datos puntuales.

## API Platform

Pago por uso, sin suscripción. La clave se crea en la [consola](https://console.perplexity.ai/).

```bash
pip install perplexityai
npm install @perplexity-ai/perplexity_ai
export PERPLEXITY_API_KEY="..."
```

| API | Endpoint | Qué devuelve |
| --- | --- | --- |
| **Agent API** | `POST /v1/agent` (alias `/v1/responses`) | Respuestas de modelos de varios proveedores con búsqueda web, herramientas y citas |
| **Search API** | `POST /search` | Resultados web ordenados y crudos, para procesarlos tú |
| **Embeddings API** | — | Embeddings estándar y contextualizados para RAG |
| **Router API** | — | Modelos open-weight vía formatos de OpenAI y Anthropic |

### Agent API

Un mismo endpoint da acceso a modelos de OpenAI, Anthropic, Google, xAI y Perplexity, con búsqueda web integrada, herramientas (fetch de URLs, sandbox de código, búsqueda financiera, MCP remoto, funciones propias), salida estructurada, modo en segundo plano, fallback de modelos y *presets* (incluido `wide-research` para investigación extensa). Es compatible con el SDK de OpenAI.

```python
from perplexity import Perplexity

client = Perplexity()
response = client.responses.create(
    model="openai/gpt-5.6-sol",
    input="Explain the difference between supervised and unsupervised learning."
)
print(response.output_text)
```

### Search API

Cuando quieres los resultados, no una respuesta redactada:

```python
search = client.search.create(
    query="Astro 6 release notes",
    max_results=5,               # 1 a 20, 10 por defecto
    search_context_size="high"
)
for r in search.results:
    print(r.title, r.url)
```

Admite filtros de dominio, idioma, región y fechas, varias consultas a la vez y un modo `fast` más barato.

## CLI `pplx`

Devuelve los resultados de la Search API como JSON, útil en pipelines de shell y para agentes de código:

```bash
curl -fsSL https://github.com/perplexityai/perplexity-cli/releases/latest/download/install.sh | sh
pplx auth login      # o exporta PERPLEXITY_API_KEY

pplx search web "what is a bloom filter" -n 2
pplx search web "AI inference hardware" --domains arxiv.org,nvidia.com --published-after-date 07/01/2026 -n 5
```

Cada resultado trae `url`, `title`, `domain`, `snippet`, fechas y un nivel de **confianza de la fuente** (`trusted`, `credible`…). También existe como skill: pide a tu agente que lea `https://github.com/perplexityai/api-platform-developers/blob/main/skills/pplx-cli/SKILL.md` y la instale.

## Servidor MCP

El servidor remoto `https://api.perplexity.ai/mcp` (Streamable HTTP) expone `perplexity_search`, `perplexity_ask`, `perplexity_research` y `perplexity_reason` a Claude Code, Cursor, VS Code, Claude Desktop y otros clientes. Se autentica con OAuth (inicias sesión en el navegador) o con la API key como bearer token.

```bash
claude mcp add --transport http perplexity https://api.perplexity.ai/mcp
```

```json
// ~/.cursor/mcp.json
{ "mcpServers": { "perplexity": { "url": "https://api.perplexity.ai/mcp" } } }
```

```json
// .vscode/mcp.json
{ "servers": { "perplexity": { "type": "http", "url": "https://api.perplexity.ai/mcp" } } }
```

Si tu cliente solo admite stdio, hay un servidor local de código abierto. No pongas la API key en archivos de configuración que se commitean.

## Precauciones

- Todo lo que escribes (y los archivos que subes) va a un servicio externo: no pegues secretos, código privado ni datos de clientes.
- Las respuestas pueden estar desactualizadas o mal atribuidas aunque tengan cita. Verifica en la fuente primaria.
- La API cobra por tokens, por búsqueda y por herramienta; pon límites de gasto por proyecto.

## Fuentes

- [Perplexity](https://www.perplexity.ai/) · [Centro de ayuda](https://www.perplexity.ai/help-center)
- [Documentación de la API](https://docs.perplexity.ai/) — [Quickstart](https://docs.perplexity.ai/docs/getting-started/quickstart), [Precios](https://docs.perplexity.ai/docs/getting-started/pricing)
- [Agent API](https://docs.perplexity.ai/docs/agent-api/quickstart) · [Search API](https://docs.perplexity.ai/docs/search/quickstart) · [Migrar desde Sonar](https://docs.perplexity.ai/docs/agent-api/migrate-from-sonar/overview)
- [CLI pplx](https://docs.perplexity.ai/docs/cli/overview) · [Servidor MCP](https://docs.perplexity.ai/docs/getting-started/integrations/mcp-server)
