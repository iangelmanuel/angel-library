---
title: "DevOps: fundamentos y terminología"
description: Modelo mental de entrega continua, artefactos, entornos, infraestructura, despliegues, observabilidad e incidentes.
category: devops
stack: devops-fundamentos
tags: [devops, ci-cd, despliegue, infraestructura, observabilidad, fundamentos]
order: 1
updatedAt: 2026-08-19
---

**DevOps** une prácticas de desarrollo y operación para entregar cambios pequeños, confiables y observables. No es únicamente Docker ni el nombre de un cargo: implica responsabilidad compartida desde el código hasta su comportamiento en producción.

## Del cambio a producción

```text
Commit → revisión → CI → artefacto → entorno → despliegue
       → verificación → observabilidad → aprendizaje
```

**CI** significa *Continuous Integration* o integración continua: integrar cambios con frecuencia y verificarlos automáticamente. **CD** puede significar *Continuous Delivery* —entrega continua con aprobación para publicar— o *Continuous Deployment* —despliegue automático de cada cambio aprobado—. El equipo debe aclarar cuál usa.

## Pipeline, job y step

Un **pipeline** es el flujo automatizado. Un **job** es una unidad de trabajo que suele ejecutarse en una máquina o contenedor. Un **step** es un paso dentro del job.

```yaml
jobs:
  verify:
    steps:
      - checkout
      - install
      - lint
      - typecheck
      - test
      - build
```

Una etapa rápida debe fallar pronto para no gastar minutos en un build que ya tiene errores de tipos. Las etapas independientes pueden ejecutarse en paralelo cuando no comparten estado.

## Artefacto, entorno y promoción

Un **artefacto** es una salida versionada e inmutable: imagen de contenedor, paquete o carpeta compilada. Un **entorno** es un conjunto de configuración y servicios, como desarrollo, pruebas, *staging* y producción.

La **promoción** mueve el mismo artefacto verificado entre entornos. Recompilar por entorno puede producir resultados diferentes. La configuración específica se inyecta al ejecutar, sin incluir secretos en el artefacto.

## Release y deploy

**Deploy** o despliegue instala una versión en un entorno. **Release** o publicación la habilita para usuarios. Se pueden separar con una bandera de funcionalidad, conocida como *feature flag*.

Estrategias comunes:

- **Rolling:** reemplaza instancias gradualmente.
- **Blue-green:** mantiene dos entornos y cambia el tráfico entre ellos.
- **Canary:** entrega primero a un porcentaje pequeño y observa.
- **Feature flag:** activa funcionalidad independientemente del despliegue.

Un rollback de código no siempre revierte datos. Las migraciones deben ser compatibles con la versión anterior durante el período en que ambas pueden ejecutarse.

## Infraestructura como código

**IaC** significa *Infrastructure as Code* o infraestructura como código. Redes, permisos y servicios se declaran en archivos versionados para revisar y reproducir cambios.

La declaración no elimina riesgos: un cambio de permisos o un borrado sigue necesitando revisión, plan y respaldo. El **drift** o desviación ocurre cuando el estado real ya no coincide con lo declarado, normalmente por cambios manuales.

## Contenedor, imagen y orquestación

Una **imagen** contiene capas de archivos y metadatos para ejecutar una aplicación. Un **contenedor** es una instancia de esa imagen con aislamiento de procesos y recursos. Un **registry** es el registro donde se almacenan imágenes.

Un **orquestador** programa instancias, redes, configuración y reemplazos. Kubernetes es un ejemplo, pero añade costo operativo. Si una plataforma gestionada resuelve el volumen y la disponibilidad necesarios, no es obligatorio operar un clúster propio.

## Observabilidad

La **observabilidad** permite inferir el estado interno a partir de sus salidas:

- **Logs:** eventos con contexto.
- **Métricas:** valores agregables en el tiempo.
- **Trazas:** recorrido de una solicitud entre componentes.
- **Perfiles:** dónde se consumen CPU o memoria.

Una métrica sin contexto dice que algo cambió; una traza puede mostrar dónde; un log estructurado puede explicar la condición concreta.

## SLI, SLO y SLA

- **SLI** (*Service Level Indicator*): indicador medido, como porcentaje de solicitudes exitosas.
- **SLO** (*Service Level Objective*): objetivo interno para ese indicador.
- **SLA** (*Service Level Agreement*): compromiso contractual con consecuencias acordadas.

El **error budget** o presupuesto de error es la cantidad de incumplimiento permitida por el SLO. Ayuda a equilibrar velocidad de cambio y confiabilidad con una medida compartida.

## Salud y disponibilidad

Una comprobación de **liveness** responde si el proceso está vivo y debe reiniciarse. Una de **readiness** responde si está listo para recibir tráfico. Mezclarlas puede crear bucles de reinicio cuando una dependencia externa falla.

La disponibilidad también requiere límites, caché, redundancia y degradación controlada. Escalar una aplicación con una consulta ineficiente puede trasladar el problema a la base de datos.

## Incidentes y recuperación

Un **incidente** es una interrupción o degradación que requiere coordinación. Durante el incidente se prioriza estabilizar y comunicar; el análisis profundo llega después.

**RTO** (*Recovery Time Objective*) define cuánto puede tardar la recuperación. **RPO** (*Recovery Point Objective*) define cuánto dato se acepta perder. Ambos orientan arquitectura, copias y simulacros.

Un **postmortem** documenta impacto, línea de tiempo, causas y acciones sin buscar culpables individuales. Las acciones útiles cambian el sistema: alerta, automatización, límite, prueba o procedimiento verificable.

## Flujo recomendado

1. Automatiza formato, tipos, pruebas y build.
2. Produce un artefacto identificable por commit.
3. Promueve ese artefacto con configuración externa.
4. Despliega gradualmente y verifica señales de usuario.
5. Define rollback, migraciones compatibles y cierre ordenado.
6. Mide SLIs vinculados con experiencia real.
7. Practica restauración e incidentes antes de necesitarlos.
