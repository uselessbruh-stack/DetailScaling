import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SnapshotCard from '../components/SnapshotCard';
import { getSnapshots, deleteSnapshot } from '../services/api';

export default function Gallery() {
  const [snapshots, setSnapshots] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [compareMode, setCompareMode] = useState(false);

  const fetchSnapshots = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getSnapshots();
      setSnapshots(data);
      setError(null);
    } catch (err) {
      setError('Failed to load snapshots. Make sure the backend is running.');
      setSnapshots([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchSnapshots(); }, [fetchSnapshots]);

  const handleDelete = useCallback(async (id) => {
    try {
      await deleteSnapshot(id);
      setSnapshots(prev => prev.filter(s => s._id !== id));
      setSelectedIds(prev => prev.filter(sid => sid !== id));
    } catch (err) {
      console.error('Delete failed:', err);
    }
  }, []);

  const handleSelect = useCallback((snap) => {
    if (!compareMode) return;
    setSelectedIds(prev => {
      if (prev.includes(snap._id)) return prev.filter(id => id !== snap._id);
      if (prev.length >= 2) return [prev[1], snap._id];
      return [...prev, snap._id];
    });
  }, [compareMode]);

  const compared = selectedIds.map(id => snapshots.find(s => s._id === id)).filter(Boolean);

  return (
    <div className="h-full overflow-y-auto">
      <div className="px-6 py-6 border-b border-surface-500 bg-surface-800 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-neutral-200">Gallery</h1>
          <p className="text-sm text-neutral-500 mt-1">{snapshots.length} saved snapshots</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => { setCompareMode(!compareMode); setSelectedIds([]); }}
            className={compareMode ? 'btn-primary' : 'btn-secondary'}
          >
            {compareMode ? 'Exit Compare' : 'Compare Mode'}
          </button>
          <button onClick={fetchSnapshots} className="btn-ghost">Refresh</button>
        </div>
      </div>

      <div className="p-6 max-w-6xl mx-auto">
        {error && (
          <div className="panel p-4 mb-6 border-muted-red/30 bg-muted-red/5">
            <p className="text-sm text-muted-red">{error}</p>
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-20 text-neutral-600">
            <p className="animate-pulse-subtle">Loading snapshots...</p>
          </div>
        ) : snapshots.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-neutral-500">No snapshots saved yet</p>
            <p className="text-xs text-neutral-600 mt-2">Use the Playground to create and save compression snapshots</p>
          </div>
        ) : (
          <>
            {/* Compare panel */}
            {compareMode && compared.length === 2 && (
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-6 panel">
                <div className="panel-header">
                  <span className="text-xs font-medium text-neutral-300">Comparison</span>
                </div>
                <div className="grid grid-cols-2 gap-4 p-4">
                  {compared.map((snap) => (
                    <div key={snap._id} className="space-y-2">
                      {snap.imagePreview && (
                        <img src={snap.imagePreview} alt="" className="w-full rounded border border-surface-500" />
                      )}
                      <div className="grid grid-cols-3 gap-2 text-center text-xs">
                        <div><span className="text-neutral-500 block">Threshold</span><span className="font-mono text-neutral-200">{snap.threshold}</span></div>
                        <div><span className="text-neutral-500 block">Nodes</span><span className="font-mono text-neutral-200">{snap.totalNodes}</span></div>
                        <div><span className="text-neutral-500 block">Ratio</span><span className="font-mono text-neutral-200">{snap.compressionRatio}:1</span></div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Snapshot grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              <AnimatePresence>
                {snapshots.map((snap) => (
                  <SnapshotCard
                    key={snap._id}
                    snapshot={snap}
                    onClick={() => handleSelect(snap)}
                    onDelete={handleDelete}
                    selected={selectedIds.includes(snap._id)}
                  />
                ))}
              </AnimatePresence>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
