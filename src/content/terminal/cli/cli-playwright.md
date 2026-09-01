---
title: "Playwright CLI: setup y comandos esenciales"
description: Scaffoldear un proyecto de Playwright, instalar navegadores y los comandos del día a día — test, --ui, codegen y show-report.
type: guides
order: 13
tags: [cli, playwright, testing, e2e]
scope: npx playwright
updatedAt: 2026-08-17
---

El CLI de [Playwright](https://playwright.dev) (testing end-to-end) se usa siempre vía `npx` — no hace falta instalar nada globalmente, `npx playwright <comando>` alcanza en Windows, macOS y Linux por igual.

## Setup inicial

Para un proyecto nuevo:

```bash
npm init playwright@latest
```

El wizard pregunta TypeScript o JavaScript, dónde van los tests, si generar un workflow de GitHub Actions, y si instalar los navegadores ahora. Se puede correr de nuevo sobre un proyecto existente sin pisar los tests ya escritos.

Para agregar Playwright a un proyecto existente sin el wizard:

```bash
npm install -D @playwright/test
npx playwright install
```

## Comandos esenciales

| Comando | Qué hace |
|---|---|
| `npx playwright test` | Corre la suite de tests |
| `npx playwright test --ui` | Abre el modo UI interactivo (ver, pausar, inspeccionar cada paso) |
| `npx playwright codegen <url>` | Graba acciones en el navegador y genera el código del test |
| `npx playwright show-report` | Abre el reporte HTML de la última corrida |
| `npx playwright install` | Instala o actualiza los navegadores (Chromium, Firefox, WebKit) |

```bash
npx playwright test --ui
npx playwright codegen https://miapp.com
npx playwright show-report
```

## Consideraciones

- `npx playwright codegen <url>` es la forma más rápida de arrancar un test nuevo: graba clicks, inputs y navegación en el navegador real y devuelve el código listo para pegar.
- El modo UI (`--ui`) es el más cómodo para debuggear un test que falla — muestra cada paso, el DOM en ese momento y permite pausar y avanzar manualmente.
- `npx playwright install` conviene correrlo de nuevo después de actualizar la versión de `@playwright/test` — los navegadores empaquetados van atados a la versión del paquete.
- La lista completa de comandos y flags siempre está disponible con `npx playwright --help`.
