import { StatusBadge } from '@/components/Common/StatusBadge';
import { CapacityIndicator } from './CapacityIndicator';
import { formatCurrency } from '@/utils/formatters';

export function TruckCard({ truck, actions = [], onClick, compact = false }) {
  const usedWeight = truck.capacityWeight - (truck.availableWeight ?? truck.capacityWeight);
  const usedVolume = truck.capacityVolume - (truck.availableVolume ?? truck.capacityVolume);
  const usedLength = truck.capacityLength - (truck.availableLength ?? truck.capacityLength);

  return (
    <div
      className={`card p-4 flex flex-col gap-3 transition-shadow hover:shadow-md ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 truncate">{truck.model}</p>
          <div className="flex items-center gap-2 mt-0.5">
            <p className="text-xs text-gray-400 font-mono uppercase tracking-wider">{truck.licensePlate}</p>
            {truck.driverName && (
              <div className="flex items-center gap-1 px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded text-[10px] font-medium border border-blue-100">
                <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
                {truck.driverName}
              </div>
            )}
          </div>
        </div>
        <StatusBadge status={truck.status} />
      </div>

      {/* Route */}
      <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 rounded-lg px-3 py-2">
        <span className="font-medium">{truck.fromLocation}</span>
        <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
        <span className="font-medium">{truck.toLocation}</span>
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
      <div className="flex gap-3 text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <span className="font-semibold text-gray-700">{formatCurrency(truck.pricePerKg)}</span>/kg
        </span>
        <span className="flex items-center gap-1">
          <span className="font-semibold text-gray-700">{formatCurrency(truck.pricePerLength)}</span>/m
        </span>
        {truck.score != null && (
          <span className="ml-auto font-semibold text-teal-600">Score: {truck.score}</span>
        )}
      </div>

      {/* Actions */}
      {actions.length > 0 && (
        <div className="flex gap-2 pt-1 border-t border-gray-100" onClick={(e) => e.stopPropagation()}>
          {actions.map((action, i) => (
            <button
              key={i}
              onClick={action.onClick}
              className={action.variant === 'danger' ? 'btn-danger text-xs py-1 px-3' : action.variant === 'secondary' ? 'btn-secondary text-xs py-1 px-3' : 'btn-primary text-xs py-1 px-3'}
            >
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
