---
title: agent-browser — automatización de navegador para agentes
description: Le da al agente control de un navegador real — navegar, clickear, leer contenido — sin configurar Playwright MCP a mano.
category: skills
stack: ia-skills
order: 3
tags: [ai, skill, browser, testing]
tool: Cross-tool
updatedAt: 2026-08-17
---

Da acceso a control de navegador (navegar, clickear, leer texto de la página) empaquetado como skill — para verificar cambios visuales, hacer scraping puntual, o testear un flujo manualmente sin salir de la sesión del agente.

## Instalar

```bash
npx skills add https://github.com/vercel-labs/skills --skill agent-browser
```

## Fuente

[skills.sh/vercel-labs/skills/agent-browser](https://www.skills.sh/vercel-labs/skills/agent-browser) — vercel-labs, 686K+ instalaciones.

## Cuándo usarlo

- Verificar visualmente un cambio de UI después de implementarlo, sin pedirle al usuario que lo revise a mano.
- Flujos de scraping o investigación puntual contra un sitio real.

## Consideraciones

- Para automatización de navegador más robusta y con más control (aserciones, screenshots, grabación), el [MCP de Playwright](/skills/mcp-playwright) es la opción más completa — este skill es más liviano, para casos puntuales dentro directamente sesión normal.
