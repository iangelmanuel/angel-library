---
title: Testcontainers para Node.js
description: Levantar PostgreSQL, Redis u otros servicios reales en contenedores efímeros para pruebas de integración reproducibles y aisladas.
type: libraries
order: 3
tags: [testing, testcontainers, docker, database, integration]
website: https://node.testcontainers.org/
github: https://github.com/testcontainers/testcontainers-node
install: npm install --save-dev testcontainers @testcontainers/postgresql
related:
  - testing/testing-integracion/testing-backend-database
  - database/database-operacion/database-migraciones-backups
  - devops/docker-conceptos/docker-contenedores-vs-vms
updatedAt: 2026-08-28
---

Testcontainers inicia dependencias reales dentro de contenedores durante la suite. Permite probar contra la misma familia y versión de PostgreSQL, Redis, MongoDB o un broker sin exigir una instalación manual compartida.

## Cuándo aporta valor

- queries, constraints y transacciones específicas del motor;
- migraciones desde una base vacía;
- integración con Redis, colas o almacenamiento compatible;
- CI reproducible con una versión de imagen fijada;
- aislamiento frente a la base de desarrollo.

No es necesario para una función pura ni para cada test de servicio. El tiempo de arranque se amortiza compartiendo un contenedor por archivo o worker y aislando datos dentro de él.

## PostgreSQL con Vitest

```ts title="test/postgres.ts"
import { PostgreSqlContainer } from '@testcontainers/postgresql';

export async function startPostgres() {
  const container = await new PostgreSqlContainer('postgres:18-alpine')
    .withDatabase('app_test')
    .withUsername('test')
    .withPassword('test')
    .start();

  return {
    container,
    url: container.getConnectionUri(),
  };
}
```

Fija una versión compatible con producción. Una etiqueta flotante como `latest` puede cambiar el comportamiento de CI sin modificar el repositorio.

```ts title="test/repository.integration.test.ts"
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { startPostgres } from './postgres';

let stop: () => Promise<void>;
let repository: UserRepository;

beforeAll(async () => {
  const { container, url } = await startPostgres();
  stop = () => container.stop();

  await runMigrations(url);
  repository = createUserRepository(url);
}, 60_000);

afterAll(async () => {
  await repository.close();
  await stop();
});

it('protege la unicidad del correo', async () => {
  await repository.create({ email: 'same@example.test' });

  await expect(
    repository.create({ email: 'same@example.test' }),
  ).rejects.toMatchObject({ code: 'EMAIL_ALREADY_EXISTS' });
});
```

El timeout de arranque es diferente al timeout de una query. Si falla, conserva logs del contenedor para distinguir descarga, readiness, migración y prueba.

## Esperar readiness

Testcontainers conoce estrategias de espera para muchos módulos. No uses un `sleep` fijo: un equipo rápido desperdicia tiempo y uno lento falla. Espera puerto, health check o mensaje de log que realmente indique disponibilidad.

## Reutilización e aislamiento

| Alcance | Costo | Aislamiento |
| --- | --- | --- |
| contenedor por test | alto | máximo |
| por archivo/suite | medio | requiere cleanup entre casos |
| por worker | bajo | schema o DB única por worker |
| global | mínimo | mayor riesgo de estado compartido |

Empieza por suite o worker. Cada test crea datos únicos y limpia, hace rollback o usa un schema propio. El contenedor aislado no evita colisiones dentro de la misma instancia.

## Migraciones y seeds

Ejecuta migraciones reales después del arranque. Un `createTablesForTest()` alternativo puede divergir de producción. Seeds de prueba deben ser pequeños y explícitos; la factory crea el resto por caso.

Prueba también actualizar desde una versión anterior cuando el cambio sea riesgoso. Un contenedor vacío solo demuestra instalación limpia.

## Servicios genéricos

```ts
import { GenericContainer } from 'testcontainers';

const redis = await new GenericContainer('redis:8-alpine')
  .withExposedPorts(6379)
  .start();

const url = `redis://${redis.getHost()}:${redis.getMappedPort(6379)}`;
```

Los puertos son dinámicos; nunca asumas `localhost:6379`. Obtén host y puerto del contenedor y pásalos al SUT.

## CI y seguridad

- el runner necesita un runtime de contenedores compatible;
- fija imágenes y controla su procedencia;
- no inyectes secretos reales en contenedores de prueba;
- limita concurrencia según CPU, RAM y disco;
- conserva logs al fallar y detén recursos en teardown;
- evita reutilización entre repositorios no confiables.

## Errores frecuentes

- arrancar un contenedor por `it` sin necesidad;
- usar `latest` y obtener cambios sorpresa;
- olvidar migraciones o extensiones;
- hacer sleep en vez de readiness;
- no cerrar pool antes de detener la base;
- asumir que Docker local y CI tienen recursos idénticos.

## Referencias

- [Testcontainers for Node.js](https://node.testcontainers.org/)
- [Módulo PostgreSQL](https://node.testcontainers.org/modules/postgresql/)
- [Guía oficial de inicio con Node.js](https://testcontainers.com/guides/getting-started-with-testcontainers-for-nodejs/)
