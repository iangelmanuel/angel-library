---
title: Scripts de cliente y eventos
description: Cómo procesa Astro los script, diferencias con is:inline, deduplicación, data attributes y Web Components sin framework.
type: guides
order: 9
tags: [astro, javascript, browser, web-components]
scope: scripts en componentes .astro
related:
  - frontend/astro/astro-components-props-slots
  - frontend/astro/astro-islas
  - frontend/astro/astro-view-transitions
updatedAt: 2026-08-25
---

El frontmatter corre en servidor; un `<script>` en la plantilla corre en navegador. Esa separación explica por qué `window` y `document` no existen entre los fences.

## Elegir la herramienta

| Interacción | Opción |
| --- | --- |
| evento sencillo sobre HTML | `<script>` procesado |
| varias instancias con ciclo de vida propio | Web Component |
| estado complejo o UI reactiva | isla de React, Vue o Svelte |
| script externo que debe conservarse intacto | `is:inline` con `src` |
| valor calculado en servidor | atributo `data-*` o `define:vars` |

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

El script se procesa como módulo. Sus variables no se agregan a `window`, los imports se resuelven desde el proyecto y el navegador lo ejecuta de forma diferida. Si agregas cualquier atributo distinto de `src`, Astro deja de procesarlo como script normal; `is:inline` hace esa decisión explícita.

## `is:inline`

`<script is:inline>` se emite exactamente como está: no resuelve imports, no transforma TypeScript y se repite por cada instancia del componente. Es útil para un script externo o cuando necesitas interpolar HTML de forma muy controlada, no como default.

```astro
<script is:inline src="https://example.com/widget.js"></script>
```

Un tercero puede afectar privacidad, seguridad y rendimiento. Cárgalo solo en las rutas necesarias, revisa su política de datos y evita bloquear el contenido principal mientras descarga.

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

Los atributos convierten valores a texto. Para datos estructurados, serializa de forma segura y vuelve a validar en el cliente. No insertes texto del usuario directamente dentro de un script inline: puede abrir una vulnerabilidad de Cross-Site Scripting (XSS).

## Eventos y limpieza

Para elementos que aparecen dinámicamente, la delegación evita registrar un listener por nodo:

```ts
document.addEventListener('click', (event) => {
  const button = (event.target as Element).closest<HTMLButtonElement>('[data-copy]');
  if (!button) return;
  navigator.clipboard.writeText(button.dataset.copy ?? '');
});
```

Cuando registras listeners en `window`, timers u observadores desde un componente que puede desmontarse, conserva una referencia y elimínalos. Los Web Components ofrecen `disconnectedCallback()` para esa limpieza.

Con `<ClientRouter />`, los módulos no se vuelven a ejecutar en cada navegación. Inicializa el comportamiento de la página en `astro:page-load` o diseña custom elements cuyo `connectedCallback()` responda al nuevo DOM.

```ts
document.addEventListener('astro:page-load', () => {
  document.querySelector<HTMLInputElement>('[autofocus]')?.focus();
});
```

Evita volver a registrar listeners globales en cada evento. Una función de inicialización debe ser idempotente —ejecutarla dos veces produce el mismo resultado— o debe limpiar el registro anterior.

## Diagnóstico rápido

- Si `document` no existe, el código está en frontmatter o en un módulo evaluado por el servidor.
- Si un evento funciona una sola vez, revisa las navegaciones con ClientRouter.
- Si solo responde la primera instancia, el script probablemente usa `querySelector` en lugar de `querySelectorAll`.
- Si un import falla dentro de `is:inline`, recuerda que Astro no lo empaqueta.

Referencia oficial: [Scripts and event handling](https://docs.astro.build/en/guides/client-side-scripts/).
