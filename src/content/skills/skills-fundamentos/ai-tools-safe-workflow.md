---
title: Workflow seguro con agentes de programación
description: Dar contexto mínimo, delimitar autoridad, revisar diffs y verificar resultados al usar skills, MCP, plugins o subagentes.
type: guides
order: 2
tags: [ai, agents, workflow, permissions, review]
related:
  - skills/skills-fundamentos/ai-tools-skills-fundamentals
  - security/security-fundamentos/security-threat-modeling
  - testing/testing-fundamentos/testing-strategy
updatedAt: 2026-08-25
---

Un agente acelera exploración y cambios, pero no hereda automáticamente el contexto, la intención ni la autoridad de una persona. Un workflow confiable hace explícitos objetivo, alcance, acciones permitidas y evidencia final.

## Plantilla de tarea

```text
Objetivo: corregir la validación del registro.
Alcance: src/features/signup y sus tests.
No cambiar: contrato HTTP y textos públicos.
Puede: leer, editar archivos locales y ejecutar tests.
Debe pedir permiso: instalar paquetes o escribir en servicios externos.
Termina cuando: reproducción falla antes, pasa después, tipos y tests correctos.
```

Esta forma sirve tanto para aprender —porque revela decisiones— como para recordar —porque evita reconstruir el alcance en cada turno.

## Ciclo verificable

```text
inspeccionar → explicar hipótesis → cambiar poco → probar → revisar diff
      ↑                                              ↓
      └──────────── ajustar con evidencia ───────────┘
```

Solicita pruebas proporcionales al riesgo. Un cambio de copy no exige la misma validación que una migración, auth o pago.

## Contexto mínimo suficiente

Entrega archivos y reglas relevantes, no todo el repositorio. Instrucciones repetidas o contradictorias reducen claridad. Una skill debe contener un procedimiento reusable; la tarea contiene el objetivo concreto.

## MCP y plugins

Antes de conectar una integración revisa:

- qué datos puede leer;
- qué acciones puede escribir o eliminar;
- qué identidad utiliza;
- dónde salen los datos;
- si ofrece modo read-only;
- cómo se revoca y audita.

Usa credenciales con mínimo privilegio y entornos de prueba. Un nombre “oficial” no sustituye revisar permisos efectivos.

## Revisar resultado

```bash
git diff --stat
git diff
pnpm test
pnpm check
```

Lee el diff, no solo el resumen. Busca cambios fuera de alcance, secretos, dependencias nuevas, manejo de errores y pruebas que realmente fallen sin el fix.

## Acciones de alto impacto

Publicar, desplegar, migrar, borrar, enviar mensajes o cambiar permisos requieren una frontera de aprobación clara. La autonomía local reversible no autoriza efectos externos.

## Aprender del trabajo

Pide que la explicación conecte síntoma, causa, cambio y validación. Conserva como snippet el patrón general; no guardes una solución específica sin condiciones ni versión.

