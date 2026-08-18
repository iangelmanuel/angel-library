---
title: "Motion (ex Framer Motion)"
description: Animaciones declarativas en React — el componente motion, initial/animate/exit y AnimatePresence para animar la salida.
category: frontend
stack: react
order: 14
tags: [react, animation]
website: https://motion.dev
install: npm install motion
related:
  - snippets/css-animations
updatedAt: 2026-08-16
---

Esta librería se llamaba **Framer Motion** — se renombró a **Motion**. El paquete de npm cambió de `framer-motion` a `motion`, y el import pasó a `motion/react` (antes `framer-motion`). Si ves `framer-motion` en un tutorial o proyecto viejo, es la misma librería, la sintaxis del componente `motion.*` no cambió.

## Import

```tsx
import { motion } from 'motion/react';
```

## El componente `motion.*`

Cualquier elemento HTML tiene su versión animable con el prefijo `motion.` — acepta las props normales más `animate`, que anima hacia ese estado apenas cambia.

```tsx
<motion.button animate={{ scale: 1.1 }} whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.95 }}>
  Click
</motion.button>
```

## `initial` / `animate` — Animación de entrada

`initial` es el estado de partida (antes de montar); `animate`, el estado al que anima apenas el componente aparece.

```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.4 }}
>
  Contenido
</motion.div>
```

## `AnimatePresence` — Animar la salida

React desmonta un elemento de forma instantánea por defecto — no hay tiempo para animar su salida. `AnimatePresence` retiene el elemento en el DOM hasta que termina su animación `exit`, y recién ahí lo desmonta de verdad.

```tsx
import { AnimatePresence, motion } from 'motion/react';

function Modal({ abierto }: { abierto: boolean }) {
  return (
    <AnimatePresence>
      {abierto && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          Contenido del modal
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

## Resumen

| API | Uso |
| --- | --- |
| `motion.div`, `motion.button`, etc. | Cualquier tag HTML, animable |
| `animate` | Estado al que anima (cambia cuando cambian las props) |
| `initial` / `animate` | Animación de entrada |
| `whileHover` / `whileTap` | Animación mientras dura la interacción |
| `exit` + `<AnimatePresence>` | Animación de salida, retiene el nodo hasta que termina |
| `transition={{ duration, ease, delay }}` | Configurar cómo se anima el cambio |

## Consideraciones

- `exit` no anima nada sin `<AnimatePresence>` envolviendo al elemento condicional — es fácil olvidarlo y asumir que "no funciona la animación de salida" cuando en realidad falta el wrapper.
- Para animaciones puramente de entrada/hover sin gestos complejos ni salida animada, `animation-timeline: view()` en CSS cubre el caso sin dependencia — ver [Animaciones CSS](/snippets/css-animations). Motion vale la pena cuando necesitas layout animations, gestos (`drag`), o coordinar salida/entrada.
- El nombre del paquete es lo único que cambió con el rebrand — proyectos que todavía instalan `framer-motion` siguen funcionando, pero las versiones nuevas de la librería solo se publican como `motion`.
