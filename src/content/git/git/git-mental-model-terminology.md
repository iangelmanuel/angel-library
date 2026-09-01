---
title: "Git: modelo mental y terminología"
description: Cómo entender working tree, staging, commits, ramas, HEAD, remotos, merge, rebase y pull requests antes de memorizar comandos.
type: guides
tags: [git, control-de-versiones, commits, ramas, fundamentos]
order: 1
updatedAt: 2026-08-25
---

Git es un sistema de **control de versiones distribuido**. Registra instantáneas del proyecto, permite comparar cambios y coordinar historias de trabajo. Distribuido significa que cada clon normal conserva el historial y puede crear commits sin depender continuamente de un servidor central.

## Aprende o consulta

Para aprender: zonas de trabajo → commit → rama → remoto → merge → conflictos → colaboración → recuperación. Antes de ejecutar un comando para “deshacer”, identifica qué zona quieres modificar y si el commit ya se compartió.

| Situación | Documento |
| --- | --- |
| preparar y confirmar cambios | [Flujo básico](/git/git/git-flujo-basico) |
| crear o mover ramas | [Ramas](/git/git/git-ramas) |
| sincronizar sin confundir fetch/pull | [Remotos](/git/git/git-remotos) |
| elegir merge o rebase | [Merge vs rebase](/git/git/git-merge-vs-rebase) |
| resolver marcadores de conflicto | [Conflictos](/git/git/git-resolver-conflictos) |
| recuperar un commit “perdido” | [Reflog](/git/git/git-reflog) |
| organizar trabajo en equipo | [Workflow colaborativo](/git/git/git-workflow-colaborativo) |
| usar PR e issues desde terminal | [GitHub CLI](/git/github/gh-cli-workflow-completo) |

Quien viene a recordar debe poder anticipar qué referencias y archivos cambiará el comando. Quien aprende debe usar `status`, `log --graph` y `diff` después de cada paso para observar el modelo.

## Las tres zonas de trabajo

```text
Working tree  --git add-->  Index o staging  --git commit-->  Repositorio
     ↑                              │                              │
     └──────── editar archivos ─────┘                  historial local
```

- **Working tree:** archivos visibles que se editan.
- **Index** o **staging area:** selección exacta preparada para el siguiente commit.
- **Repositorio:** objetos e historial almacenados dentro de `.git`.

`git add` no “sube” archivos. Copia su estado actual al índice. Si se vuelve a editar un archivo después de añadirlo, puede existir una versión preparada y otra sin preparar.

## Commit, árbol y blob

Un **commit** identifica una instantánea, autoría, mensaje, fecha y uno o más padres. Un **tree** representa directorios y nombres. Un **blob** almacena contenido de archivo sin su nombre de ruta.

Git identifica objetos mediante un hash. La abreviatura **SHA** suele usarse informalmente para el identificador del commit porque Git utilizó algoritmos de la familia *Secure Hash Algorithm*. Un hash corto funciona mientras siga siendo inequívoco en ese repositorio.

Un commit no es solo “los cambios”: apunta a una instantánea completa y Git calcula diferencias al compararla con otra.

## Referencias, ramas y HEAD

Una **referencia** o *ref* es un nombre que apunta a un objeto. Una rama es una referencia móvil al commit más reciente de esa línea.

`HEAD` indica la posición actual. Normalmente apunta a una rama, y esa rama avanza al crear un commit. En **detached HEAD**, `HEAD` apunta directamente a un commit; se puede explorar o crear commits, pero conviene crear una rama para conservarlos con un nombre estable.

```text
main:    A──B──C
              ↑
             HEAD
```

Crear una rama es barato porque inicialmente solo crea otro nombre hacia un commit existente.

## Remote, fetch, pull y push

Un **remote** es un nombre local asociado a otro repositorio, como `origin`. No es necesariamente “la nube”; puede ser cualquier URL accesible.

- `git fetch` descarga objetos y actualiza referencias remotas sin integrar el trabajo en la rama actual.
- `git pull` ejecuta un fetch y después integra mediante merge o rebase según configuración.
- `git push` envía objetos y solicita actualizar una referencia remota.
- **upstream** es la rama remota que una rama local sigue por defecto.

Separar `fetch` de la integración permite inspeccionar cambios antes de modificar la rama local.

## Merge y rebase

Un **merge** une historias y puede crear un commit con dos padres:

```text
      C──D
     /    \
A──B──E────M
```

Un **rebase** vuelve a aplicar commits sobre otra base, creando commits nuevos con identificadores nuevos:

```text
antes:   A──B──C──D
              └──E──F

después: A──B──C──D──E'──F'
```

Merge conserva la topología; rebase produce una línea más directa. No se reescribe una historia compartida sin coordinación porque otras personas pueden depender de los commits anteriores.

## Conflicto

Un **conflicto** ocurre cuando Git no puede decidir cómo combinar cambios. No significa que Git esté dañado; requiere una decisión humana sobre el resultado correcto.

```text
<<<<<<< HEAD
versión actual
=======
versión que se integra
>>>>>>> feature
```

Resolver implica editar el contenido final, eliminar marcadores, ejecutar pruebas y marcar el archivo como resuelto. No se elige automáticamente “ours” o “theirs” sin comprender qué representa cada lado en la operación actual.

## Pull request

Una **pull request (PR)** es una propuesta de integrar cambios y revisarlos en una plataforma como GitHub. No es un objeto nativo del modelo local de Git.

Una PR útil explica problema, solución, riesgos y verificación. Los commits ayudan a revisar si cada uno representa una intención coherente, aunque el equipo después decida combinar la historia.

## Restaurar, revertir y resetear

- `git restore` cambia archivos del working tree o del índice.
- `git revert` crea un commit nuevo que invierte el efecto de otro; es seguro para historia compartida.
- `git reset` mueve una referencia y puede cambiar índice o archivos según el modo.

Antes de una operación destructiva se revisan `git status`, la rama actual y los cambios sin commit. Si el commit ya se compartió, `revert` suele preservar mejor la colaboración.

## Flujo seguro

1. `git status` para conocer rama y zonas modificadas.
2. `git diff` y `git diff --staged` para revisar ambos tipos de cambio.
3. `git add` por intención, no por costumbre.
4. `git commit` con un mensaje que explique el propósito.
5. `git fetch` antes de integrar trabajo remoto.
6. Ejecutar pruebas después de resolver conflictos.
7. Revisar el rango que se enviará antes de `push`.
