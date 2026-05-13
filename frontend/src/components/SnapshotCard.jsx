import { motion } from 'framer-motion';

/**
 * SnapshotCard — Gallery card displaying a saved compression snapshot.
 */
export default function SnapshotCard({ snapshot, onClick, onDelete, selected = false }) {
  const {
    imageName,
    imagePreview,
    threshold,
    totalNodes,
    leafNodes,
    maxDepth,
    compressionRatio,
    createdAt,
  } = snapshot;

  const date = new Date(createdAt);
  const formattedDate = date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  const formattedTime = date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      className={`
        panel cursor-pointer transition-colors duration-150 overflow-hidden
        ${selected ? 'border-accent-600 glow-accent' : 'hover:border-surface-400'}
      `}
    >
      {/* Thumbnail */}
      <div className="aspect-video bg-surface-900 relative overflow-hidden">
        {imagePreview ? (
          <img
            src={imagePreview}
            alt={imageName || 'Snapshot'}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-neutral-600">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="4" y="4" width="24" height="24" rx="2" />
              <path d="M4 20l7-7 4 4 6-6 7 7" />
            </svg>
          </div>
        )}

        {/* Threshold badge */}
        <div className="absolute top-2 right-2 px-2 py-0.5 bg-surface-900/80 backdrop-blur-sm rounded text-xs font-mono text-accent-400">
          T:{threshold}
        </div>
      </div>

      {/* Info */}
      <div className="p-3 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-neutral-200 truncate font-medium">
            {imageName || 'Untitled'}
          </span>
          {onDelete && (
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(snapshot._id); }}
              className="text-neutral-600 hover:text-muted-red transition-colors p-1"
              aria-label="Delete snapshot"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M2 4h10M5 4V3a1 1 0 011-1h2a1 1 0 011 1v1M11 4v7a1 1 0 01-1 1H4a1 1 0 01-1-1V4" />
              </svg>
            </button>
          )}
        </div>

        <div className="grid grid-cols-3 gap-1 text-center">
          <MiniStat label="Nodes" value={totalNodes} />
          <MiniStat label="Ratio" value={`${compressionRatio}:1`} />
          <MiniStat label="Depth" value={maxDepth} />
        </div>

        <div className="text-[10px] text-neutral-600">
          {formattedDate} · {formattedTime}
        </div>
      </div>
    </motion.div>
  );
}

function MiniStat({ label, value }) {
  return (
    <div className="py-1 bg-surface-700/50 rounded">
      <div className="text-xs font-mono text-neutral-300">{value}</div>
      <div className="text-[9px] text-neutral-500 mt-0.5">{label}</div>
    </div>
  );
}
