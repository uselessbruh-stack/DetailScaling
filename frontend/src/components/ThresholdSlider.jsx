/**
 * ThresholdSlider — Styled range input with live value display and label.
 */
export default function ThresholdSlider({ value, onChange, min = 0, max = 5000, step = 10, disabled = false }) {
  // Calculate fill percentage for the track gradient
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="label">Threshold</span>
        <span className="text-sm font-mono text-accent-400 tabular-nums">{value}</span>
      </div>
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          disabled={disabled}
          className="w-full cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          style={{
            background: `linear-gradient(to right, #d97706 0%, #d97706 ${percentage}%, #333333 ${percentage}%, #333333 100%)`,
          }}
        />
      </div>
      <div className="flex justify-between text-[10px] text-neutral-600">
        <span>More Detail</span>
        <span>More Compression</span>
      </div>
    </div>
  );
}
