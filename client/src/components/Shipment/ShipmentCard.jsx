import { StatusBadge } from '@/components/Common/StatusBadge';
import { truncateId, formatDate } from '@/utils/formatters';

export function ShipmentCard({ shipment, onClick, actions = [] }) {
  return (
    <div
      className={`card p-4 flex flex-col gap-3 transition-shadow hover:shadow-md ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-xs text-gray-400 font-mono">#{truncateId(shipment.id)}</p>
          <div className="flex items-center gap-2 mt-0.5">
            {shipment.isSplit && (
              <span className="text-xs bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full font-medium">
                Split
              </span>
            )}
          </div>
        </div>
        <StatusBadge status={shipment.status} />
      </div>

      {/* Route */}
      <div className="flex items-center gap-2 text-sm text-gray-700 bg-gray-50 rounded-lg px-3 py-2">
        <span className="font-medium">{shipment.fromLocation}</span>
        <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
        <span className="font-medium">{shipment.toLocation}</span>
      </div>

      {/* Capacity */}
      <div className="grid grid-cols-3 gap-2 text-center">
        {[
          { label: 'Weight', val: shipment.requiredWeight, unit: 'kg' },
          { label: 'Volume', val: shipment.requiredVolume, unit: 'm³' },
          { label: 'Length', val: shipment.requiredLength, unit: 'm' },
        ].map(({ label, val, unit }) => (
          <div key={label} className="bg-gray-50 rounded-lg py-2">
            <p className="text-xs text-gray-400">{label}</p>
            <p className="text-sm font-semibold text-gray-800">
              {val?.toLocaleString()} <span className="text-xs font-normal text-gray-500">{unit}</span>
            </p>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-gray-400 pt-1 border-t border-gray-100">
        <span>{formatDate(shipment.createdAt)}</span>
        {shipment.allocatedWeight > 0 && (
          <span className="text-teal-600 font-medium">
            {shipment.allocatedWeight}/{shipment.requiredWeight} kg allocated
          </span>
        )}
      </div>

      {/* Actions */}
      {actions.length > 0 && (
        <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
          {actions.map((a, i) => (
            <button
              key={i}
              onClick={a.onClick}
              className={a.variant === 'danger' ? 'btn-danger text-xs py-1 px-3' : a.variant === 'secondary' ? 'btn-secondary text-xs py-1 px-3' : 'btn-primary text-xs py-1 px-3'}
            >
              {a.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
