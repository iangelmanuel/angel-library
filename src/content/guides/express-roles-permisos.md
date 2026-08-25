---
title: Roles y permisos
description: Del rol único por usuario a un modelo RBAC con permisos granulares — cuándo cada nivel de complejidad se justifica.
category: backend
stack: express
order: 15
tags: [express, rbac, authorization, permissions]
scope: modelado de autorización
related: [guides/express-auth-middleware]
updatedAt: 2026-08-16
---

El [middleware de autorización](/guides/express-auth-middleware) que chequea `req.user.rol === 'admin'` alcanza para casos simples — pero a medida que un sistema crece, "rol único" suele quedarse corto. Esta guía cubre los niveles siguientes, y cuándo realmente hacen falta.

## Nivel 1: rol único (lo más simple que funciona)

```ts
enum Rol {
  USER = 'user',
  ADMIN = 'admin',
}
```

Un campo `rol` en la tabla de usuarios, una comparación directa. Correcto para la mayoría de los proyectos chicos/medianos — no agregar complejidad que todavía no hace falta.

## Nivel 2: varios roles por usuario

Cuando un usuario puede tener más de un rol a la vez (por ejemplo, "editor" de un proyecto y "admin" de otro):

```prisma title="schema.prisma"
model User {
  id    String @id
  roles UserRole[]
}

model UserRole {
  id     String @id @default(cuid())
  userId String
  role   String  // "admin", "editor", etc.
  user   User    @relation(fields: [userId], references: [id])
}
```

```ts
function requireRole(...rolesPermitidos: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const tieneAlgunRol = req.user!.roles.some((r) => rolesPermitidos.includes(r));
    if (!tieneAlgunRol) return res.status(403).json({ error: 'No tienes permiso' });
    next();
  };
}
```

## Nivel 3: RBAC con permisos granulares

Cuando “el administrador puede hacer todo y el usuario puede hacer poco” ya no es suficiente —por ejemplo, un rol de moderación que puede editar publicaciones, pero no eliminar usuarios—, se separan **roles** —un nombre— y **permisos** —acciones concretas—. Un rol es un conjunto de permisos.

```ts title="lib/permisos.ts"
const PERMISOS_POR_ROL: Record<string, string[]> = {
  admin: ['usuarios:leer', 'usuarios:escribir', 'usuarios:eliminar', 'posts:leer', 'posts:escribir'],
  moderador: ['posts:leer', 'posts:escribir'],
  user: ['posts:leer'],
};

function requierePermiso(permiso: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    const permisosDelUsuario = PERMISOS_POR_ROL[req.user!.rol] ?? [];
    if (!permisosDelUsuario.includes(permiso)) {
      return res.status(403).json({ error: 'No tienes permiso' });
    }
    next();
  };
}
```

```ts
app.delete('/usuarios/:id', requireAuth, requierePermiso('usuarios:eliminar'), handler);
app.put('/posts/:id', requireAuth, requierePermiso('posts:escribir'), handler);
```

Este nivel permite agregar un rol nuevo ("moderador junior", lo que sea) definiendo qué permisos tiene, sin tocar el código de cada ruta protegida — las rutas siguen chequeando el mismo permiso (`'posts:escribir'`), solo cambia qué roles lo incluyen.

## Nivel 4: permisos por recurso específico (ownership)

Ni siquiera un permiso granular resuelve "un usuario puede editar **sus propios** posts, pero no los de otros" — eso no es un permiso de rol, es una comparación contra el dato específico:

```ts
app.put('/posts/:id', requireAuth, async (req, res) => {
  const post = await buscarPost(req.params.id);

  const esDueño = post.authorId === req.user!.id;
  const esAdmin = req.user!.rol === 'admin';

  if (!esDueño && !esAdmin) {
    return res.status(403).json({ error: 'No puedes editar este post' });
  }

  // ... actualizar el post ...
});
```

Este chequeo no puede ser un middleware genérico reusable de la misma forma que los anteriores — necesita cargar el recurso primero para saber quién es el dueño, así que típicamente vive dentro del handler o en un middleware que sabe específicamente qué recurso está protegiendo.

## Mapa de autorización

| Nivel | Cuándo alcanza |
| --- | --- |
| Rol único (`user.rol`) | Casos simples, dos o tres niveles de acceso |
| Varios roles por usuario | Un usuario necesita más de un "sombrero" a la vez |
| RBAC con permisos (`'recurso:accion'`) | Muchos roles, o roles que cambian seguido — agregar uno no toca las rutas |
| Ownership (dueño del recurso) | "Tus propios datos" — no es un permiso de rol, depende del dato puntual |

## Permisos por recurso y tenant

- Empezar por el nivel más simple que resuelve el problema real — RBAC con tabla de permisos para una app con dos roles fijos es complejidad sin beneficio.
- Los niveles no son excluyentes: un sistema real típicamente combina RBAC (¿este rol puede editar posts en general?) con ownership (¿es *su* post?) en la misma ruta.
