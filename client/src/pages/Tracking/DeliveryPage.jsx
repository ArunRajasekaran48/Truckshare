import { useNavigate, useParams } from 'react-router-dom';
import { Layout } from '@/components/Common/Layout';
import { StatusBadge } from '@/components/Common/StatusBadge';
import { LoadingSpinner } from '@/components/Common/LoadingSpinner';
import { LocationMarker } from '@/components/Tracking/LocationMarker';
import { useTracking } from '@/hooks/useTracking';
import { useBooking } from '@/hooks/useBooking';
import { useShipment } from '@/hooks/useShipment';
import { formatDateTime, formatDate, truncateId, formatCurrency, calcBookingCost } from '@/utils/formatters';

export function DeliveryPage() {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  const { trip, isLoading: tripLoading } = useTracking(bookingId);
  const { data: booking, isLoading: bookingLoading } = useBooking(bookingId);
  const { data: shipment, isLoading: shipmentLoading } = useShipment(booking?.shipmentId);

  const isLoading = tripLoading || bookingLoading || shipmentLoading;

  if (isLoading) return <Layout><LoadingSpinner fullPage /></Layout>;

  const isDelivered = trip?.status === 'COMPLETED';
  const estimatedCost = booking ? calcBookingCost(
    { pricePerKg: 0, pricePerLength: 0 }, // placeholder — real price would come from truck
    { weight: booking.allocatedWeight, length: booking.allocatedLength }
  ) : 0;

  return (
    <Layout>
      <div className="max-w-xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <button
            onClick={() => navigate(-1)}
            className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1 mb-3"
          >
            ← Back
          </button>
          <h1 className="text-xl font-bold text-gray-900">Delivery Summary</h1>
          <p className="text-xs text-gray-400 font-mono mt-1">Booking #{truncateId(bookingId)}</p>
        </div>

        {/* Delivery status hero */}
        <div
          className={`card p-8 text-center space-y-3 ${
            isDelivered ? 'bg-emerald-50 border-emerald-200' : 'bg-gray-50'
          }`}
        >
          <span className="text-5xl">{isDelivered ? '✅' : '🚛'}</span>
          <h2 className="text-lg font-bold text-gray-900">
            {isDelivered ? 'Delivery Completed!' : 'Delivery In Progress'}
          </h2>
          {trip && <StatusBadge status={trip.status} />}
          {isDelivered && trip?.endTime && (
            <p className="text-sm text-gray-500">Completed on {formatDateTime(trip.endTime)}</p>
          )}
        </div>

        {/* Shipment details */}
        {shipment && (
          <div className="card p-5 space-y-4">
            <h2 className="text-sm font-semibold text-gray-700">Shipment Details</h2>

            {/* Route */}
            <div className="flex items-center gap-3 text-sm font-medium text-gray-900 bg-gray-50 rounded-lg px-4 py-3">
              <span>{shipment.fromLocation}</span>
              <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
              <span>{shipment.toLocation}</span>
            </div>

            {/* Capacity delivered */}
            <div className="grid grid-cols-3 gap-3 text-center">
              {[
                { label: 'Weight', val: booking?.allocatedWeight, unit: 'kg' },
                { label: 'Volume', val: booking?.allocatedVolume, unit: 'm³' },
                { label: 'Length', val: booking?.allocatedLength, unit: 'm' },
              ].map(({ label, val, unit }) => (
                <div key={label} className="bg-gray-50 rounded-xl py-3">
                  <p className="text-xs text-gray-400">{label}</p>
                  <p className="font-bold text-gray-800 text-sm">
                    {val?.toLocaleString()}{' '}
                    <span className="font-normal text-xs text-gray-400">{unit}</span>
                  </p>
                </div>
              ))}
            </div>

            {/* Shipment status */}
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400">Shipment Status</span>
              <StatusBadge status={shipment.status} />
            </div>
          </div>
        )}

        {/* Trip timeline */}
        {trip && (
          <div className="card p-5 space-y-3">
            <h2 className="text-sm font-semibold text-gray-700">Trip Timeline</h2>
            <div className="space-y-2 text-sm">
              {[
                { label: 'Trip ID', val: trip.id, mono: true },
                { label: 'Started', val: formatDateTime(trip.startedAt ?? trip.startTime) },
                { label: 'Completed', val: trip.endTime ? formatDateTime(trip.endTime) : '—' },
                { label: 'Est. Duration', val: trip.estimatedDuration ? `${trip.estimatedDuration}h` : '—' },
              ].map(({ label, val, mono }) => (
                <div key={label} className="flex justify-between">
                  <span className="text-gray-400">{label}</span>
                  <span className={`font-medium text-gray-700 ${mono ? 'font-mono text-xs truncate max-w-[180px]' : ''}`}>
                    {val}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Payment status */}
        {booking && (
          <div className="card p-5 space-y-3">
            <h2 className="text-sm font-semibold text-gray-700">Payment</h2>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Status</span>
              {booking.paymentConfirmed ? (
                <span className="text-sm font-semibold text-emerald-600">✓ Confirmed</span>
              ) : (
                <span className="text-sm font-semibold text-amber-600">⏳ Pending</span>
              )}
            </div>
            {booking.paymentReference && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Reference</span>
                <span className="font-mono text-gray-700">{booking.paymentReference}</span>
              </div>
            )}
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Booking Date</span>
              <span className="text-gray-700">{formatDate(booking.createdAt)}</span>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pb-6">
          <button
            onClick={() => navigate(`/tracking/${bookingId}`)}
            className="btn-secondary flex-1"
          >
            📍 View Map
          </button>
          <button
            onClick={() => navigate('/shipments')}
            className="btn-primary flex-1"
          >
            My Shipments
          </button>
        </div>
      </div>
    </Layout>
  );
}
