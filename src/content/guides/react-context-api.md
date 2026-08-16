---
title: Context API con un hook propio
description: Compartir estado entre componentes sin prop drilling — createContext, Provider y un hook custom que valida el uso correcto.
category: frontend
stack: react
order: 2
tags: [react, state, hooks]
scope: react (createContext / useContext)
updatedAt: 2026-08-16
---

Pasar una prop a través de cinco componentes que no la usan, solo para que llegue al sexto, es "prop drilling". Context evita eso: un valor disponible para cualquier descendiente del Provider, sin pasarlo manualmente por cada nivel. No reemplaza a Zustand/Redux para estado global complejo — es ideal para lo que es genuinamente "de todo el árbol" (tema, usuario autenticado, idioma).

## Crear el contexto y el Provider

`createContext` necesita un valor por defecto (se usa solo si un componente lo lee sin estar envuelto en el Provider — por eso conviene que sea `null` y no un objeto falso, para poder detectar el error).

```tsx title="context/AuthContext.tsx"
import { createContext, useState, type ReactNode } from 'react';

interface AuthContextValue {
  usuario: string | null;
  login: (nombre: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<string | null>(null);

  const login = (nombre: string) => setUsuario(nombre);
  const logout = () => setUsuario(null);

  return (
    <AuthContext.Provider value={{ usuario, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
```

## El hook propio: `useAuth()`

Consumir `AuthContext` directo con `useContext(AuthContext)` en cada componente obliga a chequear `null` en todos lados y repite el import. Un hook custom centraliza esa validación una sola vez, y falla con un mensaje claro si alguien lo usa fuera del Provider — en vez de un `undefined` silencioso más adelante.

```tsx title="context/AuthContext.tsx"
import { useContext } from 'react';

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth() debe usarse dentro de <AuthProvider>');
  }
  return context;
}
```

## Envolver la app y usarlo

```tsx title="App.tsx"
<AuthProvider>
  <Header />
  <Main />
</AuthProvider>
```

```tsx title="Header.tsx"
import { useAuth } from '../context/AuthContext';

export function Header() {
  const { usuario, logout } = useAuth();
  return usuario ? <button onClick={logout}>Salir ({usuario})</button> : <LoginButton />;
}
```

## Resumen

| Pieza | Qué hace |
| --- | --- |
| `createContext<T \| null>(null)` | Crea el contexto, tipado, con `null` como default para poder detectar mal uso |
| `<Context.Provider value={...}>` | Hace disponible ese valor para todos sus descendientes |
| `useContext(Context)` | Lee el valor — el hook custom lo envuelve y valida |
| Hook custom (`useAuth`, etc.) | Un solo punto de import, con error claro si falta el Provider |

## Consideraciones

- Todo componente que lee el contexto se re-renderiza cuando `value` cambia — si el Provider agrupa cosas que cambian con frecuencias muy distintas (ej. tema + datos de usuario que se actualizan cada segundo), separalos en dos contextos.
- `value={{ usuario, login, logout }}` crea un objeto nuevo en cada render del Provider — si eso causa re-renders innecesarios en consumidores costosos, envolvé el objeto en `useMemo`.
- Context no es un reemplazo de Zustand/Redux para estado que cambia mucho y en muchos lugares — para eso, ver [Zustand](/libraries/zustand): evita el re-render de todo el árbol que Context fuerza.
