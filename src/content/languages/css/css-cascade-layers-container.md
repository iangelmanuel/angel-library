---
title: Cascada moderna, capas y container queries
description: Controlar la cascada con @layer, @scope, custom properties, nesting y consultas al contenedor para CSS escalable.
type: guides
order: 1
tags: [css, cascade, layers, container-queries, architecture]
scope: CSS intermedio-avanzado
related:
  - languages/css/css
  - languages/css/css-variables
  - ui-ux/ui-ux-design-systems/ui-ux-design-systems
updatedAt: 2026-08-18
---

## Capas de cascada

`@layer` permite definir el orden de prioridad de bloques completos antes de discutir especificidad. Una arquitectura frecuente separa reset, base, componentes y utilidades:

```css
@layer reset, base, components, utilities;

@layer reset {
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }
}

@layer components {
  .button {
    border-radius: 0.5rem;
  }
}

@layer utilities {
  .u-hidden {
    display: none !important;
  }
}
```

Las capas posteriores ganan a las anteriores con la misma importancia, por lo que puedes importar una librería dentro de una capa baja y conservar una capa de overrides controlada. `!important` invierte el orden de prioridad de las capas; úsalo solo como escape documentado.

## Custom properties y `@property`

Una custom property conserva texto hasta que una propiedad la consume. `@property` permite declarar sintaxis, herencia y valor inicial, lo que hace posible interpolar ciertos tokens con seguridad:

```css
@property --progress {
  syntax: "<number>";
  inherits: false;
  initial-value: 0;
}

.bar {
  transform: scaleX(var(--progress));
}
```

Usa tokens para decisiones de diseño compartidas, no para ocultar valores sin nombre. Define fallbacks cuando el componente pueda renderizarse fuera del tema principal.

## Container queries

Una media query pregunta por el viewport; una container query pregunta por el espacio disponible para el componente. Esto permite que una card cambie de layout igual si vive en un sidebar o en una grilla ancha.

```css
.card-list {
  container: cards / inline-size;
}

@container cards (min-width: 36rem) {
  .card {
    grid-template-columns: 8rem 1fr;
  }
}
```

Declara el contenedor en el ancestro que controla el ancho. Si consultas un elemento que no tiene `container-type` o si el componente depende del viewport por un motivo global, la regla no se aplicará como esperas.

## `@scope` y nesting

`@scope` limita selectores a un subárbol y reduce overrides accidentales. El nesting mejora cercanía visual, pero no debe generar selectores profundamente anidados. Mantén la especificidad baja y usa `:where()` para agrupar selectores sin sumar peso.
