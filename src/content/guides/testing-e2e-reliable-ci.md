---
title: E2E confiable en CI
description: Diseñar pruebas end-to-end deterministas, con selectores estables, aislamiento de datos, trazas y manejo real de flakiness.
category: testing
stack: testing-e2e
order: 3
tags: [testing, e2e, ci, playwright]
scope: pruebas de flujos completos
related:
  - guides/testing-strategy
  - guides/cicd-pipeline-fundamentals
updatedAt: 2026-08-28
---

## Qué cubrir

Reserva las pruebas E2E para flujos donde la integración completa importa: autenticación, compra, permisos, creación crítica y regresiones de navegación. Las combinaciones de reglas pertenecen a pruebas más pequeñas y rápidas.

## Antes de CI

Una prueba E2E confiable comienza en [Playwright práctico](/guides/testing-playwright-practico): locators accesibles, web server controlado, datos aislados y aserciones con auto-wait. CI no corrige una prueba que ya depende de sleeps o estado compartido.

```text
build reproducible → servidor listo → datos por worker → pruebas
                  → evidencia al fallar → teardown
```

## Estabilidad

- Espera estados observables, nunca pausas de duración fija.
- Selecciona por rol/nombre accesible; `data-testid` para elementos sin semántica estable.
- Cada test crea sus datos y no depende del orden.
- Controla reloj, zona horaria, random y proveedores externos.
- Usa cuenta/tenant aislado por worker si corre en paralelo.

## Diagnóstico en CI

Conserva screenshot, video, trace, consola, red y versión solo al fallar para controlar costo. Un retry puede revelar flakiness, pero el run debe reportar que necesitó reintento; no lo conviertas en verde silencioso.

## Pirámide de ejecución

- PR: smoke crítico y navegador principal.
- Main: matriz más amplia y pruebas de integración.
- Programada: navegadores/dispositivos adicionales y journeys largos.

Mide duración y tasa de flaky por test. Pon en cuarentena solo con issue, dueño y fecha; una carpeta permanente de tests ignorados deja de ser una suite.

## Proyectos y matriz

Usa proyectos para configuraciones con significado: navegador, dispositivo, rol o setup. No multipliques toda la suite si solo algunos recorridos necesitan cada combinación.

```ts title="playwright.config.ts"
export default defineConfig({
  projects: [
    { name: 'setup', testMatch: /auth\.setup\.ts/ },
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], storageState: '.auth/user.json' },
      dependencies: ['setup'],
    },
    { name: 'firefox-smoke', grep: /@smoke/, use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit-smoke', grep: /@smoke/, use: { ...devices['Desktop Safari'] } },
  ],
});
```

El estado de autenticación es un secreto temporal. Excluye `.auth` de Git, no lo publiques como artefacto y usa cuentas de prueba.

## Datos y fixtures

Prepara datos por API o fixture de servidor, no haciendo clic por toda la UI en cada test. Usa una cuenta distinta por worker y elimina recursos creados cuando el entorno se comparte. Los datos deben ser deterministas, pero no todos los tests deben usar el mismo usuario: eso oculta problemas de permisos y colisiones.

```ts title="tests/fixtures.ts"
import { test as base } from '@playwright/test';

export const test = base.extend<{ account: { id: string; email: string } }>({
  account: async ({ request }, use) => {
    const account = await createTestAccount(request);
    await use(account);
    await deleteTestAccount(request, account.id);
  },
});
```

Un fixture expresa preparación y limpieza como una dependencia del test. Si la limpieza falla, registra el recurso para retirarlo después; no ocultes el fallo original con otro error del teardown.

El identificador de worker puede formar parte del tenant, correo o schema. Así dos shards no crean el mismo recurso. La limpieza debe ser idempotente porque CI puede cancelar un job antes del teardown.

## Autenticación

Puedes generar `storageState` en un proyecto de preparación y reutilizarlo para recorridos que no prueban el login. No compartas la misma cuenta cuando los tests modifican su estado. Conserva al menos una prueba real del formulario de acceso y separa roles o tenants en archivos de estado distintos.

## Red y proveedores

Intercepta una API externa cuando necesitas forzar éxito, `429`, timeout o payload inválido. No interceptes el backend que la prueba pretende verificar. Una ruta simulada debe afirmar método y cuerpo recibido para no convertir cualquier request incorrecto en una respuesta exitosa.

## Selectores y espera

Prefiere `getByRole`, `getByLabel` y nombres visibles. Un `data-testid` es correcto para una fila sin semántica, pero no debe convertirse en el contrato de cada elemento. Espera la condición que importa —visible, habilitado, respuesta específica o URL— y evita dormir un número fijo de milisegundos.

## Fallos accionables

Guarda el trace con screenshots, consola y requests relevantes. Clasifica cada fallo como producto, ambiente, datos, sincronización o test. Un retry puede ayudar a identificar el problema, pero nunca debe ocultar un fallo reproducible; registra cuántos retries necesitó cada prueba y elimina la cuarentena cuando exista una corrección.

```ts title="playwright.config.ts"
export default defineConfig({
  retries: process.env.CI ? 2 : 0,
  use: {
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
});
```

Dos reintentos no significan que el comportamiento sea aceptable: sirven para obtener evidencia y medir inestabilidad. El pipeline debe distinguir un test que pasó al primer intento de uno que necesitó retry.

## Timeouts por intención

Playwright distingue timeout del test, de la expectativa, de navegación y de acciones. Un valor global enorme hace que cualquier selector equivocado tarde minutos. Mantén defaults razonables y amplía solo la operación que legítimamente tarda.

```ts
await expect(page.getByText(/reporte listo/i)).toBeVisible({
  timeout: 30_000,
});
```

Antes de ampliar, comprueba si la aplicación ofrece una señal mejor: respuesta de red, estado del job o mensaje visible.

## Sharding y paralelismo

Dividir la suite entre jobs reduce tiempo solo si los tests son independientes. Cada shard necesita la misma versión del build, configuración y acceso a datos aislados. Combina reportes al final y conserva el shard/worker en el nombre de los artefactos.

Evita que todos los workers golpeen simultáneamente un proveedor con límites bajos. Simula terceros o limita concurrencia; no reduzcas seguridad de producción para que pase una prueba.

## Seguridad en E2E

Usa credenciales y datos ficticios. No imprimas tokens en traces ni subas cookies de sesión a artefactos públicos. Si el flujo prueba un proveedor externo, simula respuestas en un entorno controlado y deja una prueba separada para verificar el contrato de la integración.

## Lista de comprobación de flakiness

- ¿falla por producto, test, ambiente o datos?
- ¿el locator representa cómo una persona encuentra el control?
- ¿se espera una condición en vez de dormir?
- ¿otro test puede modificar el mismo recurso?
- ¿el trace muestra request duplicado, carrera o navegación pendiente?
- ¿el retry reproduce el mismo fallo o uno diferente?
- ¿la prueba pasa aislada, repetida y en orden aleatorio?

## Referencias

- [Playwright: CI](https://playwright.dev/docs/ci)
- [Playwright: paralelismo](https://playwright.dev/docs/test-parallel)
- [Playwright: retries](https://playwright.dev/docs/test-retries)
