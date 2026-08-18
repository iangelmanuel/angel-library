import { visit, SKIP } from 'unist-util-visit';
import { translateBlock } from './pm-commands.mjs';

const PM_LANGS = new Set(['bash', 'sh', 'shell']);

/**
 * Plugin remark: busca bloques de código bash/sh/shell cuyo contenido es
 * enteramente comandos npm install/i/npx, y los expande a 3 bloques
 * (pnpm, bun, npm) con meta `pm="..." pmGroup="..." pmDefault` — el mismo
 * mecanismo de meta que ya lee `transformerCodeFilename` para `title=`.
 *
 * Corre en mdast, ANTES de que Shiki resalte el código, así los 3 bloques
 * generados se resaltan igual que cualquier otro (nada de HTML a mano acá).
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
