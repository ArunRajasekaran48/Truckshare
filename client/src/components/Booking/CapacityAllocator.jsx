import { useState, useMemo } from 'react';
import { CapacityIndicator } from '@/components/Truck/CapacityIndicator';

export function CapacityAllocator({ trucks, required, onChange }) {
  const [allocation, setAllocation] = useState(
    trucks.reduce((acc, t) => {
      acc[t.id] = { weight: 0, volume: 0, length: 0 };
      return acc;
    }, {})
  );

  const totals = useMemo(() => {
    return Object.values(allocation).reduce(
      (sum, a) => ({
        weight: sum.weight + (a.weight || 0),
        volume: sum.volume + (a.volume || 0),
        length: sum.length + (a.length || 0),
      }),
      { weight: 0, volume: 0, length: 0 }
    );
  }, [allocation]);

  const isValid =
    totals.weight >= required.weight &&
    totals.volume >= required.volume &&
    totals.length >= required.length;

  const handleChange = (truckId, field, raw) => {
    const value = Math.max(0, Number(raw) || 0);
    const updated = { ...allocation, [truckId]: { ...allocation[truckId], [field]: value } };
    setAllocation(updated);
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className={`p-3 rounded-xl border text-sm ${isValid ? 'bg-emerald-50 border-emerald-200' : 'bg-blue-50 border-blue-200'}`}>
        <p className="font-semibold mb-2 text-gray-700">{isValid ? '✅ Allocation complete' : '⚖️ Allocation summary'}</p>
        {[
          { label: 'Weight', got: totals.weight, need: required.weight, unit: 'kg' },
          { label: 'Volume', got: totals.volume, need: required.volume, unit: 'm³' },
          { label: 'Length', got: totals.length, need: required.length, unit: 'm' },
        ].map(({ label, got, need, unit }) => (
          <div key={label} className="flex justify-between text-xs text-gray-600">
            <span>{label}</span>
            <span className={got >= need ? 'text-emerald-600 font-medium' : 'text-amber-600 font-medium'}>
              {got.toLocaleString()} / {need.toLocaleString()} {unit}
            </span>
          </div>
        ))}
      </div>

      {/* Per-truck sliders */}
      {trucks.map((truck) => (
        <div key={truck.id} className="card p-4 space-y-3">
          <p className="font-semibold text-gray-900 text-sm">
            {truck.model} — <span className="font-mono text-gray-400 text-xs">{truck.licensePlate}</span>
          </p>

          {[
            { label: 'Weight (kg)', field: 'weight', max: truck.availableWeight },
            { label: 'Volume (m³)', field: 'volume', max: truck.availableVolume },
            { label: 'Length (m)', field: 'length', max: truck.availableLength },
          ].map(({ label, field, max }) => (
            <div key={field}>
              <div className="flex justify-between mb-1">
                <label className="text-xs text-gray-500">{label}</label>
                <span className="text-xs text-gray-400">max {max?.toLocaleString()}</span>
              </div>
              <input
                type="number"
                min="0"
                max={max}
                step="any"
                value={allocation[truck.id]?.[field] || ''}
                onChange={(e) => handleChange(truck.id, field, e.target.value)}
                className="input-field text-sm"
              />
            </div>
          ))}
        </div>
      ))}

      {!isValid && (
        <p className="text-xs text-amber-600 text-center">
          Fill in allocations to meet or exceed required capacity to continue.
        </p>
      )}
    </div>
  );
}
