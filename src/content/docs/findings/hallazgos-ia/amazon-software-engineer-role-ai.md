---
title: "Amazon actualiza el rol de desarrollador en la era de la IA"
description: "Resumen del memo interno que Amazon publicó en octubre de 2026 sobre la nueva guía del rol de Software Development Engineer: aprender IA cuanto antes, desconfiar de métricas como tokens o líneas de código, medir resultados y acercarse al cliente."
tags: [ia, amazon, carrera, desarrollo-de-software, metricas, productividad, liderazgo]
sidebar:
  order: 26
draft: false
resourceCategory: Artículo oficial
official: true
url: https://www.aboutamazon.com/news/company-news/amazon-software-engineer-role-guideline-ai
technologies:
  - agents/agents-fundamentos/coding-agents-fundamentals
note: "Publicado el 27 de octubre de 2026 en el blog corporativo de Amazon, firmado por Terk Terkowitz (VP y Distinguished Engineer, Worldwide Amazon Stores). Es un memo interno hecho público: describe la postura de Amazon, no un estándar del sector."
updatedAt: 2026-11-16
---

Amazon publicó en su blog corporativo [el memo](https://www.aboutamazon.com/news/company-news/amazon-software-engineer-role-guideline-ai) que acompaña a la nueva versión de su **guía del rol de SDE** (_Software Development Engineer_, el puesto de ingeniería de software en Amazon). La redactaron sus ingenieros de más rango (Distinguished y Senior Principal Engineers) a partir de lo que observaron en sus equipos más productivos. El texto está dirigido a los SDE y a los SDM (_Software Development Managers_, los responsables de equipo).

La tesis cabe en una frase del propio memo: los resultados que importan no cambian, aunque las entradas, las herramientas y las técnicas cambien más rápido que nunca.

## Por qué la guía no habla de herramientas concretas

Amazon nunca ha nombrado tecnologías en la guía del rol, ni con la nube, ni con los microservicios, ni con _serverless_. Esta vez debatieron si la IA era distinta y concluyeron que sí cambia el trabajo **más rápido y más a fondo** que esas tendencias. Aun así, decidieron no definir qué es "una buena práctica con IA": cualquier definición escrita hoy quedaría anticuada en un año y congelaría las prácticas de ingeniería.

La solución fue centrar la guía en lo que no cambia: el **impacto en los clientes, en el negocio y en los equipos**. El memo lo apoya en una cita de Jeff Bezos de 2012: la pregunta importante no es qué va a cambiar en diez años, sino qué no va a cambiar.

La entrada de Amazon presenta esta figura como el "Renaissance Developer": alguien que combina herramientas de IA con criterio humano y conocimiento del dominio para construir cosas nuevas.

## Las ideas del memo

### 1. Aprende IA ya

El memo es directo: aún es pronto, pero quien no aprenda se queda atrás. Si no la usas todavía, debes aprender a aplicarla en tu trabajo diario "lo antes posible"; si ya la usas, sigue buscando mejores prácticas, porque el ritmo de cambio es alto.

### 2. Las métricas de uso son defectuosas, pero no inútiles

Para medir la adopción, Amazon ha usado métricas de entrada (uso de tokens, adopción de herramientas de IA) y de volumen (cambios de código, revisiones). El memo reconoce que son "profundamente defectuosas" porque están desconectadas de lo que importa, y que convertidas en objetivo pueden empeorar las cosas:

| Métrica usada como objetivo | Efecto que advierte el memo                                                                                      |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| Tokens consumidos           | Más coste: el _tokenmaxxing_ (gastar tokens para inflar la cifra) choca con el principio de liderazgo de frugalidad |
| Líneas de código            | Más complejidad: medir líneas choca con el principio "inventar y simplificar"                                    |

Pero el memo no las descarta. Dice que, por ahora, estas métricas **se correlacionan bien** con los resultados: los equipos que más adoptaron la IA (los llama _frontier teams_) rinden más, y los que no la adoptan se están quedando atrás. Recomienda usarlas "con cuidado y criterio" y fijarse en dos extremos:

- **Percentil 10**: equipos que no están aprovechando la IA, para entender por qué.
- **Percentil 90**: equipos que la usan mucho, para comprobar si su entrega crece en proporción.

### 3. "No me sirve" también es un resultado

Si tu trabajo no se beneficia de las herramientas actuales, el memo dice que eso es un hallazgo, no un fracaso: documéntalo, compártelo con tus pares y tu responsable y busca soluciones. Saber explicar dónde la IA todavía no ayuda es precisamente el criterio que piden.

### 4. Los líderes, con las manos en la masa

A quien lidera un equipo se le pide entender estas herramientas usándolas, no por lo que oye. El listón es concreto: haberlas usado en trabajo de producción, poder describir una tarea en la que ayudaron y otra en la que no, y saber explicar ese juicio al equipo. También deben dar tiempo a su gente para aprender. "El criterio y el cuidado son clave", resume el memo.

### 5. Más cerca del cliente y del producto

Amazon observa que los ingenieros y responsables más cercanos a su producto y a su negocio son los que más partido sacan a la IA y al desarrollo agéntico, y que con el crecimiento de la empresa algunos se habían alejado de sus clientes. Quiere revertirlo: recomienda a los ingenieros de todos los niveles conectar a fondo con sus clientes y con la dirección de producto de su equipo, con más alcance cuanto más senior.

El cierre repite la idea central: la guía seguirá evolucionando, pero lo que importa no cambiará, la obsesión por el cliente y el foco a largo plazo en entregar resultados.

## Lo que el resumen viral simplifica

Circula un resumen de este memo en cinco puntos. Contrastado con el texto original:

| Punto del resumen                       | Qué dice realmente el memo                                                                                                                          |
| --------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| Aprende a usar IA ya                    | Correcto, casi literal.                                                                                                                             |
| Más tokens no es más productividad      | Matizado: los tokens son una mala meta, pero el memo dice que hoy se correlacionan con los resultados y que es apropiado usarlos con criterio.       |
| Más código no es más valor              | Implícito: critica medir líneas de código porque aumenta la complejidad.                                                                            |
| El criterio humano es clave             | Correcto ("Judgement and care are key"), dicho sobre todo de los líderes.                                                                           |
| Importan los resultados, no las herramientas | Correcto: es la tesis del memo.                                                                                                                |
| "No solo produces código, creas producto" | No aparece con esas palabras. Lo más cercano es la recomendación de conectar con el cliente y con la dirección de producto, y la obsesión por el cliente del cierre. |

## Qué sacar de esto si no trabajas en Amazon

- **Mide resultados, no actividad.** Si tu equipo empieza a medir tokens o líneas generadas, trátalo como señal para investigar, no como objetivo.
- **Forma tu propio criterio** sobre dónde ayuda un [agente de programación](/agents/agents-fundamentos/coding-agents-fundamentals) y dónde no, con ejemplos concretos de tu trabajo.
- **Conocer el producto y al usuario** es lo que, según Amazon, separa a quien aprovecha la IA de quien solo genera más código.

## Fuentes

- [An update from Amazon engineering leadership on the role of the developer in the age of AI](https://www.aboutamazon.com/news/company-news/amazon-software-engineer-role-guideline-ai) — About Amazon, 27 de octubre de 2026
