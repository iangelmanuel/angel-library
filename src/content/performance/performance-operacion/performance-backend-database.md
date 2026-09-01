---
title: Rendimiento de backend y base de datos
description: Separar latencia de red, colas, cómputo y consultas para optimizar el camino crítico sin esconder cuellos de botella.
type: guides
order: 2
tags: [performance, backend, database, latency, profiling]
related:
  - database/database-sql/database-indices-explain
  - devops/observabilidad/observability-fundamentals
  - backend/backend-fundamentos/backend-colas-jobs
updatedAt: 2026-08-25
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

## Throughput, utilización y cola

**Throughput** es trabajo completado por unidad de tiempo. Cuando CPU, conexiones o workers se saturan, las requests esperan en cola y la latencia aumenta aunque cada operación interna no haya cambiado. Mide tiempo de cola separado del tiempo de servicio.

Una prueba de carga debe aumentar tráfico gradualmente, conservar tasa de error y observar el punto donde el sistema deja de recuperarse. No ejecutes carga no autorizada contra producción.

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

## Serialización y payload

Seleccionar miles de filas para desechar campos después consume base, memoria, CPU y red. Limita columnas, resultados y profundidad. Para respuestas grandes considera paginación o streaming; comprimir JSON reduce bytes pero consume CPU.

## Optimizar con perfil

Primero usa trazas, métricas y `EXPLAIN`; después cambia código. Una caché puede reducir carga, pero también ocultar consultas malas y agregar invalidación. Documenta la hipótesis, línea base y resultado.

```text
hipótesis: N+1 domina p95
evidencia: 101 queries por request
cambio: batch de usuarios
resultado: 2 queries, p95 420 → 170 ms
control: test que limita consultas del caso
```

