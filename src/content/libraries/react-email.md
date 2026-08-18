---
title: React Email
description: Emails HTML armados con componentes React en vez de tablas — preview local y envío con Resend.
category: frontend
stack: react
order: 17
tags: [react, email]
website: https://react.email
install: npx create-email@latest
related: []
updatedAt: 2026-08-16
---

El HTML de un email no es HTML normal: los clientes (Gmail, Outlook) requieren tablas anidadas y estilos inline porque no soportan CSS moderno de forma consistente. React Email genera ese HTML pesado a partir de componentes declarativos, probados contra los clientes principales — se escribe como un componente React normal, sale como el HTML retorcido que un email necesita.

## Setup inicial

Genera una carpeta `emails/` con templates de ejemplo y un servidor de preview local.

```bash
npm run dev
```

Abre `localhost:3000`: cada archivo en `emails/` se ve renderizado en vivo, con recarga automática al guardar — así se diseña el email mirándolo, sin mandar de prueba a una casilla real cada vez.

## Componentes básicos

```tsx title="emails/bienvenida.tsx"
import { Html, Body, Container, Text, Button } from '@react-email/components';

export default function EmailBienvenida({ nombre }: { nombre: string }) {
  return (
    <Html>
      <Body style={{ fontFamily: 'sans-serif' }}>
        <Container>
          <Text>Hola {nombre}, gracias por sumarte.</Text>
          <Button href="https://ejemplo.com/empezar" style={{ background: '#000', color: '#fff', padding: '12px 20px' }}>
            Empezar
          </Button>
        </Container>
      </Body>
    </Html>
  );
}
```

## Enviar el email con Resend

`render()` convierte el componente a HTML; el cliente de Resend lo manda. También se puede pasar el componente directo como `react` sin llamar `render()` a mano — Resend lo renderiza internamente.

```ts
import { Resend } from 'resend';
import EmailBienvenida from '../emails/bienvenida';

const resend = new Resend(process.env.RESEND_API_KEY);

await resend.emails.send({
  from: 'equipo@tuapp.com',
  to: usuario.email,
  subject: '¡Bienvenido!',
  react: <EmailBienvenida nombre={usuario.nombre} />,
});
```

## Resumen

| API | Uso |
| --- | --- |
| `npx create-email@latest` | Scaffolding inicial con templates de ejemplo |
| `npm run dev` | Preview local en `localhost:3000`, recarga en vivo |
| `Html`, `Body`, `Container`, `Text`, `Button`... | Componentes que generan el HTML compatible con clientes de email |
| `resend.emails.send({ react: <Componente /> })` | Enviar el email renderizado, vía Resend |

## Consideraciones

- No es solo React con CSS libre: los componentes existen porque generan el HTML/CSS específico que cada cliente de correo necesita — evitá estilos que dependen de flexbox/grid, muchos clientes de email todavía no los soportan bien.
- El preview local (`emails/` + `npm run dev`) es indispensable antes de mandar de verdad: un email roto en Outlook no se detecta mirándolo solo en el navegador normal.
- Resend es una opción entre varias (Nodemailer, SendGrid, Postmark, AWS SES también integran) — el componente React Email es independiente de cuál uses para el envío en sí.
