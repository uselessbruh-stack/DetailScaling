/**
 * Canvas rendering functions for quadtree visualization.
 * Handles grid overlay, compressed image, heatmap, and highlight rendering.
 */

/**
 * Render quadtree subdivision grid lines on canvas.
 *
 * @param {CanvasRenderingContext2D} ctx
 * @param {import('./QuadTree.js').QuadTreeNode} node
 * @param {object} options
 */
export function renderGrid(ctx, node, options = {}) {
  if (!node || node.isLeaf) return;

  const {
    lineColor = 'rgba(217, 119, 6, 0.6)',
    lineWidth = 0.5,
    depthFade = true,
    maxDepth = 8,
  } = options;

  if (node.children) {
    const halfW = Math.floor(node.width / 2);
    const halfH = Math.floor(node.height / 2);

    // Compute alpha based on depth for visual depth cue
    const alpha = depthFade
      ? Math.max(0.15, 1 - (node.depth / maxDepth) * 0.7)
      : 1;

    ctx.strokeStyle = depthFade
      ? `rgba(217, 119, 6, ${alpha})`
      : lineColor;
    ctx.lineWidth = Math.max(0.25, lineWidth - node.depth * 0.05);

    // Vertical split
    ctx.beginPath();
    ctx.moveTo(node.x + halfW, node.y);
    ctx.lineTo(node.x + halfW, node.y + node.height);
    ctx.stroke();

    // Horizontal split
    ctx.beginPath();
    ctx.moveTo(node.x, node.y + halfH);
    ctx.lineTo(node.x + node.width, node.y + halfH);
    ctx.stroke();

    // Recurse
    for (const child of node.children) {
      renderGrid(ctx, child, options);
    }
  }
}

/**
 * Render compressed image by filling each leaf node with its average color.
 *
 * @param {CanvasRenderingContext2D} ctx
 * @param {import('./QuadTree.js').QuadTreeNode} node
 */
export function renderCompressed(ctx, node) {
  if (!node) return;

  if (node.isLeaf) {
    const { r, g, b } = node.avgColor;
    ctx.fillStyle = `rgb(${r},${g},${b})`;
    ctx.fillRect(node.x, node.y, node.width, node.height);
  } else if (node.children) {
    for (const child of node.children) {
      renderCompressed(ctx, child);
    }
  }
}

/**
 * Render variance heatmap overlay.
 * Red = high variance (detail), Green = low variance (flat).
 * No blue used per design requirements.
 *
 * @param {CanvasRenderingContext2D} ctx
 * @param {import('./QuadTree.js').QuadTreeNode} node
 * @param {number} maxVariance - Maximum variance in the tree for normalization
 */
export function renderHeatmap(ctx, node, maxVariance) {
  if (!node) return;

  if (node.isLeaf) {
    const intensity = maxVariance > 0 ? Math.min(node.variance / maxVariance, 1) : 0;
    const r = Math.round(220 * intensity + 20);
    const g = Math.round(180 * (1 - intensity) + 20);
    const b = 20;
    ctx.fillStyle = `rgba(${r},${g},${b},0.55)`;
    ctx.fillRect(node.x, node.y, node.width, node.height);
  } else if (node.children) {
    for (const child of node.children) {
      renderHeatmap(ctx, child, maxVariance);
    }
  }
}

/**
 * Highlight a specific node (for spatial inspector hover).
 *
 * @param {CanvasRenderingContext2D} ctx
 * @param {import('./QuadTree.js').QuadTreeNode} node
 */
export function highlightNode(ctx, node) {
  if (!node) return;

  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 2;
  ctx.setLineDash([4, 2]);
  ctx.strokeRect(node.x, node.y, node.width, node.height);
  ctx.setLineDash([]);

  // Semi-transparent fill
  ctx.fillStyle = 'rgba(245, 158, 11, 0.08)';
  ctx.fillRect(node.x, node.y, node.width, node.height);
}

/**
 * Animate quadtree decomposition progressively using requestAnimationFrame.
 * Renders nodes level by level for a visual "splitting" effect.
 *
 * @param {CanvasRenderingContext2D} ctx
 * @param {import('./QuadTree.js').QuadTreeNode[]} bfsNodes - Nodes in BFS order
 * @param {number} canvasWidth
 * @param {number} canvasHeight
 * @param {Uint8ClampedArray} originalData - Original image pixel data
 * @param {number} imgWidth - Original image width
 * @param {Function} onComplete - Callback when animation completes
 * @param {object} options
 * @returns {{ cancel: Function }} - Animation cancel handle
 */
export function animateDecomposition(ctx, bfsNodes, canvasWidth, canvasHeight, originalData, imgWidth, onComplete, options = {}) {
  const { nodesPerFrame = 20, gridColor = 'rgba(217, 119, 6, 0.6)' } = options;

  let currentIndex = 0;
  let animFrameId = null;
  let cancelled = false;

  function drawFrame() {
    if (cancelled) return;

    const end = Math.min(currentIndex + nodesPerFrame, bfsNodes.length);

    for (let i = currentIndex; i < end; i++) {
      const node = bfsNodes[i];

      if (node.isLeaf) {
        // Fill with average color
        const { r, g, b } = node.avgColor;
        ctx.fillStyle = `rgb(${r},${g},${b})`;
        ctx.fillRect(node.x, node.y, node.width, node.height);
      } else if (node.children) {
        // Draw split lines
        const halfW = Math.floor(node.width / 2);
        const halfH = Math.floor(node.height / 2);

        ctx.strokeStyle = gridColor;
        ctx.lineWidth = 0.5;

        ctx.beginPath();
        ctx.moveTo(node.x + halfW, node.y);
        ctx.lineTo(node.x + halfW, node.y + node.height);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(node.x, node.y + halfH);
        ctx.lineTo(node.x + node.width, node.y + halfH);
        ctx.stroke();
      }
    }

    currentIndex = end;

    if (currentIndex < bfsNodes.length) {
      animFrameId = requestAnimationFrame(drawFrame);
    } else {
      onComplete && onComplete();
    }
  }

  animFrameId = requestAnimationFrame(drawFrame);

  return {
    cancel: () => {
      cancelled = true;
      if (animFrameId) cancelAnimationFrame(animFrameId);
    },
  };
}
