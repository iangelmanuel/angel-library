---
title: Decorator
description: Agregar comportamiento a algo envolviéndolo, sin tocar su código original ni crear una subclase por cada combinación.
type: patterns
order: 6
tags: [arquitectura, patrones-diseno, decorator]
related: [architecture/patrones-diseno/proxy]
problem: Agregar autenticación, logging o cualquier otro comportamiento transversal a un componente o handler sin duplicar ese código en cada uno.
updatedAt: 2026-08-17
---

## Problema

Cuando varios componentes o handlers necesitan el mismo comportamiento extra (requerir sesión, loguear cada llamada), copiarlo dentro de cada uno se vuelve inmantenible. Decorator envuelve lo original en una capa que agrega ese comportamiento, sin modificar el original y sin crear una variante por cada combinación posible.

## Ejemplo: Higher-Order Component en React

Un HOC es el patrón Decorator aplicado a componentes: recibe un componente, devuelve otro que lo envuelve y le agrega comportamiento.

```tsx title="components/with-auth.tsx"
import type { ComponentType } from 'react';
import { useSession } from '@/libs/auth';

export function withAuth<P extends object>(Component: ComponentType<P>) {
  return function AuthenticatedComponent(props: P) {
    const { user, loading } = useSession();
    if (loading) return <Spinner />;
    if (!user) return <RedirectToLogin />;
    return <Component {...props} />;
  };
}
```

Los decorators se pueden componer: cada capa agrega su comportamiento sin que las demás lo sepan.

```tsx
export default withAuth(withLogging(Dashboard));
```

## Ejemplo: middleware de Express

Un middleware también es un decorator: envuelve el handler real y le agrega comportamiento antes (o después) de que se ejecute.

```ts
app.use(loggerMiddleware); // decora cada request con logging antes del handler real
app.get('/pedidos', requireAuth, obtenerPedidos); // requireAuth decora el acceso al handler
```

## Cuándo NO usarlo

- No envuelvas un componente en varios HOCs anidados si un hook simple (`useAuth()` llamado adentro del propio componente) resuelve lo mismo sin agregar niveles al árbol de componentes ni ensuciar el nombre en devtools. Desde que existen los hooks, esa es casi siempre la opción más simple en React.
- Si el comportamiento extra es específico de un solo lugar y no se va a reutilizar, agregarlo directo ahí es más claro que crear una capa de envoltura genérica.
