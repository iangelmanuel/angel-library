---
title: "Herramientas de desarrollo: conceptos y flujo de trabajo"
description: Guía para entender runtime, compiladores, bundlers, linters, gestores de paquetes, depuradores y artefactos de construcción.
category: tools
stack: tools-fundamentos
tags: [herramientas, toolchain, build, cli, fundamentos, glosario]
order: 1
updatedAt: 2026-08-25
---

Una **cadena de herramientas**, o *toolchain*, es el conjunto de programas que transforma código fuente en una aplicación que se puede probar, ejecutar y distribuir. Conocer el papel de cada herramienta evita configuraciones duplicadas y ayuda a ubicar la causa de un error.

## Aprende o consulta

Para aprender, sigue el archivo desde el editor hasta producción: gestor de paquetes → scripts → formatter/linter/typecheck → test → bundler → artefacto → depuración. No añadas otra herramienta antes de identificar qué responsabilidad falta.

| Pregunta | Documento |
| --- | --- |
| ¿qué hace Vite en desarrollo y build? | [Vite y build](/guides/tools-vite-build) |
| ¿ESLint, Prettier o TypeScript? | [Calidad de código](/guides/tools-calidad-codigo) |
| ¿cómo diagnostico una página? | [Chrome DevTools](/guides/tools-chrome-devtools) |
| ¿cómo depuro sin cambiar cosas al azar? | [Flujo de debugging](/guides/tools-debugging-workflow) |
| ¿cómo comparto tareas del editor? | [VS Code workspace](/guides/tools-vscode-workspace) |
| ¿qué documentación sí se mantiene? | [Documentación técnica](/guides/tools-documentacion-tecnica) |

Para recordar, entra por el síntoma y consulta la herramienta responsable. Para aprender, ejecuta cada etapa por separado y observa su entrada, salida y código de error.

## Mapa general

```text
Código fuente
  → formato y análisis estático
  → transformación o compilación
  → pruebas
  → empaquetado
  → artefactos de construcción
  → despliegue
```

Estas etapas pueden ocurrir juntas durante el desarrollo y por separado en **CI**, sigla de *Continuous Integration* o integración continua.

## Runtime, compilador e intérprete

Un **runtime** o entorno de ejecución proporciona lo necesario para ejecutar un programa: motor del lenguaje, memoria, APIs y acceso al sistema. El navegador es un runtime para JavaScript web; Node.js, Deno y Bun son runtimes de JavaScript fuera del navegador.

Un **compilador** traduce código de un lenguaje o nivel de abstracción a otro formato. Un **intérprete** ejecuta instrucciones sin producir necesariamente un ejecutable independiente. Los runtimes modernos mezclan estrategias, como compilación **JIT** (*Just-In-Time* o justo a tiempo), por lo que la separación no siempre es absoluta.

Un **transpilador** es un compilador que transforma entre lenguajes de un nivel parecido. TypeScript a JavaScript moderno es el ejemplo habitual. El resultado puede necesitar otra transformación para navegadores antiguos.

## Gestor de paquetes y dependencias

Un gestor como npm, pnpm o Yarn instala paquetes, resuelve versiones y ejecuta scripts. Una **dependencia** es código externo que el proyecto necesita; una dependencia transitiva es la que necesita otra dependencia.

```json
{
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "check": "astro check",
    "test": "vitest run"
  },
  "dependencies": {
    "astro": "^5.0.0"
  },
  "devDependencies": {
    "vitest": "^3.0.0"
  }
}
```

`dependencies` contiene paquetes necesarios para ejecutar o construir el producto según su despliegue. `devDependencies` contiene herramientas usadas principalmente para desarrollar y verificar. La frontera exacta depende de cómo se construya la aplicación.

El **archivo de bloqueo** —`package-lock.json`, `pnpm-lock.yaml` o equivalente— registra las versiones resueltas para que instalaciones distintas produzcan un árbol reproducible. Debe guardarse en Git para una aplicación.

## Versionado semántico

**SemVer** significa *Semantic Versioning* o versionado semántico. Una versión `2.4.1` se interpreta como `MAJOR.MINOR.PATCH`:

- `MAJOR` cambia cuando existen incompatibilidades públicas;
- `MINOR` añade funcionalidad compatible;
- `PATCH` corrige errores de forma compatible.

El rango `^2.4.1` suele admitir actualizaciones menores y parches dentro de la versión principal 2. El rango no demuestra que una actualización sea segura: las pruebas y las notas de versión siguen siendo necesarias.

## Servidor de desarrollo y HMR

El servidor de desarrollo entrega la aplicación localmente y observa cambios. **HMR** significa *Hot Module Replacement* o reemplazo de módulos en caliente: actualiza un módulo sin recargar todo el documento cuando es posible.

El modo de desarrollo prioriza diagnóstico y velocidad de iteración. No representa el rendimiento ni el comportamiento exacto del paquete de producción. Las decisiones de rendimiento deben comprobarse con una construcción de producción.

## Bundler, módulos y división de código

Un **bundler** analiza el grafo de importaciones y produce uno o varios archivos optimizados para distribuir. Vite, Rollup, webpack, esbuild y Turbopack participan en esta clase de trabajo, aunque cada uno tiene un alcance distinto.

```ts
// Importación estática: forma parte del grafo inicial.
import { formatCurrency } from './currency';

// Importación dinámica: permite cargar el módulo cuando se necesita.
const { openEditor } = await import('./editor');
```

La **división de código** o *code splitting* separa el paquete en fragmentos. El **tree shaking** elimina exportaciones que el análisis puede demostrar que no se usan. Ninguna técnica garantiza un paquete pequeño si el código tiene efectos secundarios difíciles de analizar o si se importa una dependencia completa.

## Linter, formatter y type checker

Estas herramientas resuelven problemas diferentes:

| Herramienta | Pregunta principal | Ejemplo |
| --- | --- | --- |
| Formatter | ¿Cómo debe verse el código? | Sangría, comillas, saltos de línea |
| Linter | ¿Qué patrones son problemáticos? | Variable no usada o promesa sin manejar |
| Type checker | ¿Son compatibles los tipos? | Pasar un número donde se espera texto |
| Test runner | ¿El comportamiento cumple los casos definidos? | Verificar que un descuento se calcule bien |

Un código formateado puede ser incorrecto; un código sin errores de tipos también puede incumplir el negocio. Las herramientas se complementan.

## CLI, IDE y depurador

**CLI** significa *Command-Line Interface* o interfaz de línea de comandos. Una orden suele tener esta forma:

```text
programa subcomando argumento --opcion valor
pnpm    add        zod       --save-dev
```

Un **IDE** (*Integrated Development Environment* o entorno de desarrollo integrado) combina editor, navegación de código, terminal, depuración y extensiones.

El **depurador** permite pausar la ejecución con un *breakpoint*, inspeccionar variables y avanzar paso a paso. Es preferible a añadir registros sin dirección cuando se necesita entender cómo cambia el estado.

## Source maps

Un **source map** relaciona el código transformado con el archivo original. Gracias a él, una traza producida por JavaScript minificado puede apuntar a una línea de TypeScript o a un componente fuente.

Los mapas son útiles para diagnóstico, pero su publicación debe ser intencional. Algunos contienen código fuente y pueden exponer información que el equipo no desea hacer pública. Un servicio de errores puede almacenarlos de forma privada.

## Variables de entorno y configuración

Una variable de entorno configura el proceso sin modificar el código. No todo valor de entorno es secreto, y no todo archivo `.env` queda automáticamente protegido.

```ts
const apiUrl = process.env.API_URL;

if (!apiUrl) {
  throw new Error('Falta la variable de entorno API_URL');
}
```

En frontend, cualquier valor incluido en el paquete enviado al navegador debe considerarse público. Los prefijos como `PUBLIC_` o `VITE_` suelen indicar exposición deliberada, pero la regla exacta depende del framework.

## Build, artefacto y caché

El **build** o construcción transforma el código en una salida distribuible. Un **artefacto** es el resultado inmutable de esa construcción: archivos estáticos, un paquete, una imagen de contenedor o un ejecutable.

Construir una vez y promover el mismo artefacto entre entornos reduce diferencias. Si cada ambiente recompila, podría obtener dependencias o resultados distintos.

Una caché reutiliza resultados anteriores cuando sus entradas no cambiaron. Una clave de caché incompleta produce resultados obsoletos; una demasiado específica nunca se reutiliza. Debe incluir las entradas que realmente influyen, como el archivo de bloqueo y la configuración de construcción.

## Cómo diagnosticar un fallo

1. Identifica la etapa: instalación, tipos, lint, prueba, build, ejecución o despliegue.
2. Lee el primer error causal, no solo la última línea de la traza.
3. Reproduce con la misma versión del runtime y el mismo archivo de bloqueo.
4. Reduce el caso sin cambiar varias variables a la vez.
5. Verifica si el error aparece en desarrollo, producción o ambos.
6. Corrige la causa y añade una comprobación automática que evite la regresión.
