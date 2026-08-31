---
title: Discord — comunidad, soporte y bots
description: Aplicación de comunicación para organizar comunidades o equipos en servidores y canales; también permite automatizar avisos y tareas mediante webhooks y bots.
category: applications
stack: apps-comms
order: 1
tags: [discord, comunidad, webhooks, bots, notificaciones]
website: https://discord.com
related:
  - guides/github-actions-secretos-permisos
updatedAt: 2026-08-26
---

**Discord** es una aplicación de chat organizada en servidores y canales, con voz, video y una API abierta que la convierte en algo más que un chat: muchos proyectos de código abierto la usan como soporte de comunidad, y muchos pipelines de CI la usan como canal de notificaciones vía webhook.

## Instalación

Discord funciona completo en el navegador (**discord.com/app**); la app de escritorio añade notificaciones nativas del sistema y arranque automático.

```bash
# Windows (winget)
winget install Discord.Discord

# macOS (Homebrew)
brew install --cask discord
```

En Linux hay `.deb`/`.tar.gz` oficiales en la página de descargas. También existe un paquete en Flathub (`flatpak install flathub com.discordapp.Discord`), mantenido por la comunidad y no por Discord — corre en un sandbox más restrictivo, lo que puede limitar el Rich Presence (mostrar en qué estás jugando) y el acceso a archivos del sistema.

## Servidores, canales e hilos

Un **servidor** (Discord los llama internamente "guilds" en la API) es el espacio de una comunidad o equipo. Dentro, los **canales** se organizan en categorías y pueden ser de texto, voz, anuncios o foro. Un **hilo** (thread) es una subconversación colgada de un mensaje o de un canal de foro — sirve para que una discusión puntual no llene el canal principal, y se archiva solo tras un período de inactividad configurable.

## Roles y permisos

Los **roles** son la unidad de permisos: se le asignan a una persona y determinan qué puede ver, escribir, mencionar o moderar. Los permisos se acumulan entre los roles que tiene una persona, y pueden sobrescribirse por canal — un rol puede tener acceso general de lectura/escritura pero estar explícitamente bloqueado en un canal específico.

El principio práctico es el mismo que en cualquier sistema de permisos: el rol `@everyone` (el que tiene todo el mundo por defecto) debería llevar los permisos mínimos, y los permisos elevados (gestionar el servidor, banear, gestionar roles) van en roles explícitos que se asignan a poca gente.

## Webhooks — notificaciones sin bot

Un **webhook** de Discord es una URL a la que cualquier sistema externo puede hacer `POST` para publicar un mensaje en un canal, sin necesitar un bot completo ni un token de usuario. Se crea desde **Configuración del canal → Integraciones → Webhooks**.

```bash
curl -X POST "$DISCORD_WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d '{"content": "✅ Deploy completado en producción — commit '"$GIT_SHA"'"}'
```

Este es el mecanismo detrás de notificar un pipeline de GitHub Actions al terminar un deploy o al fallar un build: el workflow guarda la URL del webhook como secreto (ver [secretos y permisos en Actions](/guides/github-actions-secretos-permisos)) y hace ese `POST` como último paso.

```yaml title=".github/workflows/notify.yml"
- name: Notificar a Discord
  if: always()
  run: |
    curl -X POST "${{ secrets.DISCORD_WEBHOOK_URL }}" \
      -H "Content-Type: application/json" \
      -d "{\"content\": \"Build ${{ job.status }} en ${{ github.ref_name }}\"}"
```

La URL de un webhook **es** la credencial — cualquiera que la tenga puede publicar en ese canal en tu nombre. Trátala como un secreto, nunca la pongas en el código ni en un log de CI en texto plano.

## Bots — cuando un webhook no alcanza

Un **bot** se registra en el [Discord Developer Portal](https://discord.com/developers/applications), obtiene un token y se conecta mediante la API (REST para acciones puntuales, Gateway por WebSocket para eventos en tiempo real — mensajes nuevos, alguien se une). A diferencia de un webhook, un bot puede **leer** mensajes, reaccionar a comandos y mantener estado.

Los **Slash Commands** (`/comando`) son la forma moderna de interacción — se registran en la API y Discord los muestra con autocompletado nativo, en vez de que el bot tenga que parsear texto libre buscando un prefijo.

Igual que con cualquier token de API: un token de bot con permisos amplios en un servidor grande es un objetivo de valor; se rota si se filtra, y se le dan solo los permisos (`Intents`, en la terminología de la API) que el bot realmente necesita — un bot que solo responde a comandos no necesita el `Intent` de leer el contenido de todos los mensajes.

## Cuándo usarlo

Como espacio de comunidad y soporte alrededor de un proyecto, y como canal de notificaciones de baja fricción para CI/CD vía webhooks. Para comunicación interna de una empresa con requisitos de cumplimiento o retención de datos formales, herramientas como Slack suelen tener mejor soporte empresarial — Discord nació para comunidades y gaming, no para ese caso de uso.

Fuentes: [documentación de la API de Discord](https://discord.com/developers/docs/intro) y [guía de webhooks](https://discord.com/developers/docs/resources/webhook).
