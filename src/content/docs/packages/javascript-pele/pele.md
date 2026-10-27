---
title: Pele
description: Renderizador de diagramas Mermaid a SVG del equipo de Obsidian — síncrono, sin dependencias, mucho más ligero que Mermaid.js y con colores y fuentes controlados por variables CSS.
tags: [javascript, typescript, diagramas, svg, mermaid, obsidian, css-variables]
sidebar:
  order: 1
draft: false
resourceCategory: Documentación del paquete
official: true
website: https://pele.run
github: https://github.com/obsidianmd/pele
note: "Licencia MIT. Lee la sintaxis de Mermaid 12.1.0, pero con su propio layout y estilo: el mismo diagrama no queda idéntico al de Mermaid.js. Versión 1.12.0 a octubre de 2026."
warnings:
  - "Proyecto muy reciente (creado en octubre de 2026) que publica varias versiones al día: fija la versión en `package.json` y revisa el changelog antes de actualizar."
  - "No ejecuta los callbacks de JavaScript de las sentencias `click` ni admite etiquetas HTML arbitrarias; si tus diagramas dependen de eso, se romperán al migrar."
updatedAt: 2026-10-27
---

Mermaid es el lenguaje de texto más extendido para escribir diagramas (`flowchart LR; A --> B`), pero su librería oficial, Mermaid.js, pesa mucho, renderiza de forma asíncrona y se tematiza con su propia configuración. **Pele** lee **la misma sintaxis de Mermaid** y la convierte en SVG con un renderizador propio: pequeño, síncrono, sin dependencias en tiempo de ejecución y tematizable con **variables CSS**. Lo desarrolla el equipo de [Obsidian](https://obsidian.md) (el copyright es de kepano, Steph Ango) para pintar diagramas rápido y que hereden el tema del usuario.

No es una alternativa a la sintaxis de Mermaid, sino a su **librería**: tus diagramas existentes siguen valiendo.

## Pele frente a Mermaid.js

Cifras publicadas en [pele.run](https://pele.run) a octubre de 2026:

| Métrica                  | Pele            | Mermaid.js               |
| ------------------------ | --------------- | ------------------------ |
| Tamaño del bundle (gzip) | 230 kB          | 1,6 MB                   |
| Tiempo de renderizado    | 0,05–0,3 ms     | 6–82 ms                  |
| Dependencias directas    | 0               | 23                       |
| Pantallas estrechas      | Adapta el layout | Escala el diagrama       |
| Tematización             | Variables CSS   | Configuración de tema    |

El repositorio incluye `npm run bench:mermaid`, que mide los dos en Chrome headless con los mismos diagramas, para comprobarlo en tu caso.

## Instalación

```bash
npm install pele
```

También se puede cargar desde un CDN y convertir todos los bloques `pre.mermaid` de la página:

```html
<script src="https://cdn.jsdelivr.net/npm/pele@1/dist/pele.global.js"></script>
<script>
  for (const el of document.querySelectorAll("pre.mermaid")) pele.mount(el, el.textContent)
</script>
```

## Renderizar a un string SVG

`render` es síncrono: devuelve el SVG sin `await`, así que sirve igual en el navegador que en Node o en un build estático.

```ts
import { render } from "pele"

const { svg } = render(`flowchart LR
  A[Mermaid text] --> B[SVG]`)

document.querySelector("#diagram").innerHTML = svg
```

## Montar en un elemento del DOM

En el navegador, `mount` renderiza dentro de un elemento, lee las fuentes del CSS y adapta el layout al ancho del contenedor:

```ts
import { mount } from "pele"

mount(document.querySelector("#diagram"), text)
```

Las opciones y el manejo de errores están en la [API](https://pele.run/api).

## Reducir el bundle

La entrada principal incluye todos los tipos de diagrama. Si solo usas algunos, regístralos a mano desde `pele/core`:

```ts
import { register, render } from "pele/core"
import flowchart from "pele/diagrams/flowchart"

register(flowchart)
```

O cárgalos bajo demanda con la entrada `lazy`, que en este caso sí es asíncrona:

```ts
import { renderAsync } from "pele/lazy"

const { svg } = await renderAsync(text)
```

## Tema con variables CSS

Colores y fuentes se definen en el diagrama o en un elemento padre:

```css
.pele {
  --pele-bg: #fffcf0;
  --pele-fg: #100f0f;
  --pele-muted: #6f6e69;
  --pele-line: #100f0f;
  --pele-surface: #f2f0e5;
  --pele-surface-alt: #e6e4d9;
  --pele-border: #cecdc3;
  --pele-accent: #205ea6;
  --pele-font: sans-serif;
  --pele-radius: 4px;
}
```

Los gráficos usan de `--pele-series-1` a `--pele-series-8`. Como los colores son variables, **cambian con el tema sin volver a renderizar**: basta con redefinirlas bajo `[data-theme="dark"]` o una media query. Lista completa en [Theming](https://pele.run/theming).

## Diferencias con Mermaid que conviene conocer

Según la página de [compatibilidad](https://pele.run/compatibility):

- **Tipos soportados:** todos los integrados en Mermaid 12.1.0. ZenUML y otros plugins externos de Mermaid, no.
- **Layout propio:** posición de nodos, espaciado y trazado de aristas cambian respecto a Mermaid.
- **Temas de Mermaid:** los temas y `themeVariables` no se aplican; los colores van por variables CSS.
- **Configuración:** admite frontmatter, directivas `%%{init}%%` y títulos de accesibilidad, pero el soporte varía según el tipo de diagrama.
- **Etiquetas:** texto SVG con saltos de línea, negrita y cursiva; no HTML arbitrario.
- **Interactividad:** los `click` que abren enlaces funcionan; los callbacks de JavaScript se ignoran.
- **Iconos y fórmulas:** iconos como `fa:fa-car` necesitan un resolvedor `icons`, y las etiquetas `$$...$$` muestran el TeX tal cual salvo que pases un resolvedor `math`.

## Seguridad

Pele escapa el texto del diagrama, filtra enlaces y estilos, y limita el tamaño de la fuente, del SVG de salida y el número de aristas en flowcharts. Aun así, si renderizas diagramas que escriben tus usuarios, sigue la guía de [seguridad](https://pele.run/security) para mostrar errores y servir iconos.

## Notas de uso

- Sus parsers se prueban contra las especificaciones del parser de Mermaid y con fuzzing diferencial, pero si un diagrama válido sale mal, compáralo en el playground de [pele.run](https://pele.run) y repórtalo.
- Por defecto el diagrama se encoge para caber en contenedores estrechos; `responsive: false` lo deja a tamaño fijo en píxeles.
- Como `render` devuelve un string, encaja en sitios estáticos y documentación: puedes generar el SVG en el build y no enviar la librería al cliente. Las fuentes no se leen del CSS en ese caso (eso lo hace `mount`), así que comprueba las medidas del texto.

## Fuentes

- [pele.run: documentación, ejemplos y playground](https://pele.run)
- [Compatibilidad con Mermaid](https://pele.run/compatibility)
- [Repositorio obsidianmd/pele](https://github.com/obsidianmd/pele)
