---
title: Midscene.js — testing visual asistido por IA
description: Integrar acciones, consultas y aserciones visuales con Playwright o Vitest, entendiendo configuración, costos y límites.
type: libraries
order: 2
tags: [testing, ai, playwright, e2e, midscene]
website: https://www.midscenejs.com/
github: https://github.com/web-infra-dev/midscene
install: npm install -D @midscene/web
related:
  - testing/testing-ai/testing-ai-principles
  - testing/testing-e2e/testing-e2e-reliable-ci
updatedAt: 2026-08-28
---

Midscene.js es una herramienta de automatización de interfaz guiada por visión y lenguaje natural. Puede integrarse con Playwright y Vitest para localizar, operar y consultar elementos sin codificar cada selector. Sigue necesitando un navegador, un modelo compatible y una señal de éxito clara.

## Decisión rápida

Usa Midscene cuando la interpretación visual aporta valor: canvas, superficies cambiantes, prototipos o exploración. Mantén Playwright convencional para roles estables, navegación crítica, pagos, permisos y aserciones exactas.

```text
acción determinista → page.getByRole(...).click()
interpretación visual → aiTap('el producto agotado')
resultado exacto → expect(...)
resultado semántico amplio → aiAssert(...) con evidencia
```

## Conceptos principales

| API | Propósito | Ejemplo |
| --- | --- | --- |
| `ai` | ejecutar una secuencia descrita en lenguaje natural | buscar y abrir un producto |
| `aiTap` | pulsar un elemento descrito | botón “Finalizar compra” |
| `aiInput` | escribir en un campo descrito | correo de acceso |
| `aiQuery` | extraer información estructurada | precio y disponibilidad |
| `aiAssert` | comprobar una condición visual/semántica | mensaje de confirmación visible |
| `aiWaitFor` | esperar una condición interpretada por IA | finalización de una carga |

## Integración con Playwright

```ts title="tests/catalog.spec.ts"
import { test } from './fixture';

test('encuentra un producto disponible', async ({ page, ai, aiAssert }) => {
  await page.goto('/catalogo');
  await ai('Busca un teclado mecánico disponible y abre su detalle');
  await aiAssert('La página muestra nombre, precio y estado disponible');
});
```

La documentación oficial propone extender el fixture de Playwright con el agente de Midscene. Mantén `page.goto`, autenticación, preparación de datos y aserciones críticas en APIs deterministas cuando sea posible; usa instrucciones de IA en el tramo que realmente necesita interpretación visual.

Divide un flujo largo en pasos para localizar el fallo:

```ts
await aiTap('el filtro de disponibilidad');
await aiTap('la opción En stock');
await aiAssert('todos los productos visibles indican disponibilidad');
```

Si el producto expone roles y nombres estables, los locators convencionales serán más rápidos y reproducibles.

## Configurar el modelo

El proveedor se configura mediante variables de entorno y puede requerir endpoint, clave, nombre de modelo y familia de API. Los nombres exactos dependen del proveedor y de la versión de Midscene, por lo que deben revisarse en su documentación antes de copiar una configuración.

```bash
# Nunca confirmes este archivo en Git
MIDSCENE_MODEL_API_KEY=tu_clave
MIDSCENE_MODEL_NAME=tu_modelo_visual
```

Añade `.env*` al `.gitignore`, utiliza secretos del sistema de CI y evita imprimir variables en logs. Midscene recomienda Chromium para su integración de navegador porque varias funciones dependen del Chrome DevTools Protocol (CDP).

## Consultas estructuradas

Cuando necesitas datos, una consulta estructurada es más verificable que pedir texto libre.

```ts
const product = await aiQuery<{
  name: string;
  price: number;
  available: boolean;
}>('Extrae el nombre, precio numérico y disponibilidad del producto abierto');

expect(product.available).toBe(true);
expect(product.price).toBeGreaterThan(0);
```

La IA interpreta la pantalla; Vitest o Playwright evalúan condiciones exactas sobre el resultado. Valida el tipo y no uses la respuesta sin comprobarla en una operación sensible.

## Buenas prácticas

- Una intención concreta por paso; instrucciones extensas son difíciles de diagnosticar.
- Datos y cuenta exclusivos para la prueba.
- Modelo fijado, presupuesto y timeout explícitos.
- Reportes visuales y trace al fallar.
- Selectores tradicionales para acciones simples y estables.
- Ninguna operación irreversible contra producción.

Midscene es especialmente útil para prototipos, pruebas exploratorias y superficies visuales cambiantes. Para autorización, pagos, cálculos o contratos de API, conserva pruebas deterministas en capas inferiores.

## Diagnosticar un fallo

Clasifica si falló:

1. la instrucción era ambigua;
2. el modelo interpretó otro elemento;
3. la aplicación no llegó al estado esperado;
4. cambió el dataset;
5. el proveedor/modelo falló o agotó timeout;
6. la aserción aceptó una evidencia insuficiente.

Repite en el mismo modelo y datos. Si el escenario necesita muchos reintentos o instrucciones defensivas, conviértelo en Playwright determinista o rediseña la señal de UI.

## Referencias

- [Midscene.js: documentación](https://www.midscenejs.com/)
- [Integración oficial con Playwright](https://midscenejs.com/integrate-with-playwright)
- [Repositorio de Midscene.js](https://github.com/web-infra-dev/midscene)
