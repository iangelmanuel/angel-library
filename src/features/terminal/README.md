# Terminal

La consola de la biblioteca. Se usa en dos sitios: la página `/search` y el
diálogo global de Ctrl/Cmd + K. Los dos montan el mismo componente.

```text
terminal/
├── components/     lo que se ve
├── hooks/          el estado, uno por tema
├── commands/       un archivo por familia de comandos
├── data/           textos largos (quiz, tips, dibujos)
├── parse.ts        funciones puras: leer el input, normalizar, elegir al azar
└── types.ts        tipos y constantes compartidas
```

## Añadir un comando

1. Elige el archivo de `commands/` según lo que haga: `sesion`, `navegacion`,
   `busqueda`, `aprendizaje`, `apariencia` o `secretos`.
2. Añade una entrada al mapa:

```ts
mio: {
  description: "lo que aparece al autocompletar",
  args: true,
  run: (ctx) => ctx.print(["hola"], "success")
}
```

3. Si lleva `description`, añade su nombre a `PUBLIC_COMMANDS` en
   `commands/index.ts`, en la posición que quieras dentro del autocompletado.
   Si te olvidas, el build falla avisando. Sin `description` queda oculto.

`ctx` es lo único que un comando puede tocar: está descrito en
`commands/types.ts`. Por defecto el prompt se vacía al terminar; usa
`keepInput: true` si el comando decide qué queda escrito.
