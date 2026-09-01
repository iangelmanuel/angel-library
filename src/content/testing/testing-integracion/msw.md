---
title: MSW — simular APIs en navegador y Node
description: Interceptar HTTP a nivel de red con Mock Service Worker, reutilizar handlers y probar éxito, errores, latencia y contratos sin mockear fetch.
type: libraries
order: 1
tags: [testing, msw, api, mocks, integration]
website: https://mswjs.io/
github: https://github.com/mswjs/msw
install: npm install --save-dev msw
related:
  - testing/testing-integracion/testing-doubles-contracts
  - testing/react/testing-react-testing-library
  - testing/testing-e2e/testing-e2e-reliable-ci
updatedAt: 2026-08-28
---

MSW (*Mock Service Worker*) intercepta solicitudes HTTP con handlers declarativos. En navegador utiliza un Service Worker; en Node intercepta la red del proceso. El código de aplicación continúa usando `fetch`, Axios u otro cliente real, por lo que la prueba conserva URL, método, headers, serialización y manejo de respuesta.

## Cuándo usarlo

| Necesidad | MSW | Alternativa |
| --- | --- | --- |
| componente consume una API | sí | mockear hook oculta HTTP |
| forzar `500`, `429` o demora | sí | proveedor real no es determinista |
| probar una query SQL | no | base real/Testcontainers |
| confirmar contrato externo real | parcialmente | sandbox o contract test |
| probar backend propio en E2E | normalmente no | entorno desplegado real |

MSW simula la respuesta, no demuestra que el servidor real la produzca. Combínalo con contratos e integración del backend.

## Handler compartido

```ts title="test/mocks/handlers.ts"
import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('/api/users/:id', ({ params }) => {
    return HttpResponse.json({
      id: params.id,
      displayName: 'Ana',
    });
  }),
];
```

Un handler describe el protocolo. Mantén respuestas pequeñas y válidas; crea overrides por prueba para el caso que cambia.

## Configuración en Node con Vitest

```ts title="test/mocks/server.ts"
import { setupServer } from 'msw/node';
import { handlers } from './handlers';

export const server = setupServer(...handlers);
```

```ts title="test/setup.ts"
import { afterAll, afterEach, beforeAll } from 'vitest';
import { server } from './mocks/server';

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

`onUnhandledRequest: 'error'` evita que una prueba haga red real por accidente. `resetHandlers` elimina overrides temporales y conserva los handlers iniciales.

## Probar éxito y error

```tsx
it('muestra el perfil recibido', async () => {
  render(<UserProfile userId="u_1" />);

  expect(await screen.findByRole('heading', { name: 'Ana' })).toBeVisible();
});
```

```tsx
it('permite reintentar después de un error', async () => {
  server.use(
    http.get('/api/users/:id', () => {
      return HttpResponse.json(
        { code: 'TEMPORARY_FAILURE' },
        { status: 503 },
      );
    }),
  );

  const user = userEvent.setup();
  render(<UserProfile userId="u_1" />);

  expect(await screen.findByRole('alert')).toHaveTextContent(/intenta de nuevo/i);
  await user.click(screen.getByRole('button', { name: /reintentar/i }));
});
```

El caso todavía necesita decidir qué respuesta tendrá el segundo intento. Puedes usar un contador local en el handler o reemplazarlo antes del clic; mantén esa secuencia explícita.

## Inspeccionar request

```ts
http.post('/api/orders', async ({ request }) => {
  const body = await request.json() as { productId?: string };
  const authorization = request.headers.get('authorization');

  if (!authorization) {
    return HttpResponse.json({ code: 'UNAUTHORIZED' }, { status: 401 });
  }

  if (!body.productId) {
    return HttpResponse.json({ code: 'INVALID_BODY' }, { status: 400 });
  }

  return HttpResponse.json({ id: 'order_1' }, { status: 201 });
});
```

No dupliques todo el backend dentro del handler. Comprueba únicamente aspectos necesarios para que un request incorrecto no reciba éxito automáticamente.

## Latencia, red y respuestas inválidas

```ts
import { delay, http, HttpResponse } from 'msw';

server.use(
  http.get('/api/search', async () => {
    await delay(2000);
    return HttpResponse.json({ results: [] });
  }),
);
```

Prueba carga, cancelación, timeout, JSON inválido y status inesperados. Evita demoras reales largas en toda la suite; usa timers o una demora corta cuando solo importa el estado de carga.

## Navegador y Storybook

Los mismos handlers pueden alimentar desarrollo local, historias y pruebas. En navegador se genera un worker público y se inicia antes de la aplicación. No habilites mocks accidentalmente en producción; condiciona el import al entorno y comprueba el bundle.

## Errores frecuentes

- permitir request no manejado y llamar Internet desde CI;
- handler global que filtra estado entre tests;
- respuesta que no coincide con el contrato real;
- recrear lógica completa del servidor;
- interceptar el backend que un E2E pretende verificar;
- usar datos sensibles copiados de producción.

## Referencias

- [MSW: documentación](https://mswjs.io/docs/)
- [MSW: integración con Node](https://mswjs.io/docs/integrations/node/)
- [MSW: API de handlers HTTP](https://mswjs.io/docs/api/http/)
