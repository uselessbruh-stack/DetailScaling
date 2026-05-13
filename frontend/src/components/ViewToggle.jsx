/**
 * ViewToggle — Toggle buttons for switching between canvas view modes.
 */
export default function ViewToggle({ activeView, onChange, views }) {
  return (
    <div className="inline-flex bg-surface-700 rounded-md border border-surface-500 p-0.5">
      {views.map(({ id, label, icon }) => (
        <button
          key={id}
          onClick={() => onChange(id)}
          className={`
            px-3 py-1.5 text-xs font-medium rounded transition-all duration-150
            flex items-center gap-1.5
            ${activeView === id
              ? 'bg-surface-500 text-neutral-100 shadow-sm'
              : 'text-neutral-500 hover:text-neutral-300'
            }
          `}
        >
          {icon && <span className="w-3.5 h-3.5">{icon}</span>}
          {label}
        </button>
      ))}
    </div>
  );
}
