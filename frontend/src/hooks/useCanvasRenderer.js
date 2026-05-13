/**
 * useCanvasRenderer — Manages drawing onto canvas elements.
 * Handles original image, grid overlay, compressed view, and heatmap.
 */

import { useCallback, useRef } from 'react';
import { renderGrid, renderCompressed, renderHeatmap, highlightNode, animateDecomposition } from '../engine/renderer.js';
import { flattenBFS } from '../engine/QuadTree.js';

export function useCanvasRenderer() {
  const animationRef = useRef(null);

  /**
   * Draw the original image onto a canvas.
   */
  const drawOriginal = useCallback((canvas, imageData) => {
    if (!canvas || !imageData) return;

    const ctx = canvas.getContext('2d');
    canvas.width = imageData.width;
    canvas.height = imageData.height;
    ctx.putImageData(imageData, 0, 0);
  }, []);

  /**
   * Draw the quadtree grid overlay.
   */
  const drawGrid = useCallback((canvas, tree, imageData, options = {}) => {
    if (!canvas || !tree) return;

    const ctx = canvas.getContext('2d');
    canvas.width = imageData.width;
    canvas.height = imageData.height;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Draw original image first as background
    ctx.putImageData(imageData, 0, 0);
    renderGrid(ctx, tree, options);
  }, []);

  /**
   * Draw the compressed (reconstructed) image.
   */
  const drawCompressed = useCallback((canvas, tree, width, height) => {
    if (!canvas || !tree) return;

    const ctx = canvas.getContext('2d');
    canvas.width = width;
    canvas.height = height;
    ctx.clearRect(0, 0, width, height);
    renderCompressed(ctx, tree);
  }, []);

  /**
   * Draw heatmap overlay.
   */
  const drawHeatmap = useCallback((canvas, tree, imageData, maxVariance) => {
    if (!canvas || !tree || !imageData) return;

    const ctx = canvas.getContext('2d');
    canvas.width = imageData.width;
    canvas.height = imageData.height;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Draw original image as background
    ctx.putImageData(imageData, 0, 0);
    renderHeatmap(ctx, tree, maxVariance);
  }, []);

  /**
   * Draw node highlight for spatial inspector.
   */
  const drawHighlight = useCallback((canvas, node) => {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (node) {
      highlightNode(ctx, node);
    }
  }, []);

  /**
   * Run animated decomposition.
   */
  const startAnimation = useCallback((canvas, tree, imageData, onComplete) => {
    if (!canvas || !tree || !imageData) return;

    // Cancel any running animation
    if (animationRef.current) {
      animationRef.current.cancel();
    }

    const ctx = canvas.getContext('2d');
    canvas.width = imageData.width;
    canvas.height = imageData.height;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const bfsNodes = flattenBFS(tree);

    animationRef.current = animateDecomposition(
      ctx, bfsNodes,
      imageData.width, imageData.height,
      imageData.data, imageData.width,
      () => {
        animationRef.current = null;
        onComplete && onComplete();
      }
    );
  }, []);

  /**
   * Cancel any running animation.
   */
  const cancelAnimation = useCallback(() => {
    if (animationRef.current) {
      animationRef.current.cancel();
      animationRef.current = null;
    }
  }, []);

  return {
    drawOriginal,
    drawGrid,
    drawCompressed,
    drawHeatmap,
    drawHighlight,
    startAnimation,
    cancelAnimation,
  };
}
