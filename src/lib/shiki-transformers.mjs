/** Conserva `title=` del fence como data-filename. */
export function transformerCodeFilename() {
  function filenameFromMeta(meta) {
    const raw = meta && typeof meta === 'object' && '__raw' in meta ? meta.__raw : meta;
    const match = /title=(?:"([^"]+)"|'([^']+)'|([^\s]+))/.exec(String(raw ?? ''));
    return match?.[1] ?? match?.[2] ?? match?.[3];
  }

  return {
    name: 'angel-library-code-filename',
    preprocess(code, options) {
      const filename = filenameFromMeta(options.meta);
      if (filename) {
        const existing = options.meta && typeof options.meta === 'object' ? options.meta : {};
        options.meta = { ...existing, 'data-filename': filename };
      }
      return code;
    },
    pre(node) {
      const filename = filenameFromMeta(this.options.meta);

      if (filename) {
        node.properties ??= {};
        node.properties['data-filename'] = filename;
      }
    },
    root(root) {
      const filename = filenameFromMeta(this.options.meta);
      if (filename) {
        const pre = root.children.find((child) => child.type === 'element' && child.tagName === 'pre');
        if (pre) {
          pre.properties ??= {};
          pre.properties['data-filename'] = filename;
        }
      }
    },
  };
}

/** Conserva el meta de remarkPmTabs como atributos data-pm. */
export function transformerPackageManagerMeta() {
  function fromMeta(meta) {
    const raw = meta && typeof meta === 'object' && '__raw' in meta ? meta.__raw : meta;
    const str = String(raw ?? '');
    const pm = /pm="([^"]+)"/.exec(str)?.[1];
    const group = /pmGroup="([^"]+)"/.exec(str)?.[1];
    const isDefault = /(?:^|\s)pmDefault(?:\s|$)/.test(str);
    return pm ? { pm, group, isDefault } : null;
  }

  function apply(node, meta) {
    const info = fromMeta(meta);
    if (!info) return;
    node.properties ??= {};
    node.properties['data-pm'] = info.pm;
    if (info.group) node.properties['data-pm-group'] = info.group;
    if (info.isDefault) node.properties['data-pm-default'] = '';
  }

  return {
    name: 'angel-library-pm-tabs',
    pre(node) {
      apply(node, this.options.meta);
    },
    root(root) {
      const pre = root.children.find((child) => child.type === 'element' && child.tagName === 'pre');
      if (pre) apply(pre, this.options.meta);
    },
  };
}
