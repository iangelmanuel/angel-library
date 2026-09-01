---
title: Primeros pasos con Astro
description: Crear un proyecto, reconocer su estructura, ejecutar los comandos esenciales y entender qué ocurre en servidor y navegador.
type: guides
order: 1
tags: [astro, getting-started, installation, project-structure]
scope: fundamentos de Astro
website: https://docs.astro.build/en/install-and-setup/
related:
  - frontend/astro/astro
  - frontend/astro/astro-project-configuration
  - frontend/astro/astro-components-props-slots
updatedAt: 2026-08-25
---

## En 30 segundos

- Astro convierte páginas y componentes en HTML durante el build o durante una request del servidor.
- Un componente `.astro` no envía automáticamente su script de servidor al navegador.
- `src/pages/` define rutas; `src/components/` y `src/layouts/` son convenciones organizativas.
- Empieza con salida estática y añade JavaScript o render bajo demanda únicamente donde exista una necesidad concreta.

## Antes de comenzar

Conviene entender HTML, CSS, módulos de JavaScript y el uso básico de una terminal. React no es un requisito: Astro puede generar un sitio completo usando solamente componentes `.astro` y scripts del navegador.

Astro necesita una versión de Node.js compatible con la versión del framework. Comprueba el requisito de la versión que instalarás en la documentación oficial y evita asumir que un proyecto antiguo y uno nuevo utilizan el mismo runtime.

## Crear el proyecto

```bash
pnpm create astro@latest
cd mi-sitio
pnpm dev
```

El asistente permite elegir plantilla, TypeScript e inicialización de Git. Para añadir una integración durante la creación:

```bash
pnpm create astro@latest -- --add react
```

No memorices todas las opciones del asistente. El resultado importante es un proyecto que puedes ejecutar, compilar y volver a configurar más adelante.

## Estructura inicial

```text
mi-sitio/
├── public/              # archivos sin procesar
├── src/
│   ├── assets/          # imágenes procesables e importables
│   ├── components/      # piezas reutilizables
│   ├── layouts/         # estructuras de página
│   └── pages/           # rutas públicas
├── astro.config.mjs
├── package.json
└── tsconfig.json
```

Solo `src/pages/` está reservado para el routing. Las demás carpetas son convenciones que puedes adaptar. Un archivo dentro de `public/` se sirve sin transformación; un recurso dentro de `src/` puede entrar en el grafo de módulos y ser procesado por Astro o Vite.

## Primera página y primer componente

```astro title="src/components/Greeting.astro"
---
interface Props {
  name: string
}

const { name } = Astro.props
const createdAt = new Date()
---

<p>Hola, {name}. Renderizado a las {createdAt.toLocaleTimeString("es-CO")}.</p>
```

```astro title="src/pages/index.astro"
---
import Greeting from "../components/Greeting.astro"
---

<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta
      name="viewport"
      content="width=device-width"
    />
    <title>Mi sitio Astro</title>
  </head>
  <body>
    <main>
      <h1>Inicio</h1>
      <Greeting name="Angel" />
    </main>
  </body>
</html>
```

El bloque entre `---` se denomina **component script** o frontmatter del componente. Se ejecuta en el entorno de renderizado y puede importar módulos, consultar datos y preparar valores. La plantilla produce HTML. `createdAt` no crea un reloj en el cliente: registra el momento en que la página fue renderizada.

## Comandos que debes reconocer

| Comando            | Propósito                                                         |
| ------------------ | ----------------------------------------------------------------- |
| `pnpm dev`         | servidor de desarrollo con recarga                                |
| `pnpm build`       | genera la salida de producción y revela errores de build          |
| `pnpm preview`     | sirve localmente la salida compilada cuando el adapter lo permite |
| `pnpm astro check` | revisa tipos y diagnósticos de archivos Astro                     |
| `pnpm astro sync`  | regenera tipos de contenido, módulos y configuración              |

`dev` no sustituye `build`: integraciones, rutas estáticas y variables pueden comportarse de forma distinta en producción. Ejecuta ambos antes de considerar terminada una funcionalidad.

## Tres lugares donde puede ejecutarse el código

| Lugar                | Ejemplos                            | Puede usar secretos                  |
| -------------------- | ----------------------------------- | ------------------------------------ |
| build                | página estática, `getStaticPaths()` | sí, pero no debe imprimirlos en HTML |
| servidor por request | página on-demand, endpoint, Action  | sí                                   |
| navegador            | `<script>`, isla hidratada          | no                                   |

Esta separación es el modelo mental más importante de Astro. Una variable disponible en el frontmatter no existe automáticamente dentro de un `<script>` del navegador, y un evento `click` no puede ejecutarse en un componente `.astro` que nunca fue hidratado.

## Práctica inicial

1. Crea `/about` mediante `src/pages/about.astro`.
2. Extrae un encabezado reutilizable a `src/components/Header.astro`.
3. Pasa el título mediante props.
4. Añade un enlace normal entre ambas páginas.
5. Ejecuta `build` y revisa la carpeta de salida.

Si puedes explicar qué código se ejecutó durante el build y qué HTML recibió el navegador, ya tienes la base para continuar con componentes, routing y layouts.

## Errores frecuentes

- Buscar `pages/index.jsx` antes de comprender componentes `.astro`.
- Colocar todos los recursos en `public/` y perder optimización e imports tipados.
- Esperar que una variable del frontmatter cambie después de cargar la página.
- Añadir una isla de framework para una interacción que un `<script>` pequeño o HTML nativo resuelve.
- depender únicamente de `dev` y descubrir problemas durante el despliegue.
