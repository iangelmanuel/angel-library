---
title: Mapa de Hooks y APIs nativas de React
description: Referencia por intención de los Hooks actuales, sus firmas, el valor que devuelven y el problema que realmente resuelven.
type: guides
order: 10
tags: [react, hooks, reference, api]
scope: referencia de React
website: https://react.dev/reference/react/hooks
related:
  - frontend/react/react
  - frontend/react/react-usestate
  - frontend/react/react-useeffect
  - frontend/react/react-custom-hooks
updatedAt: 2026-08-25
---

## Cómo usar este mapa

Si estás aprendiendo, no estudies esta página de principio a fin. Domina primero componentes, props, estado, eventos, refs y efectos. Si vienes a recordar, busca la intención y salta al documento detallado.

## Reglas de Hooks

1. Llama Hooks en el nivel superior de un componente o de otro Hook.
2. No los llames dentro de condiciones, ciclos, handlers o funciones normales.
3. Los componentes deben empezar con mayúscula y los Hooks personalizados con `use`.
4. Conserva las dependencias completas; el linter describe valores reactivos utilizados.

La API `use(resource)` es una excepción deliberada: puede utilizarse en condiciones y ciclos, pero sigue necesitando ejecutarse dentro de un componente o Hook y no puede envolverse en `try/catch`.

## Estado y acciones

| API              | Firma abreviada                   | Devuelve                   | Úsala para                             |
| ---------------- | --------------------------------- | -------------------------- | -------------------------------------- |
| `useState`       | `useState(initial)`               | `[state, setState]`        | estado local independiente             |
| `useReducer`     | `useReducer(reducer, initial)`    | `[state, dispatch]`        | transiciones complejas y centralizadas |
| `useActionState` | `useActionState(action, initial)` | `[state, action, pending]` | resultado y estado de una Action       |
| `useOptimistic`  | `useOptimistic(value, update?)`   | `[optimistic, add]`        | respuesta visual antes de confirmación |

```tsx
const [open, setOpen] = useState(false)
const [cart, dispatch] = useReducer(cartReducer, initialCart)
const [result, submit, pending] = useActionState(saveProfile, initialResult)
```

`useState` y `useReducer` son alternativas para modelar estado. `useActionState` y `useOptimistic` coordinan trabajo asíncrono iniciado por una acción; no sustituyen toda la lógica local.

## Contexto y recursos

| API                   | Devuelve                       | Uso                                    |
| --------------------- | ------------------------------ | -------------------------------------- |
| `useContext(Context)` | valor del provider más cercano | tema, sesión o dependencia transversal |
| `use(resource)`       | valor de Promise o Context     | recursos compatibles con Suspense      |

```tsx
const theme = useContext(ThemeContext)
const comments = use(commentsPromise)
```

Context distribuye un valor; no proporciona por sí solo reducers, persistencia ni selección granular. `use(Promise)` necesita una estrategia compatible con Suspense, normalmente proporcionada por un framework.

## Refs y DOM

| API                                            | Devuelve                     | Uso                                 |
| ---------------------------------------------- | ---------------------------- | ----------------------------------- |
| `useRef(initial)`                              | objeto estable `{ current }` | nodo DOM o valor mutable no visual  |
| `useImperativeHandle(ref, createHandle, deps)` | `undefined`                  | exponer una API imperativa limitada |

```tsx
useImperativeHandle(
  ref,
  () => ({
    focus() {
      inputRef.current?.focus()
    }
  }),
  []
)
```

En React moderno, una referencia puede recibirse como prop en componentes compatibles. Expón la menor superficie posible; una prop declarativa suele ser más fácil de mantener que una API imperativa.

## Efectos y sincronización

| API                  | Momento                                            | Uso                                           |
| -------------------- | -------------------------------------------------- | --------------------------------------------- |
| `useEffect`          | después del commit y normalmente después de pintar | red, suscripciones, widgets y APIs externas   |
| `useLayoutEffect`    | después del DOM, antes de pintar                   | medir layout y corregir posición sin parpadeo |
| `useInsertionEffect` | antes de efectos de layout                         | motores CSS-in-JS; principalmente librerías   |
| `useEffectEvent`     | evento no reactivo invocable desde un efecto       | leer valores recientes sin reconectar         |

No cambies `useEffect` por `useLayoutEffect` para ocultar un problema visual: la segunda bloquea el pintado. `useInsertionEffect` rara vez pertenece al código normal de una aplicación.

## Rendimiento y prioridad

| API                        | Devuelve                     | Uso                                                       |
| -------------------------- | ---------------------------- | --------------------------------------------------------- |
| `useMemo(calculate, deps)` | resultado memorizado         | cálculo costoso medido o identidad necesaria              |
| `useCallback(fn, deps)`    | función memorizada           | prop hacia un hijo optimizado o dependencia estable       |
| `useTransition()`          | `[pending, startTransition]` | actualización no urgente controlada por el componente     |
| `useDeferredValue(value)`  | valor diferido               | mantener urgente la entrada y postergar una vista costosa |

Memoizar no arregla lógica impura y también cuesta comparaciones y memoria. React Compiler puede automatizar gran parte de esta optimización cuando está configurado; primero mide el problema.

## Integración con sistemas externos

| API                                                                | Uso principal                                                   |
| ------------------------------------------------------------------ | --------------------------------------------------------------- |
| `useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot?)` | stores y APIs externas compatibles con render concurrente y SSR |
| `useId()`                                                          | IDs estables para relaciones accesibles                         |
| `useDebugValue(value, format?)`                                    | etiqueta de un Hook propio en React DevTools                    |

```tsx
const id = useId();

return (
  <>
    <label htmlFor={`${id}-email`}>Correo</label>
    <input id={`${id}-email`} name="email" />
  </>
);
```

`useId` no genera keys de listas. Una key debe proceder de la identidad de los datos.

## Componentes y APIs relacionadas

| API                            | Problema                                          |
| ------------------------------ | ------------------------------------------------- |
| `<Suspense fallback>`          | límite de espera para código o recurso compatible |
| `lazy(load)`                   | carga diferida de un componente                   |
| `memo(Component)`              | omitir render cuando props son iguales            |
| `startTransition(action)`      | transición fuera de un Hook o sin indicador local |
| `createContext(defaultValue)`  | crear un canal de contexto                        |
| `createPortal(children, node)` | renderizar físicamente en otro nodo DOM           |

## Árbol de decisión

```text
¿el valor cambia y debe pintar?
  sí → useState o useReducer
  no → useRef

¿proviene de un ancestro lejano?
  sí → props, composición o useContext

¿sincroniza un sistema externo?
  sí → useEffect con cleanup
  no → calcular durante render o manejar en evento

¿la actualización visual es costosa?
  sí → medir → transition/deferred/memo/virtualización
```

## Errores de consulta frecuentes

- Buscar “qué Hook corre una vez”: los efectos describen sincronización, no ciclos de vida manuales.
- Usar `useMemo` para garantizar semántica; es una optimización, no almacenamiento contractual.
- Crear un Hook propio que solo envuelve una línea sin añadir una intención reutilizable.
- Ignorar el linter de dependencias en vez de reestructurar el efecto.
- tratar `useSyncExternalStore` como una store completa: solo define cómo suscribirse de forma segura.
