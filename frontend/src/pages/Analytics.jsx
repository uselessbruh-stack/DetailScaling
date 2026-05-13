import { useState, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { useImageLoader } from '../hooks/useImageLoader';
import { useQuadTree } from '../hooks/useQuadTree';
import ImageDropzone from '../components/ImageDropzone';

const THRESHOLD_STEPS = Array.from({ length: 50 }, (_, i) => i * 200);

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-surface-700 border border-surface-400 rounded-lg px-3 py-2 shadow-xl">
      <p className="text-xs text-neutral-400 mb-1">Threshold: {label}</p>
      {payload.map((entry, i) => (
        <p key={i} className="text-xs font-mono" style={{ color: entry.color }}>
          {entry.name}: {typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}
        </p>
      ))}
    </div>
  );
};

export default function Analytics() {
  const [benchmarkData, setBenchmarkData] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const { imageData, loadImage, imageName } = useImageLoader();
  const { runBenchmark } = useQuadTree(imageData, 500);

  const handleRun = useCallback(() => {
    if (!imageData || isRunning) return;
    setIsRunning(true);
    setTimeout(() => {
      setBenchmarkData(runBenchmark(THRESHOLD_STEPS));
      setIsRunning(false);
    }, 50);
  }, [imageData, isRunning, runBenchmark]);

  const depthDist = useMemo(() => {
    if (!benchmarkData?.length) return [];
    const mid = benchmarkData[Math.floor(benchmarkData.length / 2)];
    if (!mid?.depthDistribution) return [];
    return Object.entries(mid.depthDistribution)
      .map(([d, c]) => ({ depth: `D${d}`, count: c }))
      .sort((a, b) => parseInt(a.depth.slice(1)) - parseInt(b.depth.slice(1)));
  }, [benchmarkData]);

  return (
    <div className="h-full overflow-y-auto">
      <div className="px-6 py-6 border-b border-surface-500 bg-surface-800">
        <h1 className="text-xl font-semibold text-neutral-200">Analytics</h1>
        <p className="text-sm text-neutral-500 mt-1">Benchmark quadtree compression across thresholds</p>
      </div>
      <div className="p-6 max-w-6xl mx-auto space-y-6">
        <div className="panel">
          <div className="panel-header"><span className="text-xs font-medium text-neutral-300">Benchmark Setup</span></div>
          <div className="panel-body flex items-end gap-4">
            <div className="flex-1 max-w-xs"><ImageDropzone onImageSelect={loadImage} /></div>
            <div className="flex flex-col gap-2">
              {imageName && <span className="text-xs text-neutral-400 font-mono">{imageName}</span>}
              <button onClick={handleRun} disabled={!imageData || isRunning} className="btn-primary">
                {isRunning ? 'Running...' : 'Run Benchmark'}
              </button>
            </div>
          </div>
        </div>

        {benchmarkData && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="grid md:grid-cols-2 gap-4">
            <Chart title="Threshold vs Node Count">
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={benchmarkData}>
                  <CartesianGrid stroke="#1a1a1a" />
                  <XAxis dataKey="threshold" tick={{ fontSize: 10, fill: '#777' }} />
                  <YAxis tick={{ fontSize: 10, fill: '#777' }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line type="monotone" dataKey="totalNodes" name="Total Nodes" stroke="#d97706" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="leafNodes" name="Leaf Nodes" stroke="#4d7c0f" strokeWidth={1.5} dot={false} strokeDasharray="4 2" />
                </LineChart>
              </ResponsiveContainer>
            </Chart>
            <Chart title="Threshold vs Compression Ratio">
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={benchmarkData}>
                  <CartesianGrid stroke="#1a1a1a" />
                  <XAxis dataKey="threshold" tick={{ fontSize: 10, fill: '#777' }} />
                  <YAxis tick={{ fontSize: 10, fill: '#777' }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="compressionRatio" name="Ratio" stroke="#d97706" fill="rgba(217,119,6,0.12)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </Chart>
            <Chart title="Threshold vs Processing Time">
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={benchmarkData}>
                  <CartesianGrid stroke="#1a1a1a" />
                  <XAxis dataKey="threshold" tick={{ fontSize: 10, fill: '#777' }} />
                  <YAxis tick={{ fontSize: 10, fill: '#777' }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line type="monotone" dataKey="processingTime" name="Time (ms)" stroke="#b45309" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </Chart>
            <Chart title="Depth Distribution">
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={depthDist}>
                  <CartesianGrid stroke="#1a1a1a" />
                  <XAxis dataKey="depth" tick={{ fontSize: 10, fill: '#777' }} />
                  <YAxis tick={{ fontSize: 10, fill: '#777' }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" name="Nodes" fill="#d97706" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Chart>
          </motion.div>
        )}
      </div>
    </div>
  );
}

function Chart({ title, children }) {
  return (
    <div className="panel">
      <div className="panel-header"><span className="text-xs font-medium text-neutral-300">{title}</span></div>
      <div className="p-4">{children}</div>
    </div>
  );
}
