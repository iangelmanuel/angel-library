/** Utilidades para derivar ids y conservar el orden declarado en configuración. */
export function keysOf<const Values extends Record<string, unknown>>(
  values: Values
) {
  return Object.keys(values) as unknown as readonly [
    keyof Values & string,
    ...(keyof Values & string)[]
  ]
}

/** Añade la clave de cada registro como `id`, sin duplicarla en el dato. */
export function withIds<Id extends string, Value>(values: Record<Id, Value>) {
  const entries = Object.entries(values) as [Id, Value][]
  return Object.fromEntries(
    entries.map(([id, value]) => [id, { ...value, id }])
  ) as Record<Id, Value & { id: Id }>
}
