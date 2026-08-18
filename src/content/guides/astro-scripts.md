---
title: Scripts de cliente y eventos
description: Cómo procesa Astro los script, diferencias con is:inline, deduplicación, data attributes y Web Components sin framework.
category: frontend
stack: astro
order: 7
tags: [astro, javascript, browser, web-components]
scope: scripts en componentes .astro
related:
  - guides/astro-components-props-slots
  - guides/astro-islas
  - guides/astro-view-transitions
updatedAt: 2026-08-18
---

El frontmatter corre en servidor; un `<script>` en la plantilla corre en navegador. Esa separación explica por qué `window` y `document` no existen entre los fences.

## Script procesado

Un `<script>` sin atributos extra obtiene TypeScript, bundling, imports, `type="module"`, deduplicación y posible inline automático.

```astro
<button data-copy>Copiar</button>

<script>
  document.querySelectorAll<HTMLButtonElement>('[data-copy]').forEach((button) => {
    button.addEventListener('click', () => navigator.clipboard.writeText('texto'));
  });
</script>
```

Aunque el componente aparezca diez veces, el script procesado se incluye una vez. Por eso debe encontrar todas las instancias o encapsularse en un custom element.

## `is:inline`

`<script is:inline>` se emite exactamente como está: no resuelve imports, no transforma TypeScript y se repite por cada instancia del componente. Es útil para un script externo o cuando necesitas interpolar HTML de forma muy controlada, no como default.

## Pasar datos del servidor

Usa atributos `data-*` o `define:vars`. Para componentes repetidos, un custom element mantiene cada instancia aislada.

```astro
---
const { message } = Astro.props;
---
<astro-alert data-message={message}><button>Mostrar</button></astro-alert>
<script>
  class AstroAlert extends HTMLElement {
    connectedCallback() {
      this.querySelector('button')?.addEventListener('click', () => alert(this.dataset.message));
    }
  }
  if (!customElements.get('astro-alert')) customElements.define('astro-alert', AstroAlert);
</script>
```

Con `<ClientRouter />`, los módulos no se vuelven a ejecutar en cada navegación. Inicializá comportamiento por página en `astro:page-load` o diseña custom elements cuyo `connectedCallback()` responda al nuevo DOM.

Referencia oficial: [Scripts and event handling](https://docs.astro.build/en/guides/client-side-scripts/).
