---
title: Componentes Astro — props, slots y composición
description: Anatomía de un .astro, props tipadas, slots con nombre, fallback y patrones de composición sin runtime cliente.
category: frontend
stack: astro
order: 1
tags: [astro, components, props, slots, typescript]
scope: componentes .astro
related:
  - guides/astro-layouts
  - guides/astro-islas
  - guides/astro-scripts
updatedAt: 2026-08-18
---

Un componente `.astro` tiene un script de componente entre fences y una plantilla. El script corre en build o en el servidor; no se envía al navegador.

```astro title="src/components/Card.astro"
---
interface Props {
  title: string;
  href?: string;
  featured?: boolean;
}

const { title, href = '#', featured = false } = Astro.props;
---

<article class:list={{ featured }}>
  <h2><a href={href}>{title}</a></h2>
  <slot />
</article>
```

## Slots con nombre

```astro title="src/components/Panel.astro"
<section>
  <header><slot name="header">Sin título</slot></header>
  <div><slot /></div>
  {Astro.slots.has('footer') && <footer><slot name="footer" /></footer>}
</section>
```

```astro
<Panel>
  <h2 slot="header">Resumen</h2>
  <p>Contenido principal.</p>
  <a slot="footer" href="/detalle">Ver detalle</a>
</Panel>
```

`Astro.slots.render('default')` devuelve el slot como string renderizado cuando necesitas transformarlo, pero suele ser mejor conservar `<slot />` para no perder streaming ni introducir manipulación innecesaria de HTML.

## Fragmentos

`<Fragment slot="header">` permite enviar varios nodos a un slot sin agregar un wrapper al HTML final.

## Decisiones prácticas

- Usa componentes Astro para estructura, contenido y UI sin estado.
- Usa `<script>` o Web Components para interacción pequeña.
- Usa una isla de React/Vue/Svelte cuando la interacción realmente necesita estado y ciclo de vida del framework.
- Los atributos desconocidos no se reenvían solos: recoge `...rest` desde `Astro.props` cuando diseñes un componente contenedor.

Referencia oficial: [Astro Components](https://docs.astro.build/en/basics/astro-components/).
