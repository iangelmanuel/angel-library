---
title: "AnimateIcons — iconos SVG animados para React, Vue, Angular y JS"
description: "Librería open source de unos 1.500 iconos SVG animados en estilos Lucide y Hugeicons, que se mueven al pasar el ratón o desde código; paquetes para React, Vue, Angular y JavaScript plano, CLI para copiar el código y servidor MCP."
tags: [icons, animation, svg, react, vue, angular, motion, lucide, open-source, mcp]
draft: false
resourceCategory: animations
official: true
website: https://animateicons.in
github: https://github.com/Avijit07x/animateicons
technologies:
  - resources/animations/animated-icons
  - packages/react-motion/motion
  - packages/react-shadcn-ui/shadcn-ui
  - resources/icons/tabler-icons
  - accessibility/a11y-contenido/accessibility-visual-reflow-motion
note: "Licencia MIT. Las formas de los iconos derivan de Lucide y Hugeicons (ver THIRD_PARTY_NOTICES.md del repositorio). Las animaciones usan la librería motion, que el paquete de React ya incluye."
warnings:
  - "Proyecto joven (creado en 2025) en versión 0.x (0.13.0 en octubre de 2026) y con cambios casi a diario: fija la versión del paquete y revisa los cambios antes de actualizar."
updatedAt: 2026-10-27
---

> Creado por **[Avijit Dey](https://github.com/Avijit07x)** con licencia MIT.

**AnimateIcons** es una librería de **iconos SVG animados**: cada icono es un componente que, además de dibujarse, tiene una pequeña animación propia (una campana que oscila, un ojo que parpadea) que se reproduce al pasar el ratón o cuando la lanzas desde tu código. Reúne unos 1.500 iconos en dos estilos, **Lucide** y **Huge**, y se instala como paquete npm o copiando el código del icono a tu proyecto.

No hay que confundirlo con [Animated Icons](/resources/animations/animated-icons) (animatedicons.co), que es un catálogo de iconos para descargar en Lottie, SVG o PNG. AnimateIcons es código: componentes que importas y controlas con props.

## Conceptos en dos frases

- Un **SVG** es una imagen vectorial descrita como XML; al ser parte del DOM, se puede animar con CSS o JavaScript sin perder nitidez.
- **motion** (antes Framer Motion) es la librería de animación que usan estos iconos por dentro. Ver [Motion](/packages/react-motion/motion).
- Un **servidor MCP** (Model Context Protocol) expone herramientas a un agente de IA. El de AnimateIcons le permite buscar iconos y añadirlos a tu proyecto.

## Paquetes

| Paquete                 | Para qué                                                      |
| ----------------------- | ------------------------------------------------------------- |
| `@animateicons/react`   | React 18 y 19, incluido Next.js                               |
| `@animateicons/vue`     | Vue 3 y Nuxt                                                  |
| `@animateicons/angular` | Angular 20, 21 y 22                                           |
| `@animateicons/vanilla` | JavaScript plano y web components; sirve en Svelte, Solid o Astro |

Todos comparten las mismas opciones: `size` (24 por defecto), `color` (`currentColor` por defecto, así hereda el color del texto), `duration` (multiplicador de velocidad: `2` va a la mitad) e `isAnimated` (si es `false`, desactiva la animación al pasar el ratón).

## Uso

En React:

```bash
npm install @animateicons/react
```

```tsx
import { BellRingIcon } from "@animateicons/react/lucide"

export function Notifications() {
  return <BellRingIcon size={24} color="#f45b48" />
}
```

Los iconos se importan por estilo, desde `/lucide` o `/huge`, porque algunos nombres existen en los dos. El nombre sigue el patrón PascalCase con sufijo `Icon`: `bell-ring` pasa a ser `BellRingIcon`.

En Vue, el mismo icono:

```bash
npm install @animateicons/vue
```

```vue
<script setup lang="ts">
import { BellRingIcon } from "@animateicons/vue/lucide"
</script>

<template>
  <BellRingIcon :size="32" color="tomato" />
</template>
```

### Animar al interactuar con otro elemento

Por defecto el icono se anima cuando el ratón pasa por encima **del icono**. Lo habitual es querer que se anime al pasar por el botón o la tarjeta que lo contiene. En React, el hook `useIconHover` conecta las dos cosas:

```tsx
"use client"
import { useIconHover } from "@animateicons/react"
import { BellRingIcon } from "@animateicons/react/lucide"

export default function Bell() {
  const { ref, triggerProps } = useIconHover()
  return (
    <button {...triggerProps}>
      <BellRingIcon ref={ref} size={28} />
    </button>
  )
}
```

Para controlarlo del todo desde código, pon `isAnimated` a `false` y llama a `startAnimation()` y `stopAnimation()` sobre la referencia del icono.

## Copiar el código en lugar de instalar

Si prefieres tener el componente en tu repositorio, como hace [shadcn/ui](/packages/react-shadcn-ui/shadcn-ui), la CLI copia iconos sueltos:

```bash
npx animateicons add bell-ring
npx animateicons add eye bell-ring user
npx animateicons search notification
```

Los escribe en `components/icons/<nombre>.tsx` (cámbialo con `--dir`). El código copiado importa `cn` desde `@/lib/utils` y necesita `motion` instalado; si tu proyecto no usa shadcn, `--with-utils` crea ese `cn`. También se pueden añadir con la CLI de shadcn (ver la [documentación](https://animateicons.in/icons/docs/shadcn)).

## Servidor MCP

Para que un agente busque y añada iconos por ti, en Claude Code:

```bash
claude mcp add animateicons -- npx -y @animateicons/mcp
```

Expone `search_icons`, `get_icon`, `add_icon` (escribe el componente de React en tu proyecto), `get_docs` y `list_libraries`.

## Accesibilidad

Según su documentación, los iconos respetan la preferencia del sistema de **reducir movimiento** (`prefers-reduced-motion`) sin configuración: con ella activada, no se animan al pasar el ratón y `startAnimation()` deja el icono quieto. Aun así, el movimiento debe acompañar a una acción o un cambio de estado, no decorar; ver [movimiento y accesibilidad visual](/accessibility/a11y-contenido/accessibility-visual-reflow-motion).

## Alternativas

| Recurso                                                    | Formato                         | Cuándo elegirlo                                         |
| ---------------------------------------------------------- | ------------------------------- | ------------------------------------------------------- |
| AnimateIcons                                               | Componentes con props y API     | Quieres iconos animados integrados en tu código         |
| [Animated Icons](/resources/animations/animated-icons)     | Archivos Lottie, SVG o PNG      | Necesitas un archivo animado suelto o para otra plataforma |
| [Tabler Icons](/resources/icons/tabler-icons)              | Iconos SVG estáticos            | No necesitas movimiento                                 |

## Fuentes

- [animateicons.in](https://animateicons.in) y su [documentación](https://animateicons.in/icons/docs) (React, Vue, Angular, CLI y MCP)
- [Repositorio Avijit07x/animateicons](https://github.com/Avijit07x/animateicons)
- [`@animateicons/react` en npm](https://www.npmjs.com/package/@animateicons/react)
