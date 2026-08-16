---
title: React Hook Form + Zod
description: Validar formularios de React Hook Form con schemas Zod mediante zodResolver, con tipos end-to-end.
category: frontend
tags: [react, forms, validation, zod, typescript]
technologies: [libraries/react-hook-form, libraries/zod]
related: [recipes/validated-form-react]
updatedAt: 2026-08-12
---

## Instalación

```bash
npm install react-hook-form zod @hookform/resolvers
```

## Conexión

El resolver traduce los errores de Zod al formato que React Hook Form entiende:

```tsx title="form.ts"
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const formSchema = z.object({
  email: z.string().email('Email no válido'),
  password: z.string().min(8, 'Mínimo 8 caracteres'),
});

type FormValues = z.infer<typeof formSchema>;

const form = useForm<FormValues>({
  resolver: zodResolver(formSchema),
  defaultValues: { email: '', password: '' },
});
```

## Particularidades

- **`defaultValues` debe ser completo**: con el resolver tipado, RHF exige todos los campos del input.
- **Inputs numéricos**: el DOM devuelve strings; usa `z.coerce.number()` en el schema.
- **Validación al vuelo**: `mode: 'onBlur'` u `'onTouched'` dan mejor UX que el default.
- Los mensajes de error salen del schema de Zod → `errors.campo.message` ya viene con tu texto.

Para una implementación completa lista para copiar, ver la receta **Formulario validado con tipos end-to-end**.
