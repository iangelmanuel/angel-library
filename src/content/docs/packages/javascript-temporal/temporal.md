---
title: Temporal
description: La API estándar de fechas y horas de JavaScript — objetos inmutables, zonas horarias explícitas y aritmética de duraciones, con polyfill mientras se completa el soporte.
tags: [javascript, typescript, fechas, temporal, polyfill]
sidebar:
  order: 1
draft: false
resourceCategory: Documentación del paquete
website: https://tc39.es/proposal-temporal/docs/
github: https://github.com/tc39/proposal-temporal
note: "Temporal ya envía en Firefox 139, Chrome 144 y Node.js 26. Fuera de esos runtimes —Safari incluido— sigue haciendo falta el polyfill."
updatedAt: 2026-09-14
---

`Date` guarda un instante en milisegundos y lo interpreta siempre en la zona del sistema: `new Date("2026-03-15")` y `new Date("2026-03-15T00:00")` no significan lo mismo, sumar un mes no existe, y el objeto es mutable. Temporal es la API que reemplaza eso: **tipos distintos para cosas distintas**, todos inmutables, y la zona horaria como dato explícito en vez de un efecto del entorno.

## Estado y soporte

Temporal es una propuesta **TC39 en Stage 4**, ya integrándose en ECMA-262/ECMA-402. Envía en Firefox 139 (mayo 2025), Chrome 144 (enero 2026) y Node.js 26 (mayo 2026); Safari sigue en implementación. En la práctica: en 2026 todavía hace falta polyfill si tu matriz de soporte incluye Safari o Node más antiguo.

## Instalación del polyfill

```bash
pnpm add temporal-polyfill
```

`temporal-polyfill` (de FullCalendar) es la opción estable hoy; `@js-temporal/polyfill` es la del grupo del proposal y sigue en alpha. El polyfill pesa, así que conviene medirlo antes de darlo por gratuito.

```ts title="src/lib/temporal.ts"
import { Temporal } from "temporal-polyfill"

export { Temporal }
```

Cuando el runtime ya trae Temporal nativo, este import es lo único que hay que borrar.

## Los tipos, que son el punto

Cada tipo responde a una pregunta distinta y no se convierten solos entre sí:

| Tipo                      | Qué representa                                                | Ejemplo de uso                     |
| ------------------------- | ------------------------------------------------------------- | ---------------------------------- |
| `Temporal.Instant`        | Un punto exacto en la línea de tiempo (UTC), sin calendario   | Un `createdAt` guardado en la base |
| `Temporal.ZonedDateTime`  | Fecha + hora + zona horaria real, con reglas de horario de verano | Una reunión "a las 9 en Bogotá"    |
| `Temporal.PlainDate`      | Una fecha sin hora ni zona                                    | Fecha de nacimiento, vencimiento   |
| `Temporal.PlainTime`      | Una hora del día sin fecha                                    | "Abre a las 08:30"                 |
| `Temporal.PlainDateTime`  | Fecha + hora, sin zona                                        | Un valor de formulario todavía sin zona |
| `Temporal.Duration`       | Una cantidad de tiempo (`P1M2DT3H`)                           | "En 2 días", "duró 90 minutos"     |

Que una fecha de cumpleaños sea `PlainDate` y no un `Date` evita el error clásico de que cambie de día según la zona del navegador.

## Leer el ahora

```ts
const ahora = Temporal.Now.instant() // instante exacto
const aqui = Temporal.Now.zonedDateTimeISO() // con la zona del sistema
const bogota = Temporal.Now.zonedDateTimeISO("America/Bogota")
const hoy = Temporal.Now.plainDateISO("America/Bogota")
```

La zona se pide donde se necesita: no hay un "por defecto global" escondido que cambie el resultado en el servidor.

## Aritmética inmutable

```ts
const fecha = Temporal.PlainDate.from("2026-01-31")

const siguiente = fecha.add({ months: 1 }) // 2026-02-28, se recorta al mes
const antes = fecha.subtract({ days: 10 }) // 2026-01-21

fecha.toString() // "2026-01-31" — el original no cambió
```

`add` y `subtract` devuelven un objeto nuevo. El recorte de fin de mes es configurable:

```ts
fecha.add({ months: 1 }, { overflow: "reject" }) // lanza en vez de recortar
```

## Diferencias entre dos fechas

```ts
const inicio = Temporal.PlainDate.from("2026-01-01")
const fin = Temporal.PlainDate.from("2026-09-14")

const dias = inicio.until(fin, { largestUnit: "day" }) // P256D
const meses = inicio.until(fin, { largestUnit: "month" }) // P8M13D

dias.days // 256
```

`until`/`since` devuelven una `Duration`, no un número de milisegundos que haya que dividir a mano.

## Zonas horarias y horario de verano

```ts
const cita = Temporal.ZonedDateTime.from({
  timeZone: "Europe/Madrid",
  year: 2026,
  month: 3,
  day: 28,
  hour: 23,
  minute: 30
})

const masTarde = cita.add({ hours: 3 }) // respeta el salto de horario de verano
const enBogota = cita.withTimeZone("America/Bogota") // mismo instante, otra pared
```

`withTimeZone` cambia cómo se lee el mismo instante; `withPlainTime`/`with` cambian el valor. Son operaciones distintas y la API obliga a elegir.

## Interoperar con `Date` y con la base de datos

```ts
const instante = Temporal.Instant.from("2026-09-14T15:00:00Z")

const comoDate = new Date(instante.epochMilliseconds)
const desdeDate = Temporal.Instant.fromEpochMilliseconds(Date.now())

instante.toString() // "2026-09-14T15:00:00Z" — ISO, apto para guardar
```

Para persistir, guarda ISO 8601 (o el instante UTC) y reconstruye el tipo al leer. Guardar `ZonedDateTime` como texto conserva la zona; guardar solo un `timestamp` la pierde.

## Notas de uso

- Formatear sigue siendo trabajo de `Intl.DateTimeFormat`: los objetos Temporal se le pasan directo.
- No hay soporte de segundos intercalares: Temporal los excluye del modelo a propósito.
- El polyfill no parchea `Date`; convive con él, así que se puede migrar módulo por módulo.
- Si una fecha no lleva hora, usa `PlainDate`. La mitad de los bugs de fechas nacen de meter una hora que nadie pidió.
