---
title: Arquitectura en capas (Layered)
description: Organizar una app en capas horizontales donde cada una solo habla con la de abajo, sin saltos ni atajos.
category: architecture
stack: patrones-arquitectonicos
order: 2
tags: [arquitectura, patrones-arquitectonicos, layered, n-tier]
problem: Sin capas explícitas, cualquier parte del código termina llamando a cualquier otra — HTTP mezclado con SQL, UI mezclada con reglas de negocio.
related: [patterns/mvc-overview, patterns/repository-pattern]
updatedAt: 2026-08-17
---

## Las capas típicas directamente app web

```text
┌─────────────────────────────┐
│  Presentación (HTTP / API)  │  routes, controllers
├─────────────────────────────┤
│  Aplicación / Negocio       │  services, casos de uso
├─────────────────────────────┤
│  Acceso a datos             │  repositories
├─────────────────────────────┤
│  Base de datos               │
└─────────────────────────────┘
```

La regla central: **cada capa solo puede hablar con la capa inmediatamente debajo**. Presentación no le habla directo a la base de datos. Nunca se salta una capa, aunque "sea más rápido" en el momento.

## Layered vs. MVC

Son cosas distintas que se confunden seguido. Layered architecture es un principio general de organización en niveles horizontales — aplica a cualquier tipo de app. MVC es una forma específica de organizar la capa de presentación + control (y a veces también el model). En la práctica, un backend con estructura MVC (ver [MVC overview](/patterns/mvc-overview)) es un caso particular de arquitectura en capas: controller = presentación, service = aplicación/negocio, repository = acceso a datos.

## La regla que más se rompe

```ts title="ejemplo de lo que NO hacer"
// controller saltándose la capa de servicio
app.get('/users/:id', async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.params.id } });
  res.json(user);
});
```

Funciona hoy. Duele después:

- **Cambiar de ORM o de base de datos** significa buscar y tocar cada controller que hace queries directo, en vez de cambiar una sola capa de acceso a datos.
- **Testear el controller sin una base de datos real** se vuelve imposible — no hay forma de inyectar un repositorio falso porque no hay repositorio, hay una llamada a Prisma incrustada.
- **Agregar una regla de negocio** (validar algo antes de devolver el user, por ejemplo) no tiene un lugar claro donde vivir — o se mete en el controller o se duplica en cada endpoint que necesite lo mismo.

La versión correcta pasa por un service intermedio:

```ts title="ejemplo correcto"
app.get('/users/:id', async (req, res) => {
  const user = await userService.getById(req.params.id);
  res.json(user);
});
```

El controller ya no sabe que existe Prisma. Ese conocimiento vive en una sola capa, reemplazable sin tocar el resto.
