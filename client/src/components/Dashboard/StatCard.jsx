export function StatCard({ label, value, unit, trend, icon, color = 'blue' }) {
  const colors = {
    blue: 'bg-gradient-to-br from-blue-100 to-cyan-100 text-blue-700 border-2 border-blue-300 shadow-lg',
    amber: 'bg-gradient-to-br from-amber-100 to-orange-100 text-amber-700 border-2 border-amber-300 shadow-lg',
    purple: 'bg-gradient-to-br from-purple-100 to-pink-100 text-purple-700 border-2 border-purple-300 shadow-lg',
    green: 'bg-gradient-to-br from-green-100 to-emerald-100 text-green-700 border-2 border-green-300 shadow-lg',
    red: 'bg-gradient-to-br from-red-100 to-pink-100 text-red-700 border-2 border-red-300 shadow-lg',
  };

  return (
    <div className="card p-6 flex flex-col justify-between gap-4 bg-gradient-to-br from-white via-blue-50 to-purple-50 border-2 border-blue-200 hover:shadow-2xl">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <p className="text-xs font-black text-blue-600 uppercase tracking-widest mb-3">{label}</p>
          <p className="text-4xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            {value}
            {unit && <span className="text-sm font-bold text-slate-500 ml-2">{unit}</span>}
          </p>
          {trend && (
            <p className={`text-xs mt-3 font-bold flex items-center gap-1 ${trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
              {trend.startsWith('+') ? '📈' : '📉'} {trend} this week
            </p>
          )}
        </div>
        {icon && (
          <div className={`p-4 rounded-2xl text-2xl ${colors[color]} transform hover:scale-110 transition-transform`}>{icon}</div>
        )}
      </div>
    </div>
  );
}
