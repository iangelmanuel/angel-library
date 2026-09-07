---
title: React Hook Form
description: Formularios performantes en React con mínimos re-renders. Instalación, uso básico y patrones que uso.
type: libraries
order: 5
tags: [react, forms, typescript]
website: https://react-hook-form.com
github: https://github.com/react-hook-form/react-hook-form
install: npm install react-hook-form
related: [general/packages/zod]
updatedAt: 2026-08-25
---

React Hook Form evita el problema clásico de un formulario controlado con `useState` por campo: cada tecla vuelve a renderizar el componente completo. RHF registra los inputs de forma no controlada —mediante refs— y actualiza únicamente lo necesario. Un formulario puede tener decenas de campos sin que escribir en uno obligue a renderizar los demás.

## Uso básico

```tsx title="LoginForm.tsx"
import { useForm } from "react-hook-form"

interface FormValues {
  email: string
  password: string
}

export function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<FormValues>()

  const onSubmit = async (data: FormValues) => {
    // data ya validado
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        type="email"
        {...register("email", { required: "El email es obligatorio" })}
      />
      {errors.email && <p>{errors.email.message}</p>}

      <input
        type="password"
        {...register("password", { required: true, minLength: 8 })}
      />

      <button disabled={isSubmitting}>Entrar</button>
    </form>
  )
}
```

## Cuándo uso qué

- `register` → inputs nativos controlados por RHF (caso por defecto).
- `Controller` → componentes controlados de terceros (selects, date pickers, inputs de librerías UI).
- `watch` → solo cuando necesito reaccionar a un valor en el render. Para lógica de submit no hace falta.
- `setError` → errores del servidor (p. ej. "email ya registrado").

## Tips

- `defaultValues` define la forma inicial; con un resolver tipado debe ser completo.
- `formState.isDirty` para habilitar "guardar" solo si hubo cambios.
- `reset(data)` tras un submit exitoso para sincronizar el estado inicial.

## Errores comunes

- Duplicar el `name` en dos inputs → valores pisados.
- Usar `watch()` en la raíz y re-renderizar toda la vista en cada tecla. Mejor `useWatch` con un `name` específico.
