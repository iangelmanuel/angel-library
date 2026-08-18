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
 *
 * Además, antes de ese paso, agrupa tríos de `<pre data-pm-group="X">`
 * consecutivos (generados por `remarkPmTabs` — 3 variantes pnpm/bun/npm del
 * mismo comando) en un solo `.code-block.code-block--pm` con tabs, en vez de
 * 3 bloques sueltos. Ver `remark-pm-tabs.mjs` y `shiki-transformers.mjs`.
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

function copyButton(label) {
  return {
    type: 'element',
    tagName: 'button',
    properties: {
      type: 'button',
      className: ['code-block__copy'],
      'data-copy': '',
      ariaLabel: label,
      title: label,
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
  };
}

function getData(node, camel, hyphenated) {
  return node.properties?.[camel] ?? node.properties?.[hyphenated];
}

function pmTabButton(pm, isActive) {
  return {
    type: 'element',
    tagName: 'button',
    properties: {
      type: 'button',
      className: isActive ? ['code-block__pm-tab', 'is-active'] : ['code-block__pm-tab'],
      'data-pm-tab': pm,
    },
    children: [{ type: 'text', value: pm }],
  };
}

/** Agrupa un trío [pnpm, bun, npm] de <pre> en un solo .code-block--pm con tabs. */
function buildPmTabBlock(pres, group) {
  for (const pre of pres) {
    const isDefault = getData(pre, 'dataPmDefault', 'data-pm-default') !== undefined;
    pre.properties ??= {};
    pre.properties.hidden = !isDefault;
    // Borrar el marcador de grupo: si no, el mismo trío se reagruparía de
    // nuevo (infinitamente) cuando el visitor entra a los hijos del wrapper
    // que acabamos de crear.
    delete pre.properties.dataPmGroup;
    delete pre.properties['data-pm-group'];
    pre.__pmHandled = true;
  }

  const tabs = {
    type: 'element',
    tagName: 'div',
    properties: { className: ['code-block__pm-tabs'], role: 'tablist' },
    children: pres.map((pre) => {
      const pm = getData(pre, 'dataPm', 'data-pm');
      const isDefault = getData(pre, 'dataPmDefault', 'data-pm-default') !== undefined;
      return pmTabButton(pm, isDefault);
    }),
  };

  const header = {
    type: 'element',
    tagName: 'div',
    properties: { className: ['code-block__header'] },
    children: [tabs, copyButton('Copiar comando')],
  };

  return {
    type: 'element',
    tagName: 'div',
    properties: { className: ['code-block', 'code-block--pm'], 'data-pm-group': group },
    children: [header, ...pres],
  };
}

/** Recorre un array de hijos y agrupa tríos consecutivos con el mismo data-pm-group. */
function groupConsecutivePmBlocks(children) {
  let changed = false;
  const result = [];
  let i = 0;

  while (i < children.length) {
    const node = children[i];
    const group =
      node?.type === 'element' && node.tagName === 'pre' ? getData(node, 'dataPmGroup', 'data-pm-group') : undefined;

    if (group) {
      const run = [node];
      let j = i + 1;
      while (j < children.length) {
        const next = children[j];
        const nextGroup =
          next?.type === 'element' && next.tagName === 'pre' ? getData(next, 'dataPmGroup', 'data-pm-group') : undefined;
        if (nextGroup === group) {
          run.push(next);
          j++;
        } else break;
      }

      if (run.length === 3) {
        result.push(buildPmTabBlock(run, group));
        i = j;
        changed = true;
        continue;
      }
    }

    result.push(node);
    i++;
  }

  return changed ? result : children;
}

export function rehypeCodeBlocks() {
  return (tree) => {
    // Paso 1: agrupar tríos pnpm/bun/npm antes de envolver cada <pre> suelto.
    visit(tree, (node) => {
      if (node.children) node.children = groupConsecutivePmBlocks(node.children);
    });

    // Paso 2: envolver cada <pre> individual restante (los que no son parte
    // de un grupo pm, que ya quedaron anidados dentro de su propio wrapper).
    visit(tree, 'element', (node, index, parent) => {
      if (!parent || index === undefined || node.tagName !== 'pre') return;
      if (node.__pmHandled) return;

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
          copyButton('Copiar código'),
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
