---
title: React Bits
description: Más de 200 componentes animados de React —animaciones de texto, componentes, microinteracciones y fondos— en cuatro variantes (JS/TS × CSS/Tailwind) para copiar y pegar o instalar con shadcn y jsrepo.
tags: [react, animations, components, tailwindcss, micro-interactions, shadcn, backgrounds]
sidebar:
  order: 1
draft: false
resourceCategory: Documentación del paquete
website: https://reactbits.dev
github: https://github.com/DavidHDev/react-bits
technologies:
  - frontend/react/react
  - packages/react-shadcn-ui/shadcn-ui
  - packages/react-magic-ui/magic-ui
  - packages/react-motion/motion
note: "Licencia MIT + Commons Clause: libre para uso personal y comercial, pero no se permite vender los componentes como producto propio."
updatedAt: 2026-09-26
---

No es una dependencia npm: cada componente se **copia al proyecto** (a mano o con una CLI) y queda como código tuyo para modificarlo. Cada uno existe en **4 variantes**: `JS-CSS`, `JS-TW`, `TS-CSS` y `TS-TW`.

## Categorías

| Categoría | Qué hay |
| --- | --- |
| Text Animations | Split Text, Blur Text, Decrypted Text, Shiny Text, Count Up, Rotating Text, Scroll Reveal… |
| Animations | Cursores, bordes eléctricos, Click Spark, Magnet, Pixel Transition, Logo Loop… |
| Components | Carruseles, docks, galerías, tarjetas, menús y otros bloques de UI |
| **Micro** | Microinteracciones para controles de formulario y feedback |
| Backgrounds | Fondos animados (WebGL, partículas, ondas, auroras…) |

### Micro

La colección [Micro](https://reactbits.dev/c/micro) son pequeños controles con animación que dan vida a la interfaz sin convertirla en un espectáculo: Shredder, Paper Crumple, Tear Ticket, Flip Card, Branched Menu, Folder Float, Refine Frame, Thought Line, Voice Pill, Slosh Gauge, Prompt Bar, Swipe Toast, Sling Button, Bell Toggle, Call Chip, Status Mark, Glide Select, Swipe Row, Jelly Radio, Comet Dial, Wake Slider, Code Slots, Dodge Field, Lattice Loader, Scrub Field, Fuse Button, Warm Tooltip, Slide Commit, Rubber Segment, Pulse Heart, Spring Check, Peek Rating, Hold Button y Squish Switch.

## Instalación

### Con la CLI de shadcn

El sufijo elige la variante (`JS`/`TS` + `CSS`/`TW`):

```bash
npx shadcn@latest add @react-bits/SplitText-TS-TW
```

### Con jsrepo

```bash
npx jsrepo@latest add https://reactbits.dev/r/SplitText-TS-TW
```

### A mano

En la página del componente, pestaña **Code**: elige lenguaje y estilos (la elección se recuerda en todo el sitio), copia el archivo e instala las dependencias que liste:

```bash
npm install gsap
```

```tsx
import SplitText from "./SplitText"

<SplitText text="Hello, you!" delay={100} duration={0.6} />
```

Algunos componentes dependen de `gsap`, `motion` o `three`/`ogl`; la pestaña Code indica cuáles.

## MCP para agentes

React Bits recomienda el servidor MCP de shadcn para que el agente busque e instale componentes en lenguaje natural. Primero registra el registro en `components.json`:

```json
{
  "registries": {
    "@react-bits": "https://reactbits.dev/r/{name}.json"
  }
}
```

Después configura el MCP para tu cliente (`claude`, `cursor`, `vscode`…):

```bash
npx shadcn@latest mcp init --client claude
```

Y pide cosas como «muéstrame los fondos disponibles en el registro de React Bits».

## Herramientas gratuitas

| Herramienta | Qué hace |
| --- | --- |
| Background Studio | Explorar y personalizar fondos animados; exportar como video, imagen o código |
| Shape Magic | Crear esquinas redondeadas interiores entre formas; exportar como SVG, React o `clip-path` |
| Texture Lab | Aplicar más de 20 efectos (ruido, dithering, ASCII) a imágenes y videos |

## Tips

- Úsalos con moderación: un par de microinteracciones bien puestas mejoran la UI; veinte la vuelven lenta y ruidosa.
- Respeta `prefers-reduced-motion`: revisa si el componente lo contempla y, si no, desactiva la animación tú.
- Los fondos WebGL cuestan GPU y batería; pruébalos en móviles antes de ponerlos en la portada.
- Hay ports oficiales para [Vue](https://vue-bits.dev/) y [Svelte](https://sveltebits.xyz/).
