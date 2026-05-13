/**
 * Serialization utilities for quadtree import/export.
 */

/**
 * Serialize a quadtree to a plain JSON-serializable object.
 *
 * @param {import('./QuadTree.js').QuadTreeNode} node
 * @returns {object}
 */
export function serializeTree(node) {
  if (!node) return null;

  const obj = {
    x: node.x,
    y: node.y,
    w: node.width,
    h: node.height,
    d: node.depth,
    v: Math.round(node.variance * 100) / 100,
    c: [node.avgColor.r, node.avgColor.g, node.avgColor.b],
  };

  if (node.children) {
    obj.ch = node.children.map(serializeTree);
  }

  return obj;
}

/**
 * Deserialize a plain object back into a QuadTreeNode structure.
 * Note: This creates plain objects with the same shape, not class instances.
 *
 * @param {object} obj
 * @returns {object} Node-like object
 */
export function deserializeTree(obj) {
  if (!obj) return null;

  const node = {
    x: obj.x,
    y: obj.y,
    width: obj.w,
    height: obj.h,
    depth: obj.d,
    variance: obj.v,
    avgColor: { r: obj.c[0], g: obj.c[1], b: obj.c[2] },
    children: obj.ch ? obj.ch.map(deserializeTree) : null,
    get isLeaf() {
      return this.children === null;
    },
    get pixelCount() {
      return this.width * this.height;
    },
  };

  return node;
}

/**
 * Export tree as a downloadable JSON file.
 *
 * @param {import('./QuadTree.js').QuadTreeNode} root
 * @param {string} filename
 */
export function exportTreeAsJSON(root, filename = 'quadtree.json') {
  const serialized = serializeTree(root);
  const json = JSON.stringify(serialized, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();

  URL.revokeObjectURL(url);
}

/**
 * Export a canvas as a PNG image download.
 *
 * @param {HTMLCanvasElement} canvas
 * @param {string} filename
 */
export function exportCanvasAsPNG(canvas, filename = 'compressed.png') {
  const url = canvas.toDataURL('image/png');
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
}
