---
title: Módulos, límites y dirección de dependencias
description: Dividir un sistema por capacidades y contratos para contener cambios, evitar ciclos y mantener infraestructura fuera del dominio.
type: guides
order: 4
tags: [architecture, modules, boundaries, dependencies, coupling]
related:
  - architecture/principios/architecture-fundamentals-terminology
  - backend/backend-fundamentos/backend-api-design
updatedAt: 2026-08-19
---

Un módulo agrupa comportamiento y datos que cambian por la misma razón. Un límite útil reduce lo que otras partes necesitan conocer: expone un contrato pequeño y mantiene detalles internos privados.

```text
orders/
  application/   casos de uso
  domain/        reglas y tipos propios
  adapters/      HTTP, base de datos, proveedores
  index.ts       API pública del módulo
```

## Cohesión y acoplamiento

**Cohesión** indica cuánto pertenecen juntas las responsabilidades de un módulo. **Acoplamiento** indica cuánto depende de detalles ajenos. Se busca alta cohesión y acoplamiento explícito, no ausencia total de dependencias.

```ts
export interface PaymentGateway {
  charge(input: ChargeInput): Promise<ChargeResult>;
}

export function createCheckout(deps: { payments: PaymentGateway }) {
  // El caso de uso depende del contrato, no del SDK concreto.
}
```

El adapter de Stripe, OpenRouter o cualquier proveedor implementa el contrato en el borde. El dominio no importa su SDK.

## Dirección de dependencias

Las reglas estables no deberían depender de UI, framework o infraestructura que cambia con frecuencia. Esto no exige crear interfaces para cada función; aplica inversión cuando existe un límite real, varias implementaciones o una dependencia difícil de probar.

## Señales de un límite débil

- imports profundos hacia archivos internos de otro módulo;
- ciclos entre carpetas;
- una tabla compartida que todos modifican directamente;
- cambios pequeños que requieren editar muchas áreas;
- tipos de un proveedor externo filtrados por toda la aplicación.

## Evolución

Empieza con un monolito modular cuando el producto no exige distribución. Separar un servicio agrega red, despliegue, consistencia eventual y observabilidad. Extrae cuando el límite ya existe y hay una razón operativa clara, como escalado independiente, aislamiento o propiedad de equipo.

