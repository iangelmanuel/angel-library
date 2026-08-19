---
title: React Testing Library — probar como una persona usuaria
description: Consultar por rol y nombre, simular interacción realista y comprobar estados accesibles sin acoplarse al DOM interno.
category: testing
stack: react
order: 1
tags: [testing, react, testing-library, user-event, accessibility]
related:
  - guides/react-fundamentos-componentes
  - guides/testing-strategy
  - guides/accessibility-testing-manual-automatico
updatedAt: 2026-08-19
---

React Testing Library renderiza componentes y favorece consultas cercanas a cómo una persona encuentra la interfaz. La prueba se enfoca en texto, roles, nombres accesibles y estados, no en instancias o métodos internos.

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

it('envía una búsqueda válida', async () => {
  const user = userEvent.setup();
  const onSearch = vi.fn();
  render(<SearchForm onSearch={onSearch} />);

  await user.type(screen.getByRole('textbox', { name: /buscar/i }), 'astro');
  await user.click(screen.getByRole('button', { name: /buscar/i }));

  expect(onSearch).toHaveBeenCalledWith('astro');
});
```

## Prioridad de consultas

1. `getByRole` con nombre accesible.
2. Etiqueta, placeholder o texto cuando representan el uso real.
3. `getByTestId` como último recurso para elementos sin semántica consultable.

Si no puedes encontrar un botón por rol y nombre, revisa primero su accesibilidad.

## Consultas síncronas y asíncronas

- `getBy...` espera que exista ahora y lanza si no.
- `queryBy...` permite afirmar ausencia.
- `findBy...` espera a que aparezca por una actualización asíncrona.

```tsx
await user.click(screen.getByRole('button', { name: /guardar/i }));
expect(await screen.findByText(/cambios guardados/i)).toBeVisible();
```

Evita `waitFor` alrededor de acciones que pueden esperarse directamente. No uses retrasos arbitrarios.

## Qué simular

Los componentes pueden probar lógica visual con handlers o un servidor simulado de red. No simules React ni el DOM. Para confirmar integración real con routing, servidor y navegador, conserva pocos flujos E2E.

## Referencias

- [Testing Library: introducción](https://testing-library.com/docs/react-testing-library/intro/)
- [Testing Library: queries](https://testing-library.com/docs/queries/about/)

