import { useNavigate, useParams } from 'react-router-dom';
import { Layout } from '@/components/Common/Layout';
import { StatusBadge } from '@/components/Common/StatusBadge';
import { LoadingSpinner } from '@/components/Common/LoadingSpinner';
import { useShipment } from '@/hooks/useShipment';
import { formatDate, truncateId } from '@/utils/formatters';

export function ShipmentDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: shipment, isLoading } = useShipment(id);

  if (isLoading) return <Layout><LoadingSpinner fullPage /></Layout>;
  if (!shipment) return <Layout><p className="text-gray-500 p-8">Shipment not found.</p></Layout>;

  const canFindTrucks = ['PENDING', 'MATCHED'].includes(shipment.status);
  const isActive = ['BOOKED', 'IN_TRANSIT'].includes(shipment.status);

  return (
    <Layout>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <button onClick={() => navigate(-1)} className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1 mb-3">
              ← Back
            </button>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-gray-900">Shipment</h1>
              <span className="font-mono text-gray-400 text-sm">#{truncateId(shipment.id)}</span>
            </div>
          </div>
          <StatusBadge status={shipment.status} />
        </div>

        {/* Route */}
        <div className="card p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">Route</h2>
          <div className="flex items-center gap-3 text-lg font-semibold text-gray-900">
            <span>{shipment.fromLocation}</span>
            <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
            <span>{shipment.toLocation}</span>
          </div>
          {shipment.isSplit && (
            <span className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
              Split shipment
            </span>
          )}
        </div>

        {/* Capacity */}
        <div className="card p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">Capacity</h2>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Weight', req: shipment.requiredWeight, alloc: shipment.allocatedWeight, unit: 'kg' },
              { label: 'Volume', req: shipment.requiredVolume, alloc: shipment.allocatedVolume, unit: 'm³' },
              { label: 'Length', req: shipment.requiredLength, alloc: shipment.allocatedLength, unit: 'm' },
            ].map(({ label, req, alloc, unit }) => (
              <div key={label} className="bg-gray-50 rounded-xl p-3 text-center">
                <p className="text-xs text-gray-400">{label}</p>
                <p className="font-bold text-gray-900 text-sm mt-1">
                  {req?.toLocaleString()} <span className="font-normal text-gray-400 text-xs">{unit}</span>
                </p>
                {alloc > 0 && (
                  <p className="text-xs text-teal-600 mt-0.5">{alloc?.toLocaleString()} allocated</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Status timeline */}
        <div className="card p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">Status History</h2>
          <div className="flex items-center gap-0">
            {['PENDING', 'MATCHED', 'BOOKED', 'IN_TRANSIT', 'DELIVERED'].map((s, i, arr) => {
              const statuses = ['PENDING', 'MATCHED', 'PARTIALLY_BOOKED', 'BOOKED', 'IN_TRANSIT', 'DELIVERED'];
              const currentIdx = statuses.indexOf(shipment.status);
              const stepIdx = statuses.indexOf(s);
              const done = currentIdx > stepIdx;
              const active = currentIdx === stepIdx;
              return (
                <div key={s} className="flex items-center flex-1">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${done ? 'bg-teal-600 text-white' : active ? 'bg-teal-100 border-2 border-teal-600 text-teal-700' : 'bg-gray-100 text-gray-400'}`}>
                    {done ? '✓' : i + 1}
                  </div>
                  {i < arr.length - 1 && (
                    <div className={`flex-1 h-0.5 ${done ? 'bg-teal-600' : 'bg-gray-200'}`} />
                  )}
                </div>
              );
            })}
          </div>
          <div className="flex justify-between mt-1">
            {['Pending', 'Matched', 'Booked', 'In Transit', 'Delivered'].map((l) => (
              <span key={l} className="text-xs text-gray-400 text-center" style={{ width: '20%' }}>{l}</span>
            ))}
          </div>
        </div>

        {/* Meta */}
        <div className="card p-5">
          <div className="space-y-2 text-sm">
            {[
              { label: 'Created', val: formatDate(shipment.createdAt) },
              { label: 'Shipment ID', val: shipment.id },
              { label: 'Business User', val: shipment.businessUserId },
            ].map(({ label, val }) => (
              <div key={label} className="flex justify-between">
                <span className="text-gray-400">{label}</span>
                <span className="font-medium text-gray-700 font-mono text-xs truncate max-w-[200px]">{val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          {canFindTrucks && (
            <button onClick={() => navigate(`/shipments/${id}/match`)} className="btn-primary flex-1">
              🔍 Find Matching Trucks
            </button>
          )}
          {isActive && (
            <button onClick={() => navigate('/bookings')} className="btn-secondary flex-1">
              📋 View Bookings
            </button>
          )}
        </div>
      </div>
    </Layout>
  );
}
