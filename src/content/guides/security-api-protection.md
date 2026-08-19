---
title: Seguridad de APIs — objetos, funciones, consumo y SSRF
description: Aplicar autorización por recurso, límites, inventario y validación de servicios externos frente a los riesgos principales de una API.
category: security
stack: security-aplicacion
order: 1
tags: [security, api, bola, ssrf, authorization, rate-limit]
related:
  - guides/security-auth-access-control
  - guides/backend-api-design
  - practices/web-security-checklist
updatedAt: 2026-08-19
---

Una API expone objetos y acciones directamente. Autenticar a la persona no demuestra que pueda leer un objeto específico o ejecutar una función administrativa.

## BOLA y BFLA

**BOLA** (*Broken Object Level Authorization*) ocurre cuando se cambia un identificador y el servidor devuelve un recurso ajeno. **BFLA** (*Broken Function Level Authorization*) permite ejecutar una función reservada.

```ts
const invoice = await invoices.findById(params.id);
if (!invoice || invoice.accountId !== auth.accountId) {
  throw new NotFoundError();
}
```

La consulta puede incorporar el alcance: `WHERE id = $1 AND account_id = $2`. Aplica autorización en cada lectura y escritura, no solo ocultando botones o confiando en IDs difíciles de adivinar.

## Propiedades y mass assignment

No pases el cuerpo completo al ORM:

```ts
const input = UpdateProfile.parse(request.body);
await users.update(auth.userId, {
  displayName: input.displayName,
  timezone: input.timezone,
});
```

Una lista permitida impide que aparezcan campos como `role`, `balance` o `accountId` por asignación masiva.

## Consumo de recursos

Limita tamaño de body, profundidad JSON, filas, rango de fechas, concurrencia, tiempo y costo por operación. El rate limit debe considerar identidad y tipo de acción; una consulta costosa puede necesitar un límite distinto a `/health`.

## SSRF

**SSRF** (*Server-Side Request Forgery*) sucede cuando el servidor realiza una solicitud a una URL controlada por el atacante y puede alcanzar red interna, metadata cloud o servicios privilegiados.

- Prefiere identificadores sobre URLs libres.
- Mantén allowlists de esquema, host y puerto.
- Resuelve DNS y bloquea rangos privados, loopback y link-local.
- Vuelve a validar cada redirección.
- Desactiva protocolos innecesarios y aplica timeout/tamaño.
- Aísla el componente que necesita acceso de red.

## APIs de terceros

Valida sus respuestas como datos no confiables, aplica timeout y no sigas redirecciones o descargas sin límites. Mantén inventario de versiones y hosts; una integración abandonada sigue siendo superficie de ataque.

## Referencias

- [OWASP API Security Top 10](https://owasp.org/www-project-api-security/)
- [OWASP: SSRF](https://owasp.org/www-community/attacks/Server_Side_Request_Forgery)

