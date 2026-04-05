import { useState } from 'react';
import { TruckCard } from './TruckCard';
import { EmptyState } from '@/components/Common/EmptyState';

/**
 * TruckList
 * @prop {Array}    trucks   - array of truck objects
 * @prop {Function} onSelect - called when a truck is selected
 * @prop {string}   view     - 'grid' | 'list'
 * @prop {Array}    actions  - forwarded to each TruckCard
 */
export function TruckList({ trucks = [], onSelect, view = 'grid', actions = [] }) {
  const [sortBy, setSortBy] = useState('newest');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const sorted = [...trucks]
    .filter((t) => statusFilter === 'ALL' || t.status === statusFilter)
    .sort((a, b) => {
      if (sortBy === 'price') return (a.pricePerKg ?? 0) - (b.pricePerKg ?? 0);
      if (sortBy === 'capacity') return (b.availableWeight ?? 0) - (a.availableWeight ?? 0);
      // newest: fallback to creation order (reverse)
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });

  if (!trucks.length) {
    return (
      <EmptyState icon="🚛" title="No trucks found" description="No trucks match your criteria." />
    );
  }

  return (
    <div className="space-y-5">
      {/* Controls */}
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-2">
          {['ALL', 'AVAILABLE', 'IN_TRANSIT', 'MAINTENANCE'].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3.5 py-2 rounded-full text-xs font-semibold border transition-colors ${
                statusFilter === s
                  ? 'bg-teal-600 text-white border-teal-600 shadow-md'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
              }`}
            >
              {s === 'ALL' ? 'All' : s.replace('_', ' ')}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 text-sm text-slate-600">
          <label className="text-xs font-semibold text-slate-500 uppercase">Sort:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-xs border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-1 focus:ring-teal-500 font-medium"
          >
            <option value="newest">Newest</option>
            <option value="price">Price ↑</option>
            <option value="capacity">Capacity ↓</option>
          </select>
        </div>
      </div>

      {/* Truck cards */}
      {sorted.length === 0 ? (
        <EmptyState
          icon="🔍"
          title="No trucks match"
          description="Try changing the status filter."
          action="Clear filter"
          onAction={() => setStatusFilter('ALL')}
        />
      ) : view === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {sorted.map((truck) => (
            <TruckCard
              key={truck.id}
              truck={truck}
              onClick={onSelect ? () => onSelect(truck) : undefined}
              actions={actions}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {sorted.map((truck) => (
            <TruckCard
              key={truck.id}
              truck={truck}
              compact
              onClick={onSelect ? () => onSelect(truck) : undefined}
              actions={actions}
            />
          ))}
        </div>
      )}
    </div>
  );
}
