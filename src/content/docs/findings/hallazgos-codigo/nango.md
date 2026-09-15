---
title: "Nango: la parte aburrida de integrar APIs de terceros"
description: "Plataforma que gestiona OAuth, refresco de tokens, sincronizaciones y webhooks para más de mil APIs, con la lógica de integración escrita como funciones TypeScript."
tags: [integraciones, oauth, apis, typescript, webhooks, autoalojado]
sidebar:
  order: 12
draft: false
resourceCategory: developer-tools
website: https://www.nango.dev/docs
url: https://github.com/NangoHQ/nango
updatedAt: 2026-09-14
---

> Publicado por **[NangoHQ](https://github.com/NangoHQ)** bajo **Elastic License**. Documentación en [nango.dev/docs](https://www.nango.dev/docs).

[Nango](https://github.com/NangoHQ/nango) resuelve la parte de integrar un SaaS ajeno que no tiene nada de interesante y sí mucho de frágil: el flujo de OAuth, guardar y refrescar tokens por cliente, reintentar cuando la API responde 429 y normalizar los datos que llegan.

## Qué aporta

| Pieza       | Qué resuelve                                                                 |
| ----------- | ---------------------------------------------------------------------------- |
| Auth        | OAuth gestionado, API keys y refresco de tokens para más de 1.000 APIs       |
| Proxy       | Peticiones autenticadas en nombre del usuario, con reintentos y rate limit   |
| Functions   | Tu lógica de integración como funciones TypeScript que se despliegan ahí     |
| Webhooks    | Recepción y procesamiento de eventos entrantes                               |
| Sincronía   | Traer datos del tercero de forma periódica y normalizada                     |

Casos habituales: *tool calling* para agentes de IA, sincronizar datos de un CRM, procesar webhooks y mantener configuración por cliente.

Hay un generador con IA que escribe la función a partir de una descripción, y compatibilidad con Cursor, Claude Code y frameworks de agentes vía MCP o LangChain.

## Cómo se usa

```bash
pnpm add @nangohq/node
```

```ts
import { Nango } from "@nangohq/node"

const nango = new Nango({ secretKey: process.env.NANGO_SECRET_KEY! })

// Llamada autenticada a la API del tercero, sin manejar el token
const respuesta = await nango.get({
  endpoint: "/v1/contacts",
  providerConfigKey: "hubspot",
  connectionId: "cliente-42"
})
```

La clave del asunto es `connectionId`: cada cliente final tiene su conexión y sus credenciales, y tu código nunca toca el token. Eso es lo que evita la tabla propia de `access_token`/`refresh_token` que siempre termina mal mantenida.

La clave secreta es **del servidor**. En el frontend se usa una sesión de conexión temporal para abrir el flujo de OAuth, nunca la clave.

## Cloud, self-host y licencia

- **Nango Cloud** (de pago) trae todas las funciones y aporta aislamiento por tenant, escalado, reintentos automáticos y observabilidad.
- **Autoalojado gratuito** funciona, pero con un **conjunto de funciones limitado**; la versión completa es Enterprise.

La **Elastic License** no es Apache ni MIT: permite usar y modificar, pero restringe ofrecer el producto como servicio gestionado a terceros. Si tu plan es revender Nango como parte de una plataforma, lee la licencia antes de construir encima.

## Cuándo conviene

- Varias integraciones, cada una con su OAuth y sus cuotas.
- Producto multicliente donde cada cuenta conecta *su* Google, *su* Slack, *su* HubSpot.
- Agentes que necesitan herramientas autenticadas contra APIs reales.

Para una sola integración con un proveedor, escribir el flujo a mano sigue siendo más simple. Nango paga cuando el problema es la coordinación y el mantenimiento, no la primera conexión.

## Límites

- Autoalojar con funciones recortadas puede no cubrir lo que viste en la documentación de Cloud: comprueba qué queda fuera antes de decidir.
- Se convierte en un intermediario con acceso a los tokens de tus clientes: su seguridad y su disponibilidad pasan a ser tuyas.
- El catálogo de más de mil APIs es de calidad desigual: algunas integraciones están mucho más maduras que otras.

## Fuentes

- [Repositorio y README de Nango](https://github.com/NangoHQ/nango)
- [Documentación oficial](https://www.nango.dev/docs)
