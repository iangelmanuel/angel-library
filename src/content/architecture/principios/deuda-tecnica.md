---
title: Deuda técnica
description: Tomar un atajo hoy para ir más rápido implica pagar interés después. Cómo distinguir deuda deliberada de accidental, y cómo priorizar qué pagar primero.
type: practices
order: 10
practice: Tratar los atajos de diseño como una deuda financiera — tomarla a propósito, con un plan de repago, y priorizar pagar la que más duele.
why: No toda deuda técnica vale la pena pagar; priorizar mal desperdicia tiempo en código que nadie va a volver a tocar.
related:
  - architecture/principios/dry-kiss-yagni
updatedAt: 2026-08-17
---

La metáfora de "deuda técnica" viene de Ward Cunningham: tomar un atajo de diseño para entregar más rápido es como pedir un préstamo — se gana velocidad ahora, pero se paga "interés" después en forma de código más lento de entender y más caro de cambiar. Como cualquier deuda, tomarla no es el error; no gestionarla sí lo es.

## Deliberada vs. accidental

No toda deuda técnica es un error. Hay una diferencia importante entre dos tipos:

**Deliberada (consciente)**: el equipo decide a propósito tomar un atajo, sabiendo que lo es, con un plan de repago. Ejemplo: mockear una integración de pagos para lanzar una demo la semana que viene, con un ticket ya creado para reemplazarla por la integración real antes del lanzamiento.

```ts
// Deuda deliberada, documentada en el propio código
// TODO(deuda-tecnica): mock temporal para demo del 20/08.
// Reemplazar por integración real de Stripe antes de producción.
// Ticket: PROJ-482
function processPayment(amount: number): PaymentResult {
  return { success: true, transactionId: 'mock-txn-id' };
}
```

**Accidental (por desconocimiento o apuro)**: nadie decidió tomar el atajo a propósito — pasó porque el equipo no conocía una mejor forma de hacerlo, o porque la presión de tiempo hizo que nadie se diera cuenta de que se estaba acumulando. Este tipo es más peligroso porque no hay registro de que existe, hasta que alguien lo pisa.

```ts
// Deuda accidental: nadie decidió esto, simplemente "quedó así"
function getUserPermissions(userId: string) {
  // llamada síncrona bloqueante a un servicio externo, sin cache,
  // sin timeout, sin manejo de error — funcionó en dev y quedó en prod
  const response = httpSync.get(`https://auth.internal/permissions/${userId}`);
  return response.data.permissions;
}
```

La deuda deliberada tiene un plan; la accidental hay que primero *descubrirla* antes de poder priorizarla.

## Cómo priorizar qué pagar primero

No toda deuda merece ser pagada. Pagar deuda en código legacy que nadie toca hace años no tiene retorno — el "interés" de esa deuda nunca se cobra porque nadie vuelve a esa zona del código. La fórmula útil es:

```text
prioridad de pago ≈ frecuencia de cambio del código × costo de cambiarlo
```

| Código | Frecuencia de cambio | Costo de cambiarlo | Prioridad |
|---|---|---|---|
| Módulo de checkout, se toca cada sprint | Alta | Alto (spaghetti, sin tests) | Pagar ya |
| Script de migración de datos usado una vez | Nula | Alto | Ignorar |
| Config de build, se toca casi nunca | Baja | Bajo | Ignorar |
| Sistema de notificaciones, crece cada mes | Alta | Medio | Pagar pronto |

El error común es priorizar por "qué tan feo se ve el código" en vez de por cuánto duele tocarlo en la práctica. Un archivo horrible que nadie abre hace dos años no es una prioridad, por más que ofenda estéticamente.

## Señales de que hay que parar y pagar

- **Bugs repetidos en la misma área** — si el mismo módulo genera incidentes cada dos o tres semanas, la deuda ahí ya está cobrando más interés del que conviene tolerar.
- **"Nadie quiere tocar ese archivo"** — cuando el equipo evita activamente un módulo o lo rodea con parches en vez de entrar a arreglarlo, es una señal directa de que el costo de cambio ya es demasiado alto.
- **Cada feature nueva en esa zona tarda más que la anterior** — es la señal más objetiva: si el tiempo estimado para features similares va creciendo con el tiempo en el mismo módulo, la deuda está frenando la velocidad que originalmente se quiso ganar tomándola.
- **El onboarding de gente nueva al proyecto se traba siempre en el mismo lugar** — indica que esa parte del código no se explica a sí misma, lo cual es en sí mismo un costo recurrente.

## Consideraciones

- No toda deuda técnica es evitable ni indeseable: tomar un atajo consciente para validar una idea de negocio rápido puede ser la decisión correcta, incluso si el código resultante es feo.
- Documentar la deuda en el momento en que se toma (un comentario, un ticket, un ADR si la decisión es grande) es lo que la convierte de accidental en deliberada — y lo que hace posible priorizarla después en vez de descubrirla por accidente.
- Pagar deuda no siempre significa reescribir: a veces alcanza con agregar tests alrededor del código problemático para poder tocarlo con confianza, sin rehacerlo entero.
