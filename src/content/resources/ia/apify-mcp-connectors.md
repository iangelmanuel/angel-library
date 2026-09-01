---
title: "Apify MCP Connectors — automatizaciones web para agentes"
description: Catálogo de automatizaciones web que un agente de IA puede utilizar mediante MCP para consultar sitios, procesar datos o actuar en otros servicios.
type: resources
tags: [ai, mcp, apify, connectors, automation, scraping]
url: https://apify.com/store/collections/mcp-connectors
resourceCategory: ia
technologies: []
personalNote: Útil para descubrir flujos de agentes que leen datos web o escriben en otras aplicaciones; revisa autor, permisos, precio, manejo de tokens y cumplimiento del sitio origen antes de ejecutar un Actor.
related:
  - resources/ia/smithery
  - skills/codex/codex-mcp
  - skills/skills-fundamentos/ai-tools-safe-workflow
updatedAt: 2026-08-28
---

## Qué contiene

La colección agrupa herramientas construidas sobre **Apify Actors** que pueden participar en flujos compatibles con **MCP**, siglas de *Model Context Protocol*. Un Actor es una unidad ejecutable alojada en Apify para scraping, procesamiento de datos o automatización; MCP permite exponer herramientas y contexto a aplicaciones o agentes de IA mediante un contrato común.

Los conectores cubren casos como monitorear cambios en sitios, recopilar información pública, enviar resultados a Notion o Slack, consultar repositorios y activar automatizaciones desde otros clientes.

## Antes de conectar uno

| Revisión | Por qué importa |
| --- | --- |
| Autor y mantenimiento | La colección incluye herramientas de Apify y de terceros con niveles de soporte diferentes |
| Inputs | Pueden contener URLs privadas, consultas, identificadores o información sensible |
| Outputs | Determina dónde se almacenan los datasets y durante cuánto tiempo |
| Tokens y permisos | Un conector que escribe en Notion, Slack u otro servicio puede actuar con los permisos concedidos |
| Precio | Algunos Actors cobran por ejecución, tiempo, memoria o cantidad de resultados |
| Frecuencia | Una automatización programada puede multiplicar costos y solicitudes rápidamente |
| Cumplimiento | El scraping debe respetar legislación, términos del sitio y datos personales aplicables |

## Flujo seguro de evaluación

1. Lee la descripción, documentación, historial y valoraciones del Actor.
2. Ejecuta una prueba con datos públicos y un límite pequeño de resultados.
3. Entrega credenciales de prueba con el menor alcance posible.
4. Inspecciona los datos producidos antes de conectarlos a otro sistema.
5. Define límites de costo, tiempo, concurrencia y frecuencia.
6. Revoca tokens y elimina datasets de prueba cuando termines.

## Diferencia frente a un registro MCP

[Smithery](/resources/ia/smithery) funciona principalmente como directorio e instalador de servidores MCP. Esta colección está enfocada en herramientas ejecutadas sobre la infraestructura de Apify y en automatizaciones que combinan Actors con aplicaciones externas. Ambos sirven para descubrir integraciones, pero su modelo de ejecución, permisos, almacenamiento y facturación no es necesariamente el mismo.

Nunca asumas que “compatible con MCP” significa “seguro”. MCP estandariza la comunicación; la confianza depende del servidor o conector concreto, del código que ejecuta y de los permisos que recibe.
