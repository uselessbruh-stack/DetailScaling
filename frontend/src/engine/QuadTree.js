/**
 * QuadTree — Recursive spatial partitioning engine for image compression.
 *
 * Builds a quadtree by recursively subdividing image regions based on
 * color variance. Regions with variance above the threshold are split
 * into four quadrants; regions below are stored as leaf nodes with
 * their average color.
 */

import { calculateRegionStats } from './variance.js';

/**
 * A single node in the quadtree.
 */
export class QuadTreeNode {
  constructor(x, y, width, height, depth) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.depth = depth;
    this.children = null;   // null = leaf, [4] = branch
    this.avgColor = null;   // { r, g, b }
    this.variance = 0;
  }

  get isLeaf() {
    return this.children === null;
  }

  get pixelCount() {
    return this.width * this.height;
  }
}

/**
 * Build a quadtree from image data.
 *
 * @param {Uint8ClampedArray} data - Raw RGBA pixel data
 * @param {number} imgWidth - Full image width
 * @param {number} x - Region x offset
 * @param {number} y - Region y offset
 * @param {number} w - Region width
 * @param {number} h - Region height
 * @param {number} threshold - Variance threshold for subdivision (0-10000)
 * @param {number} maxDepth - Maximum recursion depth
 * @param {number} currentDepth - Current depth in the tree
 * @returns {QuadTreeNode}
 */
export function buildQuadTree(data, imgWidth, x, y, w, h, threshold, maxDepth = 8, currentDepth = 0) {
  const node = new QuadTreeNode(x, y, w, h, currentDepth);

  // Analyze this region
  const { variance, avgColor } = calculateRegionStats(data, imgWidth, x, y, w, h);
  node.variance = variance;
  node.avgColor = avgColor;

  // Leaf conditions: variance is acceptable, max depth reached, or region too small
  if (variance <= threshold || currentDepth >= maxDepth || w <= 2 || h <= 2) {
    return node;
  }

  // Subdivide into 4 quadrants
  const halfW = Math.floor(w / 2);
  const halfH = Math.floor(h / 2);
  const remainW = w - halfW;
  const remainH = h - halfH;

  node.children = [
    buildQuadTree(data, imgWidth, x, y, halfW, halfH, threshold, maxDepth, currentDepth + 1),
    buildQuadTree(data, imgWidth, x + halfW, y, remainW, halfH, threshold, maxDepth, currentDepth + 1),
    buildQuadTree(data, imgWidth, x, y + halfH, halfW, remainH, threshold, maxDepth, currentDepth + 1),
    buildQuadTree(data, imgWidth, x + halfW, y + halfH, remainW, remainH, threshold, maxDepth, currentDepth + 1),
  ];

  return node;
}

/**
 * Find the leaf node containing a given pixel coordinate.
 * Used for spatial inspection (hover detection).
 *
 * @param {QuadTreeNode} node - Root node to search from
 * @param {number} px - Pixel X coordinate
 * @param {number} py - Pixel Y coordinate
 * @returns {QuadTreeNode|null}
 */
export function findNodeAtPoint(node, px, py) {
  if (!node) return null;

  // Check if point is within this node's bounds
  if (px < node.x || px >= node.x + node.width ||
      py < node.y || py >= node.y + node.height) {
    return null;
  }

  // If leaf, this is the node
  if (node.isLeaf) return node;

  // Search children
  for (const child of node.children) {
    const found = findNodeAtPoint(child, px, py);
    if (found) return found;
  }

  return node;
}

/**
 * Collect all nodes at a specific depth level.
 *
 * @param {QuadTreeNode} node
 * @param {number} targetDepth
 * @param {QuadTreeNode[]} result
 * @returns {QuadTreeNode[]}
 */
export function getNodesAtDepth(node, targetDepth, result = []) {
  if (!node) return result;

  if (node.depth === targetDepth || node.isLeaf) {
    result.push(node);
    return result;
  }

  if (node.children) {
    for (const child of node.children) {
      getNodesAtDepth(child, targetDepth, result);
    }
  }

  return result;
}

/**
 * Collect all leaf nodes (for compressed image reconstruction).
 *
 * @param {QuadTreeNode} node
 * @param {QuadTreeNode[]} result
 * @returns {QuadTreeNode[]}
 */
export function collectLeafNodes(node, result = []) {
  if (!node) return result;

  if (node.isLeaf) {
    result.push(node);
    return result;
  }

  if (node.children) {
    for (const child of node.children) {
      collectLeafNodes(child, result);
    }
  }

  return result;
}

/**
 * Flatten the entire tree into an ordered list for animated rendering.
 * Returns nodes in breadth-first order so animation progresses level by level.
 *
 * @param {QuadTreeNode} root
 * @returns {QuadTreeNode[]}
 */
export function flattenBFS(root) {
  if (!root) return [];

  const result = [];
  const queue = [root];

  while (queue.length > 0) {
    const node = queue.shift();
    result.push(node);

    if (node.children) {
      for (const child of node.children) {
        queue.push(child);
      }
    }
  }

  return result;
}
