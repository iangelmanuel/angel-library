---
title: Number Utils — Referencia rápida
description: Utilidades tipadas para formatear moneda, porcentajes, números compactos y tamaños de archivo con Intl.
category: general
stack: utils
runtime: universal
language: typescript
related: []
updatedAt: 2026-08-15
---

Utilidades mínimas para formatear números. Importa siempre desde `@/libs/number`.

El formateo usa `Intl.NumberFormat`, nativo del navegador y de Node — no hace falta `numeral` ni similares.

## Formatear

### `formatCurrency()` — Moneda

Formatea un número como moneda usando `Intl.NumberFormat` con `style: 'currency'`. `amount` siempre en la unidad base de la moneda (dólares, no centavos).

```ts title="lib/number.ts"
export function formatCurrency(amount: number, currency = 'USD', locale = 'es'): string {
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(amount)
}
```

```ts
import { formatCurrency } from '@/libs/number';

formatCurrency(1250.5);
// "US$ 1,250.50"

formatCurrency(1250.5, 'EUR', 'es-ES');
// "1250,50 €"
```

### `formatNumber()` — Número con separadores

Formatea un número con separadores de miles según el locale. `options` acepta cualquier opción de `Intl.NumberFormat` (decimales fijos, notación, etc.) para casos puntuales.

```ts title="lib/number.ts"
export function formatNumber(
  value: number,
  options: Intl.NumberFormatOptions = {},
  locale = 'es'
): string {
  return new Intl.NumberFormat(locale, options).format(value)
}
```

```ts
import { formatNumber } from '@/libs/number';

formatNumber(1234567.891, { maximumFractionDigits: 2 });
// "1,234,567.89"
```

### `formatPercent()` — Porcentaje

Formatea un número como porcentaje. El valor va como fracción (`0.42`, no `42`), igual que `style: 'percent'` de `Intl.NumberFormat`.

```ts title="lib/number.ts"
export function formatPercent(
  value: number,
  options: Intl.NumberFormatOptions = { maximumFractionDigits: 1 },
  locale = 'es'
): string {
  return new Intl.NumberFormat(locale, { style: 'percent', ...options }).format(value)
}
```

```ts
import { formatPercent } from '@/libs/number';

formatPercent(0.4256);
// "42.6%"
```

### `formatCompact()` — Notación compacta

Formatea un número grande de forma compacta ("1.2K", "3.4M"), usando `notation: 'compact'`. Útil para contadores y estadísticas donde el número exacto no importa.

```ts title="lib/number.ts"
export function formatCompact(value: number, locale = 'es'): string {
  return new Intl.NumberFormat(locale, { notation: 'compact', maximumFractionDigits: 1 }).format(value)
}
```

```ts
import { formatCompact } from '@/libs/number';

formatCompact(1500);
// "1.5K"

formatCompact(2300000);
// "2.3M"
```

### `formatFileSize()` — Tamaño de archivo

Convierte un número de bytes a la unidad legible más adecuada (B, KB, MB, GB, TB). `Intl` no tiene esto nativo, así que es la única función aquí que no usa `Intl.NumberFormat`.

```ts title="lib/number.ts"
export function formatFileSize(bytes: number, decimals = 1): string {
  if (bytes === 0) return '0 B'

  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1)
  const value = bytes / 1024 ** exponent

  return `${value.toFixed(decimals)} ${units[exponent]}`
}
```

```ts
import { formatFileSize } from '@/libs/number';

formatFileSize(2_500_000);
// "2.4 MB"
```

## Utilidades

### `clamp()` — Restringir a un rango

Restringe un número a un rango mínimo y máximo. Sirve para validar inputs numéricos, porcentajes de progreso o coordenadas antes de usarlas.

```ts title="lib/number.ts"
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}
```

```ts
import { clamp } from '@/libs/number';

const progreso = clamp(porcentajeCalculado, 0, 100);
```

## Resumen

| Función | Qué hace |
| --- | --- |
| `formatCurrency()` | Formatear como moneda |
| `formatNumber()` | Formatear con separadores de miles |
| `formatPercent()` | Formatear como porcentaje (valor en fracción) |
| `formatCompact()` | Formatear en notación compacta ("1.2K") |
| `formatFileSize()` | Bytes a unidad legible (KB, MB, GB…) |
| `clamp()` | Restringir un número a un rango |

## Consideraciones

- `formatCurrency()` necesita un código de moneda ISO 4217 válido (`USD`, `EUR`, `ARS`...) — no valida que el código exista, `Intl` lanza si es inválido.
- `formatPercent()` recibe la fracción, no el porcentaje ya multiplicado: `0.5`, no `50`.
- `formatFileSize()` usa base 1024 (KB = 1024 B), no base 1000. Es la convención habitual para tamaños de archivo, distinta a la de discos duros comerciales.
