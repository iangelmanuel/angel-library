---
title: Testing de integración backend y base de datos
description: Probar la frontera HTTP con persistencia real, aislar datos y verificar transacciones, permisos e idempotencia sin mocks engañosos.
category: testing
stack: testing-integracion
order: 3
tags: [testing, backend, database, integration, api]
related:
  - guides/testing-strategy
  - libraries/supertest
  - guides/database-migraciones-backups
updatedAt: 2026-08-25
---

Una prueba de integración verifica que varias piezas reales colaboran: router, validación, caso de uso, ORM y base. Es más lenta que una unitaria, pero detecta errores de schema, SQL, serialización y transacción que un mock no reproduce.

## Caso representativo

```ts
it('crea una orden y descuenta inventario de forma atómica', async () => {
  const product = await factory.product({ stock: 2 });

  const response = await request(app)
    .post('/orders')
    .set('Authorization', await tokenFor(user))
    .send({ productId: product.id, quantity: 2 });

  expect(response.status).toBe(201);
  await expect(db.product.findUnique({ where: { id: product.id } }))
    .resolves.toMatchObject({ stock: 0 });
});
```

La aserción cruza HTTP y estado persistido. Añade un caso donde una segunda escritura falla para demostrar rollback, no solo éxito.

## Base real y aislada

Usa el mismo motor que producción cuando dependes de constraints, JSON, aislamiento o SQL específico. SQLite en memoria puede ser útil, pero no sustituye PostgreSQL si su semántica es parte del comportamiento.

Opciones de aislamiento:

- base o schema por suite;
- transacción revertida por test, si el código comparte conexión;
- truncado controlado entre casos;
- contenedor efímero por worker o pipeline.

No permitas que tests apunten a producción. La URL debe validarse y los permisos de la cuenta de test limitar daño.

## Datos deterministas

Factories crean solo lo necesario. Usa identificadores únicos y reloj inyectable. Evita depender del orden de tests o de seeds gigantes cuyo estado nadie entiende.

## Qué probar

- status, headers y body del contrato;
- validación de params/query/body;
- `401`, `403` y ownership entre usuarios;
- restricciones únicas y foreign keys;
- commit/rollback;
- paginación y orden estable;
- idempotencia y requests duplicadas;
- migración desde una versión soportada.

## Transacciones e idempotencia

Una operación es atómica cuando confirma todos sus cambios o ninguno. Fuerza un error después de la primera escritura y comprueba que no queda estado parcial. Para endpoints reintentables, envía dos veces la misma clave de idempotencia y verifica que existe un solo efecto.

```ts
it('no duplica una orden al repetir la misma solicitud', async () => {
  const key = crypto.randomUUID();
  const payload = { productId: product.id, quantity: 1 };

  const first = await request(app).post('/orders').set('Idempotency-Key', key).send(payload);
  const second = await request(app).post('/orders').set('Idempotency-Key', key).send(payload);

  expect(second.body.id).toBe(first.body.id);
  await expect(db.order.count({ where: { idempotencyKey: key } })).resolves.toBe(1);
});
```

La clave identifica la intención del cliente; no debe reutilizarse para operaciones diferentes. Define cuánto tiempo se conserva y qué respuesta recibe un request concurrente.

## Migraciones

Prueba una base vacía y, cuando el riesgo lo justifique, una copia sanitizada del schema anterior. Una migración debe poder ejecutarse con el volumen esperado, conservar datos y permitir una estrategia de rollback o despliegue compatible. `NOT NULL`, índices únicos y cambios de tipo merecen datos que violen el nuevo supuesto.

## Mocks donde sí aportan

Simula proveedores externos lentos o costosos en la mayoría de casos y conserva algunos tests de contrato contra sandbox. No mockees el repository en una prueba cuyo objetivo es verificar persistencia.

## CI confiable

Aplica migraciones desde cero, espera readiness de la base y conserva logs al fallar. Paraleliza solo con aislamiento de datos. Una retry automática puede ocultar flakiness; primero diagnostica la causa.
