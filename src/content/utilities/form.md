---
title: Form Utils — Referencia rápida
description: Utilidades tipadas para leer, poblar y escuchar formularios HTML con FormData, sin librerías.
category: general
stack: utils
runtime: browser
language: typescript
related:
  - utilities/dom
  - libraries/zod
updatedAt: 2026-08-15
---

Utilidades mínimas para manejar formularios con Vanilla JS/TS. Importa siempre desde `@/lib/form`.

Para un formulario simple sin campos repetidos, el one-liner de siempre alcanza:

```ts
const datos = Object.fromEntries(new FormData(form));
```

Pero se queda corto en varios casos: con `name` repetido (checkboxes, `<select multiple>`) solo te quedas con el último valor, los inputs `disabled` no aparecen en `FormData`, y los checkboxes marcados sin `value` explícito llegan como `"on"`. Las funciones de aquí cubren esos casos: campos repetidos, archivos y poblar un formulario desde datos existentes.

## Tipos

`FormValue` describe lo que puede salir de un campo de formulario: un string, un archivo, o un array de ambos cuando hay varios campos con el mismo `name` (checkboxes, `<select multiple>`, inputs de archivo múltiples).

```ts title="lib/form.ts"
export type FormValue = string | File | Array<string | File>
```

## Leer datos

### `formToObject()` — Formulario a objeto tipado

Convierte un formulario en un objeto plano, igual que el one-liner con `Object.fromEntries`, pero agrupa automáticamente los campos con `name` repetido en un array en vez de quedarse solo con el último valor. El genérico `T` permite tipar el resultado según el formulario que estés leyendo.

```ts title="lib/form.ts"
export function formToObject<T extends Record<string, FormValue> = Record<string, FormValue>>(
  form: HTMLFormElement
): T {
  const data = new FormData(form)
  const result: Record<string, FormValue> = {}

  for (const key of new Set(data.keys())) {
    const values = data.getAll(key)
    result[key] = values.length > 1 ? values : values[0]
  }

  return result as T
}
```

```ts
import { formToObject } from '@/lib/form';

interface RegistroForm {
  email: string;
  intereses: string[];
}

const form = document.querySelector('form')!;
const datos = formToObject<RegistroForm>(form);
```

### `getCheckedValues()` — Valores marcados de un grupo

Busca todos los checkboxes marcados con un `name` dado y retorna sus valores como array de strings, sin pasar por `FormData`. Es más directo que `formToObject` cuando solo necesitas ese grupo, y siempre retorna un array aunque haya un solo marcado o ninguno.

```ts title="lib/form.ts"
export function getCheckedValues(form: HTMLFormElement, name: string): string[] {
  return Array.from(
    form.querySelectorAll<HTMLInputElement>(`input[name="${name}"]:checked`)
  ).map((input) => input.value)
}
```

```ts
import { getCheckedValues } from '@/lib/form';

const intereses = getCheckedValues(form, 'intereses');
// ["frontend", "backend"]
```

### `getFormFiles()` — Archivos de un campo

Extrae los archivos de un `input[type="file"]` a partir del `name`, filtrando la entrada vacía que el navegador incluye cuando no se seleccionó ningún archivo. Sirve tanto para inputs simples como para `multiple`.

```ts title="lib/form.ts"
export function getFormFiles(form: HTMLFormElement, name: string): File[] {
  const data = new FormData(form)
  return data
    .getAll(name)
    .filter((value): value is File => value instanceof File && value.size > 0)
}
```

```ts
import { getFormFiles } from '@/lib/form';

const archivos = getFormFiles(form, 'adjuntos');
if (archivos.length > 5 * 1024 * 1024) {
  // validar tamaño, etc.
}
```

## Escribir datos

### `setFormValues()` — Poblar un formulario

Recorre un objeto de valores y los asigna a los campos del formulario que coincidan por `name`. Marca checkboxes y radios comparando el valor (o revisando si está incluido, cuando el valor es un array), y asigna `.value` para el resto de inputs, textarea y select. Útil para formularios de edición que arrancan con datos existentes.

```ts title="lib/form.ts"
export function setFormValues(form: HTMLFormElement, values: Record<string, unknown>): void {
  for (const [name, value] of Object.entries(values)) {
    const fields = form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(
      `[name="${name}"]`
    )

    fields.forEach((field) => {
      if (field instanceof HTMLInputElement && (field.type === 'checkbox' || field.type === 'radio')) {
        field.checked = Array.isArray(value) ? value.includes(field.value) : field.value === String(value)
      } else {
        field.value = value == null ? '' : String(value)
      }
    })
  }
}
```

```ts
import { setFormValues } from '@/lib/form';

setFormValues(form, {
  email: usuario.email,
  intereses: usuario.intereses, // ["frontend", "backend"]
  plan: usuario.plan, // radio
});
```

## Eventos

### `onFormSubmit()` — Listener de submit tipado

Registra el `submit` de un formulario, previene el comportamiento por defecto y entrega los datos ya convertidos con `formToObject`. Retorna una función de limpieza, igual que `on()` en DOM Utils.

```ts title="lib/form.ts"
export function onFormSubmit<T extends Record<string, FormValue> = Record<string, FormValue>>(
  form: HTMLFormElement | null | undefined,
  handler: (data: T, form: HTMLFormElement, event: SubmitEvent) => void
): () => void {
  if (!form) return () => {}

  const listener = (event: SubmitEvent) => {
    event.preventDefault()
    handler(formToObject<T>(form), form, event)
  }

  form.addEventListener('submit', listener)
  return () => form.removeEventListener('submit', listener)
}
```

```ts
import { onFormSubmit } from '@/lib/form';

interface LoginForm {
  email: string;
  password: string;
}

const limpiar = onFormSubmit<LoginForm>(form, (datos) => {
  console.log(datos.email);
});
```

## Resumen

| Función | Qué hace |
| --- | --- |
| `formToObject()` | Formulario a objeto, agrupando campos con `name` repetido en arrays |
| `getCheckedValues()` | Valores de un grupo de checkboxes marcados |
| `getFormFiles()` | Archivos de un input file, sin la entrada vacía del navegador |
| `setFormValues()` | Poblar campos de un formulario desde un objeto |
| `onFormSubmit()` | Listener de submit con `preventDefault` y datos ya parseados |

## Consideraciones

- `formToObject()` no valida nada: los strings llegan tal cual, sin `trim` ni coerción de tipos. Para números, booleanos y validación real, combina con [Zod](/libraries/zod) y `z.coerce`.
- Los inputs `disabled` no aparecen en `FormData` (los `readonly` sí) — ni `formToObject()` ni `getCheckedValues()` pueden verlos.
- Un checkbox marcado sin `value` explícito en el HTML llega como el string `"on"`. Ponle siempre `value` a los checkboxes que vayas a leer.
- `setFormValues()` solo asigna campos que existan en el formulario; claves del objeto sin campo correspondiente se ignoran silenciosamente.
