---
title: "OpenRouter SDK: modelos, routing y streaming"
description: Uso de OpenRouter con su SDK y la API compatible con OpenAI, headers, selección de proveedores, fallbacks, privacidad, memoria y React.
category: ai
stack: ai-sdk
tags: [openrouter, sdk, gateway, routing, streaming, react, modelos]
order: 4
related:
  - guides/ai-sdk-fundamentos
  - guides/ai-sdk-openai
  - guides/ai-sdk-vercel
updatedAt: 2026-08-19
---

OpenRouter ofrece una interfaz común para acceder a modelos operados por distintos proveedores. Actúa como **router** o enrutador: recibe una solicitud, selecciona una ruta compatible y puede intentar otra si la primera falla. Esto facilita comparar modelos y mejorar disponibilidad sin integrar cada API por separado.

La abstracción no vuelve idénticos a los modelos. Cada uno conserva ventanas de contexto, parámetros, herramientas, precios, políticas de datos y formatos compatibles. La aplicación debe comprobar capacidades en el catálogo y probar los modelos que acepta.

## Formas de integración

OpenRouter admite tres caminos principales:

| Camino | Cuándo usarlo |
|---|---|
| `@openrouter/sdk` | Proyecto TypeScript que busca tipos generados y acceso directo a OpenRouter |
| API HTTP | Entorno sin SDK o necesidad de controlar el protocolo exactamente |
| SDK compatible con OpenAI | Aplicación existente que ya usa Chat Completions y quiere cambiar la URL base |

También existe un Agent SDK para ciclos de herramientas y estado. Conviene comenzar por el cliente normal: un agente añade decisiones y efectos que necesitan límites, trazabilidad y autorización.

## Instalación y configuración

```bash
pnpm add @openrouter/sdk zod
```

```text
OPENROUTER_API_KEY=sk-or-...
OPENROUTER_MODEL=~openai/gpt-latest
APP_URL=https://example.com
APP_NAME=Atlas Docs
```

El identificador del modelo es ilustrativo; se debe verificar en el catálogo. Para resultados reproducibles conviene fijar una versión cuando exista. Un alias que apunta a “latest” puede cambiar comportamiento sin modificar el código.

```ts
// src/lib/openrouter.ts
import { OpenRouter } from '@openrouter/sdk';

export const openrouter = new OpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
  httpReferer: process.env.APP_URL,
  appTitle: process.env.APP_NAME,
});
```

`httpReferer` y `appTitle` son opcionales y atribuyen las solicitudes a la aplicación. No autentican: la credencial real continúa siendo `apiKey`.

El paquete es ESM (*ECMAScript Modules*) y se importa con `import`. Un proyecto Node.js nuevo debe usar módulos ES o una herramienta de compilación compatible.

## Primera solicitud con el SDK

```ts
import { openrouter } from './lib/openrouter';

const completion = await openrouter.chat.send({
  model: process.env.OPENROUTER_MODEL ?? '~openai/gpt-latest',
  messages: [
    {
      role: 'system',
      content: 'Responde en español latinoamericano con ejemplos concretos.',
    },
    {
      role: 'user',
      content: '¿Qué problema resuelve un circuit breaker?',
    },
  ],
  maxCompletionTokens: 800,
});

console.log(completion.choices[0]?.message.content);
```

Un **circuit breaker** o interruptor de circuito detiene temporalmente llamadas a una dependencia que está fallando. En este ejemplo:

- `chat.send` crea una finalización de chat.
- `messages` conserva roles y orden de la conversación.
- `maxCompletionTokens` limita la salida en el SDK; en HTTP se representa como `max_completion_tokens`.
- `choices[0]` es la primera alternativa. Se usa acceso seguro porque una respuesta fallida puede no contenerla.

Los nombres exactos de propiedades del SDK pueden seguir convención `camelCase`, mientras la API HTTP usa `snake_case`. TypeScript ayuda a detectar esa diferencia.

## Solicitud HTTP y significado de los headers

```ts
const response = await fetch(
  'https://openrouter.ai/api/v1/chat/completions',
  {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': process.env.APP_URL ?? '',
      'X-OpenRouter-Title': process.env.APP_NAME ?? '',
    },
    body: JSON.stringify({
      model: process.env.OPENROUTER_MODEL,
      messages: [{ role: 'user', content: 'Explica una caché LRU.' }],
    }),
  },
);
```

| Header | Obligatorio | Función |
|---|---:|---|
| `Authorization: Bearer` | Sí | Autentica y asigna el consumo a la cuenta |
| `Content-Type: application/json` | Sí cuando se envía JSON | Declara el formato del cuerpo |
| `HTTP-Referer` | No | Identifica la URL de la aplicación para atribución |
| `X-OpenRouter-Title` | No | Muestra el nombre de la aplicación en la atribución |

Estos headers salen del backend. Poner `OPENROUTER_API_KEY` en React permitiría que cualquier persona copie la clave, consuma saldo y evada los límites de la aplicación.

## Reutilizar el SDK de OpenAI

La API de OpenRouter es compatible con el formato de OpenAI para varias operaciones. Una aplicación que ya usa Chat Completions puede cambiar `baseURL`:

```ts
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1',
  defaultHeaders: {
    'HTTP-Referer': process.env.APP_URL,
    'X-OpenRouter-Title': process.env.APP_NAME,
  },
});

const completion = await client.chat.completions.create({
  model: process.env.OPENROUTER_MODEL ?? '~openai/gpt-latest',
  messages: [{ role: 'user', content: 'Explica el patrón Adapter.' }],
});
```

Compatibilidad no significa paridad total. Una propiedad nueva de OpenAI puede no estar implementada por OpenRouter o por el proveedor elegido. También existen extensiones de routing que no forman parte del SDK de OpenAI.

## Parámetros y compatibilidad entre proveedores

| Propiedad | Uso |
|---|---|
| `model` | Modelo principal |
| `models` | Lista ordenada de modelos alternativos |
| `messages` | Historial que se enviará en esta solicitud |
| `temperature` y `top_p` | Muestreo, si la ruta los admite |
| `max_tokens` | Límite de salida para Chat Completions |
| `response_format` | Formato estructurado cuando existe soporte |
| `tools` y `tool_choice` | Herramientas que el modelo puede solicitar |
| `stream` | Entrega incremental |
| `provider` | Preferencias y restricciones de routing |

Cuando una propiedad es esencial, `provider.require_parameters` ayuda a descartar rutas que no la soportan. Sin esa restricción, un proveedor puede ignorar o transformar una opción para mantener disponibilidad.

## Routing de proveedores

OpenRouter balancea entre proveedores disponibles de forma predeterminada. La propiedad `provider` permite hacer explícitas las prioridades y restricciones:

```json
{
  "model": "openai/gpt-5.4",
  "messages": [
    { "role": "user", "content": "Analiza esta consulta SQL." }
  ],
  "provider": {
    "order": ["OpenAI", "Azure"],
    "only": ["OpenAI", "Azure"],
    "allow_fallbacks": true,
    "require_parameters": true,
    "data_collection": "deny",
    "zdr": true
  }
}
```

- `order` expresa prioridad.
- `only` crea una lista permitida.
- `allow_fallbacks` decide si se puede intentar otra ruta.
- `require_parameters` exige compatibilidad con todos los parámetros enviados.
- `data_collection: "deny"` excluye proveedores que declaran recolección de datos para esa ruta.
- `zdr: true` solicita proveedores con **Zero Data Retention**, es decir, retención cero cuando está disponible.

Restringir privacidad o proveedores reduce las rutas elegibles y puede aumentar costo o errores. El backend debe definir estas políticas; no debe aceptar un objeto `provider` arbitrario del navegador.

## Fallback entre modelos

Una lista de modelos permite continuar si el principal falla por disponibilidad, límite de tasa o rechazo compatible:

```json
{
  "models": [
    "openai/gpt-5.4",
    "anthropic/claude-sonnet-4.6"
  ],
  "messages": [
    { "role": "user", "content": "Resume este incidente." }
  ]
}
```

Los IDs son ejemplos. Un fallback debe aceptar el mismo contrato de herramientas, contexto y formato de salida. Si la tarea exige JSON estricto, no sirve una alternativa que ignore el esquema. También se debe informar en telemetría qué modelo y proveedor respondieron realmente.

## Streaming con el SDK

```ts
const stream = await openrouter.chat.send({
  model: process.env.OPENROUTER_MODEL ?? '~openai/gpt-latest',
  messages: [{ role: 'user', content: 'Explica la consistencia eventual.' }],
  stream: true,
});

for await (const chunk of stream) {
  const delta = chunk.choices[0]?.delta?.content;
  if (delta) process.stdout.write(delta);
}
```

Cada `chunk` contiene un cambio parcial. `delta.content` puede faltar porque algunos fragmentos transportan rol, herramientas, uso o finalización. El consumidor debe comprobar su existencia.

## Endpoint con memoria y stream para React

OpenRouter Chat Completions es **stateless**: no conserva por sí sola una sesión que el modelo recupere en la siguiente solicitud. El backend carga los mensajes guardados y los vuelve a enviar en orden.

```ts
import type { Request, Response } from 'express';
import { z } from 'zod';
import { openrouter } from './lib/openrouter';

const requestSchema = z.object({
  sessionId: z.string().uuid(),
  message: z.string().trim().min(1).max(4_000),
});

export async function streamOpenRouter(request: Request, response: Response) {
  const user = requireAuthenticatedUser(request);
  const input = requestSchema.parse(request.body);
  const session = await getOwnedSession(input.sessionId, user.id);
  const history = await loadModelMessages(session.id, { limit: 30 });
  const assistantMessageId = crypto.randomUUID();
  let assistantText = '';

  response.status(200);
  response.setHeader('Content-Type', 'application/x-ndjson; charset=utf-8');
  response.setHeader('Cache-Control', 'no-cache, no-transform');
  response.setHeader('X-Accel-Buffering', 'no');
  response.flushHeaders();

  const send = (event: unknown) => {
    response.write(`${JSON.stringify(event)}\n`);
  };

  await saveMessage({
    sessionId: session.id,
    role: 'user',
    content: input.message,
  });

  try {
    const stream = await openrouter.chat.send({
      model: process.env.OPENROUTER_MODEL ?? '~openai/gpt-latest',
      messages: [
        { role: 'system', content: 'Explica con precisión y reconoce incertidumbre.' },
        ...history,
        { role: 'user', content: input.message },
      ],
      stream: true,
      maxCompletionTokens: 1_500,
    });

    send({ type: 'start', messageId: assistantMessageId });

    for await (const chunk of stream) {
      const delta = chunk.choices[0]?.delta?.content;
      if (!delta) continue;

      assistantText += delta;
      send({ type: 'text-delta', delta });
    }

    await saveMessage({
      id: assistantMessageId,
      sessionId: session.id,
      role: 'assistant',
      content: assistantText,
    });
    send({ type: 'done', messageId: assistantMessageId });
  } catch (error) {
    send({ type: 'error', message: 'No se pudo generar la respuesta.' });
  } finally {
    response.end();
  }
}
```

El componente React de la guía de OpenAI puede consumir esta ruta sin conocer OpenRouter porque ambos endpoints emiten el mismo NDJSON: `start`, `text-delta`, `done` y `error`. Solo se cambia la URL a `/api/chat/openrouter`. Ese contrato propio reduce acoplamiento.

Para producción se debe añadir transacción, estado `pending/failed/completed`, cancelación al cerrar la respuesta y control de concurrencia. Dos mensajes simultáneos en la misma sesión pueden leer el mismo historial y guardar respuestas fuera de orden.

## Cómo controlar el crecimiento de la memoria

Enviar todos los mensajes en cada turno aumenta tokens y puede superar la ventana de contexto. Una estrategia común combina:

1. Instrucciones estables del sistema.
2. Un resumen verificado de los turnos antiguos.
3. Hechos relevantes recuperados desde almacenamiento.
4. Los últimos mensajes sin resumir.
5. El mensaje actual.

La Responses API de OpenRouter se encuentra documentada como beta y es stateless: la aplicación incluye el historial necesario en cada solicitud. No se debe asumir que sus identificadores tienen la misma semántica de persistencia que `previous_response_id` en OpenAI.

## Herramientas y agentes

OpenRouter puede transportar herramientas compatibles con el modelo seleccionado. El router no reemplaza las reglas del backend:

- Exigir `require_parameters` si las herramientas son obligatorias.
- Validar argumentos con un esquema local.
- Comprobar permisos para cada recurso.
- Limitar pasos y llamadas paralelas.
- Guardar llamada, resultado y modelo que la solicitó.
- Pedir confirmación antes de una acción irreversible.

El Agent SDK puede administrar el ciclo modelo-herramienta, pero la memoria de usuario, autorización y persistencia continúan siendo responsabilidades de la aplicación.

## Costos, privacidad y disponibilidad

- Revisar precio y contexto del modelo en el catálogo antes de habilitarlo.
- Registrar uso y costo devueltos por la API cuando estén disponibles.
- Aplicar un máximo por solicitud y una cuota acumulada por usuario.
- Decidir si se permiten proveedores que recopilan datos.
- Verificar ZDR y región según los requisitos reales; no inferirlos por el nombre del modelo.
- Probar fallbacks, límites de tasa y respuestas de moderación.
- Mantener una lista de modelos aprobados en el servidor.
- Usar claves separadas por entorno y rotarlas ante exposición.

## Referencias oficiales

- [OpenRouter: inicio rápido](https://openrouter.ai/docs/quickstart)
- [OpenRouter: SDK de TypeScript](https://openrouter.ai/docs/client-sdks/typescript/overview)
- [OpenRouter: streaming](https://openrouter.ai/docs/api/reference/streaming)
- [OpenRouter: selección y routing de proveedores](https://openrouter.ai/docs/guides/routing/provider-selection)
- [OpenRouter: fallback entre modelos](https://openrouter.ai/docs/guides/routing/model-fallbacks)
- [OpenRouter: atribución de aplicaciones](https://openrouter.ai/docs/app-attribution)
- [OpenRouter: integración mediante el SDK de OpenAI](https://openrouter.ai/docs/guides/community/openai-sdk)
- [OpenRouter: Responses API](https://openrouter.ai/docs/api/reference/responses/basic-usage)
