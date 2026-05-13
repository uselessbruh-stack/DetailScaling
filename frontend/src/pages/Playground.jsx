import { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useImageLoader } from '../hooks/useImageLoader';
import { useQuadTree } from '../hooks/useQuadTree';
import { useCanvasRenderer } from '../hooks/useCanvasRenderer';
import { useSpatialInspector } from '../hooks/useSpatialInspector';
import ImageDropzone from '../components/ImageDropzone';
import ThresholdSlider from '../components/ThresholdSlider';
import StatCard from '../components/StatCard';
import ViewToggle from '../components/ViewToggle';
import NodeTooltip from '../components/NodeTooltip';
import { exportCanvasAsPNG, exportTreeAsJSON } from '../engine/serializer';
import { saveSnapshot } from '../services/api';

const VIEW_MODES = [
  { id: 'original', label: 'Original' },
  { id: 'grid', label: 'Grid' },
  { id: 'compressed', label: 'Compressed' },
  { id: 'heatmap', label: 'Heatmap' },
];

export default function Playground() {
  const [threshold, setThreshold] = useState(500);
  const [maxDepth, setMaxDepth] = useState(8);
  const [activeView, setActiveView] = useState('grid');
  const [showGridOverlay, setShowGridOverlay] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);

  // Canvas refs
  const mainCanvasRef = useRef(null);
  const overlayCanvasRef = useRef(null);

  // Hooks
  const { imageData, imageDimensions, imageName, imagePreview, isLoading, loadImage, reset } = useImageLoader();
  const { tree, stats, processingTime, isProcessing } = useQuadTree(imageData, threshold, maxDepth);
  const { drawOriginal, drawGrid, drawCompressed, drawHeatmap, drawHighlight, startAnimation } = useCanvasRenderer();
  const { hoveredNode, mousePos, handleMouseMove, handleMouseLeave } = useSpatialInspector(tree, mainCanvasRef);

  // Draw on view/tree change
  useEffect(() => {
    if (!tree || !imageData || !mainCanvasRef.current) return;

    const canvas = mainCanvasRef.current;
    const { width, height } = imageDimensions;

    switch (activeView) {
      case 'original':
        drawOriginal(canvas, imageData);
        break;
      case 'grid':
        drawGrid(canvas, tree, imageData, { maxDepth: stats?.maxDepth || 8 });
        break;
      case 'compressed':
        drawCompressed(canvas, tree, width, height);
        break;
      case 'heatmap':
        drawHeatmap(canvas, tree, imageData, stats?.maxVariance || 1);
        break;
    }
  }, [tree, activeView, imageData, imageDimensions, stats, drawOriginal, drawGrid, drawCompressed, drawHeatmap]);

  // Draw highlight overlay on hover
  useEffect(() => {
    if (!overlayCanvasRef.current || !imageDimensions) return;
    const canvas = overlayCanvasRef.current;
    canvas.width = imageDimensions.width;
    canvas.height = imageDimensions.height;
    drawHighlight(canvas, hoveredNode);
  }, [hoveredNode, imageDimensions, drawHighlight]);

  // Handle image upload
  const handleImageSelect = useCallback((file) => {
    loadImage(file);
    setActiveView('grid');
  }, [loadImage]);

  // Reset everything
  const handleReset = useCallback(() => {
    reset();
    setThreshold(500);
    setActiveView('grid');
    setSaveStatus(null);
    if (mainCanvasRef.current) {
      const ctx = mainCanvasRef.current.getContext('2d');
      ctx.clearRect(0, 0, mainCanvasRef.current.width, mainCanvasRef.current.height);
    }
    if (overlayCanvasRef.current) {
      const ctx = overlayCanvasRef.current.getContext('2d');
      ctx.clearRect(0, 0, overlayCanvasRef.current.width, overlayCanvasRef.current.height);
    }
  }, [reset]);

  // Run animation
  const handleAnimate = useCallback(() => {
    if (!tree || !imageData || !mainCanvasRef.current) return;
    startAnimation(mainCanvasRef.current, tree, imageData, () => {
      // After animation, redraw current view
      setActiveView('compressed');
    });
  }, [tree, imageData, startAnimation]);

  // Save snapshot
  const handleSaveSnapshot = useCallback(async () => {
    if (!stats || !imagePreview || isSaving) return;

    setIsSaving(true);
    setSaveStatus(null);

    try {
      await saveSnapshot({
        imageName: imageName || 'Untitled',
        imagePreview,
        threshold,
        totalNodes: stats.totalNodes,
        leafNodes: stats.leafNodes,
        maxDepth: stats.maxDepth,
        compressionRatio: stats.compressionRatio,
        processingTime,
        originalDimensions: imageDimensions,
      });
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (err) {
      setSaveStatus('error');
      console.error('Failed to save snapshot:', err);
    } finally {
      setIsSaving(false);
    }
  }, [stats, imagePreview, imageName, threshold, processingTime, imageDimensions, isSaving]);

  // Export compressed image
  const handleExportImage = useCallback(() => {
    if (!mainCanvasRef.current || activeView !== 'compressed') {
      // Draw compressed to canvas first
      const tempCanvas = document.createElement('canvas');
      if (tree && imageDimensions) {
        drawCompressed(tempCanvas, tree, imageDimensions.width, imageDimensions.height);
        exportCanvasAsPNG(tempCanvas, `compressed_t${threshold}.png`);
      }
    } else {
      exportCanvasAsPNG(mainCanvasRef.current, `compressed_t${threshold}.png`);
    }
  }, [tree, imageDimensions, threshold, activeView, drawCompressed]);

  // Export quadtree JSON
  const handleExportJSON = useCallback(() => {
    if (tree) {
      exportTreeAsJSON(tree, `quadtree_t${threshold}.json`);
    }
  }, [tree, threshold]);

  // Canvas display dimensions (responsive)
  const canvasStyle = useMemo(() => {
    if (!imageDimensions) return { width: '100%', maxHeight: '600px' };
    return {
      width: '100%',
      maxHeight: '600px',
      aspectRatio: `${imageDimensions.width} / ${imageDimensions.height}`,
    };
  }, [imageDimensions]);

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="h-14 flex items-center justify-between px-6 border-b border-surface-500 shrink-0 bg-surface-800">
        <div className="flex items-center gap-3">
          <h1 className="text-base font-semibold text-neutral-200">Playground</h1>
          {imageName && (
            <span className="text-xs text-neutral-500 font-mono">{imageName}</span>
          )}
          {isProcessing && (
            <span className="text-[10px] text-accent-500 animate-pulse-subtle">Processing...</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {imageData && (
            <ViewToggle activeView={activeView} onChange={setActiveView} views={VIEW_MODES} />
          )}
        </div>
      </div>

      {/* Three-panel layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT PANEL — Controls */}
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="w-72 border-r border-surface-500 bg-surface-800 overflow-y-auto shrink-0"
        >
          <div className="p-4 space-y-5">
            {/* Upload */}
            <div>
              <ImageDropzone onImageSelect={handleImageSelect} disabled={isLoading} />
            </div>

            {/* Threshold */}
            {imageData && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                <ThresholdSlider
                  value={threshold}
                  onChange={setThreshold}
                  disabled={!imageData}
                />
              </motion.div>
            )}

            {/* Max Depth */}
            {imageData && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="label">Max Depth</span>
                  <span className="text-sm font-mono text-accent-400">{maxDepth}</span>
                </div>
                <input
                  type="range"
                  min={2}
                  max={12}
                  step={1}
                  value={maxDepth}
                  onChange={(e) => setMaxDepth(Number(e.target.value))}
                  className="w-full"
                  style={{
                    background: `linear-gradient(to right, #d97706 0%, #d97706 ${((maxDepth - 2) / 10) * 100}%, #333333 ${((maxDepth - 2) / 10) * 100}%, #333333 100%)`,
                  }}
                />
              </motion.div>
            )}

            {/* Toggle controls */}
            {imageData && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="space-y-2"
              >
                <ToggleSwitch
                  label="Grid Overlay"
                  checked={showGridOverlay}
                  onChange={setShowGridOverlay}
                />
              </motion.div>
            )}

            {/* Actions */}
            {imageData && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                className="space-y-2"
              >
                <button onClick={handleAnimate} className="btn-secondary w-full flex items-center justify-center gap-2">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <polygon points="3,2 12,7 3,12" />
                  </svg>
                  Animate Decomposition
                </button>
                <button onClick={handleReset} className="btn-secondary w-full">
                  Reset
                </button>
              </motion.div>
            )}

            {/* Compression Statistics */}
            {stats && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                <div className="panel">
                  <div className="panel-header">
                    <span className="text-xs font-medium text-neutral-300">Compression Stats</span>
                  </div>
                  <div className="divide-y divide-surface-500">
                    <StatCard label="Dimensions" value={`${stats.imageWidth}×${stats.imageHeight}`} compact />
                    <StatCard label="Total Pixels" value={stats.totalPixels} compact />
                    <StatCard label="Total Nodes" value={stats.totalNodes} compact />
                    <StatCard label="Leaf Nodes" value={stats.leafNodes} compact />
                    <StatCard label="Max Depth" value={stats.maxDepth} compact />
                    <StatCard label="Compression Ratio" value={stats.compressionRatio} suffix=":1" decimals={1} compact />
                    <StatCard label="Memory Reduction" value={stats.memoryReduction} suffix="%" decimals={1} compact />
                    <StatCard label="Processing Time" value={processingTime} suffix="ms" decimals={1} compact />
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* CENTER — Canvas */}
        <div className="flex-1 flex items-center justify-center p-6 bg-surface-900 overflow-auto relative">
          {!imageData ? (
            <div className="text-center space-y-4">
              <div className="w-24 h-24 mx-auto rounded-2xl bg-surface-800 border border-surface-500 flex items-center justify-center">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-neutral-600">
                  <rect x="4" y="4" width="32" height="32" rx="3" />
                  <path d="M4 28l10-10 6 6 8-8 8 8" />
                  <circle cx="28" cy="14" r="3" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-neutral-400">No image loaded</p>
                <p className="text-xs text-neutral-600 mt-1">Upload an image from the left panel to begin</p>
              </div>
            </div>
          ) : (
            <div className="relative inline-block" style={canvasStyle}>
              {/* Main canvas */}
              <canvas
                ref={mainCanvasRef}
                className="w-full h-full object-contain rounded-lg"
                style={{ imageRendering: activeView === 'compressed' ? 'auto' : 'auto' }}
              />
              {/* Overlay canvas for highlights */}
              <canvas
                ref={overlayCanvasRef}
                className="absolute top-0 left-0 w-full h-full object-contain pointer-events-none rounded-lg"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{ pointerEvents: 'auto' }}
              />
              {/* Node tooltip */}
              {hoveredNode && (
                <NodeTooltip node={hoveredNode} position={mousePos} />
              )}
            </div>
          )}
        </div>

        {/* RIGHT PANEL — Inspector & Export */}
        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="w-72 border-l border-surface-500 bg-surface-800 overflow-y-auto shrink-0"
        >
          <div className="p-4 space-y-5">
            {/* Spatial Inspector */}
            <div className="panel">
              <div className="panel-header">
                <span className="text-xs font-medium text-neutral-300">Spatial Inspector</span>
                <span className="text-[10px] text-neutral-600">Hover canvas</span>
              </div>
              <div className="panel-body">
                {hoveredNode ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded border border-surface-400"
                        style={{
                          backgroundColor: `rgb(${hoveredNode.avgColor?.r},${hoveredNode.avgColor?.g},${hoveredNode.avgColor?.b})`,
                        }}
                      />
                      <div>
                        <p className="text-xs text-neutral-300 font-medium">
                          {hoveredNode.isLeaf ? 'Leaf Node' : 'Branch Node'}
                        </p>
                        <p className="text-[10px] text-neutral-500 font-mono">
                          rgb({hoveredNode.avgColor?.r}, {hoveredNode.avgColor?.g}, {hoveredNode.avgColor?.b})
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <InspectorField label="Depth" value={hoveredNode.depth} />
                      <InspectorField label="Variance" value={hoveredNode.variance?.toFixed(1)} />
                      <InspectorField label="Width" value={`${hoveredNode.width}px`} />
                      <InspectorField label="Height" value={`${hoveredNode.height}px`} />
                      <InspectorField label="X" value={hoveredNode.x} />
                      <InspectorField label="Y" value={hoveredNode.y} />
                      <InspectorField label="Pixels" value={hoveredNode.width * hoveredNode.height} />
                      <InspectorField label="Type" value={hoveredNode.isLeaf ? 'Leaf' : 'Branch'} />
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-neutral-600 text-center py-4">
                    Hover over the canvas to inspect quadtree nodes
                  </p>
                )}
              </div>
            </div>

            {/* Tree Info */}
            {stats && (
              <div className="panel">
                <div className="panel-header">
                  <span className="text-xs font-medium text-neutral-300">Tree Structure</span>
                </div>
                <div className="panel-body space-y-2">
                  <DepthBar label="Max Depth" value={stats.maxDepth} max={12} />
                  <DepthBar label="Avg Leaf Depth" value={parseFloat(stats.avgLeafDepth)} max={12} />
                  <div className="text-xs text-neutral-500 mt-2">
                    <span className="font-mono">{stats.branchNodes}</span> branch nodes ·{' '}
                    <span className="font-mono">{stats.leafNodes}</span> leaf nodes
                  </div>
                </div>
              </div>
            )}

            {/* Export actions */}
            {tree && (
              <div className="space-y-2">
                <button onClick={handleSaveSnapshot} disabled={isSaving} className="btn-primary w-full flex items-center justify-center gap-2">
                  {isSaving ? (
                    <span className="animate-pulse-subtle">Saving...</span>
                  ) : saveStatus === 'saved' ? (
                    <>
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3,7 6,10 11,4" />
                      </svg>
                      Saved!
                    </>
                  ) : (
                    'Save Snapshot'
                  )}
                </button>
                <button onClick={handleExportImage} className="btn-secondary w-full">
                  Export Compressed Image
                </button>
                <button onClick={handleExportJSON} className="btn-secondary w-full">
                  Export Quadtree JSON
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/* ---- Helper components ---- */

function ToggleSwitch({ label, checked, onChange }) {
  return (
    <label className="flex items-center justify-between cursor-pointer">
      <span className="text-xs text-neutral-400">{label}</span>
      <div
        className={`w-9 h-5 rounded-full transition-colors duration-200 relative ${
          checked ? 'bg-accent-600' : 'bg-surface-500'
        }`}
        onClick={() => onChange(!checked)}
      >
        <div
          className={`w-3.5 h-3.5 rounded-full bg-white absolute top-[3px] transition-transform duration-200 ${
            checked ? 'translate-x-[18px]' : 'translate-x-[3px]'
          }`}
        />
      </div>
    </label>
  );
}

function InspectorField({ label, value }) {
  return (
    <div className="bg-surface-700/50 rounded px-2 py-1.5">
      <div className="text-[10px] text-neutral-500">{label}</div>
      <div className="text-xs text-neutral-200 font-mono">{value}</div>
    </div>
  );
}

function DepthBar({ label, value, max }) {
  const pct = (value / max) * 100;
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-neutral-500">{label}</span>
        <span className="text-neutral-300 font-mono">{value}</span>
      </div>
      <div className="h-1.5 bg-surface-600 rounded-full overflow-hidden">
        <div
          className="h-full bg-accent-600 rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
