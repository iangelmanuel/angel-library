---
title: 'DRY, KISS y YAGNI'
description: Tres principios que se malinterpretan seguido — evitar duplicar conocimiento (no código parecido), preferir lo simple, y no construir para un futuro hipotético.
type: practices
order: 8
practice: No repetir conocimiento de negocio, elegir la solución más simple que funciona, y no construir flexibilidad que nadie pidió.
why: Aplicados de forma dogmática, estos tres principios crean más acoplamiento y complejidad de la que evitan.
related:
  - architecture/principios/cohesion-acoplamiento
  - architecture/principios/deuda-tecnica
updatedAt: 2026-08-17
---

DRY, KISS y YAGNI se citan todo el tiempo como si fueran reglas absolutas. Los tres son útiles, pero los tres se rompen igual de fácil cuando se aplican sin pensar en el contexto. Van juntos en esta entrada porque el error común es el mismo: optimizar por una métrica superficial (líneas de código, "no repetir nada", "no construir de más") en vez de pensar en el problema real.

## DRY — Don't Repeat Yourself

La formulación original (Hunt & Thomas, *The Pragmatic Programmer*) es sobre **conocimiento**, no sobre líneas de código parecidas: "cada pieza de conocimiento debe tener una representación única, inequívoca y autoritativa dentro de un sistema". Dos funciones que se ven parecidas pero representan reglas de negocio *distintas* no son duplicación — son coincidencia.

```ts
// Dos funciones que "se parecen"
function formatPrice(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

function formatInvoiceTotal(amount: number): string {
  return `$${amount.toFixed(2)}`;
}
```

Se ve tentador unificarlas:

```ts
// "DRY" forzado: una sola función con flags para las diferencias
function formatCurrency(amount: number, opts?: { forInvoice?: boolean; noDecimals?: boolean }): string {
  if (opts?.noDecimals) return `$${Math.round(amount)}`;
  if (opts?.forInvoice) return `$${amount.toFixed(2)} USD`;
  return `$${amount.toFixed(2)}`;
}
```

El problema aparece cuando los requisitos divergen: precios de producto necesitan redondear a enteros en la UI de catálogo, y los totales de factura necesitan siempre dos decimales más el código de moneda por temas legales. Ahora `formatCurrency` tiene un flag booleano por cada diferencia, y cada nuevo caso agrega otro `if`. Las dos funciones nunca representaban el mismo conocimiento — solo se veían parecidas por casualidad. Forzar DRY ahí crea un acoplamiento falso: cambiar el formato de precios de catálogo puede romper el de facturación sin que nadie lo haya pedido.

```ts
// Mejor: dejarlas separadas, cada una evoluciona con su propia regla de negocio
function formatCatalogPrice(amount: number): string {
  return `$${Math.round(amount)}`;
}

function formatInvoiceTotal(amount: number): string {
  return `$${amount.toFixed(2)} USD`;
}
```

**La pregunta que hay que hacerse antes de abstraer**: si cambia la regla de negocio de A, ¿tiene sentido que cambie también la de B? Si la respuesta es no, no es duplicación — es coincidencia, y unificarlas es el error, no la solución.

## KISS — Keep It Simple, Stupid

La solución más simple que resuelve el problema de hoy, no la más "inteligente" o la que demuestra más dominio del lenguaje.

```ts
// "Inteligente" pero difícil de leer y de debuggear
const getDiscount = (user: User) =>
  [premiumDiscount, loyaltyDiscount, seasonalDiscount]
    .reduce((acc, fn) => (fn(user) > acc ? fn(user) : acc), 0);
```

```ts
// Simple: se lee de arriba a abajo, se debuggea con un breakpoint
function getDiscount(user: User): number {
  const discounts = [premiumDiscount(user), loyaltyDiscount(user), seasonalDiscount(user)];
  return Math.max(...discounts);
}
```

KISS no significa "evitar abstracciones" — significa que la complejidad debe ser proporcional al problema. Un `reduce` encadenado con funciones anónimas no es más correcto que un `Math.max`, solo es más difícil de leer para el próximo que lo toque (incluido tú en seis meses).

## YAGNI — You Aren't Gonna Need It

No construir una función, un parámetro o una capa de abstracción "por si en el futuro se necesita". Construir para un futuro hipotético tiene un costo hoy (más código, más superficie para bugs) y una probabilidad real de que ese futuro nunca llegue, o llegue distinto a como se imaginó.

```ts
// Violación de YAGNI: un sistema de plugins para una función que hoy hace una sola cosa
interface EmailPlugin {
  beforeSend?(email: Email): Email;
  afterSend?(email: Email): void;
}

class EmailSender {
  private plugins: EmailPlugin[] = [];

  registerPlugin(plugin: EmailPlugin) {
    this.plugins.push(plugin);
  }

  send(email: Email) {
    let processed = email;
    for (const plugin of this.plugins) {
      processed = plugin.beforeSend?.(processed) ?? processed;
    }
    smtpClient.send(processed);
    for (const plugin of this.plugins) plugin.afterSend?.(processed);
  }
}
```

Nadie pidió plugins. Hoy solo se necesita enviar un email de bienvenida.

```ts
// YAGNI respetado: la función que existe hoy, nada más
function sendWelcomeEmail(email: string) {
  smtpClient.send({ to: email, subject: 'Bienvenido', body: 'Hola, tu cuenta fue creada' });
}
```

Si mañana aparece un segundo tipo de email con lógica distinta, ese es el momento de extraer una abstracción: ya tendrás dos casos reales, en vez de diseñar a partir de una necesidad imaginada.

## Cuándo estos principios se vuelven dogma (y eso es el problema)

- **DRY dogmático**: unificar dos piezas de código porque "se ven iguales" sin preguntar si representan el mismo conocimiento de negocio. La regla práctica común es "duplica dos veces, abstrae a la tercera" (*rule of three*) — con dos casos todavía no hay suficiente información para saber cuál es la abstracción correcta.
- **KISS dogmático**: usarlo como excusa para no usar ningún patrón, ninguna capa, ningún tipo — "simple" no es sinónimo de "todo en un archivo de 500 líneas". Simple significa fácil de entender y cambiar, no ausencia de estructura.
- **YAGNI dogmático**: usarlo para justificar no pensar nunca en el diseño a futuro. Hay una diferencia entre "no construir el sistema de plugins que nadie pidió" y "no darle un nombre de módulo que después sea imposible de extender sin reescribir todo". YAGNI es sobre no construir *funcionalidad* prematura, no sobre ignorar decisiones de arquitectura baratas de tomar ahora.

## Consideraciones

- Los tres principios apuntan al mismo objetivo: minimizar el costo de cambio futuro. Se contradicen entre sí cuando se aplican sin criterio — DRY prematuro genera la complejidad que KISS y YAGNI tratan de evitar.
- La pregunta útil no es "¿esto repite código?" sino "¿esto repite una decisión de negocio que debería cambiar en un solo lugar?".
- Escribir la versión duplicada primero y refactorizar cuando aparece un tercer caso real casi siempre da mejor resultado que abstraer desde el primer caso.
