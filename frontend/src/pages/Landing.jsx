import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Landing() {
  return (
    <div className="min-h-full overflow-y-auto">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Animated grid background */}
        <QuadtreeBackground />

        {/* Content */}
        <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-700/60 border border-surface-500 mb-6">
              <div className="w-1.5 h-1.5 rounded-full bg-accent-500" />
              <span className="text-xs text-neutral-400">Adaptive Spatial Compression</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-neutral-100 leading-tight tracking-tight">
              Detail
              <span className="text-gradient"> Scaling</span>
            </h1>

            <p className="mt-5 text-lg text-neutral-400 leading-relaxed max-w-xl mx-auto">
              Interactive quadtree image compression visualization.
              Watch recursive spatial partitioning decompose images in real time.
            </p>

            <div className="mt-8 flex items-center justify-center gap-4">
              <Link to="/sandbox" className="btn-primary text-base px-6 py-3">
                Start Exploring
              </Link>
              <Link to="/about" className="btn-ghost text-base px-5 py-3">
                How It Works
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-neutral-600">
            <polyline points="4,7 10,13 16,7" />
          </svg>
        </motion.div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-6 bg-surface-800/50">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="label text-accent-600">Algorithm</span>
            <h2 className="mt-3 text-3xl font-bold text-neutral-100">
              How Quadtree Compression Works
            </h2>
            <p className="mt-4 text-neutral-400 max-w-lg mx-auto">
              A recursive spatial partitioning algorithm that preserves detail where it matters and compresses uniform regions aggressively.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-4">
            {[
              {
                step: '01',
                title: 'Analyze Region',
                desc: 'Calculate color variance across the pixel region to measure visual complexity.',
              },
              {
                step: '02',
                title: 'Compare Threshold',
                desc: 'If variance exceeds the threshold, the region contains significant detail worth preserving.',
              },
              {
                step: '03',
                title: 'Subdivide',
                desc: 'Split the region into four equal quadrants and repeat the analysis recursively.',
              },
              {
                step: '04',
                title: 'Reconstruct',
                desc: 'Leaf nodes store average color. Reconstruct the image using these compressed blocks.',
              },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="panel p-5"
              >
                <span className="text-2xl font-bold text-surface-400 font-mono">{item.step}</span>
                <h3 className="mt-3 text-sm font-semibold text-neutral-200">{item.title}</h3>
                <p className="mt-2 text-xs text-neutral-500 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="label text-accent-600">Platform</span>
            <h2 className="mt-3 text-3xl font-bold text-neutral-100">
              Visualization Tools
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                title: 'Real-Time Subdivision',
                desc: 'Watch the quadtree decompose your image live as you adjust the compression threshold.',
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-accent-500">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <line x1="12" y1="3" x2="12" y2="21" />
                    <line x1="3" y1="12" x2="21" y2="12" />
                  </svg>
                ),
              },
              {
                title: 'Variance Heatmap',
                desc: 'Visualize why certain regions subdivide more than others with color-coded variance mapping.',
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-accent-500">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <rect x="3" y="3" width="9" height="9" fill="rgba(217,119,6,0.3)" />
                    <rect x="12" y="12" width="9" height="9" fill="rgba(77,124,15,0.3)" />
                  </svg>
                ),
              },
              {
                title: 'Spatial Inspector',
                desc: 'Hover over any region to inspect node depth, variance, color, and compression contribution.',
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-accent-500">
                    <circle cx="11" cy="11" r="7" />
                    <line x1="16" y1="16" x2="21" y2="21" />
                  </svg>
                ),
              },
              {
                title: 'Performance Analytics',
                desc: 'Charts showing threshold vs node count, compression ratio, processing time, and depth distribution.',
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-accent-500">
                    <polyline points="3,18 8,10 13,14 21,6" />
                    <polyline points="17,6 21,6 21,10" />
                  </svg>
                ),
              },
              {
                title: 'Snapshot Gallery',
                desc: 'Save and compare compression results across different thresholds and images.',
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-accent-500">
                    <rect x="3" y="3" width="8" height="8" rx="1" />
                    <rect x="13" y="3" width="8" height="8" rx="1" />
                    <rect x="3" y="13" width="8" height="8" rx="1" />
                    <rect x="13" y="13" width="8" height="8" rx="1" />
                  </svg>
                ),
              },
              {
                title: 'Export & Share',
                desc: 'Download compressed images as PNG and quadtree structure as JSON for further analysis.',
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-accent-500">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                    <polyline points="7,10 12,15 17,10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                ),
              },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="panel p-5 hover:border-surface-400 transition-colors"
              >
                <div className="mb-3">{feature.icon}</div>
                <h3 className="text-sm font-semibold text-neutral-200">{feature.title}</h3>
                <p className="mt-2 text-xs text-neutral-500 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 border-t border-surface-500">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-md mx-auto text-center"
        >
          <h2 className="text-2xl font-bold text-neutral-100">Ready to decompose?</h2>
          <p className="mt-3 text-sm text-neutral-400">
            Upload an image and explore how quadtree compression adapts to visual complexity.
          </p>
          <Link to="/sandbox" className="btn-primary inline-block mt-6 px-8 py-3">
            Open Playground
          </Link>
        </motion.div>
      </section>
    </div>
  );
}

/**
 * QuadtreeBackground — Animated canvas drawing recursive grid lines.
 */
function QuadtreeBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animFrameId;
    let lines = [];
    let lineIndex = 0;

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      generateLines();
    }

    function generateLines() {
      lines = [];
      subdivide(0, 0, canvas.width, canvas.height, 0, 5);
    }

    function subdivide(x, y, w, h, depth, maxDepth) {
      if (depth >= maxDepth || w < 20 || h < 20) return;

      const halfW = Math.floor(w / 2);
      const halfH = Math.floor(h / 2);

      // Add lines
      lines.push({ x1: x + halfW, y1: y, x2: x + halfW, y2: y + h, depth });
      lines.push({ x1: x, y1: y + halfH, x2: x + w, y2: y + halfH, depth });

      // Random subdivision (not all quadrants, for visual variety)
      if (Math.random() > 0.3) subdivide(x, y, halfW, halfH, depth + 1, maxDepth);
      if (Math.random() > 0.3) subdivide(x + halfW, y, w - halfW, halfH, depth + 1, maxDepth);
      if (Math.random() > 0.4) subdivide(x, y + halfH, halfW, h - halfH, depth + 1, maxDepth);
      if (Math.random() > 0.4) subdivide(x + halfW, y + halfH, w - halfW, h - halfH, depth + 1, maxDepth);
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const drawCount = Math.min(lineIndex, lines.length);

      for (let i = 0; i < drawCount; i++) {
        const line = lines[i];
        const alpha = Math.max(0.03, 0.12 - line.depth * 0.02);
        ctx.strokeStyle = `rgba(217, 119, 6, ${alpha})`;
        ctx.lineWidth = Math.max(0.5, 1 - line.depth * 0.15);
        ctx.beginPath();
        ctx.moveTo(line.x1, line.y1);
        ctx.lineTo(line.x2, line.y2);
        ctx.stroke();
      }

      if (lineIndex < lines.length) {
        lineIndex += 2;
      }

      animFrameId = requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener('resize', resize);
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full grid-fade"
      style={{ opacity: 0.5 }}
    />
  );
}
