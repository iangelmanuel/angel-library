---
title: "Terminal y CLI: fundamentos y terminología"
description: Diferencias entre terminal, shell y CLI; argumentos, variables, procesos, streams, pipes, rutas y códigos de salida.
category: terminal
stack: terminal
tags: [terminal, shell, cli, procesos, fundamentos]
order: 1
updatedAt: 2026-08-19
---

La terminal permite interactuar con programas mediante texto, automatizar pasos y combinar herramientas pequeñas. Para usarla con seguridad conviene separar conceptos que suelen llamarse “terminal” como si fueran lo mismo.

## Terminal, shell y CLI

- **Terminal emulator:** ventana que muestra texto y transmite teclado, como Windows Terminal o iTerm2.
- **Shell:** programa que interpreta comandos, variables y operadores, como PowerShell, Bash o Zsh.
- **CLI:** *Command-Line Interface* o interfaz de línea de comandos que ofrece un programa, como `git`, `pnpm` o `docker`.
- **Prompt:** texto que indica que la shell está lista para recibir una orden.

La sintaxis de tuberías, variables y comillas pertenece a la shell. El significado de `git status` pertenece a la CLI de Git.

## Anatomía de un comando

```text
git commit --message "Explica el cambio" src/app.ts
│   │      │         │                  └ argumento posicional
│   │      │         └ valor de opción
│   │      └ opción o flag
│   └ subcomando
└ ejecutable
```

Un **flag** suele activar o desactivar una conducta; una opción puede recibir un valor. Cada programa define su propia gramática. `--help` y la documentación son preferibles a adivinar opciones destructivas.

## Rutas y directorio actual

Una ruta **absoluta** parte de la raíz o unidad. Una ruta **relativa** parte del directorio actual.

**CWD** significa *Current Working Directory* o directorio de trabajo actual. Muchos comandos leen y escriben en relación con él; por eso se confirma la ubicación antes de copiar, mover o eliminar.

`PATH` es una variable de entorno con directorios donde la shell busca ejecutables. Dos terminales pueden ejecutar versiones distintas si su `PATH` difiere.

## Comillas y expansión

Las comillas protegen espacios y caracteres especiales, pero su comportamiento cambia entre shells. En PowerShell, comillas dobles expanden variables y comillas simples suelen mantener texto literal:

```powershell
$projectName = 'library'
"Proyecto: $projectName" # Proyecto: library
'Proyecto: $projectName' # Proyecto: $projectName
```

En Bash la idea es parecida, pero la sintaxis de variables, rutas y escape no es idéntica. No se copia un comando complejo entre shells sin revisar sus reglas.

## Entrada, salida y errores

Los procesos suelen tener tres flujos estándar:

- **stdin**: *standard input*, entrada estándar.
- **stdout**: *standard output*, salida estándar.
- **stderr**: *standard error*, salida de errores.

Separar stdout y stderr permite guardar datos sin mezclar diagnósticos. Una **redirección** conecta un flujo con un archivo u otro destino; una **pipe** o tubería conecta la salida de un proceso con la entrada de otro.

```text
productor → stdout → pipe → stdin → consumidor
```

No todo programa acepta entrada por stdin ni produce un formato estable. Una tubería segura comprueba qué datos espera cada lado.

## Proceso, PID y señal

Un **proceso** es una instancia de un programa en ejecución. Su **PID** (*Process Identifier*) es el identificador asignado por el sistema operativo.

Una **señal** o evento de control solicita una acción como interrupción o terminación. El programa puede usarla para cerrar conexiones y guardar estado. Forzar la terminación evita ese cierre ordenado y se reserva para procesos que no responden.

## Código de salida

Al terminar, un proceso devuelve un **exit code** o código de salida. Por convención, `0` significa éxito y otro valor indica una condición distinta.

```powershell
pnpm test

if ($LASTEXITCODE -ne 0) {
  Write-Error 'Las pruebas fallaron; se detiene el flujo.'
  exit $LASTEXITCODE
}
```

La salida visual no reemplaza el código de salida en automatización. Un pipeline decide si continúa según ese valor.

## Variable de entorno

Una **variable de entorno** pertenece al ambiente del proceso y puede heredarse por procesos hijos. Se usa para configuración, rutas y credenciales, pero no cifra su contenido.

Los secretos pueden aparecer en historial, listado de procesos o registros si se pasan como argumentos. Se prefieren mecanismos de secretos del entorno de ejecución y se evita imprimirlos.

## TTY e interacción

**TTY** proviene de *teletypewriter* y hoy se refiere a una terminal interactiva o interfaz compatible. Algunos programas cambian color, progreso o preguntas si detectan un TTY.

Un comando para CI debe tener un modo no interactivo: no puede quedarse esperando una confirmación que nadie responderá.

## Comandos seguros y reproducibles

1. Confirma shell y sistema operativo.
2. Revisa CWD y resuelve rutas antes de acciones destructivas.
3. Prefiere opciones no interactivas en scripts.
4. Cita rutas con espacios y evita construir comandos con texto no confiable.
5. Comprueba código de salida y conserva stderr para diagnóstico.
6. Usa `--dry-run` cuando la herramienta lo ofrezca.
7. Ejecuta primero una versión de solo lectura que muestre los destinos.
