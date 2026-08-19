---
title: Vitest (backend)
description: Configurar Vitest para tests de Node/Express — setup de base de datos de test, mocks, y qué se testea sin Supertest.
category: testing
stack: testing-unitario
order: 2
tags: [express, testing, vitest]
website: https://vitest.dev
install: npm install --save-dev vitest
related: [libraries/supertest]
updatedAt: 2026-08-16
---

Vitest no es exclusivo de frontend — como test runner general para proyectos TypeScript/Node, sirve igual para testear services, repositories y lógica de negocio de un backend Express. Esta guía es la config específica para ese contexto; para testear los endpoints HTTP en sí, ver [Supertest](/libraries/supertest).

## Config

```ts title="vitest.config.ts"
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node', // no 'jsdom' — no hay DOM en un backend
    globals: true,        // usar describe/it/expect sin importarlos en cada archivo
    setupFiles: ['./test/setup.ts'],
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

La lógica de negocio, aislada en `services/` (ver [estructura MVC](/patterns/backend-mvc-structure)), se testea directo, sin levantar ningún servidor:

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

`vi.mock()` reemplaza el repository real por uno simulado — el test corre sin necesitar una base de datos real, y es rápido porque no hace ninguna llamada de red o disco.

## Base de datos de test (para tests de integración del repository)

Para testear el repository en sí (que la query de Prisma realmente hace lo esperado), hace falta una base real — típicamente una base de test separada, limpiada entre tests:

```ts title="test/setup.ts"
import { beforeEach } from 'vitest';
import { prisma } from '../src/lib/prisma';

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

## Resumen

| Nivel de test | Qué mockear |
| --- | --- |
| Service | Mockear el repository — no toca la base |
| Repository | Base de datos de test real, limpiada entre tests |
| Endpoint HTTP completo | Ver [Supertest](/libraries/supertest) |

## Consideraciones

- `environment: 'node'` (no `'jsdom'`) es la diferencia principal frente a un setup de Vitest para frontend — sin DOM que simular, arranca más rápido.
- Testear el service con el repository mockeado y el repository con una base de test real es la pirámide típica: muchos tests rápidos de service, menos tests de integración de repository (más lentos, tocan disco/red).
