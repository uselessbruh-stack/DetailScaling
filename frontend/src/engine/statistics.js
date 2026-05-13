/**
 * Statistics collection and performance metrics for quadtree analysis.
 */

/**
 * Traverse the tree and collect comprehensive statistics.
 *
 * @param {import('./QuadTree.js').QuadTreeNode} root
 * @returns {object} Statistics object
 */
export function collectStats(root) {
  if (!root) {
    return {
      totalNodes: 0,
      leafNodes: 0,
      branchNodes: 0,
      maxDepth: 0,
      avgLeafDepth: 0,
      depthDistribution: {},
      maxVariance: 0,
      minVariance: Infinity,
      avgVariance: 0,
      totalPixelsCovered: 0,
    };
  }

  let totalNodes = 0;
  let leafNodes = 0;
  let branchNodes = 0;
  let maxDepth = 0;
  let leafDepthSum = 0;
  let maxVariance = 0;
  let minVariance = Infinity;
  let varianceSum = 0;
  let totalPixels = 0;
  const depthDistribution = {};

  function traverse(node) {
    if (!node) return;

    totalNodes++;
    maxDepth = Math.max(maxDepth, node.depth);

    // Track depth distribution
    depthDistribution[node.depth] = (depthDistribution[node.depth] || 0) + 1;

    if (node.isLeaf) {
      leafNodes++;
      leafDepthSum += node.depth;
      totalPixels += node.width * node.height;

      if (node.variance > maxVariance) maxVariance = node.variance;
      if (node.variance < minVariance) minVariance = node.variance;
      varianceSum += node.variance;
    } else {
      branchNodes++;
      if (node.children) {
        for (const child of node.children) {
          traverse(child);
        }
      }
    }
  }

  traverse(root);

  if (minVariance === Infinity) minVariance = 0;

  return {
    totalNodes,
    leafNodes,
    branchNodes,
    maxDepth,
    avgLeafDepth: leafNodes > 0 ? (leafDepthSum / leafNodes).toFixed(1) : 0,
    depthDistribution,
    maxVariance,
    minVariance,
    avgVariance: leafNodes > 0 ? (varianceSum / leafNodes).toFixed(1) : 0,
    totalPixelsCovered: totalPixels,
  };
}

/**
 * Estimate compression ratio based on leaf node count vs total pixel count.
 * Each leaf stores: avgColor (3 bytes) + bounds (4 × 2 bytes) + depth (1 byte) = ~12 bytes
 * vs original: totalPixels × 3 bytes (RGB)
 *
 * @param {number} leafNodes
 * @param {number} totalPixels
 * @returns {number} Compression ratio (e.g., 15.3 means 15.3:1)
 */
export function estimateCompressionRatio(leafNodes, totalPixels) {
  if (leafNodes === 0 || totalPixels === 0) return 1;

  const originalSize = totalPixels * 3; // RGB bytes
  const compressedSize = leafNodes * 12; // ~12 bytes per leaf node

  return parseFloat((originalSize / compressedSize).toFixed(1));
}

/**
 * Estimate memory reduction as a percentage.
 *
 * @param {number} leafNodes
 * @param {number} totalPixels
 * @returns {number} Percentage reduced (0-100)
 */
export function estimateMemoryReduction(leafNodes, totalPixels) {
  if (leafNodes === 0 || totalPixels === 0) return 0;

  const originalSize = totalPixels * 3;
  const compressedSize = leafNodes * 12;
  const reduction = ((originalSize - compressedSize) / originalSize) * 100;

  return Math.max(0, parseFloat(reduction.toFixed(1)));
}

/**
 * Measure execution time of a function.
 *
 * @param {Function} fn - Function to measure
 * @returns {{ result: any, time: number }} Result and time in milliseconds
 */
export function measureTime(fn) {
  const start = performance.now();
  const result = fn();
  const time = parseFloat((performance.now() - start).toFixed(2));
  return { result, time };
}

