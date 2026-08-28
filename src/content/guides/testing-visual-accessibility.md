---
title: Regresión visual y pruebas automáticas de accesibilidad
description: Comparar capturas de forma estable, probar estados responsivos e integrar axe con Playwright sin confundir automatización con revisión humana.
category: testing
stack: testing-e2e
order: 2
tags: [testing, visual, accessibility, playwright, axe]
related:
  - guides/testing-playwright-practico
  - guides/accessibility-testing-manual-automatico
  - guides/testing-e2e-reliable-ci
updatedAt: 2026-08-28
---

La regresión visual detecta cambios en píxeles o regiones. Las pruebas automáticas de accesibilidad detectan reglas programables del árbol y estilos. Son señales diferentes: una captura no entiende semántica y `axe` no decide si el recorrido es comprensible con teclado o lector de pantalla.

## Cuándo usar comparación visual

- componentes de un sistema de diseño;
- layouts con riesgo de desbordamiento;
- temas, estados y breakpoints;
- documentos o emails renderizados;
- regresiones de CSS difíciles de expresar con una propiedad.

Para texto, estados o atributos exactos, usa aserciones semánticas. Una captura de toda la aplicación es más costosa de revisar que `toHaveAccessibleName` o `toBeVisible`.

## Primera captura

```ts
import { expect, test } from '@playwright/test';

test('mantiene la tarjeta de producto', async ({ page }) => {
  await page.goto('/products/demo');

  const card = page.getByRole('article', { name: /teclado/i });
  await expect(card).toHaveScreenshot('product-card.png');
});
```

La primera ejecución crea el baseline; las siguientes comparan. Revisa el archivo inicial y cada actualización. El baseline es una expectativa, no una verdad generada automáticamente.

## Estabilizar la imagen

- fija navegador, sistema operativo, viewport y fuentes;
- usa datos, zona horaria, locale y reloj controlados;
- desactiva animaciones cuando no son el objetivo;
- espera fuentes e imágenes cargadas;
- captura una región pequeña;
- enmascara contenido realmente dinámico;
- no eleves la tolerancia hasta ocultar cambios reales.

```ts
await expect(page).toHaveScreenshot('dashboard.png', {
  animations: 'disabled',
  mask: [page.getByTestId('current-time')],
  maxDiffPixelRatio: 0.01,
});
```

El umbral debe responder al ruido conocido. Si cambia mucho entre sistemas, genera y compara baselines en el mismo contenedor/CI.

## Matriz visual con intención

```ts
for (const viewport of [
  { name: 'mobile', width: 375, height: 812 },
  { name: 'desktop', width: 1440, height: 900 },
]) {
  test(`layout ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto('/pricing');
    await expect(page).toHaveScreenshot(`pricing-${viewport.name}.png`);
  });
}
```

No pruebes cada ancho. Elige breakpoints y tamaños donde el layout cambia o ya falló. Añade zoom/reflow con aserciones específicas para accesibilidad.

## axe con Playwright

```ts
import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test('no introduce violaciones automáticas en checkout', async ({ page }) => {
  await page.goto('/checkout');

  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
    .analyze();

  expect(results.violations).toEqual([]);
});
```

Ejecuta el análisis después de abrir modal, errores o contenido dinámico; escanear solo la carga inicial omite estados importantes.

## Aserciones accesibles dirigidas

```ts
const email = page.getByRole('textbox', { name: /correo/i });
await expect(email).toHaveAccessibleDescription(/formato inválido/i);

await page.keyboard.press('Tab');
await expect(page.getByRole('button', { name: /continuar/i })).toBeFocused();
```

Estas aserciones documentan el contrato del flujo. Agrega navegación por teclado, foco al abrir/cerrar diálogos, nombre accesible, estados `expanded/checked/selected` y anuncios importantes.

## Qué la automatización no cubre

- orden lógico y comprensible del contenido;
- calidad del texto alternativo;
- experiencia real con lector de pantalla;
- facilidad de usar zoom y reflow;
- subtítulos correctos;
- instrucciones y mensajes entendibles;
- fatiga, carga cognitiva o necesidades diversas.

Combina scans con checklist manual y pruebas con personas cuando el alcance lo permita.

## Gestionar excepciones

No excluyas una regla globalmente para poner verde la suite. Documenta elemento, regla, motivo, issue y fecha. Si el problema pertenece a un componente compartido, corrígelo allí y conserva una prueba del componente.

## CI y artefactos

Guarda diff, actual y esperado al fallar. La actualización de snapshots visuales debe ser una acción revisada, idealmente en un entorno consistente. No subas capturas con datos personales o tokens.

## Referencias

- [Playwright: comparaciones visuales](https://playwright.dev/docs/test-snapshots)
- [Playwright: pruebas de accesibilidad](https://playwright.dev/docs/accessibility-testing)
- [axe-core](https://github.com/dequelabs/axe-core)
