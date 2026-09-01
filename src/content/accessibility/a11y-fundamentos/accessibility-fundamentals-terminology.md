---
title: "Accesibilidad web: fundamentos y terminología"
description: Modelo mental para comprender WCAG, semántica, tecnologías asistivas, nombre accesible, foco, teclado y pruebas de accesibilidad.
type: guides
tags: [accesibilidad, a11y, wcag, aria, semantica, fundamentos]
order: 1
updatedAt: 2026-08-25
---

La **accesibilidad web** busca que una interfaz pueda ser percibida, comprendida y operada por personas con distintas capacidades, dispositivos y contextos. No es una función opcional para “algunos usuarios”: una estructura clara, un teclado funcional, mensajes comprensibles y buen contraste también ayudan ante lesiones temporales, luz intensa, conexiones lentas o dispositivos sin precisión táctil.

La abreviatura **a11y** representa la palabra inglesa *accessibility*: hay once letras entre la `a` y la `y`. Se utiliza en nombres de equipos, pruebas y herramientas.

## Aprende o consulta

Si comienzas desde cero, avanza así: semántica HTML → teclado y foco → ARIA → formularios → componentes complejos → contenido visual → pruebas. No empieces memorizando atributos ARIA; primero comprende qué comportamiento entrega un elemento nativo.

| Necesito recordar | Documento |
| --- | --- |
| nombres, roles, estados y relaciones | [Atributos ARIA](/accessibility/a11y-interaccion/accessibility-aria-attributes) |
| foco visible y navegación por teclado | [Semántica, teclado y foco](/accessibility/a11y-interaccion/accessibility-semantics-keyboard-focus) |
| labels, instrucciones y errores | [Formularios accesibles](/accessibility/a11y-interaccion/accessibility-forms-validation) |
| diálogos, menús y anuncios | [Patrones interactivos](/accessibility/a11y-interaccion/accessibility-dialogs-live-regions) |
| imágenes, tablas, audio y video | [Contenido accesible](/accessibility/a11y-contenido/accessibility-contenido-multimedia) |
| contraste, zoom y movimiento | [Accesibilidad visual](/accessibility/a11y-contenido/accessibility-visual-reflow-motion) |
| auditoría manual y automática | [Pruebas](/accessibility/a11y-testing/accessibility-testing-manual-automatico) |

Para aprender, ejecuta cada ejemplo con teclado y lector de pantalla. Para recordar, usa la tabla y termina verificando comportamiento; una regla correcta en el código puede fallar cuando se combina con CSS, JavaScript o contenido real.

## WCAG, W3C y WAI

**W3C** significa *World Wide Web Consortium*, la organización que desarrolla estándares de la Web. Dentro de ella, **WAI** significa *Web Accessibility Initiative* o iniciativa de accesibilidad web.

**WCAG** significa *Web Content Accessibility Guidelines* o pautas de accesibilidad para el contenido web. Sus criterios se organizan alrededor del principio **POUR**:

| Principio | Pregunta práctica |
| --- | --- |
| Perceptible | ¿La información puede recibirse por más de un sentido? |
| Operable | ¿Se puede usar con teclado, voz u otro dispositivo de entrada? |
| Comprensible | ¿La interfaz y sus mensajes son previsibles y claros? |
| Robusto | ¿El contenido se interpreta correctamente en navegadores y tecnologías asistivas? |

Cumplir una lista no garantiza una experiencia excelente, pero ofrece una base verificable. La prueba final combina análisis automático, revisión manual y uso con personas reales.

## Tecnologías asistivas

Una **tecnología asistiva (AT, *Assistive Technology*)** ayuda a interactuar con un sistema. Algunos ejemplos son lectores de pantalla, magnificadores, reconocimiento de voz, teclados alternativos y dispositivos de seguimiento ocular.

Un **lector de pantalla** no “lee una captura” de la interfaz. Interpreta información expuesta por el navegador mediante el árbol de accesibilidad: nombres, roles, estados, relaciones y texto. Por eso la semántica del HTML importa aunque el diseño visual parezca correcto.

## Semántica antes que ARIA

La semántica expresa qué es cada elemento. Un botón nativo ya posee rol, comportamiento de teclado, foco y estado deshabilitado:

```html
<button type="button" disabled>Guardar cambios</button>
```

Recrear lo mismo con un `div` exige implementar cada comportamiento y comunicarlo correctamente. La primera regla práctica de **ARIA** (*Accessible Rich Internet Applications*) es no usar ARIA si un elemento HTML nativo ofrece la semántica y el comportamiento necesarios.

ARIA añade información de accesibilidad, pero no añade funcionalidad por sí sola:

```html
<button
  type="button"
  aria-expanded="false"
  aria-controls="filters-panel"
>
  Mostrar filtros
</button>

<section id="filters-panel" hidden>
  <!-- Controles de filtrado -->
</section>
```

JavaScript todavía debe cambiar `hidden` y mantener `aria-expanded` sincronizado. Si el estado anunciado contradice el estado visual, la experiencia es confusa.

## Nombre, rol, estado y propiedades

Una tecnología asistiva necesita responder cuatro preguntas:

- **Nombre accesible:** cómo se identifica el control, por ejemplo “Buscar”.
- **Rol:** qué es, por ejemplo botón, enlace o casilla.
- **Estado:** cómo está ahora, por ejemplo expandido, marcado o deshabilitado.
- **Propiedades y relaciones:** qué describe o controla, por ejemplo un mensaje de ayuda.

El nombre accesible puede provenir del texto del elemento, de un `label`, de `alt`, de `aria-label` o de `aria-labelledby`, según el elemento y el algoritmo del navegador.

```html
<label for="email">Correo electrónico</label>
<input
  id="email"
  name="email"
  type="email"
  aria-describedby="email-help"
/>
<p id="email-help">Usaremos este correo para enviarte el recibo.</p>
```

El `label` nombra el campo. `aria-describedby` agrega una descripción sin reemplazar el nombre. Un `placeholder` no sustituye al `label`: desaparece al escribir y suele tener menor contraste.

## Teclado, foco y orden de lectura

El **foco** identifica el elemento que recibirá la siguiente interacción de teclado. La tecla `Tab` recorre controles interactivos según el orden del documento. El estilo `:focus-visible` permite mostrar un indicador claro cuando el navegador considera que el usuario lo necesita.

```css
:focus-visible {
  outline: 3px solid CanvasText;
  outline-offset: 3px;
}
```

No se debe quitar el contorno sin ofrecer una alternativa visible. Tampoco conviene usar valores positivos de `tabindex`; crean un orden paralelo que se vuelve difícil de mantener.

`tabindex="0"` incorpora un elemento al orden natural y `tabindex="-1"` permite enfocarlo mediante código sin añadirlo a la navegación secuencial. Antes de usarlos, comprueba si el elemento debería ser un enlace, botón o control nativo.

## Navegación y gestión del foco

Una aplicación de una sola página puede cambiar contenido sin una navegación completa. En esos casos se debe decidir dónde queda el foco y cómo se anuncia el resultado. Moverlo siempre al inicio también puede ser molesto; debe llevarse al punto que representa el cambio de contexto.

En un diálogo modal:

1. el control que lo abre conserva una referencia lógica;
2. el foco entra al diálogo;
3. `Tab` permanece entre sus controles mientras está abierto;
4. `Escape` lo cierra cuando la interacción lo permite;
5. el foco vuelve al control que lo abrió o a un destino razonable.

El elemento `<dialog>` y su método `showModal()` resuelven parte de este comportamiento, pero el nombre, el contenido y el retorno de foco todavía deben comprobarse.

## Información visual y alternativas

El color no debe ser la única forma de comunicar estado. Un error puede usar color, icono y texto. Las imágenes informativas necesitan una alternativa equivalente; las decorativas deben tener `alt=""` para que no agreguen ruido.

```html
<img
  src="ventas-trimestrales.webp"
  alt="Las ventas aumentaron de 120 a 185 unidades entre enero y marzo"
/>
```

La alternativa describe la función de la imagen en ese contexto, no cada píxel. Si el gráfico contiene datos complejos, también se ofrece una tabla o explicación cercana.

Para video, los **subtítulos** representan diálogo y sonidos relevantes. Una **transcripción** ofrece el contenido en texto. La **audiodescripción** explica información visual que no aparece en el audio original.

## Regiones en vivo

Una región `aria-live` anuncia cambios que ocurren sin mover el foco:

```html
<p id="save-status" aria-live="polite"></p>
```

`polite` espera una pausa adecuada; `assertive` interrumpe y debe reservarse para mensajes urgentes. No se debe convertir toda la página en una región viva: demasiados anuncios hacen la interfaz imposible de seguir.

## Pruebas automáticas y manuales

Una herramienta automática puede detectar atributos inválidos, nombres ausentes o ciertos contrastes. No puede determinar por sí sola si el orden de lectura tiene sentido o si un texto alternativo comunica lo importante.

Un recorrido mínimo incluye:

1. ampliar texto y página sin perder contenido;
2. navegar solo con teclado y comprobar el foco visible;
3. revisar encabezados, regiones y nombres accesibles;
4. probar errores, carga, contenido dinámico y estados vacíos;
5. usar al menos una combinación real de navegador y lector de pantalla;
6. incluir personas con discapacidad en pruebas de usabilidad cuando sea posible.

La accesibilidad se diseña desde el componente y se verifica en el flujo completo. Un botón aislado puede ser correcto y aun así quedar atrapado dentro de un modal mal implementado.

## Fuentes y vigencia

- [WCAG 2.2 — estándar normativo del W3C](https://www.w3.org/TR/WCAG22/)
- [Understanding WCAG 2.2 — explicación y ejemplos](https://www.w3.org/WAI/WCAG22/understanding/)

WCAG define criterios verificables; las técnicas son formas informativas de cumplirlos y pueden actualizarse. Por eso esta guía separa el objetivo accesible de una implementación concreta.
