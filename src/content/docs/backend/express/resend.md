---
title: Resend
description: Enviar emails transaccionales desde el backend — API simple, dominios verificados, y por qué no usar SMTP directo.
type: libraries
order: 20
tags: [express, email, resend]
website: https://resend.com
install: npm install resend
updatedAt: 2026-08-16
---

Resend es un servicio de envío de emails transaccionales (confirmaciones, recuperación de contraseña, notificaciones) con una API HTTP simple — evita lidiar con SMTP, autenticación de servidores de correo, y la reputación de IP que hace que Gmail/Outlook no manden un email directo desde un servidor propio a spam.

## Setup

```ts title="lib/resend.ts"
import { Resend } from "resend"

export const resend = new Resend(process.env.RESEND_API_KEY)
```

Antes de mandar emails en producción, el dominio de envío necesita verificarse en el panel de Resend (agregar registros DNS) — sin eso, los emails salen de un dominio de prueba compartido, con límites y peor entregabilidad.

## Mandar un email

```ts
await resend.emails.send({
  from: 'App <noreply@midominio.com>',
  to: usuario.email,
  subject: 'Confirma tu cuenta',
  html: `<p>Haz click <a href="${urlConfirmacion}">aquí</a> para confirmar tu cuenta.</p>',
});
```

## Con React/JSX para el template (`@react-email`)

Resend integra directo con [React Email](/frontend/react/react-email) para armar el HTML del email como componentes en vez de strings:

```bash
npm install @react-email/components
```

```tsx title="emails/BienvenidaEmail.tsx"
import { Body, Html, Link, Text } from "@react-email/components"

export function BienvenidaEmail({
  nombre,
  urlConfirmacion
}: {
  nombre: string
  urlConfirmacion: string
}) {
  return (
    <Html>
      <Body>
        <Text>Hola {nombre}, confirma tu cuenta:</Text>
        <Link href={urlConfirmacion}>Confirmar cuenta</Link>
      </Body>
    </Html>
  )
}
```

```ts
import { BienvenidaEmail } from "./emails/BienvenidaEmail"

await resend.emails.send({
  from: "App <noreply@midominio.com>",
  to: usuario.email,
  subject: "Bienvenido",
  react: BienvenidaEmail({ nombre: usuario.nombre, urlConfirmacion })
})
```

## Caso de uso típico: email de bienvenida tras el registro

```ts
app.post("/registro", async (req, res) => {
  const usuario = await crearUsuario(req.body)

  await resend.emails.send({
    from: "App <noreply@midominio.com>",
    to: usuario.email,
    subject: "Bienvenido",
    react: BienvenidaEmail({
      nombre: usuario.nombre,
      urlConfirmacion: generarUrlConfirmacion(usuario.id)
    })
  })

  res.status(201).json({ ok: true })
})
```

## Resumen

| API                                                     | Qué hace                                        |
| ------------------------------------------------------- | ----------------------------------------------- |
| `new Resend(apiKey)`                                    | Instancia el client                             |
| `resend.emails.send({ from, to, subject, html/react })` | Manda un email                                  |
| Dominio verificado (DNS)                                | Requisito para producción, mejor entregabilidad |
| `react: <Componente />`                                 | Template como JSX en vez de HTML crudo          |

## Consideraciones

- `RESEND_API_KEY` es un secreto — ver [Variables de entorno en Node](/backend/node/node-env-vars).
- `resend.emails.send()` es una llamada de red — si se hace dentro de un endpoint que el usuario está esperando (como `/registro` arriba), un email lento no debería bloquear la respuesta al cliente indefinidamente; para volumen alto, una cola de trabajos (fuera del alcance de esta guía) desacopla el envío del ciclo de request/response.
- No confundir con SMTP transaccional tradicional (Nodemailer + un servidor SMTP propio) — Resend (como SendGrid, Postmark, etc.) resuelve la parte difícil de la entregabilidad (SPF, DKIM, reputación) que un SMTP casero no tiene resuelta de fábrica.
