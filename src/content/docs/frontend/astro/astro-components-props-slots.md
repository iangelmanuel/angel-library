---
title: Componentes Astro — props, slots y composición
description: Anatomía de un .astro, props tipadas, slots con nombre, fallback y patrones de composición sin runtime cliente.
type: guides
order: 3
tags: [astro, components, props, slots, typescript]
scope: componentes .astro
related:
  - frontend/astro/astro-layouts
  - frontend/astro/astro-islas
  - frontend/astro/astro-scripts
updatedAt: 2026-08-25
---

Un componente `.astro` tiene un script de componente entre fences y una plantilla. El script corre en build o en el servidor; no se envía al navegador.

## Consulta rápida

| Necesidad                      | Herramienta                                            |
| ------------------------------ | ------------------------------------------------------ |
| recibir datos del padre        | `Astro.props`                                          |
| definir el contrato            | `interface Props`                                      |
| insertar contenido hijo        | `<slot />`                                             |
| crear zonas de contenido       | `<slot name="..." />`                                  |
| aplicar clases condicionales   | `class:list`                                           |
| reenviar atributos HTML        | extraer `...rest` y aplicarlo al elemento              |
| agregar estado de un framework | importar un componente y usar una directiva `client:*` |

## Anatomía de un componente

El bloque delimitado por `---` se conoce como **frontmatter del componente**. Allí se importan módulos, se consultan datos, se validan props y se preparan valores. La plantilla inferior produce HTML. Una variable puede pasar del frontmatter a la plantilla, pero el navegador no recibe automáticamente esa lógica.

```astro title="src/components/Card.astro"
---
interface Props {
  title: string
  href?: string
  featured?: boolean
}

const { title, href = "#", featured = false } = Astro.props
---

<article class:list={{ featured }}>
  <h2><a href={href}>{title}</a></h2>
  <slot />
</article>
```

`Props` documenta la API para TypeScript y el editor. El valor predeterminado de `href` evita que sea `undefined`, mientras `featured` controla una clase sin construir manualmente una cadena. Si una prop procede de una URL o fuente externa, el tipo no reemplaza la validación durante ejecución.

## Reenviar atributos HTML

Un componente contenedor debe permitir atributos como `id`, `aria-label` o `data-*` cuando formen parte de su contrato:

```astro title="src/components/ButtonLink.astro"
---
import type { HTMLAttributes } from "astro/types"

interface Props extends HTMLAttributes<"a"> {
  href: string
  variant?: "primary" | "quiet"
}

const { href, variant = "primary", class: className, ...rest } = Astro.props
---

<a
  href={href}
  class:list={["button", `button--${variant}`, className]}
  {...rest}
>
  <slot />
</a>
```

Aquí `class` se extrae porque es una palabra especial en JavaScript y luego se combina con las clases internas. Reenviar `...rest` conserva capacidades nativas sin inventar una prop para cada atributo posible.

## Slots con nombre

```astro title="src/components/Panel.astro"
<section>
  <header><slot name="header">Sin título</slot></header>
  <div><slot /></div>
  {
    Astro.slots.has("footer") && (
      <footer>
        <slot name="footer" />
      </footer>
    )
  }
</section>
```

```astro
<Panel>
  <h2 slot="header">Resumen</h2>
  <p>Contenido principal.</p>
  <a
    slot="footer"
    href="/detalle"
    >Ver detalle</a
  >
</Panel>
```

`Astro.slots.render('default')` devuelve el slot como string renderizado cuando necesitas transformarlo, pero suele ser mejor conservar `<slot />` para no perder streaming ni introducir manipulación innecesaria de HTML.

## Fragmentos

`<Fragment slot="header">` permite enviar varios nodos a un slot sin agregar un wrapper al HTML final.

## Componentes de framework

Puedes importar React, Vue, Svelte u otro renderer dentro de un componente Astro. Sin una directiva `client:*`, el componente produce HTML pero no se hidrata; con una directiva, Astro agrega el JavaScript necesario según la estrategia elegida.

```astro
---
import SearchBox from "./SearchBox.tsx"
---

<SearchBox
  client:visible
  initialQuery="astro"
/>
```

La directiva pertenece al punto donde se usa el componente, no a su archivo interno. De esta forma una misma pieza puede renderizarse sin JavaScript en un lugar e hidratarse en otro.

## Errores frecuentes

- Esperar que un `console.log()` del frontmatter aparezca en DevTools: se registra durante build o en el servidor.
- Colocar `onClick={...}` en HTML de una plantilla `.astro`: Astro no crea un runtime de eventos; usa un `<script>`, un Web Component o una isla.
- Convertir cada bloque visual en una isla aunque solo produzca contenido estático.
- Renderizar HTML no confiable con `set:html`; esta directiva no sanitiza el contenido.
- Usar slots con nombre sin que el componente hijo declare el slot correspondiente.

## Decisiones prácticas

- Usa componentes Astro para estructura, contenido y UI sin estado.
- Usa `<script>` o Web Components para interacción pequeña.
- Usa una isla de React/Vue/Svelte cuando la interacción realmente necesita estado y ciclo de vida del framework.
- Los atributos desconocidos no se reenvían solos: recoge `...rest` desde `Astro.props` cuando diseñes un componente contenedor.

Referencia oficial: [Astro Components](https://docs.astro.build/en/basics/astro-components/).
