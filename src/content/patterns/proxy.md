---
title: Proxy
description: Interceptar el acceso a un objeto (para loguear, cachear o validar) sin que quien lo usa note la diferencia.
category: architecture
stack: patrones-diseno
order: 7
tags: [arquitectura, patrones-diseno, proxy]
related: [patterns/decorator]
problem: Necesitas loguear qué propiedades se leen de un objeto, o cachear el resultado directamente función costosa, sin cambiar cómo se la llama.
updatedAt: 2026-08-17
---

## Problema

A veces el comportamiento extra que necesitas no es "antes o después de llamar a una función" (eso es Decorator) sino "cada vez que se lee o escribe una propiedad de un objeto". JavaScript tiene soporte nativo para esto: `Proxy`.

## Ejemplo: loguear lecturas de configuración

```ts title="lib/config-proxy.ts"
const configReal = {
  apiUrl: 'https://api.miapp.com',
  featureFlagX: true,
  secretoInterno: '...',
};

export const config = new Proxy(configReal, {
  get(target, prop: string) {
    console.log(`[config] se leyó la clave "${prop}"`);
    return target[prop as keyof typeof target];
  },
});

config.apiUrl; // dispara el log, devuelve el valor real
```

Útil para detectar qué claves de configuración se usan de verdad antes de eliminar las que no.

## Ejemplo: proxy de cache sobre una función

```ts title="lib/memoize-proxy.ts"
function memoize<T extends (...args: any[]) => any>(fn: T): T {
  const cache = new Map<string, ReturnType<T>>();
  return new Proxy(fn, {
    apply(target, thisArg, args) {
      const key = JSON.stringify(args);
      if (cache.has(key)) return cache.get(key);
      const resultado = Reflect.apply(target, thisArg, args);
      cache.set(key, resultado);
      return resultado;
    },
  }) as T;
}

const buscarUsuarioCacheado = memoize(buscarUsuarioEnDB);
```

`buscarUsuarioCacheado(id)` se llama exactamente igual que la función original — el proxy intercepta la llamada y decide si ejecuta la función real o devuelve el valor cacheado.

## Cuándo NO usarlo

`Proxy` tiene un costo de rendimiento en rutas críticas —cada acceso pasa por la trampa— y hace la depuración menos directa: el objeto observado no es el original, sino el intermediario. Para casos simples, como envolver una función conocida para aplicar caché o registros, una función envolvente explícita (`function withCache(fn) { ... }`, sin `Proxy`) suele ser más legible. Reserva `Proxy` para interceptar acceso a propiedades dinámicas que no se conocen de antemano.
