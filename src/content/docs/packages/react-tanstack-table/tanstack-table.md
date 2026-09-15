---
title: TanStack Table
description: Tablas headless para React — ordenar, filtrar, paginar y seleccionar filas con la lógica resuelta y el marcado completamente tuyo.
tags: [react, typescript, tablas, datagrid, headless]
sidebar:
  order: 1
draft: false
resourceCategory: Documentación del paquete
website: https://tanstack.com/table
github: https://github.com/TanStack/table
technologies: [packages/react-tanstack-query/tanstack-query]
note: "Los ejemplos son de la v9, la versión mayor actual, con `@tanstack/react-table`. Los row models se importan uno a uno: lo que no se registra, no funciona."
updatedAt: 2026-09-14
---

Una tabla de datos es siempre el mismo trabajo repetido: ordenar por columna, filtrar, paginar, marcar filas. TanStack Table resuelve esa lógica y **no renderiza nada**: es headless, devuelve el estado calculado y tú escribes el `<table>` (o divs, o lo que sea) con tus propias clases. Por eso conviene junto a un sistema de componentes propio, donde una tabla "con estilos incluidos" estorba.

El core es agnóstico del framework; hay adaptadores para React, Vue, Solid, Svelte, Angular, Lit y más. La versión mayor actual es la v9 y la licencia es MIT.

## Instalación

```bash
pnpm add @tanstack/react-table
```

## Definir columnas

`createColumnHelper` da tipado de extremo a extremo: `accessorKey` se valida contra el tipo de la fila y `cell` recibe el valor ya tipado.

```tsx title="components/columnas.ts"
import { createColumnHelper } from "@tanstack/react-table"

type Usuario = {
  id: string
  nombre: string
  correo: string
  activo: boolean
}

const columnHelper = createColumnHelper<Usuario>()

export const columnas = [
  columnHelper.accessor("nombre", {
    header: "Nombre"
  }),
  columnHelper.accessor("correo", {
    header: "Correo",
    cell: (info) => <code>{info.getValue()}</code>
  }),
  columnHelper.accessor("activo", {
    header: "Estado",
    cell: (info) => (info.getValue() ? "Activo" : "Inactivo")
  })
]
```

## La tabla mínima

`useReactTable` recibe datos, columnas y los *row models* de las funciones que quieras activar. Sin `getSortedRowModel` no hay ordenamiento: cada capacidad se importa, y lo que no se importa no entra al bundle.

```tsx title="components/TablaUsuarios.tsx"
import {
  flexRender,
  getCoreRowModel,
  useReactTable
} from "@tanstack/react-table"
import { columnas } from "./columnas"

export function TablaUsuarios({ datos }: { datos: Usuario[] }) {
  const table = useReactTable({
    data: datos,
    columns: columnas,
    getCoreRowModel: getCoreRowModel()
  })

  return (
    <table>
      <thead>
        {table.getHeaderGroups().map((grupo) => (
          <tr key={grupo.id}>
            {grupo.headers.map((header) => (
              <th key={header.id}>
                {flexRender(
                  header.column.columnDef.header,
                  header.getContext()
                )}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row) => (
          <tr key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <td key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
```

`flexRender` existe porque `header` y `cell` pueden ser texto, función o componente: resuelve las tres formas sin `if`.

**Importante:** `data` y `columns` deben ser referencias estables. Si defines el array de datos dentro del componente, envuélvelo en `useMemo` o la tabla se recalcula en cada render.

## Ordenar, filtrar y paginar

```tsx
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from "@tanstack/react-table"

const table = useReactTable({
  data,
  columns,
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  initialState: { pagination: { pageSize: 20 } }
})
```

El estado vive dentro de la tabla, y los controles son los que tú dibujes:

```tsx
<th onClick={header.column.getToggleSortingHandler()}>
  {flexRender(header.column.columnDef.header, header.getContext())}
  {{ asc: " ↑", desc: " ↓" }[header.column.getIsSorted() as string] ?? ""}
</th>

<button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
  Anterior
</button>
<span>
  {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
</span>
<button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
  Siguiente
</button>
```

## Estado controlado desde fuera

Cuando el filtro o el orden deben vivir en la URL o en un store, pásalos como estado controlado — igual que un `<input>`:

```tsx
const [sorting, setSorting] = useState<SortingState>([])

const table = useReactTable({
  data,
  columns,
  state: { sorting },
  onSortingChange: setSorting,
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel()
})
```

Ese mismo estado se puede sincronizar con la URL usando [nuqs](/packages/react-nuqs/nuqs).

## API en una mirada

| Pieza                             | Para qué                                                     |
| --------------------------------- | ------------------------------------------------------------ |
| `useReactTable(options)`          | Crea la instancia; devuelve el estado calculado              |
| `createColumnHelper<T>()`         | Definir columnas con tipado del modelo de fila               |
| `getCoreRowModel()`               | Obligatorio: filas sin transformar                           |
| `getSortedRowModel()`             | Activa ordenamiento en cliente                               |
| `getFilteredRowModel()`           | Activa filtros por columna y globales                        |
| `getPaginationRowModel()`         | Activa paginación en cliente                                 |
| `flexRender(def, ctx)`            | Renderiza header/cell sea texto, función o componente        |
| `manualPagination` / `manualSorting` | Delegar ese trabajo al servidor                           |

## Cliente o servidor

Los `RowModel` anteriores trabajan **en memoria**: sirven hasta unos pocos miles de filas. Con más datos, o cuando la fuente es una API paginada, activa `manualPagination`, `manualSorting` y `manualFiltering`, pasa `pageCount`/`rowCount` y haz que el fetch dependa del estado de la tabla — ahí encaja bien con [TanStack Query](/packages/react-tanstack-query/tanstack-query).

Para listas muy largas, TanStack Table no virtualiza por su cuenta: eso lo hace TanStack Virtual, que es un paquete aparte.
