---
title: "OpenRouter: sin CLI oficial, se usa vía API"
description: OpenRouter no publica un CLI oficial de gestión — el patrón real es llamar su API HTTP compatible con OpenAI directamente con curl o cualquier SDK.
category: terminal
stack: cli
order: 11
tags: [cli, openrouter, ia, api]
scope: curl
related: [guides/cli-openai]
updatedAt: 2026-08-17
---

A diferencia de Turso, Neon o Vercel —servicios con infraestructura propia que puede administrarse desde la terminal—, [OpenRouter](https://openrouter.ai) es, ante todo, una **capa de API HTTP unificada** que enruta solicitudes a modelos de distintos proveedores. OpenRouter no publica un CLI oficial para gestionar la cuenta o hacer solicitudes desde la terminal; se usa mediante su API HTTP, con `curl` o con un SDK compatible.

(Existe un paquete `@openrouter/cli` en npm mantenido por gente del equipo de OpenRouter, pero es una herramienta de desarrollo específica para editores/agentes vía MCP —statusline de uso de tokens, ruteo de modelos para Claude Code, Cursor, etc.— no un CLI general para administrar la cuenta o hacer chat completions desde la terminal.)

## El patrón real: `curl` contra la API

```bash
curl https://openrouter.ai/api/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENROUTER_API_KEY" \
  -d '{
    "model": "openai/gpt-4o-mini",
    "messages": [
      { "role": "user", "content": "Decime hola en una frase" }
    ]
  }'
```

El formato del request y de la respuesta es **compatible con el de la API de OpenAI** — el campo `model` es el que cambia de proveedor (`openai/...`, `anthropic/...`, `google/...`, etc.).

```bash
export OPENROUTER_API_KEY="sk-or-..."
```

La key se genera desde el dashboard de OpenRouter (`openrouter.ai/keys`).

## Usar el SDK de OpenAI apuntando a OpenRouter

Como la API es compatible, cualquier SDK de OpenAI (Python o JS) funciona sin cambios apuntando el `baseURL`/`base_url` a OpenRouter:

```ts
import OpenAI from "openai";

const client = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});
```

```python
from openai import OpenAI

client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=os.environ["OPENROUTER_API_KEY"],
)
```

## Consideraciones

- No inventes un comando `openrouter <algo>` — no existe como CLI general de la plataforma. Lo que sí existe (`@openrouter/cli`) es una herramienta de desarrollo para integrarlo en editores/agentes vía MCP, no un reemplazo de este flujo HTTP.
- Al ser compatible con el formato de OpenAI, migrar código que ya usa el SDK de OpenAI a OpenRouter suele ser solo cambiar `baseURL` y la API key — no hay que reescribir llamadas.
- El header `Authorization: Bearer $OPENROUTER_API_KEY` es obligatorio en cada request; sin él, la API responde 401.
