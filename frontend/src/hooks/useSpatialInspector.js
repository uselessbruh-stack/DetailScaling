/**
 * useSpatialInspector — Tracks mouse position over canvas and finds the hovered quadtree node.
 */

import { useState, useCallback, useRef } from 'react';
import { findNodeAtPoint } from '../engine/QuadTree.js';

export function useSpatialInspector(tree, canvasRef) {
  const [hoveredNode, setHoveredNode] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const throttleRef = useRef(null);

  /**
   * Handle mouse movement over the canvas.
   * Throttled to avoid excessive tree traversals.
   */
  const handleMouseMove = useCallback((e) => {
    if (!tree || !canvasRef?.current) return;

    // Throttle to ~30fps
    if (throttleRef.current) return;
    throttleRef.current = setTimeout(() => {
      throttleRef.current = null;
    }, 33);

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();

    // Map screen coordinates to canvas pixel coordinates
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const px = Math.floor((e.clientX - rect.left) * scaleX);
    const py = Math.floor((e.clientY - rect.top) * scaleY);

    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });

    const node = findNodeAtPoint(tree, px, py);
    setHoveredNode(node);
  }, [tree, canvasRef]);

  /**
   * Clear hovered state when mouse leaves.
   */
  const handleMouseLeave = useCallback(() => {
    setHoveredNode(null);
  }, []);

  return {
    hoveredNode,
    mousePos,
    handleMouseMove,
    handleMouseLeave,
  };
}
