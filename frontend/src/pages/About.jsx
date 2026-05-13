import { motion } from 'framer-motion';

export default function About() {
  return (
    <div className="h-full overflow-y-auto">
      <div className="px-6 py-6 border-b border-surface-500 bg-surface-800">
        <h1 className="text-xl font-semibold text-neutral-200">About / Tech Space</h1>
        <p className="text-sm text-neutral-500 mt-1">Quadtree decomposition theory and implementation details</p>
      </div>

      <div className="p-6 max-w-4xl mx-auto space-y-8">
        {/* Algorithm Overview */}
        <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="panel">
          <div className="panel-header"><span className="text-sm font-medium text-neutral-200">Quadtree Decomposition</span></div>
          <div className="panel-body space-y-4 text-sm text-neutral-400 leading-relaxed">
            <p>
              A quadtree is a tree data structure where each internal node has exactly four children.
              In the context of image compression, the quadtree recursively subdivides the image into
              four quadrants, analyzing each region's color variance to determine whether further
              subdivision is necessary.
            </p>
            <p>
              Regions with high color variance (edges, textures, detailed areas) are subdivided further,
              while uniform regions (solid colors, gradients) are stored as single leaf nodes with their
              average color value. This produces an adaptive representation that allocates more data
              to complex areas and less to simple ones.
            </p>
          </div>
        </motion.section>

        {/* Pseudocode */}
        <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="panel">
          <div className="panel-header"><span className="text-sm font-medium text-neutral-200">Algorithm Pseudocode</span></div>
          <div className="panel-body">
            <pre className="text-xs font-mono text-neutral-300 bg-surface-900 rounded-lg p-4 overflow-x-auto leading-relaxed">
{`function buildQuadTree(image, region, threshold, maxDepth):
    node = new QuadTreeNode(region)
    
    variance = calculateColorVariance(image, region)
    avgColor = calculateAverageColor(image, region)
    
    node.variance = variance
    node.avgColor = avgColor
    
    // Leaf conditions
    if variance <= threshold OR depth >= maxDepth OR region too small:
        return node   // Store as leaf with average color
    
    // Subdivide into four quadrants
    [topLeft, topRight, bottomLeft, bottomRight] = splitRegion(region)
    
    node.children = [
        buildQuadTree(image, topLeft, threshold, maxDepth),
        buildQuadTree(image, topRight, threshold, maxDepth),
        buildQuadTree(image, bottomLeft, threshold, maxDepth),
        buildQuadTree(image, bottomRight, threshold, maxDepth)
    ]
    
    return node`}
            </pre>
          </div>
        </motion.section>

        {/* Complexity */}
        <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="panel">
          <div className="panel-header"><span className="text-sm font-medium text-neutral-200">Complexity Analysis</span></div>
          <div className="panel-body space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <ComplexityCard title="Time" value="O(N log N)" desc="Each pixel examined at each depth level; tree depth is O(log N)" />
              <ComplexityCard title="Space" value="O(N)" desc="Worst case: every pixel is a leaf node. Average: significantly less." />
              <ComplexityCard title="Tree Depth" value="O(log₄ N)" desc="Each subdivision divides area by 4, giving logarithmic depth." />
            </div>
            <div className="text-sm text-neutral-400 leading-relaxed">
              <p>
                The variance calculation for each node is O(k) where k is the number of pixels in
                that region. Across all nodes at a given depth level, the total pixels examined equals N
                (each pixel belongs to exactly one node per level). With O(log N) levels, total work
                is O(N log N).
              </p>
            </div>
          </div>
        </motion.section>

        {/* Key Concepts */}
        <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="panel">
          <div className="panel-header"><span className="text-sm font-medium text-neutral-200">Key Concepts</span></div>
          <div className="panel-body">
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { term: 'Spatial Partitioning', def: 'Dividing a space into non-overlapping regions organized in a hierarchy.' },
                { term: 'Recursive Subdivision', def: 'Repeatedly splitting regions into smaller sub-regions based on a criterion.' },
                { term: 'Color Variance', def: 'Statistical measure of color spread across pixels: Var(X) = E[X²] - E[X]².' },
                { term: 'Adaptive Compression', def: 'Allocating more data to complex regions and less to uniform areas.' },
                { term: 'Threshold Control', def: 'The variance threshold controls the trade-off between quality and compression.' },
                { term: 'Lossy Compression', def: 'Irreversible data reduction where fine detail below the threshold is averaged out.' },
              ].map((item) => (
                <div key={item.term} className="bg-surface-700/30 rounded-lg p-3">
                  <span className="text-xs font-medium text-accent-500">{item.term}</span>
                  <p className="text-xs text-neutral-400 mt-1 leading-relaxed">{item.def}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Tech Stack */}
        <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="panel">
          <div className="panel-header"><span className="text-sm font-medium text-neutral-200">Technology Stack</span></div>
          <div className="panel-body">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { name: 'React', desc: 'UI Framework' },
                { name: 'Vite', desc: 'Build Tool' },
                { name: 'Tailwind CSS', desc: 'Styling' },
                { name: 'Canvas API', desc: 'Rendering' },
                { name: 'Framer Motion', desc: 'Animations' },
                { name: 'Recharts', desc: 'Charts' },
                { name: 'Express.js', desc: 'Backend' },
                { name: 'MongoDB', desc: 'Database' },
              ].map((tech) => (
                <div key={tech.name} className="text-center py-3 bg-surface-700/30 rounded-lg">
                  <span className="text-xs font-medium text-neutral-200 block">{tech.name}</span>
                  <span className="text-[10px] text-neutral-500">{tech.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Academic Context */}
        <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="panel">
          <div className="panel-header"><span className="text-sm font-medium text-neutral-200">Academic Context</span></div>
          <div className="panel-body text-sm text-neutral-400 leading-relaxed">
            <p>
              This project was developed as an MCA academic project demonstrating practical applications
              of spatial data structures in image processing. It covers quadtree decomposition, adaptive
              compression, recursive algorithms, and real-time visualization — bridging theoretical
              computer science with interactive web technologies.
            </p>
          </div>
        </motion.section>
      </div>
    </div>
  );
}

function ComplexityCard({ title, value, desc }) {
  return (
    <div className="bg-surface-700/30 rounded-lg p-4 text-center">
      <span className="text-xs text-neutral-500">{title}</span>
      <p className="text-xl font-mono font-bold text-accent-500 mt-1">{value}</p>
      <p className="text-[10px] text-neutral-500 mt-2 leading-relaxed">{desc}</p>
    </div>
  );
}
