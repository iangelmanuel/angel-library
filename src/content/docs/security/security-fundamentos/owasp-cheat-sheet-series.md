---
title: OWASP Cheat Sheet Series — guías cortas de seguridad por tema
description: Colección oficial de OWASP con 137 hojas de referencia sobre autenticación, sesiones, inyección, contenedores, CI/CD, frameworks e IA, organizadas por tema, ASVS, Top 10 y Proactive Controls.
tags: [seguridad, owasp, cheat-sheet, appsec, asvs, top-10, referencia]
sidebar:
  order: 3
draft: false
scope: fundamentos de seguridad
resourceCategory: Documentación oficial
official: true
website: https://cheatsheetseries.owasp.org
github: https://github.com/OWASP/CheatSheetSeries
technologies:
  - security/security-fundamentos/security-fundamentals-terminology
  - security/security-fundamentos/security-threat-modeling
  - security/security-aplicacion/security-common-web-attacks
  - security/security-testing/web-security-checklist
note: "Contenido bajo licencia CC BY-SA 4.0: puedes copiarlo y adaptarlo citando la fuente y compartiendo los derivados con la misma licencia. Está en inglés. 137 cheat sheets en octubre de 2026."
updatedAt: 2026-10-12
---

La **OWASP Cheat Sheet Series** es una colección de guías breves, cada una centrada en un tema concreto de seguridad de aplicaciones: cómo guardar contraseñas, cómo gestionar sesiones, cómo evitar inyección SQL, cómo endurecer un contenedor Docker o un workflow de GitHub Actions. Son el punto intermedio entre un artículo divulgativo y un estándar formal: directas, con recomendaciones accionables y ejemplos de código.

## Qué es OWASP

**OWASP** (_Open Worldwide Application Security Project_) es una fundación sin ánimo de lucro que produce material abierto sobre seguridad de software. Sus proyectos más conocidos:

- **OWASP Top 10**: los diez riesgos más críticos de las aplicaciones web. Es un documento de concienciación, no una checklist.
- **ASVS** (_Application Security Verification Standard_): una lista de requisitos verificables, por niveles, para auditar o diseñar una aplicación.
- **Proactive Controls**: las técnicas que todo proyecto debería aplicar desde el diseño.
- **Cheat Sheet Series**: el «cómo se hace» de todo lo anterior.

Si el Top 10 dice _qué_ suele salir mal y el ASVS dice _qué_ verificar, las cheat sheets dicen _cómo_ hacerlo bien.

## Cómo está organizada

El sitio ofrece varias entradas al mismo contenido, según lo que estés buscando:

| Índice | Para qué sirve |
| --- | --- |
| [Índice alfabético](https://cheatsheetseries.owasp.org/Glossary.html) | Todas las cheat sheets por nombre. El más rápido si sabes qué tema buscas. |
| [Índice por ASVS](https://cheatsheetseries.owasp.org/IndexASVS.html) | Cheat sheets agrupadas por capítulo del ASVS (codificación y saneamiento, autenticación, sesiones, autorización, tokens, OAuth/OIDC…). Útil al implementar requisitos de una auditoría. |
| [Índice por Top 10](https://cheatsheetseries.owasp.org/IndexTopTen.html) | Qué cheat sheets mitigan cada categoría del Top 10 (versión 2021 en el índice). |
| [Índice por Proactive Controls](https://cheatsheetseries.owasp.org/IndexProactiveControls.html) | Por control proactivo (versión 2018 en el índice): requisitos, frameworks seguros, acceso a datos, codificación, validación… |
| [Índice por MASVS](https://cheatsheetseries.owasp.org/IndexMASVS.html) | Para apps móviles, según el estándar MASVS 2.1.0. |

Cada cheat sheet sigue una estructura parecida: introducción y contexto, recomendaciones concretas, ejemplos de código buenos y malos, y referencias. El sitio se puede descargar completo para consulta sin conexión y tiene un feed ATOM con las actualizaciones.

## Cheat sheets imprescindibles por tema

### Identidad y sesiones

| Tema | Cheat sheet |
| --- | --- |
| Inicio de sesión, mensajes de error, bloqueo | [Authentication](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html) |
| Guardar contraseñas (Argon2id, bcrypt, scrypt) | [Password Storage](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html) |
| Recuperar la contraseña sin filtrar cuentas | [Forgot Password](https://cheatsheetseries.owasp.org/cheatsheets/Forgot_Password_Cheat_Sheet.html) |
| Segundo factor | [Multifactor Authentication](https://cheatsheetseries.owasp.org/cheatsheets/Multifactor_Authentication_Cheat_Sheet.html) |
| Cookies de sesión, expiración, rotación | [Session Management](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html) |
| JWT: firma, algoritmos, revocación | [JSON Web Token](https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_Cheat_Sheet.html) |
| OAuth 2.0 | [OAuth2](https://cheatsheetseries.owasp.org/cheatsheets/OAuth2_Cheat_Sheet.html) |
| Permisos y control de acceso | [Authorization](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html) · [IDOR](https://cheatsheetseries.owasp.org/cheatsheets/Insecure_Direct_Object_Reference_Prevention_Cheat_Sheet.html) |

### Entradas, inyección y navegador

| Tema | Cheat sheet |
| --- | --- |
| Inyección SQL | [SQL Injection Prevention](https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html) · [Query Parameterization](https://cheatsheetseries.owasp.org/cheatsheets/Query_Parameterization_Cheat_Sheet.html) |
| Validación de entradas | [Input Validation](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html) |
| XSS | [Cross Site Scripting Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html) |
| CSRF | [Cross-Site Request Forgery Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html) |
| SSRF | [Server Side Request Forgery Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html) |
| Cabeceras HTTP y CSP | [HTTP Headers](https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html) · [Content Security Policy](https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html) |
| Subida de archivos | [File Upload](https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html) |

### APIs

| Tema | Cheat sheet |
| --- | --- |
| APIs REST | [REST Security](https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html) |
| GraphQL: profundidad, introspección, batching | [GraphQL](https://cheatsheetseries.owasp.org/cheatsheets/GraphQL_Cheat_Sheet.html) |

### Infraestructura, CI/CD y dependencias

| Tema | Cheat sheet |
| --- | --- |
| Contenedores | [Docker Security](https://cheatsheetseries.owasp.org/cheatsheets/Docker_Security_Cheat_Sheet.html) · [Kubernetes Security](https://cheatsheetseries.owasp.org/cheatsheets/Kubernetes_Security_Cheat_Sheet.html) |
| Pipelines | [CI/CD Security](https://cheatsheetseries.owasp.org/cheatsheets/CI_CD_Security_Cheat_Sheet.html) · [GitHub Actions Security](https://cheatsheetseries.owasp.org/cheatsheets/GitHub_Actions_Security_Cheat_Sheet.html) |
| Secretos | [Secrets Management](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html) |
| Cadena de suministro | [Software Supply Chain Security](https://cheatsheetseries.owasp.org/cheatsheets/Software_Supply_Chain_Security_Cheat_Sheet.html) · [Vulnerable Dependency Management](https://cheatsheetseries.owasp.org/cheatsheets/Vulnerable_Dependency_Management_Cheat_Sheet.html) · [NPM Security](https://cheatsheetseries.owasp.org/cheatsheets/NPM_Security_Cheat_Sheet.html) |
| Logs y errores | [Logging](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html) · [Error Handling](https://cheatsheetseries.owasp.org/cheatsheets/Error_Handling_Cheat_Sheet.html) |

### Lenguajes y frameworks

| Stack | Cheat sheet |
| --- | --- |
| Node.js / JavaScript / TypeScript | [Node.js Security](https://cheatsheetseries.owasp.org/cheatsheets/Nodejs_Security_Cheat_Sheet.html) · [JavaScript and TypeScript Security](https://cheatsheetseries.owasp.org/cheatsheets/JavaScript_and_TypeScript_Security_Cheat_Sheet.html) |
| Next.js | [Next.js Security](https://cheatsheetseries.owasp.org/cheatsheets/Nextjs_Security_Cheat_Sheet.html) |
| .NET | [DotNet Security](https://cheatsheetseries.owasp.org/cheatsheets/DotNet_Security_Cheat_Sheet.html) |
| Java | [Java Security](https://cheatsheetseries.owasp.org/cheatsheets/Java_Security_Cheat_Sheet.html) |
| PHP / Laravel | [PHP Configuration](https://cheatsheetseries.owasp.org/cheatsheets/PHP_Configuration_Cheat_Sheet.html) · [Laravel](https://cheatsheetseries.owasp.org/cheatsheets/Laravel_Cheat_Sheet.html) |
| Python / Django | [Django Security](https://cheatsheetseries.owasp.org/cheatsheets/Django_Security_Cheat_Sheet.html) |

### IA y agentes

La serie ha incorporado guías recientes para sistemas con LLM:

| Tema | Cheat sheet |
| --- | --- |
| Inyección de prompts | [LLM Prompt Injection Prevention](https://cheatsheetseries.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.html) |
| Agentes con herramientas | [AI Agent Security](https://cheatsheetseries.owasp.org/cheatsheets/AI_Agent_Security_Cheat_Sheet.html) |
| Servidores MCP | [MCP Security](https://cheatsheetseries.owasp.org/cheatsheets/MCP_Security_Cheat_Sheet.html) |
| Programar con asistentes de IA | [Secure Coding with AI](https://cheatsheetseries.owasp.org/cheatsheets/Secure_Coding_with_AI_Cheat_Sheet.html) |

## Cómo usarla en un proyecto

1. **Empieza por el modelo de amenazas.** Identifica qué protege tu aplicación y por dónde la atacarían (ver [Modelo de amenazas](/security/security-fundamentos/security-threat-modeling) y la [Threat Modeling Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html)). Eso te dice qué hojas leer primero.
2. **Lee la hoja antes de implementar, no después.** Antes de escribir el login, lee _Authentication_ y _Password Storage_; antes de aceptar archivos, _File Upload_.
3. **Enlázala en el código y en los PRs.** Un comentario con el enlace a la sección concreta explica por qué una decisión de seguridad es así y evita que alguien la «simplifique».
4. **Úsala como checklist de revisión.** Las recomendaciones se convierten bien en puntos de revisión de código o en criterios de aceptación.
5. **Dásela a tu agente de IA.** Pasar la URL de la cheat sheet relevante como contexto produce código más seguro que pedir «hazlo seguro».
6. **Relee al actualizar dependencias o frameworks.** Las hojas se revisan con la comunidad; consulta el historial del repositorio para ver qué cambió.

## Límites

- **No sustituye una auditoría ni el ASVS.** Son guías, no requisitos verificables; para una verificación formal, el ASVS es el estándar.
- **Calidad desigual.** Las escriben voluntarios: las hojas clásicas (autenticación, XSS, SQLi) están muy pulidas; algunas nuevas o muy específicas son más delgadas.
- **Los índices no siempre van al día.** El de Top 10 sigue la edición 2021 y el de Proactive Controls la de 2018, aunque las cheat sheets se actualizan por separado.
- **Solo en inglés.**

## Fuentes

- [cheatsheetseries.owasp.org](https://cheatsheetseries.owasp.org)
- [github.com/OWASP/CheatSheetSeries](https://github.com/OWASP/CheatSheetSeries) — 137 archivos en `cheatsheets/` a octubre de 2026.
- [OWASP Top 10](https://owasp.org/www-project-top-ten/) · [OWASP ASVS](https://owasp.org/www-project-application-security-verification-standard/)
