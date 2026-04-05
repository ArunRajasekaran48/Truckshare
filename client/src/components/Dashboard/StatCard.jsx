export function StatCard({ label, value, unit, trend, icon, color = 'teal' }) {
  const colors = {
    teal: 'bg-teal-50 text-teal-600 border border-teal-100',
    amber: 'bg-amber-50 text-amber-600 border border-amber-100',
    blue: 'bg-blue-50 text-blue-600 border border-blue-100',
    green: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
    red: 'bg-red-50 text-red-600 border border-red-100',
  };

  return (
    <div className="card p-6 flex flex-col justify-between gap-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">{label}</p>
          <p className="text-3xl font-bold text-slate-900">
            {value}
            {unit && <span className="text-sm font-normal text-slate-500 ml-1">{unit}</span>}
          </p>
          {trend && (
            <p className={`text-xs mt-2 font-semibold ${trend.startsWith('+') ? 'text-emerald-600' : 'text-red-600'}`}>
              {trend} this week
            </p>
          )}
        </div>
        {icon && (
          <div className={`p-3 rounded-lg text-lg ${colors[color]}`}>{icon}</div>
        )}
      </div>
    </div>
  );
}
