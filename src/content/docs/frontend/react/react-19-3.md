---
title: "React 19.3: View Transitions, browser, Fragment Refs y Server Components"
description: Guía completa de las APIs estables y cambios relevantes de React 19.3, con ejemplos de DOM, SSR, Suspense, Trusted Types y Context en Server Components.
type: guides
sidebar:
  order: 18
tags: [react, react-19, view-transitions, fragment-refs, browser, trusted-types, server-components, suspense]
website: https://react.dev/blog/2026/09/09/react-19-3
github: https://github.com/facebook/react
related:
  - frontend/react/react
  - frontend/react/react-suspense-lazy-use
  - frontend/react/react-usetransition
  - frontend/react/react-context-api
  - frontend/react/react-performance-compiler
updatedAt: 2026-09-10
---

## En pocas palabras

React **19.3** está disponible desde el 9 de septiembre de 2026. Esta versión estabiliza las View Transitions y los Fragment Refs, incorpora `browser()` para marcar componentes que solo deben renderizarse en el navegador, conserva objetos Trusted Types sin convertirlos a cadenas y permite que un Server Component renderice un Context importado desde un módulo cliente.

La versión no cambia el modelo básico de React: el render debe seguir siendo puro, los eventos solicitan actualizaciones y los efectos sincronizan sistemas externos. Las nuevas APIs resuelven fronteras concretas entre React, el DOM, el servidor y el navegador.

| Novedad | Paquete | Para qué sirve |
| --- | --- | --- |
| `<ViewTransition>` | `react` | Animar entrada, salida, cambios, reordenamientos y elementos compartidos. |
| `addTransitionType` | `react` | Indicar por qué ocurrió una transición para elegir su animación. |
| Fragment Refs | `react` | Operar sobre varios nodos DOM sin insertar un contenedor. |
| `browser()` | `react-dom` | Optar por no renderizar una parte en el servidor y dejar el fallback de Suspense. |
| Trusted Types | `react-dom` | Pasar objetos Trusted Types a sinks del DOM sin convertirlos a strings. |
| Context en Server Components | `react` + framework RSC | Renderizar `<Context value={...}>` directamente desde un Server Component. |

## Antes de empezar

Actualiza React y React DOM juntos. El rango exacto puede cambiar cuando aparezcan parches, por lo que conviene fijar el lockfile:

```bash
pnpm add react@19.3 react-dom@19.3
```

Si usas TypeScript, actualiza también los tipos que tu proyecto mantenga explícitamente:

```bash
pnpm add -D @types/react@latest @types/react-dom@latest
```

Comprueba que tu framework soporte React 19.3 y Server Components antes de usar las APIs de servidor. `<ViewTransition>` y Fragment Refs son APIs de React DOM; React Native todavía no las implementa. Las animaciones dependen además de la View Transition API del navegador, así que prueba el navegador mínimo de tu producto y define un estado que siga siendo usable si no hay animación.

La ruta de adopción recomendada es incremental:

1. actualiza React y ejecuta las pruebas existentes;
2. activa una API nueva en una pantalla pequeña;
3. comprueba SSR, hidratación, accesibilidad y navegación con teclado;
4. mide antes de extenderla al resto de la aplicación.

## 1. View Transitions

### Qué problema resuelve

Una actualización de React puede cambiar el DOM de forma instantánea: aparece una pantalla nueva, una tarjeta cambia de tamaño o una imagen se mueve. `<ViewTransition>` conecta esos cambios con la View Transition API del navegador y permite que React coordine la captura, el commit y la animación.

```tsx
import { startTransition, useState, ViewTransition } from "react"

export function DetailsToggle() {
  const [showDetails, setShowDetails] = useState(false)

  function toggleDetails() {
    startTransition(() => {
      setShowDetails((visible) => !visible)
    })
  }

  return (
    <section>
      <button type="button" onClick={toggleDetails}>
        {showDetails ? "Ocultar detalles" : "Mostrar detalles"}
      </button>

      {showDetails && (
        <ViewTransition>
          <article>
            <h2>Detalles</h2>
            <p>Esta región entra y sale con una transición.</p>
          </article>
        </ViewTransition>
      )}
    </section>
  )
}
```

El `setState` está dentro de `startTransition` porque React solo activa View Transitions para actualizaciones no urgentes, revelaciones de Suspense o cambios derivados de `useDeferredValue`. Un `setState` normal sigue siendo inmediato y no activa automáticamente esta animación.

### Cuatro tipos de animación

React decide qué tipo aplicar mirando el árbol antes y después de la transición:

| Tipo | Cuándo aparece | Ejemplo |
| --- | --- | --- |
| `enter` | Se monta un límite `<ViewTransition>`. | Abrir un panel. |
| `exit` | Se desmonta un límite. | Cerrar un panel. |
| `update` | Cambian contenido, estilo, tamaño o posición. | Cambiar una tarjeta. |
| `share` | Un límite con `name` desaparece y otro con el mismo nombre aparece. | Miniatura → vista completa. |

El navegador produce un cross-fade por defecto. Puedes elegir una clase por tipo:

```tsx
<ViewTransition
  default="none"
  enter="panel-enter"
  exit="panel-exit"
  update="panel-update"
>
  <Panel />
</ViewTransition>
```

```css
::view-transition-new(.panel-enter) {
  animation: panel-in 180ms ease-out;
}

::view-transition-old(.panel-exit) {
  animation: panel-out 140ms ease-in;
}

::view-transition-group(.panel-update) {
  animation-duration: 220ms;
}

@keyframes panel-in {
  from { opacity: 0; transform: translateY(0.5rem); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes panel-out {
  from { opacity: 1; }
  to { opacity: 0; }
}

@media (prefers-reduced-motion: reduce) {
  ::view-transition-group(*) {
    animation-duration: 1ms;
  }
}
```

`default="none"` desactiva los tipos que no declares explícitamente. Los valores posibles son `auto`, `none`, un nombre de clase o un objeto indexado por tipo de transición. React recomienda usar clases de View Transition en lugar de asignar manualmente `view-transition-name` para la mayoría de los casos.

### Elementos compartidos

Usa `name` solo cuando el mismo elemento conceptual cambia de lugar o de componente. El nombre debe ser único en todo el árbol durante la transición:

```tsx
const PRODUCT_IMAGE = "product-image"

function ProductCard({ onOpen }: { onOpen: () => void }) {
  return (
    <button type="button" onClick={onOpen}>
      <ViewTransition name={PRODUCT_IMAGE}>
        <img src="/products/keyboard.webp" alt="Teclado mecánico" />
      </ViewTransition>
    </button>
  )
}

function ProductPage({ onClose }: { onClose: () => void }) {
  return (
    <main>
      <button type="button" onClick={onClose}>Volver</button>
      <ViewTransition name={PRODUCT_IMAGE}>
        <img src="/products/keyboard.webp" alt="Teclado mecánico" />
      </ViewTransition>
    </main>
  )
}
```

No montes dos límites con el mismo nombre al mismo tiempo. Para una lista que se reordena, conserva `key` estable y coloca un `<ViewTransition>` por elemento; `name` no sustituye a `key`.

### Suspense, imágenes y fuentes

Una frontera de Suspense dentro de View Transition puede animar el paso del fallback al contenido final:

```tsx
import { Suspense, ViewTransition } from "react"

export function ProfileRegion() {
  return (
    <ViewTransition update="profile-update" default="none">
      <Suspense fallback={<ProfileSkeleton />}>
        <Profile />
      </Suspense>
    </ViewTransition>
  )
}
```

Para una buena experiencia, muestra el fallback de inmediato y anima la revelación del contenido real. `default="none"` con `update="profile-update"` evita que el skeleton se anime cada vez que la vista ya está en caché.

React también puede esperar imágenes, fuentes y hojas de estilo nuevas dentro de una View Transition antes de comenzar la animación. Esto evita que una imagen o una tipografía aparezca tarde y rompa la captura visual. No envuelvas toda la aplicación por defecto: espera solo los recursos cuya llegada deba formar parte de la misma transición.

### Control con JavaScript

Los eventos `onEnter`, `onExit`, `onUpdate` y `onShare` reciben una instancia de la View Transition y los tipos asociados. Puedes usar la Web Animations API y devolver una función de limpieza:

```tsx
<ViewTransition
  onEnter={(instance, types) => {
    const animation = instance.new.animate(
      [{ opacity: 0 }, { opacity: 1 }],
      { duration: 180, easing: "ease-out" }
    )

    console.debug("Entrada causada por:", types)
    return () => animation.cancel()
  }}
>
  <Card />
</ViewTransition>
```

Solo se dispara un evento por límite y transición; `onShare` tiene prioridad sobre `onEnter` y `onExit`. Devuelve siempre la limpieza si creas animaciones imperativas.

### Errores frecuentes con View Transitions

- Llamar manualmente a `document.startViewTransition`: deja que React coordine la transición para evitar interferencias.
- Esperar una animación después de un `setState` urgente: usa `startTransition` cuando el cambio sea apropiado para una transición.
- Poner nodos DOM antes del límite cuando necesitas una animación `enter` o `exit` de nivel superior.
- Usar el mismo `name` en dos elementos montados.
- Animar toda una pantalla cuando solo cambia una región pequeña.
- Ignorar `prefers-reduced-motion`.
- Usar `flushSync` durante la secuencia: React puede omitir la transición si no puede completarla de forma síncrona.

## 2. `addTransitionType`

Dos actualizaciones pueden producir el mismo estado pero tener causas distintas. Por ejemplo, pasar de la diapositiva 2 a la 3 puede ocurrir al pulsar «Siguiente» o al pulsar «Anterior» desde otra posición circular. `addTransitionType` registra esa causa dentro del `startTransition`.

```tsx
import { addTransitionType, startTransition, useState } from "react"

export function Carousel({ total }: { total: number }) {
  const [slide, setSlide] = useState(0)

  function goNext() {
    startTransition(() => {
      addTransitionType("carousel-next")
      setSlide((current) => (current + 1) % total)
    })
  }

  function goPrevious() {
    startTransition(() => {
      addTransitionType("carousel-previous")
      setSlide((current) => (current - 1 + total) % total)
    })
  }

  return (
    <>
      <button type="button" onClick={goPrevious}>Anterior</button>
      <button type="button" onClick={goNext}>Siguiente</button>
      <p>Diapositiva {slide + 1}</p>
    </>
  )
}
```

Conecta el tipo a una View Transition:

```tsx
<ViewTransition
  key={slide}
  enter={{
    "carousel-next": "from-right",
    "carousel-previous": "from-left",
    default: "none"
  }}
  exit={{
    "carousel-next": "to-left",
    "carousel-previous": "to-right",
    default: "none"
  }}
>
  <Slide />
</ViewTransition>
```

React también expone los tipos al navegador. Puedes seleccionar la transición activa desde CSS:

```css
:root:active-view-transition-type(carousel-next)
 ::view-transition-new(*) {
  animation-name: slide-from-right;
}

:root:active-view-transition-type(carousel-previous)
 ::view-transition-new(*) {
  animation-name: slide-from-left;
}
```

Un tipo es cualquier string; no existe un catálogo cerrado. Puedes registrar más de uno dentro de la misma transición y React los combina. Los tipos se reinician después de cada commit: una revelación posterior de Suspense no hereda automáticamente el tipo de la transición que inició la carga.

## 3. Fragment Refs

### Qué problema resuelven

Un componente puede devolver varios hermanos sin un contenedor. Antes, para añadir listeners, observar visibilidad o gestionar foco, normalmente había que insertar un `<div>` o modificar el componente para que expusiera un ref. En React 19.3 puedes pasar un ref al `Fragment` explícito:

```tsx
import { Fragment, useRef } from "react"

export function NavigationGroup() {
  const groupRef = useRef(null)

  return (
    <Fragment ref={groupRef}>
      <a href="/inicio">Inicio</a>
      <a href="/documentacion">Documentación</a>
      <button type="button">Más</button>
    </Fragment>
  )
}
```

La sintaxis corta `<>...</>` no acepta `ref`; usa siempre `Fragment` importado cuando necesites la referencia. React no añade un nodo al DOM.

### Qué es `FragmentInstance`

El valor de `ref.current` es un `FragmentInstance`. Los métodos que operan sobre hijos apuntan a los nodos DOM de primer nivel; `focus` y `focusLast` buscan elementos enfocables de forma profunda:

| Método | Uso |
| --- | --- |
| `addEventListener` / `removeEventListener` | Añadir o retirar un listener en cada hijo DOM de primer nivel. |
| `dispatchEvent` | Lanzar un evento en el grupo y permitir que burbujee al padre. |
| `focus` / `focusLast` / `blur` | Gestionar foco en los descendientes enfocables. |
| `observeUsing` / `unobserveUsing` | Conectar un `IntersectionObserver` o `ResizeObserver`. |
| `getClientRects` | Obtener los rectángulos de los hijos de primer nivel. |
| `getRootNode` | Obtener `Document`, `ShadowRoot` o el propio fragmento. |
| `compareDocumentPosition` | Comparar la posición con otro nodo DOM. |
| `scrollIntoView` | Desplazar los hijos a la vista. Acepta un booleano, no un objeto de opciones. |

Considera este árbol:

```tsx
<Fragment ref={ref}>
  <div id="a" />
  <Wrapper><div id="b"><div id="c" /></div></Wrapper>
  <div id="d" />
</Fragment>
```

Los métodos de eventos, observadores y rectángulos apuntan a `a`, `b` y `d`. No apuntan directamente a `c`, porque está anidado bajo el nodo DOM `b`. El foco sí recorre descendientes anidados.

### Listener sin wrapper

```tsx
import { Fragment, useEffect, useRef, type ReactNode } from "react"

type ClickableGroupProps = {
  children: ReactNode
  onClick: EventListener
}

export function ClickableGroup({ children, onClick }: ClickableGroupProps) {
  const groupRef = useRef(null)

  useEffect(() => {
    const group = groupRef.current
    if (group === null) return

    group.addEventListener("click", onClick)
    return () => group.removeEventListener("click", onClick)
  }, [onClick])

  return <Fragment ref={groupRef}>{children}</Fragment>
}
```

Cuando los hijos de primer nivel aparecen o desaparecen, React añade o retira el listener automáticamente. Aun así, el efecto debe limpiar el listener cuando cambia `onClick` o se desmonta el componente.

### Observar visibilidad de un grupo

```tsx
import { Fragment, useEffect, useRef, type ReactNode } from "react"

export function InViewGroup({
  onChange,
  children
}: {
  onChange: (visible: boolean) => void
  children: ReactNode
}) {
  const groupRef = useRef(null)

  useEffect(() => {
    const group = groupRef.current
    if (group === null) return

    const observer = new IntersectionObserver((entries) => {
      onChange(entries.some((entry) => entry.isIntersecting))
    })

    group.observeUsing(observer)
    return () => {
      group.unobserveUsing(observer)
      observer.disconnect()
    }
  }, [onChange])

  return <Fragment ref={groupRef}>{children}</Fragment>
}
```

`observeUsing` no observa nodos de texto. Si un fragmento solo contiene texto, crea una estructura DOM apropiada o usa otra estrategia.

### Cuándo usar Fragment Refs

- componentes de layout que no deben introducir un wrapper;
- grupos de botones o enlaces que necesitan el mismo listener;
- secciones hermanas que comparten visibilidad o medición;
- mover el foco entre una colección de controles.

No uses un Fragment Ref para esconder una arquitectura de estado o para recorrer todo el DOM. Si un componente es propietario de un solo nodo, un ref normal es más sencillo.

## 4. `browser()` para renderizado solo en el navegador

### El problema de SSR

Con renderizado en servidor, un componente se ejecuta primero para producir HTML y vuelve a ejecutarse en el navegador para hidratarlo. APIs como `localStorage`, `window` o la zona horaria local no existen o no tienen el mismo valor en el servidor. `browser()` ofrece una frontera explícita para decir: «este componente no puede producir contenido útil en SSR».

```tsx
import { Suspense, use } from "react"
import { browser } from "react-dom"

function LocalTimeZone() {
  use(browser("La zona horaria se obtiene del dispositivo."))

  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
  return <p>Tu zona horaria: {timeZone}</p>
}

export function TimeZoneCard() {
  return (
    <Suspense fallback={<p>Cargando zona horaria…</p>}>
      <LocalTimeZone />
    </Suspense>
  )
}
```

Durante SSR, `use(browser())` suspende y el HTML contiene el fallback de la frontera `<Suspense>` más cercana. En el navegador devuelve `undefined` y el componente continúa renderizando. Esto evita una comprobación manual con `typeof window` y evita un primer render artificial controlado por `useEffect`.

### El orden exacto importa

- Importa `use` desde `react` y `browser` desde `react-dom`.
- Llama `use(browser())`; llamar `browser()` por sí solo no produce ningún efecto.
- El componente debe estar dentro de `<Suspense>` durante SSR. Sin una frontera, el render del servidor falla.
- La llamada puede estar después de un retorno temprano o dentro de una condición porque `use` admite ese patrón.
- En una aplicación con Server Components, el archivo que llama `use(browser())` debe ser Client Component (`"use client"`). Un Server Component no puede llamar esta API directamente.

Puedes renderizar un valor inicial cuando sí existe una alternativa segura:

```tsx
import { use } from "react"
import { browser } from "react-dom"

export function TimeZone({ defaultValue }: { defaultValue?: string }) {
  if (defaultValue !== undefined) {
    return <p>Zona del evento: {defaultValue}</p>
  }

  use(browser("No se proporcionó una zona horaria inicial."))
  return <p>Tu zona: {Intl.DateTimeFormat().resolvedOptions().timeZone}</p>
}
```

### Informar el motivo al servidor

El argumento opcional puede ser un string o una función. React usa el valor como `cause` del error que recibe `onBrowserBailout`:

```tsx
import { Suspense, use } from "react"
import { browser } from "react-dom"
import { renderToPipeableStream } from "react-dom/server"

function SavedDraft() {
  use(browser(() => new Error("El borrador vive en localStorage.")))
  return <textarea defaultValue={localStorage.getItem("draft") ?? ""} />
}

function App() {
  return (
    <Suspense fallback={<p>Cargando borrador…</p>}>
      <SavedDraft />
    </Suspense>
  )
}

renderToPipeableStream(<App />, {
  onShellReady() {
    // Conecta el stream a la respuesta HTTP de tu servidor.
  },
  onBrowserBailout(error, errorInfo) {
    console.warn("Contenido reservado para el navegador", {
      cause: error.cause,
      componentStack: errorInfo.componentStack
    })
  }
})
```

El ejemplo muestra la forma de recibir el diagnóstico; la conexión del stream depende del servidor HTTP y del framework. No copies `renderToPipeableStream` en un adaptador que use otra API de streaming sin consultar su documentación.

También puedes usar el valor de `browser()` como razón para `abort` cuando el servidor debe dejar de esperar y permitir que el navegador complete el contenido:

```tsx
const { pipe, abort } = renderToPipeableStream(<App />, {
  onShellReady() {
    pipe(response)
    setTimeout(() => {
      abort(browser("El render del servidor superó el tiempo permitido."))
    }, 10_000)
  }
})
```

Ese patrón solo corresponde a servidores que controlan directamente la API de renderizado. En Next.js, Remix u otro framework, usa el mecanismo de streaming y timeout que el adaptador documente.

### Cuándo no usar `browser()`

Si puedes generar el mismo HTML en servidor y cliente, hazlo. No conviertas un componente completo en browser-only solo para ocultar un warning de hidratación: primero corrige la causa o pasa un valor inicial determinista. `browser()` es útil cuando el servidor no puede producir contenido significativo, no como sustituto de una fuente de datos.

## 5. Trusted Types

### Qué cambia

Trusted Types es una defensa del navegador contra XSS basado en sinks como `innerHTML`, `outerHTML` o `script.src`. Una política CSP puede exigir que esos valores sean objetos `TrustedHTML`, `TrustedScript` o `TrustedScriptURL`, generados por políticas de sanitización.

Antes, React convertía ciertos valores a string antes de entregarlos al DOM. En React 19.3, React conserva el objeto Trusted Types para que el navegador pueda validarlo. Esto hace posible usar una política CSP estricta sin que React destruya el tipo seguro durante la renderización.

Configura la política en el servidor, por ejemplo:

```http
Content-Security-Policy: require-trusted-types-for 'script'; trusted-types app-html
```

La política debe crearse con un sanitizador auditado. Este ejemplo muestra el contrato, no implementa un sanitizador:

```tsx
import DOMPurify from "dompurify"

const policy =
  typeof window === "undefined"
    ? undefined
    : window.trustedTypes?.createPolicy("app-html", {
        createHTML(input) {
          return DOMPurify.sanitize(input, { RETURN_TRUSTED_TYPE: false })
        }
      })

export function RichText({ html }: { html: string }) {
  const safeHtml = policy?.createHTML(html)
  if (safeHtml === undefined) return <p>No se pudo preparar el contenido.</p>

  return <article dangerouslySetInnerHTML={{ __html: safeHtml }} />
}
```

Puntos importantes:

- Trusted Types no sanitiza por sí solo; la política decide cómo limpiar el HTML.
- No crees una política que devuelva la entrada sin validar.
- `dangerouslySetInnerHTML` sigue siendo peligroso con contenido no confiable.
- Asegura que la política exista en el navegador y define una estrategia para navegadores sin `trustedTypes`.
- Prueba también scripts, enlaces, URLs, estilos y cualquier librería que escriba directamente en el DOM.

React 19.3 mejora la interoperabilidad con el navegador; no reemplaza CSP, sanitización, control de fuentes ni revisión de dependencias.

## 6. Context directamente en Server Components

### Antes

Un Server Component no puede crear Context, pero sí puede importar un Context definido en un módulo cliente. Antes, era común exportar un componente `Provider` que solo reenviaba el valor:

```tsx title="user-context.tsx"
"use client"

import { createContext } from "react"

export const UserContext = createContext<User | null>(null)

export function UserProvider({ value, children }) {
  return <UserContext value={value}>{children}</UserContext>
}
```

```tsx title="layout.tsx"
import { UserProvider } from "./user-context"

export async function Layout({ children }) {
  const user = await getCurrentUser()

  return <UserProvider value={user}>{children}</UserProvider>
}
```

### En React 19.3

El Server Component puede importar y renderizar el Context directamente:

```tsx title="user-context.tsx"
"use client"

import { createContext } from "react"

export type User = { id: string; name: string }
export const UserContext = createContext<User | null>(null)
```

```tsx title="layout.tsx"
import { UserContext } from "./user-context"

export async function Layout({ children }) {
  const user = await getCurrentUser()

  return (
    <UserContext value={user}>
      {children}
    </UserContext>
  )
}
```

Un Client Component descendiente puede leer el valor:

```tsx title="user-menu.tsx"
"use client"

import { use } from "react"
import { UserContext } from "./user-context"

export function UserMenu() {
  const user = use(UserContext)
  return <span>{user ? user.name : "Invitado"}</span>
}
```

La novedad elimina un wrapper que no aportaba lógica. No permite crear Context desde un Server Component, ni convierte automáticamente los hijos en Client Components. El módulo que declara `createContext` conserva `"use client"`, y el framework debe soportar Server Components y el transporte de Context.

### Decidir si necesitas Context

Usa este patrón para datos que el árbol cliente necesita y que el servidor ya conoce: usuario autenticado, configuración regional, permisos o tema. Mantén el valor serializable según las reglas del framework. No pases conexiones de base de datos, funciones del servidor o secretos al Context del cliente.

## Otros cambios relevantes de React 19.3

Además de las APIs anteriores, el anuncio oficial registra estos cambios:

### React

- Las transiciones se renderizan de forma independiente. Una transición lenta ya no retiene transiciones no relacionadas.
- React avisa cuando `use` se utiliza incorrectamente en una condición. `use` admite condiciones, pero debe seguir el contrato documentado y no puede envolverse en `try/catch`.
- Los mensajes de `useActionState` usan «action state» en lugar de «form state».
- Se corrige un caso donde `useDeferredValue` podía quedarse con un valor antiguo.
- Se corrige la propagación de Context hacia fallbacks de Suspense y a través de fronteras suspendidas.
- Se corrigen bloqueos al actualizar una frontera de Suspense deshidratada dentro de un árbol oculto.
- Se corrige `useSyncExternalStore` cuando el store cambia mientras un árbol `<Activity>` está oculto.
- `useEffectEvent` lee los valores más recientes en componentes `forwardRef` y `memo`.
- Se corrigen estados de formularios que se reiniciaban al actualizar el estado del componente.
- Se corrigen varios casos de Fast Refresh con `lazy`, `memo` y cambios de tipo de componente.
- Los errores ya no escapan de un `<Activity>` oculto, y los portales dentro de un Activity oculto también se ocultan.
- Se corrige el mensaje que hacía referencia al tipo interno `<Offscreen>`.
- Se añade soporte de `<Activity>` en Flight.
- `Error.cause` y `AggregateError.errors` se transportan al cliente desde `react-server`.

### React DOM

- Strict Mode invoca dos veces los efectos durante hidratación, igual que en raíces renderizadas en el cliente. Revisa que los efectos tengan cleanup y sean idempotentes.
- Se añaden `onFullscreenChange` y `onFullscreenError`.
- Se añade la propiedad SVG `maskType`.
- Se admite `fetchPriority` para recursos de tipo módulo.
- React dispara `onReset` cuando restablece automáticamente un formulario tras un Server Action.
- Los eventos `submit` incluyen el elemento que inició el envío (`submitter`).
- `credentialless` se reconoce como atributo booleano de `iframe`.
- Las actualizaciones causadas por eventos `resize` se agrupan hasta el siguiente frame.
- Se corrige una fuga de listeners de `FragmentInstance` al normalizar las opciones de captura.
- Se corrigen cierres de `<ViewTransition>` en Mobile Safari y con `SuspenseList`.
- Se ajusta `defaultValue` de inputs `type="number"` para que coincida con otros tipos.
- React evita escribir `innerHTML` cuando el valor no cambió.
- Se corrigen falsos positivos de mismatch de hidratación en atributos `nonce`.
- `react-dom/server` deja de quedarse colgado en Deno.
- Se corrige el foco en elementos delegados o que ya tenían foco.

### `react-server`

- Se conservan las entradas de `FormData` al decodificar respuestas con
  `decodeReplyFromBusboy`.
- Se corrigen el desbordamiento de pila con cadenas asíncronas muy profundas y
  el `RangeError` provocado por el crecimiento exponencial de la información de
  depuración.

Estos cambios no requieren que reescribas la aplicación. Son razones para ejecutar pruebas de hidratación, formularios, eventos fullscreen, SVG, iframes, transiciones y código que use `Activity`.

## Migración comprobable

Usa esta lista al actualizar una aplicación existente:

1. Actualiza `react` y `react-dom` al mismo rango y regenera el lockfile.
2. Ejecuta tests de render cliente, SSR e hidratación en modo desarrollo y producción.
3. Revisa cada efecto bajo Strict Mode: sus recursos deben limpiarse y no duplicar suscripciones.
4. Reemplaza comprobaciones de `typeof window` solo donde `browser()` aporte una frontera de Suspense más clara.
5. Añade `<ViewTransition>` a una región pequeña y prueba con movimiento reducido.
6. Comprueba que cada View Transition tenga una causa y un `key` coherentes; no uses `name` como sustituto de identidad.
7. Prueba Fragment Refs con hijos dinámicos, nodos anidados y desmontaje.
8. Si usas Trusted Types, activa primero la CSP en un entorno de prueba y audita cada sink HTML.
9. Si usas Server Components, confirma que el framework soporte renderizar `<Context value>` desde el servidor.
10. Revisa el [changelog completo de React](https://github.com/facebook/react/blob/main/CHANGELOG.md) antes de fijar la versión en producción.

## Errores y decisiones rápidas

| Síntoma | Causa probable | Corrección |
| --- | --- | --- |
| No hay animación | El update es urgente o el navegador no soporta View Transition. | Usa `startTransition` cuando corresponda y conserva un estado funcional sin animación. |
| La animación sale desde el lugar incorrecto | El límite está debajo de un wrapper o el `name` se repite. | Ajusta el límite y usa nombres globalmente únicos solo para elementos compartidos. |
| SSR falla con `browser()` | Falta `<Suspense>` o se llamó `browser()` sin pasarlo a `use`. | Añade una frontera y usa `use(browser(reason))`. |
| Aparece un mismatch de hidratación | Servidor y navegador producen valores distintos sin una frontera. | Pasa un valor inicial estable o reserva el componente para el navegador. |
| `FragmentInstance` no observa un nodo | El nodo es texto o está anidado bajo otro elemento DOM. | Usa un nodo host de primer nivel o una API específica del componente. |
| Trusted Types sigue bloqueando el DOM | La política no está configurada o devuelve strings sin sanitizar. | Revisa CSP, política, sanitizador y tipos entregados al sink. |
| Context no cruza la frontera RSC | El Context se creó en un Server Component o el framework no soporta esta capacidad. | Decláralo en un módulo `"use client"` y usa una versión compatible del framework. |

## Fuentes oficiales

- [Anuncio de React 19.3](https://react.dev/blog/2026/09/09/react-19-3)
- [Referencia de `<ViewTransition>`](https://react.dev/reference/react/ViewTransition)
- [Referencia de `addTransitionType`](https://react.dev/reference/react/addTransitionType)
- [Referencia de `<Fragment>` y `FragmentInstance`](https://react.dev/reference/react/Fragment)
- [Referencia de `browser`](https://react.dev/reference/react-dom/browser)
- [Referencia de `use`](https://react.dev/reference/react/use)
- [View Transition API del navegador](https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API)
- [Trusted Types API](https://developer.mozilla.org/en-US/docs/Web/API/Trusted_Types_API)
- [Changelog de React](https://github.com/facebook/react/blob/main/CHANGELOG.md)
