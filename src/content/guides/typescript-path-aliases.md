---
title: "Alias de imports en TypeScript (tsconfig paths)"
description: "baseUrl + paths en tsconfig.json para imports tipo @/components en vez de ../../../../components — y por qué eso solo no alcanza en todos los setups."
category: general
stack: typescript
order: 2
tags: [typescript, tsconfig, imports, alias]
scope: alias de imports con tsconfig paths
related: [guides/node-commonjs-vs-esm]
updatedAt: 2026-08-17
---

## El snippet básico

```json title="tsconfig.json"
{
  "compilerOptions": {
    "baseUrl": ".", // deprecado en TypeScript 7.0
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

Esto habilita importar cualquier cosa dentro de `src/` con el prefijo `@/`, sin importar desde qué tan profundo del árbol de carpetas se esté importando:

```ts
// antes — la ruta cambia cada vez que el archivo se mueve de carpeta
import { Button } from '../../../../components/ui/Button';

// después — la misma ruta desde cualquier archivo del proyecto
import { Button } from '@/components/ui/Button';
```

Este mismo alias (`@/*` → `./src/*`) es el que usa este sitio — está declarado en su `tsconfig.json` y funciona ahora mismo en todos los `import` del código fuente.

## Qué hace cada campo

| Campo | Para qué |
| --- | --- |
| `baseUrl` | La carpeta base desde la que se resuelven las rutas de `paths`. `"."` significa la raíz del proyecto (donde está el `tsconfig.json`). |
| `paths` | Mapa de patrones de alias a rutas reales, relativas a `baseUrl`. Cada valor es un **array** (TypeScript prueba las rutas en orden hasta encontrar una que exista). |

`baseUrl` es obligatorio para que `paths` funcione — sin él, TypeScript ignora `paths` silenciosamente (no tira error, el alias simplemente no resuelve). **`baseUrl` está deprecado desde TypeScript 7.0** — verifica en la documentación oficial de TypeScript el reemplazo vigente antes de escribir un `tsconfig.json` nuevo en un proyecto con esa versión o superior.

## El gotcha más importante: esto es solo para TypeScript

`paths` en `tsconfig.json` le dice al **type-checker** (y al editor, para autocompletado/"ir a definición") cómo resolver el alias. **No reescribe el import en el JavaScript final** — en tiempo de ejecución, algo más tiene que saber traducir `@/components/Button` a la ruta real, o el código va a fallar con `Cannot find module '@/components/Button'` aunque `tsc` no marque ningún error.

Quién resuelve el alias en runtime depende del entorno:

| Entorno | ¿Necesita configuración extra? |
| --- | --- |
| **Astro** (este proyecto) | No — Astro lee `paths` de `tsconfig.json` automáticamente y configura el alias en su Vite interno. |
| **Next.js** | No — mismo comportamiento, soporte nativo desde hace varias versiones. |
| **Vite "puro"** (sin Astro/Next encima) | Sí — Vite no lee `tsconfig.json` por su cuenta. Hace falta el plugin [`vite-tsconfig-paths`](https://www.npmjs.com/package/vite-tsconfig-paths), o declarar el alias a mano en `resolve.alias` dentro de `vite.config.ts`. |
| **Webpack** | Sí — replicar el mismo mapeo en `resolve.alias` de `webpack.config.js`. |
| **Jest** | Sí — replicar el mapeo en `moduleNameMapper` de la config de Jest (con regex, no glob). |
| **Node.js directo / `ts-node`** | Sí — `tsc` tampoco reescribe los imports al compilar a JS plano. Para desarrollo, el paquete [`tsconfig-paths`](https://www.npmjs.com/package/tsconfig-paths) registra un resolver en runtime; para build de producción, [`tsc-alias`](https://www.npmjs.com/package/tsc-alias) reescribe los imports compilados a rutas relativas reales como paso posterior a `tsc`. |

Moraleja: agregar el snippet de arriba y nada más funciona directamente en Astro y Next.js. En cualquier otro entorno, hay que replicar el mismo alias en la herramienta que arma el bundle o corre el código.

## Más formas de declarar `paths`

### Varios alias, uno por carpeta

Además del alias general `@/*`, es común declarar uno específico por carpeta frecuente — menos escritura, más intención en el import:

```json title="tsconfig.json"
{
  "compilerOptions": {
    "baseUrl": ".", // deprecado en TypeScript 7.0
    "paths": {
      "@/*": ["./src/*"],
      "@components/*": ["./src/components/*"],
      "@lib/*": ["./src/lib/*"],
      "@utils/*": ["./src/utils/*"],
      "@hooks/*": ["./src/hooks/*"]
    }
  }
}
```

```ts
import { Button } from '@components/Button';
import { formatDate } from '@utils/date';
```

### Alias sin wildcard, apuntando a un archivo exacto

Sin `*`, el alias apunta a un único archivo — útil para un punto de entrada canónico que se importa seguido (config, cliente de base de datos, store):

```json
{
  "paths": {
    "@config": ["./src/config/site.ts"]
  }
}
```

```ts
import { SITE } from '@config';
```

### Varias rutas candidatas para el mismo alias

`paths` acepta más directamente ruta por patrón — TypeScript prueba en orden y usa la primera que exista. Útil en monorepos, donde un paquete puede tener código fuente y una build ya compilada:

```json
{
  "paths": {
    "@shared/*": ["./packages/shared/src/*", "./packages/shared/dist/*"]
  }
}
```

### Alias entre paquetes de un monorepo

El mismo mecanismo sirve para referenciar un paquete hermano por nombre, en vez de con `../../`:

```json
{
  "paths": {
    "@myorg/ui": ["./packages/ui/src/index.ts"],
    "@myorg/ui/*": ["./packages/ui/src/*"]
  }
}
```

### `~/` en vez de `@/`

`@/` es la convención más común hoy (React/Next/Astro), pero `~/` es una alternativa que viene de la época de Vue/Nuxt y algunos setups con Webpack — misma mecánica, solo cambia el símbolo:

```json
{
  "paths": {
    "~/*": ["./src/*"]
  }
}
```

No hay diferencia funcional entre `@/` y `~/` — es preferencia de equipo. `@/` es la opción más reconocible para alguien que entra al proyecto por primera vez, porque es la que usan la mayoría de starters y templates actuales.

## Consideraciones

- El editor (VS Code y similares) usa el mismo `tsconfig.json` para autocompletar imports con el alias — si el alias no aparece al autocompletar después de agregarlo, reiniciar el servidor de TypeScript del editor suele resolverlo (no hace falta reiniciar el editor entero).
- Si se reorganiza `src/` (mover una carpeta, renombrarla), los `paths` que apunten ahí hay que actualizarlos a mano — no hay nada que los mantenga en sync automáticamente.
- Un alias `@/*` muy amplio es cómodo pero no avisa si un import "debería" haber sido relativo (por ejemplo, un archivo importando a otro en la misma carpeta) — algunos equipos combinan `@/*` con una regla de lint que fuerza imports relativos dentro de la misma carpeta y alias para todo lo demás. No es necesario para empezar, pero vale saber que existe esa combinación.
