---
title: Primer proyecto TypeScript — comprobar, ejecutar y validar
description: Crear un laboratorio estricto y distinguir la comprobación estática de la validación de datos al ejecutar.
type: guides
sidebar:
  order: 2
tags: [typescript, javascript, learning, validation]
related:
  - general/typescript/typescript
  - general/typescript/typescript-path-aliases
  - packages/javascript-zod/zod
updatedAt: 2026-09-07
---

## En pocas palabras

TypeScript comprueba contratos antes de ejecutar. Un ejecutor como `tsx` transforma el archivo para Node, pero no sustituye esa comprobación. Validar un JSON al recibirlo es una tercera operación que ocurre con datos reales.

## Antes de empezar

Necesitas Node.js 22.12+ y pnpm 11, y conocer funciones, objetos y condicionales de JavaScript. Trabaja en una carpeta de práctica independiente; no sustituyas el `tsconfig.json` de un framework con este ejemplo.

## Preparación

```bash
mkdir laboratorio-ts
cd laboratorio-ts
pnpm init
pnpm add -D typescript@6 tsx@4 @types/node@22
```

Agrega o combina estos campos en el `package.json` generado:

```json title="package.json (campos relevantes)"
{
  "type": "module",
  "scripts": {
    "check": "tsc --noEmit",
    "start": "tsx src/index.ts"
  }
}
```

Conserva las `devDependencies` que añadió pnpm y versiona `pnpm-lock.yaml`. Crea `src/` y este archivo de configuración:

```json title="tsconfig.json"
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noEmit": true
  },
  "include": ["src/**/*.ts"]
}
```

`strict` activa comprobaciones estrictas; `noUncheckedIndexedAccess` recuerda que acceder a una posición de un array puede producir `undefined`. El framework de una aplicación puede necesitar otras opciones de módulos: este laboratorio se ejecuta en Node.

## Ejemplo completo

```ts title="src/index.ts"
type Tarea = { id: string; titulo: string; completada: boolean }

function esTarea(value: unknown): value is Tarea {
  if (value === null || typeof value !== "object") return false
  return "id" in value && typeof value.id === "string"
    && "titulo" in value && typeof value.titulo === "string"
    && "completada" in value && typeof value.completada === "boolean"
}

function describir(tarea: Tarea): string {
  return `${tarea.completada ? "Lista" : "Pendiente"}: ${tarea.titulo}`
}

const payload: unknown = JSON.parse('{"id":"t1","titulo":"Aprender TS","completada":false}')
if (!esTarea(payload)) throw new Error("La respuesta no tiene forma de tarea")
console.log(describir(payload)) // Pendiente: Aprender TS
```

`unknown` obliga a comprobar antes de usar. El predicado `value is Tarea` comunica a TypeScript lo que la función ha demostrado. Si escribes mal esa comprobación, el compilador no la corrige por ti. Este ejemplo valida la forma, pero acepta strings vacíos y campos adicionales; reglas de negocio más estrictas pertenecen a otro nivel.

## Comprobación

```bash
pnpm check
pnpm start
```

| Cambio de prueba | Qué debe ocurrir |
| --- | --- |
| Código sin modificar | Check correcto y `Pendiente: Aprender TS` en consola |
| Llamar `describir({ id: "1", titulo: "Leer", completada: "no" })` | Error de tipos al ejecutar `pnpm check` |
| Cambiar el JSON para que `completada` sea `"no"` | Check correcto, pero error de validación al ejecutar |
| Romper la sintaxis del texto JSON | `JSON.parse` lanza antes de validar la forma |

Ejecuta las variantes una por una y restaura el archivo después. Un cast `payload as Tarea` ocultaría el problema al compilador sin corregirlo.

## Errores y límites

Si ejecutar funciona pero `check` falla, has transformado el código sin demostrar que sus tipos son correctos. Si `check` funciona pero los datos fallan, revisa el contrato real de la entrada. No introduzcas `any` para evitar ambas responsabilidades.

Para esquemas grandes, usa [Zod](/packages/javascript-zod/zod) y deriva el tipo del esquema. Para imports entre archivos, continúa con [módulos de Node](/backend/node/node-commonjs-vs-esm). Los [alias](/general/typescript/typescript-path-aliases) requieren configurar también el ejecutor o bundler; TypeScript no reescribe por sí solo esos imports.

## Fuentes

- [TypeScript: narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)
- [TypeScript: opciones de configuración](https://www.typescriptlang.org/tsconfig/)
