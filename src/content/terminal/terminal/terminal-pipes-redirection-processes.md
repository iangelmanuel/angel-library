---
title: Pipes, redirección, códigos de salida y procesos
description: Componer comandos sin perder errores mediante stdin, stdout, stderr, redirecciones y señales en shells tipo Unix y PowerShell.
type: guides
order: 5
tags: [terminal, shell, pipes, redirection, processes]
related:
  - terminal/terminal/terminal-fundamentals-terminology
updatedAt: 2026-08-19
---

Un proceso suele tener tres flujos: **stdin** para entrada, **stdout** para salida normal y **stderr** para diagnósticos. Una **pipe** conecta la salida de un comando con la entrada del siguiente.

```bash
git log --oneline | rg "security"
```

```powershell
Get-Process | Where-Object CPU -gt 10 | Sort-Object CPU -Descending
```

PowerShell transmite objetos entre cmdlets; shells como Bash transmiten bytes o texto. Al invocar programas externos desde PowerShell, su salida vuelve a ser texto.

## Redirección

```bash
command > output.txt       # reemplaza stdout
command >> output.txt      # agrega stdout
command 2> errors.txt      # redirige stderr
command > all.txt 2>&1     # combina ambos, el orden importa
```

```powershell
command *> all.txt
```

Antes de usar `>`, verifica que el archivo pueda sobrescribirse. Para logs de producción, prefiere el sistema de logging y rotación de la plataforma.

## Código de salida

Por convención, `0` indica éxito y otro valor indica fallo. La automatización debe comprobarlo:

```bash
pnpm test && pnpm build
```

El segundo comando solo se ejecuta si el primero termina correctamente. Una pipe puede ocultar el fallo de un comando anterior según el shell; en Bash, `set -o pipefail` hace que la tubería refleje el error.

## Procesos y señales

`Ctrl+C` envía una interrupción. Un servidor debe manejar el cierre para dejar de aceptar tráfico, terminar solicitudes, cerrar conexiones y salir dentro del límite del orquestador.

```ts
process.on("SIGTERM", async () => {
  server.close()
  await database.end()
})
```

No mates un proceso por PID sin comprobar qué ejecutable y usuario representa; los identificadores pueden reutilizarse.

## Datos seguros

No pases secretos en argumentos si pueden aparecer en historial o lista de procesos. Usa entrada segura, archivos con permisos limitados o gestores de secretos. Cita rutas y variables para evitar expansión accidental.
