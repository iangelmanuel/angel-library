---
title: Boneyard
description: "Genera skeletons de carga a partir de tus propios componentes: los renderiza de verdad, mide el DOM y guarda el resultado, en vez de mantenerlos a mano."
type: libraries
order: 6
tags: [react, skeleton, loading, ui, vue, svelte]
website: https://boneyard.vercel.app/
github: https://github.com/0xGF/boneyard
install: npm install boneyard-js
technologies: [frontend/react/react]
updatedAt: 2026-08-30
---

Un _skeleton_ es ese esqueleto gris que ocupa el sitio del contenido mientras carga. El problema de siempre no es escribirlo, es **mantenerlo**: cada vez que cambia el componente real, el skeleton hecho a mano queda desalineado y nadie se entera hasta que se ve el salto en pantalla.

Boneyard invierte el orden: en lugar de describir el skeleton, lo **deriva del componente real**.

## Cómo funciona

Envuelves lo que quieras esqueletizar:

```tsx title="src/components/PerfilUsuario.tsx"
import { Skeleton } from "boneyard-js"

export function PerfilUsuario() {
  return (
    <Skeleton>
      <article className="perfil">
        <img
          src={usuario.avatar}
          alt=""
        />
        <h2>{usuario.nombre}</h2>
        <p>{usuario.bio}</p>
      </article>
    </Skeleton>
  )
}
```

Y ejecutas el generador:

```bash
npx boneyard-js build
```

El CLI detecta tu servidor de desarrollo, abre un Chromium headless con Playwright, busca cada `<Skeleton>` de la aplicación y toma una instantánea de la disposición del DOM con `getBoundingClientRect()`. Lo hace a tres anchos —375 px móvil, 768 px tablet y 1280 px escritorio— y guarda una representación ligera en JSON.

El resultado es un skeleton que coincide con el componente porque **salió de medirlo**, no de adivinarlo.

## Cuándo conviene

| Situación                                          | ¿Vale la pena?                                              |
| -------------------------------------------------- | ----------------------------------------------------------- |
| Tarjetas, listas y perfiles con estructura estable | Sí: es justo donde el skeleton a mano se desincroniza       |
| Layouts que cambian mucho entre versiones          | Sí: regenerar es un comando                                 |
| Un spinner simple basta                            | No: estás añadiendo Playwright y un paso de build para nada |
| Contenido de altura muy variable                   | Con cuidado: la instantánea captura un estado concreto      |

## Lo que hay que tener en cuenta

- **Es un paso de build con navegador.** Necesita Playwright y el servidor de desarrollo levantado. En CI eso significa instalar el navegador y esperar a que la aplicación arranque.
- **El skeleton es una foto, no un cálculo en vivo.** Si el componente cambia y nadie vuelve a ejecutar `build`, vuelve la desincronización de siempre. Conviene atarlo a un script del proyecto para que no se olvide.
- **Solo mide lo que puede renderizar.** Un componente que depende de datos remotos necesita estar en un estado visible cuando corre la instantánea.

## Marcos soportados

Los `peerDependencies` del paquete declaran React `>=18`, Vue `>=3`, Svelte `>=5.29`, Preact `>=10`, Angular `>=14`, React Native `>=0.71` y Vite `>=5`. Todos son opcionales: se instala solo lo que uses.

Licencia MIT.
