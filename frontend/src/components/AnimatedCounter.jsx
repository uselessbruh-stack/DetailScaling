import { useEffect, useRef, useState } from 'react';

/**
 * AnimatedCounter — Animates a number from 0 (or previous value) to the target value.
 * Uses requestAnimationFrame for smooth 60fps animation.
 */
export default function AnimatedCounter({ value, duration = 600, decimals = 0, prefix = '', suffix = '', className = '' }) {
  const [displayValue, setDisplayValue] = useState(0);
  const prevValue = useRef(0);
  const animFrameRef = useRef(null);

  useEffect(() => {
    const startValue = prevValue.current;
    const endValue = typeof value === 'number' ? value : 0;
    const startTime = performance.now();

    function animate(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = startValue + (endValue - startValue) * eased;

      setDisplayValue(current);

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(animate);
      } else {
        prevValue.current = endValue;
      }
    }

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [value, duration]);

  const formatted = decimals > 0
    ? displayValue.toFixed(decimals)
    : Math.round(displayValue).toLocaleString();

  return (
    <span className={`tabular-nums ${className}`}>
      {prefix}{formatted}{suffix}
    </span>
  );
}
