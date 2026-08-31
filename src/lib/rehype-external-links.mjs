import { visit } from 'unist-util-visit';

/**
 * Los enlaces externos del Markdown se abren en otra pestaña.
 *
 * `rel` no es decoración: sin `noopener`, la página destino recibe una
 * referencia a la nuestra por `window.opener` y puede redirigirla.
 * `noreferrer` además evita enviar la URL de origen.
 *
 * Los enlaces internos (`/ruta`, `#ancla`) se dejan igual para no romper
 * la navegación con View Transitions.
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
