/**
 * useQuadTree — Manages quadtree construction, statistics, and benchmark data.
 * Debounces threshold changes for performance.
 */

import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { buildQuadTree } from '../engine/QuadTree.js';
import { collectStats, estimateCompressionRatio, estimateMemoryReduction, measureTime } from '../engine/statistics.js';

const DEBOUNCE_MS = 200;

export function useQuadTree(imageData, threshold, maxDepth = 8) {
  const [tree, setTree] = useState(null);
  const [stats, setStats] = useState(null);
  const [processingTime, setProcessingTime] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const debounceRef = useRef(null);

  // Recompute tree when imageData or threshold changes
  useEffect(() => {
    if (!imageData) {
      setTree(null);
      setStats(null);
      setProcessingTime(0);
      return;
    }

    // Clear any pending debounce
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    setIsProcessing(true);

    debounceRef.current = setTimeout(() => {
      const { width, height, data } = imageData;

      const { result: newTree, time } = measureTime(() =>
        buildQuadTree(data, width, 0, 0, width, height, threshold, maxDepth, 0)
      );

      const newStats = collectStats(newTree);
      const totalPixels = width * height;

      setTree(newTree);
      setProcessingTime(time);
      setStats({
        ...newStats,
        compressionRatio: estimateCompressionRatio(newStats.leafNodes, totalPixels),
        memoryReduction: estimateMemoryReduction(newStats.leafNodes, totalPixels),
        totalPixels,
        imageWidth: width,
        imageHeight: height,
      });
      setIsProcessing(false);
    }, DEBOUNCE_MS);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [imageData, threshold, maxDepth]);

  /**
   * Run benchmark sweep across a range of thresholds.
   */
  const runBenchmark = useCallback((thresholdValues) => {
    if (!imageData) return [];

    const { width, height, data } = imageData;
    const totalPixels = width * height;
    const results = [];

    for (const t of thresholdValues) {
      const start = performance.now();
      const benchTree = buildQuadTree(data, width, 0, 0, width, height, t, maxDepth, 0);
      const time = parseFloat((performance.now() - start).toFixed(2));

      const benchStats = collectStats(benchTree);
      const ratio = estimateCompressionRatio(benchStats.leafNodes, totalPixels);

      results.push({
        threshold: t,
        totalNodes: benchStats.totalNodes,
        leafNodes: benchStats.leafNodes,
        maxDepth: benchStats.maxDepth,
        compressionRatio: ratio,
        processingTime: time,
        depthDistribution: benchStats.depthDistribution,
      });
    }

    return results;
  }, [imageData, maxDepth]);

  return {
    tree,
    stats,
    processingTime,
    isProcessing,
    runBenchmark,
  };
}
