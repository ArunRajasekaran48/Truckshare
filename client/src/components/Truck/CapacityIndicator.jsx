export function CapacityIndicator({ used, total, unit, label }) {
  const pct = total > 0 ? Math.min(100, Math.round((used / total) * 100)) : 0;
  const barColor =
    pct > 90 ? 'bg-red-500' : pct > 70 ? 'bg-amber-500' : 'bg-teal-500';

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">{label}</span>
        <span className="text-xs font-bold text-slate-900">
          {used?.toLocaleString()} / {total?.toLocaleString()} {unit}
        </span>
      </div>
      <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-300 ${barColor}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="text-xs text-slate-500 mt-1 text-right font-medium">{pct}% used</p>
    </div>
  );
}
