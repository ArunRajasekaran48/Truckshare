import { StatusBadge } from '@/components/Common/StatusBadge';
import { CapacityIndicator } from './CapacityIndicator';
import { formatCurrency } from '@/utils/formatters';

export function TruckCard({ truck, actions = [], onClick, compact = false }) {
  const usedWeight = truck.capacityWeight - (truck.availableWeight ?? truck.capacityWeight);
  const usedVolume = truck.capacityVolume - (truck.availableVolume ?? truck.capacityVolume);
  const usedLength = truck.capacityLength - (truck.availableLength ?? truck.capacityLength);

  return (
    <div
      className={`card p-5 flex flex-col gap-4 transition-all duration-200 hover:shadow-lg ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="font-bold text-slate-900 truncate text-lg">{truck.model}</p>
          <div className="flex items-center gap-2 mt-1.5">
            <p className="text-xs text-slate-500 font-mono uppercase tracking-wider">{truck.licensePlate}</p>
            {(truck.driverId || truck.driverName) && (
              <div className="flex items-center gap-1.5 px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold border border-blue-200">
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
      <div className="flex items-center gap-2 text-sm text-slate-700 bg-slate-50 rounded-lg px-3.5 py-2.5 font-medium">
        <span>{truck.fromLocation}</span>
        <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
      <div className="flex gap-4 text-xs text-slate-600 border-t border-slate-200 pt-4">
        <span className="flex items-center gap-1.5">
          <span className="font-bold text-slate-900">{formatCurrency(truck.pricePerKg)}</span><span className="text-slate-500">/kg</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="font-bold text-slate-900">{formatCurrency(truck.pricePerLength)}</span><span className="text-slate-500">/m</span>
        </span>
        {truck.score != null && (
          <span className="ml-auto font-bold text-teal-600">Score: {truck.score}</span>
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
