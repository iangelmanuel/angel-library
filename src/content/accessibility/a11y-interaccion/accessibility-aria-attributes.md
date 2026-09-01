---
title: Atributos ARIA — nombres, estados y relaciones
description: Referencia práctica para usar aria-label, aria-labelledby, aria-describedby, estados, relaciones, regiones en vivo y roles sin reemplazar HTML nativo.
type: guides
order: 2
tags: [accessibility, aria, html, screen-reader, semantics]
scope: atributos y roles ARIA
related:
  - accessibility/a11y-interaccion/accessibility-semantics-keyboard-focus
  - accessibility/a11y-interaccion/accessibility-forms-validation
  - accessibility/a11y-interaccion/accessibility-dialogs-live-regions
  - accessibility/a11y-testing/accessibility-testing-manual-automatico
updatedAt: 2026-08-19
---

**ARIA** significa *Accessible Rich Internet Applications* o aplicaciones de internet enriquecidas accesibles. Sus atributos comunican al **árbol de accesibilidad** el nombre, rol, estado o relación de un elemento cuando HTML no puede expresarlos por sí solo.

ARIA no agrega comportamiento, foco, teclado, estilos ni validación. Escribir `<div role="button">` hace una promesa: el código todavía debe implementar activación con teclado, foco, estado deshabilitado y todos los comportamientos de un botón. Por eso, `<button>` sigue siendo la primera opción.

## Regla principal: HTML antes que ARIA

```html
<!-- Correcto: semántica y teclado incorporados. -->
<button type="button">Guardar</button>

<!-- Evitar: obliga a reconstruir el comportamiento nativo. -->
<div role="button" tabindex="0">Guardar</div>
```

Antes de agregar ARIA, sigue este orden:

1. Busca un elemento HTML con la semántica correcta.
2. Proporciona texto visible mediante `label`, `legend`, `caption` o contenido del control.
3. Usa atributos HTML nativos como `required`, `disabled`, `readonly`, `open` o `alt`.
4. Agrega ARIA únicamente para completar información que HTML no expresa.
5. Prueba nombre, rol, estado, foco y teclado con tecnología asistiva.

ARIA incorrecto puede comunicar una interfaz distinta de la que aparece en pantalla. Un atributo no debe agregarse “por si acaso”.

## Nombre, descripción y texto visible

El **nombre accesible** identifica un elemento de forma breve. La **descripción accesible** proporciona ayuda o contexto adicional. No son intercambiables.

| Técnica | Cuándo usarla | Ejemplo |
| --- | --- | --- |
| Texto interno | Botón o enlace con texto visible | `<button>Guardar</button>` |
| `<label for>` | Nombre visible de un control de formulario | `<label for="email">Correo</label>` |
| `<legend>` | Nombre de un grupo dentro de `fieldset` | Métodos de pago |
| `alt` | Alternativa de una imagen informativa | `<img alt="Ventas por trimestre">` |
| `aria-labelledby` | El texto visible ya existe en otro elemento | Diálogo nombrado por su título |
| `aria-label` | No existe texto visible apropiado para nombrar el control | Botón que solo muestra un icono |
| `aria-describedby` | Ayuda, formato, requisito o error adicional | Instrucciones de contraseña |
| `aria-details` | Explicación extensa o estructurada que debe poder recorrerse | Descripción detallada de un gráfico |

### `aria-label`: nombre escrito directamente

```html
<button type="button" aria-label="Cerrar diálogo">
  <svg aria-hidden="true" focusable="false"><!-- icono X --></svg>
</button>
```

Úsalo cuando el control necesita nombre pero el diseño no contiene texto visible adecuado, como un botón de icono. El valor describe el propósito —“Cerrar diálogo”—, no la apariencia —“Icono X”—.

Evita `aria-label` cuando ya existe un texto visible que puede utilizarse. El valor es invisible, puede quedar sin traducir y puede sobrescribir el nombre que el elemento obtenía de su contenido.

```html
<!-- Evitar: la pantalla dice Guardar y el lector anuncia Enviar formulario. -->
<button aria-label="Enviar formulario">Guardar</button>

<!-- Correcto: el texto visible ya proporciona el nombre. -->
<button>Guardar</button>
```

Cuando existe una etiqueta visible, el nombre accesible debe contener ese texto. Esto permite que una persona que utiliza control por voz diga la palabra que está viendo.

No uses `aria-label` para agregar explicaciones a párrafos, `div`, listas o encabezados. Muchos elementos estáticos no deben recibir un nombre accesible y algunos lectores pueden ignorarlo o presentar información confusa.

### `aria-labelledby`: nombrar con texto existente

`aria-labelledby` recibe uno o varios identificadores separados por espacios. El texto de esos elementos forma el nombre en el mismo orden.

```html
<section role="dialog" aria-modal="true" aria-labelledby="dialog-title">
  <h2 id="dialog-title">Eliminar proyecto</h2>
  <p>Esta acción no se puede deshacer.</p>
</section>
```

Es preferible a repetir el título dentro de `aria-label`: el texto visible y el nombre accesible permanecen sincronizados. Cada `id` debe existir y ser único en el documento.

```html
<span id="billing-label">Dirección</span>
<span id="billing-context">de facturación</span>
<div role="group" aria-labelledby="billing-label billing-context">
  <!-- campos -->
</div>
```

Para formularios, un `<label>` nativo sigue siendo mejor porque al pulsarlo también se activa o enfoca el control. `aria-labelledby` comunica el nombre, pero no agrega esa interacción.

### `aria-describedby`: información adicional

```html
<label for="password">Contraseña</label>
<p id="password-help">Usa al menos 12 caracteres.</p>
<p id="password-error">La contraseña es demasiado corta.</p>
<input
  id="password"
  type="password"
  aria-describedby="password-help password-error"
  aria-invalid="true"
/>
```

El control continúa llamándose “Contraseña”; después puede anunciar la ayuda y el error. No coloques el nombre principal únicamente en `aria-describedby`.

Si la explicación contiene listas, enlaces o una tabla que la persona debe explorar, considera `aria-details`. El soporte puede variar, por lo que el contenido también debe permanecer visible y cercano.

## `role`: qué clase de elemento es

El atributo `role` cambia cómo se presenta un elemento a tecnologías asistivas. No lo uses para repetir la semántica que HTML ya incluye.

```html
<!-- Redundante. -->
<button role="button">Comprar</button>

<!-- Preferible. -->
<button>Comprar</button>
```

| Necesidad | HTML preferido | Evita reemplazarlo por |
| --- | --- | --- |
| Acción | `<button>` | `<div role="button">` |
| Navegación | `<a href="…">` | `<span role="link">` |
| Casilla | `<input type="checkbox">` | `<div role="checkbox">` |
| Encabezado | `<h1>`–`<h6>` | `<div role="heading" aria-level="2">` |
| Navegación principal | `<nav>` | `<div role="navigation">` |
| Contenido principal | `<main>` | `<div role="main">` |

Roles como `tab`, `menu`, `tree`, `grid` o `combobox` representan widgets completos. Cada patrón tiene estructura, relaciones y comportamiento de teclado propios. Un menú ARIA no es cualquier lista de enlaces y unas pestañas no son solo botones alineados.

## Estados y propiedades frecuentes

El estado ARIA debe reflejar la interfaz **en este momento**. Si el panel se cierra, `aria-expanded` debe cambiar a `false`; si un error se corrige, `aria-invalid` debe retirarse o volver a `false`.

| Atributo | Qué comunica | Se coloca en |
| --- | --- | --- |
| `aria-expanded` | El contenido controlado está abierto o cerrado | Botón o control que expande |
| `aria-controls` | Identificador del elemento controlado | Control disparador |
| `aria-current` | Elemento actual dentro de un conjunto | Enlace, paso, fecha o página actual |
| `aria-selected` | Opción seleccionada en un widget compuesto | `tab`, `option`, `row`, `gridcell` compatibles |
| `aria-checked` | Estado de casilla, radio o switch | Elemento con rol compatible |
| `aria-pressed` | Estado de un botón conmutador | Botón que permanece activo o inactivo |
| `aria-disabled` | El elemento se presenta como no disponible | Elemento que debe seguir perceptible |
| `aria-readonly` | El valor se puede leer, pero no editar | Campo o widget compatible |
| `aria-required` | El valor es obligatorio | Control de formulario compatible |
| `aria-invalid` | El valor actual no cumple las reglas | Control que contiene el error |
| `aria-errormessage` | Identificador del mensaje de error | Control inválido |
| `aria-haspopup` | El control abre un menú, listbox, árbol, grid o diálogo | Botón disparador |
| `aria-modal` | El diálogo bloquea la interacción exterior | Contenedor con rol `dialog` o `alertdialog` |
| `aria-busy` | Una región todavía está actualizándose | Contenedor que recibe cambios |

### Expandir y contraer

```html
<button
  type="button"
  id="faq-button"
  aria-expanded="false"
  aria-controls="faq-panel"
>
  ¿Cómo cambio mi contraseña?
</button>

<div id="faq-panel" hidden>
  <!-- respuesta -->
</div>
```

```js
const expanded = button.getAttribute('aria-expanded') === 'true';
button.setAttribute('aria-expanded', String(!expanded));
panel.hidden = expanded;
```

`aria-expanded` describe el estado; `hidden` controla la visibilidad. `aria-controls` expresa la relación, pero no abre el panel ni mueve el foco.

### Actual, seleccionado, marcado y presionado

Estos estados se parecen, pero representan conceptos diferentes:

- `aria-current="page"`: enlace de la página actual dentro de una navegación.
- `aria-selected="true"`: pestaña u opción seleccionada dentro de un widget.
- `aria-checked="true"`: casilla, radio o switch marcado.
- `aria-pressed="true"`: botón conmutador activado.

```html
<nav aria-label="Cuenta">
  <a href="/profile" aria-current="page">Perfil</a>
  <a href="/security">Seguridad</a>
</nav>

<button type="button" aria-pressed="false">Silenciar</button>
```

En un botón con `aria-pressed`, conserva un nombre estable como “Silenciar” y deja que el estado anuncie si está presionado. Si cambias el texto a “Activar sonido”, normalmente se trata como una acción diferente y puede no necesitar `aria-pressed`.

### `disabled` frente a `aria-disabled`

```html
<button disabled>Guardar</button>
```

`disabled` impide activación y elimina controles de formulario del orden de foco. Es la opción preferida cuando está disponible.

```html
<a href="/next" aria-disabled="true">Siguiente</a>
```

`aria-disabled="true"` solo comunica el estado. El código todavía debe impedir la acción, ajustar el estilo y decidir si el elemento permanece en el orden de foco. No lo uses como una protección de permisos: el servidor debe autorizar la operación.

### Campos obligatorios y errores

Prefiere `required`, `readonly` y `disabled` nativos en controles HTML. Agrega ARIA cuando un widget personalizado lo necesite o para exponer relaciones adicionales.

```html
<label for="phone">Teléfono</label>
<input
  id="phone"
  name="phone"
  required
  aria-invalid="true"
  aria-describedby="phone-error"
/>
<p id="phone-error">Incluye el código de país.</p>
```

No marques `aria-invalid="true"` antes de que la persona tenga oportunidad de completar el campo. Cuando aparezca el error, muestra texto visible y asócialo; no dependas solo del atributo.

`aria-errormessage` relaciona un mensaje de error específico, pero `aria-describedby` tiene compatibilidad amplia y también puede conectar instrucciones. Prueba la combinación elegida con los lectores de pantalla soportados.

## Regiones en vivo y cambios dinámicos

Una **región en vivo** permite anunciar contenido que cambia sin mover el foco.

| Técnica | Uso |
| --- | --- |
| `role="status"` | Resultado o confirmación no urgente; equivale normalmente a un anuncio `polite` |
| `role="alert"` | Mensaje urgente que requiere atención inmediata |
| `aria-live="polite"` | Espera una pausa razonable antes de anunciar |
| `aria-live="assertive"` | Interrumpe; reservar para situaciones críticas |
| `aria-atomic="true"` | Anuncia la región completa, no solo el nodo modificado |
| `aria-relevant` | Define qué tipos de cambios importan; rara vez necesita cambiarse |
| `aria-busy="true"` | Indica que la actualización todavía no terminó |

```html
<p id="save-status" role="status" aria-atomic="true"></p>
```

```js
saveStatus.textContent = 'Cambios guardados';
```

Mantén el contenedor en el DOM antes de insertar el mensaje. Si creas la región y su texto al mismo tiempo, algunas combinaciones de navegador y lector pueden no anunciarlo. No envuelvas toda la aplicación en `aria-live`: produciría anuncios extensos y repetidos.

`role="alert"` no significa “texto rojo”. Úsalo para un fallo urgente que acaba de aparecer, no para contenido que ya estaba en la página al cargar ni para cada tecla inválida.

## Ocultar contenido del árbol de accesibilidad

```html
<svg aria-hidden="true" focusable="false"><!-- decorativo --></svg>
```

`aria-hidden="true"` oculta el elemento y todos sus descendientes a tecnologías asistivas, pero puede continuar visible en pantalla. Úsalo para decoración o contenido duplicado que ya tiene una alternativa accesible.

Nunca lo apliques a un elemento enfocable ni a un ancestro que contenga controles enfocables:

```html
<!-- Incorrecto: el botón puede recibir foco, pero desaparece del árbol accesible. -->
<div aria-hidden="true">
  <button>Comprar</button>
</div>
```

Si el contenido debe desaparecer para todas las personas, usa `hidden`, `display: none` o `visibility: hidden` según el caso. Si además necesitas bloquear temporalmente interacción y foco de una zona visible u oculta durante un modal, evalúa el atributo HTML `inert`.

`role="none"` y `role="presentation"` eliminan la **semántica** del contenedor, pero no necesariamente su texto ni la semántica independiente de todos sus descendientes. No son equivalentes a `aria-hidden`.

## Relaciones y widgets avanzados

| Atributo | Propósito | Precaución |
| --- | --- | --- |
| `aria-controls` | Relaciona control y contenido controlado | El `id` debe existir; no implementa comportamiento |
| `aria-owns` | Cambia la relación lógica cuando el DOM no puede representarla | También altera el orden accesible; evitar salvo necesidad real |
| `aria-activedescendant` | Mantiene foco en el contenedor e indica el descendiente activo | Requiere teclado, scroll y estilos sincronizados |
| `aria-orientation` | Indica orientación no predeterminada | Solo en roles compatibles |
| `aria-posinset` / `aria-setsize` | Posición y tamaño total de una colección parcial | Útil en listas virtualizadas |
| `aria-multiselectable` | El widget permite seleccionar varias opciones | Solo en roles compatibles como listbox o grid |

No copies estos atributos de un ejemplo aislado. Implementa el patrón completo de la guía APG y confirma que la visualización, el foco y el árbol accesible expresan el mismo estado.

## Pestañas: ejemplo de un patrón completo

```html
<div role="tablist" aria-label="Configuración de cuenta">
  <button
    type="button"
    role="tab"
    id="profile-tab"
    aria-selected="true"
    aria-controls="profile-panel"
    tabindex="0"
  >
    Perfil
  </button>
  <button
    type="button"
    role="tab"
    id="security-tab"
    aria-selected="false"
    aria-controls="security-panel"
    tabindex="-1"
  >
    Seguridad
  </button>
</div>

<section
  role="tabpanel"
  id="profile-panel"
  aria-labelledby="profile-tab"
>
  <!-- contenido de Perfil -->
</section>

<section
  role="tabpanel"
  id="security-panel"
  aria-labelledby="security-tab"
  hidden
>
  <!-- contenido de Seguridad -->
</section>
```

Los atributos no completan el componente. El código también debe gestionar flechas entre pestañas, Home/End cuando corresponda, un solo `tabindex="0"`, selección, panel visible y foco perceptible. Para una navegación normal entre páginas, usa enlaces y `aria-current`; no conviertas la navegación en pestañas.

## ARIA en React y componentes reutilizables

Los IDs deben ser estables y únicos. `useId()` ayuda a relacionar etiqueta, ayuda y error entre varias instancias:

```tsx
import { useId } from 'react';

function TextField({ label, help }: { label: string; help: string }) {
  const inputId = useId();
  const helpId = `${inputId}-help`;

  return (
    <div>
      <label htmlFor={inputId}>{label}</label>
      <input id={inputId} aria-describedby={helpId} />
      <p id={helpId}>{help}</p>
    </div>
  );
}
```

Un componente debe exponer las props necesarias para nombre, descripción y estado, pero no aceptar combinaciones imposibles sin advertencia. Por ejemplo, un `IconButton` debería exigir `aria-label` si no recibe texto visible.

En HTML, los valores ARIA se serializan como texto. No dejes un atributo booleano con el significado contrario por una conversión incorrecta:

```tsx
<button aria-expanded={isOpen}>Filtros</button>
```

React genera `"true"` o `"false"`. El estado visual y el contenido deben derivarse de la misma fuente `isOpen`.

## Errores frecuentes

- Agregar `aria-label` a todos los elementos, incluso cuando ya tienen texto.
- Repetir roles nativos sin necesidad: `<nav role="navigation">`.
- Usar `role="button"` sin Enter, Space, foco ni estado deshabilitado.
- Ocultar con `aria-hidden` un contenedor que conserva enlaces o botones enfocables.
- Mantener `aria-expanded="false"` después de abrir visualmente el panel.
- Usar `aria-selected` en un botón conmutador donde corresponde `aria-pressed`.
- Crear un menú ARIA para una lista común de enlaces.
- Confiar en `aria-disabled` para impedir la ejecución.
- Referenciar IDs inexistentes o duplicados.
- Usar `aria-live="assertive"` para notificaciones de baja importancia.
- Cambiar el nombre accesible sin actualizar el texto visible o la traducción.
- Suponer que Lighthouse o axe pueden validar por completo el flujo de teclado.

## Checklist antes de publicar

- ¿Existe un elemento HTML nativo que evite el rol personalizado?
- ¿Cada control tiene un nombre breve, único y coherente con el texto visible?
- ¿La descripción complementa el nombre en vez de reemplazarlo?
- ¿Los IDs de `labelledby`, `describedby` y `controls` existen y son únicos?
- ¿Los estados ARIA cambian al mismo tiempo que la interfaz visual?
- ¿El componente funciona con teclado según su patrón?
- ¿No existe foco dentro de contenido oculto?
- ¿Los mensajes dinámicos se anuncian una sola vez y con la prioridad correcta?
- ¿Se probó nombre, rol, estado y orden en el árbol de accesibilidad?
- ¿Se recorrió el flujo con teclado y al menos un lector de pantalla?

## Referencias

- [W3C: WAI-ARIA 1.2](https://www.w3.org/TR/wai-aria/)
- [W3C: reglas para usar ARIA](https://www.w3.org/TR/using-aria/)
- [W3C APG: nombres y descripciones accesibles](https://www.w3.org/WAI/ARIA/apg/practices/names-and-descriptions/)
- [W3C APG: patrones de widgets](https://www.w3.org/WAI/ARIA/apg/patterns/)
- [W3C APG: antes de usar ARIA](https://www.w3.org/WAI/ARIA/apg/practices/read-me-first/)

