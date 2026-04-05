import { StatusBadge } from '@/components/Common/StatusBadge';
import { truncateId, formatDate } from '@/utils/formatters';

export function ShipmentCard({ shipment, onClick, actions = [] }) {
  return (
    <div
      className={`card p-6 flex flex-col gap-4 transition-all duration-200 hover:shadow-2xl bg-gradient-to-br from-white via-purple-50 to-pink-50 border-2 border-purple-200 ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs text-purple-600 font-mono uppercase tracking-widest font-bold">📦 #{truncateId(shipment.id)}</p>
          <div className="flex items-center gap-2 mt-2">
            {shipment.isSplit && (
              <span className="text-xs bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 px-3 py-1.5 rounded-full font-bold border-2 border-purple-300">
                ✂️ Split
              </span>
            )}
          </div>
        </div>
        <StatusBadge status={shipment.status} />
      </div>

      {/* Route */}
      <div className="flex items-center gap-2 text-sm text-purple-700 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg px-4 py-3 font-bold border-2 border-purple-300">
        <span>{shipment.fromLocation}</span>
        <svg className="w-4 h-4 text-purple-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
        <span>{shipment.toLocation}</span>
      </div>

      {/* Capacity */}
      <div className="grid grid-cols-3 gap-3 text-center">
        {[
          { label: 'Weight', val: shipment.requiredWeight, unit: 'kg', icon: '⚖️' },
          { label: 'Volume', val: shipment.requiredVolume, unit: 'm³', icon: '📦' },
          { label: 'Length', val: shipment.requiredLength, unit: 'm', icon: '📏' },
        ].map(({ label, val, unit, icon }) => (
          <div key={label} className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg py-3 border-2 border-purple-200">
            <p className="text-lg mb-1">{icon}</p>
            <p className="text-xs text-purple-600 font-bold uppercase">{label}</p>
            <p className="text-base font-black text-purple-900 mt-1">
              {val?.toLocaleString()} <span className="text-xs font-bold text-purple-600">{unit}</span>
            </p>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-slate-600 pt-3 border-t-2 border-purple-200">
        <span className="font-semibold">📅 {formatDate(shipment.createdAt)}</span>
        {shipment.allocatedWeight > 0 && (
          <span className="font-black bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">
            ✅ {shipment.allocatedWeight}/{shipment.requiredWeight} kg
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
