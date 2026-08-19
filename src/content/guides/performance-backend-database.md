---
title: Rendimiento de backend y base de datos
description: Separar latencia de red, colas, cómputo y consultas para optimizar el camino crítico sin esconder cuellos de botella.
category: performance
stack: performance-operacion
order: 2
tags: [performance, backend, database, latency, profiling]
related:
  - guides/database-indices-explain
  - guides/observability-fundamentals
  - guides/backend-colas-jobs
updatedAt: 2026-08-19
---

El tiempo del servidor es una suma de esperas y trabajo. Medir solo la duración total no muestra dónde optimizar.

```text
DNS/TLS → edge → cola → aplicación → base de datos / API externa
                            └→ serialización → respuesta
```

## Presupuesto de latencia

Para un endpoint objetivo de 300 ms, asigna presupuestos aproximados y registra spans:

| Paso | Presupuesto ejemplo |
| --- | ---: |
| Autenticación y routing | 20 ms |
| Consulta principal | 100 ms |
| Dependencia externa | 100 ms |
| Serialización y margen | 80 ms |

Los percentiles importan más que el promedio. `p95` significa que 95 % de observaciones son iguales o menores; el 5 % restante puede concentrar la experiencia problemática.

## Base de datos

- Evita N+1: una consulta inicial dispara otra por cada fila.
- Selecciona columnas necesarias y pagina resultados.
- Usa índices guiados por planes reales.
- Limita conexiones y tiempos de espera.
- Mantén transacciones cortas.

```ts
// N+1
for (const order of orders) {
  order.user = await users.findById(order.userId);
}

// Preferible: batch o join según el caso.
const usersById = await users.findManyById(uniqueUserIds);
```

## Dependencias externas

Define timeout menor que el límite de la solicitud, cancelación, reintentos solo para operaciones seguras y circuit breaker cuando una caída sostenida consume todos los recursos. Ejecuta en paralelo llamadas independientes, pero no crees concurrencia ilimitada.

## Sacar trabajo del camino crítico

Correo, analítica, miniaturas y tareas que no cambian la respuesta pueden ir a una cola. Esto mejora latencia, pero agrega consistencia eventual y operación: el usuario necesita ver estado y fallos.

## Optimizar con perfil

Primero usa trazas, métricas y `EXPLAIN`; después cambia código. Una caché puede reducir carga, pero también ocultar consultas malas y agregar invalidación. Documenta la hipótesis, línea base y resultado.

