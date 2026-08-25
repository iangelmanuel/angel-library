---
title: Atropos
description: Efecto parallax 3D al pasar el mouse — capas con profundidad, táctil desde el mismo código.
category: frontend
stack: react
order: 7
tags: [react, animation, 3d]
website: https://atroposjs.com
install: npm i atropos
related:
  - libraries/motion
updatedAt: 2026-08-25
---

Atropos inclina un elemento en 3D siguiendo el mouse (o el dedo, en touch — usa Pointer Events, así que ambos casos son el mismo código) y da profundidad a sus capas internas moviéndolas a distinta velocidad. Es liviano (~2kb) y no depende de nada más.

## Uso básico

```tsx
import Atropos from 'atropos/react';
import 'atropos/css';

function TarjetaConProfundidad() {
  return (
    <Atropos className="mi-tarjeta" activeOffset={40} shadow highlight>
      <img src="/fondo.png" data-atropos-offset="-5" />
      <img src="/personaje.png" data-atropos-offset="3" />
      <h2 data-atropos-offset="8">Título</h2>
    </Atropos>
  );
}
```

## `data-atropos-offset` — Profundidad por capa

Cada hijo directo con este atributo se mueve a una velocidad distinta al inclinar: valores negativos se sienten "más al fondo", positivos "más cerca". El elemento sin el atributo no se mueve por separado, se inclina junto con el contenedor.

```tsx
<img data-atropos-offset="-5" />  {/* fondo, apenas se mueve */}
<img data-atropos-offset="0" />   {/* capa media */}
<h2 data-atropos-offset="10" />   {/* primer plano, se mueve más */}
```

## Props comunes

```tsx
<Atropos
  activeOffset={40}   // cuánto se "activa" el contenedor completo al hover
  rotateXMax={15}      // rotación máxima en grados, eje X
  rotateYMax={15}      // rotación máxima en grados, eje Y
  shadow               // sombra dinámica según la inclinación
  highlight             // brillo dinámico siguiendo el puntero
>
```

## CSS necesario

Atropos no define el tamaño del contenedor — hay que darle dimensiones explícitas, si no el efecto no tiene espacio donde ocurrir.

```css
.mi-tarjeta {
  width: 320px;
  height: 200px;
}
```

## Props y elementos en una mirada

| API | Uso |
| --- | --- |
| `<Atropos>` | Contenedor que activa el efecto 3D |
| `data-atropos-offset` | En cada hijo directo, define su profundidad relativa |
| `shadow` / `highlight` | Sombra/brillo dinámicos según la inclinación |
| `rotateXMax` / `rotateYMax` | Límite de rotación en grados |
| `activeOffset` | Intensidad del efecto general al activarse |

## Movimiento, rendimiento y accesibilidad

- Sin `width`/`height` explícitos en el contenedor, el efecto no se ve — Atropos no infiere el tamaño del contenido.
- Es puramente visual/decorativo: para algo que además necesita gestos complejos (drag, swipe con física), esto no alcanza — ahí entra [Motion](/libraries/motion).
- El CSS de la librería (`import 'atropos/css'`) es necesario para el posicionamiento interno de las capas — sin ese import, `data-atropos-offset` no tiene efecto aunque el JS esté corriendo.
