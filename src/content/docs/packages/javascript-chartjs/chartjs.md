---
title: Chart.js
description: Gráficas sobre canvas con ocho tipos base — configuración declarativa, escalas y plugins, con registro selectivo para no cargar lo que no usas.
tags: [javascript, typescript, graficas, canvas, visualizacion]
sidebar:
  order: 1
draft: false
resourceCategory: Documentación del paquete
website: https://www.chartjs.org
github: https://github.com/chartjs/Chart.js
note: "`...registerables` mete todos los controladores y escalas en el bundle. Para que el tree-shaking sirva de algo hay que registrar solo las piezas que usa la gráfica."
updatedAt: 2026-09-14
---

Chart.js dibuja sobre **canvas**, no sobre SVG: no crea un nodo del DOM por punto, así que aguanta series grandes sin llenar el árbol de elementos. El precio es el otro lado de la misma moneda — lo dibujado no se inspecciona ni se estiliza con CSS, y la accesibilidad hay que resolverla aparte.

Existe desde 2013, licencia MIT, y trae animaciones y tooltips activados por defecto.

## Instalación

```bash
pnpm add chart.js
```

## Una gráfica mínima

Hace falta un `<canvas>` cuyo tamaño lo defina el contenedor, y una configuración de tres partes: `type`, `data`, `options`.

```html
<div style="position: relative; height: 320px">
  <canvas id="ventas"></canvas>
</div>
```

```ts
import { Chart, registerables } from "chart.js"

Chart.register(...registerables)

const chart = new Chart(document.getElementById("ventas") as HTMLCanvasElement, {
  type: "bar",
  data: {
    labels: ["Ene", "Feb", "Mar", "Abr"],
    datasets: [{ label: "Ventas", data: [120, 190, 90, 240] }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false
  }
})
```

`responsive: true` junto a `maintainAspectRatio: false` es la combinación que hace que la gráfica siga al contenedor: el alto lo pone el div, no el canvas. Sin eso, o no se adapta o crece sin control.

## Registrar solo lo que usas

`...registerables` registra todos los controladores, escalas y plugins — cómodo, pero anula el tree-shaking. En producción se importan las piezas concretas:

```ts
import {
  BarController,
  BarElement,
  CategoryScale,
  Chart,
  Legend,
  LinearScale,
  Tooltip
} from "chart.js"

Chart.register(
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
)
```

Si falta una pieza el error lo dice con nombre propio (`"bar" is not a registered controller`): no es un fallo silencioso.

## Tipos disponibles

| `type`      | Para qué sirve                                       |
| ----------- | ---------------------------------------------------- |
| `line`      | Evolución de una magnitud en el tiempo               |
| `bar`       | Comparar categorías; apilable con `stacked`          |
| `pie`       | Composición de un total, con pocas partes            |
| `doughnut`  | Igual que `pie`, con hueco central para un dato      |
| `radar`     | Varias dimensiones de una misma entidad              |
| `polarArea` | Categorías donde el área comunica la magnitud        |
| `scatter`   | Relación entre dos variables numéricas               |
| `bubble`    | Como `scatter`, con una tercera variable en el radio |

Un mismo canvas puede mezclar tipos declarando `type` dentro de cada dataset: barras más una línea de tendencia, por ejemplo.

## Escalas y ejes

```ts
options: {
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        callback: (valor) => `$${valor}`
      }
    },
    x: {
      grid: { display: false }
    }
  }
}
```

`beginAtZero` pesa más de lo que parece en barras: un eje que arranca en 80 exagera diferencias pequeñas.

## Actualizar y destruir

```ts
chart.data.datasets[0].data = [130, 200, 110, 260]
chart.update()
```

Al desmontar el componente o cambiar de vista, destruye la instancia; si no, el canvas queda con listeners y la siguiente gráfica sobre el mismo elemento falla:

```ts
chart.destroy()
```

## Wrappers por framework

Para React (`react-chartjs-2`), Vue (`vue-chartjs`) o Svelte hay envoltorios que manejan el ciclo de vida del canvas. Dentro de un framework son la opción recomendada: evitan el `destroy` manual y el doble render.

```bash
pnpm add chart.js react-chartjs-2
```

## Límites que conviene tener claros

- Lo dibujado en canvas **no es texto**: un lector de pantalla no lo lee. Acompaña la gráfica con una tabla o un resumen escrito.
- No hay estilos por CSS: colores, fuentes y bordes se configuran en JavaScript.
- Las animaciones por defecto están bien en un dashboard y estorban en una impresión o en un test; se apagan con `options.animation: false`.
- Con miles de puntos, activa `parsing: false` y el plugin de decimation antes de culpar al navegador.
