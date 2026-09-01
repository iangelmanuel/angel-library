---
title: Command
description: Encapsular una acción, con todo lo necesario para ejecutarla, como un objeto que se puede guardar, encolar o deshacer.
type: patterns
order: 10
tags: [arquitectura, patrones-diseno, command]
problem: Un sistema de undo/redo o una cola de jobs necesita tratar cada acción como un dato manipulable, no como una llamada de función que ya pasó.
updatedAt: 2026-08-17
---

## Problema

Ejecutar una acción directo (`editor.insertar(texto)`) funciona hasta que necesitas algo más: deshacerla, encolarla para después, o loguearla con lo que la generó. Command convierte la acción en un objeto — con un método para ejecutarla y, si aplica, uno para deshacerla — para poder guardarlo, pasarlo, o guardarlo en una lista.

## Ejemplo: undo/redo en un editor

```ts title="lib/editor/commands.ts"
interface Command {
  execute(): void;
  undo(): void;
}

function createAddTextCommand(editor: Editor, texto: string, posicion: number): Command {
  return {
    execute: () => editor.insertar(texto, posicion),
    undo: () => editor.eliminar(posicion, texto.length),
  };
}
```

```ts title="lib/editor/history.ts"
class HistorialComandos {
  private hechos: Command[] = [];
  private deshechos: Command[] = [];

  ejecutar(comando: Command) {
    comando.execute();
    this.hechos.push(comando);
    this.deshechos = [];
  }

  deshacer() {
    const comando = this.hechos.pop();
    if (!comando) return;
    comando.undo();
    this.deshechos.push(comando);
  }

  rehacer() {
    const comando = this.deshechos.pop();
    if (!comando) return;
    comando.execute();
    this.hechos.push(comando);
  }
}
```

El historial no sabe qué hace cada comando por dentro — solo sabe que puede `execute()` y `undo()`. Ctrl+Z funciona igual sin importar qué tipo de acción se deshace.

## Ejemplo: cola de jobs

```ts title="lib/jobs/send-email-job.ts"
interface Job<T = unknown> {
  type: string;
  payload: T;
}

function encolarEnvioEmail(
  destinatario: string,
  plantilla: string,
): Job<{ destinatario: string; plantilla: string }> {
  return { type: 'send-email', payload: { destinatario, plantilla } };
}

// El worker, en otro proceso, deserializa el job y lo ejecuta:
async function procesarJob(job: Job) {
  if (job.type === 'send-email') {
    const { destinatario, plantilla } = job.payload as { destinatario: string; plantilla: string };
    await enviarEmail(destinatario, plantilla);
  }
}
```

Aquí el “comando” ni siquiera tiene un método `execute()`: es un objeto de datos serializable que un worker sabe interpretar. La idea es la misma: la acción y sus datos viajan juntos, separados de la ejecución.

## Cuándo NO usarlo

Si la acción se ejecuta una sola vez, directamente — y nunca necesita deshacerse, encolarse ni loguearse por separado — llamar la función directo es más simple. Envolver todo en objetos `Command` agrega una capa que solo se justifica cuando necesitas esa indirección real: undo/redo, colas de trabajo, auditoría de qué se ejecutó y cuándo.
