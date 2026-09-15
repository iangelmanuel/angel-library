---
title: Pragmatic drag and drop
description: Capa fina sobre la API nativa de arrastrar y soltar del navegador — draggable, drop targets y monitores, agnóstica del framework, con addons opcionales.
tags: [javascript, typescript, drag-and-drop, accesibilidad, atlassian]
sidebar:
  order: 1
draft: false
resourceCategory: Documentación del paquete
website: https://atlassian.design/components/pragmatic-drag-and-drop
github: https://github.com/atlassian/pragmatic-drag-and-drop
note: "Se apoya en la API nativa de arrastrar y soltar, que no funciona en móvil. Si el caso incluye táctil, hace falta resolverlo con otro mecanismo."
updatedAt: 2026-09-14
---

Pragmatic drag and drop es la librería de arrastre que Atlassian usa en Trello, Jira y Confluence. Su decisión de diseño es la que la distingue: **no reimplementa el arrastre**, se apoya en la API nativa del navegador (`dragstart`, `dragover`, `drop`) y solo le pone encima una interfaz manejable. De ahí que el núcleo pese unos 4,7 kB sin dependencias.

Es agnóstica del framework — funciona igual con React, Vue, Svelte, Angular o sin framework — porque su unidad de trabajo es un elemento del DOM, no un componente.

## Instalación

```bash
pnpm add @atlaskit/pragmatic-drag-and-drop
```

Los extras son paquetes aparte y opcionales: `@atlaskit/pragmatic-drag-and-drop-hitbox` (calcular el borde más cercano para reordenar), `-auto-scroll` (desplazar al llegar al borde) y los paquetes de indicadores visuales.

## Las tres piezas

| Función                   | Qué hace                                                        |
| ------------------------- | --------------------------------------------------------------- |
| `draggable`               | Marca un elemento como arrastrable y adjunta sus datos          |
| `dropTargetForElements`   | Marca un elemento como zona donde se puede soltar               |
| `monitorForElements`      | Escucha el arrastre sin ser origen ni destino                   |

Las tres devuelven una **función de limpieza**: la librería no gestiona ciclos de vida, así que hay que llamarla al desmontar. Ese es el contrato que evita listeners colgados.

## Un elemento arrastrable

```ts
import { draggable } from "@atlaskit/pragmatic-drag-and-drop/element/adapter"

const limpiar = draggable({
  element: document.querySelector("#tarjeta-1")!,
  getInitialData: () => ({ tipo: "tarjeta", id: "1" }),
  onDragStart: () => console.log("empezó"),
  onDrop: () => console.log("terminó")
})

// al desmontar
limpiar()
```

`getInitialData` es lo que viaja con el arrastre: la zona de destino decide con eso si acepta o no. Conviene incluir siempre un `tipo`, porque una misma pantalla suele tener varias clases de cosas arrastrables.

## Una zona de destino

```ts
import { dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter"

const limpiar = dropTargetForElements({
  element: document.querySelector("#columna-hecho")!,
  canDrop: ({ source }) => source.data.tipo === "tarjeta",
  getData: () => ({ columna: "hecho" }),
  onDragEnter: ({ self }) => marcarActiva(self.element),
  onDragLeave: ({ self }) => desmarcar(self.element),
  onDrop: ({ source, self }) => {
    desmarcar(self.element)
    moverTarjeta(source.data.id as string, self.data.columna as string)
  }
})
```

`canDrop` es lo que impide que una tarjeta se suelte donde no corresponde, y es también lo que decide si el cursor muestra "no permitido".

## En React

No hay componentes: se llama a las mismas funciones desde un efecto y se devuelve la limpieza.

```tsx
import { useEffect, useRef, useState } from "react"
import { draggable } from "@atlaskit/pragmatic-drag-and-drop/element/adapter"

function Tarjeta({ id }: { id: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [arrastrando, setArrastrando] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    return draggable({
      element,
      getInitialData: () => ({ tipo: "tarjeta", id }),
      onDragStart: () => setArrastrando(true),
      onDrop: () => setArrastrando(false)
    })
  }, [id])

  return (
    <div
      ref={ref}
      data-arrastrando={arrastrando}
    >
      Tarjeta {id}
    </div>
  )
}
```

Devolver la función de `draggable` directamente en el `useEffect` es el patrón: React la ejecuta como cleanup.

## Reordenar dentro de una lista

Para saber si se suelta *antes* o *después* del elemento sobre el que está el cursor hace falta el hitbox:

```ts
import {
  attachClosestEdge,
  extractClosestEdge
} from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge"

dropTargetForElements({
  element,
  getData: ({ input, element }) =>
    attachClosestEdge(
      { id },
      { input, element, allowedEdges: ["top", "bottom"] }
    ),
  onDrop: ({ self, source }) => {
    const borde = extractClosestEdge(self.data) // "top" | "bottom"
    reordenar(source.data.id as string, self.data.id as string, borde)
  }
})
```

Sin esto, reordenar queda a medias: se sabe sobre qué elemento se soltó, pero no en qué lado.

## Notas

- Al apoyarse en la API nativa, el arrastre entre ventanas y el arrastre de archivos desde el escritorio funcionan sin trabajo extra (hay un adaptador propio para archivos externos).
- La API nativa **no funciona en móvil**: si el caso incluye táctil, hay que resolverlo con otro mecanismo (punteros) o aceptar la limitación.
- Arrastrar nunca puede ser la única forma de hacer la acción: hace falta una alternativa por teclado o por menú para que la interfaz siga siendo accesible.
- Los indicadores visuales (la línea de inserción, la sombra de arrastre) son decisión tuya o de los addons; el núcleo no pinta nada.
