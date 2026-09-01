---
title: "GridStack.js"
description: "Rejilla de widgets arrastrables y redimensionables para construir dashboards, con envoltorio propio para React y sin dependencias externas."
type: libraries
order: 7
tags: [react, dashboard, grid, drag-and-drop, typescript]
website: https://gridstackjs.com
github: https://github.com/gridstack/gridstack.js
install: npm install gridstack
technologies: [frontend/react/react]
updatedAt: 2026-08-30
---

> Mantenido por la comunidad de **[gridstack](https://github.com/gridstack/gridstack.js)** con licencia MIT. Unas 9.100 estrellas y desarrollo activo.

Librería para construir **dashboards con widgets** que el usuario puede arrastrar, redimensionar y reorganizar. Está escrita en TypeScript, **no tiene dependencias externas** y ofrece envoltorios para React, Angular, Vue, Ember y otros.

## Qué resuelve

Una rejilla CSS coloca elementos; GridStack gestiona lo que viene después:

- Arrastrar un widget y que los demás **se reacomoden**.
- Redimensionar tirando de una esquina, con la rejilla como guía.
- **Serializar la disposición** para guardarla y restaurarla por usuario.
- Comportamiento responsive y soporte táctil en móvil.

Eso último es la razón habitual para no hacerlo a mano: guardar y restaurar posiciones se vuelve complicado en cuanto hay más de una resolución.

## Uso con React

```bash
npm install gridstack
```

El paquete incluye el envoltorio de React, así que no hace falta instalar nada aparte. La disposición se define con datos y se recupera con la API de serialización:

```tsx title="src/components/Panel.tsx"
import { GridStack } from "gridstack"
import "gridstack/dist/gridstack.min.css"
import { useEffect, useRef } from "react"

export function Panel() {
  const contenedor = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!contenedor.current) return
    const rejilla = GridStack.init({ column: 12, cellHeight: 80 }, contenedor.current)

    // La disposición se guarda como datos, no como CSS.
    rejilla.on("change", () => {
      window.localStorage.setItem("panel", JSON.stringify(rejilla.save()))
    })

    return () => rejilla.destroy(false)
  }, [])

  return <div ref={contenedor} className="grid-stack" />
}
```

Los estilos de `gridstack.min.css` son obligatorios: sin ellos la rejilla no posiciona nada.

## Cuándo conviene

- **Sí** en paneles donde el usuario decide qué ve y dónde: analítica, monitoreo, herramientas internas.
- **Sí** cuando hay que persistir la disposición por usuario.
- **No** para una maquetación fija; ahí CSS Grid basta y no añade JavaScript.

## Qué tener en cuenta

- **Es imperativa por diseño.** Inicializa sobre un nodo del DOM, así que en React vive dentro de un efecto con su limpieza, no como estado declarativo.
- **Los estilos vienen con opiniones.** Se pueden sobrescribir, pero conviene contar con ello al integrarla en un sistema de diseño propio.
