---
title: Facade
description: Esconder varios pasos o servicios que siempre se usan juntos detrás de una única función simple.
type: patterns
order: 5
tags: [arquitectura, patrones-diseno, facade]
related: [architecture/patrones-diseno/adapter, backend/express/backend-mvc-structure]
problem: Cada lugar que hace checkout tiene que acordarse de validar stock, cobrar, crear la orden y mandar el email, en ese orden.
updatedAt: 2026-08-17
---

## Problema

Algunas operaciones no son un solo paso: son varios servicios que siempre se ejecutan juntos, en un orden concreto. Si cada caller repite esa coreografía, un cambio en el orden o un paso olvidado se convierte en un bug esparcido por todo el código. Facade la encierra en una sola función.

## Ejemplo: checkout

```ts title="services/checkout.ts"
import { validarStock } from './inventory';
import { cobrar } from './payments';
import { crearOrden } from './orders';
import { enviarConfirmacion } from './notifications';

interface CheckoutResult {
  orderId: string;
}

export async function checkout(cart: Cart, usuario: Usuario): Promise<CheckoutResult> {
  await validarStock(cart.items);
  const cobro = await cobrar(usuario.metodoPago, cart.total);
  const orden = await crearOrden(usuario.id, cart.items, cobro.id);
  await enviarConfirmacion(usuario.email, orden);
  return { orderId: orden.id };
}
```

Quien llama a `checkout(cart, usuario)` no necesita saber que por dentro hay cuatro servicios coordinándose. Si mañana se agrega un paso (reservar puntos de fidelidad, por ejemplo), se agrega adentro de `checkout()` y ningún caller cambia.

Esto es, en la práctica, lo que hace la capa de `services/` en una [estructura MVC de Express](/backend/express/backend-mvc-structure): el service es la facade que el controller llama sin conocer los detalles.

## Cuándo NO usarlo

Si la "simplificación" es una función que solo delega a otra función sin coordinar nada más, no hace falta el nombre del patrón — es simplemente una función bien nombrada. Facade vale la pena cuando de verdad orquesta múltiples pasos o servicios independientes que tienen que ejecutarse en orden, no como excusa para agregar una capa extra a todo.
