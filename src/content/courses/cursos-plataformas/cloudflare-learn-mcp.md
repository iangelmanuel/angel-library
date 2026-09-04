---
title: "Learn MCP (Cloudflare Workers)"
description: "Taller práctico para crear un servidor que conecta asistentes de IA con herramientas externas mediante MCP y publicarlo en Cloudflare Workers."
type: resources
order: 7
tags: [cursos, mcp, cloudflare, workers, ia, typescript]
url: https://learnmcp.examples.workers.dev/
resourceCategory: learning
personalNote: De los pocos materiales de MCP que terminan en algo desplegado y con estado, no en un servidor de ejemplo que solo responde "hola".
related:
  - courses/cursos-microsoft/microsoft-reactor-mcp-bootcamp
updatedAt: 2026-08-30
---

> Creado por **Cloudflare** para su iniciativa de talleres _AI to the World_.

Taller práctico de **Cloudflare** para construir servidores del **Model Context Protocol**, el estándar que permite a un asistente de IA conectarse a sistemas y herramientas externas.

|          |                                                |
| -------- | ---------------------------------------------- |
| Formato  | Tutorial interactivo, 7 pasos progresivos      |
| Duración | Unas 5,5 horas, entre 20 y 45 minutos por paso |
| Precio   | Gratis                                         |
| Idioma   | Inglés                                         |

## Qué se construye

Avanza desde un servidor MCP básico hasta una **aplicación de tareas con persistencia**, usando Cloudflare KV para guardar datos y herramientas propias integradas con APIs externas.

Que termine en algo con estado es lo que lo separa de la mayoría de tutoriales de MCP, que se quedan en un servidor que devuelve una respuesta fija.

## Tecnologías

- **Cloudflare Workers** como plataforma serverless.
- **Node.js** v18 o superior.
- **Wrangler CLI** para gestionar los Workers.
- **Cloudflare KV** para almacenamiento persistente.
- **TypeScript** con **Zod** para validación.

## Frente al bootcamp de Microsoft

Los dos enseñan MCP; cambia el entorno y el formato:

|             | Learn MCP (Cloudflare)        | [MCP Bootcamp LATAM](/courses/cursos-microsoft/microsoft-reactor-mcp-bootcamp) |
| ----------- | ----------------------------- | ------------------------------------------------------------------------------ |
| Formato     | Taller escrito, a tu ritmo    | Directos grabados                                                              |
| Idioma      | Inglés                        | Español                                                                        |
| Despliegue  | Cloudflare Workers            | Azure Container Apps                                                           |
| Integración | Herramientas propias con APIs | VS Code y GitHub Copilot                                                       |

Si ya trabajas con Workers, este; si prefieres español y el ecosistema de Azure, el otro.
