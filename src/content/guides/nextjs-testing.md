---
title: Testing en Next.js — unitario, componentes y E2E
description: Qué probar con Vitest y Testing Library, qué dejar a Playwright y cómo tratar Server Components y Server Actions.
category: testing
stack: nextjs
order: 10
tags: [nextjs, testing, vitest, playwright]
scope: next.js app router (testing)
related:
  - libraries/vitest-backend
  - guides/cli-playwright
updatedAt: 2026-08-18
---

No existe una sola capa de tests que cubra bien todo Next.js. Separa lógica pura, componentes cliente y flujos completos.

| Capa | Herramienta | Qué cubre |
| --- | --- | --- |
| Unitario | Vitest | validadores, mappers, services, helpers |
| Componente cliente | Vitest + Testing Library | interacción, estados y accesibilidad local |
| Integración/E2E | Playwright | routing, Server Components, Actions, cookies y navegador real |

## Extraer lógica antes de testear

Una Server Action debería coordinar autorización, validación y persistencia; la regla de negocio compleja conviene extraerla a una función testeable sin runtime de Next.

```ts
export function calcularTotal(items: { price: number; quantity: number }[]) {
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
}
```

## Componentes asíncronos

Los runners basados en jsdom no reproducen por completo el pipeline de React Server Components. Para páginas async, streaming, `cookies()`, navegación y límites `loading/error`, prefiere E2E. Los Client Components sí encajan bien en Testing Library.

## E2E mínimo

```ts title="tests/home.spec.ts"
import { test, expect } from '@playwright/test';

test('navega al detalle', async ({ page }) => {
  await page.goto('/productos');
  await page.getByRole('link', { name: /producto uno/i }).click();
  await expect(page.getByRole('heading', { name: /producto uno/i })).toBeVisible();
});
```

Prueba contra `next build && next start` al menos en CI: desarrollo no replica caché, optimizaciones ni errores de prerender de producción.

Referencia oficial: [Testing](https://nextjs.org/docs/app/guides/testing).

## Matriz específica de Next.js

- Server Component con datos: prueba la función de acceso a datos y el flujo completo en Playwright.
- Client Component: Testing Library para interacción, estados, accesibilidad y eventos.
- Server Action: prueba validación y autorización fuera de React; confirma revalidación, redirect y errores con E2E.
- Route Handler: integración con `Request`/`Response`, cookies, headers y status reales.
- `loading`, `error` y `not-found`: navega a estados lentos, excepcionales y recursos inexistentes.

## Route Handlers

Si el handler no depende de estado global de Next.js, invócalo con un `Request` real y afirma la respuesta completa.

```ts
import { GET } from '@/app/api/products/route';

it('valida el límite de resultados', async () => {
  const response = await GET(new Request('http://example.test/api/products?limit=0'));

  expect(response.status).toBe(400);
  await expect(response.json()).resolves.toMatchObject({ code: 'INVALID_LIMIT' });
});
```

Añade integración o E2E cuando intervengan `cookies()`, middleware, caché, región o runtime Edge, porque una llamada directa no reproduce toda la tubería.

## Server Actions

Separa la regla de negocio de la función marcada con `'use server'`. Prueba validación, autorización y persistencia en el servicio; después usa E2E para confirmar el envío del formulario, el estado pendiente, el error visible, `redirect` y `revalidatePath`/`revalidateTag`.

Una acción es una frontera pública aunque solo la invoque tu interfaz. No confíes en que el formulario ocultó un campo: repite validación y autorización en servidor y agrega un caso de recurso ajeno.

## Aislar el entorno

Usa una base de datos de prueba y variables explícitas. No compartas una sesión entre tests paralelos. Prueba una vez contra `next start` con build de producción y conserva una suite rápida para desarrollo, porque el dev server puede ocultar problemas de caché, prerender o variables ausentes.

## Errores que la suite debe detectar

Incluye acceso a un recurso ajeno, mutación sin sesión, cookie con atributos incorrectos, acción repetida, respuesta lenta y error del proveedor. Verifica el HTML y el comportamiento visible, no detalles internos del árbol de React. Un test de Next.js es más resistente cuando afirma lo que recibe el usuario.
