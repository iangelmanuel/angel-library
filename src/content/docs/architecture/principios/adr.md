---
title: "ADR: Architectural Decision Records"
description: Un documento corto que registra una decisión de arquitectura, su contexto, las alternativas consideradas y por qué se eligió — para no perder el "por qué" con el tiempo.
type: practices
order: 11
practice: Escribir un documento corto por cada decisión de arquitectura costosa de revertir, numerado, versionado en el repo y nunca editado retroactivamente.
why: Seis meses después nadie recuerda por qué se eligió Postgres sobre Mongo, y la persona que lo decidió puede ya no estar en el proyecto.
related:
  - architecture/principios/deuda-tecnica
updatedAt: 2026-08-17
---

Un Architectural Decision Record (ADR) es un documento corto que registra **una** decisión de arquitectura: el contexto en el que se tomó, las opciones que se consideraron, y por qué se eligió la que se eligió. No es un documento de diseño completo ni una especificación técnica — es una fotografía de un momento de decisión, pensada para leerse en cinco minutos dentro de un año.

## Por qué importa

El código muestra _qué_ se construyó, no _por qué_ se construyó así. Seis meses después de elegir PostgreSQL sobre MongoDB, o de organizar las carpetas de una forma particular, nadie recuerda las razones — y la persona que tomó la decisión puede haber cambiado de equipo o de empresa. Sin un registro, cada "¿por qué está así?" se convierte en arqueología de código o en volver a discutir una decisión que ya se tomó, con la mitad de la información que se tenía la primera vez.

Un ADR responde esa pregunta sin depender de la memoria de nadie.

## Formato típico

```md title="docs/adr/0001-usar-postgres.md"
# ADR 0001: Usar PostgreSQL como base de datos principal

## Estado

Aceptado

## Contexto

[qué problema/decisión había que resolver]

## Decisión

[qué se decidió]

## Alternativas consideradas

- [opción A] — descartada porque...
- [opción B] — descartada porque...

## Consecuencias

[qué implica esta decisión, positivo y negativo]
```

Un ejemplo real relleno, para un caso concreto:

```md title="docs/adr/0003-nombrar-modulos-por-feature.md"
# ADR 0003: Organizar el backend por feature, no por capa técnica

## Estado

Aceptado

## Contexto

El proyecto empezó con carpetas por capa técnica (`controllers/`, `services/`,
`repositories/`), pero con más de 15 endpoints ya cuesta encontrar todos los
archivos relacionados a una misma feature — cambiar "checkout" implica tocar
archivos en cuatro carpetas distintas sin relación visible entre sí.

## Decisión

Reorganizar por feature: cada carpeta de primer nivel (`checkout/`, `users/`,
`inventory/`) contiene su propio controller, service y repository. El código
compartido entre features vive en `shared/`.

## Alternativas consideradas

- Mantener la organización por capa técnica — descartada porque no escala:
  cuanto más crece el proyecto, más difícil es ver qué archivos pertenecen
  juntos.
- Organizar por dominio con módulos totalmente aislados (arquitectura
  hexagonal completa) — descartada por ahora: el equipo es de 3 personas y
  el costo de esa ceremonia no se justifica todavía.

## Consecuencias

Positivo: cambiar una funcionalidad completa se hace dentro de una sola carpeta.
Onboarding más simple para gente nueva.
Negativo: hay que definir con cuidado qué va en `shared/` para no terminar
con un cajón de sastre. Requiere migrar el código existente.
```

## Reglas de uso

- **Se numeran secuencialmente** (`0001`, `0002`, `0003`...) y viven en el repo, típicamente en `docs/adr/`, versionados junto con el código que documentan.
- **Nunca se editan retroactivamente.** Si una decisión cambia, no se reescribe el ADR original — se escribe uno nuevo que referencia al viejo como _superseded_ (reemplazado). El historial de decisiones, incluidas las que después resultaron equivocadas, es parte del valor del ADR.

```md title="docs/adr/0007-migrar-a-mongo.md"
# ADR 0007: Migrar de PostgreSQL a MongoDB para el catálogo de productos

## Estado

Aceptado — reemplaza a ADR 0001

## Contexto

...
```

- **No todo merece un ADR.** Elegir el nombre de una variable o qué librería de fechas usar no justifica el costo de mantener un documento. Los candidatos son decisiones costosas de revertir (elegir base de datos, definir límites de módulos, elegir un proveedor externo del que depende todo el sistema) o decisiones que alguien previsiblemente va a cuestionar después ("¿por qué no usamos GraphQL aquí?").

## Consideraciones

- Un ADR no necesita ser largo — la plantilla de cuatro secciones cabe en media página. La brevedad es una característica, no una limitación: si hace falta más espacio para justificar la decisión, probablemente el documento se está mezclando con un diseño técnico completo.
- El "Estado" también puede ser `Propuesto` (todavía en discusión) o `Rechazado` (se consideró y no se adoptó, pero vale la pena dejar registro de por qué).
- ADRs y deuda técnica se complementan: cuando se toma deuda deliberada a propósito, un ADR corto es un buen lugar para documentar por qué se aceptó el atajo y cuál era el plan de repago.
