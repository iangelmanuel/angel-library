---
title: Debugging sistemático — de síntoma a causa
description: Reproducir, reducir, observar y verificar problemas con logs, debugger, Network, Performance y control de variables.
category: tools
stack: tools-debugging
order: 2
tags: [debugging, devtools, logs, diagnosis, workflow]
related:
  - guides/tools-chrome-devtools
  - guides/observability-fundamentals
  - guides/git-bisect
updatedAt: 2026-08-25
---

Depurar no es cambiar líneas hasta que el síntoma desaparece. Es reducir incertidumbre mediante una reproducción, observaciones y experimentos que distinguen hipótesis.

## Ciclo de diagnóstico

```text
síntoma concreto
  → reproducción mínima
  → capa donde diverge
  → hipótesis falsable
  → una observación o cambio
  → causa demostrada
  → fix + prueba de regresión
```

## Escribir la reproducción

Registra entrada, entorno, resultado esperado, resultado real y frecuencia. “No funciona” no permite comparar.

```text
Dado: usuario sin sesión, Chrome, preview v42
Cuando: abre /checkout y confirma
Esperado: redirect a /login?next=/checkout
Real: pantalla vacía, status 500
```

## Encontrar la capa

| Evidencia | Herramienta |
| --- | --- |
| status, headers, payload y timing | Network |
| excepción y call stack | Console/debugger |
| DOM, estilos y accesibilidad | Elements |
| long task o render repetido | Performance/Profiler |
| request atraviesa servicios | logs y trace id |
| empezó en un commit | `git bisect` |

Inspecciona primero, modifica después. Limpiar caché o reinstalar dependencias puede cambiar el estado sin explicar la causa.

## Hipótesis falsable

“La API está mal” es demasiado amplio. “El proxy elimina el header `Authorization`; la request en Network no lo contiene” indica qué evidencia puede confirmarlo o negarlo.

Usa breakpoints condicionales y logpoints para observar sin agregar `console.log` permanente. En async, sigue la request id entre frontend y backend.

## Reducir

Elimina rutas, datos y dependencias hasta conservar el fallo mínimo. Compara un caso que funciona con uno que falla y cambia una variable: usuario, payload, navegador, versión o entorno.

## Cerrar correctamente

Un fix no termina cuando la demo funciona. Añade prueba de regresión en la capa más barata que reproduzca la causa, elimina instrumentación temporal y documenta si el problema revela una regla reusable.

## Para recordar

Reproduce → observa → localiza → formula → prueba → corrige → evita regresión. Si no puedes explicar qué evidencia descartó las otras hipótesis, todavía no conoces la causa.

