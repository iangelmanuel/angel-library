---
title: "LibreChat: un chat propio con todos los modelos en la misma interfaz"
description: "Plataforma de chat autoalojada que reúne OpenAI, Anthropic, Google, Bedrock, Ollama y cualquier endpoint compatible, con agentes, MCP, búsqueda web e intérprete de código."
tags: [chat, llm, autoalojado, docker, mcp, agentes, multiproveedor]
sidebar:
  order: 15
draft: false
resourceCategory: ia
website: https://docs.librechat.ai
url: https://github.com/danny-avila/LibreChat
updatedAt: 2026-09-14
---

> Creado por **[Danny Avila](https://github.com/danny-avila)** con licencia MIT. Documentación en [docs.librechat.ai](https://docs.librechat.ai).

[LibreChat](https://github.com/danny-avila/LibreChat) es una interfaz de chat autoalojada que centraliza varios proveedores de modelos en una sola conversación, con las conversaciones guardadas en tu propia base de datos. Nació como clon de ChatGPT y hoy cubre bastante más.

## Proveedores

**Integración directa:** OpenAI, Azure OpenAI, Anthropic (Claude), AWS Bedrock, Google y Vertex AI.

**Compatibles:** Ollama, Groq, Mistral AI, OpenRouter, DeepSeek, Cohere y otros.

Además acepta **endpoints personalizados**: cualquier API compatible con OpenAI entra sin proxy intermedio. Eso incluye modelos locales.

## Qué trae más allá del chat

| Área          | Capacidades                                                                 |
| ------------- | --------------------------------------------------------------------------- |
| Agentes       | Asistentes propios sin código, con marketplace, subagentes y *skills*       |
| Herramientas  | Model Context Protocol (MCP) para conectar servidores de herramientas       |
| Código        | Intérprete en sandbox: Python, Node.js, Go, C/C++, Java, PHP, Rust, Fortran |
| Web           | Búsqueda web con reranking configurable                                     |
| Artefactos    | Render de React, HTML y Mermaid en la conversación                          |
| Imágenes      | DALL·E, Stable Diffusion, Flux o vía servidores MCP                         |
| Equipo        | Multiusuario con OAuth2, LDAP o correo; panel de administración con roles   |
| Conversaciones| Importar/exportar, búsqueda de mensajes, varias pestañas sincronizadas      |

## Despliegue

El camino principal es **Docker Compose**; el repositorio incluye ficheros para el montaje estándar y para varios servicios. Hay stacks preparados para Railway, Zeabur y Sealos.

```bash
git clone https://github.com/danny-avila/LibreChat.git
cd LibreChat
cp .env.example .env
docker compose up -d
```

El `.env` es el trabajo real: ahí van las claves de cada proveedor, la configuración de autenticación y qué endpoints se habilitan. Los agentes, MCP y los espacios de trabajo se configuran en `librechat.yaml`.

## Antes de montarlo

1. Decide quién entra. Si va a estar expuesto en internet, la autenticación y el registro cerrado son lo primero, no un ajuste posterior.
2. Empieza con un proveedor y un modelo; añade el resto cuando el despliegue ya sea estable.
3. Haz copia de la base de datos: ahí viven todas las conversaciones.
4. El intérprete de código ejecuta código: revisa cómo está aislado antes de abrirlo a otros usuarios.
5. Mide el gasto por clave. Autoalojar no reduce el coste de los modelos, solo cambia quién lo paga y cómo.

## Límites

- Autoalojar implica mantener: actualizaciones, copias, certificados y vigilancia del servidor.
- Las funciones avanzadas (agentes, MCP, espacios de trabajo) tienen configuración densa; la curva no está en instalar sino en afinar.
- Cada proveedor sigue aplicando sus propias políticas de datos y retención a lo que le envías: la interfaz es tuya, el modelo no.

## Fuentes

- [Repositorio y README de LibreChat](https://github.com/danny-avila/LibreChat)
- [Documentación oficial](https://docs.librechat.ai)
