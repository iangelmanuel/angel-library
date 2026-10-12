---
title: "SVGL — logos de marcas y productos en SVG"
description: Biblioteca abierta de logos de empresas, frameworks y herramientas en SVG optimizado, con variantes claro/oscuro, API pública sin autenticación, registro para shadcn/ui y extensiones de la comunidad.
tags: [icons, svg, logos, marcas, ui, api, shadcn]
draft: false
resourceCategory: icons
official: true
url: https://svgl.app
github: https://github.com/pheralb/svgl
technologies: [resources/icons/heroicons, resources/icons/tabler-icons, resources/ui-inspiration/ricoui-brands]
note: "La licencia MIT cubre el código del proyecto, no los logos: cada logo es una marca registrada de su dueño y su uso se rige por las normas de marca de esa empresa."
warnings:
  - "No uses un logo de forma que sugiera patrocinio, alianza o respaldo de la marca sin permiso."
  - "La API tiene límite de peticiones (sin cifra publicada) y prohíbe usarla para crear un producto igual a SVGL."
updatedAt: 2026-10-12
---

**SVGL** es una biblioteca de logos en SVG de empresas, productos y tecnologías: frameworks, lenguajes, bases de datos, servicios de hosting, herramientas de IA, redes sociales… A octubre de 2026 la web mostraba **670 logos** en 41 categorías (Software, Library, AI, Design, Framework, Database, Hosting, Social, entre otras). La creó [pheralb](https://github.com/pheralb) y es open source (MIT, unas 6.300 estrellas en GitHub).

A diferencia de [Heroicons](/resources/icons/heroicons) o [Tabler Icons](/resources/icons/tabler-icons), que son iconos genéricos dibujados con un mismo estilo, SVGL reúne **logos oficiales de marcas**: lo que necesitas para una sección "Tecnologías que usamos", una lista de integraciones o un botón "Continuar con GitHub".

## Qué ofrece cada logo

- **SVG optimizado** listo para copiar o descargar, con el `viewBox` intacto.
- **Variantes claro y oscuro** cuando la marca las tiene, para que el logo no desaparezca sobre fondo negro.
- **Wordmark** (el logo con el nombre escrito) en los que lo incluyen.
- Enlace al sitio de la marca y, en algunos, a su guía de marca (`brandUrl`).

## Formas de usarlo

### Desde la web

Busca el logo en [svgl.app](https://svgl.app), elige la variante y copia el SVG. Es lo más directo para un uso puntual.

### Como componente con shadcn/ui

SVGL publica un registro compatible con el CLI de shadcn/ui, que instala cada logo como componente `.tsx` en tu proyecto. Primero se declara el registro en `components.json`:

```json
{
  "registries": {
    "@svgl": "https://svgl.app/r/{name}.json"
  }
}
```

Y luego se añaden los logos, uno o varios a la vez:

```bash
npx shadcn@latest add @svgl/github @svgl/supabase @svgl/vercel
```

Con ese registro configurado, el MCP de shadcn (`npx shadcn@latest mcp init --client claude`, también con `cursor` o `vscode`) permite pedirle a un agente "añade el SVG de GitHub del registro de SVGL". Un MCP es un servidor que da herramientas extra a un agente de IA; ver [MCP de Playwright](/skills/ia-mcp/mcp-playwright) como ejemplo.

### API pública

La API no requiere autenticación y devuelve JSON:

| Endpoint                                  | Qué devuelve                                    |
| ----------------------------------------- | ----------------------------------------------- |
| `https://api.svgl.app`                    | Todos los logos                                 |
| `https://api.svgl.app?limit=10`           | Los primeros N                                  |
| `https://api.svgl.app?search=axiom`       | Búsqueda por título                             |
| `https://api.svgl.app/category/software`  | Logos de una categoría                          |
| `https://api.svgl.app/categories`         | Categorías con su total                         |
| `https://api.svgl.app/svg/adobe.svg`      | El código SVG (añade `?no-optimize` para el original) |

Cada logo trae `id`, `title`, `category`, `route` (texto o un objeto `{ light, dark }`), `url` y, si los tiene, `wordmark` y `brandUrl`.

```js
const res = await fetch("https://api.svgl.app?search=github")
const logos = await res.json()
console.log(logos[0].route) // URL del SVG o { light, dark }
```

La documentación pide **cachear las respuestas** (por ejemplo unos minutos) porque hay límite de peticiones, y aclara que la API está pensada para extensiones, plugins y herramientas para la comunidad, **no para construir un producto igual a SVGL**.

### Extensiones de la comunidad

Sobre la API se han construido extensiones para Raycast, VS Code, Figma, Framer, PowerToys, Flow Launcher, PowerShell, componentes para React, Vue y Svelte, un generador de badges y un CLI. El CLI es `svgls` (de sujjeee):

```bash
npx svgls add github vercel supabase
```

La lista completa está en [svgl.app/extensions](https://svgl.app/extensions). Son proyectos de terceros, no del autor de SVGL.

## Aportar un logo

Se hace por pull request al repositorio: el `.svg` va en `static/library` y su entrada en `src/data/svgs.ts`. Requisitos del README:

- Tener derecho a usarlo y que su licencia permita añadirlo.
- Optimizarlo para web (sugieren SVGOMG) sin quitar el `viewBox`.
- No superar **21 KB** por archivo.

## Marcas registradas: lo que hay que saber

Que un logo esté en SVGL no te da permiso para usarlo como quieras. Los logos son **marcas registradas** de sus empresas, y casi todas publican una guía de marca con reglas sobre colores, proporciones, espacio de respeto y contextos permitidos.

Usos habitualmente aceptables: indicar que tu producto se integra con un servicio, enseñar tu stack o enlazar a la marca. Usos problemáticos: modificar el logo, usarlo como icono de tu propia app o colocarlo de forma que parezca que la marca te patrocina. Ante la duda, consulta la guía de marca (SVGL la enlaza cuando la conoce) o pregunta a la empresa.

## Cuándo conviene

- Secciones de tecnologías, integraciones o "confían en nosotros".
- Botones de inicio de sesión social.
- Documentación y portfolios.

Si lo que necesitas son iconos de interfaz (flechas, menús, acciones), usa una familia de iconos como Heroicons o Tabler; mezclar logos de marca con iconos de UI no da un estilo consistente.

## Fuentes

- [svgl.app](https://svgl.app)
- [Repositorio pheralb/svgl](https://github.com/pheralb/svgl)
- [Documentación de la API](https://svgl.app/api)
- [Integración con shadcn/ui](https://svgl.app/docs/shadcn-ui)
- [CLI svgls](https://github.com/sujjeee/svgls)
