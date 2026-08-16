---
title: Dialog reutilizable con shadcn/ui
description: Referencia rápida para adaptar un Dialog accesible basado en Radix dentro de una aplicación React.
category: ui-ux
framework: React
dependencies:
  - technologies/react
related:
  - technologies/react
updatedAt: 2026-08-15
---

## Qué conservar

- `DialogTitle` y `DialogDescription` para accesibilidad.
- Cierre mediante `Escape` y click en overlay.
- Estado controlado solamente cuando el flujo lo necesita.
- Focus management proporcionado por Radix.

## Uso mínimo

```tsx
<Dialog>
  <DialogTrigger asChild>
    <Button>Editar perfil</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Editar perfil</DialogTitle>
      <DialogDescription>Actualiza tus datos públicos.</DialogDescription>
    </DialogHeader>
    <ProfileForm />
  </DialogContent>
</Dialog>
```

No copies toda la documentación de Radix aquí: esta entrada solo conserva las decisiones y el patrón que reutilizo.
