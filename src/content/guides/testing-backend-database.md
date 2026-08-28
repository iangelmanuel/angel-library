---
title: Testing de integración backend y base de datos
description: Probar la frontera HTTP con persistencia real, aislar datos y verificar transacciones, permisos e idempotencia sin mocks engañosos.
category: testing
stack: testing-integracion
order: 2
tags: [testing, backend, database, integration, api]
related:
  - guides/testing-strategy
  - libraries/supertest
  - guides/database-migraciones-backups
updatedAt: 2026-08-28
---

Una prueba de integración verifica que varias piezas reales colaboran: router, validación, caso de uso, ORM y base. Es más lenta que una unitaria, pero detecta errores de schema, SQL, serialización y transacción que un mock no reproduce.

## Define el alcance

| Alcance | Conserva real | Puede sustituir |
| --- | --- | --- |
| repositorio | driver/ORM + base | HTTP y proveedores |
| caso de uso | servicio + repositorio + base | correo, pagos, reloj |
| API | middleware + ruta + servicio + base | terceros externos |

Escribe en el nombre o carpeta qué frontera prueba. “Integración” sin alcance produce setups enormes y aserciones poco claras.

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

```ts
function assertSafeTestDatabase(url: string) {
  const parsed = new URL(url);
  if (!parsed.pathname.endsWith('_test') || process.env.NODE_ENV !== 'test') {
    throw new Error('La base de pruebas no es segura');
  }
}
```

El sufijo no es una garantía completa, pero añade una barrera. Usa credenciales sin acceso a otros entornos y red separada.

## Contenedor o servicio compartido

Un contenedor efímero entrega versión y configuración reproducibles. Un servicio compartido arranca más rápido, pero puede filtrar datos entre suites. Consulta [Testcontainers](/libraries/testcontainers-node) para un ejemplo con PostgreSQL.

| Opción | Inicio | Aislamiento | Fidelidad |
| --- | --- | --- | --- |
| fake/in-memory | muy rápido | alto | baja para SQL real |
| SQLite sustituto | rápido | alto | distinta semántica si producción usa PostgreSQL |
| base compartida | rápido | depende del cleanup | alta, estado variable |
| contenedor | medio | alto | alta y versionada |

## Datos deterministas

Factories crean solo lo necesario. Usa identificadores únicos y reloj inyectable. Evita depender del orden de tests o de seeds gigantes cuyo estado nadie entiende.

Prepara por API de soporte o directamente por repositorio según el objetivo. Si estás probando la creación por HTTP, no uses ese mismo endpoint para preparar todas sus precondiciones: un fallo de setup ocultará la conducta observada.

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

## Concurrencia

Ejecuta solicitudes simultáneas cuando la regla depende de competencia:

```ts
const [first, second] = await Promise.all([
  reserveLastUnit(product.id, userA.id),
  reserveLastUnit(product.id, userB.id),
]);

expect([first.ok, second.ok].sort()).toEqual([false, true]);
expect(await stockOf(product.id)).toBe(0);
```

El test debe pasar repetidamente y demostrar la invariante persistida. Si solo prueba una secuencia, no reproduce la carrera.

## Migraciones

Prueba una base vacía y, cuando el riesgo lo justifique, una copia sanitizada del schema anterior. Una migración debe poder ejecutarse con el volumen esperado, conservar datos y permitir una estrategia de rollback o despliegue compatible. `NOT NULL`, índices únicos y cambios de tipo merecen datos que violen el nuevo supuesto.

Incluye dos rutas: instalación limpia desde cero y actualización desde la versión soportada. Verifica constraints, extensiones y seeds mínimos después de migrar; “el comando terminó” no demuestra que la aplicación pueda usar el esquema.

## Mocks donde sí aportan

Simula proveedores externos lentos o costosos en la mayoría de casos y conserva algunos tests de contrato contra sandbox. No mockees el repository en una prueba cuyo objetivo es verificar persistencia.

## CI confiable

Aplica migraciones desde cero, espera readiness de la base y conserva logs al fallar. Paraleliza solo con aislamiento de datos. Una retry automática puede ocultar flakiness; primero diagnostica la causa.

## Fallos que merece reproducir

- unicidad y FK violadas;
- deadlock o serialización reintentable;
- timeout y conexión agotada;
- rollback después de una escritura parcial;
- réplica atrasada si existe lectura separada;
- payload mayor al límite;
- caída durante un job reanudable.

No todos deben ejecutarse en cada PR. Conserva un núcleo rápido y programa escenarios costosos, pero registra resultados y evita que la suite programada quede ignorada.
