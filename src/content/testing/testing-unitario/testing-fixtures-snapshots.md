---
title: Datos de prueba, factories, fixtures y snapshots
description: Preparar datos legibles y aislados con builders y fixtures, decidir cuándo usar snapshots y evitar suites frágiles por estado compartido.
type: guides
order: 3
tags: [testing, fixtures, factories, snapshots, test-data]
related:
  - testing/testing-unitario/testing-vitest-practico
  - testing/testing-fundamentos/testing-test-design-techniques
  - testing/testing-integracion/testing-backend-database
updatedAt: 2026-08-28
---

Los datos de prueba deben mostrar por qué un caso es especial. Una fixture gigantesca con veinte campos irrelevantes oculta la regla; datos mínimos y defaults válidos dejan visible la diferencia que activa el comportamiento.

## Conceptos

| Término | Propósito |
| --- | --- |
| Fixture | estado preparado para ejecutar una prueba |
| Factory | función que crea una entidad válida |
| Builder | API que construye variantes de forma legible |
| Seed | conjunto inicial para un ambiente o suite |
| Golden file | archivo con salida esperada revisable |
| Snapshot | representación guardada que se compara en ejecuciones futuras |

Una factory puede producir una fixture; no todos los equipos usan los nombres igual. Lo importante es el alcance, el dueño y la limpieza.

## Factory con defaults válidos

```ts
type User = {
  id: string;
  email: string;
  role: 'member' | 'admin';
  active: boolean;
};

let sequence = 0;

export function userFactory(overrides: Partial<User> = {}): User {
  sequence += 1;
  return {
    id: `user_test_${sequence}`,
    email: `user-${sequence}@example.test`,
    role: 'member',
    active: true,
    ...overrides,
  };
}
```

```ts
it('impide administrar a un miembro', () => {
  const user = userFactory({ role: 'member' });

  expect(canManageUsers(user)).toBe(false);
});
```

El override comunica la condición. Mantén defaults realistas y actualiza la factory cuando cambia una regla obligatoria. No uses aleatoriedad no reproducible para todo; identificadores secuenciales o UUID controlados suelen bastar.

## Builder para estados complejos

```ts
const order = orderBuilder()
  .withStatus('paid')
  .withItem({ priceCents: 5000, quantity: 2 })
  .withCoupon({ percent: 10 })
  .build();
```

Un builder ayuda cuando existen estados válidos con muchas relaciones. Cada método debe representar lenguaje del dominio. Evita builders que permitan combinaciones imposibles solo para que el test compile.

## Fixtures con ciclo de vida

Una fixture también administra recursos:

```ts
import { test as base } from 'vitest';

export const test = base.extend<{
  project: { id: string; name: string };
}>({
  project: async ({}, use) => {
    const project = await db.project.create({
      data: { name: 'Proyecto de prueba' },
    });

    await use(project);

    await db.project.delete({ where: { id: project.id } });
  },
});
```

El código antes de `use` prepara; el posterior limpia. El alcance por test ofrece mayor aislamiento. Compartir por archivo o worker reduce costo, pero exige que los tests no modifiquen estado común de manera incompatible.

## Estrategias para datos persistidos

| Estrategia | Ventaja | Riesgo |
| --- | --- | --- |
| transacción + rollback | rápida y limpia | no funciona si la app usa otras conexiones |
| truncar tablas | estado conocido | costoso y sensible a FK/paralelismo |
| IDs únicos | permite paralelo | acumula datos si no hay limpieza |
| schema por worker | buen aislamiento | configuración y migraciones adicionales |
| contenedor por suite | motor real reproducible | tiempo de arranque y Docker |

No uses una base compartida sin nombres únicos y cleanup. Valida que la URL sea de test antes de ejecutar operaciones destructivas.

## Reloj, zona horaria y random

```ts
it('vence al terminar el día en la zona del negocio', () => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2026-08-28T23:59:59-05:00'));

  expect(isCouponActive(coupon)).toBe(true);

  vi.advanceTimersByTime(1000);
  expect(isCouponActive(coupon)).toBe(false);
});
```

Restaura timers después de cada caso. Para lógica crítica de zonas horarias, añade ejemplos en cambios de día, mes y horario de verano cuando la región lo utilice. Un fake timer no reproduce todos los detalles del runtime.

## Snapshots

Un snapshot guarda una salida y falla cuando cambia. Es útil para estructuras estables, serializadores, AST, emails o mensajes largos donde el diff es la señal principal.

```ts
expect(renderInvoice(invoice)).toMatchInlineSnapshot(`
  "Invoice INV-42
  Total: $50.00
  Status: paid"
`);
```

No es apropiado para un árbol enorme de UI que cambia por detalles irrelevantes. Un snapshot grande falla mucho y rara vez explica qué contrato se rompió.

### Snapshot útil

- pequeño y nombrado;
- salida determinista;
- sin timestamps, IDs ni orden aleatorio;
- diff entendible;
- revisado como código.

### Snapshot peligroso

- se actualiza con `-u` sin leer;
- contiene toda la página;
- reemplaza aserciones de permisos o cálculos;
- cambia por formato no relevante;
- incluye secretos o datos personales.

## Golden files y regresión de parsers

Para un compilador, importador o transformador, conserva entradas y salidas en archivos:

```text
fixtures/
├── invoice-valid/input.csv
├── invoice-valid/expected.json
├── invoice-invalid/input.csv
└── invoice-invalid/error.txt
```

El archivo facilita casos reales y diffs. Documenta cómo regenerarlo y revisa cambios. Si el oráculo se genera con el mismo código bajo prueba, solo confirma su comportamiento actual.

## Antipatrones

- seed global que cada test muta;
- fixture con datos de producción sin anonimizar;
- factory que consulta red o reloj sin control;
- cleanup que oculta el fallo original;
- `beforeEach` enorme con estado no usado;
- snapshots actualizados en masa para “poner verde” CI.

## Lista de comprobación

- el dato diferente está visible en el test;
- defaults cumplen reglas reales;
- IDs, reloj y random son reproducibles;
- cada recurso tiene alcance y cleanup;
- paralelismo no comparte estado mutable;
- snapshots son pequeños y revisables;
- ningún fixture contiene secretos o datos reales.

## Referencias

- [Vitest: contexto y fixtures](https://vitest.dev/guide/test-context)
- [Vitest: snapshots](https://vitest.dev/guide/snapshot.html)
- [Playwright: fixtures](https://playwright.dev/docs/test-fixtures)
