---
title: Astro
description: Ruta de Astro para aprender desde la instalación hasta islas, contenido y render bajo demanda, o consultar rápidamente una API concreta.
type: technologies
tags: [astro, framework, static, islands]
website: https://astro.build
github: https://github.com/withastro/astro
related:
  - frontend/astro/astro-getting-started
  - frontend/astro/astro-project-configuration
  - frontend/astro/astro-components-props-slots
  - frontend/astro/astro-routing
  - frontend/astro/astro-rendering-modes
  - frontend/astro/astro-content-collections
  - frontend/astro/astro-islas
  - frontend/astro/astro-server-actions
updatedAt: 2026-08-25
---

## Qué estás aprendiendo

Astro es un framework web que convierte componentes y datos en HTML. Su característica central no es “ser estático”, sino permitir decidir cuánto JavaScript y qué tipo de render necesita cada parte del sitio.

```text
componente .astro
  → se ejecuta en build o servidor
  → produce HTML
  → no incluye runtime cliente por defecto

interacción necesaria
  → script pequeño del navegador
  → Web Component
  → isla React/Vue/Svelte hidratada
```

El resultado predeterminado es HTML prerenderizado. Una ruta puede pasar a render bajo demanda cuando necesita cookies, sesión o datos por request. Una isla cliente es otra decisión: añade interactividad en el navegador, independientemente de cómo se obtuvo el HTML inicial.

## Elige tu forma de entrar

### Quiero aprender Astro desde cero

Sigue el orden del sidebar. Empieza por [Primeros pasos](/frontend/astro/astro-getting-started) y [Estructura y configuración](/frontend/astro/astro-project-configuration). Después construye componentes, páginas y layouts antes de estudiar hidratación, Actions o middleware.

En cada documento:

1. identifica si el código corre en build, servidor o navegador;
2. predice el HTML o la respuesta que producirá;
3. ejecuta el ejemplo y revisa Network y el HTML recibido;
4. cambia una condición estática por otra dependiente de la request;
5. comprueba `astro check` y `astro build`.

### Ya uso Astro y quiero recordar

| Necesito                                         | Documento                                                         |
| ------------------------------------------------ | ----------------------------------------------------------------- |
| crear proyecto, comandos y estructura            | [Primeros pasos](/frontend/astro/astro-getting-started)           |
| `astro.config`, `site`, `base`, `output`         | [Configuración](/frontend/astro/astro-project-configuration)      |
| props, slots y composición                       | [Componentes Astro](/frontend/astro/astro-components-props-slots) |
| rutas fijas, dinámicas y redirects               | [Routing](/frontend/astro/astro-routing)                          |
| layout, slot y contenido Markdown                | [Layouts](/frontend/astro/astro-layouts)                          |
| `Astro.props`, `params`, `url`, cookies y locals | [Objeto Astro](/frontend/astro/astro-global-object)               |
| estilos scoped, globales y variables             | [Estilos](/frontend/astro/astro-styles)                           |
| scripts de navegador y eventos                   | [Scripts](/frontend/astro/astro-scripts)                          |
| SSG, SSR, adapters e hidratación                 | [Modos de renderizado](/frontend/astro/astro-rendering-modes)     |
| contenido tipado y loaders                       | [Content Collections](/frontend/astro/astro-content-collections)  |
| `client:*`                                       | [Islas de UI](/frontend/astro/astro-islas)                        |
| `server:defer`                                   | [Server Islands](/frontend/astro/astro-server-islands)            |
| formularios y mutaciones tipadas                 | [Server Actions](/frontend/astro/astro-server-actions)            |
| requests HTTP públicas                           | [Endpoints](/frontend/astro/astro-endpoints)                      |
| auth, redirects y contexto por request           | [Middleware](/frontend/astro/astro-middleware)                    |

## Curva de aprendizaje

### Etapa 1: producir documentos

1. Instalación, comandos y estructura.
2. Configuración y diferencia entre `src` y `public`.
3. Componentes `.astro`, props, slots y composición.
4. Routing basado en archivos y rutas dinámicas.
5. Layouts y jerarquía del documento.
6. Sintaxis de plantilla, directivas y objeto `Astro`.

Al terminar debes poder construir varias páginas reutilizando componentes sin enviar JavaScript innecesario.

### Etapa 2: presentación y navegador

7. Estilos scoped, estilos globales y assets.
8. Scripts procesados, eventos y datos serializados.
9. Imágenes con `astro:assets`.
10. Render estático, on-demand e hidratación.
11. Fetching y manejo de errores.

Al terminar debes distinguir trabajo de servidor y navegador, además de medir qué JavaScript recibe la página.

### Etapa 3: contenido y generación

12. Content Collections, schemas, loaders y referencias.
13. `getStaticPaths()` y paginación.
14. MDX cuando Markdown necesita componentes.
15. Internacionalización y URLs por idioma.

### Etapa 4: interactividad progresiva

16. Islas cliente y directivas `client:*`.
17. Server Islands y contenido personalizado diferido.
18. Prefetch y View Transitions como mejoras progresivas.
19. Integraciones de framework o herramientas externas.

### Etapa 5: capacidades de servidor

20. Variables de entorno y separación de secretos.
21. Endpoints y objetos estándar `Request`/`Response`.
22. Actions para mutaciones internas y formularios.
23. Middleware para contexto, autorización, redirects y rewrites.
24. Sessions, autenticación, adapters y arquitectura backend cuando el producto lo requiera.

## Glosario mínimo

| Término         | Significado                                                         |
| --------------- | ------------------------------------------------------------------- |
| prerender o SSG | generar HTML durante el build (_Static Site Generation_)            |
| SSR             | generar HTML al recibir una request (_Server-Side Rendering_)       |
| hidratación     | conectar runtime y eventos del framework a HTML existente           |
| isla            | región interactiva aislada dentro de una página mayormente HTML     |
| adapter         | integración que traduce la salida de Astro al runtime de despliegue |
| endpoint        | archivo de ruta que responde con un objeto `Response`               |
| Action          | función de servidor tipada invocable desde una UI o formulario      |

## Cuándo elegir Astro

Encaja especialmente bien en documentación, marketing, blogs, catálogos, portfolios y aplicaciones donde gran parte de la pantalla es contenido. También puede crear productos dinámicos, pero conviene conservar su ventaja: empezar con HTML y añadir runtime solo donde aporta valor.

Una aplicación donde casi toda la pantalla depende de estado cliente compartido, colaboración en tiempo real o navegación altamente interactiva puede encajar mejor en un framework centrado en React. La pregunta no es si Astro “puede”, sino qué modelo mantiene el proyecto más simple.

## Regla de arquitectura

Empieza estático. Si un dato depende de la persona o de la request, vuelve dinámica esa ruta o ese bloque. Si una interacción necesita estado del navegador, crea la isla más pequeña que conserve una API clara. Esta secuencia evita convertir una necesidad local en costo global.
