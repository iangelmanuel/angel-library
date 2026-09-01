---
title: "OpenWA — webhooks y filtros"
description: "Recibir eventos de WhatsApp en tu servidor, verificar la firma HMAC y filtrar antes del envío para no procesar ruido."
type: guides
order: 4
tags: [whatsapp, webhooks, hmac, eventos, seguridad]
github: https://github.com/rmyndharis/OpenWA
related:
  - general/whatsapp/openwa-sesiones-mensajes
updatedAt: 2026-08-30
---

Los webhooks son la mitad que falta de la API: la REST sirve para **enviar**, los webhooks para **enterarte** de lo que pasa sin estar preguntando en bucle.

## Registrar uno

```bash
curl -X POST http://localhost:2785/api/sessions/{sessionId}/webhooks \
  -H "Content-Type: application/json" \
  -H "X-API-Key: TU_API_KEY" \
  -d '{
    "url": "https://tu-servidor.com/webhook",
    "events": ["message.received", "session.status"],
    "secret": "tu-secreto-hmac"
  }'
```

Cada webhook se registra **por sesión**, así que puedes mandar los eventos de cada cuenta a un endpoint distinto.

## La firma HMAC

El campo `secret` no es decorativo. OpenWA firma cada entrega con él, y tu servidor debe verificar esa firma antes de confiar en el contenido: si no, cualquiera que conozca tu URL puede inventarse mensajes entrantes.

En Node, la verificación es esta:

```ts title="src/webhooks/verificar-firma.ts"
import { createHmac, timingSafeEqual } from "node:crypto"

export function firmaValida(cuerpo: string, firmaRecibida: string, secreto: string) {
  const esperada = createHmac("sha256", secreto).update(cuerpo).digest("hex")

  const a = Buffer.from(esperada)
  const b = Buffer.from(firmaRecibida)
  // Longitudes distintas: timingSafeEqual lanza en vez de devolver false.
  if (a.length !== b.length) return false

  return timingSafeEqual(a, b)
}
```

Dos detalles que rompen esto en la práctica:

- Hay que firmar sobre el **cuerpo crudo**, antes de que ningún middleware lo convierta en objeto. Si tu framework ya parseó el JSON, `JSON.stringify` del objeto puede no producir los mismos bytes.
- La comparación va con `timingSafeEqual`, no con `===`. Comparar cadenas normal filtra información por el tiempo que tarda.

## Filtros inteligentes

Un webhook sin filtros dispara con todo. Si solo te interesa una parte, puedes añadir un objeto `filters` y OpenWA decide **antes** de hacer la petición a tu servidor:

```json
{
  "filters": {
    "conditions": [
      { "field": "sender", "operator": "is", "value": ["573001112233@c.us"] }
    ]
  }
}
```

Las condiciones se combinan con Y lógico. Los campos disponibles:

| Campo | Sirve para |
| --- | --- |
| `sender` | Quién envía |
| `recipient` | Quién recibe |
| `body` | El texto del mensaje |
| `type` | Tipo de mensaje |
| `mentions` | Menciones dentro del mensaje |
| `fromMe` | Distinguir lo que envía la propia sesión |
| `hasMedia` | Si trae adjunto |
| `isGroup` | Si viene de un grupo |

Un webhook sin `filters` se comporta como siempre, así que se pueden añadir después sin romper nada.

Filtrar en el origen no es solo comodidad: en una sesión con grupos activos, la diferencia entre recibir todo y recibir lo tuyo son órdenes de magnitud de peticiones.

## Eventos útiles

| Evento | Cuándo llega |
| --- | --- |
| `message.received` | Entra un mensaje |
| `message.edited` | Se edita un mensaje |
| `session.status` | La sesión cambia de estado: conectada, desconectada, esperando QR |
| `call.received` | Entra una llamada |

`session.status` es el que conviene vigilar en producción: es el que avisa cuando la sesión se cae y hay que volver a escanear el QR.

## Buenas prácticas del receptor

1. **Responde rápido y procesa después.** Devuelve `200` en cuanto validas la firma y encola el trabajo pesado.
2. **Asume entregas repetidas.** Usa el id del mensaje como clave de idempotencia.
3. **Nunca confíes en el contenido sin validar.** Un mensaje de WhatsApp es entrada de un tercero: escápalo antes de guardarlo o mostrarlo.
