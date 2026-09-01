---
title: Health checks, timeouts y apagado elegante
description: Evitar tráfico hacia instancias rotas y terminar requests, jobs y conexiones sin corrupción durante deploys.
type: guides
order: 2
tags: [health-checks, graceful-shutdown, reliability, backend]
scope: ciclo de vida de servicios
related:
  - devops/observabilidad/observability-fundamentals
  - security/security-infra/security-ddos-resilience
updatedAt: 2026-08-25
---

## Tres comprobaciones distintas

- **Startup:** la aplicación terminó de inicializar.
- **Liveness:** el proceso puede seguir ejecutándose; si falla, reiniciar.
- **Readiness:** puede recibir tráfico ahora; si falla, retirar del balanceador.

No hagas que liveness dependa de cada proveedor externo: una caída ajena reiniciaría todas las instancias y agravaría el incidente. Readiness sí puede considerar dependencias imprescindibles, con timeout corto.

```text
/live  → ¿el proceso responde y el loop progresa?
/ready → ¿puede aceptar trabajo sin fallar inmediatamente?
/start → ¿terminó la inicialización necesaria?
```

Las rutas deben ser baratas y no exponer versiones, secretos o estado interno detallado. La plataforma necesita una señal útil; el equipo puede consultar diagnósticos protegidos por otra vía.

## Apagado elegante

Al recibir `SIGTERM`:

1. marcar readiness como falsa;
2. dejar de aceptar tráfico nuevo;
3. terminar requests y jobs en curso hasta un límite;
4. cerrar pool de base, consumers y conexiones;
5. salir con código claro antes del kill forzado.

Los workers deben reconocer cancelación y los jobs ser idempotentes, porque una máquina puede morir sin ejecutar cleanup.

```ts
process.once('SIGTERM', async () => {
  ready = false;
  server.close();

  await Promise.race([
    closeDependencies(),
    new Promise((_, reject) => setTimeout(() => reject(new Error('shutdown timeout')), 20_000)),
  ]);
});
```

Evita llamar `process.exit()` antes de drenar logs y conexiones. Aun con cleanup correcto, diseña para un kill forzado.

## Timeouts coordinados

El timeout exterior debe superar al interior con margen. Si el proxy espera 30 s pero la DB puede ocupar 60 s, trabajo inútil continuará después de que el cliente se fue. Define timeout, cancelación, reintento limitado con jitter y presupuesto total por request.

## Prueba de despliegue

Envía tráfico, inicia un shutdown y verifica que la instancia salga del balanceador antes de cerrar. Confirma que no se pierdan jobs, que el despliegue tenga un límite y que una dependencia caída no provoque un ciclo infinito de reinicios.

