---
title: "OpenAI SDK: Responses, streaming y memoria"
description: Instalación y uso completo del SDK de OpenAI desde Node.js, parámetros, headers, herramientas, sesiones con memoria y consumo del stream desde React.
category: ai
stack: ai-sdk
tags: [openai, sdk, responses-api, streaming, react, agentes, memoria]
order: 2
related:
  - guides/ai-sdk-fundamentos
  - guides/ai-sdk-vercel
  - guides/ai-sdk-openrouter
updatedAt: 2026-08-19
---

El SDK oficial de OpenAI es un cliente para acceder a sus APIs desde código. En JavaScript puede ejecutarse en Node.js, Deno o Bun. La integración debe vivir en el servidor porque la clave concede acceso facturable a la cuenta.

Para aplicaciones nuevas, la **Responses API** es el punto de entrada general para generación, razonamiento, herramientas, entradas multimodales y conversaciones. `Responses` describe el recurso que crea el servidor; no significa que el navegador deba llamar directamente a OpenAI.

## Instalación y variables de entorno

```bash
pnpm add openai zod
```

`openai` es el SDK. `zod` es opcional, pero resulta útil para validar el límite entre datos no confiables y el código de aplicación.

```text
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-5.6
```

El nombre de un modelo puede cambiar o recibir nuevas versiones. Centralizarlo en una variable permite actualizarlo sin buscarlo por todo el proyecto. Se debe confirmar la compatibilidad de parámetros en el catálogo de modelos antes de cambiarlo.

```text
.env
.env.local
```

La clave debe configurarse también en el administrador de secretos del entorno de despliegue. Un archivo ignorado por Git evita una publicación accidental, pero no protege una clave que ya se expuso: en ese caso se debe revocar y crear otra.

## Crear un cliente del lado del servidor

```ts
// src/libs/openai.ts
import OpenAI from 'openai';

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  timeout: 30_000,
  maxRetries: 2,
});
```

Si no se pasa `apiKey`, el SDK puede leer `OPENAI_API_KEY` automáticamente. Declararla hace visible la dependencia. `timeout` evita dejar una solicitud abierta indefinidamente y `maxRetries` permite reintentar algunos errores transitorios. Una acción con efectos externos necesita además idempotencia; reintentar no debe duplicar pagos, correos o reservas.

Este archivo no debe importarse desde un componente React de cliente. En frameworks que distinguen ambos entornos se puede añadir su mecanismo de protección, por ejemplo `server-only`, para detectar una importación incorrecta durante la compilación.

## Primera respuesta paso a paso

```ts
import { openai } from './lib/openai';

const response = await openai.responses.create({
  model: process.env.OPENAI_MODEL ?? 'gpt-5.6',
  instructions: 'Responde en español latinoamericano con ejemplos breves.',
  input: '¿Qué diferencia existe entre autenticación y autorización?',
});

console.log(response.output_text);
```

1. `responses.create` crea una generación.
2. `model` identifica el modelo que procesa la solicitud.
3. `instructions` define el comportamiento general; debe construirse en el servidor.
4. `input` contiene la petición del usuario. También puede representar una lista estructurada de mensajes o contenido multimodal.
5. La promesa termina cuando la respuesta está completa.
6. `output_text` reúne el texto producido. `output` conserva los elementos estructurados, como llamadas a herramientas.

No se debe asumir que siempre habrá texto. Una respuesta puede contener una llamada a herramienta, un estado incompleto o un rechazo que la aplicación debe manejar explícitamente.

## La solicitud HTTP que construye el SDK

Entender el protocolo facilita la depuración y permite usar `fetch` cuando el SDK no está disponible.

```ts
const httpResponse = await fetch('https://api.openai.com/v1/responses', {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    model: process.env.OPENAI_MODEL,
    input: 'Resume el patrón Repository en tres puntos.',
  }),
});

if (!httpResponse.ok) {
  throw new Error(`OpenAI respondió ${httpResponse.status}`);
}

const data = await httpResponse.json();
```

| Parte | Motivo |
|---|---|
| HTTPS | Cifra la clave y el contenido durante el tránsito |
| `Authorization: Bearer` | Autentica la cuenta que consumirá la API |
| `Content-Type: application/json` | Declara cómo interpretar el cuerpo |
| Cuerpo JSON | Transporta modelo, entrada y configuración |

La clave de OpenAI viaja únicamente entre el backend y OpenAI. El navegador usa la autenticación de la aplicación. Copiar la clave al header de React convertiría a cada visitante en poseedor de la credencial.

## Propiedades más importantes de Responses

| Propiedad | Función | Observación |
|---|---|---|
| `model` | Selecciona el modelo | Validarlo en el backend, no recibir cualquier valor del cliente |
| `input` | Texto, mensajes o contenido de entrada | Puede incluir texto, imágenes, archivos y resultados de herramientas según el modelo |
| `instructions` | Reglas de alto nivel | Separarlas del contenido del usuario reduce ambigüedad |
| `max_output_tokens` | Límite de tokens de salida | Una respuesta puede terminar incompleta al alcanzarlo |
| `reasoning` | Configura esfuerzo de razonamiento | Más esfuerzo puede aumentar latencia y consumo |
| `text.verbosity` | Ajusta concisión o detalle cuando existe soporte | No sustituye instrucciones específicas |
| `text.format` | Solicita texto o salida estructurada | Usar esquema estricto para datos consumidos por código |
| `temperature` | Modifica variación del muestreo | Su soporte depende del modelo y configuración de razonamiento |
| `top_p` | Limita el núcleo probabilístico | Normalmente se ajusta esto o `temperature`, no ambos |
| `tools` | Declara funciones o herramientas integradas | El servidor sigue controlando su ejecución |
| `tool_choice` | Controla cuándo elegir una herramienta | Puede dejarse automático o limitarse a una herramienta |
| `previous_response_id` | Enlaza un turno con la respuesta anterior | Facilita continuidad sin reenviar manualmente todo el arreglo |
| `store` | Decide si OpenAI conserva el objeto de respuesta | Evaluar requisitos de privacidad y retención |
| `stream` | Entrega eventos a medida que se generan | Requiere consumir un iterador asíncrono |
| `metadata` | Asocia pares clave-valor para búsqueda y trazabilidad | Evitar secretos y datos personales innecesarios |
| `safety_identifier` | Identifica de forma estable a un usuario final para controles de seguridad | Usar un valor opaco o con hash, no correo en texto claro |
| `background` | Permite ejecutar tareas largas en segundo plano cuando está soportado | La aplicación debe consultar o recibir el resultado después |

Un **token** es una unidad interna de texto y no equivale necesariamente a una palabra. El costo y los límites se calculan normalmente con tokens de entrada y salida. El objeto de respuesta incluye datos de uso que conviene registrar sin guardar el contenido sensible.

## Temperatura, razonamiento y salida

```ts
const response = await openai.responses.create({
  model: process.env.OPENAI_MODEL ?? 'gpt-5.6',
  instructions: 'Extrae únicamente los campos solicitados.',
  input: 'Pedido A-18 para Camila, total 45 USD.',
  max_output_tokens: 300,
  text: {
    verbosity: 'low',
  },
});
```

No conviene copiar `temperature: 0` en todas las solicitudes. Algunos modelos de razonamiento no aceptan esa propiedad con determinados niveles de esfuerzo. Cuando se admite, una temperatura baja ayuda en clasificación y extracción; una mayor puede ser útil para propuestas creativas. Se debe comprobar la ficha del modelo y probar el comportamiento con evaluaciones propias.

Para datos que alimentarán código, la salida estructurada es más segura que pedir “devuelve JSON” y analizar cualquier texto:

```ts
const response = await openai.responses.create({
  model: process.env.OPENAI_MODEL ?? 'gpt-5.6',
  input: 'Pedido A-18 para Camila, total 45 USD.',
  text: {
    format: {
      type: 'json_schema',
      name: 'order',
      strict: true,
      schema: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          customer: { type: 'string' },
          totalUsd: { type: 'number' },
        },
        required: ['id', 'customer', 'totalUsd'],
        additionalProperties: false,
      },
    },
  },
});

const order = JSON.parse(response.output_text);
```

El esquema limita la forma, pero la aplicación todavía debe validar reglas de negocio. Un número válido sintácticamente puede ser incorrecto para el pedido real.

## Streaming desde OpenAI

OpenAI transmite eventos mediante **SSE** (*Server-Sent Events*). El SDK los presenta como un iterador asíncrono:

```ts
const stream = await openai.responses.create({
  model: process.env.OPENAI_MODEL ?? 'gpt-5.6',
  input: 'Explica el event loop con una analogía y un ejemplo.',
  stream: true,
});

for await (const event of stream) {
  if (event.type === 'response.output_text.delta') {
    process.stdout.write(event.delta);
  }

  if (event.type === 'response.completed') {
    console.log('\nRespuesta:', event.response.id);
  }
}
```

Entre los eventos importantes están `response.created`, `response.output_text.delta`, `response.completed` y `error`. El código debe discriminar por `event.type`; concatenar cualquier campo encontrado puede mezclar metadatos con el texto.

## Endpoint de streaming para React

El siguiente endpoint Express transforma el stream SSE de OpenAI en **NDJSON** (*Newline-Delimited JSON*): un objeto JSON por línea. Así puede enviar texto, identificadores, uso y errores mediante un contrato sencillo.

```ts
import type { Request, Response } from 'express';
import { z } from 'zod';
import { openai } from './lib/openai';

const requestSchema = z.object({
  sessionId: z.string().uuid(),
  message: z.string().trim().min(1).max(4_000),
});

type SessionState = {
  userId: string;
  previousResponseId?: string;
};

// Solo para demostrar el flujo. En producción se usa una base de datos.
const sessions = new Map<string, SessionState>();

export async function streamOpenAI(request: Request, response: Response) {
  const user = requireAuthenticatedUser(request);
  const input = requestSchema.parse(request.body);
  const sessionKey = `${user.id}:${input.sessionId}`;
  const session = sessions.get(sessionKey);
  const abortController = new AbortController();

  response.on('close', () => abortController.abort());
  response.status(200);
  response.setHeader('Content-Type', 'application/x-ndjson; charset=utf-8');
  response.setHeader('Cache-Control', 'no-cache, no-transform');
  response.setHeader('X-Accel-Buffering', 'no');
  response.flushHeaders();

  const send = (event: unknown) => {
    response.write(`${JSON.stringify(event)}\n`);
  };

  try {
    const stream = await openai.responses.create(
      {
        model: process.env.OPENAI_MODEL ?? 'gpt-5.6',
        instructions: 'Ayuda al usuario con explicaciones verificables y claras.',
        input: input.message,
        previous_response_id: session?.previousResponseId,
        store: true,
        stream: true,
        max_output_tokens: 1_500,
        safety_identifier: createSafetyIdentifier(user.id),
      },
      { signal: abortController.signal },
    );

    send({ type: 'start' });

    for await (const event of stream) {
      if (event.type === 'response.output_text.delta') {
        send({ type: 'text-delta', delta: event.delta });
      }

      if (event.type === 'response.completed') {
        sessions.set(sessionKey, {
          userId: user.id,
          previousResponseId: event.response.id,
        });

        send({
          type: 'done',
          responseId: event.response.id,
          usage: event.response.usage,
        });
      }
    }
  } catch (error) {
    if (!abortController.signal.aborted) {
      send({ type: 'error', message: 'No se pudo completar la respuesta.' });
    }
  } finally {
    response.end();
  }
}
```

`requireAuthenticatedUser` y `createSafetyIdentifier` representan funciones de la aplicación. La primera debe rechazar usuarios sin sesión. La segunda puede producir un hash estable que permita reconocer abuso sin enviar el identificador real.

El `Map` se pierde al reiniciar, no se comparte entre instancias y crece sin control. Solo muestra dónde se conserva `previousResponseId`; una implementación real debe usar persistencia y comprobar que la sesión pertenece al usuario.

## Componente React que recibe los fragmentos

`EventSource` solo facilita solicitudes GET. Como el chat necesita enviar un cuerpo con POST, el componente usa `fetch`, lee `response.body` y separa cada línea NDJSON.

```tsx
import { FormEvent, useRef, useState } from 'react';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

type StreamEvent =
  | { type: 'start' }
  | { type: 'text-delta'; delta: string }
  | { type: 'done'; responseId: string }
  | { type: 'error'; message: string };

export function OpenAIChat() {
  const sessionId = useRef(crypto.randomUUID());
  const activeRequest = useRef<AbortController | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [status, setStatus] = useState<'idle' | 'streaming' | 'error'>('idle');

  async function submit(event: FormEvent) {
    event.preventDefault();
    const text = input.trim();
    if (!text || status === 'streaming') return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: text,
    };
    const assistantId = crypto.randomUUID();
    const controller = new AbortController();

    activeRequest.current = controller;
    setInput('');
    setStatus('streaming');
    setMessages((current) => [
      ...current,
      userMessage,
      { id: assistantId, role: 'assistant', content: '' },
    ]);

    try {
      const response = await fetch('/api/chat/openai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        signal: controller.signal,
        body: JSON.stringify({ sessionId: sessionId.current, message: text }),
      });

      if (!response.ok || !response.body) {
        throw new Error(`El servidor respondió ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        buffer += decoder.decode(value, { stream: !done });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';

        for (const line of lines) {
          if (!line.trim()) continue;
          const streamEvent = JSON.parse(line) as StreamEvent;

          if (streamEvent.type === 'text-delta') {
            setMessages((current) =>
              current.map((message) =>
                message.id === assistantId
                  ? { ...message, content: message.content + streamEvent.delta }
                  : message,
              ),
            );
          }

          if (streamEvent.type === 'error') {
            throw new Error(streamEvent.message);
          }
        }

        if (done) break;
      }

      setStatus('idle');
    } catch (error) {
      if (!controller.signal.aborted) setStatus('error');
    } finally {
      activeRequest.current = null;
    }
  }

  return (
    <section aria-label="Asistente">
      <ol aria-live="polite">
        {messages.map((message) => (
          <li key={message.id}>
            <strong>{message.role === 'user' ? 'Tú' : 'Asistente'}:</strong>{' '}
            {message.content || 'Escribiendo…'}
          </li>
        ))}
      </ol>

      <form onSubmit={submit}>
        <label htmlFor="chat-message">Mensaje</label>
        <textarea
          id="chat-message"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          disabled={status === 'streaming'}
        />
        <button disabled={!input.trim() || status === 'streaming'}>
          Enviar
        </button>
        {status === 'streaming' && (
          <button type="button" onClick={() => activeRequest.current?.abort()}>
            Detener
          </button>
        )}
        {status === 'error' && <p role="alert">No se pudo generar la respuesta.</p>}
      </form>
    </section>
  );
}
```

`credentials: 'include'` permite enviar una cookie de sesión cuando frontend y backend lo requieren. No añade la clave de OpenAI. `AbortController` cancela la lectura del navegador; el backend debe propagar esa cancelación para dejar de consumir recursos.

En una interfaz madura también se controla el foco, se anuncia el estado sin leer cada token de forma molesta, se conserva el mensaje fallido para reintentar y se evita renderizar contenido del modelo con `dangerouslySetInnerHTML`.

## Sesión con memoria mediante `previous_response_id`

```ts
const first = await openai.responses.create({
  model: process.env.OPENAI_MODEL ?? 'gpt-5.6',
  input: 'Mi proyecto se llama Atlas y utiliza PostgreSQL.',
  store: true,
});

const second = await openai.responses.create({
  model: process.env.OPENAI_MODEL ?? 'gpt-5.6',
  previous_response_id: first.id,
  input: '¿Qué base de datos usa mi proyecto?',
  store: true,
});
```

`previous_response_id` enlaza el turno nuevo con una respuesta guardada. La aplicación conserva el último ID por sesión y por usuario. Los tokens previos que vuelven a formar parte del contexto siguen contando para facturación; enlazar respuestas no convierte un historial grande en gratuito.

OpenAI también ofrece la **Conversations API**, que crea una conversación durable y reutilizable entre sesiones, dispositivos o trabajos. Su identificador debe almacenarse en el backend y asociarse al propietario. Es adecuada cuando se necesita un objeto de conversación de larga duración; `previous_response_id` es suficiente para un encadenamiento lineal más simple.

Las respuestas se guardan durante un periodo limitado de forma predeterminada, salvo que se use `store: false`; los objetos asociados a Conversations tienen una política distinta. La decisión de almacenamiento debe compararse con los requisitos de privacidad del producto y verificarse en la documentación vigente.

## Memoria de aplicación para producción

Una sesión robusta no depende únicamente del proveedor:

1. Crear `ai_sessions` con `id`, `user_id`, `last_response_id`, modelo y fechas.
2. Guardar cada mensaje visible en `ai_messages` con estado `pending`, `completed` o `failed`.
3. En una transacción, comprobar propietario y cargar el último identificador.
4. Al completar el stream, guardar el texto final, el uso y `response.id`.
5. Si el stream falla, conservar el turno como fallido sin avanzar el identificador.
6. Resumir o compactar cuando el contexto exceda el presupuesto definido.

La base de datos permite reconstruir la interfaz, buscar conversaciones y migrar de proveedor. El identificador administrado por OpenAI optimiza la continuidad del modelo; ambas capas resuelven problemas distintos.

## Herramientas: el modelo propone, el servidor ejecuta

```ts
const first = await openai.responses.create({
  model: process.env.OPENAI_MODEL ?? 'gpt-5.6',
  input: '¿Cuántas unidades quedan del producto A-18?',
  tools: [
    {
      type: 'function',
      name: 'get_inventory',
      description: 'Obtiene el inventario actual de un producto autorizado.',
      strict: true,
      parameters: {
        type: 'object',
        properties: {
          productId: { type: 'string' },
        },
        required: ['productId'],
        additionalProperties: false,
      },
    },
  ],
});

const toolCall = first.output.find(
  (item) => item.type === 'function_call' && item.name === 'get_inventory',
);

if (toolCall?.type === 'function_call') {
  const args = JSON.parse(toolCall.arguments);
  const inventory = await getAuthorizedInventory(args.productId);

  const final = await openai.responses.create({
    model: process.env.OPENAI_MODEL ?? 'gpt-5.6',
    previous_response_id: first.id,
    input: [
      {
        type: 'function_call_output',
        call_id: toolCall.call_id,
        output: JSON.stringify(inventory),
      },
    ],
  });

  console.log(final.output_text);
}
```

Aunque el esquema use `strict`, se debe validar `arguments` antes de acceder a datos. `getAuthorizedInventory` debe aplicar permisos con la identidad del usuario. Para un agente con varias herramientas se repite el ciclo con un límite de pasos, tiempo y costo; una herramienta destructiva requiere confirmación explícita.

## Errores y lista de salida a producción

- Distinguir errores de validación, autenticación, límite de tasa, proveedor y cancelación.
- No mostrar al usuario mensajes internos ni cuerpos que puedan contener secretos.
- Definir tiempo máximo, reintentos con espera exponencial y presupuesto de tokens.
- Registrar ID de solicitud, modelo, latencia, uso y estado final.
- Aplicar límites antes de abrir el stream; después de enviar headers ya no se puede cambiar a un estado HTTP de error.
- Moderar o revisar entradas y salidas según el riesgo del producto.
- Probar prompt injection, entradas enormes, desconexiones y respuestas sin texto.
- Mantener evaluaciones para detectar regresiones al cambiar modelo o instrucciones.

## Referencias oficiales

- [OpenAI: inicio rápido con JavaScript](https://developers.openai.com/api/docs/quickstart)
- [OpenAI: Responses API](https://developers.openai.com/api/reference/resources/responses)
- [OpenAI: respuestas por streaming](https://developers.openai.com/api/docs/guides/streaming-responses)
- [OpenAI: estado de conversación](https://developers.openai.com/api/docs/guides/conversation-state)
- [OpenAI: catálogo de modelos](https://developers.openai.com/api/docs/models)
- [OpenAI: guía de modelos actuales](https://developers.openai.com/api/docs/guides/latest-model)
