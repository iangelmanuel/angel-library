---
title: "Strands Agents: el SDK de agentes de AWS"
description: SDK de código abierto para Python y TypeScript con el que Amazon construye agentes en producción — agent loop, herramientas, MCP, hooks, sesiones, multiagente (Graph, Swarm, Workflow) y Agent2Agent.
tags: [strands, aws, amazon, agentes, sdk, python, typescript, mcp, a2a, bedrock, multiagente]
sidebar:
  order: 5
draft: false
resourceCategory: Documentación oficial
official: true
website: https://strandsagents.com/
github: https://github.com/strands-agents/harness-sdk
technologies:
  - ai/ai-sdk/ai-sdk-fundamentos
  - ai/ai-sdk/ai-sdk-vercel
  - ai/ai-agentes/ai-agentes-herramientas-evaluacion
note: Licencia Apache 2.0. Python 3.10+ (paquete `strands-agents`) y Node.js 22+ (paquete `@strands-agents/sdk`). El repositorio antiguo del SDK de TypeScript está archivado; todo vive ahora en el monorepo `harness-sdk`.
updatedAt: 2026-09-26
---

**Strands Agents** es el SDK de código abierto de AWS para construir y ejecutar agentes de IA en **Python** y **TypeScript**. Amazon lo usa en producción. Sigue un enfoque *model-driven*: le das al modelo un prompt y herramientas y el propio modelo planifica los pasos, en lugar de codificar cada decisión en un grafo.

Corre **dentro de tu proceso**, sin plano de control alojado. Su propuesta: úsalo cuando, de otro modo, escribirías tu propio agent loop — ya trae límites de turnos, presupuesto de tokens, cancelación, trazas y hooks.

## Piezas del proyecto

El monorepo [`strands-agents/harness-sdk`](https://github.com/strands-agents/harness-sdk) agrupa:

| Pieza | Paquete | Qué es |
| --- | --- | --- |
| Strands harness (Python) | `strands-harness` | Agente ya montado con `create_harness()` |
| Strands harness (TS) | `@strands-agents/harness` | Lo mismo con `createHarness()` |
| CLI | `@strands-agents/cli` | Prototipar y chatear con un agente harness desde la terminal |
| SDK de Python | `strands-agents` | Agent loop, proveedores de modelos, herramientas |
| SDK de TypeScript | `@strands-agents/sdk` | Lo mismo para Node.js y navegador |
| Herramientas | `strands-agents-tools` | Herramientas listas (calculadora, HTTP, archivos…) |
| Documentación | `site/` | El sitio [strandsagents.com](https://strandsagents.com) (Astro/Starlight) |

## Dos niveles: harness o SDK

**Harness**: un agente completo y optimizado en una línea. Es el camino recomendado para empezar.

```bash
pip install strands-harness
```

```python
from strands_harness import create_harness

agent = create_harness()
agent("Find the slowest test in this repo and explain why it's slow")
```

```bash
npm install @strands-agents/harness
```

```ts
import { createHarness } from "@strands-agents/harness"

const agent = await createHarness()
await agent.invoke("Find the slowest test in this repo and explain why it's slow")
```

**SDK**: cuando quieres controlar el loop, las herramientas, el proveedor, la memoria y los hooks.

```bash
pip install strands-agents strands-agents-tools
```

```python
from strands import Agent
from strands_tools import calculator

agent = Agent(tools=[calculator])
agent("What is the square root of 1764")
```

```bash
npm install @strands-agents/sdk
```

```ts
import { Agent } from "@strands-agents/sdk"

const agent = new Agent()
const result = await agent.invoke("What is the square root of 1764?")
console.log(result)
```

El proveedor por defecto es **Amazon Bedrock**: necesita credenciales de AWS y acceso habilitado al modelo en tu región. Para otro proveedor, pásale un `model`.

## El agent loop

Cada invocación repite el mismo ciclo hasta que el modelo responde sin pedir herramientas o se alcanza un límite:

```text
prompt + historial + herramientas → modelo
  └─ ¿pide una herramienta? → ejecutarla → añadir el resultado → volver al modelo
  └─ ¿respuesta final?      → devolver AgentResult
```

El loop registra cada decisión por defecto (trazas OpenTelemetry, métricas de tokens, latencia y ciclos) y expone hooks en cada paso.

## Proveedores de modelos

Soporte de primera clase para Amazon Bedrock, Anthropic, OpenAI y Gemini, y además Cohere, LiteLLM, llama.cpp, LlamaAPI, Mistral, Ollama, OpenAI Responses API, SageMaker, Writer y proveedores propios.

```python
from strands import Agent
from strands.models import BedrockModel
from strands.models.ollama import OllamaModel

bedrock = BedrockModel(model_id="us.amazon.nova-pro-v1:0", temperature=0.3, streaming=True)
local = OllamaModel(host="http://localhost:11434", model_id="llama3")

agent = Agent(model=local)
```

```ts
import { Agent } from "@strands-agents/sdk"
import { OpenAIModel } from "@strands-agents/sdk/models/openai"

// Lee OPENAI_API_KEY del entorno
const agent = new Agent({ model: new OpenAIModel({ api: "chat" }) })
```

## Herramientas

En Python, un decorador; el docstring es lo que el modelo lee para decidir cuándo usarla:

```python
from strands import Agent, tool

@tool
def word_count(text: str) -> int:
    """Count words in text."""
    return len(text.split())

agent = Agent(tools=[word_count])
```

`Agent(load_tools_from_directory=True)` vigila `./tools/` y recarga en caliente.

En TypeScript, con esquemas de Zod que tipan la entrada:

```ts
import { Agent, tool } from "@strands-agents/sdk"
import { z } from "zod"

const weather = tool({
  name: "get_weather",
  description: "Get the current weather for a specific location.",
  inputSchema: z.object({ location: z.string() }),
  callback: (input) => `The weather in ${input.location} is 72°F and sunny.`
})

const agent = new Agent({ tools: [weather] })
```

### Salida estructurada

```ts
const Person = z.object({ name: z.string(), age: z.number() })
const agent = new Agent({ structuredOutputSchema: Person })
const result = await agent.invoke("John Smith is a 30 year-old software engineer")
result.structuredOutput.age // 30
```

Si el modelo devuelve algo inválido, el agente reintenta con el error de validación; si al final falla, lanza `StructuredOutputError`.

## MCP nativo

Un servidor MCP se conecta como fuente de herramientas:

```python
from strands import Agent
from strands.tools.mcp import MCPClient
from mcp import stdio_client, StdioServerParameters

docs = MCPClient(lambda: stdio_client(
    StdioServerParameters(command="uvx", args=["awslabs.aws-documentation-mcp-server@latest"])
))

with docs:
    agent = Agent(tools=docs.list_tools_sync())
    agent("Tell me about Amazon Bedrock")
```

En TypeScript, `new McpClient({ transport })` se pasa directamente en `tools`. El SDK de Python funciona con las versiones 1.x y 2.x del paquete `mcp`.

## Hooks

Un *hook event* marca un punto del ciclo de vida; un *callback* se registra para ese evento y recibe un objeto tipado. Sirven para logging, validación, guardrails y métricas.

```python
from strands import Agent
from strands.hooks import BeforeToolCallEvent

def log_tool(event: BeforeToolCallEvent) -> None:
    print(f"Tool called: {event.tool_use['name']}")

agent = Agent()
agent.add_hook(log_tool)  # el tipo del evento se infiere del type hint
```

Los orquestadores multiagente emiten sus propios eventos (`BeforeNodeCallEvent`, `AfterNodeCallEvent`). Varios hooks relacionados se empaquetan como **plugins**.

## Estado, sesiones y memoria

| Concepto | Para qué |
| --- | --- |
| Estado del agente | Historial, estado clave-valor y estado por invocación |
| Snapshots | Guardar y restaurar el agente en un punto: checkpoints, deshacer, ramas de conversación |
| Sesiones | Persistir la conversación entre reinicios con un `session_id` |
| Memoria a largo plazo | Hechos destilados que se recuperan entre sesiones, con backend configurable |
| Gestión de contexto | Ventana deslizante o resumen cuando la conversación crece |

```python
from strands import Agent
from strands.session import FileSessionManager

session = FileSessionManager(session_id="user-123", storage_dir="./sessions")
agent = Agent(session_manager=session)
```

En Python, `SnapshotSessionManager` es el recomendado para sesiones nuevas; `FileSessionManager` (disco local) y `S3SessionManager` (Amazon S3) siguen soportados como ruta de compatibilidad.

## Multiagente

| Patrón | Idea | Ciclos |
| --- | --- | --- |
| **Agents as tools** | Un orquestador llama a agentes especialistas como si fueran herramientas | — |
| **Graph** | Tú defines nodos y aristas; el flujo es controlado pero puede ramificar según el resultado | Sí |
| **Swarm** | Un equipo de agentes se pasa la tarea de forma autónoma con memoria compartida | Sí |
| **Workflow** | Un DAG de tareas predefinidas con dependencias, ejecutadas en orden | No |

```ts
import { Agent, Graph } from "@strands-agents/sdk"

const researcher = new Agent({ id: "researcher", systemPrompt: "Research the topic." })
const writer = new Agent({ id: "writer", systemPrompt: "Write the article." })

const graph = new Graph({ nodes: [researcher, writer], edges: [["researcher", "writer"]] })
```

Graph y Swarm aceptan interrupciones para aprobación humana y comparten estado por invocación.

## Agent2Agent (A2A)

El protocolo abierto [A2A](https://a2aproject.github.io/A2A/latest/) permite que un agente de Strands llame a agentes de otras plataformas y al revés.

```bash
pip install 'strands-agents[a2a]'
npm install @strands-agents/sdk @a2a-js/sdk express
```

```python
from strands.agent.a2a_agent import A2AAgent

remote = A2AAgent(endpoint="http://localhost:9000")
result = remote("Show me 10 ^ 6")
```

Para exponer tu agente: `A2AServer(agent_factory=...)` en Python o `A2AExpressServer` en TypeScript. La fábrica crea un agente nuevo por contexto para que los llamantes queden aislados.

## Streaming bidireccional (experimental)

Conversaciones de voz en tiempo real con interrupciones, sobre Amazon Nova Sonic, Gemini Live y OpenAI Realtime:

```bash
pip install "strands-agents[bidi]"        # solo servidor
pip install "strands-agents[bidi-all]"    # todos los proveedores y E/S de terminal
```

La API puede cambiar entre versiones.

## Producción

La documentación incluye guías para desplegar en **Amazon Bedrock AgentCore Runtime** (serverless y aislado por sesión), Lambda, Fargate, App Runner, EKS, EC2, Docker, Kubernetes y Terraform, además de observabilidad con OpenTelemetry, guardrails, human-in-the-loop y prácticas de IA responsable.

Antes de producción:

- fija límites de turnos, tokens y tiempo por invocación;
- da a cada herramienta los permisos mínimos y valida sus argumentos;
- pide aprobación humana antes de acciones irreversibles;
- guarda trazas con el modelo y las herramientas usadas;
- aísla los agentes remotos (A2A) como cualquier servicio externo.

## Cuándo elegirlo

- Quieres un agente en tu propio proceso, sin plataforma alojada, y cambiar de proveedor sin reescribir.
- Ya estás en AWS (Bedrock, AgentCore, Lambda) y quieres el camino con mejor integración.
- Necesitas multiagente o A2A sin montar la orquestación a mano.

Si tu app es sobre todo un chat en una web con React, el [AI SDK de Vercel](/ai/ai-sdk/ai-sdk-vercel) encaja mejor en el frontend.

## Fuentes

- [Documentación oficial](https://strandsagents.com/) · [Quickstart](https://strandsagents.com/docs/user-guide/quickstart/overview/)
- [Strands harness](https://strandsagents.com/docs/user-guide/harness/)
- [Agent loop](https://strandsagents.com/docs/user-guide/concepts/agents/agent-loop/)
- [Hooks](https://strandsagents.com/docs/user-guide/sdk/agents/hooks/) · [Sesiones](https://strandsagents.com/docs/user-guide/sdk/agents/session-management/)
- [Patrones multiagente](https://strandsagents.com/docs/user-guide/sdk/multi-agent/multi-agent-patterns/) · [Agent-to-Agent](https://strandsagents.com/docs/user-guide/sdk/multi-agent/agent-to-agent/)
- [Operar agentes en producción](https://strandsagents.com/docs/user-guide/deploy/operating-agents-in-production/)
- [Monorepo harness-sdk](https://github.com/strands-agents/harness-sdk) · [Ejemplos](https://github.com/strands-agents/samples) · [Herramientas](https://github.com/strands-agents/tools)
- Paquetes: [PyPI strands-agents](https://pypi.org/project/strands-agents/) · [npm @strands-agents/sdk](https://www.npmjs.com/package/@strands-agents/sdk)
