import { visit } from 'unist-util-visit';

/**
 * Enlaces externos en otra pestaña. `noopener` evita que el destino
 * manipule esta página por `window.opener`; los internos no se tocan.
 */
export function rehypeExternalLinks() {
  return (tree) => {
    visit(tree, 'element', (node) => {
      if (node.tagName !== 'a') return;

      const href = node.properties?.href;
      if (typeof href !== 'string') return;
      if (!/^https?:\/\//i.test(href)) return;

      node.properties.target = '_blank';
      node.properties.rel = 'noopener noreferrer';
    });
  };
}
