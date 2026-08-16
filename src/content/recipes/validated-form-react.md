---
title: Formulario validado con tipos end-to-end
description: Receta completa de un formulario React con validación Zod, errores por campo y estado de envío.
category: frontend
tags: [react, forms, validation, typescript]
problem: Necesito un formulario con validación declarativa, mensajes por campo y tipos compartidos entre schema y componente.
technologies: [libraries/react-hook-form, libraries/zod]
related: [integrations/react-hook-form-zod]
updatedAt: 2026-08-12
---

## Pasos

1. Definir el schema Zod (única fuente de verdad).
2. Crear el formulario con `zodResolver`.
3. Renderizar campos y mensajes de error.
4. Manejar el submit con `isSubmitting`.

## Código

```tsx title="ContactForm.tsx"
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().min(2, 'Cuéntame al menos tu nombre'),
  email: z.string().email('Email no válido'),
  message: z.string().min(10, 'El mensaje es muy corto'),
});

type ContactValues = z.infer<typeof contactSchema>;

export function ContactForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
    reset,
  } = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: '', email: '', message: '' },
    mode: 'onBlur',
  });

  async function onSubmit(values: ContactValues) {
    await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    });
    reset();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div>
        <label htmlFor="name">Nombre</label>
        <input id="name" {...register('name')} />
        {errors.name && <p role="alert">{errors.name.message}</p>}
      </div>

      <div>
        <label htmlFor="email">Email</label>
        <input id="email" type="email" {...register('email')} />
        {errors.email && <p role="alert">{errors.email.message}</p>}
      </div>

      <div>
        <label htmlFor="message">Mensaje</label>
        <textarea id="message" rows={4} {...register('message')} />
        {errors.message && <p role="alert">{errors.message.message}</p>}
      </div>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Enviando…' : 'Enviar'}
      </button>

      {isSubmitSuccessful && <p>Recibido. Te respondo pronto.</p>}
    </form>
  );
}
```

## Consideraciones

- `noValidate` en el form: la validación la lleva Zod, no el navegador (mensajes coherentes).
- `role="alert"` en los errores para que los lectores de pantalla los anuncien.
- Si el servidor también valida (debería), reutiliza el mismo schema en el backend.
