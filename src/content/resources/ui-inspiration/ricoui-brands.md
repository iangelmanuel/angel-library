---
title: "RICOUI Brands — sistemas visuales de marcas reales en DESIGN.md"
description: "Colección de archivos DESIGN.md que describen el sistema visual de marcas conocidas, con tokens de color, tipografía y componentes listos para pasar a un asistente de IA."
type: resources
tags: [ui, diseno, design-system, tokens, ia, tailwind]
url: https://design.ricoui.com/brands
resourceCategory: ui-inspiration
official: false
personalNote: "Contra el problema de que cada IA genere la misma interfaz genérica: en vez de pedir 'algo bonito', le pasas un sistema visual concreto y decidido."
updatedAt: 2026-09-01
---

Una colección de **69 marcas** —Apple, Airbnb, Airtable, Binance, Tesla, Shopify, Stripe, Notion…— documentadas como un sistema de diseño legible por una IA.

## El problema que resuelve

Un asistente de código sin dirección visual produce siempre la misma interfaz: fondo blanco, azul por defecto, esquinas medio redondeadas. No porque no sepa, sino porque nadie le dijo qué aspecto tener.

Estos archivos son esa instrucción. En vez de describir un estilo con adjetivos, le pasas la descripción concreta de un sistema que ya existe y funciona.

## Qué trae cada marca

Al abrir una ficha aparecen tres formatos del mismo sistema:

- **`DESIGN.md`** — la referencia en prosa y tablas: descripción del lenguaje visual, web de origen y una tabla de tokens con nombre, valor, variable CSS y el papel que cumple cada color.
- **`Tailwind v4`** — la configuración equivalente.
- **`CSS Variables`** — los tokens sueltos para pegar en una hoja de estilos.

Cada archivo se copia con un botón o se descarga; también hay un _Download all_ con el paquete completo.

Un ejemplo de cómo describen una marca, la ficha de Apple: _interfaz que antepone la fotografía, mosaicos de producto a sangre alternando lienzos claros y oscuros, titulares en SF Pro Display con interletraje negativo y un único azul interactivo (#0066cc)_. Eso es accionable; "estilo Apple" no lo es.

## Cómo está organizado

Catálogo filtrable por **modo** (claro u oscuro), por **categoría** —Developer Tools & IDEs, AI & LLM Platforms, Productivity & SaaS, Fintech & Crypto, Automotive, Travel & Mobility y ocho más— y por **etiquetas**: Design System, Light UI, Gradient, Developer-focused, Editorial, Minimal, Dark UI, Playful, Enterprise, Luxury, Monochrome.

Está en beta. Se puede navegar, copiar y descargar sin cuenta; iniciar sesión solo sirve para sincronizar favoritos y la biblioteca entre dispositivos.

## Cómo usarlo

Guarda el `DESIGN.md` de la marca en la raíz del proyecto y menciónalo en las instrucciones del asistente, igual que harías con cualquier documento de contexto. A partir de ahí, cuando pidas un componente, tiene los colores, la tipografía y el espaciado que debe respetar.

Un aviso: estos sistemas describen **marcas ajenas**. Sirven de referencia, de estudio y de punto de partida, pero copiar la identidad completa de una empresa en un producto propio es otra cosa. Lo razonable es tomar las decisiones estructurales —escala tipográfica, papel de cada color, densidad— y sustituir los valores por los tuyos.
