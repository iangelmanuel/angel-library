---
title: Autenticación, sesiones y control de acceso
description: Proteger identidad y recursos evitando sesiones robadas, enumeración, escalada de privilegios e IDOR.
type: guides
order: 3
tags: [security, authentication, authorization, sessions]
scope: identidad y permisos
related:
  - security/security-fundamentos/security-threat-modeling
  - security/security-testing/web-security-checklist
updatedAt: 2026-08-18
---

## Autenticar no autoriza

La sesión responde quién es la persona. Cada operación todavía debe comprobar si puede actuar sobre ese recurso. Nunca confíes en `userId`, `role` o precio enviados por el cliente.

```ts
const session = await requireSession(request)
const project = await db.project.findUnique({ where: { id: params.id } })

if (!project || project.ownerId !== session.user.id) {
  return new Response('Not found', { status: 404 })
}
```

Filtrar por `id` y `ownerId` en la misma query reduce oportunidades de olvidar el ownership. Usar `404` puede evitar enumerar recursos que existen.

## Sesiones

- Cookie `HttpOnly`, `Secure` y `SameSite` adecuada.
- Identificador aleatorio, corto en exposición y rotado tras login o cambio de privilegios.
- Expiración absoluta y por inactividad según riesgo.
- Revocación real para logout, contraseña cambiada o cuenta comprometida.
- No guardar tokens sensibles en `localStorage` si una cookie segura resuelve el caso.

## Login y recuperación

Hash de contraseña con algoritmo adaptativo; MFA para cuentas de alto impacto. Rate limit por varias señales, respuestas que no enumeren cuentas y tokens de recuperación de un solo uso, con expiración corta y hash en base de datos.

## Permisos

Centraliza políticas y pruébalas con una matriz de rol × acción × estado × ownership. Deniega por defecto. Las restricciones visuales mejoran UX, pero la decisión válida siempre vive en servidor.

## Modelo de sesión

Elige el mecanismo según el tipo de cliente. Para una aplicación web del mismo origen, una cookie de sesión `HttpOnly` suele reducir la exposición frente a XSS. Para integraciones externas, un token de acceso con scopes y expiración corta puede ser más adecuado. En ambos casos, protege el transporte, limita privilegios y define cómo revocar.

Después de iniciar sesión, cambiar la contraseña, activar MFA o elevar privilegios, rota el identificador de sesión para evitar session fixation. Al cerrar sesión, invalida la sesión en el servidor cuando sea posible; borrar una cookie no revoca un token que ya fue copiado.

## Matriz de autorización

Documenta las decisiones con una tabla y conviértela en pruebas:

| Actor | Acción | Recurso propio | Resultado |
| --- | --- | --- | --- |
| visitante | leer artículo público | no aplica | permitir |
| usuario | editar proyecto | sí | permitir |
| usuario | editar proyecto | no | denegar |
| administrador | exportar usuarios | no aplica | permitir con auditoría |

Prueba también estados de cuenta suspendida, recurso eliminado, rol cambiado durante la sesión y acceso directo a un id ajeno. Los identificadores difíciles de adivinar ayudan, pero nunca sustituyen la comprobación de ownership.

## Recuperación segura

Los mensajes de login y recuperación deben evitar enumerar cuentas. Los tokens deben ser aleatorios, de un solo uso, con expiración corta y almacenados de forma que una filtración de la base no permita usarlos directamente. Notifica cambios de correo, contraseña, MFA y sesiones nuevas, y ofrece revocar sesiones activas.
