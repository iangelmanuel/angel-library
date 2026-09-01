---
title: Vitest práctico — estructura, async, mocks y cobertura
description: Escribir pruebas unitarias legibles con aislamiento deliberado, timers, errores asíncronos y cobertura usada como señal, no como objetivo vacío.
type: guides
order: 1
tags: [testing, vitest, unit-testing, mocks, coverage]
related:
  - testing/testing-unitario/vitest-backend
  - testing/testing-fundamentos/testing-strategy
  - testing/testing-integracion/testing-doubles-contracts
updatedAt: 2026-08-28
---

Una prueba unitaria comprueba una regla pequeña con dependencias controladas. No significa necesariamente “una función”; la unidad es el comportamiento que puede entenderse y aislarse con valor.

## Inicio rápido

```ts title="vitest.config.ts"
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
    restoreMocks: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
    },
  },
});
```

`environment` define las APIs disponibles. Usa `node` para backend o lógica pura, `jsdom`/`happy-dom` cuando necesitas una simulación ligera del DOM y Browser Mode cuando el comportamiento depende de un navegador real. No agregues DOM a toda la suite por comodidad: hace más lento el feedback y puede esconder diferencias del runtime.

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
| ejecutar solo una prueba temporalmente | `it.only` |
| marcar pendiente con explicación | `it.skip` / `it.todo` |
| medir cobertura | `vitest run --coverage` |

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

### Stub, spy y mock en Vitest

```ts
const gateway = { charge: async () => ({ id: 'real' }) };
const spy = vi.spyOn(gateway, 'charge').mockResolvedValue({ id: 'pay_test' });

await checkout(cart, gateway);

expect(spy).toHaveBeenCalledOnce();
expect(spy).toHaveBeenCalledWith({ amountCents: 5000 });
```

La respuesta preparada actúa como stub; el registro de llamadas actúa como spy. “Mock” se usa de forma amplia en muchas herramientas, por eso conviene explicar qué comportamiento necesitas en vez de discutir solo el nombre.

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

Si modificas `process.env`, módulos cacheados o globals, restaura su valor. `clearAllMocks` limpia historial de llamadas; `resetAllMocks` también reinicia implementaciones; `restoreAllMocks` restaura spies. No son equivalentes.

## Ejecución concurrente

Vitest distribuye archivos entre workers. Una prueba que comparte puerto, archivo, base o variable global puede fallar únicamente bajo paralelismo. Genera recursos únicos y evita que `beforeAll` cree un estado mutable para casos independientes.

Usa `it.concurrent` solo cuando la unidad y sus dependencias sean seguras. Si desactivar paralelismo “arregla” la suite, identifica primero la colisión.

## Aserciones que comunican intención

Prefiere `toEqual` para estructuras, `toBe` para identidad o primitivos, `toMatchObject` para una parte relevante y `toThrow`/`rejects` para errores. Evita afirmar solo que “algo existe” si el contrato exige un valor, código o efecto concreto.

## Cobertura

La cobertura señala líneas y ramas no ejecutadas, pero 100 % no demuestra buenos casos. Revisa especialmente permisos, errores, límites, condiciones y transformaciones críticas. Una línea cubierta sin una aserción útil aporta confianza falsa.

| Métrica | Pregunta aproximada |
| --- | --- |
| statements | ¿se ejecutaron sentencias? |
| branches | ¿se recorrieron decisiones alternativas? |
| functions | ¿se invocaron funciones? |
| lines | ¿se ejecutaron líneas instrumentadas? |

Una rama suele revelar más que una línea cuando existen permisos, valores nulos o errores. Configura umbrales para evitar caídas accidentales, no para incentivar pruebas vacías.

## Browser Mode

Vitest Browser Mode ejecuta pruebas dentro de un navegador mediante un proveedor. Es útil para componentes y APIs web que una simulación de DOM no representa. No reemplaza E2E: normalmente prueba módulos o componentes servidos por Vite, mientras Playwright E2E recorre la aplicación desplegada.

## Caso de aprendizaje

Escribe primero un caso feliz, después límite y error. Muta temporalmente el código para confirmar que cada prueba puede fallar por la razón esperada. Una prueba que nunca viste fallar todavía no demostró que protege el comportamiento.

## Referencias

- [Vitest: mocking](https://vitest.dev/guide/mocking)
- [Vitest: coverage](https://vitest.dev/guide/coverage)
- [Vitest: Browser Mode](https://vitest.dev/guide/browser/)
- [Vitest: contexto y fixtures](https://vitest.dev/guide/test-context)

