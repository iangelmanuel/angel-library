---
title: Seguridad en Express — Helmet y buenas prácticas
description: Endurecer una API Express con TLS, Helmet, límites, rate limiting, proxies confiables, cookies seguras y dependencias actualizadas.
category: backend
stack: express
order: 7
tags: [express, security, helmet]
scope: helmet / seguridad básica
related: [guides/express-cors]
updatedAt: 2026-08-25
---

La seguridad de Express se construye por capas. Helmet configura headers del navegador, pero no valida entradas, autentica usuarios, cifra el transporte ni detiene por sí solo un ataque de volumen.

## Mapa de amenazas y controles

| Riesgo | Control principal |
| --- | --- |
| interceptar tráfico | HTTPS/TLS en proxy o plataforma |
| XSS, clickjacking, MIME sniffing | Helmet + salida segura |
| body enorme | límites de parser y streaming |
| fuerza bruta | límite por cuenta + IP + alertas |
| spoofing de IP/protocolo | `trust proxy` exacto |
| inyección | validación + consultas parametrizadas |
| dependencia vulnerable | actualizaciones, lockfile y auditoría |
| caída por proceso | supervisor, health checks y cierre ordenado |

## Instalación

```bash
npm install helmet
```

```ts title="app.ts"
import express from 'express';
import helmet from 'helmet';

const app = express();

app.use(helmet()); // aplica un set de headers seguros por defecto, sin configuración extra
```

## Qué headers agrega (los más relevantes)

```text
Content-Security-Policy    → limita de dónde puede cargar recursos la página (scripts, estilos, imágenes)
Strict-Transport-Security  → fuerza HTTPS en visitas futuras
X-Content-Type-Options     → evita que el navegador "adivine" el tipo de un archivo (MIME sniffing)
X-Frame-Options             → evita que el sitio se cargue dentro de un <iframe> ajeno (clickjacking)
```

`helmet()` sin argumentos ya aplica un preset razonable — no hace falta configurar cada header a mano para empezar.

Helmet reduce superficie en respuestas consumidas por navegador. Una API JSON también se beneficia de varios headers, aunque CSP es especialmente relevante cuando Express entrega HTML.

## Configurar un header puntual

```ts
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", 'https://cdn.ejemplo.com'],
      },
    },
  }),
);
```

## Límite de tamaño del body

Sin límite, un cliente (malicioso o con un bug) puede mandar un body gigante y agotar la memoria del servidor antes de que la request llegue a validarse.

```ts
app.use(express.json({ limit: '1mb' }));
```

Elige el límite según el contrato real; `100kb` suele ser un mejor punto de partida para JSON pequeño que ampliar “por si acaso”. Limita también URL encoded, archivos, cantidad de campos, profundidad y duración. El schema valida después de que el parser ya consumió bytes.

## Rate limiting: mención

Helmet no protege contra fuerza bruta (miles de intentos de login por segundo desde la misma IP) — eso es un problema distinto, resuelto con **rate limiting**:

```bash
npm install express-rate-limit
```

```ts
import rateLimit from 'express-rate-limit';

const limiterLogin = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5,                    // máximo 5 intentos por IP en esa ventana
  message: { error: 'Demasiados intentos, prueba de nuevo más tarde' },
});

app.post('/login', limiterLogin, handlerDeLogin);
```

Las rutas de login necesitan al menos dos dimensiones: intentos consecutivos por cuenta + IP y volumen de una IP durante un periodo mayor. Limitar solo por IP castiga redes compartidas y puede evadirse distribuyendo direcciones. Un límite global más amplio protege capacidad, mientras reglas específicas protegen operaciones costosas.

En varias instancias usa un store compartido y una clave derivada de identidad confiable. Define respuesta `429 Too Many Requests`, `Retry-After`, observabilidad y un procedimiento para desbloqueo.

## Reverse proxy y `trust proxy`

En producción, Express suele estar detrás de un reverse proxy o balanceador que termina HTTPS y añade `X-Forwarded-*`. Configura exactamente cuántos proxies son confiables:

```ts
app.set('trust proxy', 1);
```

No copies este `1` sin conocer la topología. Una configuración demasiado amplia permite falsificar IP o protocolo; una ausente puede hacer que cookies `secure` no se establezcan porque Express cree que la conexión es HTTP.

## Entradas, redirects e inyección

Toda entrada externa requiere validación: body, params, query, headers y nombres de archivos. Usa consultas parametrizadas o un ORM sin interpolar SQL. Para redirects, valida protocolo y hostname contra una allowlist:

```ts
const allowedHosts = new Set(['app.example.com']);

function safeRedirect(value: string) {
  const target = new URL(value, 'https://app.example.com');
  if (target.protocol !== 'https:' || !allowedHosts.has(target.hostname)) {
    throw new Error('Destino no permitido');
  }
  return target.toString();
}
```

Una URL “que empieza por” el dominio esperado no es suficiente: `https://app.example.com.attacker.test` puede engañar una comparación débil.

## Cookies y fingerprinting

```ts
app.disable('x-powered-by');
```

Reducir fingerprinting no reemplaza corregir vulnerabilidades, pero evita revelar información gratuita. Las cookies de sesión usan nombre no predeterminado, `HttpOnly`, `Secure`, `SameSite`, expiración y secreto fuerte. El store de sesión debe ser compartido y no el almacenamiento en memoria predeterminado para producción.

## Dependencias y versiones

Mantén Node, Express y middleware en versiones soportadas. Revisa advisories, lockfile y dependencias transitivas; una auditoría sin plan de actualización solo genera ruido. Elimina paquetes no usados y evita instalar middleware sin revisar mantenimiento, permisos y superficie.

## Controles por capa

| Herramienta | Protege contra |
| --- | --- |
| `helmet()` | Headers de seguridad HTTP faltantes por defecto |
| `express.json({ limit })` | Bodies gigantes agotando memoria |
| `express-rate-limit` | Fuerza bruta / abuso por volumen de requests |
| CORS (ver guía aparte) | Que el navegador exponga la respuesta a orígenes no autorizados |
| TLS + proxy correcto | Tráfico sin cifrar y protocolo/IP incorrectos |
| Validación + consultas parametrizadas | Inyección y datos fuera de contrato |

## Límites del endurecimiento

- `helmet()` es un buen punto de partida, no una configuración final. Una CSP real se ajusta a los recursos que la aplicación necesita.
- El rate limiting en memoria se reinicia con el proceso y no se comparte entre instancias. En producción distribuida necesita un store compartido.
- CORS no autentica y no bloquea `curl` u otros servidores; solo controla acceso del JavaScript del navegador a una respuesta cross-origin.
- Un WAF o CDN puede filtrar volumen y patrones conocidos, pero la aplicación todavía debe validar, autorizar y limitar operaciones costosas.

## Checklist antes de producción

1. HTTPS obligatorio y `trust proxy` acorde a la infraestructura.
2. Helmet revisado con las páginas y orígenes reales.
3. Parsers, uploads, query y tiempos con límites.
4. Validación estructural y autorización por recurso.
5. Rate limit compartido en login, recuperación y endpoints costosos.
6. Cookies, secretos y logs revisados para no filtrar credenciales.
7. Dependencias soportadas, health checks y reinicio automático.
