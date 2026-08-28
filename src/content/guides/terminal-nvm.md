---
title: "nvm: manejar versiones de Node"
description: Instalar y cambiar entre versiones de Node.js con nvm — y por qué en Windows es un proyecto distinto (nvm-windows).
category: applications
stack: apps-cli
order: 3
tags: [terminal, nvm, node, herramientas]
scope: nvm
website: https://github.com/nvm-sh/nvm
related: [guides/terminal-npm, guides/terminal-pnpm, guides/terminal-bun]
updatedAt: 2026-08-28
---

## Por qué nvm

Distintos proyectos pueden necesitar versiones diferentes de Node: uno antiguo que solo funciona bien en Node 18 y otro que ya usa características de Node 22. Instalar Node manualmente deja una sola versión global; nvm (Node Version Manager) permite mantener varias en paralelo y cambiar de una a otra por proyecto sin reinstalar nada.

**NVM** significa *Node Version Manager*. No administra dependencias del proyecto y no reemplaza a npm, pnpm o Bun: decide qué instalación de Node.js queda activa en la shell y, con ella, qué versión de npm y qué herramientas globales están disponibles.

## Dos proyectos distintos con el mismo nombre

Esto genera confusión seguido:

| | macOS / Linux | Windows |
|---|---|---|
| Proyecto | [nvm-sh/nvm](https://github.com/nvm-sh/nvm) | [coreybutler/nvm-windows](https://github.com/coreybutler/nvm-windows) |
| Instalación | Script vía `curl` | Instalador `.exe` |
| Mantenido por | nvm-sh | Corey Butler |

No es el mismo software con dos instaladores — son dos implementaciones separadas, con comandos similares pero no idénticos, y **no son compatibles entre sí** (los archivos que usa uno no los entiende el otro).

## Instalación en macOS / Linux

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.6/install.sh | bash
```

El script clona el repo en `~/.nvm` y agrega las líneas necesarias a `.bashrc` / `.zshrc` (ver [bash y zsh](/guides/terminal-linux-cli)). Después de instalar, cerrar y volver a abrir la terminal (o `source ~/.zshrc`).

Verifica con `command -v`, porque `nvm` es una función cargada por la shell y no un ejecutable independiente; `which nvm` puede no encontrarla aunque funcione correctamente:

```bash
command -v nvm
```

El proyecto oficial no recomienda instalar `nvm-sh/nvm` mediante Homebrew. Usa su script versionado y revisa la versión indicada en el repositorio antes de copiarlo en el futuro.

## Instalación en Windows (nvm-windows)

Descargar `nvm-setup.exe` desde las [releases de coreybutler/nvm-windows](https://github.com/coreybutler/nvm-windows/releases) y correr el instalador. No usa el mismo script de `curl` que macOS/Linux — es un instalador gráfico normal de Windows.

Antes de instalar nvm-windows, desinstala una instalación previa de Node.js siempre que sea posible. Si ambas administran `C:\Program Files\nodejs` o existen varias entradas en `PATH`, `node --version` puede resolver un ejecutable distinto del elegido por `nvm use`. Abre una terminal nueva después del instalador.

```powershell
nvm version
nvm debug
```

## Comandos básicos

| Comando | macOS / Linux (nvm) | Windows (nvm-windows) |
|---|---|---|
| Instalar LTS reciente | `nvm install --lts` | `nvm install lts` |
| Instalar una versión | `nvm install 22` | `nvm install 22.0.0` |
| Usar una versión | `nvm use 22` | `nvm use 22.0.0` |
| Listar instaladas | `nvm list` | `nvm list` |
| Listar disponibles | `nvm list-remote` | `nvm list available` |
| Versión por default | `nvm alias default 22` | Automático: `nvm use` sin argumento aplica la última usada; no hay `alias default` |
| Desinstalar una versión | `nvm uninstall 22` | `nvm uninstall 22.0.0` |

## Ejemplo típico

```bash
nvm install 22
nvm use 22
node --version
npm --version
```

## Fijar la versión por proyecto

Crea `.nvmrc` en la raíz y confirma el archivo en Git:

```text title=".nvmrc"
22
```

En macOS, Linux o WSL, entra al proyecto y ejecuta:

```bash
nvm install
nvm use
```

Ambos comandos buscan `.nvmrc`. El primero garantiza que la versión exista y el segundo la activa en la shell actual. nvm-windows no interpreta `.nvmrc` de la misma manera; allí puedes leer el valor manualmente o usar una herramienta multiplataforma si la automatización es un requisito.

## Autenticación

NVM no tiene cuentas ni requiere iniciar sesión. Descarga distribuciones de Node.js desde sus servidores configurados. En una red corporativa puede necesitar proxy o mirror, pero nunca debes desactivar la validación TLS como solución permanente.

## Consideraciones

- En macOS/Linux, `nvm use` solo aplica a la terminal actual — si el proyecto necesita una versión fija siempre, un archivo `.nvmrc` con el número de versión permite correr `nvm use` sin argumentos dentro de esa carpeta.
- nvm-windows requiere ejecutar `nvm use` (o similar) como administrador en algunas configuraciones, porque cambia symlinks del sistema — algo que nvm en macOS/Linux no necesita.
- Instalar Node por fuera de nvm (con el instalador oficial, o con Chocolatey/Scoop) y usar nvm al mismo tiempo suele generar conflictos de `PATH` — conviene elegir uno de los dos caminos.
- Los paquetes instalados globalmente pertenecen a una versión de Node concreta. Después de cambiar de versión quizá debas reinstalar CLIs globales o, preferiblemente, ejecutarlas como dependencias del proyecto.
- Si `nvm use` parece funcionar pero `node --version` no cambia, consulta `where.exe node` en Windows o `command -v node` en sistemas POSIX para localizar el ejecutable que gana en `PATH`.
