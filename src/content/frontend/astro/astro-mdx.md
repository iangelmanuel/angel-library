---
title: MDX en Astro
description: Cuándo combinar Markdown con componentes, configurar la integración y mantener contenido portable sin abusar de JSX.
type: guides
order: 25
tags: [astro, mdx, markdown, content]
scope: "@astrojs/mdx"
related:
  - frontend/astro/astro-content-collections
  - frontend/astro/astro-components-props-slots
  - frontend/astro/astro-integrations
updatedAt: 2026-08-25
---

MDX permite importar y usar componentes dentro de Markdown. Conviene cuando una entrada necesita demos, tabs o visualizaciones que no se expresan bien con Markdown normal.

MDX significa **Markdown + JSX**. Conserva la escritura de Markdown, pero su archivo pasa a formar parte del código compilado: puede importar componentes, evaluar expresiones y fallar el build. Esa potencia debe reservarse para contenido que realmente la necesita.

## Elección rápida

| Contenido | Formato |
| --- | --- |
| artículo con texto, tablas y código | Markdown |
| demo o componente interactivo entre párrafos | MDX |
| datos estructurados consumidos por varias vistas | Content Collection con esquema |
| contenido escrito por usuarios no confiables | formato sanitizado; no MDX ejecutable |

## Instalar

```bash
npx astro add mdx
```

El comando instala `@astrojs/mdx` y agrega la integración a `astro.config.mjs`. Revisa el cambio antes de continuar, especialmente si la configuración ya contiene integraciones u opciones de Markdown personalizadas.

```mdx title="src/content/blog/demo.mdx"
---
title: Demo interactiva
---

import Callout from '../../components/Callout.astro';

# Ejemplo

<Callout type="warning">Este bloque es un componente real.</Callout>
```

Las importaciones usan rutas relativas al archivo MDX. Si muchas entradas repiten la misma importación, considera un mapa de componentes o un componente Markdown convencional antes de agregar alias especiales difíciles de mover.

## Markdown o MDX

- `.md`: contenido portable, simple, fácil de buscar y transformar.
- `.mdx`: contenido acoplado a componentes y al runtime de compilación del proyecto.

No conviertas toda la biblioteca a MDX “por si acaso”. Si una entrada solo necesita texto, tablas y bloques de código, Markdown conserva una superficie más pequeña y menos posibilidades de romper el build.

## Componentes globales

Puedes pasar un mapa de componentes al renderizar o configurar componentes reutilizables para reemplazar etiquetas como `h2` y `a`. Evita cambiar la semántica HTML: un componente visual debe seguir produciendo encabezados, enlaces y controles accesibles.

También puedes exportar valores desde MDX e importar datos en él, pero no conviertas el documento en una aplicación difícil de leer. Mantén la lógica de negocio en módulos reutilizables y usa MDX como capa de composición editorial.

## MDX dentro de Content Collections

Una entrada MDX puede usar el mismo esquema, referencias y consultas de una colección. Al renderizarla, Astro devuelve un componente de contenido:

```astro
---
const entry = await getEntry('guides', 'astro-mdx');
if (!entry) throw new Error('Guía no encontrada');
const { Content } = await render(entry);
---

<article><Content /></article>
```

El esquema valida frontmatter; no valida automáticamente las props que envías a cada componente incrustado.

## Seguridad

MDX ejecuta importaciones y expresiones durante el build o renderizado. Trata los archivos MDX como código confiable; no compiles contenido arbitrario enviado por usuarios.

## Errores frecuentes

- Elegir MDX solo para estilizar encabezados que podían resolverse durante el render.
- Importar un componente cliente sin decidir cuándo hidratarlo.
- Permitir que un CMS o formulario escriba MDX ejecutable sin una frontera de confianza.
- Colocar consultas y lógica compleja dentro de cada documento.
- Acoplar el contenido a props internas que cambian con frecuencia.

Referencia oficial: [MDX integration](https://docs.astro.build/en/guides/integrations-guide/mdx/).
