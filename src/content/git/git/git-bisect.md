---
title: Bisect — encontrar el commit que rompió algo
description: Búsqueda binaria automática sobre el historial para encontrar exactamente qué commit introdujo un bug, entre cientos en minutos.
type: guides
order: 17
tags: [git, bisect, debugging, advanced]
scope: git bisect
updatedAt: 2026-08-16
---

Cuando algo funcionaba y en algún punto del historial dejó de funcionar, pero no está claro en qué commit — revisar uno por uno es lento. `git bisect` automatiza una búsqueda binaria: le dices un commit donde **sabías** que andaba bien y uno donde está roto, y Git te va llevando al punto medio exacto hasta encontrar el commit exacto responsable, en `log₂(n)` pasos en vez de `n`.

## El proceso

```bash
git bisect start
git bisect bad                    # el commit actual (HEAD) está roto
git bisect good v1.2.0             # este commit/tag más viejo sabías que andaba bien
```

Git hace checkout automático al commit justo en el medio de ese rango. Ahí pruebas la app (correr los tests, reproducir el bug a mano, lo que corresponda) y le dices el resultado:

```bash
git bisect good    # este commit anda bien, el bug está más adelante
git bisect bad     # este commit ya tiene el bug, está más atrás
```

Git repite el proceso, cada vez achicando el rango a la mitad, hasta señalar el commit exacto:

```text
a1b2c3d is the first bad commit
```

## Terminar

```bash
git bisect reset
```

Vuelve a la rama/commit donde estabas antes de empezar — sin esto, el repo queda en un estado "detached HEAD" en el medio de la búsqueda.

## Automatizar con un script

Si el bug se puede detectar con un comando (un test que falla, un script que chequea algo), `bisect run` prueba todos los commits automáticamente sin intervención manual:

```bash
git bisect start
git bisect bad HEAD
git bisect good v1.2.0
git bisect run npm test
```

Git corre `npm test` en cada commit candidato — código de salida `0` cuenta como `good`, cualquier otro como `bad` — y termina solo con el commit responsable identificado.

## Resumen

| Comando | Qué hace |
| --- | --- |
| `git bisect start` | Empieza la búsqueda |
| `git bisect bad [hash]` | Marca un commit como roto (sin hash, usa el actual) |
| `git bisect good <hash>` | Marca un commit como sano |
| `git bisect run <comando>` | Automatiza todo el proceso con un comando que devuelve éxito/fallo |
| `git bisect reset` | Termina, vuelve al estado de antes de empezar |

## Consideraciones

- Cuantos más commits haya entre el `good` y el `bad`, más vale la pena — para 3 o 4 commits de diferencia, probablemente sea más rápido revisarlos a mano.
- `bisect run` es la forma de sacarle todo el jugo: si el bug se puede verificar con un test automatizado, encontrar el commit culpable entre cientos toma segundos, no una tarde.
- Durante el bisect, el repo queda en "detached HEAD" en cada paso (no estás parado en ninguna rama) — es esperado, `git bisect reset` al final te devuelve a donde estabas.
