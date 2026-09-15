---
title: "Agentic Inbox: un cliente de correo con agente, todo en Cloudflare"
description: "Cliente de correo autoalojado sobre Workers, Durable Objects y Email Routing, con un agente que lee el buzón, busca y redacta borradores que tú confirmas."
tags: [cloudflare, workers, durable-objects, agentes, correo, email-routing]
sidebar:
  order: 17
draft: false
resourceCategory: ia
official: true
website: https://developers.cloudflare.com/
url: https://github.com/cloudflare/agentic-inbox
updatedAt: 2026-09-14
---

> Publicado por **[Cloudflare](https://github.com/cloudflare)** con licencia Apache-2.0.

[Agentic Inbox](https://github.com/cloudflare/agentic-inbox) es un cliente de correo completo — enviar, recibir, hilos, búsqueda, adjuntos — con un agente integrado, ejecutándose **entero sobre la plataforma de Cloudflare**. Como demo de producto es correcto; como referencia de arquitectura es lo interesante.

## El mapa de piezas

| Producto           | Papel en la aplicación                                   |
| ------------------ | -------------------------------------------------------- |
| Workers            | La API y el renderizado en servidor                      |
| Durable Objects    | Un objeto por buzón, con su propia base SQLite aislada   |
| R2                 | Almacenamiento de adjuntos                               |
| Email Routing      | Recepción del correo entrante, con regla catch-all       |
| Workers AI         | El modelo del agente (Kimi-k2.5 de Moonshot AI)          |
| Agents SDK         | Construcción del agente y sus herramientas               |
| Access             | Autenticación y autorización                             |

El patrón que vale copiar: **un Durable Object por buzón**. Cada usuario tiene su base de datos independiente, y el estado del agente (historial de chat, prompt del sistema) vive junto a los datos que maneja, no en un servicio aparte.

## El agente

Expone nueve herramientas de correo: leer, buscar, consultar hilos y redactar respuestas. Cuando llega un correo puede **generar un borrador automáticamente**, pero el envío exige confirmación manual.

Ese detalle es la decisión de diseño que importa: el agente prepara, la persona aprueba. Un agente con permiso de envío sin revisión convierte cualquier prompt injection contenido en un correo entrante en un correo saliente.

## Desplegarlo

```bash
npm install
npm run dev
npm run deploy
```

Hace falta una cuenta de Cloudflare con Workers, un dominio con Email Routing activado y los bindings declarados en `wrangler.jsonc`. El catch-all de Email Routing es lo que entrega el correo al Worker.

## Aviso de seguridad del propio proyecto

**No hay autorización por buzón.** Las políticas de Cloudflare Access son la única frontera de confianza: cualquier usuario autenticado puede acceder a cualquier buzón. Tal como está, sirve para un buzón propio o una demo controlada — no para varios usuarios que no deban verse entre sí. Añadir esa capa es trabajo pendiente de quien lo despliegue.

## Otras cosas a tener en cuenta

- El correo entrante es entrada no confiable: todo lo que el agente lee puede intentar darle instrucciones.
- Workers AI cobra por uso; un buzón con mucho tráfico genera borradores (y coste) sin que nadie los pida.
- El correo y los adjuntos quedan en infraestructura de Cloudflare, con la política de datos de esa cuenta.
- Es un proyecto de demostración: úsalo como plantilla de arquitectura, no como producto terminado.

## Fuentes

- [Repositorio y README de Agentic Inbox](https://github.com/cloudflare/agentic-inbox)
- [Documentación de Cloudflare para desarrolladores](https://developers.cloudflare.com/)
