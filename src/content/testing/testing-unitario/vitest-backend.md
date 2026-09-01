---
title: Vitest (backend)
description: Configurar Vitest para tests de Node/Express — setup de base de datos de test, mocks, y qué se testea sin Supertest.
type: libraries
order: 2
tags: [express, testing, vitest]
website: https://vitest.dev
install: npm install --save-dev vitest
related: [testing/testing-integracion/supertest]
updatedAt: 2026-08-28
---

Vitest no es exclusivo de frontend. Como runner para proyectos TypeScript y Node, sirve para probar servicios, repositorios y lógica de negocio de un backend Express. Esta guía cubre la configuración específica; para endpoints HTTP completos consulta [Supertest](/testing/testing-integracion/supertest).

## Config

```ts title="vitest.config.ts"
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
    setupFiles: ['./test/setup.ts'],
    restoreMocks: true,
  },
});
```

```json title="package.json"
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest"
  }
}
```

## Testear un service (sin tocar Express en absoluto)

La lógica de negocio, aislada en `services/` (consulta [estructura MVC](/backend/express/backend-mvc-structure)), se prueba directamente, sin levantar un servidor:

```ts title="services/users.service.test.ts"
import { describe, it, expect, vi } from 'vitest';
import { usersService } from './users.service';
import { usersRepository } from '../repositories/users.repository';

vi.mock('../repositories/users.repository');

describe('usersService.obtenerUsuario', () => {
  it('lanza 404 si el usuario no existe', async () => {
    vi.mocked(usersRepository.findById).mockResolvedValue(null);

    await expect(usersService.obtenerUsuario('id-inexistente')).rejects.toThrow('Usuario no encontrado');
  });

  it('devuelve el usuario si existe', async () => {
    vi.mocked(usersRepository.findById).mockResolvedValue({ id: '1', email: 'a@b.com' });

    const usuario = await usersService.obtenerUsuario('1');
    expect(usuario.email).toBe('a@b.com');
  });
});
```

`vi.mock()` reemplaza el repositorio real. Para dependencias importantes suele ser más explícito inyectar el repositorio al crear el servicio; así el test no depende del orden de carga de módulos.

```ts
const repository = {
  findById: vi.fn().mockResolvedValue(null),
};
const service = createUsersService({ repository });

await expect(service.getById('missing')).rejects.toMatchObject({
  code: 'USER_NOT_FOUND',
});
```

Comprueba un código o forma estable del error, no solo un mensaje que puede cambiar sin alterar el contrato.

## Base de datos de test (para tests de integración del repository)

Para probar el repositorio —incluyendo query, tipos y constraints— necesitas una base real, normalmente aislada por suite o worker:

```ts title="test/setup.ts"
import { beforeEach } from 'vitest';
import { prisma } from '../src/libs/prisma';

beforeEach(async () => {
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();
});
```

```bash title=".env.test"
DATABASE_URL=postgresql://localhost:5432/mibase_test
```

```json
{
  "scripts": {
    "test": "NODE_ENV=test vitest run"
  }
}
```

La limpieza debe respetar claves foráneas y paralelismo. Para suites grandes, considera un schema o contenedor por worker en lugar de eliminar todas las tablas antes de cada caso. La guía de [integración backend](/testing/testing-integracion/testing-backend-database) desarrolla estas estrategias.

## Probar errores del backend

Incluye timeout, dependencia rechazada, dato duplicado y operación abortada. En unitario, el fake produce el error; una prueba de integración confirma cómo llega desde la dependencia real.

```ts
repository.save.mockRejectedValue(
  Object.assign(new Error('duplicate'), { code: 'UNIQUE_VIOLATION' }),
);

await expect(service.create(input)).rejects.toMatchObject({
  code: 'EMAIL_ALREADY_EXISTS',
});
```

El servicio traduce un detalle de infraestructura a un error del dominio. Conserva una integración para verificar que el adapter reconoce el código real del motor.

## Resumen

| Nivel de test | Qué mockear |
| --- | --- |
| Service | Mockear el repository — no toca la base |
| Repository | Base de datos de test real, limpiada entre tests |
| Endpoint HTTP completo | Ver [Supertest](/testing/testing-integracion/supertest) |

## Consideraciones

- `environment: 'node'` evita simular un DOM inexistente en backend.
- Prueba servicios con dependencias controladas y repositorios con la base real.
- No compartas `DATABASE_URL` con desarrollo o producción.
- Usa identificadores únicos, cleanup seguro y timeouts explícitos.

## Referencias

- [Vitest: configuración](https://vitest.dev/config/)
- [Vitest: mocking](https://vitest.dev/guide/mocking)
