---
title: TanStack Charts
description: Gramática de gráficas en TypeScript — marks, canales y escalas — que renderiza SVG accesible y con SSR por defecto, con Canvas y animación opcionales y adaptadores para React, Vue, Svelte, Solid, Angular y más.
tags: [javascript, typescript, graficas, svg, visualizacion, react, vue, svelte]
sidebar:
  order: 1
draft: false
resourceCategory: Documentación del paquete
website: https://tanstack.com/charts
github: https://github.com/TanStack/charts
technologies:
  - packages/javascript-chartjs/chartjs
  - packages/react-tanstack-query/tanstack-query
note: "Los ejemplos siguen la versión 1.1.0 (octubre de 2026). La 1.0 salió el 3 de octubre: antes de ella la API cambiaba entre versiones menores, así que ignora tutoriales de la etapa alfa. Licencia MIT."
updatedAt: 2026-10-12
---

TanStack Charts no es un catálogo de tipos de gráfica («dame un _bar chart_ con estas opciones»), sino una **gramática**: describes la gráfica como capas de _marks_ (barras, líneas, puntos) que leen tus datos tal cual, con _canales_ que dicen qué campo va a cada eje y _escalas_ que traducen valores a píxeles. Es el modelo de Observable Plot y Vega-Lite, con tipos de TypeScript inferidos de tus datos.

Lo crea Tanner Linsley, autor de TanStack Query y TanStack Table. Él mismo lo declara en el README: diseñó la arquitectura y la API, y casi toda la implementación la escribieron agentes de IA bajo su supervisión.

## En pocas palabras

- **SVG por defecto**, con renderizado en servidor (SSR) e hidratación. **Canvas** opcional para series densas.
- **Una definición, cualquier framework.** La misma `defineChart(...)` se pinta con React, Preact, Vue, Solid, Svelte, Angular, Lit, Alpine, Octane, React Native o el DOM sin framework.
- **Pagas lo que importas.** Cada escala, interacción y renderer vive en su propio _subpath_; según su suite de medición, un consumidor típico ocupa entre 43 y 50 kB gzip.
- **Accesibilidad, tooltips, ejes y márgenes automáticos** incluidos. La animación (tween y muelle) es un renderer aparte y opcional.

## Instalación

Un solo paquete; el framework va como _peer_:

```bash
# React
pnpm add @tanstack/charts react react-dom

# Vue
pnpm add @tanstack/charts vue

# Svelte
pnpm add @tanstack/charts svelte

# Solid
pnpm add @tanstack/charts solid-js

# Angular
pnpm add @tanstack/charts @angular/core @angular/platform-browser
```

Las piezas se importan por _subpath_ exacto: `@tanstack/charts/react`, `@tanstack/charts/scales/linear`, `@tanstack/charts/tooltip`… No hay un export agregado de escalas, a propósito.

## Conceptos

| Concepto | Qué es | Ejemplo |
| --- | --- | --- |
| **Mark** | Una capa geométrica que consume un array de filas | `barY`, `lineY`, `areaY`, `dot` |
| **Canal** | Qué valor de cada fila va a cada propiedad visual. Puede ser el nombre de un campo o una función (_accessor_) | `x: 'month'`, `y: (d) => d.total / 1000` |
| **Escala** | Traduce el dominio de los datos a píxeles. El dominio se infiere de los canales; el rango lo pone el tamaño de la gráfica | `scaleLinear`, `scaleBand`, `scalePoint` |
| **Eje / guía** | Se configura dentro de la escala: rejilla, etiqueta, formato de ticks | `axis: { label: 'Ingresos' }`, `grid: true` |
| **Serie** | Agrupación dentro de un mark con `z` o `color` | `lineY(rows, { x, y, color: 'serie' })` |
| **Definición** | El objeto que junta marks, escalas y capacidades; es independiente del framework | `defineChart({ marks, scales, tooltip })` |

Las escalas propias de TanStack cubren lo común (lineal, banda, punto, ordinal) sin dependencia de D3. Para fechas, logarítmicas u otras, pasas directamente la escala de `d3-scale` (`scaleUtc`, `scaleLog`…), que entonces instalas tú.

Los marks básicos son `barY`/`barX`, `lineY`/`lineX`, `areaY`/`areaX` y `dot`; por _subpaths_ aparte hay polares, mapas, sankey, treemap, sunburst, contornos, violines y más.

## Ejemplo completo en React

```tsx title="RevenueChart.tsx"
import { barY, defineChart } from "@tanstack/charts"
import { scaleBand } from "@tanstack/charts/scales/band"
import { scaleLinear } from "@tanstack/charts/scales/linear"
import { tooltip } from "@tanstack/charts/tooltip"
import { Chart } from "@tanstack/charts/react"

const revenue = [
  { month: "Ene", value: 42 },
  { month: "Feb", value: 58 },
  { month: "Mar", value: 76 },
  { month: "Abr", value: 64 }
]

// A nivel de módulo: la definición no cambia entre renders
const revenueChart = defineChart({
  marks: [barY(revenue, { x: "month", y: "value" })],
  scales: {
    x: { scale: () => scaleBand().padding(0.2) },
    y: {
      scale: scaleLinear,
      nice: true,
      grid: true,
      axis: { label: "Ingresos (miles)" }
    }
  },
  tooltip
})

export function RevenueChart() {
  return <Chart definition={revenueChart} height={320} ariaLabel="Ingresos mensuales" />
}
```

Puntos a notar:

- El tipo de cada fila se infiere de `revenue`; no hacen falta genéricos ni _casts_.
- Con `height` fijo, el ancho sigue al contenedor. Alternativa: `aspectRatio={16 / 9}` con `initialWidth` para el SSR.
- `ariaLabel` es obligatorio en la práctica: es lo que lee un lector de pantalla.
- Si la definición depende de props o estado, envuélvela entera en `useMemo`. La identidad de la definición es lo que dispara la actualización.

## Ejemplo en Vue

Una gráfica de líneas con dos series, reactiva a los datos:

```vue title="VisitsChart.vue"
<script setup lang="ts">
import { computed, ref } from "vue"
import { defineChart, lineY } from "@tanstack/charts"
import { scaleLinear } from "@tanstack/charts/scales/linear"
import { scalePoint } from "@tanstack/charts/scales/point"
import { tooltip } from "@tanstack/charts/tooltip"
import { Chart } from "@tanstack/charts/vue"

const rows = ref([
  { day: "Lun", source: "Orgánico", visits: 120 },
  { day: "Mar", source: "Orgánico", visits: 150 },
  { day: "Mié", source: "Orgánico", visits: 140 },
  { day: "Lun", source: "Redes", visits: 80 },
  { day: "Mar", source: "Redes", visits: 95 },
  { day: "Mié", source: "Redes", visits: 130 }
])

const definition = computed(() =>
  defineChart({
    marks: [lineY(rows.value, { x: "day", y: "visits", color: "source", points: true })],
    scales: {
      x: { scale: scalePoint },
      y: { scale: scaleLinear, nice: true, grid: true, axis: { label: "Visitas" } }
    },
    tooltip
  })
)
</script>

<template>
  <Chart :definition="definition" aria-label="Visitas por fuente" :aspect-ratio="16 / 9" />
</template>
```

`color: 'source'` agrupa las filas en una línea por fuente y les asigna color. En Vue, una definición que captura estado reactivo va en `computed`; una estática, a nivel de módulo. El componente renderiza el SVG en el servidor con Vue SSR.

En Svelte 5 el patrón es el mismo con `$derived(defineChart(...))` y `<Chart {definition} ariaLabel="…" />` desde `@tanstack/charts/svelte`.

## Animación y Canvas

Ambos son opcionales y no entran en el bundle si no los importas:

- **Animación:** `motion()` desde `@tanstack/charts/motion` reemplaza el renderer SVG por uno con transiciones tween o de muelle; respeta `prefers-reduced-motion` por defecto.
- **Canvas:** cambiar `@tanstack/charts/react` por `@tanstack/charts/react/canvas` mantiene la definición y quita el coste de un nodo DOM por punto. También se puede aplicar Canvas solo a un mark denso dentro de una gráfica SVG.

## Comparativa

Cifras de bundle de la propia [página de comparación](https://github.com/TanStack/charts/blob/v1.1.0/docs/comparison.md) de TanStack (medidas por ellos, minificado + gzip, gráficas de línea, barra, área y dispersión):

| | TanStack Charts | [Chart.js](/packages/javascript-chartjs/chartjs) | Recharts | Apache ECharts |
| --- | --- | --- | --- | --- |
| Salida | SVG por defecto, Canvas opcional | Solo Canvas | SVG | Canvas por defecto, SVG opcional |
| Frameworks | Núcleo neutro + adaptadores | Núcleo neutro (wrappers de la comunidad) | Solo React | Núcleo neutro |
| Modelo | Gramática (marks + escalas) | Configuración por tipo de gráfica | Componentes JSX | Configuración declarativa por series |
| Bundle medido | 43–50 kB | 46–60 kB | 157–172 kB (97–113 kB sin contar React) | 157–177 kB |
| Licencia | MIT | MIT | MIT | Apache-2.0 |

- **Elige TanStack Charts** si necesitas gráficas que salgan de lo estándar, SSR real, inspección y estilado con CSS, o la misma definición en varios frameworks.
- **Elige Chart.js** si quieres una gráfica estándar rápido, con miles de ejemplos en internet, y no te importa el canvas.
- **Elige Recharts** si todo es React y prefieres componentes JSX a una gramática.
- **Elige ECharts** para dashboards muy densos, mapas o volúmenes enormes de datos donde su canvas y sus decenas de tipos listos compensan el tamaño.

La comparación la publica TanStack: tómala como punto de partida y mide en tu propia app.

## Límites

- **Recién estable.** La 1.0 es de octubre de 2026; el ecosistema de ejemplos y respuestas en internet todavía es pequeño, y gran parte del material existente es de la etapa alfa.
- **Curva de aprendizaje.** Pensar en marks y escalas cuesta más al principio que elegir `type: 'bar'`; la recompensa llega cuando la gráfica se sale del molde.
- **SVG tiene techo.** Con miles de puntos interactivos, pasa a Canvas o reduce los datos.
- **Escrito casi entero por IA**, según su autor. Tiene una suite de verificación extensa, pero conviene saberlo al evaluar riesgos.

## Fuentes

- [tanstack.com/charts](https://tanstack.com/charts)
- [github.com/TanStack/charts](https://github.com/TanStack/charts) — README y [documentación de la v1.1.0](https://github.com/TanStack/charts/tree/v1.1.0/docs)
- [Comparación con otras librerías](https://github.com/TanStack/charts/blob/v1.1.0/docs/comparison.md) y [guía de tamaño y rendimiento](https://github.com/TanStack/charts/blob/v1.1.0/docs/guides/bundle-size-and-performance.md)
