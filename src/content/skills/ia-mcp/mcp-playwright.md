---
title: Playwright MCP — control de navegador real
description: El agente navega, clickea, lee la página y saca screenshots de un navegador real — de Microsoft, el mismo equipo de Playwright.
type: skills
order: 3
tags: [ai, mcp, browser, testing]
tool: Cross-tool
updatedAt: 2026-08-17
---

Da control de un navegador real (Chromium/Firefox/WebKit) al agente — navegar, clickear, llenar formularios, leer el DOM, sacar screenshots. Mantenido por el mismo equipo de Microsoft detrás de Playwright.

## Instalar (Claude Code)

```bash
claude mcp add playwright npx @playwright/mcp@latest
```

`--scope project` para compartir la config con el equipo vía git, `--scope user` para uso personal en todos los proyectos.

## En JSON directo

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp@latest"]
    }
  }
}
```

## Fuente

[github.com/microsoft/playwright-mcp](https://github.com/microsoft/playwright-mcp) — oficial de Microsoft/Playwright.

## Cuándo usarlo

- Verificar visualmente un cambio de UI de verdad (no solo leer el código) — exactamente lo que uso en esta biblioteca para revisar cambios de sidebar, iconos, orden de contenido.
- Testing E2E real, o debugging de un flujo que solo se reproduce interactuando con la página.
- Parte de la combinación "esencial" junto a [GitHub MCP](/skills/ia-mcp/mcp-github) y [Context7](/skills/ia-mcp/mcp-context7).

## Consideraciones

- Requiere Node.js 18+. Verificar con `/mcp` dentro de la sesión que aparece conectado — trae ~20 tools distintas (navigate, click, screenshot, etc.).
- Para una automatización más ligera dentro de la sesión, sin instalar un MCP adicional, consulta el skill [agent-browser](/skills/ia-skills/skill-agent-browser).
