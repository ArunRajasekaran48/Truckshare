import { useNavigate, useParams } from 'react-router-dom';
import { Layout } from '@/components/Common/Layout';
import { StatusBadge } from '@/components/Common/StatusBadge';
import { CapacityIndicator } from '@/components/Truck/CapacityIndicator';
import { LoadingSpinner } from '@/components/Common/LoadingSpinner';
import { useTruck } from '@/hooks/useTruck';
import { formatCurrency, formatDate } from '@/utils/formatters';

export function TruckDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: truck, isLoading } = useTruck(id);

  if (isLoading) return <Layout><LoadingSpinner fullPage /></Layout>;
  if (!truck) return <Layout><p className="text-gray-500 p-8">Truck not found.</p></Layout>;

  const usedWeight = truck.capacityWeight - truck.availableWeight;
  const usedVolume = truck.capacityVolume - truck.availableVolume;
  const usedLength = truck.capacityLength - truck.availableLength;

  return (
    <Layout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <button onClick={() => navigate(-1)} className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1 mb-3">
              ← Back
            </button>
            <h1 className="text-xl font-bold text-gray-900">{truck.model}</h1>
            <p className="font-mono text-gray-400 text-sm">{truck.licensePlate}</p>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status={truck.status} />
            <button onClick={() => navigate(`/trucks/${id}/edit`)} className="btn-secondary text-sm py-1.5">
              Edit
            </button>
          </div>
        </div>

        {/* Route */}
        <div className="card p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">Route</h2>
          <div className="flex items-center gap-3 text-base font-medium text-gray-900">
            <span>{truck.fromLocation}</span>
            <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
            <span>{truck.toLocation}</span>
          </div>
        </div>

        {truck.points?.length > 0 && (
          <div className="card p-5">
            <h2 className="text-sm font-semibold text-gray-700 mb-3">Boarding &amp; dropping stops</h2>
            <ul className="space-y-3">
              {truck.points.map((p) => (
                <li key={p.id} className="flex items-start gap-3 text-sm border border-gray-100 rounded-lg p-3">
                  <span className="text-xs font-semibold uppercase px-2 py-0.5 rounded bg-teal-100 text-teal-800 shrink-0">
                    {p.type}
                  </span>
                  <div>
                    <p className="font-medium text-gray-900">{p.name}</p>
                    {p.scheduledTime && <p className="text-xs text-gray-500">{p.scheduledTime}</p>}
                    {p.address && <p className="text-xs text-gray-600">{p.address}</p>}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Capacity */}
        <div className="card p-5 space-y-4">
          <h2 className="text-sm font-semibold text-gray-700">Capacity Utilisation</h2>
          <CapacityIndicator used={usedWeight} total={truck.capacityWeight} unit="kg" label="Weight" />
          <CapacityIndicator used={usedVolume} total={truck.capacityVolume} unit="m³" label="Volume" />
          <CapacityIndicator used={usedLength} total={truck.capacityLength} unit="m" label="Length" />
        </div>

        {/* Pricing */}
        <div className="card p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">Pricing</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-gray-50 rounded-xl p-3 text-center">
              <p className="text-gray-400 text-xs mb-1">Per kilogram</p>
              <p className="font-bold text-gray-900 text-lg">{formatCurrency(truck.pricePerKg)}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3 text-center">
              <p className="text-gray-400 text-xs mb-1">Per meter</p>
              <p className="font-bold text-gray-900 text-lg">{formatCurrency(truck.pricePerLength)}</p>
            </div>
          </div>
        </div>

        {/* Meta */}
        <div className="card p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">Details</h2>
          <div className="space-y-2 text-sm">
            {[
              { label: 'Owner ID', val: truck.ownerId },
              { label: 'Added', val: formatDate(truck.createdAt) },
            ].map(({ label, val }) => (
              <div key={label} className="flex justify-between">
                <span className="text-gray-400">{label}</span>
                <span className="font-medium text-gray-700">{val || '-'}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
