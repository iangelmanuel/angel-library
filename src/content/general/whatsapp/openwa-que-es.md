---
title: "OpenWA — qué es y cuándo conviene usarlo"
description: "Gateway de WhatsApp autoalojado y open source: qué resuelve, cómo se conecta, qué motor elegir y por qué no reemplaza a la API oficial."
type: guides
order: 1
tags: [whatsapp, api, self-hosted, automation, nodejs, docker]
website: https://www.open-wa.org
github: https://github.com/rmyndharis/OpenWA
updatedAt: 2026-08-30
---

**OpenWA** es un *gateway* de WhatsApp: un servicio que se instala en tu propio servidor y expone una API REST para enviar y recibir mensajes. En vez de programar contra WhatsApp directamente, tu aplicación hace `POST /api/sessions/{id}/messages/send-text` y OpenWA se encarga del resto.

Es software libre con licencia MIT, escrito en TypeScript sobre NestJS. No tiene planes de pago, claves de licencia ni funciones bloqueadas.

## Qué problema resuelve

Conectar una aplicación a WhatsApp tiene dos caminos:

| Camino | Qué implica |
| --- | --- |
| API oficial (WhatsApp Cloud API de Meta) | Alta como negocio, verificación, plantillas aprobadas, costo por conversación |
| Cliente no oficial | Escaneas un QR como en WhatsApp Web y automatizas esa sesión |

OpenWA es el segundo camino, pero empaquetado: en lugar de que cada proyecto integre una librería y resuelva sesiones, reconexiones, colas y webhooks por su cuenta, levantas un servicio que ya trae todo eso y le hablas por HTTP.

## Cómo se conecta

OpenWA **no usa la API oficial de Meta**. Se conecta mediante clientes de ingeniería inversa, y puedes elegir cuál con la variable de entorno `ENGINE_TYPE`:

| Motor | Cómo funciona | Riesgo de bloqueo | RAM por sesión |
| --- | --- | --- | --- |
| `whatsapp-web.js` (por defecto) | Controla un Chromium headless real; el tráfico se parece al de WhatsApp Web legítimo | Menor | ~300–500 MB |
| `baileys` | Habla el protocolo multidispositivo por WebSocket, sin navegador | Mayor: es más fácil de identificar | ~30–80 MB |

La regla práctica: si te importa más la cuenta que la memoria, usa `whatsapp-web.js`. Si necesitas muchas sesiones en una máquina y aceptas el riesgo, `baileys`.

## El aviso importante

Esto no es un detalle menor y conviene leerlo antes de escanear ningún QR:

> Siempre existe un riesgo real de que WhatsApp restrinja o bloquee el número. Los sistemas antiabuso de WhatsApp buscan activamente automatización no oficial, y ninguna calidad de código del lado del gateway puede llevar ese riesgo a cero.

De ahí salen varias reglas concretas:

1. **Usa un número dedicado.** Nunca conectes tu número personal ni el principal del negocio. Usa uno que puedas permitirte perder.
2. **Calienta los números nuevos.** Los primeros días compórtate como una persona: escanea el QR, intercambia unos mensajes con contactos guardados, entra a algún grupo, pon foto de perfil. No empieces enviando en masa el primer día.
3. **No escribas primero a desconocidos en lote.** Mandar el primer mensaje a muchos números que nunca te han escrito es la forma más confiable de que te restrinjan, con cualquiera de los dos motores.
4. **Limita tu propio ritmo.** OpenWA trae un limitador configurable (`RATE_LIMIT_*`). Unos pocos mensajes por minuto por sesión es sostenible; miles por hora no lo es.
5. **Prefiere destinatarios que ya te esperan.** Respuestas, alertas, códigos a tus propios usuarios, actualizaciones de pedidos.
6. **Ten un plan B.** Para cualquier flujo crítico —autenticación, cobros— mantén una vía por SMS, correo o la API oficial. No apuestes un login entero a un cliente no oficial.
7. **Cuida la IP.** Las IPs de datacenter barato se marcan más agresivamente que las residenciales.

### Comportamientos que parecen bugs y no lo son

- **El primer mensaje a un contacto nuevo a veces no llega.** La API responde con éxito porque el mensaje sale de OpenWA, pero la política de contacto inicial de WhatsApp lo descarta en la entrega. No depende del gateway.
- **Una cuenta restringida no se puede desbloquear desde OpenWA.** La apelación es por los canales de WhatsApp.

## Cuándo NO usarlo

El propio proyecto lo dice sin rodeos: para despliegues donde importe el cumplimiento ético, legal o regulatorio —salud, finanzas, mensajería comercial a gran escala, cualquier cosa que toque usuarios en la UE bajo GDPR— hay que tratar OpenWA como **no aprobado** y usar la [API oficial de WhatsApp Cloud](https://developers.facebook.com/docs/whatsapp/cloud-api).

Encaja bien en proyectos personales, herramientas internas, automatizaciones propias y aprendizaje. No es un reemplazo directo de la API oficial en entornos regulados.

## Qué trae

| Área | Incluye |
| --- | --- |
| API | REST completa con documentación Swagger interactiva |
| Sesiones | Varias cuentas de WhatsApp concurrentes en una sola instancia |
| Mensajes | Texto, imagen, video, documento, audio, reacciones, edición, envío masivo, estados de entrega |
| Grupos | Crear, administrar, unirse por código de invitación, configurar |
| Otros | Canales, etiquetas, perfil, manejo de llamadas, proxy por sesión |
| Seguridad | Autenticación por API key, límite de peticiones, listas de IP por CIDR, auditoría |
| Infraestructura | SQLite o PostgreSQL, Redis opcional, almacenamiento local o S3/MinIO, Docker |
| Extras | Webhooks con firma HMAC, servidor MCP para agentes de IA, nodos para n8n, plugins (Chatwoot, Typebot) |

## No confundir con `@open-wa/wa-automate`

Existe otro proyecto de nombre parecido, `@open-wa/wa-automate` ([wa-automate-nodejs](https://github.com/open-wa/wa-automate-nodejs), sitio `openwa.dev`). Es **distinto**: una librería de Node más antigua, que se importa dentro de tu propio código en vez de correr como servicio, y **no tiene licencia MIT** —usa una licencia propia con restricciones—. Al buscar documentación conviene verificar en qué proyecto estás.

## Siguiente paso

La instalación con Docker y las variables de configuración están en la [guía de instalación](/general/whatsapp/openwa-instalacion).
