import { useState } from 'react';
import { ShipmentCard } from './ShipmentCard';
import { EmptyState } from '@/components/Common/EmptyState';
import { SHIPMENT_STATUS } from '@/utils/constants';

/**
 * ShipmentList
 * @prop {Array}    shipments    - array of shipment objects
 * @prop {Function} onSelect     - called when shipment clicked
 * @prop {string}   filterStatus - optional pre-set status filter
 * @prop {string}   sortBy       - 'newest' | 'oldest'
 */
export function ShipmentList({ shipments = [], onSelect, filterStatus, sortBy = 'newest' }) {
  const [activeFilter, setActiveFilter] = useState(filterStatus || 'ALL');
  const [search, setSearch] = useState('');

  const filtered = shipments
    .filter((s) => activeFilter === 'ALL' || s.status === activeFilter)
    .filter((s) => {
      if (!search) return true;
      const q = search.toLowerCase();
      return (
        s.fromLocation?.toLowerCase().includes(q) ||
        s.toLocation?.toLowerCase().includes(q) ||
        s.id?.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      const da = new Date(a.createdAt || 0);
      const db = new Date(b.createdAt || 0);
      return sortBy === 'oldest' ? da - db : db - da;
    });

  const tabs = ['ALL', ...Object.values(SHIPMENT_STATUS)];

  return (
    <div className="space-y-5">
      {/* Search */}
      <input
        type="text"
        placeholder="Search by city or ID…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="input-field max-w-xs"
      />

      {/* Status tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveFilter(tab)}
            className={`shrink-0 px-3.5 py-2 rounded-full text-xs font-semibold border transition-colors ${
              activeFilter === tab
                ? 'bg-teal-600 text-white border-teal-600 shadow-md'
                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
            }`}
          >
            {tab === 'ALL' ? 'All' : tab.replace(/_/g, ' ')}
            {tab !== 'ALL' && (
              <span className="ml-1 opacity-70 font-normal">
                ({shipments.filter((s) => s.status === tab).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Cards */}
      {filtered.length === 0 ? (
        <EmptyState
          icon="📦"
          title="No shipments found"
          description="Try adjusting search or filters"
          action="Clear filters"
          onAction={() => { setSearch(''); setActiveFilter('ALL'); }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((s) => (
            <ShipmentCard
              key={s.id}
              shipment={s}
              onClick={onSelect ? () => onSelect(s) : undefined}
            />
          ))}
        </div>
      )}
    </div>
  );
}
