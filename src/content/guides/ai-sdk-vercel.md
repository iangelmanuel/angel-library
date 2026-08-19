---
title: "Vercel AI SDK y AI Gateway"
description: Integración full stack con AI SDK, useChat, streaming, persistencia, herramientas y enrutamiento de modelos mediante Vercel AI Gateway.
category: ai
stack: ai-sdk
tags: [vercel, ai-sdk, ai-gateway, react, streaming, usechat, herramientas]
order: 3
related:
  - guides/ai-sdk-fundamentos
  - guides/ai-sdk-openai
  - guides/ai-sdk-openrouter
updatedAt: 2026-08-19
---

**Vercel AI SDK** es un conjunto de utilidades TypeScript para trabajar con modelos mediante una interfaz común. Incluye dos capas principales:

- **AI SDK Core:** generación de texto, objetos, embeddings, herramientas y agentes en el servidor.
- **AI SDK UI:** estado de chat y protocolos de streaming para React y otros frameworks.

**Vercel AI Gateway** es un servicio separado. Funciona como punto de entrada para varios modelos y proveedores, con autenticación, observabilidad, presupuestos, balanceo y fallbacks. Se puede usar AI SDK sin Gateway mediante un adaptador directo, y se puede usar Gateway sin AI SDK mediante su API compatible.

```text
React + useChat
      ↓ protocolo UIMessage
API propia + streamText
      ↓ interfaz de AI SDK
AI Gateway o adaptador directo
      ↓
Proveedor del modelo
```

## Instalación

```bash
pnpm add ai @ai-sdk/react zod
```

- `ai` contiene AI SDK Core, transportes y el proveedor de Gateway.
- `@ai-sdk/react` contiene hooks como `useChat`.
- `zod` define esquemas para herramientas, entradas y datos estructurados.

Para llamar directamente a OpenAI sin pasar por Gateway se instala además su adaptador:

```bash
pnpm add @ai-sdk/openai
```

## Autenticación de AI Gateway

```text
AI_GATEWAY_API_KEY=vck_...
AI_MODEL=openai/gpt-5.4
```

Una API key de Gateway funciona en Vercel y en otros entornos. En despliegues de Vercel también se puede usar **OIDC** (*OpenID Connect*) para obtener credenciales de corta duración sin mantener una clave estática. El entorno y el flujo de la CLI administran ese token; se debe consultar la configuración actual de autenticación al preparar el despliegue.

Gateway admite **BYOK** (*Bring Your Own Key*), que permite asociar claves propias de proveedores. Esto conserva una interfaz unificada, pero la facturación y disponibilidad también dependen del proveedor configurado.

Las variables no deben tener prefijos públicos como `NEXT_PUBLIC_`. Solo las utiliza la ruta del servidor.

## Primera generación con Gateway

Cuando `model` es una cadena con formato `creador/modelo`, AI SDK utiliza Vercel AI Gateway como proveedor predeterminado.

```ts
import { generateText } from 'ai';

const { text, usage, warnings } = await generateText({
  model: process.env.AI_MODEL ?? 'openai/gpt-5.4',
  system: 'Responde en español latinoamericano y explica los acrónimos.',
  prompt: '¿Qué es RAG y cuándo resulta útil?',
  maxOutputTokens: 800,
});

console.log(text);
console.log(usage);
console.log(warnings);
```

**RAG** significa *Retrieval-Augmented Generation* o generación aumentada por recuperación: primero se buscan datos relevantes y después se incluyen en el contexto del modelo.

`warnings` es importante porque un proveedor puede ignorar una configuración que no admite. Cambiar el modelo sin revisar advertencias puede alterar silenciosamente la salida.

También se puede declarar Gateway de forma explícita:

```ts
import { gateway, generateText } from 'ai';

const result = await generateText({
  model: gateway(process.env.AI_MODEL ?? 'openai/gpt-5.4'),
  prompt: 'Propón tres nombres para una herramienta de monitoreo.',
});
```

## Usar un proveedor directo

```ts
import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';

const { text } = await generateText({
  model: openai(process.env.OPENAI_MODEL ?? 'gpt-5.4'),
  prompt: 'Explica la diferencia entre una cola y un stream.',
});
```

En este caso `OPENAI_API_KEY` autentica directamente con OpenAI. Es útil cuando solo se necesita ese proveedor o una función específica de su adaptador. La cadena `openai/...` y la función `openai(...)` no son equivalentes: la primera pasa por AI Gateway; la segunda usa el adaptador directo.

## Configuración compartida

AI SDK normaliza opciones frecuentes, aunque no todos los modelos implementan todas:

| Propiedad | Significado |
|---|---|
| `maxOutputTokens` | Máximo de tokens que puede generar la respuesta |
| `temperature` | Variación del muestreo, cuando el modelo la admite |
| `topP` y `topK` | Limitan candidatos considerados durante el muestreo |
| `presencePenalty` | Desincentiva repetir conceptos ya presentes |
| `frequencyPenalty` | Desincentiva repetir tokens con frecuencia |
| `stopSequences` | Detiene la salida al encontrar una secuencia |
| `seed` | Solicita repetibilidad aproximada si el proveedor tiene soporte |
| `maxRetries` | Cantidad de reintentos automáticos ante fallos compatibles |
| `abortSignal` | Permite cancelar por desconexión o decisión del usuario |
| `headers` | Añade headers específicos de una integración |
| `providerOptions` | Configuración no portable de proveedor o Gateway |

Por regla general se ajusta `temperature` o `topP`, no ambos al mismo tiempo. `providerOptions` es una salida controlada de la abstracción: ofrece capacidades avanzadas, pero acopla esa solicitud a un proveedor.

## Ruta de chat con streaming

El ejemplo usa un Route Handler de Next.js, pero la idea funciona en cualquier servidor que pueda devolver una `Response` web.

```ts
// app/api/chat/route.ts
import {
  convertToModelMessages,
  streamText,
  validateUIMessages,
} from 'ai';
import { z } from 'zod';

export const maxDuration = 30;

const requestSchema = z.object({
  chatId: z.string().uuid(),
  messages: z.array(z.unknown()).max(100),
});

export async function POST(request: Request) {
  const user = await requireAuthenticatedUser(request);
  const body = requestSchema.parse(await request.json());
  const messages = await validateUIMessages({ messages: body.messages });

  await assertChatOwnership(body.chatId, user.id);

  const result = streamText({
    model: process.env.AI_MODEL ?? 'openai/gpt-5.4',
    system: 'Eres un asistente técnico. Explica términos antes de usarlos.',
    messages: await convertToModelMessages(messages),
    maxOutputTokens: 1_500,
    abortSignal: request.signal,
  });

  return result.toUIMessageStreamResponse({
    originalMessages: messages,
    onFinish: async ({ messages }) => {
      await saveChatMessages({
        chatId: body.chatId,
        userId: user.id,
        messages,
      });
    },
  });
}
```

`UIMessage` representa lo que necesita la interfaz: identificador, rol, partes de texto, herramientas y datos personalizados. `ModelMessage` representa el contexto que entiende el modelo. `convertToModelMessages` realiza esa traducción; no conviene enviar objetos de interfaz directamente al proveedor.

`toUIMessageStreamResponse` devuelve el protocolo de AI SDK UI. Está basado en SSE y utiliza el header `x-vercel-ai-ui-message-stream: v1`. El SDK se ocupa de codificar fragmentos de texto, pasos de herramientas, errores y finalización. Si se implementa un backend compatible manualmente, se debe respetar el protocolo y ese header.

El endpoint todavía necesita validar forma y tamaño. Si los mensajes provienen de almacenamiento o incluyen herramientas/datos personalizados, se recomienda `validateUIMessages` con los mismos esquemas usados por la aplicación.

## React con `useChat`

```tsx
'use client';

import { FormEvent, useState } from 'react';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';

export function Chat({ chatId }: { chatId: string }) {
  const [input, setInput] = useState('');
  const { messages, sendMessage, status, stop, error } = useChat({
    id: chatId,
    transport: new DefaultChatTransport({
      api: '/api/chat',
      body: { chatId },
    }),
  });

  function submit(event: FormEvent) {
    event.preventDefault();
    const text = input.trim();
    if (!text || status === 'streaming') return;

    sendMessage({ text });
    setInput('');
  }

  return (
    <section aria-label="Chat con inteligencia artificial">
      <ol aria-live="polite">
        {messages.map((message) => (
          <li key={message.id}>
            <strong>{message.role === 'user' ? 'Tú' : 'Asistente'}:</strong>
            {message.parts.map((part, index) =>
              part.type === 'text' ? (
                <span key={`${message.id}-${index}`}>{part.text}</span>
              ) : null,
            )}
          </li>
        ))}
      </ol>

      <form onSubmit={submit}>
        <label htmlFor="prompt">Mensaje</label>
        <textarea
          id="prompt"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          disabled={status === 'streaming'}
        />
        <button disabled={!input.trim() || status === 'streaming'}>
          Enviar
        </button>
        {status === 'streaming' && (
          <button type="button" onClick={stop}>
            Detener
          </button>
        )}
        {error && <p role="alert">No se pudo completar la respuesta.</p>}
      </form>
    </section>
  );
}
```

`DefaultChatTransport` conoce el contrato de la ruta. `useChat` administra mensajes y estados del stream, pero el valor del campo de texto pertenece al componente. Las versiones recientes separan transporte y estado para permitir rutas personalizadas.

Las partes que no sean texto no deben ignorarse en una aplicación que use herramientas. Se renderizan según su tipo: llamada pendiente, aprobación solicitada, resultado, fuente o dato personalizado.

## Persistencia y memoria

Guardar solo el texto concatenado pierde llamadas a herramientas, adjuntos y metadatos de interfaz. AI SDK recomienda persistir `UIMessage` para reconstruir el chat y convertirlo a `ModelMessage` únicamente al generar.

Un flujo seguro es:

1. El servidor crea `chatId` y lo asocia con `userId`.
2. React envía `chatId`, pero el servidor siempre comprueba pertenencia.
3. La ruta carga o valida los mensajes existentes.
4. `streamText` genera la respuesta.
5. `onFinish` guarda el arreglo final de `UIMessage`.
6. Al abrir el chat, el servidor entrega los mensajes iniciales a `useChat`.

Si se necesita que la generación termine aunque el navegador se desconecte, el backend puede consumir el stream con `consumeStream()` y persistir al finalizar. Esto debe acompañarse de límites porque ya no existe un cliente que cancele el consumo.

Los **streams reanudables** agregan otra capa: se guarda el identificador del stream activo, un endpoint GET recupera los fragmentos y una infraestructura como Redis conserva el flujo. Reanudar no es compatible con abortar el mismo stream, por lo que se debe elegir el comportamiento esperado.

## Herramientas y límite de pasos

```ts
import { stepCountIs, streamText, tool } from 'ai';
import { z } from 'zod';

const result = streamText({
  model: process.env.AI_MODEL ?? 'openai/gpt-5.4',
  messages,
  tools: {
    getOrder: tool({
      description: 'Consulta un pedido al que el usuario tiene acceso.',
      inputSchema: z.object({
        orderId: z.string().min(1),
      }),
      execute: async ({ orderId }) => {
        return getAuthorizedOrder({ orderId, userId: user.id });
      },
    }),
  },
  stopWhen: stepCountIs(5),
});
```

`tool` une descripción, esquema y ejecución. El modelo decide los argumentos; Zod valida su forma; `getAuthorizedOrder` todavía aplica autorización. `stepCountIs(5)` evita un ciclo sin límite. Operaciones como borrar, pagar o publicar deben requerir aprobación humana explícita.

Una herramienta **dinámica** permite decidir su forma en ejecución, pero pierde parte de la seguridad de tipos. Solo se justifica cuando las herramientas no se conocen durante la compilación, por ejemplo si llegan de un servidor MCP. **MCP** significa *Model Context Protocol*, un protocolo para exponer herramientas y recursos a clientes de IA.

## Enrutamiento y fallback en AI Gateway

Gateway puede ordenar proveedores y declarar modelos alternativos mediante `providerOptions.gateway`:

```ts
const result = await generateText({
  model: 'openai/gpt-5.4',
  prompt: 'Analiza los riesgos de este cambio de arquitectura.',
  providerOptions: {
    gateway: {
      order: ['openai', 'azure'],
      only: ['openai', 'azure'],
      models: [
        'openai/gpt-5.4',
        'anthropic/claude-sonnet-4.6',
      ],
    },
  },
});
```

- `order` expresa preferencia de proveedores para un modelo.
- `only` restringe cuáles pueden atender la solicitud.
- `models` define fallbacks de modelo en orden.

Los identificadores son ejemplos y deben verificarse en el catálogo actual. Un fallback mejora disponibilidad, pero puede cambiar estilo, límites, residencia de datos y compatibilidad de herramientas. La aplicación debe probar todos los caminos y registrar qué proveedor/modelo respondió realmente.

## Operación y seguridad

- Configurar presupuestos y alertas antes de habilitar acceso amplio.
- No permitir que el navegador envíe libremente `model` o `providerOptions`.
- Registrar `usage`, latencia, advertencias, modelo y resultado de cada herramienta.
- Comprobar retención de datos y política de cada proveedor detrás del Gateway.
- Aplicar límites por usuario además de los límites globales de Vercel.
- Validar `UIMessage` y cualquier dato personalizado cargado desde la base de datos.
- Propagar `request.signal` para cancelar cuando el usuario pulsa “Detener”.
- Probar el fallback con herramientas y salidas estructuradas, no solo con texto.

## Referencias oficiales

- [Vercel AI SDK: documentación](https://ai-sdk.dev/docs/introduction)
- [AI SDK: configuración de generación](https://ai-sdk.dev/docs/ai-sdk-core/settings)
- [AI SDK UI: `useChat`](https://ai-sdk.dev/docs/reference/ai-sdk-ui/use-chat)
- [AI SDK UI: protocolo de streaming](https://ai-sdk.dev/docs/ai-sdk-ui/stream-protocol)
- [AI SDK UI: persistencia de mensajes](https://ai-sdk.dev/docs/ai-sdk-ui/chatbot-message-persistence)
- [AI SDK: herramientas y llamadas a herramientas](https://ai-sdk.dev/docs/ai-sdk-core/tools-and-tool-calling)
- [Vercel AI Gateway: introducción](https://vercel.com/docs/ai-gateway)
- [Vercel AI Gateway: autenticación y BYOK](https://vercel.com/docs/ai-gateway/authentication-and-byok)
- [Vercel AI Gateway: modelos y proveedores](https://vercel.com/docs/ai-gateway/models-and-providers)
