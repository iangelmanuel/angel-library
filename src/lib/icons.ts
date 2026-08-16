import { readFileSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Loader de iconos en build: lee el SVG de lucide-static (iconos genéricos,
 * `lucide.dev/icons`), resuelve un puñado de marcas propias en texto/forma
 * ("brand-css", "brand-typescript", "brand-zod", "brand-astro" —el logo real
 * de Astro—, "brand-react", "brand-nextjs") o recolorea un icono lucide
 * existente a un tono fijo en vez de currentColor ("stack-dependency" →
 * `package` en verde, "stack-component" → `component` en amarillo).
 * Los logos oficiales completos de marca a veces no se leen bien a 14-16px
 * (CSS/TS/Zod/Next son glifos simples a propósito por eso); el de Astro sí
 * es el trazo real de su isotipo, que a esta escala se sigue leyendo bien.
 * Devuelve HTML listo para `set:html`. Cero JavaScript en el cliente.
 */

const cache = new Map<string, string>();

const BRAND_ICONS: Record<string, string> = {
  'brand-typescript':
    '<svg viewBox="0 0 24 24"><text x="12" y="16.5" text-anchor="middle" font-family="ui-sans-serif, system-ui, sans-serif" font-size="10.5" font-weight="700" fill="#3178C6">TS</text></svg>',
  'brand-css':
    '<svg viewBox="0 0 24 24"><text x="12" y="17" text-anchor="middle" font-family="ui-monospace, monospace" font-size="15" font-weight="700" fill="#c4b5fd">{}</text></svg>',
  'brand-zod':
    '<svg viewBox="0 0 24 24"><text x="12" y="17" text-anchor="middle" font-family="ui-sans-serif, system-ui, sans-serif" font-size="14" font-weight="700" fill="#67e8f9">Z</text></svg>',
  'brand-astro':
    '<svg viewBox="0 0 24 24" fill="#FF5D01"><path d="M8.358 20.162c-1.186-1.07-1.532-3.316-1.038-4.944.856 1.026 2.043 1.352 3.272 1.535 1.897.283 3.76.177 5.522-.678.202-.098.388-.229.608-.36.166.473.209.95.151 1.437-.14 1.185-.738 2.1-1.688 2.794-.38.277-.782.525-1.175.787-1.205.804-1.531 1.747-1.078 3.119l.044.148a3.158 3.158 0 0 1-1.407-1.188 3.31 3.31 0 0 1-.544-1.815c-.004-.32-.004-.642-.048-.958-.106-.769-.472-1.113-1.161-1.133-.707-.02-1.267.411-1.415 1.09-.012.053-.028.104-.045.165h.002zm-5.961-4.445s3.24-1.575 6.49-1.575l2.451-7.565c.092-.366.36-.614.662-.614.302 0 .57.248.662.614l2.45 7.565c3.85 0 6.491 1.575 6.491 1.575L16.088.727C15.93.285 15.663 0 15.303 0H8.697c-.36 0-.615.285-.784.727l-5.516 14.99z"/></svg>',
  'brand-nextjs':
    '<svg viewBox="0 0 24 24" fill="#ececee"><path d="M18.665 21.978C16.758 23.255 14.465 24 12 24 5.377 24 0 18.623 0 12S5.377 0 12 0s12 5.377 12 12c0 3.583-1.574 6.801-4.067 9.001L9.219 7.2H7.2v9.596h1.615V9.251l9.85 12.727Zm-3.332-8.533 1.6 2.061V7.2h-1.6v6.245Z"/></svg>',
  'brand-react':
    '<svg viewBox="-11.5 -10.23174 23 20.46348"><circle cx="0" cy="0" r="2.05" fill="#61dafb" /><g stroke="#61dafb" stroke-width="1" fill="none"><ellipse rx="11" ry="4.2" /><ellipse rx="11" ry="4.2" transform="rotate(60)" /><ellipse rx="11" ry="4.2" transform="rotate(120)" /></g></svg>',
};

/** Icono lucide recoloreado a un tono fijo (en vez de heredar currentColor). */
const RECOLORED_ICONS: Record<string, { base: string; color: string }> = {
  'stack-component': { base: 'component', color: '#facc15' },
  'stack-dependency': { base: 'package', color: '#4ade80' },
};

function readLucideSvg(name: string): string {
  let svg = cache.get(name);
  if (!svg) {
    try {
      svg = readFileSync(
        join(process.cwd(), 'node_modules', 'lucide-static', 'icons', `${name}.svg`),
        'utf8',
      );
    } catch {
      throw new Error(
        `Icono "${name}" no encontrado en lucide-static. Revisa el nombre en https://lucide.dev/icons`,
      );
    }
    cache.set(name, svg);
  }
  return svg;
}

export function getIcon(name: string, className?: string): string {
  const brand = BRAND_ICONS[name];
  if (brand) {
    return brand.replace(
      '<svg',
      `<svg class="${className ?? 'size-4'}" aria-hidden="true" focusable="false"`,
    );
  }

  const recolor = RECOLORED_ICONS[name];
  let svg = readLucideSvg(recolor?.base ?? name);

  svg = svg
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/(<svg[\s\S]*?)\sclass="[^"]*"/, '$1');

  if (recolor) {
    svg = svg.replace(/currentColor/g, recolor.color);
  }

  return svg
    .replace(
      '<svg',
      `<svg class="${className ?? 'size-4'}" aria-hidden="true" focusable="false"`,
    )
    .trim();
}
