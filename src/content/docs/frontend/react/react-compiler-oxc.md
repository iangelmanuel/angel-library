---
title: React Compiler con Oxc y Vite
description: Integrar el port de React Compiler escrito en Rust mediante oxc-transform-react y @vitejs/plugin-react, con memoización automática y un flujo de adopción medible.
type: guides
order: 17
tags: [react, react-compiler, oxc, vite, rust, rendimiento]
scope: React Compiler en Vite
website: https://oxc.rs/blog/2026-08-18-react-compiler-support
github: https://github.com/oxc-project/oxc
related:
  - frontend/react/react-performance-compiler
  - frontend/react/react
updatedAt: 2026-09-09
---

## En pocas palabras

Oxc integra React Compiler en una transformación nativa de Rust. El paquete `oxc-transform-react` aplica memoización automática durante el build y `@vitejs/plugin-react` expone la opción `compiler: true` para proyectos Vite.

La integración es experimental y está en desarrollo activo. El benchmark preliminar de Oxc muestra una ventaja de más de 10× frente a `babel-plugin-react-compiler`; las cifras dependen del equipo, del tamaño de los archivos, de los plugins y de si se mide solo el transformador o el build completo.

Esto reduce la cantidad de memoización manual que tienes que mantener, pero no elimina la necesidad de respetar las Rules of React ni de medir el resultado.

## Antes de empezar

- un proyecto Vite que use React;
- Node y pnpm compatibles con la versión de Vite del proyecto;
- React Compiler habilitado de forma incremental;
- una rama o commit que puedas comparar si el compilador cambia la salida.

El soporte publicado por Oxc se conecta a `@vitejs/plugin-react` **6.1.0 o posterior** y a Vite 8. Comprueba la versión instalada antes de copiar la configuración.

## Instalación

Desde la raíz del proyecto:

```bash
pnpm add -D @vitejs/plugin-react@^6.1.0 oxc-transform-react
```

La dependencia `oxc-transform-react` es opcional para el plugin porque contiene el binding nativo que ejecuta el compilador. Mantenerla explícita deja claro qué pieza habilita la transformación.

## Activarlo en Vite

En `vite.config.ts` o `vite.config.js`, activa el compilador en el plugin de React:

```ts title="vite.config.ts"
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

export default defineConfig({
  plugins: [react({ compiler: true })]
})
```

Con esa opción, el plugin entrega los archivos React al transformador de Oxc durante el build. La integración conserva la decisión en el plugin de React para que Vite y Oxc sigan siendo herramientas independientes.

## Verificar que el código sea compilable

Oxlint incluye reglas impulsadas por React Compiler que detectan problemas como mutaciones, efectos mal ubicados, refs incorrectos o componentes estáticos que no cumplen las Rules of React. Una configuración mínima es:

```json title=".oxlintrc.json"
{
  "plugins": ["react"],
  "categories": {
    "correctness": "error"
  }
}
```

Corrige los errores antes de comparar rendimiento. Si el compilador encuentra una parte incompatible, puede omitir su optimización; el linter ayuda a distinguir una omisión razonable de un bug en el código.

## Qué cambia en el código

React Compiler analiza componentes y Hooks en tiempo de compilación y puede conservar identidades y resultados entre renders. En un componente compatible, ya no necesitas añadir `useMemo` o `useCallback` solo para que un hijo memoizado reciba una referencia estable.

Eso no significa que debas borrar toda memoización existente de una vez:

1. conserva primero la versión funcional;
2. habilita el compiler en una rama o una parte de la aplicación;
3. mide con React DevTools Profiler y pruebas de interacción;
4. elimina una memoización manual a la vez;
5. vuelve a añadirla solo si una medición demuestra una necesidad concreta o si protege un contrato de identidad.

El compilador no corrige una consulta lenta, una lista de miles de nodos, un efecto en cascada o un estado colocado demasiado arriba. Esas decisiones siguen siendo responsabilidad de la arquitectura de la interfaz.

## Cuando la integración no optimiza

La compilación puede omitirse en código que infringe las Rules of React. También hay restricciones de la tubería:

- el transformador necesita recibir el JSX original antes de que otro plugin lo reescriba;
- un plugin que transforma JSX antes de React Compiler puede dejar el archivo fuera del alcance esperado;
- configuraciones con macros o sintaxis no soportada necesitan una prueba específica;
- el soporte de React 17, 18 y 19 puede requerir distintos runtimes del compiler;
- el port de Rust y el paquete de Oxc todavía tienen trabajo pendiente.

Si el proyecto usa plugins que transforman JSX, revisa su orden y prueba el build de producción. No concluyas que el compiler está activo solo porque Vite inicia sin error.

## Comprobación antes y después

Usa una pequeña matriz de verificación:

| Comprobación | Qué observar |
| --- | --- |
| `pnpm build` | errores de transformación, source maps y tamaño de salida |
| tests y snapshots | cambios de comportamiento o de identidad observables |
| React DevTools Profiler | renders y tiempo de commit en interacciones reales |
| build con caché fría y caliente | coste inicial y coste repetido del transformador |
| bundle y memoria | impacto del plugin, dependencias nativas y salida final |

El “10× más rápido” de la publicación es una medición preliminar del transformador frente a Babel. No lo uses como promesa de que toda la compilación Vite será diez veces más rápida.

## Siguiente paso

Relaciona esta integración con [Rendimiento, memoización y React Compiler](/frontend/react/react-performance-compiler) para decidir primero qué medir y con [React](/frontend/react/react) para revisar las Rules of React y la ruta de aprendizaje.

Consulta la [guía de React Compiler en Oxc](https://oxc.rs/docs/guide/usage/transformer/react-compiler), el [anuncio técnico de Oxc](https://oxc.rs/blog/2026-08-18-react-compiler-support) y el [repositorio de Oxc](https://github.com/oxc-project/oxc) antes de fijar versiones.
