---
title: process — argv, exit codes y señales
description: Argumentos de línea de comandos, cómo terminar un proceso con el código correcto, y manejar SIGINT/SIGTERM para un shutdown limpio.
type: guides
order: 13
tags: [node, process, signals]
scope: node:process
updatedAt: 2026-08-16
---

`process` es un objeto global (no hace falta importarlo) con información y control sobre el proceso de Node actual — argumentos con los que se lo llamó, variables de entorno, y la capacidad de terminarlo de forma controlada.

## Argumentos de línea de comandos (`argv`)

```ts title="script.ts"
console.log(process.argv)
```

```bash
node script.ts --puerto 3000 --verbose
# process.argv:
# [0] '/ruta/al/ejecutable/node'
# [1] '/ruta/al/script.ts'
# [2] '--puerto'
# [3] '3000'
# [4] '--verbose'
```

Los primeros dos elementos siempre son el path de Node y el path del script — los argumentos "reales" empiezan en el índice 2. Para parseo serio de flags (`--puerto=3000`, alias cortos, valores por defecto), una librería como `commander` o `yargs` evita reimplementar ese parsing a mano.

## Salir del proceso con un código

```ts
process.exit(0) // éxito
process.exit(1) // error genérico
```

El código de salida es lo que otro proceso (una CI, un script que orquesta varios comandos, `$?` en bash) usa para saber si algo terminó bien o mal — `0` es la única convención de "éxito", cualquier otro número es "algo falló".

```bash
node script.js; echo $?   # imprime el exit code del comando anterior
```

`process.exit()` fuerza la salida inmediatamente, sin esperar operaciones asíncronas pendientes (como un `write` a un archivo todavía en vuelo) — en general es mejor dejar que el proceso termine solo cuando no queda nada pendiente en el event loop, y reservar `process.exit()` para casos de error donde seguir ejecutando no tiene sentido.

## Señales: `SIGINT` y `SIGTERM`

Un proceso recibe **señales** del sistema operativo — las dos que más importan para un servidor:

```ts
process.on("SIGINT", () => {
  console.log("Ctrl+C recibido, cerrando...")
  cerrarConexionesYSalir()
})

process.on("SIGTERM", () => {
  console.log("Señal de terminación recibida (ej: Docker stop, deploy)")
  cerrarConexionesYSalir()
})
```

- **`SIGINT`**: se dispara con `Ctrl+C` en la terminal.
- **`SIGTERM`**: la señal "por favor termina" que envían los orquestadores (Docker, Kubernetes, PM2) antes de finalizar un proceso — a diferencia de `SIGKILL`, que no se puede interceptar ni manejar, `SIGTERM` permite limpiar recursos antes de salir.

## Shutdown limpio (graceful shutdown)

El patrón real en un servidor: al recibir la señal, dejar de aceptar conexiones nuevas, esperar a que las requests en curso terminen, cerrar la conexión a la base de datos, y **recién ahí** salir.

```ts title="server.ts"
import { createServer } from "node:http"

const server = createServer((req, res) => res.end("ok"))
server.listen(3000)

function shutdown() {
  console.log("Cerrando servidor...")
  server.close(() => {
    console.log("Servidor cerrado, saliendo.")
    process.exit(0)
  })
}

process.on("SIGINT", shutdown)
process.on("SIGTERM", shutdown)
```

`server.close()` deja de aceptar conexiones nuevas, pero espera a que las existentes terminen antes de ejecutar su callback. Forzar el cierre durante una request activa puede dejar una escritura incompleta en la base de datos.

## Referencia del proceso

| API                                  | Qué hace                                                             |
| ------------------------------------ | -------------------------------------------------------------------- |
| `process.argv`                       | Argumentos de línea de comandos (desde el índice 2)                  |
| `process.exit(codigo)`               | Termina el proceso; `0` = éxito, cualquier otro = error              |
| `process.on('SIGINT'/'SIGTERM', fn)` | Interceptar la señal en vez de que mate el proceso de inmediato      |
| `server.close(callback)`             | Deja de aceptar conexiones nuevas, espera a que terminen las activas |

## Reglas de cierre

- `SIGKILL` (y cerrar la terminal a la fuerza en algunos casos) **no** se puede interceptar — el shutdown limpio solo funciona para señales que sí llegan al proceso, como `SIGTERM`.
- Sin manejar `SIGTERM`, un orquestador como Docker/Kubernetes espera un tiempo (grace period, típicamente 10s) y después manda `SIGKILL` de todas formas — manejarlo bien evita requests cortadas a la mitad durante un deploy.
