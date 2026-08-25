---
title: Git Hooks — automatizar acciones en el flujo
description: Scripts que Git corre solo en momentos puntuales (antes de commitear, antes de pushear) — hooks nativos y por qué la mayoría de los equipos usa Husky en su lugar.
category: git
stack: git
order: 18
tags: [git, hooks, automation, advanced]
scope: .git/hooks
updatedAt: 2026-08-16
---

Un hook es un script que Git ejecuta automáticamente en un momento puntual del flujo — antes de un commit, después de un merge, antes de un push. Sirven para validar o automatizar cosas sin depender de que cada persona se acuerde de correrlas a mano (correr el linter antes de commitear, correr los tests antes de pushear).

## Dónde viven

```bash
ls .git/hooks/
```

Cada repositorio creado con `git init` o `clone` ya trae una carpeta `.git/hooks/` con ejemplos `.sample` de cada hook disponible — no hacen nada hasta que se quita `.sample` del nombre y se vuelven ejecutables.

## Los hooks más usados

| Hook | Cuándo corre |
| --- | --- |
| `pre-commit` | Antes de crear el commit (puede cancelarlo si falla) |
| `commit-msg` | Después de escribir el mensaje, antes de confirmarlo (para validar formato) |
| `pre-push` | Antes de subir commits al remoto |
| `post-merge` | Después de un merge exitoso (útil para reinstalar dependencias si cambió el lockfile) |

## Un hook nativo básico

```bash title=".git/hooks/pre-commit"
#!/bin/sh
npm run lint
```

```bash
chmod +x .git/hooks/pre-commit
```

Si el script termina con código de salida distinto de `0` (el linter encontró errores), Git cancela el commit — nada se pierde, simplemente no se crea hasta que el script pase.

## El problema de los hooks nativos

`.git/` **no se versiona** — es la carpeta que Git usa para sí mismo, nunca se sube al remoto. Eso significa que un hook en `.git/hooks/` vive solo en tu máquina: cada persona del equipo tendría que copiarlo a mano, y no hay forma de forzar que lo tengan.

## Por qué (casi) todos usan Husky en su lugar

[Husky](https://typicode.github.io/husky) resuelve exactamente ese problema: guarda la configuración de los hooks en una carpeta versionada del proyecto (`.husky/`), y un script de instalación (que corre solo, vía `npm install`) los conecta a `.git/hooks/` en la máquina de cada persona automáticamente.

```bash
npm install --save-dev husky
npx husky init
```

```bash title=".husky/pre-commit"
npm run lint
```

Con eso commiteado, cualquiera que clone el repo y corra `npm install` termina con el mismo hook activo — sin pasos manuales, sin que dependa de acordarse.

## Resumen

| Comando/archivo | Qué hace |
| --- | --- |
| `.git/hooks/<nombre>` | Hook nativo, solo local, no versionado |
| `chmod +x .git/hooks/<nombre>` | Requisito para que Git lo ejecute |
| `.husky/<nombre>` (con Husky) | Mismo concepto, pero versionado y compartido con el equipo |

## Consideraciones

- Un hook que falla (rechaza el commit/push) sin un mensaje claro de **por qué** falló es frustrante — siempre vale la pena que el script imprima qué está chequeando y por qué no pasó.
- `--no-verify` salta los hooks de un comando puntual (`git commit --no-verify`) — útil en una emergencia real, pero saltarlo por costumbre anula el propósito de tenerlos.
- Para proyectos sin Node/npm, hay alternativas equivalentes a Husky en otros ecosistemas (`pre-commit` en Python, por ejemplo) — el concepto de "hooks versionados" no es exclusivo de JS.
