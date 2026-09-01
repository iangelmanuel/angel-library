import { visit } from 'unist-util-visit';

/** Envuelve cada <pre> en .code-block y agrupa los tríos pnpm/bun/npm. */

/** Nodo HAST. */
function h(tagName, properties = {}, children = []) {
  return { type: 'element', tagName, properties, children };
}

function text(value) {
  return { type: 'text', value };
}

/** Propiedad en camelCase o con guiones. */
function prop(node, camel, hyphenated) {
  return node.properties?.[camel] ?? node.properties?.[hyphenated];
}

function copyButton(label) {
  const icon = h(
    'svg',
    {
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
    [
      h('rect', { width: 14, height: 14, x: 8, y: 8, rx: 2, ry: 2 }),
      h('path', { d: 'M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2' }),
    ],
  );

  return h(
    'button',
    { type: 'button', className: ['code-block__copy'], 'data-copy': '', ariaLabel: label, title: label },
    [icon, h('span', { 'data-copy-label': '' }, [text('copiar')])],
  );
}

function header(children) {
  return h('div', { className: ['code-block__header'] }, children);
}

/** Une el trío en un bloque con pestañas. */
function buildPmTabBlock(pres, group) {
  const isDefault = (pre) => prop(pre, 'dataPmDefault', 'data-pm-default') !== undefined;

  for (const pre of pres) {
    pre.properties ??= {};
    pre.properties.hidden = !isDefault(pre);
    // Sin borrar el marcador, el visitor reagruparía el mismo trío.
    delete pre.properties.dataPmGroup;
    delete pre.properties['data-pm-group'];
    pre.__pmHandled = true;
  }

  const tabs = h(
    'div',
    { className: ['code-block__pm-tabs'], role: 'tablist' },
    pres.map((pre) => {
      const pm = prop(pre, 'dataPm', 'data-pm');
      const className = isDefault(pre)
        ? ['code-block__pm-tab', 'is-active']
        : ['code-block__pm-tab'];
      return h('button', { type: 'button', className, 'data-pm-tab': pm }, [text(pm)]);
    }),
  );

  return h('div', { className: ['code-block', 'code-block--pm'], 'data-pm-group': group }, [
    header([tabs, copyButton('Copiar comando')]),
    ...pres,
  ]);
}

function pmGroupOf(node) {
  if (node?.type !== 'element' || node.tagName !== 'pre') return undefined;
  return prop(node, 'dataPmGroup', 'data-pm-group');
}

const isBlankText = (node) =>
  node?.type === 'text' && String(node.value ?? '').trim() === '';

/** Agrupa <pre> con el mismo data-pm-group. */
function groupConsecutivePmBlocks(children) {
  const result = [];
  let changed = false;
  let i = 0;

  while (i < children.length) {
    const group = pmGroupOf(children[i]);
    const run = [children[i]];
    let j = i + 1;

    // Los saltos entre bloques no rompen el trío.
    while (group && j < children.length) {
      if (isBlankText(children[j])) {
        j++;
        continue;
      }
      if (pmGroupOf(children[j]) !== group) break;
      run.push(children[j]);
      j++;
    }

    if (group && run.length === 3) {
      result.push(buildPmTabBlock(run, group));
      changed = true;
      i = j;
      continue;
    }

    result.push(children[i]);
    i++;
  }

  return changed ? result : children;
}

/** Etiqueta: archivo o lenguaje. */
function labelFor(pre) {
  const filename = prop(pre, 'dataFilename', 'data-filename');
  if (filename) return String(filename);

  const language = prop(pre, 'dataLanguage', 'data-language');
  if (language) return String(language);

  const code = pre.children.find(
    (child) => child.type === 'element' && child.tagName === 'code',
  );
  const languageClass = (code?.properties?.className ?? []).find(
    (name) => typeof name === 'string' && name.startsWith('language-'),
  );
  return languageClass ? String(languageClass).slice('language-'.length) : 'code';
}

export function rehypeCodeBlocks() {
  return (tree) => {
    visit(tree, (node) => {
      if (node.children) node.children = groupConsecutivePmBlocks(node.children);
    });

    visit(tree, 'element', (node, index, parent) => {
      if (!parent || index === undefined || node.tagName !== 'pre') return;
      if (node.__pmHandled) return;
      const hasCode = node.children.some(
        (child) => child.type === 'element' && child.tagName === 'code',
      );
      if (!hasCode) return;

      parent.children[index] = h('div', { className: ['code-block'] }, [
        header([h('span', { className: ['code-block__label'] }, [text(labelFor(node))]), copyButton('Copiar código')]),
        node,
      ]);
    });
  };
}
