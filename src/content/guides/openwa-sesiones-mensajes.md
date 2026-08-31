---
title: "OpenWA — sesiones y mensajes"
description: "Crear una sesión, vincularla con el código QR y enviar mensajes por la API REST, con la autenticación por API key."
category: general
stack: whatsapp
order: 3
tags: [whatsapp, api, rest, curl, automation]
github: https://github.com/rmyndharis/OpenWA
related:
  - guides/openwa-instalacion
  - guides/openwa-webhooks
updatedAt: 2026-08-30
---

Toda la API vive bajo `http://localhost:2785/api` y se autentica con una cabecera `X-API-Key`. La clave se crea desde el panel y **se muestra una sola vez**: para rotarla se genera una nueva y se borra la anterior.

La documentación interactiva de Swagger está en `/api/docs` mientras no estés en `NODE_ENV=production`.

## El ciclo de una sesión

Una *sesión* es una cuenta de WhatsApp vinculada. El ciclo mínimo son tres llamadas.

### 1. Crear la sesión

```bash
curl -X POST http://localhost:2785/api/sessions \
  -H "Content-Type: application/json" \
  -H "X-API-Key: TU_API_KEY" \
  -d '{"name": "mi-bot"}'
```

La respuesta trae el `sessionId` que usarás en el resto de las rutas.

### 2. Arrancarla y pedir el QR

```bash
curl -X POST http://localhost:2785/api/sessions/{sessionId}/start \
  -H "X-API-Key: TU_API_KEY"
```

```bash
curl http://localhost:2785/api/sessions/{sessionId}/qr \
  -H "X-API-Key: TU_API_KEY"
```

El QR se escanea desde WhatsApp en el teléfono, igual que WhatsApp Web. Desde el panel el proceso es visual y no hace falta pasar por `curl`.

### 3. Enviar un mensaje

```bash
curl -X POST http://localhost:2785/api/sessions/{sessionId}/messages/send-text \
  -H "Content-Type: application/json" \
  -H "X-API-Key: TU_API_KEY" \
  -d '{
    "chatId": "628123456789@c.us",
    "text": "Hola desde OpenWA"
  }'
```

## El formato del `chatId`

Es el punto donde más se tropieza al empezar:

| Destino | Formato | Ejemplo |
| --- | --- | --- |
| Contacto | `<indicativo><número>@c.us` | `573001112233@c.us` |
| Grupo | `<id-del-grupo>@g.us` | `120363000000000000@g.us` |

El número va con indicativo de país, sin `+`, sin espacios y sin guiones.

## Qué más se puede enviar

| Categoría | Incluye |
| --- | --- |
| Mensajes | Texto, imagen, video, documento, audio |
| Interacción | Reacciones con emoji, edición de mensajes ya enviados |
| Volumen | Envío masivo a varios destinatarios |
| Seguimiento | Estado de entrega y confirmaciones de lectura |

La edición de mensajes emite además un evento `message.edited` en vivo, y funciona en los dos motores.

## Más allá de los mensajes

| Área | Qué permite |
| --- | --- |
| Grupos | Crear, administrar, unirse con código de invitación y configurar |
| Perfil | Cambiar nombre visible, texto de estado y foto |
| Llamadas | Evento `call.received`, rechazar llamadas, rechazo automático por sesión |
| Canales | Soporte de Canales de WhatsApp |
| Etiquetas | Organizar chats con etiquetas |
| Proxy | Configuración de proxy por sesión |

## Control de acceso

Tres mecanismos que conviene activar antes de exponer nada:

- **API keys con rol.** Crea claves del menor privilegio posible y acotadas a una sesión cuando el consumidor solo necesita una.
- **Límite de peticiones.** Configurable con las variables `RATE_LIMIT_*`. No es solo protección del servidor: enviar despacio es lo que reduce el riesgo de que WhatsApp restrinja el número.
- **Lista de IPs por CIDR.** Restringe desde qué redes se acepta cada clave.

Además hay registro de auditoría para operaciones sobre API keys, sesiones, instancias de integración e infraestructura. Los envíos de mensajes y las entregas de webhooks se registran en sus propias tablas, no en el log de auditoría.

## Recordatorio

Antes de automatizar envíos conviene releer las [reglas de uso seguro](/guides/openwa-que-es): número dedicado, calentamiento, ritmo bajo y destinatarios que ya esperan tus mensajes.
