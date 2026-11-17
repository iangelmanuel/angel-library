---
title: "npkill: limpiar node_modules y restos de compilación"
description: Herramienta de terminal que busca carpetas pesadas de desarrollo (node_modules, cachés y salidas de build), muestra su tamaño y antigüedad y permite borrarlas desde una interfaz interactiva.
tags: [cli, npkill, node, node-modules, disco, limpieza]
sidebar:
  order: 10
draft: false
scope: npkill
runtime: Node.js >= 20.19
resourceCategory: Sitio oficial
official: true
website: https://npkill.js.org
github: https://github.com/voidcosmos/npkill
technologies:
  - terminal/terminal/terminal-npm
  - applications/apps-cli/terminal-pnpm
note: Licencia MIT. La versión 1.0.0 (noviembre de 2026) busca por perfiles; el perfil por defecto, node, encuentra más que node_modules.
warnings:
  - El borrado es definitivo. npkill ejecuta un rm -rf (o fs.rm en Windows); las carpetas no pasan por la papelera.
  - Borrar el node_modules de un proyecto activo obliga a reinstalar dependencias, y algunas aplicaciones del sistema necesitan el suyo para funcionar.
  - npx npkill descarga y ejecuta la última versión publicada en npm sin fijarla; revisa el paquete y la versión antes de usarlo.
  - Con --delete-all y -y borra todo lo encontrado sin interfaz ni confirmación. Prueba antes con --dry-run o --json.
updatedAt: 2026-11-17
---

## En pocas palabras

**npkill** es una herramienta de línea de comandos (CLI) con interfaz de texto (TUI, una interfaz interactiva que se dibuja dentro de la terminal). Recorre tus carpetas, lista los directorios de desarrollo que ocupan espacio, como `node_modules`, cachés o salidas de compilación, y te deja eliminarlos con una tecla. Muestra el tamaño de cada uno y cuándo tocaste el proyecto por última vez.

Nació en 2019 para cazar `node_modules`. La versión 1.0.0 añadió perfiles para otros ecosistemas (Python, Rust, Java, Unity…), selección múltiple, búsqueda, salida JSON y una API para usarlo desde código.

## Qué problema resuelve

Cada proyecto JavaScript guarda sus dependencias en su propio `node_modules`. Con [npm](/terminal/terminal/terminal-npm) cada proyecto tiene una copia completa, así que decenas de repositorios antiguos pueden sumar varios gigabytes. A eso se suman `.next`, `.nuxt`, `.turbo`, `coverage` y equivalentes de otros lenguajes.

Encontrarlos a mano con un explorador de archivos es lento, y un `rm -rf` masivo no te deja ver qué estás borrando. npkill hace las dos cosas en la misma pantalla: lista con tamaño y antigüedad, y borra solo lo que eliges.

## Cómo funciona

- **Escaneo**: empieza en el directorio actual (o el que indiques con `-d`) y desciende buscando nombres de carpeta objetivo. Salta por defecto carpetas como `.git`, `.nvm`, `.rustup`, `.vscode` o la papelera del sistema.
- **Perfiles**: un perfil es un conjunto de objetivos de un ecosistema. El perfil `node`, que es el predeterminado, incluye `node_modules` y `.angular` siempre, y `.next`, `.nuxt`, `.svelte-kit`, `.turbo`, `.vite`, `coverage` y otros solo cuando hay archivos que confirman su origen.
- **Objetivos inteligentes**: algunas carpetas solo aparecen si los archivos de alrededor lo confirman. Por ejemplo, `target` solo se muestra junto a un `Cargo.toml` o un `pom.xml`. Así se evita confundir una carpeta de compilación con una carpeta tuya del mismo nombre.
- **Resultados sensibles**: intenta identificar los `node_modules` de aplicaciones instaladas y los marca con un aviso. Algunos se ocultan por defecto (`--include-sensitive` los muestra).
- **Borrado**: en Linux y macOS ejecuta `rm -rf`; en Windows, `fs.rm` de Node con modo recursivo. No hay papelera ni deshacer.

## Instalación

Requiere Node.js 20.19 o posterior. Lo habitual es ejecutarlo sin instalar:

```bash
npx npkill
```

Si lo usas a menudo, instálalo de forma global para fijar la versión:

```bash
npm install -g npkill
npkill --version
```

Con [pnpm](/applications/apps-cli/terminal-pnpm) el equivalente de `npx` es `pnpm dlx npkill`.

## Uso

Ejecútalo desde la carpeta donde guardas tus proyectos, no desde la raíz del disco:

```bash
cd ~/projects
npx npkill
```

### Teclas principales

| Tecla                                | Acción                                          |
| ------------------------------------ | ----------------------------------------------- |
| <kbd>↑</kbd> <kbd>↓</kbd>            | Moverse por los resultados                      |
| <kbd>Espacio</kbd> o <kbd>Supr</kbd> | Borrar la carpeta seleccionada (modo normal)    |
| <kbd>→</kbd> / <kbd>←</kbd>          | Ver la información del resultado y volver       |
| <kbd>o</kbd>                         | Abrir la carpeta padre                          |
| <kbd>/</kbd>                         | Filtrar por ruta (admite expresiones regulares) |
| <kbd>t</kbd>                         | Activar o salir del modo de selección múltiple  |

En **selección múltiple**, <kbd>Espacio</kbd> marca o desmarca, <kbd>v</kbd> selecciona un rango, <kbd>a</kbd> marca todo y <kbd>Enter</kbd> borra lo marcado. La propia TUI tiene un panel de ayuda con todos los atajos.

### Opciones útiles

| Opción                | Qué hace                                                          |
| --------------------- | ----------------------------------------------------------------- |
| `-d, --directory`     | Directorio desde el que empieza a buscar                          |
| `-f, --full`          | Empieza desde la carpeta personal del usuario                     |
| `-p, --profiles`      | Elige perfiles (`node,python`); sin valor, los lista              |
| `-t, --targets`       | Ignora los perfiles y busca solo los nombres indicados            |
| `-E, --exclude`       | Excluye carpetas, separadas por comas                             |
| `-s, --sort`          | Ordena por `size`, `path` o `age`                                 |
| `--older-than <días>` | Solo proyectos sin cambios en más de esos días                    |
| `--dry-run`           | Simula el borrado sin eliminar nada                               |
| `-D, --delete-all`    | Borra todo lo encontrado; requiere `--targets`                    |
| `-y`                  | Con `--delete-all`, borra sin interfaz ni confirmación            |
| `--json`              | Emite los resultados en JSON al terminar                          |
| `--json-stream`       | Emite un objeto JSON por línea a medida que encuentra resultados  |
| `--no-size`           | Omite el cálculo de tamaño para escanear más rápido               |

Los valores por defecto y los perfiles propios se pueden guardar en un archivo `.npkillrc` (primero busca `./.npkillrc` y luego `~/.npkillrc`).

### Ejemplos

```bash
# Solo node_modules, como en versiones anteriores
npx npkill -t node_modules

# Node y Python a la vez, ordenado por tamaño
npx npkill --profiles node,python --sort size

# Excluir carpetas concretas
npx npkill -d ~/projects --exclude "trabajo-actual,clientes"

# Ver sin borrar los node_modules de proyectos sin tocar en 90 días
npx npkill -d ~/projects -t node_modules --older-than 90 --json

# Borrarlos sin interfaz (útil en scripts)
npx npkill -d ~/projects -t node_modules --older-than 90 -D -y
```

Si algún borrado falla, el modo sin interfaz lo escribe en la salida de error y termina con código 1.

## Cuándo conviene y cuándo no

Conviene cuando el disco se llena de proyectos antiguos, después de muchas pruebas con plantillas o tutoriales, o como limpieza periódica de la carpeta de proyectos.

No conviene lanzarlo desde la raíz del disco ni desde tu carpeta personal con `-f` sin revisar cada resultado. Tampoco aporta mucho si ya usas pnpm, que comparte un único almacén entre proyectos: ahí el ahorro principal suele venir de `pnpm store prune`.

## Alternativas

| Opción                                                       | Ventaja                                        | Inconveniente                              |
| ------------------------------------------------------------ | ---------------------------------------------- | ------------------------------------------ |
| npkill                                                       | Interactivo, con tamaño, antigüedad y perfiles | Requiere Node.js                           |
| `find . -name node_modules -type d -prune -exec rm -rf {} +` | Sin dependencias en Linux y macOS              | Borra todo sin mostrar tamaño ni preguntar |
| `pnpm store prune`                                           | Limpia el almacén global de pnpm               | Solo afecta a pnpm, no a otros proyectos   |

## Límites y precauciones

- **Sin papelera**: lo borrado no se recupera. Si dudas, usa `--dry-run` o revisa antes con `--json`.
- **Proyectos activos**: borrar su `node_modules` no rompe el código, pero tendrás que reinstalar dependencias con `npm install` o `pnpm install`.
- **Herramientas del sistema**: el propio README avisa de que algunas aplicaciones necesitan su `node_modules` para funcionar. npkill intenta marcarlas, pero según el README no decide qué es seguro borrar: los resultados se basan en convenciones.
- **Perfiles cambiantes**: los objetivos de cada perfil pueden cambiar entre versiones. Si dependes de una lista exacta, defínela en `.npkillrc` o usa `-t`.
- **Otros ecosistemas**: borrar `Library` de Unity obliga a reimportar todos los recursos (assets), y `.terraform` devuelve el espacio de trabajo (workspace) seleccionado a `default`, según la documentación de perfiles.
- **`npx` sin versión**: descarga la última publicada. Para un uso repetible, instala una versión concreta o usa `npx npkill@1.0.0`.

## Fuentes

- [Sitio oficial de npkill](https://npkill.js.org)
- [Repositorio voidcosmos/npkill](https://github.com/voidcosmos/npkill)
- [Documentación de perfiles](https://github.com/voidcosmos/npkill/blob/main/docs/profiles.md)
- [Release v1.0.0](https://github.com/voidcosmos/npkill/releases/tag/v1.0.0)
- [Paquete npkill en npm](https://www.npmjs.com/package/npkill)
