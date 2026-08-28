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
updatedAt: 2026-08-28
---

Astro mezcla código de build, servidor y navegador. La prueba correcta depende del límite que quieres verificar.

## Ruta rápida

```text
función importable → Vitest
contenido y frontmatter → schema + astro check/build
endpoint o Action → Request/Response + integración
componente de UI de framework → su Testing Library
página, script o isla hidratada → Playwright
adapter y SSR → build + preview/runtime de producción
```

| Capa | Herramienta | Ejemplos |
| --- | --- | --- |
| Función pura | Vitest | transformaciones, schemas, ordenamiento |
| Endpoint/Action | Vitest o integración | status, autorización, validación |
| Página e interacción | Playwright | rutas, formularios, copy, islas, accesibilidad |
| Contenido | build/check | schemas y referencias |

Un archivo `.astro` se transforma dentro del pipeline de Astro. En lugar de forzar su render en jsdom, extrae reglas puras, prueba componentes React/Vue/Svelte con su herramienta y conserva una prueba de página para composición, slots y HTML final.

## Configurar Vitest con Astro

```ts title="vitest.config.ts"
/// <reference types="vitest/config" />
import { getViteConfig } from 'astro/config';

export default getViteConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
});
```

`getViteConfig` incorpora aliases y configuración de Vite del proyecto. Cambia environment solo en pruebas que realmente necesiten DOM.

## E2E contra preview

```ts title="playwright.config.ts"
import { defineConfig } from '@playwright/test';

export default defineConfig({
  webServer: { command: 'pnpm build && pnpm preview', url: 'http://localhost:4321', reuseExistingServer: !process.env.CI },
  use: { baseURL: 'http://localhost:4321' },
});
```

`preview` sirve la salida real y descubre diferencias que el dev server oculta. Si el sitio utiliza un adapter, confirma que el comando reproduce su runtime; algunos adapters necesitan una prueba desplegada o un servidor específico.

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

- Navegación con y sin JavaScript si dependes de mejora progresiva (*progressive enhancement*).
- View Transitions después de varias navegaciones, no solo carga inicial.
- Teclado, foco y nombres accesibles.
- Rutas on-demand contra el adapter real cuando el runtime importa.

Referencia oficial: [Testing](https://docs.astro.build/en/guides/testing/).

## Separar build, servidor y navegador

Las funciones que transforman contenido o datos no necesitan Astro ni un navegador: pruébalas con Vitest y casos de borde. Para endpoints, construye requests con headers, cookies y body reales, y comprueba autorización, status y formato de error. Para islas, prueba la interacción con navegador real porque el problema puede estar en la hidratación y no en el HTML generado.

```ts
import { describe, expect, it } from 'vitest';
import { POST } from '../src/pages/api/subscriptions';

it('rechaza un cuerpo inválido', async () => {
  const request = new Request('http://example.test/api/subscriptions', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ email: 'no-es-correo' }),
  });

  const response = await POST({ request } as never);
  expect(response.status).toBe(400);
  await expect(response.json()).resolves.toMatchObject({ code: 'INVALID_EMAIL' });
});
```

Extrae la lógica que no depende del contexto de Astro y pruébala sin casts. Conserva una prueba de integración para comprobar el adapter, cookies y runtime que usa producción.

## Contenido y rutas

Incluye `pnpm check` y `pnpm build` en CI para que el schema de la colección, enlaces internos y rutas dinámicas se validen como parte del producto. Un test de navegación debe visitar tanto una ruta generada estáticamente como una ruta servida por adapter cuando el proyecto se despliega con SSR.

Puedes probar transformaciones de contenido como funciones puras y dejar al build la integridad global:

```ts
it('ordena entradas por prioridad y título', () => {
  expect(sortEntries(entries)).toEqual([highPriority, alphabetical]);
});
```

No simules `getCollection` en todos los casos y concluyas que el schema o la ruta funcionan. El build real es el contrato para colecciones y `getStaticPaths`.

## View Transitions y progressive enhancement

Prueba una carga directa, una navegación interna, volver atrás y desactivar JavaScript si la funcionalidad debe degradar de forma útil. Después de cada transición verifica foco, estado de búsqueda, listeners e islas que se montan una sola vez. Los bugs de navegación no siempre aparecen en la primera carga.

## Islas y estrategias de hidratación

Comprueba que el HTML útil exista antes de hidratar y que `client:idle`, `client:visible` o `client:media` activen la interacción en la condición esperada. Un componente puede funcionar al cargar directamente y duplicar listeners después de navegar; repite el recorrido y verifica que cada acción produce un solo efecto.

## Actions, formularios y endpoints

Prueba validación y autorización en funciones importables. Después confirma con navegador:

- estado pendiente y doble envío;
- error relacionado con el campo;
- cookie/sesión y protección CSRF cuando aplica;
- redirect y mensaje después del éxito;
- comportamiento sin JavaScript si existe fallback.

Una llamada directa al handler no ejecuta middleware, adapter ni proxy. Conserva una integración desplegada para esas fronteras.

## Matriz de renderizado

| Modo | Caso que no debe faltar |
| --- | --- |
| estático | ruta generada, assets y 404 |
| on-demand | cookie, header, método y error del adapter |
| híbrido | navegación entre página estática y dinámica |
| isla | HTML inicial, hidratación y navegación repetida |

## Referencias

- [Astro: testing](https://docs.astro.build/en/guides/testing/)
- [Playwright práctico](/guides/testing-playwright-practico)
