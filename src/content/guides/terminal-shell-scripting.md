---
title: Shell scripting seguro y portable
description: Escribir scripts pequeños con argumentos, códigos de salida, quoting, errores y limpieza sin depender de comandos pegados a ciegas.
category: terminal
stack: terminal
order: 13
tags: [terminal, shell, scripting, bash, powershell]
related:
  - guides/terminal-pipes-redirection-processes
  - guides/terminal-variables-entorno
  - guides/terminal-powershell
updatedAt: 2026-08-25
---

Un script de shell convierte una secuencia repetible en una herramienta versionada. Es apropiado para orquestar CLIs; cuando la lógica necesita estructuras complejas, parsing robusto o compatibilidad amplia, un lenguaje general puede ser más claro.

## Bash mínimo

```bash title="scripts/check.sh"
#!/usr/bin/env bash
set -Eeuo pipefail

project_dir="${1:-.}"

if [[ ! -f "$project_dir/package.json" ]]; then
  echo "No se encontró package.json" >&2
  exit 2
fi

pnpm --dir "$project_dir" check
```

- `-e`: termina ante un comando fallido;
- `-u`: falla con variables no definidas;
- `pipefail`: una tubería falla si falla cualquiera de sus comandos;
- comillas dobles: evitan que espacios dividan una ruta.

Estas opciones ayudan, pero no reemplazan manejar fallos esperados con `if`.

## PowerShell equivalente

```powershell title="scripts/check.ps1"
param([string]$ProjectDir = ".")
$ErrorActionPreference = "Stop"

$manifest = Join-Path $ProjectDir "package.json"
if (-not (Test-Path -LiteralPath $manifest)) {
  Write-Error "No se encontró package.json"
  exit 2
}

pnpm --dir $ProjectDir check
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
```

Una excepción de PowerShell y un ejecutable que devuelve exit code no son lo mismo. Comprueba `$LASTEXITCODE` al invocar CLIs externas.

## Argumentos y seguridad

No construyas un string de shell concatenando entrada externa. Pasa argumentos como valores cuando la API lo permita. Evita `eval`, rutas calculadas para borrar y globs sobre directorios desconocidos.

```text
leer input → validar allowlist/formato → resolver ruta → comprobar alcance → ejecutar
```

## Archivos temporales y limpieza

Usa utilidades del sistema para crear nombres únicos y registra una limpieza con `trap` en Bash o `try/finally` en PowerShell. No reutilices una ruta global predecible.

## Scripts como producto pequeño

Incluye `--help`, ejemplos, códigos de salida documentados y modo dry-run para efectos importantes. Ejecuta ShellCheck para Bash cuando esté disponible y prueba rutas con espacios, input ausente y comandos que fallan.

## Regla portable

No mezcles sintaxis de shells en el mismo bloque. Documenta qué shell interpreta el archivo y qué comandos externos necesita.
