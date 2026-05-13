import AnimatedCounter from './AnimatedCounter';

/**
 * StatCard — Displays a labeled statistic with animated value.
 */
export default function StatCard({ label, value, suffix = '', prefix = '', decimals = 0, icon, compact = false }) {
  const isNumeric = typeof value === 'number' && isFinite(value);

  return (
    <div className={`${compact ? 'py-2' : 'py-3'} px-3`}>
      <div className="flex items-center gap-2 mb-1">
        {icon && <span className="text-neutral-500">{icon}</span>}
        <span className="label">{label}</span>
      </div>
      <div className={compact ? 'text-lg font-semibold text-neutral-100 font-mono' : 'stat-value'}>
        {isNumeric ? (
          <AnimatedCounter value={value} decimals={decimals} prefix={prefix} suffix={suffix} />
        ) : (
          <span className="tabular-nums">{prefix}{value}{suffix}</span>
        )}
      </div>
    </div>
  );
}
