---
title: Figma — diseño de interfaces y handoff a código
description: Herramienta colaborativa para diseñar interfaces antes de programarlas; explica sus conceptos principales y cómo convertir un diseño en código sin adivinar medidas o estilos.
category: applications
stack: apps-design
order: 1
tags: [figma, diseño, ui, componentes, handoff]
website: https://www.figma.com
related:
  - guides/ui-ux-design-systems
  - guides/ui-library-selection
updatedAt: 2026-08-26
---

**Figma** es una herramienta de diseño de interfaces que corre en el navegador y también como aplicación de escritorio. Es colaborativa en tiempo real — varias personas editan el mismo archivo a la vez, como un documento compartido — y es, en la práctica, el punto de partida de la mayoría de las interfaces que un frontend termina implementando.

## Instalación

Figma funciona sin instalar nada: **figma.com** en cualquier navegador moderno es la app completa. La app de escritorio es un envoltorio del mismo cliente web, útil para tenerla como ventana propia y para accesos directos del sistema.

```bash
# Windows (winget)
winget install Figma.Figma

# macOS (Homebrew)
brew install --cask figma
```

En Linux no hay app oficial de escritorio: se usa desde el navegador.

## El modelo: Frames, no páginas

La unidad básica de un diseño en Figma es el **Frame** — un contenedor con tamaño definido (o Auto Layout, ver abajo) que suele representar una pantalla, un componente o una sección. Dentro de un Frame viven capas: formas, texto, imágenes y otros Frames anidados.

Un archivo se organiza en **Pages** (pestañas a la izquierda, útiles para separar flujos o versiones) y cada Page contiene los Frames. Esto importa para leer un archivo ajeno: si buscas una pantalla y no aparece, probablemente está en otra Page.

## Auto Layout — el equivalente a Flexbox

**Auto Layout** convierte un Frame en un contenedor que se comporta como Flexbox: define dirección (fila o columna), espaciado entre elementos (`gap`), relleno interno (`padding`) y cómo crecen o se ajustan los hijos.

Cuando un diseño usa Auto Layout de forma consistente, el traspaso a código es casi directo: dirección → `flex-direction`, espaciado → `gap`, relleno → `padding`. Un diseño **sin** Auto Layout (elementos posicionados a mano, "position absolute" de facto) obliga a adivinar cómo debería comportarse el layout al cambiar el contenido o el tamaño de pantalla — la señal más clara de que un archivo de Figma no está listo para implementar responsivamente.

## Componentes e instancias

Un **Component** (icono de diamante en las capas) es la definición maestra de una pieza reutilizable — un botón, una tarjeta. Una **Instance** es una copia vinculada: cambiar el componente maestro actualiza todas sus instancias, pero cada instancia puede sobrescribir propiedades puntuales (el texto de un botón, por ejemplo) sin romper el vínculo.

Los **Component Properties** —booleanos, texto, instancia anidable, variante— son el equivalente de las props de un componente de React: definen qué puede configurarse desde fuera sin editar el componente en sí. Un botón bien construido en Figma suele tener properties para variante (primario/secundario), tamaño y estado (con icono o sin él) — que se mapean casi 1:1 a las props del componente real en el código.

## Variables — tokens de diseño

Las **Variables** (`Local variables`, en el panel derecho) guardan valores reutilizables: color, número, string o booleano, organizados en colecciones con **modos** (por ejemplo, un modo "Light" y otro "Dark" para los mismos nombres de variable). Son el equivalente de diseño a los custom properties de CSS o a un archivo de tokens: un color con nombre `color/accent/primary` que, si cambia una vez, se actualiza en todo el archivo que lo referencia.

Cuando un equipo de diseño usa variables de forma disciplinada, esa colección puede exportarse y alimentar directamente el archivo de tokens del código (`tailwind.config` o CSS custom properties), en vez de que alguien transcriba colores a mano leyendo la interfaz.

## Leer un diseño para implementarlo

Con el archivo abierto y un elemento seleccionado, el panel derecho (**Inspect**, o el atajo con la tecla `I`) muestra medidas exactas, color, tipografía y, en muchos casos, el fragmento de CSS equivalente — sin necesidad de plan de edición, solo de acceso de lectura al archivo.

| Necesito | Dónde mirar |
| --- | --- |
| Espaciado exacto entre dos elementos | Seleccionar ambos, ver la medida que aparece entre ellos |
| Color con su valor hex/rgb | Panel derecho → Fill, o clic en el swatch |
| Tipografía (familia, tamaño, peso, line-height) | Panel derecho → Text |
| CSS aproximado del elemento seleccionado | Panel derecho → pestaña **Code** (Inspect) |
| Assets exportables (SVG, PNG) | Panel derecho → **Export**, elegir formato y escala |

El CSS que exporta el modo Inspect es un punto de partida, no el código final: no sabe qué breakpoints tiene tu proyecto, ni si ese espaciado debería ser una variable de Tailwind existente en vez de un valor suelto.

## Comentarios y handoff

Cualquiera con acceso de lectura puede dejar un comentario anclado a un punto exacto del diseño (tecla `C`). Es el canal correcto para preguntar "¿este botón lleva icono en mobile?" sin necesitar permiso de edición — y deja registro de la conversación pegado al elemento, a diferencia de preguntarlo por chat.

## Cuándo usarlo

Figma resuelve el diseño de interfaces y la comunicación entre diseño y desarrollo; no reemplaza un sistema de diseño en código (los componentes reales siguen viviendo en el repositorio) ni sustituye la validación de accesibilidad real — que un contraste se vea bien en Figma no confirma que cumpla WCAG en el navegador real.

Fuentes: [Guía de Figma para desarrolladores](https://www.figma.com/developers), [Auto Layout](https://help.figma.com/hc/en-us/articles/5731482952727-Explore-auto-layout-properties) y [Variables](https://help.figma.com/hc/en-us/articles/15339657135383-Guide-to-variables-in-Figma).
