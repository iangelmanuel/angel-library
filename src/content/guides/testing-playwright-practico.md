---
title: Playwright práctico — navegador, locators y fixtures
description: Configurar Playwright, escribir recorridos por comportamiento, usar auto-wait, proyectos, autenticación, red, API y trazas sin crear pruebas frágiles.
category: testing
stack: testing-e2e
order: 1
tags: [testing, playwright, e2e, browser, fixtures]
related:
  - guides/cli-playwright
  - guides/testing-e2e-reliable-ci
  - guides/testing-visual-accessibility
updatedAt: 2026-08-28
---

Playwright controla navegadores reales y su runner aporta aislamiento, fixtures, aserciones con espera, proyectos, trazas y reportes. Una prueba E2E observa el producto desde una frontera externa; no debe conocer estados privados de componentes.

## Mapa rápido

| API | Propósito |
| --- | --- |
| `test` | declarar casos, hooks y configuración |
| `page` | pestaña aislada del navegador |
| `context` | cookies, storage y permisos aislados |
| `locator` | referencia reintentable a elementos |
| `expect` | aserciones web con auto-wait |
| `request` | cliente HTTP dentro de fixtures |
| `testInfo` | metadata, adjuntos y resultado |

## Configuración inicial

```ts title="playwright.config.ts"
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? [['html', { open: 'never' }], ['list']] : 'html',
  use: {
    baseURL: 'http://127.0.0.1:4321',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  webServer: {
    command: 'pnpm build && pnpm preview',
    url: 'http://127.0.0.1:4321',
    reuseExistingServer: !process.env.CI,
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
});
```

En desarrollo puede convenir `pnpm dev`; para detectar diferencias del artefacto final usa build + preview. No ejecutes build por worker: `webServer` administra un proceso compartido.

## Primer recorrido

```ts title="tests/e2e/search.spec.ts"
import { expect, test } from '@playwright/test';

test('encuentra una guía desde la búsqueda', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /buscar/i }).click();
  await page.getByRole('textbox', { name: /buscar/i }).fill('PostgreSQL');
  await page.getByRole('option', { name: /PostgreSQL práctico/i }).click();

  await expect(page).toHaveURL(/postgresql-practico/);
  await expect(
    page.getByRole('heading', { name: /PostgreSQL práctico/i }),
  ).toBeVisible();
});
```

La historia es visible: navegar, actuar y observar URL/contenido. No consulta clases ni llama funciones internas.

## Prioridad de locators

1. `getByRole` con nombre accesible.
2. `getByLabel`, `getByPlaceholder` o texto visible.
3. `getByTestId` para un contrato explícito sin semántica adecuada.
4. CSS/XPath solo para superficies que no controlas o estructuras especiales.

```ts
const row = page
  .getByRole('row')
  .filter({ has: page.getByRole('cell', { name: 'ORDER-42' }) });

await row.getByRole('button', { name: /cancelar/i }).click();
```

Los locators se evalúan al actuar, soportan reintento y *strictness*: si una acción encuentra varios elementos inesperados, falla en vez de elegir silenciosamente.

## Auto-wait y aserciones web

Antes de un clic, Playwright verifica que el elemento exista, sea visible, estable, reciba eventos y esté habilitado. Las aserciones web reintentan hasta el timeout.

```ts
await expect(page.getByRole('status')).toHaveText(/guardado/i);
await expect(page.getByRole('button', { name: /guardar/i })).toBeEnabled();
```

No uses `waitForTimeout(2000)`. Espera la señal que representa éxito: texto, URL, response o estado accesible.

## Fixtures propias

```ts title="tests/e2e/fixtures.ts"
import { test as base } from '@playwright/test';

type Fixtures = {
  member: { id: string; email: string };
};

export const test = base.extend<Fixtures>({
  member: async ({ request }, use) => {
    const response = await request.post('/api/test-support/users');
    const member = await response.json();

    await use(member);

    await request.delete(`/api/test-support/users/${member.id}`);
  },
});

export { expect } from '@playwright/test';
```

Una API de soporte solo debe existir en ambientes de prueba y estar protegida. Preparar datos por API es más rápido que repetir pasos visuales que el caso no pretende probar.

## Autenticación reutilizable

Un proyecto setup puede iniciar sesión y guardar `storageState`. Úsalo para flujos que parten autenticados; conserva una prueba específica del login real.

```ts
await page.context().storageState({ path: '.auth/member.json' });
```

No confirmes `.auth` en Git. Separa estados por rol y evita una cuenta compartida si las pruebas modifican su información.

## Control de red

```ts
await page.route('**/api/external/shipping', async (route) => {
  const request = route.request();
  expect(request.method()).toBe('POST');

  await route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify({ priceCents: 2500 }),
  });
});
```

Simula terceros que no controlas. No interceptes tu propio backend si el objetivo E2E es comprobar su integración. Para esperar una request específica:

```ts
const responsePromise = page.waitForResponse(
  (response) => response.url().endsWith('/api/orders') && response.status() === 201,
);
await page.getByRole('button', { name: /confirmar/i }).click();
await responsePromise;
```

## API testing

La fixture `request` prepara datos y prueba endpoints:

```ts
test('rechaza crear un proyecto sin sesión', async ({ request }) => {
  const response = await request.post('/api/projects', {
    data: { name: 'Privado' },
  });

  expect(response.status()).toBe(401);
});
```

Esto integra servidor desplegado y HTTP, pero no reemplaza todas las pruebas de base o servicio. Es útil para setup, cleanup, smoke y contratos críticos.

## Depuración

- `--ui` explora y reejecuta pasos;
- `--debug` abre inspector;
- `codegen` ayuda a descubrir locators, que luego debes revisar;
- trace viewer muestra DOM, red, consola y snapshots por acción;
- `testInfo.attach` agrega evidencia propia.

Un locator generado no es automáticamente estable. Prefiere nombre accesible y comportamiento que una persona reconoce.

## Errores frecuentes

- probar cada regla solo desde E2E;
- compartir cuenta y datos entre workers;
- usar sleeps;
- seleccionar por clase CSS;
- interceptar todas las APIs y dejar de probar integración;
- repetir login visual en cada caso;
- ocultar flakiness con retries permanentes.

## Referencias

- [Playwright: escribir pruebas](https://playwright.dev/docs/writing-tests)
- [Playwright: locators](https://playwright.dev/docs/locators)
- [Playwright: fixtures](https://playwright.dev/docs/test-fixtures)
- [Playwright: buenas prácticas](https://playwright.dev/docs/best-practices)
