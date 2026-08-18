---
title: useEffect — y cómo evitar loops infinitos
description: Sincronizar con algo externo al render, el array de dependencias explicado bien, y las 4 causas reales de un loop infinito.
category: frontend
stack: react
order: 5
tags: [react, hooks, effects]
scope: react (useEffect)
updatedAt: 2026-08-16
---

`useEffect` no es "código que corre después del render" en general — es específicamente para **sincronizar el componente con algo que vive fuera de React**: una conexión, una suscripción, el `document.title`, un timer. Si el efecto no sincroniza con nada externo, probablemente no debería ser un efecto (ver Consideraciones). Esa distinción es la que evita la mayoría de los usos incorrectos, loops incluidos.

## La forma básica

```tsx
useEffect(() => {
  // código que corre después de pintar el DOM
  return () => {
    // cleanup: corre antes del próximo efecto, y al desmontar
  };
}, [dependencias]);
```

El array de dependencias no es una opción de "cuándo correr" que tú eliges libremente — tiene que listar **todos** los valores reactivos (props, state, y cualquier cosa derivada de ellos) que el efecto lee. React los compara con los del render anterior; si alguno cambió, vuelve a correr el efecto.

## Causa 1 — Falta una dependencia real

```tsx
function ChatRoom({ roomId }: { roomId: string }) {
  useEffect(() => {
    const conexion = crearConexion(roomId);
    conexion.conectar();
    return () => conexion.desconectar();
  }, []); // 🔴 roomId se usa adentro pero no está declarado
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
  const opciones = { roomId, servidor: 'wss://ejemplo.com' }; // 🔴 objeto nuevo cada render

  useEffect(() => {
    const conexion = crearConexion(opciones);
    conexion.conectar();
    return () => conexion.desconectar();
  }, [opciones]); // se re-ejecuta en cada render, sin parar
}
```

Arreglo: mové el objeto **adentro** del efecto (así ni siquiera es una dependencia externa) y dependé solo de los valores primitivos que realmente cambian.

```tsx
  useEffect(() => {
    const opciones = { roomId, servidor: 'wss://ejemplo.com' };
    const conexion = crearConexion(opciones);
    conexion.conectar();
    return () => conexion.desconectar();
  }, [roomId]); // ✅ depende de un primitivo, no de un objeto
```

## Causa 3 — Leer un state para actualizar ese mismo state

```tsx
useEffect(() => {
  conexion.on('mensaje', (nuevo) => {
    setMensajes([...mensajes, nuevo]); // 🔴 lee "mensajes"
  });
}, [roomId, mensajes]); // mensajes cambia → el efecto se re-ejecuta → reconecta → ...
```

Arreglo: usar la forma funcional de `setState`, que recibe el valor más reciente sin necesitar leerlo afuera — así `mensajes` deja de ser una dependencia.

```tsx
useEffect(() => {
  conexion.on('mensaje', (nuevo) => {
    setMensajes((prev) => [...prev, nuevo]); // ✅ no depende de "mensajes"
  });
}, [roomId]);
```

## Causa 4 — Necesitas el valor más reciente, pero sin "reaccionar" a sus cambios

A veces un efecto necesita leer algo actualizado (`isMuted`, por ejemplo) sin que ese algo dispare una re-ejecución completa del efecto cuando cambia solo. Para eso existen los Effect Events (`useEffectEvent`, React 19+): una función que siempre ve el valor más reciente, pero no cuenta como dependencia reactiva.

```tsx
import { useEffectEvent } from 'react';

function Sala({ roomId, isMuted }: { roomId: string; isMuted: boolean }) {
  const onMensaje = useEffectEvent((mensaje: string) => {
    if (!isMuted) reproducirSonido(mensaje); // lee isMuted actual, sin ser dependencia
  });

  useEffect(() => {
    const conexion = crearConexion(roomId);
    conexion.on('mensaje', onMensaje);
    return () => conexion.desconectar();
  }, [roomId]); // isMuted no está aquí — cambiar el mute no reconecta el chat
}
```

## Resumen

| Causa del loop | Arreglo |
| --- | --- |
| Falta una dependencia reactiva | Agregarla — el linter la señala |
| Objeto/función nuevo cada render como dependencia | Moverlo adentro del efecto, o depender de sus valores primitivos |
| Leer un state para actualizar ese mismo state | `setEstado(prev => ...)` en vez de leer la variable externa |
| Necesitas el valor último sin reaccionar a sus cambios | `useEffectEvent` para esa lectura específica |

## Consideraciones

- Nunca silencies el linter con `// eslint-disable-next-line react-hooks/exhaustive-deps` para "que pare de molestar" — cuando las dependencias declaradas no coinciden con lo que el efecto realmente usa, el riesgo real es un bug (un valor stale, o el loop que este doc describe), no una falsa alarma.
- Si un cálculo no sincroniza con nada externo (derivar un valor a partir de props/state, formatear algo para mostrar), no necesita `useEffect` — calculalo directo durante el render. Un efecto que solo hace `setAlgo(f(props))` suele ser innecesario y agrega un render extra.
- El cleanup (`return () => {...}`) corre antes de cada re-ejecución del efecto, no solo al desmontar — es lo que evita, por ejemplo, acumular conexiones abiertas cuando `roomId` cambia varias veces seguidas.
