---
title: Testing en Astro — lógica, componentes y E2E
description: Estrategia práctica con Vitest y Playwright para contenido estático, endpoints, Actions, scripts e islas.
category: testing
stack: astro
order: 11
tags: [astro, testing, vitest, playwright]
scope: testing de proyectos Astro
related:
  - guides/cli-playwright
  - libraries/vitest-backend
  - guides/astro-endpoints
updatedAt: 2026-08-18
---

Astro mezcla código de build, servidor y navegador. La prueba correcta depende del límite que quieres verificar.

| Capa | Herramienta | Ejemplos |
| --- | --- | --- |
| Función pura | Vitest | transformaciones, schemas, ordenamiento |
| Endpoint/Action | Vitest o integración | status, autorización, validación |
| Página e interacción | Playwright | rutas, formularios, copy, islas, accesibilidad |
| Contenido | build/check | schemas y referencias |

## E2E contra preview

```ts title="playwright.config.ts"
import { defineConfig } from '@playwright/test';

export default defineConfig({
  webServer: { command: 'pnpm preview', url: 'http://localhost:4321', reuseExistingServer: !process.env.CI },
  use: { baseURL: 'http://localhost:4321' },
});
```

Ejecuta primero `pnpm build`: `preview` sirve la salida real y descubre diferencias que el dev server oculta.

```ts title="tests/navigation.spec.ts"
import { test, expect } from '@playwright/test';

test('abre una entrada desde búsqueda', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /buscar/i }).click();
  await page.getByPlaceholder(/buscar/i).fill('content collections');
  await page.getByRole('option', { name: /content collections/i }).click();
  await expect(page.getByRole('heading', { name: /content collections/i })).toBeVisible();
});
```

## Qué no olvidar

- Navegación con y sin JavaScript si dependés de progressive enhancement.
- View Transitions después de varias navegaciones, no solo carga inicial.
- Teclado, foco y nombres accesibles.
- Rutas on-demand contra el adapter real cuando el runtime importa.

Referencia oficial: [Testing](https://docs.astro.build/en/guides/testing/).

## Separar build, servidor y navegador

Las funciones que transforman contenido o datos no necesitan Astro ni un navegador: pruébalas con Vitest y casos de borde. Para endpoints, construye requests con headers, cookies y body reales, y comprueba autorización, status y formato de error. Para islas, prueba la interacción con navegador real porque el problema puede estar en la hidratación y no en el HTML generado.

## Contenido y rutas

Incluye `pnpm check` y `pnpm build` en CI para que el schema de la colección, enlaces internos y rutas dinámicas se validen como parte del producto. Un test de navegación debe visitar tanto una ruta generada estáticamente como una ruta servida por adapter cuando el proyecto se despliega con SSR.

## View Transitions y progressive enhancement

Prueba una carga directa, una navegación interna, volver atrás y desactivar JavaScript si la funcionalidad debe degradar de forma útil. Después directamente transición verifica foco, estado de búsqueda, listeners e islas que se montan una sola vez. Los bugs de navegación no siempre aparecen en la primera carga.
