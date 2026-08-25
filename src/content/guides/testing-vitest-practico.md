---
title: Vitest práctico — estructura, async, mocks y cobertura
description: Escribir pruebas unitarias legibles con aislamiento deliberado, timers, errores asíncronos y cobertura usada como señal, no como objetivo vacío.
category: testing
stack: testing-unitario
order: 1
tags: [testing, vitest, unit-testing, mocks, coverage]
related:
  - libraries/vitest-backend
  - guides/testing-strategy
  - guides/testing-doubles-contracts
updatedAt: 2026-08-25
---

Una prueba unitaria comprueba una regla pequeña con dependencias controladas. No significa necesariamente “una función”; la unidad es el comportamiento que puede entenderse y aislarse con valor.

```ts
import { describe, expect, it } from 'vitest';

describe('calculateDiscount', () => {
  it('limita el descuento al total de la compra', () => {
    expect(calculateDiscount({ total: 20, coupon: 30 })).toBe(20);
  });
});
```

El nombre describe condición y resultado. Organiza datos con Arrange, Act, Assert cuando mejore la lectura, sin comentarios repetitivos.

## Tabla de consulta

| Necesidad | API |
| --- | --- |
| agrupar casos | `describe` |
| preparar/limpiar | `beforeEach` / `afterEach` |
| comprobar valor | `expect` |
| espiar o simular función | `vi.fn` / `vi.spyOn` |
| sustituir módulo | `vi.mock` |
| controlar reloj | `vi.useFakeTimers` |
| repetir entradas | `it.each` |

Empieza con el resultado observable. Usa hooks para estado compartido pequeño; una preparación oculta de cien líneas dificulta entender cada caso.

## Código asíncrono

```ts
it('rechaza una cuenta inexistente', async () => {
  await expect(loadAccount('missing')).rejects.toMatchObject({
    code: 'ACCOUNT_NOT_FOUND',
  });
});
```

Devuelve o espera la promesa. Si se omite `await`, la prueba puede terminar antes de la aserción.

## Varios casos con `it.each`

Una tabla evita copiar la misma estructura y hace visibles los límites. Cada fila debe representar una razón distinta, no una lista enorme sin intención.

```ts
it.each([
  { subtotal: 0, rate: 0.2, expected: 0 },
  { subtotal: 100, rate: 0, expected: 100 },
  { subtotal: 100, rate: 0.2, expected: 80 },
])('calcula $expected para $subtotal con tasa $rate', ({ subtotal, rate, expected }) => {
  expect(applyDiscount(subtotal, rate)).toBe(expected);
});
```

Si un caso necesita una preparación o explicación diferente, merece un `it` separado con un nombre más descriptivo.

## Mocks con propósito

```ts
const send = vi.fn().mockResolvedValue({ id: 'mail_1' });
const service = createInviteService({ email: { send } });

await service.invite(user);

expect(send).toHaveBeenCalledWith(expect.objectContaining({ to: user.email }));
```

Simula límites lentos o no deterministas, no cada función interna. Si una refactorización válida rompe todas las pruebas, probablemente se están comprobando detalles de implementación.

## Tiempo y limpieza

Usa timers falsos cuando el tiempo es parte del comportamiento y restáuralos después. Limpia mocks y estado global entre pruebas. Una prueba debe poder ejecutarse sola, en otro orden y en paralelo cuando el sistema lo permita.

```ts
afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});
```

Prefiere inyectar reloj o dependencia antes de mockear globals ampliamente. Si usas snapshots, revisa el cambio; actualizarlos sin leer convierte una regresión en nueva expectativa.

```ts
it('expira la sesión después de treinta minutos', () => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2026-08-25T12:00:00Z'));

  const session = createSession();
  vi.advanceTimersByTime(30 * 60 * 1000);

  expect(session.isExpired()).toBe(true);
});
```

`vi.spyOn` conserva la implementación hasta que la reemplazas; `vi.fn` crea una función controlada. `vi.mock` sustituye un módulo completo y se eleva —*hoisting*— durante la transformación, por lo que conviene usarlo solo en fronteras claras y restaurar estado entre casos.

## Aserciones que comunican intención

Prefiere `toEqual` para estructuras, `toBe` para identidad o primitivos, `toMatchObject` para una parte relevante y `toThrow`/`rejects` para errores. Evita afirmar solo que “algo existe” si el contrato exige un valor, código o efecto concreto.

## Cobertura

La cobertura señala líneas y ramas no ejecutadas, pero 100 % no demuestra buenos casos. Revisa especialmente permisos, errores, límites, condiciones y transformaciones críticas. Una línea cubierta sin una aserción útil aporta confianza falsa.

## Caso de aprendizaje

Escribe primero un caso feliz, después límite y error. Muta temporalmente el código para confirmar que cada prueba puede fallar por la razón esperada. Una prueba que nunca viste fallar todavía no demostró que protege el comportamiento.

## Referencias

- [Vitest: mocking](https://vitest.dev/guide/mocking)
- [Vitest: coverage](https://vitest.dev/guide/coverage)

