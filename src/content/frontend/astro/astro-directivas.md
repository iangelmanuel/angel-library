---
title: Directivas de plantilla — set:html, class:list y más
description: Atributos especiales de Astro para inyectar HTML crudo, armar clases condicionales y pasar variables al cliente.
type: guides
order: 6
tags: [astro, templating]
scope: sintaxis de archivos .astro
updatedAt: 2026-08-25
---

Las directivas son atributos especiales que Astro reconoce en el compilador — no llegan al HTML final tal cual, cambian *cómo* se genera el elemento antes de renderizarlo. Se distinguen de un atributo normal por el `:` en el nombre (`class:list`, `set:html`...). Estas cuatro son las que más se usan día a día escribiendo componentes `.astro`.

## `class:list` — Clases condicionales

Convierte un array de strings, objetos y arrays anidados en un solo string de clases. Los objetos aportan la clase solo si el valor es truthy — reemplaza `clsx`/`classnames` para casos simples.

```astro
<span class:list={['base', { activo: isActivo, disabled: isDisabled }, ['extra']]} />
<!-- Si isActivo=true y isDisabled=false: class="base activo extra" -->
```

## `set:html` — HTML crudo

Inyecta un string como HTML real en vez de texto escapado. Reemplaza el contenido del elemento — no se puede combinar con hijos dentro de las etiquetas.

```astro
<h1 set:html={tituloConMarkup} />
<script set:html={JSON.stringify(datosJsonLd)} />
```

## `set:text` — Texto escapado

Igual que `set:html` pero escapando el contenido — úsala en vez de interpolar `{variable}` cuando el string puede venir directamente fuente no confiable y no quieres que se interprete como HTML.

```astro
<div set:text={comentarioDelUsuario} />
```

## `define:vars` — Variables del servidor en CSS/JS

Pasa variables del frontmatter a un `<style>` o `<script>` del mismo componente, serializadas a JSON. En CSS quedan como custom properties; en JS, como variables normales.

```astro
---
const colorTexto = '#60a5fa';
const mensaje = 'Hola';
---
<style define:vars={{ colorTexto }}>
  h1 { color: var(--colorTexto); }
</style>

<script define:vars={{ mensaje }}>
  alert(mensaje);
</script>
```

## Mapa de directivas

| Directiva | Qué hace |
| --- | --- |
| `class:list` | Arma un string de clases desde array/objeto, con condicionales |
| `set:html` | Inyecta HTML crudo (sin escapar) |
| `set:text` | Inyecta texto escapado, reemplazando hijos |
| `define:vars` | Pasa variables del frontmatter a `<style>`/`<script>` |

## Seguridad y límites de plantilla

- `set:html` es una puerta de entrada común a XSS en un proyecto Astro — úsala solo con contenido que tú generes o que ya hayas sanitizado (Markdown renderizado o JSON-LD creado por la aplicación).
- `set:html`/`set:text` reemplazan **todo** el contenido del elemento: no funcionan junto con hijos declarados entre las etiquetas.
- `define:vars` serializa con `JSON.stringify` por debajo — no le pases funciones ni referencias circulares.
