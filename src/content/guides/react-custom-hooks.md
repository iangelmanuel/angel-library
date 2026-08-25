---
title: Hooks personalizados y reutilización de lógica
description: Extraer sincronización y estado con una API clara, sin confundir reutilizar lógica con compartir la misma instancia de estado.
category: frontend
stack: react
order: 11
tags: [react, hooks, custom-hooks, composition]
scope: diseño de hooks
website: https://react.dev/learn/reusing-logic-with-custom-hooks
related:
  - guides/react-hooks-reference
  - guides/react-useeffect
  - hooks/use-event-listener
updatedAt: 2026-08-25
---

## En 30 segundos

Un Hook personalizado es una función cuyo nombre empieza con `use` y que compone Hooks de React. Comparte una forma de comportarse, no una única instancia de estado. Cada componente que llama el Hook obtiene su propia ejecución, salvo que ambos se conecten deliberadamente a una fuente externa compartida.

## Cuándo extraerlo

Extrae un Hook cuando una intención basada en React se repite o cuando darle un nombre vuelve comprensible una sincronización compleja. No lo extraigas únicamente porque un componente superó cierta cantidad de líneas.

Buenos nombres describen el resultado o la relación:

- `useOnlineStatus()`;
- `useDocumentTitle(title)`;
- `useChatRoom({ roomId, serverUrl })`;
- `useDebouncedValue(value, delay)`.

`useEffectWrapper()` o `useCommonLogic()` no explican un contrato.

## Ejemplo: suscribirse al estado de conexión

`navigator.onLine` vive fuera de React. `useSyncExternalStore` expresa cómo suscribirse y cómo leer un snapshot coherente:

```tsx title="hooks/useOnlineStatus.ts"
import { useSyncExternalStore } from 'react';

function subscribe(callback: () => void) {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);

  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}

function getSnapshot() {
  return navigator.onLine;
}

function getServerSnapshot() {
  return true;
}

export function useOnlineStatus() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
```

```tsx
function SaveButton() {
  const isOnline = useOnlineStatus();

  return (
    <button disabled={!isOnline}>
      {isOnline ? 'Guardar' : 'Sin conexión'}
    </button>
  );
}
```

El componente consume una intención de producto. Los detalles de eventos, cleanup y snapshot permanecen encapsulados.

## Reutilizar lógica no comparte estado

```tsx
function HeaderStatus() {
  const online = useOnlineStatus();
  return <span>{online ? 'En línea' : 'Sin conexión'}</span>;
}

function SaveButton() {
  const online = useOnlineStatus();
  return <button disabled={!online}>Guardar</button>;
}
```

Ambas llamadas se suscriben a la misma fuente externa, pero no porque el Hook mantenga un estado global oculto. Si un Hook usa `useState`, cada llamada obtiene una instancia independiente.

## Diseñar la entrada y la salida

```tsx
type UseChatRoomOptions = {
  roomId: string;
  serverUrl?: string;
  onMessage(message: Message): void;
};

function useChatRoom({
  roomId,
  serverUrl = 'wss://chat.example.com',
  onMessage,
}: UseChatRoomOptions) {
  const onMessageEvent = useEffectEvent(onMessage);

  useEffect(() => {
    const connection = connect({ roomId, serverUrl });
    connection.on('message', onMessageEvent);
    connection.open();

    return () => connection.close();
  }, [roomId, serverUrl]);
}
```

Un objeto de opciones es útil cuando hay varias entradas con significado. Devuelve solo lo que el consumidor necesita. Evita exponer setters internos si acciones con nombre como `open`, `close` o `retry` expresan mejor el dominio.

## Hooks puros y Hooks con efectos

Un Hook no necesita usar `useEffect`. Puede componer estado, reducer, contexto, refs o memoización. Si solo transforma argumentos de forma pura y no usa ningún Hook, probablemente sea una función normal.

```ts
function formatPrice(cents: number) {
  return currency.format(cents / 100);
}
```

No la nombres `useFormatPrice`: el prefijo comunicaría restricciones inexistentes.

## Dependencias y callbacks

No escondas dependencias para ofrecer una API aparentemente sencilla. Si el callback cambia y debe reconfigurar la suscripción, inclúyelo. Si solo necesitas leer su versión reciente desde un efecto sin reconectar, `useEffectEvent` puede expresar esa separación.

No uses refs automáticamente para silenciar el linter: convertir una dependencia reactiva en lectura mutable puede ocultar que la sincronización debería reiniciarse.

## Pruebas

Prueba primero un componente consumidor. Esa prueba observa el contrato real y permite a React ejecutar el Hook en condiciones normales.

Casos importantes:

- valor inicial;
- cambio de argumentos;
- cleanup al desmontar;
- error o ausencia de API del navegador;
- Strict Mode en desarrollo;
- snapshot de servidor cuando existe SSR.

## Checklist de diseño

- ¿el nombre describe una intención?
- ¿comparte lógica basada en React y no solo una función pura?
- ¿cada efecto tiene cleanup simétrico?
- ¿las entradas necesarias son explícitas?
- ¿la salida evita exponer detalles internos?
- ¿funciona al montarse, actualizarse y desmontarse varias veces?
- ¿su nombre evita prometer estado compartido cuando cada llamada es independiente?

