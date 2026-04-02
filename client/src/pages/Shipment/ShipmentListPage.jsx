import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Common/Layout';
import { ShipmentCard } from '@/components/Shipment/ShipmentCard';
import { StatusBadge } from '@/components/Common/StatusBadge';
import { LoadingSpinner } from '@/components/Common/LoadingSpinner';
import { EmptyState } from '@/components/Common/EmptyState';
import { useShipments } from '@/hooks/useShipment';
import { SHIPMENT_STATUS } from '@/utils/constants';

const ALL = 'ALL';

export function ShipmentListPage() {
  const navigate = useNavigate();
  const { data: shipments = [], isLoading } = useShipments();
  const [filter, setFilter] = useState(ALL);
  const [search, setSearch] = useState('');

  const filtered = shipments.filter((s) => {
    const matchesStatus = filter === ALL || s.status === filter;
    const matchesSearch =
      !search ||
      s.fromLocation?.toLowerCase().includes(search.toLowerCase()) ||
      s.toLocation?.toLowerCase().includes(search.toLowerCase()) ||
      s.id?.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const tabs = [ALL, ...Object.values(SHIPMENT_STATUS)];

  return (
    <Layout>
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">My Shipments</h1>
          <button onClick={() => navigate('/shipments/create')} className="btn-primary">
            + New Shipment
          </button>
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Search by city or ID…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-field max-w-xs"
        />

        {/* Status tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                filter === tab
                  ? 'bg-teal-600 text-white border-teal-600'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
              }`}
            >
              {tab === ALL ? 'All' : tab.replace(/_/g, ' ')}
              {tab !== ALL && (
                <span className="ml-1.5 text-xs opacity-70">
                  ({shipments.filter((s) => s.status === tab).length})
                </span>
              )}
            </button>
          ))}
        </div>

        {/* List */}
        {isLoading ? (
          <LoadingSpinner text="Loading shipments…" />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon="📦"
            title={search || filter !== ALL ? 'No matching shipments' : 'No shipments yet'}
            description={search || filter !== ALL ? 'Try adjusting your filters' : 'Create your first shipment to get started'}
            action={search || filter !== ALL ? 'Clear filters' : 'Create Shipment'}
            onAction={
              search || filter !== ALL
                ? () => { setSearch(''); setFilter(ALL); }
                : () => navigate('/shipments/create')
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((s) => (
              <ShipmentCard
                key={s.id}
                shipment={s}
                onClick={() => navigate(`/shipments/${s.id}`)}
                actions={
                  s.status === 'MATCHED' || s.status === 'PENDING'
                    ? [{ label: '🔍 Find Trucks', onClick: () => navigate(`/shipments/${s.id}/match`) }]
                    : []
                }
              />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
