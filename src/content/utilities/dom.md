---
title: DOM Utils — Referencia rápida
description: Utilidades mínimas y declarativas para seleccionar y manipular el DOM desde scripts de navegador.
category: general
stack: utils
runtime: browser
language: typescript
related:
  - utilities/form
updatedAt: 2026-08-15
---

Utilidades mínimas y declarativas para manipular el DOM. Importa siempre desde `@/libs/dom`.

Solo existen aquí las funciones que el sitio realmente usa. Si necesitas algo que no está, primero considera si `element.querySelector` directo es más claro que agregar otro helper.

## Tipos y concordancia

`$()`, `$opt()` y `$$()` son genéricas: `<T extends Element = HTMLElement>`. Sin especificar el genérico, devuelven `HTMLElement` — no `Element` — porque es lo que casi siempre estás seleccionando (botones, inputs, divs) y porque `on()`, `onAll()`, `show()` y `hide()` piden `HTMLElement`. Con `Element` como default, el resultado de `$()` no encajaba directo en esas funciones y tocaba tipar todo a mano.

Con `HTMLElement` de default, esto ya funciona sin genéricos explícitos:

```ts
import { $, on } from '@/libs/dom';

const boton = $('[data-submit]');
on(boton, 'click', () => {});
```

Solo especifica el genérico cuando necesites propiedades de un subtipo concreto (`.value` en `HTMLInputElement`, `.checked` en checkboxes) o cuando selecciones algo que no es `HTMLElement` (un `SVGElement`, por ejemplo).

## Selectores

### `$()` — Elemento requerido

Busca el primer elemento que coincida con el selector dentro del ámbito indicado. A diferencia de `querySelector`, garantiza que el resultado exista: lanza un error si no encuentra el elemento. Úsala cuando el elemento sea imprescindible para que el script funcione correctamente.

```ts title="lib/dom.ts"
export function $<T extends Element = HTMLElement>(
  selector: string,
  root: ParentNode = document
): T {
  const el = root.querySelector<T>(selector)
  if (!el) throw new Error(`DOM: elemento no encontrado: ${selector}`)
  return el
}
```

```ts
import { $ } from '@/libs/dom';

// Selector global
const boton = $<HTMLButtonElement>('[data-submit]');

// Buscar dentro de un elemento
const input = $<HTMLInputElement>('[data-email]', formulario);
```

### `$opt()` — Elemento opcional

Busca el primer elemento que coincida con el selector, pero permite que no exista. Retorna el elemento encontrado o `null` cuando no hay coincidencias. Es útil para componentes, páginas o estados donde un elemento puede estar ausente de forma válida.

```ts title="lib/dom.ts"
export function $opt<T extends Element = HTMLElement>(
  selector: string,
  root: ParentNode = document
): T | null {
  return root.querySelector<T>(selector)
}
```

```ts
import { $opt } from '@/libs/dom';

const modal = $opt<HTMLDivElement>('[data-modal]');
if (modal) show(modal);
```

### `$$()` — Todos los elementos

Busca todos los elementos que coincidan con el selector dentro del ámbito indicado. Siempre retorna un array real, vacío si no hay coincidencias, en lugar de un `NodeList`. Esto permite recorrer los resultados directamente con `forEach`, transformarlos con `map` o filtrarlos con `filter`.

```ts title="lib/dom.ts"
export function $$<T extends Element = HTMLElement>(
  selector: string,
  root: ParentNode = document
): T[] {
  return Array.from(root.querySelectorAll<T>(selector))
}
```

```ts
import { $$ } from '@/libs/dom';

const items = $$<HTMLLIElement>('[data-item]');
items.forEach((item) => console.log(item.textContent));

// Buscar dentro de un contenedor
const campos = $$<HTMLInputElement>('[data-field]', formulario);
```

## Mostrar / Ocultar

### `show()` — Mostrar elementos

Desactiva el atributo booleano `hidden` de un elemento o de cada elemento de un array. El elemento vuelve a participar visualmente en el layout según sus estilos habituales.

```ts
export function show(el: HTMLElement | HTMLElement[]): void {
  const elementos = Array.isArray(el) ? el : [el]
  elementos.forEach((e) => {
    e.hidden = false
  })
}
```

```ts
import { show } from '@/libs/dom';

show(mensajeFinal);
```

### `hide()` — Ocultar elementos

Activa el atributo booleano `hidden` de un elemento o de cada elemento de un array. Esto oculta los elementos de forma semántica y hace que dejen de ocupar espacio en el layout.

```ts
export function hide(el: HTMLElement | HTMLElement[]): void {
  const elementos = Array.isArray(el) ? el : [el]
  elementos.forEach((e) => {
    e.hidden = true
  })
}
```

```ts
import { hide } from '@/libs/dom';

hide([cargador1, cargador2]);
```

## CSS Variables

### `getCssVar()` — Leer variable CSS

Lee el valor calculado directamente custom property CSS desde el elemento indicado. El tercer argumento permite proporcionar un valor por defecto cuando la variable no está definida o no produce un valor útil, evitando repetir comprobaciones en cada llamada.

```ts title="lib/dom.ts"
export function getCssVar(
  el: Element | null | undefined,
  varName: string,
  fallback = ""
): string {
  if (!el) return fallback
  return getComputedStyle(el).getPropertyValue(varName).trim() || fallback
}
```

```ts
import { getCssVar } from '@/libs/dom';

const azul = getCssVar(elemento, '--color-verlun-blue', '#2547FF');
```

## Event Listeners

Ambas funciones retornan una función para desuscribirse.

### `on()` — Agregar listener

Registra un event listener sobre un elemento y retorna una función de limpieza. Guarda esa función cuando el listener deba eliminarse al desmontar un componente, cambiar de página o finalizar un ciclo de vida.

```ts title="lib/dom.ts"
export function on<K extends keyof HTMLElementEventMap>(
  el: HTMLElement | Window | Document | null | undefined,
  type: K,
  listener: (ev: HTMLElementEventMap[K]) => void,
  options?: AddEventListenerOptions
): () => void {
  if (!el) return () => {}
  el.addEventListener(type as string, listener as EventListener, options)
  return () => {
    el.removeEventListener(type as string, listener as EventListener, options)
  }
}
```

```ts
import { on } from '@/libs/dom';

const limpiar = on(boton, 'click', () => console.log('Clickeado'));

// Remover después
limpiar();
```

### `onAll()` — Mismo listener en varios eventos

Registra el mismo handler para varios tipos de evento y retorna una única función para desuscribirlos todos. Es útil cuando una actualización debe reaccionar, por ejemplo, tanto a cambios de texto como a cambios de selección en un formulario.

```ts title="lib/dom.ts"
export function onAll<K extends keyof HTMLElementEventMap>(
  el: HTMLElement | Window | Document | null | undefined,
  types: K[],
  listener: (ev: HTMLElementEventMap[K]) => void,
  options?: AddEventListenerOptions
): () => void {
  const remover = types.map((type) => on(el, type, listener, options))
  return () => remover.forEach((remove) => remove())
}
```

```ts
import { onAll } from '@/libs/dom';

const limpiar = onAll(formulario, ['input', 'change'], actualizarContador);
```

## Observers

Todos retornan una función para dejar de observar.

### `onVisible()` — Visibilidad en viewport

Observa si un elemento entra o sale del viewport usando `IntersectionObserver`. El handler recibe un booleano con el estado actual de visibilidad y la función retornada detiene la observación. Las opciones permiten controlar qué proporción del elemento debe ser visible antes de activar el callback.

```ts title="lib/dom.ts"
export function onVisible(
  el: Element | null | undefined,
  callback: (visible: boolean) => void,
  options?: IntersectionObserverInit
): () => void {
  if (!el) return () => {}
  const observer = new IntersectionObserver(
    ([entry]) => callback(entry.isIntersecting),
    options
  )
  observer.observe(el)
  return () => observer.disconnect()
}
```

```ts
import { onVisible } from '@/libs/dom';

const limpiar = onVisible(seccion, (visible) => {
  if (visible) iniciarAnimacion();
});

// Con opciones: threshold indica cuándo se activa
onVisible(elemento, handler, { threshold: 0.5 });
```

### `onResize()` — Cambios de tamaño

Observa los cambios de tamaño de un elemento mediante `ResizeObserver`. Cada vez que cambia, el handler recibe su rectángulo calculado para poder sincronizar un canvas, recalcular un layout o actualizar medidas derivadas. La función retornada desconecta el observer.

```ts title="lib/dom.ts"
export function onResize(
  el: Element | null | undefined,
  callback: (rect: DOMRect) => void
): () => void {
  if (!el) return () => {}
  const observer = new ResizeObserver(() =>
    callback(el.getBoundingClientRect())
  )
  observer.observe(el)
  return () => observer.disconnect()
}
```

```ts
import { $, onResize } from '@/libs/dom';

const canvas = $<HTMLCanvasElement>('[data-canvas]');

const limpiar = onResize(canvas, (rect) => {
  canvas.width = rect.width;
  canvas.height = rect.height;
  redibujar();
});
```

### `onMutation()` — Cambios en el DOM

Observa mutaciones en el elemento indicado, como cambios de atributos, texto o nodos hijos, según las opciones configuradas. El handler se ejecuta cuando ocurre una mutación y la función retornada deja de observar. Por ejemplo, sirve para reaccionar a cambios de `data-theme` en `<html>`.

```ts title="lib/dom.ts"
export function onMutation(
  el: Element | null | undefined,
  callback: (cambios: MutationRecord[]) => void,
  options: MutationObserverInit = {
    attributes: true,
    childList: true,
    subtree: true
  }
): () => void {
  if (!el) return () => {}
  const observer = new MutationObserver(callback)
  observer.observe(el, options)
  return () => observer.disconnect()
}
```

```ts
import { onMutation } from '@/libs/dom';

const limpiar = onMutation(document.documentElement, actualizarColores, {
  attributes: true,
  attributeFilter: ['data-theme'],
});
```

## Resumen

| Función | Qué hace |
| --- | --- |
| `$()` | Seleccionar un elemento requerido; lanza error si falta |
| `$opt()` | Seleccionar un elemento opcional; retorna `null` si falta |
| `$$()` | Seleccionar todos los elementos que coincidan |
| `show()` | Mostrar elemento(s) |
| `hide()` | Ocultar elemento(s) |
| `getCssVar()` | Leer una variable CSS calculada |
| `on()` | Agregar un event listener |
| `onAll()` | Agregar el mismo listener a varios eventos |
| `onVisible()` | Observar entrada y salida del viewport |
| `onResize()` | Observar cambios de tamaño |
| `onMutation()` | Observar cambios en el DOM |

## Consideraciones

- Usa `$()` cuando la ausencia del elemento indique un error de programación.
- Usa `$opt()` para elementos condicionales o páginas que no siempre incluyen el mismo markup.
- `$$()` devuelve un array real, por lo que puedes usar `map`, `filter` y `forEach` sin conversiones.
- Conserva la función de limpieza de listeners y observers cuando el ciclo de vida del script lo requiera.
- Si seleccionas algo que no es HTML (un `<svg>`, por ejemplo) especifica el genérico: `$<SVGElement>(...)`. Sin eso, TypeScript lo trata como `HTMLElement` y las propiedades específicas de SVG no van a estar disponibles.
