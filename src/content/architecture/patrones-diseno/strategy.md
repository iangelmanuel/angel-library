---
title: Strategy
description: Intercambiar un algoritmo en runtime eligiéndolo por clave, en vez de un if/switch gigante.
type: patterns
order: 9
tags: [arquitectura, patrones-diseno, strategy]
related: [architecture/patrones-diseno/factory]
problem: Calcular un descuento o validar una contraseña según el tipo de cuenta termina en un switch con ocho casos que crece cada vez que se agrega una variante.
updatedAt: 2026-08-17
---

## Problema

Cuando el mismo cálculo tiene varias variantes intercambiables (tipos de descuento, reglas de validación según plan), un `switch` gigante mezcla la lógica de todas las variantes en un solo lugar y crece indefinidamente. Strategy separa cada variante en su propia función y las agrupa por clave, para elegir la que corresponde sin ramificar.

## Ejemplo: estrategias de descuento

```ts title="lib/discounts.ts"
type DiscountStrategy = (precio: number) => number;

const estrategiasDescuento: Record<string, DiscountStrategy> = {
  percentage: (precio) => precio * 0.9,
  fixed: (precio) => Math.max(precio - 500, 0),
  none: (precio) => precio,
};

export function aplicarDescuento(precio: number, tipo: keyof typeof estrategiasDescuento) {
  return estrategiasDescuento[tipo](precio);
}
```

Comparado con la alternativa:

```ts
// Lo que Strategy evita: crece un caso más cada vez que se agrega un tipo.
function aplicarDescuento(precio: number, tipo: string) {
  switch (tipo) {
    case 'percentage':
      return precio * 0.9;
    case 'fixed':
      return Math.max(precio - 500, 0);
    case 'none':
      return precio;
    // ...cinco casos más
  }
}
```

## Ejemplo: validación de contraseña según tipo de cuenta

```ts title="lib/password-validation.ts"
type Validador = (password: string) => boolean;

const validadores = new Map<string, Validador>([
  ['personal', (pw) => pw.length >= 8],
  ['empresarial', (pw) => pw.length >= 12 && /[A-Z]/.test(pw) && /\d/.test(pw)],
]);

export function esPasswordValida(tipoCuenta: string, password: string): boolean {
  const validar = validadores.get(tipoCuenta) ?? validadores.get('personal')!;
  return validar(password);
}
```

## En JS/TS es un objeto o Map de funciones, no clases

No hace falta definir una interfaz `Strategy` y una clase por variante (`PercentageDiscount`, `FixedDiscount`). Funciones puras agrupadas en un objeto o `Map` cumplen el mismo rol con mucho menos código, y siguen siendo fáciles de testear una por una.

## Cuándo NO usarlo

Si solo hay dos variantes y no hay indicio de que vayan a crecer, un `if` o un ternario directo es más simple de leer que armar un objeto de estrategias. El patrón se justifica cuando el número de variantes es real (tres o más) o cuando se espera que crezca.
