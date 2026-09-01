---
title: Pull Requests — preparación, revisión y merge
description: Preparar cambios revisables, describir evidencia y riesgos, responder comentarios y elegir una estrategia de integración consciente.
type: guides
order: 4
tags: [git, collaboration, commits, branches, pull-request]
related:
  - git/git/git-mental-model-terminology
  - git/git/git-flujo-basico
updatedAt: 2026-08-25
---

Git conserva historia; una **pull request** —solicitud de cambios— agrega conversación, revisión y controles antes de integrar. El objetivo no es producir la mayor cantidad de commits, sino una unidad de cambio que otra persona pueda comprender y verificar.

## Commit coherente

Un commit debe compilar o dejar claro por qué es un paso intermedio. Separa refactor mecánico de cambio funcional cuando eso facilite la revisión.

```text
feat(search): add filtering by category

Validate the category on the server and preserve it in pagination links.
```

**Conventional Commits** es una convención opcional para estructurar mensajes; resulta útil si automatiza changelog o versiones. La explicación del porqué sigue siendo más importante que cumplir un prefijo.

## Antes de abrir la PR

- Revisa el diff completo y elimina logs o archivos accidentales.
- Ejecuta formato, tipos, pruebas y build aplicables.
- Divide cambios sin relación.
- Actualiza documentación y migraciones.
- Señala riesgos, decisiones y pasos de prueba.

```md
## Qué cambia
## Por qué
## Cómo se verificó
## Capturas o evidencia
## Riesgos, migración y rollback
```

## Revisar con intención

Empieza por contrato y comportamiento; después mira seguridad, datos, errores, pruebas y mantenibilidad. Distingue un bloqueo de una sugerencia. Una pregunta concreta —“¿qué ocurre si se reintenta?”— ayuda más que “esto está mal”.

## Ramas cortas e integración

Cuanto más vive una rama, más se desvía. Integra cambios pequeños detrás de una función desactivada si es necesario. Rebase o merge son políticas del equipo; evita reescribir historia ya compartida sin coordinación.

Después de integrar, monitorea el despliegue y conserva una ruta de reversión. La aprobación no elimina el riesgo operativo.

## Draft, tamaño y alcance

Abre una **Draft Pull Request** cuando necesites validar dirección o ejecutar CI, pero el cambio todavía no esté listo para aprobación. Marca claramente qué falta. Una PR pequeña no se mide solo por líneas: debe representar una decisión coherente que pueda revisarse y revertirse sin arrastrar trabajo independiente.

Si una PR mezcla refactor, nueva funcionalidad y actualización masiva de dependencias, el revisor no puede atribuir un fallo con facilidad. Separa primero los cambios mecánicos cuando reduzcan ruido.

## Plantilla útil

```md title=".github/pull_request_template.md"
## Problema y objetivo
Closes #123

## Solución
- decisión principal;
- alternativas descartadas.

## Verificación
- [ ] tipos, pruebas y build;
- [ ] teclado, responsive o API según corresponda;
- [ ] evidencia adjunta.

## Riesgo y operación
Migración, compatibilidad, observabilidad y rollback.
```

Una casilla no reemplaza evidencia. “Tests pasaron” es menos útil que indicar qué comando se ejecutó y qué comportamiento nuevo protege la prueba.

## Cómo responder una revisión

- corrige y marca la conversación como resuelta cuando el cambio sea visible;
- explica por qué no aplicas una sugerencia en vez de ignorarla;
- solicita una nueva revisión si cambió el riesgo o la solución;
- no mezcles discusiones personales con el análisis técnico;
- registra decisiones relevantes en código, documentación o ADR.

## Estrategias de merge

| Estrategia | Resultado | Cuándo ayuda |
| --- | --- | --- |
| Squash merge | un commit por PR | commits intermedios no aportan valor permanente |
| Merge commit | conserva la rama y todos sus commits | el historial de integración es importante |
| Rebase merge | commits lineales sin merge commit | cada commit ya es coherente y la política exige linealidad |

Elige una convención por repositorio. Cambiar de estrategia en cada PR vuelve impredecible el historial.

## Lista antes del merge

1. la PR enlaza el Issue o explica por qué no existe;
2. alcance, riesgos y cambios de contrato están descritos;
3. no contiene secretos, logs ni archivos accidentales;
4. CI y revisiones requeridas están completas;
5. migraciones permiten despliegue y rollback seguros;
6. documentación, changelog o release notes se actualizaron cuando aplica;
7. existe una persona responsable de observar el resultado después del merge.

Fuente oficial: [colaborar con Pull Requests en GitHub](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests).
