---
title: "Seguridad web: fundamentos y terminología"
description: Modelo mental para entender activos, amenazas, vulnerabilidades, riesgo, identidad, defensa en profundidad y ataques web comunes.
category: security
stack: security-fundamentos
tags: [seguridad, amenazas, riesgo, autenticacion, autorizacion, owasp]
order: 1
updatedAt: 2026-08-25
---

La **seguridad** consiste en reducir riesgos a un nivel aceptable, no en prometer que un sistema es imposible de atacar. Una aplicación segura identifica qué protege, quién podría atacarla, cómo lo intentaría y qué controles disminuyen la probabilidad o el impacto.

## Aprende o consulta

Para aprender, sigue: activos y confianza → modelo de amenazas → entradas/ataques web → identidad y permisos → APIs y SSRF → headers/CSP → secretos/dependencias → disponibilidad → pruebas e incidentes. Practica siempre en sistemas propios o laboratorios autorizados.

| Riesgo | Documento |
| --- | --- |
| no sé qué proteger primero | [Modelo de amenazas](/guides/security-threat-modeling) |
| XSS, CSRF, SQLi o subida maliciosa | [Ataques web comunes](/guides/security-common-web-attacks) |
| BOLA, abuso de consumo o SSRF | [Seguridad de APIs](/guides/security-api-protection) |
| sesiones, roles y ownership | [Control de acceso](/guides/security-auth-access-control) |
| scripts, iframes y MIME | [Headers y CSP](/guides/security-headers-csp) |
| DDoS y caída de dependencias | [Disponibilidad](/guides/security-ddos-resilience) |
| paquetes o credenciales filtradas | [Cadena de suministro](/guides/security-secrets-supply-chain) |
| integrar seguridad al desarrollo | [SDLC seguro](/guides/security-sdlc-testing) |
| ya ocurrió un incidente | [Respuesta](/guides/security-response-incidents) |

Una lista sirve para recordar controles; aprender seguridad exige seguir el flujo de datos y demostrar dónde cambia la confianza. “Validado en frontend” nunca es una frontera de seguridad.

## Activo, amenaza, vulnerabilidad y riesgo

Estos términos describen cosas distintas:

| Término | Significado | Ejemplo |
| --- | --- | --- |
| Activo | Algo valioso que debe protegerse | Sesiones, datos personales, disponibilidad |
| Amenaza | Actor o evento capaz de causar daño | Un atacante automatizado o un error interno |
| Vulnerabilidad | Debilidad explotable | Consulta SQL construida con texto sin validar |
| Impacto | Daño posible | Robo de cuentas o caída del servicio |
| Riesgo | Combinación de probabilidad e impacto | Exposición de datos por una ruta sin autorización |
| Control | Medida que reduce el riesgo | Consulta parametrizada y prueba de permisos |

Una **superficie de ataque** es el conjunto de puntos que aceptan interacción: rutas HTTP, formularios, archivos, dependencias, paneles, webhooks y credenciales. Reducir capacidades expuestas suele ser más efectivo que intentar proteger funciones que nadie necesita.

## Confidencialidad, integridad y disponibilidad

La tríada **CIA** usa iniciales en inglés:

- **Confidentiality**, confidencialidad: solo acceden quienes tienen permiso.
- **Integrity**, integridad: la información no cambia de forma no autorizada.
- **Availability**, disponibilidad: el servicio permanece utilizable.

El cifrado protege confidencialidad, pero no resuelve por sí solo autorización ni disponibilidad. Una firma o un código de autenticación puede ayudar a verificar integridad.

## Autenticación y autorización

La **autenticación** responde “¿quién eres?”. La **autorización** responde “¿puedes realizar esta acción sobre este recurso?”. Una sesión válida no autoriza automáticamente a leer cualquier cuenta.

```ts
const session = await requireSession(request);
const invoice = await invoices.findById(params.id);

if (!invoice || invoice.ownerId !== session.userId) {
  return new Response('No encontrado', { status: 404 });
}
```

La comprobación se hace sobre el objeto concreto en el servidor. Ocultar el botón en la interfaz mejora experiencia, pero no protege la ruta.

El **principio de mínimo privilegio** concede solo permisos necesarios, durante el tiempo necesario. Una clave de lectura no debería poder borrar tablas; un proceso público no necesita credenciales administrativas.

## Validación, codificación y parametrización

**Validar** comprueba que un dato cumple el formato y las reglas esperadas. **Codificar la salida** representa caracteres de forma segura para el contexto en que se insertan. **Parametrizar** separa datos de una instrucción, como una consulta SQL.

```ts
// El valor viaja como dato; no se concatena en la instrucción SQL.
const result = await db.query(
  'SELECT id, email FROM users WHERE email = $1',
  [email],
);
```

No existe una función universal de “sanitización”. HTML, URL, SQL, CSS y comandos del sistema tienen reglas diferentes. La protección se aplica al contexto de destino.

## Ataques y acrónimos frecuentes

| Sigla | Nombre | Qué ocurre | Defensa principal |
| --- | --- | --- | --- |
| XSS | *Cross-Site Scripting* | Contenido no confiable se ejecuta como script | Escape contextual, APIs seguras y CSP |
| CSRF | *Cross-Site Request Forgery* | Un sitio induce al navegador autenticado a enviar una acción | `SameSite`, token CSRF y verificación de origen |
| SSRF | *Server-Side Request Forgery* | El servidor solicita una URL elegida por un atacante | Lista permitida, validación y aislamiento de red |
| SQLi | Inyección SQL | Datos alteran la estructura de una consulta | Consultas parametrizadas |
| IDOR | *Insecure Direct Object Reference* | Se accede a otro objeto cambiando su identificador | Autorización por recurso |
| DDoS | *Distributed Denial of Service* | Muchas fuentes agotan capacidad | CDN, límites, caché y degradación controlada |

Una **CSP** (*Content Security Policy* o política de seguridad de contenido) restringe desde qué orígenes puede cargarse o ejecutarse contenido. Reduce impacto de ciertos XSS, pero no reemplaza el escape ni la eliminación de inyecciones.

**CORS** (*Cross-Origin Resource Sharing*) indica qué orígenes pueden leer una respuesta desde el navegador. No es un mecanismo general de autenticación: otros servidores no están obligados por CORS.

## Hash, cifrado y codificación

Un **hash** produce una huella de longitud fija y no está diseñado para revertirse. El **cifrado** transforma datos usando una clave y sí debe poder revertirse con la clave apropiada. **Base64** es solo una codificación; cualquiera puede decodificarla.

Las contraseñas se almacenan con funciones especializadas y lentas para contraseñas, con una sal aleatoria. No se guardan cifradas para poder recuperarlas ni se procesan con un hash rápido genérico.

## Defensa en profundidad

La **defensa en profundidad** combina controles independientes. Si uno falla, otro limita el daño:

```text
CDN y limitación de tráfico
  → autenticación
  → autorización por recurso
  → validación y consultas parametrizadas
  → permisos mínimos de base de datos
  → registros, alertas y recuperación
```

También se necesita **segmentación**: separar entornos, redes, cuentas y secretos para que una credencial comprometida no otorgue acceso a todo.

## Secretos y dependencias

Un **secreto** es una credencial que permite actuar: clave de API, contraseña, token o clave privada. No debe vivir en Git, en registros, en mensajes de error ni en el paquete del navegador.

La **cadena de suministro** incluye dependencias, registros de paquetes, acciones de CI, imágenes y herramientas de construcción. Un paquete pequeño puede ejecutar código durante la instalación. Se fijan versiones, revisan cambios, reducen dependencias y limitan permisos del proceso de construcción.

## Registros, detección y respuesta

Prevenir todo incidente es imposible. La aplicación necesita detectar comportamientos anómalos y conservar evidencia útil sin registrar contraseñas, tokens ni datos personales innecesarios.

Un plan de respuesta define responsables, canales, aislamiento, rotación de credenciales, comunicación, recuperación y análisis posterior. **MTTD** significa *Mean Time to Detect* o tiempo medio para detectar; **MTTR** puede significar tiempo medio para responder o recuperar, por lo que el equipo debe definir cuál usa.

## Preguntas para cada funcionalidad

1. ¿Qué activos procesa y cuál sería el peor impacto?
2. ¿Qué entradas son controladas por usuarios o sistemas externos?
3. ¿Dónde se autentica y dónde se autoriza cada recurso?
4. ¿Qué puede hacer la credencial si se filtra?
5. ¿Qué límites evitan abuso de costo, CPU, memoria o solicitudes?
6. ¿Qué se registra y cómo se detecta un comportamiento extraño?
7. ¿Cómo se revierte, restaura y comunica un incidente?

La seguridad debe formar parte del diseño, las pruebas y la operación. Agregar encabezados al final no corrige una autorización inexistente.
