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
updatedAt: 2026-08-25
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

## Tabla de consultas

| Consulta | Úsala cuando |
| --- | --- |
| `getBy*` | debe existir ahora |
| `queryBy*` | compruebas que no existe |
| `findBy*` | aparecerá de forma asíncrona |
| `getAllBy*` | esperas varios ahora |
| `within` | limitas la búsqueda a una región |

`getByRole` puede filtrar por `name`, `selected`, `checked` o `expanded`. Eso permite probar el estado accesible, no clases CSS.

## Consultas síncronas y asíncronas

- `getBy...` espera que exista ahora y lanza si no.
- `queryBy...` permite afirmar ausencia.
- `findBy...` espera a que aparezca por una actualización asíncrona.

```tsx
await user.click(screen.getByRole('button', { name: /guardar/i }));
expect(await screen.findByText(/cambios guardados/i)).toBeVisible();
```

Evita `waitFor` alrededor de acciones que pueden esperarse directamente. No uses retrasos arbitrarios.

```tsx
await user.click(screen.getByRole('button', { name: /abrir filtros/i }));
const dialog = await screen.findByRole('dialog', { name: /filtros/i });
expect(within(dialog).getByRole('checkbox', { name: /astro/i })).toBeChecked();
```

## Qué simular

Los componentes pueden probar lógica visual con handlers o un servidor simulado de red. No simules React ni el DOM. Para confirmar integración real con routing, servidor y navegador, conserva pocos flujos E2E.

## Formularios, validación y foco

Prueba el recorrido completo del teclado y la información que recibe la persona, no el estado interno del formulario.

```tsx
it('explica el error y mueve el foco al campo inválido', async () => {
  const user = userEvent.setup();
  render(<SignupForm />);

  await user.click(screen.getByRole('button', { name: /crear cuenta/i }));

  const email = screen.getByRole('textbox', { name: /correo/i });
  expect(email).toHaveFocus();
  expect(email).toHaveAccessibleDescription(/correo obligatorio/i);
});
```

Un texto visible no garantiza que el campo esté relacionado con el error. `toHaveAccessibleDescription` comprueba la relación accesible que normalmente se crea con `aria-describedby`.

## Contextos y providers

Si muchos componentes necesitan router, tema o cliente de datos, crea un `renderWithProviders` pequeño. Permite opciones por prueba y evita un provider global con estado compartido.

```tsx
function renderWithProviders(ui: React.ReactNode, { user = anonymousUser } = {}) {
  return render(<AuthProvider initialUser={user}>{ui}</AuthProvider>);
}
```

Prueba al menos estado inicial, éxito, carga, vacío y error cuando sean observables. Para red, un servidor simulado que intercepte HTTP representa mejor el contrato que mockear el hook interno del componente.

## Errores frecuentes

- usar `container.querySelector` cuando existe una consulta semántica;
- disparar eventos de bajo nivel en vez de `userEvent`;
- probar que se llamó una función interna sin comprobar UI;
- envolver todo en `waitFor` y ocultar la causa;
- compartir mocks que filtran estado entre casos.

Una buena prueba explica la historia de una persona: encuentra control, actúa y observa un resultado o recuperación.

## Referencias

- [Testing Library: introducción](https://testing-library.com/docs/react-testing-library/intro/)
- [Testing Library: queries](https://testing-library.com/docs/queries/about/)

