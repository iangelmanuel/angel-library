---
title: useEffect — y cómo evitar loops infinitos
description: Sincronizar sistemas externos y distinguir bucles, dependencias obsoletas y suscripciones que se repiten.
type: guides
order: 9
tags: [react, hooks, effects]
scope: react (useEffect)
updatedAt: 2026-09-07
---

`useEffect` no es "código que corre después del render" en general — es específicamente para **sincronizar el componente con algo que vive fuera de React**: una conexión, una suscripción, el `document.title`, un timer. Si el efecto no sincroniza con nada externo, probablemente no debería ser un efecto (ver Consideraciones). Esa distinción es la que evita la mayoría de los usos incorrectos, loops incluidos.

## La forma básica

```tsx
useEffect(() => {
  // sincronización después del commit; no implica siempre después del pintado
  return () => {
    // cleanup: corre antes del próximo efecto, y al desmontar
  }
}, [dependencias])
```

El array de dependencias no es una opción de "cuándo correr" que tú eliges libremente — tiene que listar **todos** los valores reactivos (props, state, y cualquier cosa derivada de ellos) que el efecto lee. React los compara con los del render anterior; si alguno cambió, vuelve a correr el efecto.

## Causa 1 — Falta una dependencia real

Una dependencia omitida suele producir valores obsoletos, no un bucle por sí sola. Para un bucle, un efecto debe provocar una actualización que cambie de nuevo sus dependencias. Los siguientes son problemas de sincronización diferentes; diagnostica cuál observas antes de modificar el array.

```tsx
function ChatRoom({ roomId }: { roomId: string }) {
  useEffect(() => {
    const conexion = crearConexion(roomId)
    conexion.conectar()
    return () => conexion.desconectar()
  }, []) // 🔴 roomId se usa adentro pero no está declarado
}
```

El linter de hooks (`eslint-plugin-react-hooks`) marca esto. La solución casi nunca es silenciarlo con un comentario — es agregar la dependencia que falta:

```tsx
  }, [roomId]); // ✅
```

## Causa 2 — Un objeto o función nuevo en cada render

Un objeto literal (`{ ... }`) o una función declarada dentro del componente son un valor **distinto** en cada render, aunque su contenido sea "igual". Si eso es una dependencia, el efecto piensa que cambió en cada render y vuelve a correr — sin fin, si además ese efecto causa un re-render.

```tsx
function ChatRoom({ roomId }: { roomId: string }) {
  const opciones = { roomId, servidor: "wss://ejemplo.com" } // 🔴 objeto nuevo cada render

  useEffect(() => {
    const conexion = crearConexion(opciones)
    conexion.conectar()
    return () => conexion.desconectar()
  }, [opciones]) // se repite con cada render; solo forma un bucle si provoca más renders
}
```

Solución: mueve el objeto **dentro** del efecto —así deja de ser una dependencia externa— y depende solo de los valores primitivos que realmente cambian.

```tsx
useEffect(() => {
  const opciones = { roomId, servidor: "wss://ejemplo.com" }
  const conexion = crearConexion(opciones)
  conexion.conectar()
  return () => conexion.desconectar()
}, [roomId]) // ✅ depende de un primitivo, no de un objeto
```

## Causa 3 — Leer un state para actualizar ese mismo state

```tsx
useEffect(() => {
  conexion.on("mensaje", (nuevo) => {
    setMensajes([...mensajes, nuevo]) // 🔴 lee "mensajes"
  })
}, [roomId, mensajes]) // mensajes cambia → el efecto se re-ejecuta → reconecta → ...
```

Arreglo: usar la forma funcional de `setState`, que recibe el valor más reciente sin necesitar leerlo afuera — así `mensajes` deja de ser una dependencia.

```tsx
useEffect(() => {
  const conexion = crearConexion(roomId)
  const onMensaje = (nuevo) => {
    setMensajes((prev) => [...prev, nuevo]) // ✅ no depende de "mensajes"
  }
  conexion.on("mensaje", onMensaje)
  conexion.conectar()
  return () => {
    conexion.off("mensaje", onMensaje)
    conexion.desconectar()
  }
}, [roomId])
```

## Causa 4 — Necesitas el valor más reciente, pero sin "reaccionar" a sus cambios

A veces un efecto necesita leer algo actualizado (`isMuted`, por ejemplo) sin reiniciar la conexión por ese cambio. `useEffectEvent` está disponible desde React 19.2: permite esa lectura dentro de la lógica del efecto. No sirve para esconder dependencias que sí deben volver a sincronizarse.

```tsx
import { useEffect, useEffectEvent } from "react"

function Sala({ roomId, isMuted }: { roomId: string; isMuted: boolean }) {
  const onMensaje = useEffectEvent((mensaje: string) => {
    if (!isMuted) reproducirSonido(mensaje) // lee isMuted actual, sin ser dependencia
  })

  useEffect(() => {
    const conexion = crearConexion(roomId)
    conexion.on("mensaje", onMensaje)
    conexion.conectar()
    return () => conexion.desconectar()
  }, [roomId]) // isMuted no está aquí — cambiar el mute no reconecta el chat
}
```

## API de efectos en una mirada

| Problema de sincronización                             | Arreglo                                                          |
| ------------------------------------------------------ | ---------------------------------------------------------------- |
| Falta una dependencia reactiva                         | Agregarla — el linter la señala                                  |
| Objeto/función nuevo cada render como dependencia      | Moverlo adentro del efecto, o depender de sus valores primitivos |
| Leer un state para actualizar ese mismo state          | `setEstado(prev => ...)` en vez de leer la variable externa      |
| Necesitas el valor último sin reaccionar a sus cambios | `useEffectEvent` para esa lectura específica                     |

## Dependencias, limpieza y sincronización

- Nunca silencies el linter con `// eslint-disable-next-line react-hooks/exhaustive-deps` para "que pare de molestar" — cuando las dependencias declaradas no coinciden con lo que el efecto realmente usa, el riesgo real es un bug (un valor stale, o el loop que este doc describe), no una falsa alarma.
- Si un cálculo no sincroniza con nada externo —derivar un valor desde props/estado o formatearlo para mostrar— no necesita `useEffect`: calcúlalo durante el render. Un efecto que solo ejecuta `setAlgo(f(props))` suele ser innecesario y agrega un render adicional.
- El cleanup (`return () => {...}`) corre antes de cada re-ejecución del efecto, no solo al desmontar — es lo que evita, por ejemplo, acumular conexiones abiertas cuando `roomId` cambia varias veces seguidas.

## Requisitos y comprobación

Los bloques son fragmentos de componentes, no una aplicación de chat completa. `crearConexion` representa tu adaptador, con métodos `on`, `off`, `conectar` y `desconectar`; debe liberar listeners al cerrar. Para aprender sin servidor de chat, reproduce primero una suscripción a `window` con [useEventListener](/frontend/react/use-event-listener).

En desarrollo con Strict Mode, un ciclo adicional de conexión → limpieza → conexión permite detectar recursos sin liberar. Al cambiar de sala debe cerrarse la anterior. Cambiar `isMuted` debe modificar el sonido sin reconectar. Un valor derivado solo de props se calcula durante render y no necesita efecto.

## Fuentes

- [React: useEffect](https://react.dev/reference/react/useEffect)
- [React: useEffectEvent](https://react.dev/reference/react/useEffectEvent)
