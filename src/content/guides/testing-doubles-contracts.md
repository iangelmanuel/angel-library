---
title: Mocks, fakes y tests de contrato
description: Elegir dobles de prueba sin acoplarse a la implementación y comprobar que APIs, adapters y consumidores siguen de acuerdo.
category: testing
stack: testing-integracion
order: 1
tags: [testing, mocks, contracts, integration]
scope: diseño de pruebas
related:
  - guides/testing-strategy
  - practices/validate-at-boundaries
updatedAt: 2026-08-18
---

## Tipos de dobles

- **Stub:** devuelve respuestas preparadas.
- **Spy:** registra llamadas para una afirmación puntual.
- **Mock:** exige una interacción específica.
- **Fake:** implementación simplificada, como un repositorio en memoria.

Prefiere afirmar resultados observables. Verificar cada llamada interna congela el refactor aunque el comportamiento no cambie.

## Qué sí reemplazar

Reloj, random, email, pagos y APIs lentas/no deterministas son buenos límites. No simules la unidad que quieres probar: un test de repositorio con la DB mockeada no prueba queries ni constraints.

## Contratos

Un contrato comprueba que productor y consumidor coinciden en método, ruta, esquema, errores y compatibilidad. Puede validarse contra OpenAPI/JSON Schema y complementarse con una prueba real del adapter.

Incluye casos de tiempo de espera agotado, `429`, errores parciales y campos adicionales. Los contratos deben permitir evolución compatible y fallar cuando desaparece algo que el consumidor usa.

```ts
it('mantiene el contrato del perfil público', async () => {
  const response = await request(app).get('/users/u_1');

  expect(response.status).toBe(200);
  expect(response.headers['content-type']).toMatch(/application\/json/);
  expect(response.body).toMatchObject({
    id: expect.any(String),
    displayName: expect.any(String),
  });
  expect(response.body).not.toHaveProperty('passwordHash');
});
```

El ejemplo comprueba forma, semántica HTTP y ausencia de un dato sensible. Un schema automatiza la forma, pero todavía necesitas casos que expliquen permisos, errores y significado de los campos.

## Datos

Builders con defaults válidos reducen ruido; cada test sobrescribe solo lo relevante. Evita fixtures gigantes compartidas: ocultan por qué el caso pasa y vuelven frágil cualquier cambio de schema.

## Ejemplo de elección

Para probar un servicio que envía un correo, usa un fake de repositorio en el test unitario y un spy del mailer para comprobar que se solicita el envío correcto. En una prueba de integración, usa la base real y un servidor de correo de prueba. Así verificas la regla de negocio, la persistencia y el adapter sin exigir que cada test sea E2E.

El mock es útil cuando una interacción es parte explícita del contrato —por ejemplo, no cobrar dos veces—, pero no para comprobar que un método privado fue llamado en cierto orden. Si el refactor conserva el resultado observable, el test debería seguir pasando.

## Contratos que evolucionan

Añadir un campo opcional suele ser compatible; cambiar el tipo, quitar un campo utilizado o modificar el significado de un status puede romper consumidores. Prueba versiones reales del payload, errores y headers. Si hay despliegues independientes, publica el contrato y ejecuta el consumidor contra una versión del productor antes de promoverla.

### Contrato dirigido por consumidor

En equipos con despliegues independientes, el consumidor publica ejemplos de las respuestas que necesita y el proveedor los verifica en CI. Esto detecta una ruptura antes de desplegar. No reemplaza una prueba de integración: confirma el acuerdo, pero no necesariamente la base de datos, red o autenticación real.

Versiona solo cuando el cambio sea incompatible. Antes de crear `/v2`, considera agregar campos opcionales, mantener defaults o introducir una migración en dos pasos: el proveedor añade, los consumidores migran y finalmente se retira lo anterior.

## Falsos positivos

Un fake demasiado simple puede aceptar estados que la base real rechaza, y un mock puede ocultar que el adapter usa un nombre de columna incorrecto. Mantén una pequeña suite de integración contra cada frontera importante y prueba al menos una restricción, transacción y error de conexión real.
