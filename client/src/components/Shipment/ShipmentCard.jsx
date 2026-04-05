import { StatusBadge } from '@/components/Common/StatusBadge';
import { truncateId, formatDate } from '@/utils/formatters';

export function ShipmentCard({ shipment, onClick, actions = [] }) {
  return (
    <div
      className={`card p-5 flex flex-col gap-4 transition-all duration-200 hover:shadow-lg ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs text-slate-500 font-mono uppercase tracking-wide">#{truncateId(shipment.id)}</p>
          <div className="flex items-center gap-2 mt-2">
            {shipment.isSplit && (
              <span className="text-xs bg-purple-50 text-purple-700 px-2.5 py-1 rounded-full font-semibold border border-purple-200">
                Split
              </span>
            )}
          </div>
        </div>
        <StatusBadge status={shipment.status} />
      </div>

      {/* Route */}
      <div className="flex items-center gap-2 text-sm text-slate-700 bg-slate-50 rounded-lg px-3.5 py-2.5 font-medium">
        <span>{shipment.fromLocation}</span>
        <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
        <span>{shipment.toLocation}</span>
      </div>

      {/* Capacity */}
      <div className="grid grid-cols-3 gap-2 text-center">
        {[
          { label: 'Weight', val: shipment.requiredWeight, unit: 'kg' },
          { label: 'Volume', val: shipment.requiredVolume, unit: 'm³' },
          { label: 'Length', val: shipment.requiredLength, unit: 'm' },
        ].map(({ label, val, unit }) => (
          <div key={label} className="bg-slate-50 rounded-lg py-3 border border-slate-200">
            <p className="text-xs text-slate-500 font-semibold">{label}</p>
            <p className="text-sm font-bold text-slate-900 mt-1">
              {val?.toLocaleString()} <span className="text-xs font-normal text-slate-500">{unit}</span>
            </p>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-200">
        <span>{formatDate(shipment.createdAt)}</span>
        {shipment.allocatedWeight > 0 && (
          <span className="text-teal-600 font-bold">
            {shipment.allocatedWeight}/{shipment.requiredWeight} kg allocated
          </span>
        )}
      </div>

      {/* Actions */}
      {actions.length > 0 && (
        <div className="flex gap-2 flex-wrap" onClick={(e) => e.stopPropagation()}>
          {actions.map((a, i) => (
            <button
              key={i}
              onClick={a.onClick}
              className={a.variant === 'danger' ? 'btn-danger text-xs py-2 px-3 flex-1' : a.variant === 'secondary' ? 'btn-secondary text-xs py-2 px-3 flex-1' : 'btn-primary text-xs py-2 px-3 flex-1'}
            >
              {a.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
