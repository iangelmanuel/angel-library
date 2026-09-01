import { visit, SKIP } from 'unist-util-visit';
import { translateBlock } from './pm-commands.mjs';

const PM_LANGS = new Set(['bash', 'sh', 'shell']);

/**
 * Expande un bloque bash de instalación en tres (pnpm, bun, npm).
 * Corre en mdast, antes de Shiki, para que los tres se resalten igual.
 */
export function remarkPmTabs() {
  let counter = 0;

  return (tree) => {
    visit(tree, 'code', (node, index, parent) => {
      if (!parent || index === undefined) return;
      if (!node.lang || !PM_LANGS.has(node.lang)) return;

      const translated = translateBlock(node.value ?? '');
      if (!translated) return;

      const group = `pm${counter++}`;
      const variants = [
        { pm: 'pnpm', value: translated.pnpm, isDefault: true },
        { pm: 'bun', value: translated.bun, isDefault: false },
        { pm: 'npm', value: translated.npm, isDefault: false },
      ];

      const newNodes = variants.map((v) => ({
        type: 'code',
        lang: node.lang,
        meta: `pm="${v.pm}" pmGroup="${group}"${v.isDefault ? ' pmDefault' : ''}`,
        value: v.value,
      }));

      parent.children.splice(index, 1, ...newNodes);
      return [SKIP, index + newNodes.length];
    });
  };
}
