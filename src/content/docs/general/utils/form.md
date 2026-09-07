---
title: Form Utils — Referencia rápida
description: Utilidades tipadas para leer, poblar y escuchar formularios HTML con FormData, sin librerías.
type: utilities
tags: [typescript, forms, validation]
runtime: browser
language: typescript
related:
  - general/utils/dom
  - general/packages/zod
updatedAt: 2026-09-07
---

Utilidades para formularios del navegador. Copia los bloques en `src/lib/form.ts` y usa imports relativos o un alias configurado. Los datos de `FormData` son strings o archivos: convertirlos en un objeto no valida el contrato.

Para un formulario simple sin campos repetidos, el one-liner de siempre alcanza:

```ts
const datos = Object.fromEntries(new FormData(form))
```

Pero se queda corto en varios casos: con `name` repetido (checkboxes, `<select multiple>`) solo te quedas con el último valor, los inputs `disabled` no aparecen en `FormData`, y los checkboxes marcados sin `value` explícito llegan como `"on"`. Las funciones de aquí cubren esos casos: campos repetidos, archivos y poblar un formulario desde datos existentes.

## Tipos

`FormValue` describe lo que puede salir de un campo de formulario: un string, un archivo, o un array de ambos cuando hay varios campos con el mismo `name` (checkboxes, `<select multiple>`, inputs de archivo múltiples).

```ts title="src/lib/form.ts"
export type FormValue = string | File | Array<string | File>
```

## Leer datos

### `formToObject()` — Formulario a objeto tipado

Convierte el formulario en un diccionario sin prototipo y agrupa los campos con `name` repetido. Una única selección produce un valor, varias producen un array; valida esa forma antes de convertirla a tu modelo de dominio.

```ts title="src/lib/form.ts"
export function formToObject(form: HTMLFormElement): Record<string, FormValue> {
  const data = new FormData(form)
  const result: Record<string, FormValue> = Object.create(null)

  for (const key of new Set(data.keys())) {
    const values = data.getAll(key)
    if (values.length) result[key] = values.length > 1 ? values : values[0]!
  }

  return result
}
```

```ts
import { formToObject } from "@/lib/form"

interface RegistroForm {
  email: string
  intereses: string[]
}

const form = document.querySelector("form")!
const datos = formToObject(form)
// Validar datos antes de tratarlos como RegistroForm.
```

### `getCheckedValues()` — Valores marcados de un grupo

Busca todos los checkboxes marcados con un `name` dado y retorna sus valores como array de strings, sin pasar por `FormData`. Es más directo que `formToObject` cuando solo necesitas ese grupo, y siempre retorna un array aunque haya un solo marcado o ninguno.

```ts title="src/lib/form.ts"
export function getCheckedValues(
  form: HTMLFormElement,
  name: string
): string[] {
  return Array.from(
    form.querySelectorAll<HTMLInputElement>('input[type="checkbox"]:checked:not(:disabled)')
  ).filter(input => input.name === name).map(input => input.value)
}
```

```ts
import { getCheckedValues } from "@/lib/form"

const intereses = getCheckedValues(form, "intereses")
// ["frontend", "backend"]
```

### `getFormFiles()` — Archivos de un campo

Extrae los archivos de un `input[type="file"]` a partir del `name`, filtrando la entrada vacía que el navegador incluye cuando no se seleccionó ningún archivo. Sirve tanto para inputs simples como para `multiple`.

```ts title="src/lib/form.ts"
export function getFormFiles(form: HTMLFormElement, name: string): File[] {
  const data = new FormData(form)
  return data
    .getAll(name)
    .filter((value): value is File => value instanceof File && value.name !== "")
}
```

```ts
import { getFormFiles } from "@/lib/form"

const archivos = getFormFiles(form, "adjuntos")
if (archivos.some(archivo => archivo.size > 5 * 1024 * 1024)) {
  // Rechazar archivos individuales mayores que 5 MiB; repetir la validación en servidor.
}
```

## Escribir datos

### `setFormValues()` — Poblar un formulario

Recorre un objeto de valores y los asigna a los campos del formulario que coincidan por `name`. Marca checkboxes y radios comparando el valor (o revisando si está incluido, cuando el valor es un array), y asigna `.value` para el resto de inputs, textarea y select. Útil para formularios de edición que arrancan con datos existentes.

```ts title="src/lib/form.ts"
export function setFormValues(
  form: HTMLFormElement,
  values: Record<string, unknown>
): void {
  for (const [name, value] of Object.entries(values)) {
    const fields = form.querySelectorAll<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >("input, textarea, select")

    fields.forEach((field) => {
      if (field.name !== name) return
      if (field instanceof HTMLInputElement && field.type === "file") return
      if (field instanceof HTMLSelectElement && field.multiple) {
        const selected = Array.isArray(value) ? value.map(String) : [String(value ?? "")]
        for (const option of field.options) option.selected = selected.includes(option.value)
        return
      }
      if (
        field instanceof HTMLInputElement &&
        (field.type === "checkbox" || field.type === "radio")
      ) {
        field.checked = Array.isArray(value)
          ? value.includes(field.value)
          : field.value === String(value)
      } else {
        field.value = value == null ? "" : String(value)
      }
    })
  }
}
```

```ts
import { setFormValues } from "@/lib/form"

setFormValues(form, {
  email: usuario.email,
  intereses: usuario.intereses, // ["frontend", "backend"]
  plan: usuario.plan // radio
})
```

## Eventos

### `onFormSubmit()` — Listener de submit tipado

Registra el `submit` de un formulario, previene el comportamiento por defecto y entrega los datos ya convertidos con `formToObject`. Retorna una función de limpieza, igual que `on()` en DOM Utils.

```ts title="src/lib/form.ts"
export function onFormSubmit(
  form: HTMLFormElement | null | undefined,
  handler: (data: Record<string, FormValue>, form: HTMLFormElement, event: SubmitEvent) => void
): () => void {
  if (!form) return () => {}

  const listener = (event: SubmitEvent) => {
    event.preventDefault()
    handler(formToObject(form), form, event)
  }

  form.addEventListener("submit", listener)
  return () => form.removeEventListener("submit", listener)
}
```

```ts
import { onFormSubmit } from "@/lib/form"

interface LoginForm {
  email: string
  password: string
}

const limpiar = onFormSubmit(form, (datos) => {
  console.log(datos.email)
})
```

## Resumen

| Función              | Qué hace                                                            |
| -------------------- | ------------------------------------------------------------------- |
| `formToObject()`     | Formulario a objeto, agrupando campos con `name` repetido en arrays |
| `getCheckedValues()` | Valores de un grupo de checkboxes marcados                          |
| `getFormFiles()`     | Archivos de un input file, sin la entrada vacía del navegador       |
| `setFormValues()`    | Poblar campos de un formulario desde un objeto                      |
| `onFormSubmit()`     | Listener de submit con `preventDefault` y datos ya parseados        |

## Consideraciones

- `formToObject()` no valida nada: los strings llegan tal cual, sin `trim` ni coerción de tipos. Para números, booleanos y validación real, combina con [Zod](/general/packages/zod) y `z.coerce`.
- Los inputs `disabled` no aparecen en `FormData` (los `readonly` sí) — ni `formToObject()` ni `getCheckedValues()` pueden verlos.
- Un checkbox marcado sin `value` explícito en el HTML llega como el string `"on"`. Ponle siempre `value` a los checkboxes que vayas a leer.
- `setFormValues()` solo asigna campos que existan en el formulario; claves del objeto sin campo correspondiente se ignoran silenciosamente.

## Comprobación

Prueba cero, uno y dos checkboxes del mismo nombre: `getCheckedValues` siempre devuelve un array; `formToObject` omite el campo sin selección, devuelve un valor con una selección y un array con varias. Por eso no debe prometer siempre `string[]` mediante un genérico.

Prueba también un archivo vacío con nombre (se conserva), un campo deshabilitado (se omite), un `select multiple` y un nombre que contenga comillas. `archivos.length` cuenta archivos; `archivo.size` mide bytes. `setFormValues` no dispara eventos `input`/`change` ni asigna archivos por programación.

El callback de `onFormSubmit` debe gestionar sus propios errores si inicia trabajo asíncrono; este helper no muestra mensajes ni espera promesas.

## Fuentes

- [MDN: FormData](https://developer.mozilla.org/en-US/docs/Web/API/FormData)
