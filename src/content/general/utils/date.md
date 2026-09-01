---
title: Date Utils — Referencia rápida
description: Utilidades tipadas para formatear fechas y tiempo relativo con Intl, sin librerías.
type: utilities
runtime: universal
language: typescript
related: []
updatedAt: 2026-08-15
---

Utilidades mínimas para trabajar con fechas usando `Intl`, nativo del navegador y de Node. Importa siempre desde `@/libs/date`.

No hace falta `date-fns` ni `dayjs` para lo básico: formatear, calcular diferencias, comparar días y generar secuencias de fechas (por ejemplo, para pintar un calendario).

## Formatear

### `formatDate()` — Formatear una fecha

Formatea una fecha con `Intl.DateTimeFormat`. Por defecto usa locale `es` y estilo `medium`, pero ambos son configurables por si necesitas otro formato puntual.

```ts title="lib/date.ts"
export function formatDate(
  date: Date,
  options: Intl.DateTimeFormatOptions = { dateStyle: "medium" },
  locale = "es"
): string {
  return new Intl.DateTimeFormat(locale, options).format(date)
}
```

```ts
import { formatDate } from "@/libs/date"

formatDate(new Date())
// "15 ago 2026"

formatDate(new Date(), { dateStyle: "full" })
// "sábado, 15 de agosto de 2026"
```

### `formatTime()` — Formatear una hora

Igual que `formatDate()`, pero para la hora. Por defecto usa estilo `short` (sin segundos).

```ts title="lib/date.ts"
export function formatTime(
  date: Date,
  options: Intl.DateTimeFormatOptions = { timeStyle: "short" },
  locale = "es"
): string {
  return new Intl.DateTimeFormat(locale, options).format(date)
}
```

```ts
import { formatTime } from "@/libs/date"

formatTime(new Date())
// "14:32"
```

### `formatRelativeTime()` — Tiempo relativo

Formatea la diferencia entre una fecha y ahora como texto relativo ("hace 3 días", "en 2 horas"), eligiendo automáticamente la unidad más grande que tenga sentido con `Intl.RelativeTimeFormat`.

```ts title="lib/date.ts"
const RELATIVE_UNITS: { unit: Intl.RelativeTimeFormatUnit; ms: number }[] = [
  { unit: "year", ms: 31536000000 },
  { unit: "month", ms: 2592000000 },
  { unit: "week", ms: 604800000 },
  { unit: "day", ms: 86400000 },
  { unit: "hour", ms: 3600000 },
  { unit: "minute", ms: 60000 },
  { unit: "second", ms: 1000 }
]

export function formatRelativeTime(date: Date, locale = "es"): string {
  const diff = date.getTime() - Date.now()
  const formatter = new Intl.RelativeTimeFormat(locale, { numeric: "auto" })

  for (const { unit, ms } of RELATIVE_UNITS) {
    if (Math.abs(diff) >= ms || unit === "second") {
      return formatter.format(Math.round(diff / ms), unit)
    }
  }

  return formatter.format(0, "second")
}
```

```ts
import { formatRelativeTime } from "@/libs/date"

const haceTresDias = new Date(Date.now() - 3 * 86400000)
formatRelativeTime(haceTresDias)
// "hace 3 días"
```

### `formatDateRange()` — Formatear un rango

Formatea dos fechas como un rango legible con `Intl.DateTimeFormat.prototype.formatRange`, que evita repetir el mes o el año cuando ambas fechas caen en el mismo período.

```ts title="lib/date.ts"
export function formatDateRange(
  start: Date,
  end: Date,
  options: Intl.DateTimeFormatOptions = { dateStyle: "medium" },
  locale = "es"
): string {
  return new Intl.DateTimeFormat(locale, options).formatRange(start, end)
}
```

```ts
import { formatDateRange } from "@/libs/date"

formatDateRange(new Date("2026-08-15"), new Date("2026-08-20"))
// "15–20 ago 2026"
```

## Comparar y calcular

### `isSameDay()` — Mismo día

Compara si dos fechas caen en el mismo día calendario (año, mes y día), ignorando la hora. Útil para resaltar "hoy" en un calendario o agrupar eventos por día.

```ts title="lib/date.ts"
export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}
```

```ts
import { isSameDay } from "@/libs/date"

const esHoy = isSameDay(evento.fecha, new Date())
```

### `addDays()` — Sumar días

Devuelve una nueva fecha desplazada por la cantidad de días indicada (negativa para restar). No muta la fecha original.

```ts title="lib/date.ts"
export function addDays(date: Date, amount: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() + amount)
  return result
}
```

```ts
import { addDays } from "@/libs/date"

const vencimiento = addDays(new Date(), 30)
```

### `daysBetween()` — Días entre dos fechas

Calcula la cantidad de días entre dos fechas, normalizando ambas a UTC antes de restar para evitar desfases por cambios de horario de verano.

```ts title="lib/date.ts"
export function daysBetween(a: Date, b: Date): number {
  const msPerDay = 86400000
  const utcA = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate())
  const utcB = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate())
  return Math.round((utcB - utcA) / msPerDay)
}
```

```ts
import { daysBetween } from "@/libs/date"

const diasRestantes = daysBetween(new Date(), vencimiento)
```

## Rangos y secuencias

### `startOfDay()` — Inicio del día

Devuelve una nueva fecha con la hora en `00:00:00.000`, sin mutar la original. Base para comparar fechas ignorando la hora y para `dateRange()`.

```ts title="lib/date.ts"
export function startOfDay(date: Date): Date {
  const result = new Date(date)
  result.setHours(0, 0, 0, 0)
  return result
}
```

```ts
import { startOfDay } from "@/libs/date"

const hoyDesdeCero = startOfDay(new Date())
```

### `startOfMonth()` / `endOfMonth()` — Límites del mes

Devuelven el primer y el último día del mes de la fecha dada, con la hora en cero. `endOfMonth()` aprovecha que el "día 0" de un mes en JS es el último día del mes anterior.

```ts title="lib/date.ts"
export function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

export function endOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0)
}
```

```ts
import { endOfMonth, startOfMonth } from "@/libs/date"

const inicio = startOfMonth(new Date())
const fin = endOfMonth(new Date())
```

### `dateRange()` — Secuencia de fechas

Genera un array de fechas entre `start` y `end` (ambos extremos incluidos), avanzando de a `stepDays` días. Reutiliza `startOfDay()` y `addDays()` de esta misma librería para no repetir la lógica de avanzar días.

```ts title="lib/date.ts"
export function dateRange(start: Date, end: Date, stepDays = 1): Date[] {
  const dates: Date[] = []
  let current = startOfDay(start)
  const last = startOfDay(end)

  while (current.getTime() <= last.getTime()) {
    dates.push(current)
    current = addDays(current, stepDays)
  }

  return dates
}
```

```ts
import { dateRange } from "@/libs/date"

const semana = dateRange(new Date("2026-08-10"), new Date("2026-08-16"))
// [10, 11, 12, 13, 14, 15, 16] de agosto
```

### `eachDayOfMonth()` — Todos los días del mes

Devuelve un array con todas las fechas del mes de la fecha dada. Es `dateRange()` aplicado entre `startOfMonth()` y `endOfMonth()` — el caso típico para pintar una grilla de calendario.

```ts title="lib/date.ts"
export function eachDayOfMonth(date: Date): Date[] {
  return dateRange(startOfMonth(date), endOfMonth(date))
}
```

```ts
import { eachDayOfMonth } from "@/libs/date"

const diasDeAgosto = eachDayOfMonth(new Date("2026-08-01"))
// 31 fechas, una por día
```

## Resumen

| Función                           | Qué hace                                                 |
| --------------------------------- | -------------------------------------------------------- |
| `formatDate()`                    | Formatear una fecha con `Intl.DateTimeFormat`            |
| `formatTime()`                    | Formatear una hora                                       |
| `formatRelativeTime()`            | Formatear una fecha como tiempo relativo ("hace 3 días") |
| `formatDateRange()`               | Formatear un rango de dos fechas                         |
| `isSameDay()`                     | Comparar si dos fechas son el mismo día calendario       |
| `addDays()`                       | Sumar (o restar) días a una fecha, sin mutar             |
| `daysBetween()`                   | Calcular días entre dos fechas, sin errores de DST       |
| `startOfDay()`                    | Fecha con la hora en cero                                |
| `startOfMonth()` / `endOfMonth()` | Primer y último día del mes                              |
| `dateRange()`                     | Generar un array de fechas entre dos extremos            |
| `eachDayOfMonth()`                | Generar un array con todos los días del mes              |

## Consideraciones

- `Intl.RelativeTimeFormat`, `Intl.DateTimeFormat` y `formatRange()` están disponibles en todos los navegadores modernos y en Node — no hace falta polyfill.
- `daysBetween()` normaliza a UTC antes de restar: comparar `Date` directamente con horas incluidas puede dar resultados fuera por un día cuando cruza un cambio de horario.
- `dateRange()` incluye ambos extremos y no valida que `start` sea anterior a `end` — si `start` es posterior, devuelve un array vacío en vez de contar hacia atrás.
- `eachDayOfMonth()` y `dateRange()` pueden devolver arrays grandes con rangos largos (años) — no pensadas para generar miles de fechas directamente sola vez.
- Para fechas que llegan directamente de una API como texto, convierte primero con `new Date(valor)` antes de pasarlas a estas funciones.
