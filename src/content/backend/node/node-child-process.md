---
title: child_process — correr otros programas
description: spawn vs exec para ejecutar comandos externos desde Node, y cuándo conviene cada uno.
type: guides
order: 15
tags: [node, child_process]
scope: node:child_process
updatedAt: 2026-08-16
---

`child_process` deja ejecutar cualquier programa externo desde Node — un script de Python, `git`, un binario de conversión de imágenes, cualquier comando que correrías a mano en una terminal.

## `exec`: para comandos simples, con salida chica

```ts
import { exec } from 'node:child_process';

exec('git status', (error, stdout, stderr) => {
  if (error) {
    console.error('Falló:', error);
    return;
  }
  console.log(stdout);
});
```

`exec` acumula toda la salida en memoria y la entrega una sola vez al terminar. Es simple, pero inadecuado si el comando produce mucha salida o necesita mostrar progreso parcial.

## `spawn`: para procesos largos o con salida grande

```ts
import { spawn } from 'node:child_process';

const proceso = spawn('ping', ['google.com', '-c', '4']);

proceso.stdout.on('data', (data) => {
  console.log(`Salida: ${data}`);
});

proceso.stderr.on('data', (data) => {
  console.error(`Error: ${data}`);
});

proceso.on('close', (codigo) => {
  console.log(`Proceso terminó con código ${codigo}`);
});
```

`spawn` devuelve **streams** (`stdout`/`stderr` son Readable, ver [Streams](/backend/node/node-streams)) en vez de esperar a tener todo junto — se puede procesar la salida a medida que llega, y funciona bien para procesos de larga duración o que producen mucha salida.

## Diferencia clave: shell o no

```ts
exec('ls -la | grep node_modules', callback);   // exec SÍ pasa por una shell, soporta pipes/wildcards

spawn('ls', ['-la']);                             // spawn NO usa shell por defecto — sin pipes, sin expansión de *
spawn('ls', ['-la'], { shell: true });            // forzar shell si hace falta esa sintaxis
```

`exec` ejecuta el comando completo a través de una shell (`/bin/sh` o `cmd.exe`), lo que permite pipes (`|`), redirecciones (`>`) y comodines (`*`). Esa interpretación también permite **command injection** si se concatena entrada del usuario. `spawn` sin shell ejecuta el binario con un arreglo de argumentos y no interpreta esos caracteres especiales.

## `execFile`: como `exec` pero sin shell

```ts
import { execFile } from 'node:child_process';

execFile('node', ['--version'], (error, stdout) => {
  console.log(stdout);
});
```

Combina lo mejor de ambos para el caso común: API simple de callback (como `exec`) pero sin pasar por una shell (como `spawn`) — la opción más segura cuando no hace falta pipes/wildcards.

## Elegir entre `exec`, `spawn` y `fork`

| Función | Cuándo usarla |
| --- | --- |
| `exec` | Comandos simples, salida chica, necesitas pipes/wildcards de shell |
| `execFile` | Como `exec` pero sin shell — más seguro, sin sintaxis de pipes |
| `spawn` | Procesos largos, salida grande, streaming en tiempo real |

## Consideraciones — seguridad

- **Nunca** concatenar input de usuario en el string que recibe `exec()` — es la forma clásica de abrir un command injection (`exec(\`ls ${nombreDeArchivoDelUsuario}\`)` con un nombre malicioso tipo `"; rm -rf /"` es explotable). Si el input viene de afuera, usar `spawn`/`execFile` con argumentos como array separado, no un string armado a mano.
- Un proceso hijo que nunca emite `'close'` (colgado) deja el proceso padre esperando indefinidamente si algo depende de ese evento — vale la pena un timeout explícito para comandos que interactúan con sistemas externos poco confiables.
