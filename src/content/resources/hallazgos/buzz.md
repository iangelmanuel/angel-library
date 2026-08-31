---
title: "Buzz — espacio de trabajo para personas y agentes"
description: "Proyecto que trata a personas y agentes de IA como participantes del mismo espacio de trabajo; permite estudiar permisos, trazabilidad y colaboración entre ambos."
category: findings
stack: hallazgos-ia
order: 1
tags: [ia, agentes, nostr, rust, colaboracion, self-hosted]
url: https://github.com/block/buzz
resourceCategory: ia
personalNote: "Lo interesante no es que haya agentes en un chat, sino que tengan exactamente los mismos permisos que una persona y dejen el mismo rastro auditable."
updatedAt: 2026-08-30
---

> Creado y mantenido por **[Block](https://github.com/block)**, publicado con licencia Apache-2.0. Unas 31.500 estrellas, escrito en Rust.

**Buzz** es un espacio de trabajo autogestionado donde humanos y agentes de IA comparten las mismas salas. No es un chat con un bot invitado: es un espacio donde ambos tipos de participante son ciudadanos de primera.

## Qué hace

Por dentro es un **relé Nostr**: cada mensaje, reacción, paso de flujo de trabajo, aprobación de revisión y evento de Git es un **evento firmado** en un único registro.

Esa decisión tiene una consecuencia directa: la estructura, el modelo de identidad y el registro de auditoría son **los mismos** sin importar si quien actúa es una persona o un proceso. Lo único que cambia es el par de claves que firma.

Por fuera se siente como un espacio de trabajo en equipo. Por dentro es un registro de eventos con una cantidad notable de paquetes Rust.

## Cómo se organiza

Una **comunidad** de Buzz es el espacio de trabajo al que se entra por una URL. En la configuración de relé único que se distribuye hoy, **la URL del relé selecciona exactamente una comunidad**.

Un operador puede alojar muchas comunidades detrás de varios dominios o subdominios, pero la regla del cliente no cambia: la URL es la autoridad del espacio de trabajo, y todo el estado observable bajo esa URL es local a esa comunidad.

## Qué pueden hacer los agentes

Aquí está la diferencia real con otras herramientas de desarrollo con IA. Una vez dentro, un agente puede:

- Abrir repositorios y enviar parches.
- Revisar código.
- Ejecutar flujos de trabajo.
- Editar lienzos.
- Coordinar a otros agentes.
- Participar en reuniones de voz.
- Crear canales y convocar a quien necesite estar presente.

Las mismas capacidades que un compañero humano, el mismo registro de auditoría, distinto par de claves.

## Cómo usarlo

Es autoalojado: se despliega el relé y se accede por su URL. Al estar construido sobre Nostr, la identidad es un par de claves criptográficas, no una cuenta con contraseña.

## Qué tener en cuenta

- **Es Rust y es autoalojado.** Operarlo requiere estar cómodo desplegando y manteniendo un servicio propio.
- **Nostr no es un protocolo de uso masivo.** El modelo de identidad por claves es potente y también menos familiar para un equipo acostumbrado a inicio de sesión corporativo.
- **Dar a un agente las mismas capacidades que a una persona es una decisión de seguridad.** El registro auditable ayuda a revisar después lo que pasó, pero no impide que ocurra: conviene pensar los permisos antes de conectar agentes con acceso de escritura a repositorios.
