---
title: Monorepo — qué es, cómo funciona y cuándo usarlo
description: Qué es un monorepo, en qué se diferencia de un multi-repo y de un repo con submódulos, cómo funciona por dentro (workspaces, hoisting, el protocolo workspace:) y cuándo conviene o no.
type: guides
order: 1
tags: [monorepo, workspaces, arquitectura, pnpm, npm, bun]
scope: qué es un monorepo y cómo funciona
related:
  - general/monorepo/monorepo-pnpm
  - general/monorepo/monorepo-npm
  - general/monorepo/monorepo-bun
  - general/monorepo/monorepo-ejemplo-frontend-backend
updatedAt: 2026-08-26
---

**Monorepo** es un único repositorio de Git que contiene **varios paquetes independientes** — cada uno con su propio `package.json`, capaz de instalarse, testearse o publicarse por separado — en vez de un repositorio por paquete. No es "un proyecto grande con muchas carpetas": la diferencia real es que cada paquete sigue siendo una unidad independiente, solo que todas viven bajo la misma raíz de Git.

Es fácil confundirlo con dos cosas que no son esto:

| No es lo mismo que              | Diferencia                                                                                                                                                                |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Un proyecto grande sin paquetes | Un `src/` enorme con carpetas por feature sigue siendo **un** paquete. Un monorepo tiene **varios** `package.json`, cada uno instalable y versionable por separado        |
| Git submódulos / subtrees       | Cada submódulo es su **propio repositorio de Git** con su propio historial, referenciado desde el padre por commit. Un monorepo es **un solo** historial de Git para todo |

## Cómo funciona por dentro

Un monorepo de JavaScript/TypeScript se construye sobre un mecanismo que los tres gestores de paquetes llaman **workspaces**: un archivo raíz declara qué carpetas son paquetes del monorepo, y el gestor hace dos cosas automáticamente.

**1. Symlinks en vez de copias.** Si el paquete `apps/web` depende del paquete `packages/ui`, el gestor no descarga `ui` de un registro — crea un enlace simbólico dentro de `apps/web/node_modules/ui` que apunta directamente a `packages/ui`. Editar un archivo en `packages/ui` se refleja al instante en cualquier paquete que lo use, sin publicar ni reinstalar nada.

**2. Un único árbol de dependencias externas.** Las dependencias de terceros (React, Zod, lo que sea) se instalan **una vez** en la raíz y se comparten entre paquetes, en vez de duplicarse en cada `node_modules` local. Esto se llama **hoisting** ("izar" las dependencias hacia arriba) y es la razón por la que instalar en un monorepo suele ser más rápido y pesar menos en disco que instalar cada paquete por separado.

### El protocolo `workspace:`

pnpm y Bun (no npm — ver el aviso más abajo) soportan un protocolo especial para declarar una dependencia interna:

```json title="packages/web/package.json"
{
  "dependencies": {
    "@repo/ui": "workspace:*"
  }
}
```

`workspace:*` le dice al gestor: **"esta dependencia tiene que resolverse contra el paquete local del monorepo, nunca contra el registro de npm"**. Si `@repo/ui` no existiera en el monorepo, la instalación falla en vez de intentar descargar un paquete público con ese nombre — una protección real, no solo una convención.

Al publicar un paquete a npm, el gestor reemplaza automáticamente `workspace:*` por la versión real (`"@repo/ui": "1.4.0"`), así que el paquete publicado nunca contiene ese protocolo, que no significaría nada fuera del monorepo.

> **npm es distinto.** La documentación de npm menciona el protocolo `workspace:`, pero en la práctica (npm 11.x) lanza `EUNSUPPORTEDPROTOCOL` al usarlo — es un desajuste real entre lo documentado y lo implementado. En npm, una dependencia interna se declara con una versión normal (o `"*"`) y el symlink ocurre igual, por coincidencia de nombre entre el `name` del `package.json` del paquete y la clave de la dependencia. El detalle exacto está en la [guía de npm workspaces](/general/monorepo/monorepo-npm).

## Casos donde un monorepo tiene sentido

- **Una librería y sus consumidores viven en el mismo repositorio.** Un design system (`packages/ui`) usado por dos apps (`apps/web`, `apps/admin`) del mismo equipo: cambiar un componente y ver el efecto en ambas apps sin publicar una versión intermedia.
- **Varios servicios que comparten tipos o lógica.** Un backend y un frontend que comparten un paquete `packages/types` con los tipos de la API — cambiar un tipo rompe la build de inmediato en vez de descubrirse en producción.
- **Refactors que cruzan paquetes.** Renombrar una función usada por cinco paquetes es un solo Pull Request con un solo historial, no cinco PRs coordinados a mano en cinco repositorios.
- **Herramientas de build compartidas.** Una configuración de ESLint, TypeScript o Vitest que todos los paquetes heredan desde un paquete central de configuración.

## Casos donde NO conviene

- **Proyectos sin relación real entre sí.** Si dos aplicaciones no comparten código ni se despliegan juntas, meterlas en el mismo repo solo añade acoplamiento en el control de acceso de Git (todo el mundo con permiso al repo ve todo) y en el tamaño del clone.
- **Equipos que necesitan permisos de repositorio distintos por proyecto.** GitHub controla el acceso por repositorio, no por carpeta. Si un equipo externo solo debe ver un paquete, un monorepo compartido no lo permite sin herramientas adicionales.
- **Historiales de versión independientes que un cliente necesita rastrear.** Una librería open source con su propio changelog y tags de versión público generalmente vive mejor en su propio repositorio, aunque internamente el equipo también use un monorepo para el resto.

Ninguna de estas reglas es absoluta — Google y Meta operan monorepos de millones de archivos con miles de personas; la mayoría de equipos que sí les conviene un monorepo son mucho más chicos: dos a diez paquetes relacionados, un solo equipo.

## Herramientas de orquestación: más allá de los workspaces

Los workspaces resuelven instalación y symlinks, pero no resuelven una pregunta que aparece rápido en un monorepo real: **si toco `packages/ui`, ¿qué necesito reconstruir o testear?** Ahí entran herramientas como **Turborepo** o **Nx** — no reemplazan pnpm/npm/bun workspaces, se apoyan en ellos y añaden:

- **Grafo de dependencias entre paquetes**, para saber qué tareas dependen de qué.
- **Cache de tareas**: si el código de `packages/ui` no cambió, `build` reusa el resultado anterior en vez de recompilar.
- **Ejecución en paralelo** respetando el orden del grafo (construir `ui` antes que `web`, que depende de `ui`).

Para un monorepo chico (2-4 paquetes) esto puede ser innecesario al principio; para uno con builds lentos o muchos paquetes, suele volverse indispensable rápido. No se documenta en profundidad aquí — el foco de esta entrada son los workspaces nativos de cada gestor.

## Siguiente paso

Elige tu gestor de paquetes para la guía completa de instalación y comandos:

- [Monorepo con pnpm](/general/monorepo/monorepo-pnpm) — el más usado para monorepos de JS/TS hoy, por su manejo de hoisting más estricto y los catalogs.
- [Monorepo con npm](/general/monorepo/monorepo-npm) — sin instalar nada extra si ya usas npm.
- [Monorepo con Bun](/general/monorepo/monorepo-bun) — instalación más rápida, runtime incluido.

Después de eso, [un ejemplo completo con frontend y backend](/general/monorepo/monorepo-ejemplo-frontend-backend) — Express, Vite + React, un paquete de tipos compartido, y el comando que abre ambos servidores a la vez en los tres gestores.

Fuentes: [pnpm Workspaces](https://pnpm.io/workspaces), [npm Workspaces](https://docs.npmjs.com/cli/v11/using-npm/workspaces/) y [Bun Workspaces](https://bun.sh/docs/install/workspaces).
