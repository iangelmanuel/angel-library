---
title: Adapter
description: Traducir una interfaz incompatible (una librería externa, una API de terceros) a la interfaz que ya usa el resto del código.
category: architecture
stack: patrones-diseno
order: 4
tags: [arquitectura, patrones-diseno, adapter]
related: [patterns/facade]
problem: Integrar dos proveedores distintos (dos pasarelas de pago, dos SDKs) que resuelven lo mismo con interfaces distintas, sin ramificar el código que los consume.
updatedAt: 2026-08-17
---

## Problema

Dos proveedores que resuelven el mismo problema (cobrar un pago, mandar un SMS) casi nunca tienen la misma interfaz. Sin Adapter, el código que los usa termina lleno de `if (proveedor === 'stripe') { ... } else { ... }`. Adapter traduce cada proveedor a una interfaz común una sola vez, en un solo lugar, y el resto de la app deja de saber qué hay detrás.

## Interfaz común

```ts title="lib/payments/payment-provider.ts"
export interface PaymentProvider {
  charge(amountCents: number, currency: string): Promise<{ id: string; status: 'paid' | 'failed' }>;
}
```

## Adapter para Stripe

```ts title="lib/payments/stripe-adapter.ts"
import Stripe from 'stripe';
import type { PaymentProvider } from './payment-provider';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export const stripeAdapter: PaymentProvider = {
  async charge(amountCents, currency) {
    const intent = await stripe.paymentIntents.create({ amount: amountCents, currency, confirm: true });
    return { id: intent.id, status: intent.status === 'succeeded' ? 'paid' : 'failed' };
  },
};
```

## Adapter para un proveedor local

```ts title="lib/payments/local-provider-adapter.ts"
import { crearCobro } from 'proveedor-local-sdk';
import type { PaymentProvider } from './payment-provider';

export const localProviderAdapter: PaymentProvider = {
  async charge(amountCents, currency) {
    const resultado = await crearCobro({ monto: amountCents / 100, moneda: currency });
    return { id: resultado.referencia, status: resultado.aprobado ? 'paid' : 'failed' };
  },
};
```

El SDK de Stripe devuelve `status: 'succeeded'`, el proveedor local devuelve `aprobado: boolean`. Ninguno de los dos coincide con la interfaz que definió la app — cada adapter absorbe esa diferencia.

## Uso

```ts
async function cobrarPedido(provider: PaymentProvider, pedido: Pedido) {
  const resultado = await provider.charge(pedido.totalCents, pedido.moneda);
  if (resultado.status === 'failed') throw new Error('Pago rechazado');
  return resultado.id;
}

// El caller elige el adapter, pero cobrarPedido no sabe cuál es.
await cobrarPedido(stripeAdapter, pedido);
```

## Cuándo NO usarlo

Si controlás ambos lados de la integración (tu propio código en los dos extremos), suele ser más simple cambiar uno de los dos para que las interfaces coincidan, en vez de mantener una capa de traducción permanente. Adapter se justifica cuando uno de los lados es código externo que no podés (o no querés) tocar.
