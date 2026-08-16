/**
 * Conserva el filename declarado en el meta del fence después de que Shiki
 * reemplace el árbol HAST del bloque.
 */
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
