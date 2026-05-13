/**
 * NodeTooltip — Displays quadtree node metadata on hover.
 * Positioned near the mouse cursor.
 */
export default function NodeTooltip({ node, position }) {
  if (!node) return null;

  const { r, g, b } = node.avgColor || { r: 0, g: 0, b: 0 };

  return (
    <div
      className="tooltip-panel min-w-[200px] max-w-[260px]"
      style={{
        left: position.x + 16,
        top: position.y - 8,
      }}
    >
      <div className="space-y-2">
        {/* Header */}
        <div className="flex items-center justify-between pb-1.5 border-b border-surface-500">
          <span className="text-xs font-medium text-neutral-300">
            {node.isLeaf ? 'Leaf Node' : 'Branch Node'}
          </span>
          <span className="badge">
            Depth {node.depth}
          </span>
        </div>

        {/* Color preview */}
        <div className="flex items-center gap-2">
          <div
            className="w-6 h-6 rounded border border-surface-400"
            style={{ backgroundColor: `rgb(${r},${g},${b})` }}
          />
          <div className="text-xs font-mono text-neutral-400">
            rgb({r}, {g}, {b})
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
          <MetricRow label="Variance" value={node.variance?.toFixed(1)} />
          <MetricRow label="Dimensions" value={`${node.width}×${node.height}`} />
          <MetricRow label="Pixels" value={(node.width * node.height).toLocaleString()} />
          <MetricRow label="Position" value={`(${node.x}, ${node.y})`} />
        </div>

        {/* Compression contribution */}
        {node.isLeaf && (
          <div className="pt-1.5 border-t border-surface-500">
            <div className="text-[10px] text-neutral-500">
              This leaf covers {node.width}×{node.height} pixels with a single color value
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function MetricRow({ label, value }) {
  return (
    <>
      <span className="text-neutral-500">{label}</span>
      <span className="text-neutral-300 font-mono text-right">{value}</span>
    </>
  );
}
