---
title: GitHub — crear un repositorio y conectarlo con Git
description: Crear un repositorio en GitHub, inicializar el proyecto local y publicar la rama principal por primera vez.
category: git
stack: github-platform
order: 1
tags: [github, repositorios, git, init, remote, push]
scope: repositorio local y remoto
related:
  - guides/git-flujo-basico
  - guides/github-clone-pull-push
  - guides/repository-management-fundamentals
updatedAt: 2026-08-26
---

Un repositorio en GitHub es el remoto que aloja el código, su historial y la colaboración del proyecto. Git sigue funcionando en tu equipo; GitHub añade almacenamiento remoto, Pull Requests, Issues, permisos y automatización.

## Opción A: ya tienes una carpeta local

Primero crea un repositorio vacío en GitHub. Si el proyecto ya existe localmente, no marques la opción de crear README, `.gitignore` o licencia en ese primer paso: así evitas una historia inicial separada.

```bash
cd mi-proyecto
git init
git branch -M main
git add .
git commit -m "chore: iniciar proyecto"
git remote add origin https://github.com/USUARIO/mi-proyecto.git
git push -u origin main
```

`origin` es solo el nombre convencional del remoto. `-u` configura el tracking entre `main` local y `origin/main`, por lo que los siguientes `git pull` y `git push` pueden omitir remoto y rama.

Comprueba la conexión:

```bash
git remote -v
git branch -vv
git ls-remote origin
```

## Opción B: empezar con un repositorio remoto

Si el repositorio de GitHub ya tiene contenido, descarga una copia completa con `clone`:

```bash
git clone https://github.com/USUARIO/mi-proyecto.git
cd mi-proyecto
```

Clonar es la operación que normalmente se busca cuando alguien dice “copiar el repositorio”: conserva archivos, ramas disponibles, commits y la URL del remoto.

## Errores frecuentes al conectar

- `remote origin already exists`: revisa la URL con `git remote -v` o actualízala con `git remote set-url origin <url>`.
- `non-fast-forward`: el remoto tiene commits que tu copia no conoce; usa `git pull --rebase` o integra los cambios conscientemente.
- `repository not found`: confirma el propietario, nombre, visibilidad y autenticación.
- README duplicado o conflicto inicial: ocurre cuando inicializas local y remoto con commits distintos; clona el remoto o integra las historias de forma explícita.

No subas `.env`, tokens, claves privadas ni archivos generados. Añádelos a `.gitignore` antes del primer commit; borrar un secreto del archivo actual no lo elimina del historial ya publicado.

Consulta la [documentación oficial sobre repositorios](https://docs.github.com/en/repositories/creating-and-managing-repositories/about-repositories) y la [guía de remotos de Git](https://git-scm.com/book/es/v2/Git-en-el-servidor-Git-en-un-servidor).
