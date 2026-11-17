---
title: "Scrapling: framework de scraping en Python con navegador sigiloso, spiders y MCP"
description: "Biblioteca open source (BSD-3-Clause) que reúne peticiones HTTP que imitan la huella de un navegador, un navegador automatizado con evasión de anti-bots, un parser con selectores adaptativos, spiders concurrentes, un servidor MCP y una Agent Skill."
tags: [scraping, crawling, python, playwright, anti-bot, mcp, agent-skill, cli, rag]
sidebar:
  order: 21
draft: false
language: Python 3.10+
resourceCategory: Documentación oficial
official: true
website: https://scrapling.readthedocs.io/en/latest/
github: https://github.com/D4Vinci/Scrapling
technologies:
  - skills/ia-mcp/mcp-playwright
  - agents/claude-code/claude-code-mcp
  - agents/claude-code/claude-code-skills
  - resources/ia/skills-sh
note: "Licencia BSD-3-Clause. `pip install scrapling` solo trae el parser: para los fetchers, los spiders, el MCP o la shell instala los extras (`scrapling[fetchers]`, `[ai]`, `[shell]` o `[all]`) y ejecuta `scrapling install` para descargar los navegadores."
warnings:
  - "Que una herramienta pueda extraer datos no significa que tengas permiso. Los términos de servicio del sitio, el robots.txt, las leyes de protección de datos (RGPD y equivalentes) y los derechos sobre bases de datos siguen aplicando. El propio README lo declara para uso educativo y de investigación y descarga la responsabilidad en ti."
  - "Las funciones de evasión (suplantación de huella TLS y de navegador, resolución de Turnstile de Cloudflare) sirven para saltarse controles que el sitio puso a propósito. Usarlas puede violar sus condiciones, provocar bloqueos de IP o cuentas y, según la jurisdicción, tener consecuencias legales."
  - "El servidor MCP deja que un agente navegue y extraiga datos por su cuenta, con estado de sesión guardado en disco. Revisa qué sitios visita y no le pases sesiones con credenciales que no quieras exponer; el contenido de terceros puede intentar inyección de prompts."
updatedAt: 2026-11-16
---

## En pocas palabras

[Scrapling](https://github.com/D4Vinci/Scrapling) es un framework de **web scraping** (extraer datos de páginas web de forma automática) escrito en Python. Junta en una sola biblioteca cuatro piezas que normalmente vienen por separado: peticiones HTTP rápidas, un navegador automatizado y difícil de detectar, un parser de HTML con selectores CSS y XPath, y un framework de **crawling** (recorrer un sitio entero siguiendo enlaces) al estilo de Scrapy.

Lo mantiene Karim Shoair ([D4Vinci](https://github.com/D4Vinci)), se publica con **licencia BSD-3-Clause** y ronda las **100.000 estrellas** en GitHub. Está activo: la versión 0.5.1 salió en noviembre de 2026.

## Qué problema resuelve

Un scraper típico acaba siendo un collage: `requests` o `httpx` para las páginas estáticas, Playwright o Selenium para las que necesitan JavaScript, BeautifulSoup o Parsel para extraer, Scrapy para escalar, y parches propios para proxies, reintentos y bloqueos. Además, los selectores se rompen en cuanto el sitio cambia su HTML.

Scrapling unifica todo eso con una API común y añade dos cosas menos habituales: **seguimiento adaptativo de elementos** (vuelve a encontrar un elemento aunque el sitio haya cambiado su estructura, comparando similitud) y una capa pensada para **agentes de IA**.

## Cómo funciona

| Pieza                      | Qué hace                                                                                                                                                  |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Fetcher` / `FetcherSession` | Peticiones HTTP que pueden suplantar la huella TLS y las cabeceras de un navegador (por ejemplo `impersonate='chrome'`) y usar HTTP/3                       |
| `StealthyFetcher` / `StealthySession` | Navegador automatizado (Chromium de Playwright o Google Chrome) con suplantación de huella, renderizado de JavaScript y opción `solve_cloudflare` |
| Parser                     | Selectores CSS, XPath, búsqueda por texto y regex, navegación por el DOM, elementos similares y salida en Markdown limpio                                   |
| `Spider`                   | Crawler asíncrono con concurrencia, limitación por dominio, pausa y reanudación, streaming y exportación a JSON, JSONL, CSV y XML                          |
| MCP y Agent Skill          | Exponen la biblioteca a asistentes de IA (ver más abajo)                                                                                                  |

La **huella TLS** es la forma en que un cliente negocia la conexión cifrada: cifrados, extensiones y su orden. Muchos anti-bots distinguen a `curl` o `requests` de un Chrome real solo con ese dato, sin mirar el JavaScript. Por eso Scrapling separa dos niveles: el HTTP con huella de navegador, que es barato, y el navegador completo, que es caro pero ejecuta JavaScript.

Los spiders pueden mezclar ambos tipos de sesión y enrutar cada petición a una u otra por su ID. Incluyen detección y reintento de peticiones bloqueadas, **AutoThrottle** (ajusta el retardo por dominio según cómo responde el sitio y lo duplica si empieza a limitarte), respeto opcional de `robots.txt` con `robots_txt_obey`, rotación de proxies y un modo de desarrollo que cachea respuestas en disco para no volver a golpear el sitio mientras iteras.

## Instalación

Requiere Python 3.10 o superior.

```bash
pip install "scrapling[fetchers]"
scrapling install
```

`scrapling install` descarga los navegadores y sus dependencias del sistema. Los extras disponibles son `[ai]` (servidor MCP), `[rag]`, `[shell]` (shell interactiva y comando `extract`) y `[all]`. También hay imagen de Docker con todo incluido:

```bash
docker pull pyd4vinci/scrapling
```

## Uso

Una petición HTTP con huella de Chrome:

```python
from scrapling.fetchers import FetcherSession

with FetcherSession(impersonate='chrome') as session:
    page = session.get('https://quotes.toscrape.com/', stealthy_headers=True)
    quotes = page.css('.quote .text::text').getall()
```

Un spider mínimo que exporta a JSON:

```python
from scrapling.spiders import Spider, Response

class QuotesSpider(Spider):
    name = "quotes"
    start_urls = ["https://quotes.toscrape.com/"]

    async def parse(self, response: Response):
        for quote in response.css('.quote'):
            yield {"text": quote.css('.text::text').get()}

QuotesSpider().start().items.to_json("quotes.json")
```

Desde la terminal, sin escribir código:

```bash
scrapling extract get 'https://quotes.toscrape.com/' quotes.md
scrapling extract fetch 'https://quotes.toscrape.com/js/' quotes.md --css-selector '.quote' --wait-selector '.quote'
```

## Integración con IA

- **Servidor MCP.** Un servidor [MCP](/agents/claude-code/claude-code-mcp) (Model Context Protocol, el estándar con el que un asistente de IA llama a herramientas externas) que ofrece, según la documentación, diecisiete herramientas: peticiones HTTP, navegador sigiloso de una sola vez o con sesión persistente, capturas de pantalla, guardado y carga del estado de sesión, y consulta de las respuestas de API capturadas en segundo plano. Se instala con `pip install "scrapling[ai]"` y se arranca con el comando `scrapling-mcp`.
- **Agent Skill.** Una [skill](/agents/claude-code/claude-code-skills) llamada `scrapling-official` que enseña la API actual a los agentes de código para que no inventen métodos de versiones antiguas. Su `SKILL.md` obliga a usar `--ai-targeted` en la CLI como protección frente a inyección de prompts.

```bash
claude mcp add ScraplingServer "/ruta/a/tu/venv/bin/scrapling-mcp"
npx skills add D4Vinci/Scrapling --skill scrapling-official
```

La segunda línea usa la CLI de [skills.sh](/resources/ia/skills-sh), que detecta los agentes instalados.

## Cuándo conviene y cuándo no

Conviene si necesitas un solo stack para páginas estáticas, sitios con JavaScript y crawls grandes, si te importa que los selectores sobrevivan a cambios de HTML o si quieres dar a un agente de IA una herramienta de extracción con sesiones.

No conviene si el sitio ofrece una API oficial o un volcado de datos: es más estable y más limpio legalmente. Tampoco si solo necesitas automatizar pruebas de tu propia web; para eso [Playwright](/skills/ia-mcp/mcp-playwright) es más directo.

## Alternativas

| Opción                | Diferencia                                                                                   |
| --------------------- | -------------------------------------------------------------------------------------------- |
| Scrapy                | El crawler de referencia en Python; sin navegador ni evasión integrados. Scrapling puede usar su parser dentro de Scrapy con el decorador `scrapling_response` |
| BeautifulSoup / Parsel | Solo parsing; tú pones la descarga                                                          |
| Playwright / Puppeteer | Automatización de navegador general, sin crawler ni capa anti-detección                     |
| Servicios gestionados | APIs de scraping de pago que ponen proxies y navegadores por ti                              |

## Límites y precauciones

- **Legalidad.** Scrapear datos públicos no es automáticamente legal: depende del país, de los términos del sitio y de si hay datos personales. Para datos personales aplica el RGPD o la ley equivalente aunque estén publicados.
- **Evasión de anti-bots.** Es la función más vistosa y la más delicada. Saltarse un captcha o un desafío de Cloudflare es contrariar una decisión explícita del sitio.
- **Cifras del README.** Las comparativas de velocidad y el "92 % de cobertura de tests" salen del propio proyecto y de su script [`benchmarks.py`](https://github.com/D4Vinci/Scrapling/blob/main/benchmarks.py), no de una medición independiente.
- **Patrocinios.** El README incluye muchos patrocinadores de proxies residenciales y servicios anti-bot. Tenlo en cuenta al leer sus recomendaciones.
- **Carga en el servidor ajeno.** Usa AutoThrottle, límites de concurrencia y `robots_txt_obey` para no degradar el sitio que visitas.

## Fuentes

- [Repositorio y README](https://github.com/D4Vinci/Scrapling)
- [Documentación oficial](https://scrapling.readthedocs.io/en/latest/)
- [Guía del servidor MCP](https://scrapling.readthedocs.io/en/latest/ai/mcp-server.html)
- [Guía de la Agent Skill](https://scrapling.readthedocs.io/en/latest/ai/agent-skill.html)
- [Paquete en PyPI](https://pypi.org/project/scrapling/)
- [Licencia BSD-3-Clause](https://github.com/D4Vinci/Scrapling/blob/main/LICENSE)
