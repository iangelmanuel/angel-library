---
title: Resiliencia ante servicios externos
description: Timeouts, cancelación, reintentos, backoff, circuit breakers y límites de concurrencia para depender de APIs sin arrastrar sus fallos.
type: guides
order: 4
tags: [backend, resilience, timeout, retries, availability]
scope: dependencias externas
related:
  - backend/backend-fundamentos/backend-api-design
  - backend/backend-fundamentos/backend-colas-jobs
  - devops/observabilidad/observability-fundamentals
updatedAt: 2026-08-25
---

Una API casi nunca trabaja sola: consulta una base de datos, un proveedor de pagos, almacenamiento, correo o un modelo de IA. Cada llamada agrega latencia y una nueva forma de fallar. La **resiliencia** consiste en limitar ese fallo, conservar capacidad para otras solicitudes y ofrecer una respuesta predecible.

## Consulta rápida

| Problema | Mecanismo | Idea principal |
| --- | --- | --- |
| la dependencia nunca responde | timeout + cancelación | dejar de esperar y liberar recursos |
| falla de forma transitoria | retry con backoff y jitter | reintentar pocas veces y cada vez más tarde |
| lleva varios minutos fallando | circuit breaker | dejar de enviarle trabajo temporalmente |
| demasiadas llamadas simultáneas | límite de concurrencia | proteger sockets, memoria y cuota |
| la función no es esencial | fallback | degradar una capacidad sin derribar todo |

## Toda llamada necesita un presupuesto de tiempo

Un **timeout** es el máximo que una operación puede consumir. Debe ser menor que el timeout total de la request; de lo contrario, el servidor puede seguir trabajando cuando el cliente ya dejó de esperar.

```ts
export async function fetchJson(url: string, timeoutMs = 3_000) {
  const response = await fetch(url, {
    signal: AbortSignal.timeout(timeoutMs),
    headers: { accept: 'application/json' },
  });

  if (!response.ok) {
    throw new Error(`Dependencia respondió ${response.status}`);
  }

  return response.json();
}
```

`AbortSignal.timeout()` comunica cancelación a `fetch`. Cancelar no garantiza que el proveedor revierta una operación que ya procesó; por eso una escritura remota también necesita idempotencia.

## Reintentar solo lo que puede recuperarse

Un retry es apropiado para pérdida temporal de red, `429 Too Many Requests` o algunos errores `5xx`. No arregla credenciales inválidas, permisos denegados ni un body incorrecto.

```ts
const RETRYABLE = new Set([429, 502, 503, 504]);

async function withRetry<T>(operation: () => Promise<T>, attempts = 3): Promise<T> {
  let lastError: unknown;

  for (let attempt = 0; attempt < attempts; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      if (attempt === attempts - 1) break;

      const backoff = 200 * 2 ** attempt;
      const jitter = Math.random() * 100;
      await new Promise((resolve) => setTimeout(resolve, backoff + jitter));
    }
  }

  throw lastError;
}
```

El **exponential backoff** aumenta la espera entre intentos. El **jitter** añade una variación aleatoria para evitar que muchas instancias vuelvan a golpear al proveedor al mismo tiempo. En una implementación real, la decisión de reintentar debe inspeccionar el error y respetar `Retry-After` cuando exista.

## Circuit breaker y límite de concurrencia

Un **circuit breaker** observa fallos. Al superar un umbral abre el circuito y rechaza rápido durante un periodo; después permite algunas solicitudes de prueba. Evita gastar todo el tiempo disponible en una dependencia que ya se sabe caída.

Un límite de concurrencia resuelve otro problema: aunque el proveedor funcione, diez mil solicitudes simultáneas pueden agotar conexiones o cuota. Limita por operación, proveedor y, cuando aplique, tenant. Una cola corta puede absorber picos; una cola ilimitada solo transforma saturación en memoria agotada.

## Diseñar la degradación

No todas las dependencias merecen la misma respuesta:

- si falla el pago, la compra no puede confirmarse;
- si falla el sistema de recomendaciones, puede mostrarse contenido popular;
- si falla el correo después de guardar una orden, la orden no debería desaparecer: registra un job reintentable;
- si falla una métrica, la respuesta al usuario no debería bloquearse.

El fallback debe ser explícito y observable. Ocultar todos los errores con datos viejos puede convertir una interrupción visible en información incorrecta.

## Caso de uso: endpoint con dependencia remota

```text
request recibe presupuesto de 5 s
  → validar entrada
  → consultar proveedor con timeout de 2 s
  → reintentar una vez si el error es transitorio
  → devolver dato, fallback permitido o error estable
  → registrar latencia, intento y resultado
```

Propaga un `requestId` para correlacionar logs, mide latencia p95/p99 y distingue errores propios de errores de proveedor. Nunca registres tokens, cookies o bodies sensibles para “tener más contexto”.

## Lista de comprobación

- ¿Cada llamada tiene timeout y cancelación?
- ¿Solo se reintentan operaciones seguras o idempotentes?
- ¿El número de intentos y el tiempo total están limitados?
- ¿Existe límite de concurrencia y tamaño de cola?
- ¿Está definido qué funciones pueden degradarse?
- ¿Métricas y logs indican qué dependencia falló?

