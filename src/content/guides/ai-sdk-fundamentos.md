---
title: "SDK para IA: fundamentos y arquitectura"
description: Arquitectura segura, parámetros de generación, headers, streaming, memoria y criterios para integrar modelos de IA desde un backend.
category: ai
stack: ai-sdk
tags: [ia, sdk, llm, api, streaming, sse, seguridad]
order: 1
related:
  - guides/ai-sdk-openai
  - guides/ai-sdk-vercel
  - guides/ai-sdk-openrouter
updatedAt: 2026-08-19
---

Un **SDK** (*Software Development Kit* o kit de desarrollo de software) reúne clientes, tipos y utilidades para consumir una plataforma sin construir manualmente cada solicitud HTTP. Un SDK de inteligencia artificial no ejecuta el modelo dentro de la aplicación: prepara una solicitud, la envía a una API y transforma la respuesta en objetos que el lenguaje puede manejar.

Antes de elegir una biblioteca conviene separar cuatro conceptos:

| Concepto | Responsabilidad | Ejemplo |
|---|---|---|
| Modelo | Genera o analiza contenido | Un modelo de texto, visión o audio |
| Proveedor | Opera modelos y expone una API | OpenAI |
| Gateway | Ofrece una entrada común y decide cómo enrutar | Vercel AI Gateway u OpenRouter |
| SDK | Facilita el consumo desde el código | `openai`, `ai`, `@openrouter/sdk` |

Un gateway puede simplificar la autenticación, los cambios de modelo, los límites, las métricas y los fallbacks. También añade una dependencia entre la aplicación y el proveedor final. Para una integración pequeña con un solo proveedor suele bastar su SDK oficial; para varios proveedores, un gateway puede reducir código operativo.

## Arquitectura segura

La clave privada pertenece al backend. Nunca debe quedar en variables públicas, archivos enviados al navegador, código React o aplicaciones móviles que puedan inspeccionarse.

```text
React en el navegador
  │  cookie o token de la aplicación
  ▼
Backend propio: autentica, valida, limita y registra
  │  API key privada del proveedor
  ▼
Proveedor o gateway de IA
  │  respuesta completa o flujo de eventos
  ▼
Backend filtra y adapta → React presenta el resultado
```

El backend no es un proxy pasivo. Debe decidir qué modelos se permiten, limitar el tamaño de entrada, comprobar permisos, aplicar cuotas por usuario y evitar que el cliente inyecte propiedades peligrosas como una URL base, herramientas arbitrarias o un modelo demasiado costoso.

## Recorrido de una solicitud

1. React envía el mensaje al endpoint de la aplicación.
2. El backend identifica al usuario y comprueba si puede usar la función.
3. Un esquema valida tipos, longitudes y campos permitidos.
4. El servidor construye las instrucciones y selecciona el modelo.
5. El SDK convierte esa configuración en una solicitud HTTP autenticada.
6. El proveedor genera una respuesta completa o incremental.
7. El backend guarda la información necesaria y devuelve un contrato estable al frontend.

Este límite evita acoplar la interfaz a un proveedor. React puede trabajar con mensajes propios como `{ id, role, content }` aunque el SDK cambie su representación interna.

## Headers: qué viaja y por qué

Un **header** o encabezado HTTP agrega metadatos a una solicitud o respuesta. No forma parte del contenido principal, pero describe cómo interpretarlo, quién lo envía o cómo puede almacenarse.

### Del navegador al backend

```http
POST /api/chat HTTP/1.1
Content-Type: application/json
Authorization: Bearer <token-de-la-aplicacion>

{"message":"Explícame qué es una transacción"}
```

- `Content-Type` declara el formato del cuerpo. El servidor no debería adivinarlo.
- `Authorization` representa la sesión de **la aplicación**, no la clave de OpenAI, Vercel u OpenRouter. También puede usarse una cookie `HttpOnly`.
- Un identificador de solicitud como `X-Request-Id` ayuda a relacionar frontend, backend y proveedor durante un incidente.

### Del backend al proveedor

```http
POST /v1/responses HTTP/1.1
Content-Type: application/json
Authorization: Bearer <api-key-privada>
```

`Bearer` indica que quien posee el token puede ejercer los permisos asociados. Por eso debe enviarse únicamente mediante HTTPS, guardarse como secreto y rotarse si se expone. El SDK suele añadir estos headers; entenderlos sigue siendo importante para depurar solicitudes o usar `fetch` directamente.

### Del backend al navegador durante un stream

Hay varios protocolos posibles:

| Transporte | `Content-Type` habitual | Cuándo usarlo |
|---|---|---|
| Texto por fragmentos | `text/plain` | Prototipos donde solo importa texto |
| NDJSON | `application/x-ndjson` | Texto más eventos estructurados, una línea JSON por evento |
| SSE | `text/event-stream` | Eventos con nombre, reconexión y protocolo ampliamente soportado |
| WebSocket | Protocolo propio tras el *upgrade* | Comunicación bidireccional continua, audio o tiempo real |

**SSE** significa *Server-Sent Events* o eventos enviados por el servidor. Aunque funciona sobre HTTP, no es lo mismo que WebSocket: SSE fluye principalmente del servidor al cliente. Para un chat de texto, `fetch` con un `ReadableStream`, NDJSON o SSE suelen ser suficientes.

## Parámetros de generación

Los nombres y la compatibilidad cambian por modelo. Esta tabla expresa la intención común; siempre se debe verificar la documentación del modelo seleccionado.

| Propiedad | Qué controla | Decisión práctica |
|---|---|---|
| `model` | Modelo que atenderá la solicitud | Usar una lista permitida en el servidor |
| `input`, `prompt` o `messages` | Contenido y conversación | Validar tamaño, roles y archivos |
| `instructions` o `system` | Reglas generales del asistente | Construirlas en el backend |
| `temperature` | Variación del muestreo | Menor para extracción; mayor para ideación |
| `top_p` | Porción acumulada de probabilidad considerada | Alternativa a `temperature`, no ajuste simultáneo por rutina |
| `max_output_tokens` | Límite máximo de salida | Controlar costo, latencia y respuestas desbordadas |
| `stop` | Secuencias que detienen la generación | Útil para formatos delimitados si el modelo lo admite |
| `reasoning` | Esfuerzo de razonamiento | Reservar niveles altos para tareas que lo justifican |
| `tools` | Acciones que el modelo puede solicitar | Validar autorización y argumentos en el servidor |
| `tool_choice` | Si una herramienta es opcional, obligatoria o específica | Forzar solo cuando el flujo lo necesita |
| `response_format` o `text.format` | Forma esperada, por ejemplo JSON con esquema | Preferir salida estructurada sobre analizar texto libre |
| `stream` | Entrega incremental | Mejora el tiempo percibido hasta el primer fragmento |
| `metadata` | Datos de trazabilidad | No incluir secretos ni información sensible innecesaria |
| `store` | Persistencia administrada por el proveedor | Decidir según privacidad y continuidad |

### `temperature` no significa creatividad exacta

El modelo produce una distribución de probabilidades para el siguiente token, es decir, una unidad de texto procesada por el modelo. `temperature` modifica esa distribución antes del muestreo. Un valor bajo suele concentrar la selección en opciones probables; uno alto distribuye más la probabilidad y puede aumentar la variedad.

```ts
// Clasificación o extracción: se busca consistencia.
const extraction = {
  temperature: 0.1,
  maxOutputTokens: 300,
};

// Lluvia de ideas: se tolera mayor diversidad.
const brainstorming = {
  temperature: 0.8,
  maxOutputTokens: 900,
};
```

No garantiza determinismo: el proveedor puede cambiar infraestructura, versiones o estrategias internas. Algunos modelos de razonamiento ignoran o restringen `temperature`. Además, `temperature` y `top_p` alteran el muestreo de formas relacionadas; normalmente se ajusta uno y se deja el otro en su valor predeterminado.

## Streaming de extremo a extremo

**Streaming** significa procesar la respuesta mientras llega, sin esperar a que termine completa. Reduce el tiempo percibido, pero introduce estados que la interfaz debe manejar: conectando, recibiendo, completado, cancelado y error.

El flujo correcto conserva la presión de lectura: el backend consume cada evento del proveedor y lo escribe al cliente. Acumular toda la respuesta en memoria y enviarla al final elimina el beneficio.

```ts
type ChatStreamEvent =
  | { type: 'start'; messageId: string }
  | { type: 'text-delta'; delta: string }
  | { type: 'usage'; inputTokens: number; outputTokens: number }
  | { type: 'done'; responseId?: string }
  | { type: 'error'; message: string };
```

Un contrato propio como este permite cambiar de SDK sin reescribir React. El navegador añade cada `delta` al mensaje que se está construyendo. Los identificadores, el uso y los errores viajan como eventos separados en lugar de mezclarse con el texto visible.

## Memoria: cuatro problemas distintos

Un modelo no recuerda automáticamente a una persona entre solicitudes. La palabra **memoria** puede referirse a capas diferentes:

1. **Estado de interfaz:** mensajes que React mantiene para renderizar la conversación.
2. **Contexto del modelo:** turnos enviados en la solicitud actual o enlazados mediante un identificador del proveedor.
3. **Persistencia de conversación:** mensajes e identificadores guardados en una base de datos para volver después.
4. **Memoria recuperable:** hechos seleccionados mediante búsqueda semántica o reglas, no todo el historial sin filtrar.

Una sesión de producción puede guardar:

```text
ai_sessions
  id, user_id, provider, model, provider_conversation_id,
  last_response_id, summary, created_at, updated_at

ai_messages
  id, session_id, role, content, status, provider_message_id,
  input_tokens, output_tokens, created_at
```

El backend obtiene `user_id` de la sesión autenticada. Nunca debe aceptar un `sessionId` y cargarlo sin comprobar pertenencia; eso expondría conversaciones de otros usuarios.

Cuando el historial crece se puede conservar una ventana reciente, resumir los turnos anteriores y recuperar solo hechos relevantes. Enviar todo siempre aumenta tokens, costo y latencia, y puede diluir las instrucciones importantes.

## Herramientas y agentes

Una **herramienta** es una función que el modelo puede proponer llamar, como consultar inventario o crear una reserva. Un **agente** añade un ciclo: el modelo decide, el servidor ejecuta una herramienta autorizada, devuelve el resultado y el modelo continúa hasta producir una respuesta o alcanzar un límite.

```text
Usuario → modelo → solicitud de herramienta
                  ↓
       validación + autorización + ejecución
                  ↓
          resultado de herramienta → modelo → respuesta
```

La descripción de una herramienta no es un permiso. Antes de ejecutarla, el servidor debe validar el esquema, autenticar al usuario, comprobar autorización sobre el recurso, limitar repeticiones y pedir confirmación para acciones sensibles. El texto procedente de páginas, correos o archivos puede contener **prompt injection**, instrucciones maliciosas destinadas a desviar al modelo.

## Seguridad y operación

- Guardar claves en el administrador de secretos de la plataforma y rotarlas periódicamente.
- Autenticar antes de consumir tokens y aplicar límites por usuario, IP, modelo y periodo.
- Limitar longitud, archivos, tipos MIME y tiempo de ejecución.
- Mantener una lista permitida de modelos, herramientas y dominios externos.
- Tratar la salida como datos no confiables: escapar HTML y validar JSON antes de usarlo.
- No registrar prompts completos si pueden contener credenciales o datos personales.
- Implementar `AbortController`, tiempos máximos y cancelación al cerrar la conexión.
- Reintentar únicamente errores transitorios y con espera exponencial; evitar duplicar acciones.
- Registrar latencia, modelo, tokens, costo estimado, código de error y un identificador de solicitud.
- Probar límites de cuota y fallbacks antes de necesitarlos durante una caída.

## Cómo elegir la integración

| Necesidad | Camino inicial |
|---|---|
| Usar principalmente modelos y capacidades de OpenAI | SDK oficial de OpenAI |
| Una API de aplicación y componentes React con protocolo de chat integrado | Vercel AI SDK |
| Enrutar por Vercel, usar OIDC/BYOK y controlar presupuestos | Vercel AI Gateway |
| Comparar o enrutar muchos proveedores mediante una API compatible | OpenRouter |

**OIDC** significa *OpenID Connect*, un mecanismo de identidad que permite obtener credenciales de corta duración. **BYOK** significa *Bring Your Own Key* o usar una clave propia del proveedor detrás de un gateway.

La elección no elimina el diseño de aplicación. En todos los casos siguen siendo responsabilidad del backend la identidad, los permisos, la persistencia, el contrato con React y el control de costos.

## Referencias oficiales

- [OpenAI: inicio rápido de la API](https://developers.openai.com/api/docs/quickstart)
- [OpenAI: respuestas por streaming](https://developers.openai.com/api/docs/guides/streaming-responses)
- [Vercel AI SDK: configuración de generación](https://ai-sdk.dev/docs/ai-sdk-core/settings)
- [Vercel AI SDK: protocolo de streaming](https://ai-sdk.dev/docs/ai-sdk-ui/stream-protocol)
- [OpenRouter: inicio rápido](https://openrouter.ai/docs/quickstart)
