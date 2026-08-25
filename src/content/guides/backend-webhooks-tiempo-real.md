---
title: Webhooks, SSE y WebSockets
description: Elegir comunicación servidor a servidor o actualizaciones en tiempo real, con firmas, reconexión, orden y límites operativos.
category: backend
stack: backend-fundamentos
order: 6
tags: [backend, webhooks, sse, websockets, realtime]
related:
  - guides/backend-api-design
  - guides/ai-sdk-fundamentos
  - guides/security-api-protection
updatedAt: 2026-08-19
---

Estas técnicas resuelven direcciones diferentes:

| Técnica | Dirección | Caso |
| --- | --- | --- |
| Webhook | Servidor externo → tu servidor | Pago confirmado |
| SSE | Servidor → navegador sobre HTTP | Progreso o tokens de IA |
| WebSocket | Bidireccional y persistente | Colaboración o juego |

## Recibir un webhook

Un webhook se considera una entrada no confiable. Verifica su firma sobre el **cuerpo crudo**, fecha y secreto compartido antes de parsear o procesar.

```ts
const expected = createHmac('sha256', secret)
  .update(`${timestamp}.${rawBody}`)
  .digest('hex');

if (!timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
  throw new UnauthorizedError();
}
```

Comprueba tolerancia de tiempo para reducir replay, conserva el identificador del evento para deduplicar y responde rápido. El procesamiento largo se envía a una cola. No confíes únicamente en IPs porque pueden cambiar o atravesar proxies.

## Server-Sent Events

**SSE** (*Server-Sent Events*) envía eventos de texto por una respuesta HTTP mantenida abierta:

```http
Content-Type: text/event-stream
Cache-Control: no-cache

id: 42
event: progress
data: {"percent":60}

```

Define heartbeat, cancelación y reconexión. `Last-Event-ID` puede ayudar a reanudar cuando los eventos se conservan. Algunos proxies agrupan buffers; comprueba la infraestructura real.

## WebSocket

WebSocket permite mensajes en ambos sentidos, pero exige autenticar la conexión, autorizar cada canal, limitar tamaño y frecuencia, gestionar presencia y manejar múltiples instancias mediante un sistema compartido. No lo elijas solo por ser “tiempo real”: para notificaciones unidireccionales, SSE suele ser más simple.

