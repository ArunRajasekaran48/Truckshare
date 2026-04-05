import { StatusBadge } from '@/components/Common/StatusBadge';
import { CapacityIndicator } from './CapacityIndicator';
import { formatCurrency } from '@/utils/formatters';

export function TruckCard({ truck, actions = [], onClick, compact = false }) {
  const usedWeight = truck.capacityWeight - (truck.availableWeight ?? truck.capacityWeight);
  const usedVolume = truck.capacityVolume - (truck.availableVolume ?? truck.capacityVolume);
  const usedLength = truck.capacityLength - (truck.availableLength ?? truck.capacityLength);

  return (
    <div
      className={`card p-6 flex flex-col gap-4 transition-all duration-200 hover:shadow-2xl bg-gradient-to-br from-white via-blue-50 to-purple-50 border-2 border-blue-200 ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="font-black text-lg bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent truncate">{truck.model}</p>
          <div className="flex items-center gap-2 mt-2">
            <p className="text-xs text-slate-600 font-mono uppercase tracking-wider font-bold">{truck.licensePlate}</p>
            {(truck.driverId || truck.driverName) && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-green-100 to-cyan-100 text-green-700 rounded-full text-xs font-bold border-2 border-green-300">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
                {truck.driverId || truck.driverName}
              </div>
            )}
          </div>
        </div>
        <StatusBadge status={truck.status} />
      </div>

      {/* Route */}
      <div className="flex items-center gap-2 text-sm text-blue-700 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg px-4 py-3 font-bold border-2 border-blue-300">
        <span>{truck.fromLocation}</span>
        <svg className="w-4 h-4 text-blue-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
        <span>{truck.toLocation}</span>
      </div>

      {/* Capacity bars */}
      {!compact && (
        <div className="space-y-2">
          <CapacityIndicator used={usedWeight} total={truck.capacityWeight} unit="kg" label="Weight" />
          <CapacityIndicator used={usedVolume} total={truck.capacityVolume} unit="m³" label="Volume" />
          <CapacityIndicator used={usedLength} total={truck.capacityLength} unit="m" label="Length" />
        </div>
      )}

      {/* Pricing */}
      <div className="flex gap-4 text-xs text-slate-700 border-t-2 border-blue-200 pt-4">
        <span className="flex items-center gap-1.5">
          <span className="font-black text-purple-600">{formatCurrency(truck.pricePerKg)}</span><span className="text-slate-600">/kg</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="font-black text-purple-600">{formatCurrency(truck.pricePerLength)}</span><span className="text-slate-600">/m</span>
        </span>
        {truck.score != null && (
          <span className="ml-auto font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">⭐ Score: {truck.score}</span>
        )}
      </div>

      {/* Actions */}
      {actions.length > 0 && (
        <div className="flex gap-2 pt-2 flex-wrap" onClick={(e) => e.stopPropagation()}>
          {actions.map((action, i) => (
            <button
              key={i}
              onClick={action.onClick}
              className={action.variant === 'danger' ? 'btn-danger text-xs py-2 px-3 flex-1' : action.variant === 'secondary' ? 'btn-secondary text-xs py-2 px-3 flex-1' : 'btn-primary text-xs py-2 px-3 flex-1'}
            >
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
