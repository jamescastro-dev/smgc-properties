/**
 * iOS-style segmented control for admin filters: equal-width segments in one
 * track, so a filter never wraps onto a second line. On phones a count sits
 * under its label — "Available 25" side by side doesn't fit a quarter of a
 * 390px screen.
 */
export default function Segmented({
  label,
  options,
  value,
  onChange,
  className = "",
}: {
  /** Accessible name for the group, e.g. "Status". */
  label: string;
  options: readonly { value: string; label: string; count?: number }[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}) {
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className={`grid grid-flow-col auto-cols-fr gap-1 p-1 bg-luxury-900 border border-luxury-700 rounded-xl ${className}`}>
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(o.value)}
            className={`min-h-11 sm:min-h-9 px-1.5 sm:px-3 rounded-lg text-xs font-semibold whitespace-nowrap flex flex-col sm:flex-row items-center justify-center sm:gap-1.5 leading-tight transition-colors ${
              active
                ? "bg-gold-500 text-luxury-900 shadow-sm"
                : "text-luxury-400 hover:text-luxury-50 hover:bg-luxury-700/50"
            }`}>
            {o.label}
            {o.count !== undefined && (
              <span className={`text-[11px] tabular-nums ${active ? "text-luxury-900/60" : "text-luxury-500"}`}>
                {o.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
