---
title: Documentación técnica que se mantiene útil
description: Organizar README, guías, referencias y ADR con alcance, ejemplos verificables, responsables y señales de obsolescencia.
category: tools
stack: tools-documentacion
order: 1
tags: [documentation, readme, adr, knowledge-base, maintenance]
related:
  - guides/content-references
  - guides/architecture-decision-guide
updatedAt: 2026-08-25
---

La documentación útil responde una pregunta concreta en el lugar donde una persona la busca. No toda información pertenece al README ni toda decisión merece un tutorial.

## Tipo de documento según la necesidad

| Tipo | Responde | Ejemplo |
| --- | --- | --- |
| Tutorial | ¿Cómo aprendo haciendo? | Construir la primera ruta |
| Guía práctica | ¿Cómo logro una tarea? | Rotar una clave |
| Referencia | ¿Qué acepta esta API? | Parámetros y retornos |
| Explicación | ¿Por qué funciona así? | Modelo de concurrencia |
| ADR | ¿Por qué elegimos esta decisión? | Adoptar PostgreSQL |

Un **ADR** (*Architecture Decision Record* o registro de decisión arquitectónica) conserva contexto, decisión, alternativas y consecuencias. No reemplaza la guía operativa.

## Dos perfiles de lectura

Una persona que aprende necesita contexto, definiciones, secuencia, ejemplo y explicación del resultado. Una persona que recuerda necesita tabla, firma, comando, error frecuente y enlace relacionado. Una misma página puede ofrecer ambos accesos:

```text
introducción + mapa
  ├→ ruta guiada y modelo mental
  └→ referencia rápida
ejemplos → casos límite → verificación
```

No dupliques la explicación completa en “resumen” y “consideraciones”. Usa títulos que indiquen la decisión concreta.

## README mínimo del proyecto

```md
# Nombre y propósito
## Requisitos y versiones
## Instalación
## Variables de entorno sin valores secretos
## Desarrollo, check, test y build
## Estructura y enlaces a arquitectura
## Despliegue y solución de problemas
## Propiedad y contribución
```

Los comandos deben poder copiarse. Indica desde qué carpeta se ejecutan y qué efecto producen. Si un paso borra, migra o publica información, adviértelo antes del comando.

## Ejemplos verificables

- Usa versiones compatibles con el proyecto.
- Incluye entrada, salida y caso de error.
- Enlaza símbolos o páginas relacionadas.
- Evita claves y dominios reales.
- Ejecuta snippets críticos en pruebas o CI cuando sea posible.

## Evitar documentación obsoleta

Cada página debe tener un alcance reconocible. Añade fecha solo si alguien revisará su significado; una fecha reciente no prueba exactitud. Señales mejores son propietario, versión aplicable, enlaces comprobados y pruebas del código mostrado.

Cuando cambia el código, actualiza documentación en el mismo cambio. Si una página ya no aplica, redirige o explica su reemplazo en vez de dejar dos instrucciones contradictorias.

## Revisión editorial

Comprueba terminología consistente, acrónimos expandidos, versión, enlaces, código ejecutable y resultado visible. Pregunta qué conocimiento previo supone la página. Un ejemplo que introduce cinco librerías para explicar un concepto básico enseña dependencias antes que el concepto.

## Definición de terminado

La página permite ejecutar o decidir, explica fallos esperables y enlaza la siguiente etapa. Una referencia oficial respalda hechos cambiantes; la documentación local conserva cómo se aplica al proyecto.
