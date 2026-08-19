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
updatedAt: 2026-08-19
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

## Código asíncrono

```ts
it('rechaza una cuenta inexistente', async () => {
  await expect(loadAccount('missing')).rejects.toMatchObject({
    code: 'ACCOUNT_NOT_FOUND',
  });
});
```

Devuelve o espera la promesa. Si se omite `await`, la prueba puede terminar antes de la aserción.

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

## Cobertura

La cobertura señala líneas y ramas no ejecutadas, pero 100 % no demuestra buenos casos. Revisa especialmente permisos, errores, límites, condiciones y transformaciones críticas. Una línea cubierta sin una aserción útil aporta confianza falsa.

## Referencias

- [Vitest: mocking](https://vitest.dev/guide/mocking)
- [Vitest: coverage](https://vitest.dev/guide/coverage)

