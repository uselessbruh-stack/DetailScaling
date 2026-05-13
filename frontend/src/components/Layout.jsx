import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
  { path: '/', label: 'Home', icon: HomeIcon },
  { path: '/sandbox', label: 'Playground', icon: PlaygroundIcon },
  { path: '/benchmarks', label: 'Analytics', icon: AnalyticsIcon },
  { path: '/library', label: 'Gallery', icon: GalleryIcon },
  { path: '/about', label: 'About', icon: AboutIcon },
];

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  return (
    <div className="flex h-screen overflow-hidden bg-surface-900">
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarOpen ? 220 : 56 }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
        className="flex flex-col border-r border-surface-500 bg-surface-800 shrink-0 z-20"
      >
        {/* Logo area */}
        <div className="h-14 flex items-center px-3 border-b border-surface-500">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-surface-600 transition-colors"
            aria-label="Toggle sidebar"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-neutral-400">
              <path d="M3 4.5h12M3 9h12M3 13.5h12" />
            </svg>
          </button>
          <AnimatePresence>
            {sidebarOpen && (
              <motion.span
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.15 }}
                className="ml-2 text-sm font-semibold text-neutral-200 whitespace-nowrap"
              >
                Detail Scaling
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Nav links */}
        <nav className="flex-1 py-3 px-2 space-y-1 overflow-y-auto">
          {navItems.map(({ path, label, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-2.5 py-2 rounded-md text-sm transition-colors duration-150 group ${
                  isActive
                    ? 'bg-surface-600 text-neutral-100'
                    : 'text-neutral-400 hover:text-neutral-200 hover:bg-surface-700'
                }`
              }
            >
              <Icon active={location.pathname === path} />
              <AnimatePresence>
                {sidebarOpen && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.15 }}
                    className="whitespace-nowrap overflow-hidden"
                  >
                    {label}
                  </motion.span>
                )}
              </AnimatePresence>
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-3 py-3 border-t border-surface-500">
          <AnimatePresence>
            {sidebarOpen && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-[10px] text-neutral-600 leading-tight"
              >
                Quadtree Compression
                <br />Visualization Platform
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </motion.aside>

      {/* Main content area */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}

/* ---- Icon components ---- */

function HomeIcon({ active }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" className={active ? 'text-accent-500' : 'text-neutral-500'}>
      <path d="M2.25 7.5L9 2.25l6.75 5.25v7.5a1.5 1.5 0 01-1.5 1.5h-10.5a1.5 1.5 0 01-1.5-1.5V7.5z" />
      <path d="M6.75 15.75V9h4.5v6.75" />
    </svg>
  );
}

function PlaygroundIcon({ active }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" className={active ? 'text-accent-500' : 'text-neutral-500'}>
      <rect x="2" y="2" width="14" height="14" rx="1.5" />
      <line x1="9" y1="2" x2="9" y2="16" />
      <line x1="2" y1="9" x2="16" y2="9" />
      <line x1="9" y1="2" x2="9" y2="9" strokeDasharray="1.5 1.5" />
    </svg>
  );
}

function AnalyticsIcon({ active }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" className={active ? 'text-accent-500' : 'text-neutral-500'}>
      <polyline points="2,14 6,8 10,11 16,4" />
      <polyline points="12,4 16,4 16,8" />
    </svg>
  );
}

function GalleryIcon({ active }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" className={active ? 'text-accent-500' : 'text-neutral-500'}>
      <rect x="2" y="2" width="6" height="6" rx="1" />
      <rect x="10" y="2" width="6" height="6" rx="1" />
      <rect x="2" y="10" width="6" height="6" rx="1" />
      <rect x="10" y="10" width="6" height="6" rx="1" />
    </svg>
  );
}

function AboutIcon({ active }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" className={active ? 'text-accent-500' : 'text-neutral-500'}>
      <circle cx="9" cy="9" r="7" />
      <path d="M9 12V9M9 6.5V6" />
    </svg>
  );
}
