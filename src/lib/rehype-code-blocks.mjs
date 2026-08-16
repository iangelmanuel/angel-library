import { visit } from 'unist-util-visit';

/**
 * Plugin rehype que envuelve los bloques de código (<pre>) generados por
 * Shiki en una estructura con cabecera:
 *
 *   <div class="code-block">
 *     <div class="code-block__header">
 *       <span class="code-block__label">archivo.ts | lenguaje</span>
 *       <button data-copy>…copiar…</button>
 *     </div>
 *     <pre class="shiki">…</pre>
 *   </div>
 *
 * El nombre de archivo se declara en el meta del fence:
 *   ```ts title="src/app.ts"
 *
 * El botón de copiar no lleva JavaScript inline: un único listener global
 * (delegación de eventos en BaseLayout) se encarga de todos los bloques.
 */

function copyIcon() {
  return {
    type: 'element',
    tagName: 'svg',
    properties: {
      xmlns: 'http://www.w3.org/2000/svg',
      width: 13,
      height: 13,
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      strokeWidth: 2,
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
      'aria-hidden': 'true',
    },
    children: [
      {
        type: 'element',
        tagName: 'rect',
        properties: { width: 14, height: 14, x: 8, y: 8, rx: 2, ry: 2 },
        children: [],
      },
      {
        type: 'element',
        tagName: 'path',
        properties: { d: 'M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2' },
        children: [],
      },
    ],
  };
}

export function rehypeCodeBlocks() {
  return (tree) => {
    visit(tree, 'element', (node, index, parent) => {
      if (!parent || index === undefined || node.tagName !== 'pre') return;

      const code = node.children.find(
        (child) => child.type === 'element' && child.tagName === 'code',
      );
      if (!code) return;

      const classes = code.properties?.className ?? [];
      const langClass = classes.find(
        (cls) => typeof cls === 'string' && cls.startsWith('language-'),
      );
      const languageFromPre =
        node.properties?.dataLanguage ?? node.properties?.['data-language'];
      const lang = languageFromPre
        ? String(languageFromPre)
        : langClass
          ? String(langClass).slice('language-'.length)
          : '';

      const filename =
        node.properties?.dataFilename ?? node.properties?.['data-filename'];
      const label = filename ? String(filename) : lang || 'code';

      const header = {
        type: 'element',
        tagName: 'div',
        properties: { className: ['code-block__header'] },
        children: [
          {
            type: 'element',
            tagName: 'span',
            properties: { className: ['code-block__label'] },
            children: [{ type: 'text', value: label }],
          },
          {
            type: 'element',
            tagName: 'button',
            properties: {
              type: 'button',
              className: ['code-block__copy'],
              'data-copy': '',
              ariaLabel: 'Copiar código',
              title: 'Copiar código',
            },
            children: [
              copyIcon(),
              {
                type: 'element',
                tagName: 'span',
                properties: { 'data-copy-label': '' },
                children: [{ type: 'text', value: 'copiar' }],
              },
            ],
          },
        ],
      };

      parent.children[index] = {
        type: 'element',
        tagName: 'div',
        properties: { className: ['code-block'] },
        children: [header, node],
      };
    });
  };
}
