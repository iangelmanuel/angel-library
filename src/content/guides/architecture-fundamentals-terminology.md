---
title: "Arquitectura de software: fundamentos y terminología"
description: Vocabulario para razonar sobre límites, módulos, acoplamiento, cohesión, capas, dependencias y decisiones arquitectónicas.
category: architecture
stack: principios
tags: [arquitectura, diseno, modulos, dependencias, fundamentos]
order: 1
updatedAt: 2026-08-25
---

La **arquitectura de software** reúne decisiones estructurales que condicionan cómo se desarrolla, despliega, cambia y opera un sistema. No es un diagrama decorativo ni una lista de patrones: debe explicar límites, responsabilidades, dependencias y razones.

Una buena arquitectura no elimina el cambio. Hace que los cambios previsibles sean localizables y que los riesgos importantes sean visibles.

## Aprende o consulta

Para aprender, comienza por módulos, dependencias, cohesión y acoplamiento. Después estudia principios y patrones; al final compara arquitecturas completas. Un patrón sin problema concreto es vocabulario, no una decisión.

| Pregunta | Documento |
| --- | --- |
| ¿cómo delimito módulos? | [Módulos y límites](/guides/architecture-modulos-limites) |
| ¿qué fuerzas debo comparar? | [Guía de decisión](/guides/architecture-decision-guide) |
| ¿cómo documento el porqué? | [ADR](/practices/adr) |
| ¿cómo priorizo disponibilidad, seguridad o rendimiento? | [Atributos de calidad](/guides/architecture-quality-attributes) |
| ¿cuándo usar capas o puertos? | [Arquitectura en capas](/patterns/layered-architecture) y [hexagonal](/patterns/hexagonal-architecture) |
| ¿monolito o microservicios? | [Comparación](/patterns/monolith-vs-microservices) |

Quien viene a recordar puede entrar por la fuerza que intenta resolver. Quien aprende debe implementar primero una versión simple y observar qué cambio se vuelve costoso antes de añadir abstracciones.

## Módulo, componente, capa y servicio

Estos términos se solapan, por lo que el equipo debe definirlos:

- **Módulo:** unidad de código con una interfaz y detalles internos.
- **Componente:** pieza reemplazable o componible; puede ser de interfaz o de sistema.
- **Capa:** agrupación por responsabilidad técnica o nivel de abstracción.
- **Servicio:** capacidad expuesta mediante un contrato; puede vivir en el mismo proceso o en otro.
- **Boundary** o límite: punto donde cambian reglas, responsabilidad o modelo de confianza.

El nombre importa menos que la frontera explícita. Si cualquier módulo consulta cualquier tabla, la separación dibujada no existe en el código.

## Acoplamiento y cohesión

El **acoplamiento** mide cuánto depende una parte de los detalles de otra. La **cohesión** mide cuánto pertenecen entre sí las responsabilidades de un módulo.

Se busca alta cohesión y acoplamiento controlado. “Bajo acoplamiento” no significa cero dependencias: significa depender de contratos estables y no conocer detalles innecesarios.

```ts
interface PaymentGateway {
  charge(input: ChargeInput): Promise<ChargeResult>;
}

class CompleteOrder {
  constructor(private readonly payments: PaymentGateway) {}
}
```

El caso de uso conoce la capacidad `PaymentGateway`, no el SDK concreto. Esto permite cambiar el adaptador y probar el comportamiento con un fake.

## Separación de responsabilidades

La **separación de responsabilidades** asigna motivos de cambio distintos a módulos distintos. Validar HTTP, calcular una regla y guardar en una base son responsabilidades relacionadas, pero no idénticas.

Separar demasiado también tiene costo: más archivos, contratos y navegación. Se extrae una frontera cuando protege una regla, facilita pruebas o contiene una dependencia que cambia a otro ritmo.

## Dependencia e inversión

El **principio de inversión de dependencias** propone que la política de alto nivel no dependa directamente de detalles de bajo nivel. Ambos dependen de abstracciones definidas alrededor de la necesidad de negocio.

La **inyección de dependencias** es una técnica para proporcionar colaboraciones desde fuera. Un contenedor automático no es obligatorio; pasar un argumento por constructor ya es inyección.

## Capas, puertos y adaptadores

Una organización frecuente separa:

```text
Interfaz: HTTP, CLI, UI
    ↓
Aplicación: casos de uso y coordinación
    ↓
Dominio: reglas y conceptos del negocio
    ↑
Infraestructura: base de datos, correo, proveedores
```

En **puertos y adaptadores**, un puerto expresa una capacidad que el núcleo necesita u ofrece. Un adaptador conecta ese puerto con HTTP, PostgreSQL o un proveedor externo.

Las flechas representan dependencia de código, no necesariamente flujo de ejecución. Una llamada puede entrar por HTTP y terminar en la base, mientras las interfaces permanecen definidas hacia el núcleo.

## Atributos de calidad

Una decisión arquitectónica responde a atributos que compiten:

- mantenibilidad;
- rendimiento;
- disponibilidad;
- seguridad;
- escalabilidad;
- observabilidad;
- costo;
- velocidad de entrega.

No se puede maximizar todo. Replicar servicios mejora cierta disponibilidad, pero aumenta costo y complejidad. La decisión debe mencionar el escenario y el sacrificio aceptado.

## Monolito y microservicios

Un **monolito** despliega gran parte del sistema como una unidad. Puede mantener módulos internos bien definidos y suele simplificar transacciones y operación.

Los **microservicios** separan capacidades en procesos desplegables de forma independiente. Añaden red, consistencia distribuida, observabilidad, seguridad entre servicios y coordinación de contratos.

Un **monolito modular** suele ser un buen punto de partida: conserva límites de dominio sin asumir el costo de distribución. Se extrae un servicio cuando existe una razón operativa u organizacional medida.

## DDD, CQRS y eventos

**DDD** significa *Domain-Driven Design* o diseño guiado por el dominio. Busca modelar el lenguaje y las reglas del negocio junto con expertos. No equivale a crear carpetas llamadas `domain`.

**CQRS** significa *Command Query Responsibility Segregation*: separar modelos de escritura y lectura cuando tienen necesidades diferentes. No requiere obligatoriamente dos bases de datos.

Una arquitectura **event-driven** o dirigida por eventos comunica hechos ocurridos. Introduce entrega duplicada, orden parcial y consistencia eventual; los consumidores deben diseñarse para esas condiciones.

## ADR y documentación

Un **ADR** (*Architecture Decision Record* o registro de decisión arquitectónica) conserva contexto, opciones, decisión y consecuencias.

```text
Título: Almacenar archivos fuera de la base relacional
Estado: aceptado
Contexto: tamaño y tráfico crecientes
Decisión: usar almacenamiento de objetos y guardar metadatos en SQL
Consecuencias: dos sistemas, limpieza de huérfanos y URLs firmadas
```

Documentar consecuencias evita presentar una elección como universal. Un diagrama debe tener alcance, fecha y leyenda; de lo contrario, envejece sin que nadie sepa si aún representa el sistema.

## Evaluar una decisión

1. Define el problema y los escenarios de calidad.
2. Identifica restricciones reales: equipo, presupuesto, regulación y operación.
3. Compara al menos una alternativa más simple.
4. Haz visible costo, riesgo y reversibilidad.
5. Prueba la incertidumbre principal con una medición o prototipo.
6. Registra la decisión y la señal que justificaría revisarla.
