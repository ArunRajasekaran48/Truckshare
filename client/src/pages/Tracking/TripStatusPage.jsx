import { useContext, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Layout } from '@/components/Common/Layout';
import { StatusBadge } from '@/components/Common/StatusBadge';
import { LoadingSpinner } from '@/components/Common/LoadingSpinner';
import { useTracking } from '@/hooks/useTracking';
import { DriverLocationSharePanel } from '@/components/Tracking/DriverLocationSharePanel';
import { useAuth } from '@/hooks/useAuth';
import { UIContext } from '@/context/UIContext';
import { trackingService } from '@/services/trackingService';
import { formatDateTime, truncateId } from '@/utils/formatters';

const TRIP_FLOW = [
  {
    status: 'PLANNED',
    label: 'Planned',
    icon: '📋',
    description: 'Trip is scheduled and ready.',
    nextStatus: 'LOADING',
    nextLabel: 'Start Loading',
  },
  {
    status: 'LOADING',
    label: 'Loading',
    icon: '📦',
    description: 'Cargo is being loaded onto the truck.',
    nextStatus: 'IN_TRANSIT',
    nextLabel: 'Start Trip',
  },
  {
    status: 'IN_TRANSIT',
    label: 'In Transit',
    icon: '🚛',
    description: 'Truck is en route. GPS tracking active.',
    nextStatus: 'COMPLETED',
    nextLabel: 'Mark Delivered',
  },
  {
    status: 'COMPLETED',
    label: 'Completed',
    icon: '🏁',
    description: 'Trip completed successfully.',
    nextStatus: null,
    nextLabel: null,
  },
];

export function TripStatusPage() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const { toast } = useContext(UIContext);
  const { isTruckOwner, isDriver } = useAuth();
  // Drivers should NOT be able to change trip status.
  // GPS pulses start only when the backend sets the trip to IN_TRANSIT.
  const canAdvanceTrip = isTruckOwner;
  const { trip, isLoading, refetch, refetchLocation } = useTracking(bookingId);
  const [updating, setUpdating] = useState(false);

  const currentStep = TRIP_FLOW.find((s) => s.status === trip?.status) || TRIP_FLOW[0];
  const currentStepIndex = TRIP_FLOW.findIndex((s) => s.status === trip?.status);

  const handleAdvanceStatus = async () => {
    if (!trip?.id || !currentStep.nextStatus) return;
    setUpdating(true);
    try {
      await trackingService.updateStatusByBooking(bookingId, currentStep.nextStatus);
      toast.success(`Trip status updated to ${currentStep.nextStatus.replace('_', ' ')}`);
      refetch();
    } catch (err) {
      toast.error(err.message || 'Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  if (isLoading) return <Layout><LoadingSpinner fullPage /></Layout>;

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
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-gray-900">Trip Status</h1>
            {trip && <StatusBadge status={trip.status} />}
          </div>
          {trip && (
            <p className="text-xs text-gray-400 font-mono mt-1">
              Trip #{truncateId(trip.id)} · Booking #{truncateId(bookingId)}
            </p>
          )}
        </div>

        {trip && (
          <DriverLocationSharePanel
            tripId={trip.id}
            tripStatus={trip.status}
            isDriver={isDriver}
            onPulseSent={refetchLocation}
          />
        )}

        {/* Timeline */}
        {trip ? (
          <div className="card p-6">
            <h2 className="text-sm font-semibold text-gray-700 mb-5">Status Timeline</h2>
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-100" />

              <div className="space-y-6">
                {TRIP_FLOW.map((step, i) => {
                  const done = i < currentStepIndex;
                  const active = i === currentStepIndex;
                  const future = i > currentStepIndex;

                  return (
                    <div key={step.status} className="relative flex items-start gap-4 pl-12">
                      {/* Node */}
                      <div
                        className={`absolute left-0 w-10 h-10 rounded-full flex items-center justify-center text-lg border-2 ${
                          done
                            ? 'bg-teal-600 border-teal-600 text-white'
                            : active
                            ? 'bg-teal-50 border-teal-600 text-teal-700'
                            : 'bg-white border-gray-200 text-gray-300'
                        }`}
                      >
                        {done ? '✓' : step.icon}
                      </div>

                      {/* Content */}
                      <div className={`flex-1 pb-2 ${future ? 'opacity-40' : ''}`}>
                        <p
                          className={`font-semibold text-sm ${
                            active ? 'text-teal-700' : done ? 'text-gray-500' : 'text-gray-400'
                          }`}
                        >
                          {step.label}
                          {active && (
                            <span className="ml-2 text-xs font-normal bg-teal-100 text-teal-600 px-2 py-0.5 rounded-full">
                              Current
                            </span>
                          )}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">{step.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="card p-8 text-center text-gray-400">
            <p className="text-4xl mb-3">🗂️</p>
            <p className="font-medium text-gray-600">No trip found for this booking</p>
            <p className="text-sm mt-1">The trip may not have been created yet.</p>
          </div>
        )}

        {/* Trip meta */}
        {trip && (
          <div className="card p-5 space-y-2">
            <h2 className="text-sm font-semibold text-gray-700 mb-3">Trip Details</h2>
            {[
              { label: 'Trip ID', val: trip.id, mono: true },
              { label: 'Booking ID', val: trip.bookingId, mono: true },
              { label: 'Shipment ID', val: trip.shipmentId, mono: true },
              { label: 'Started', val: formatDateTime(trip.startedAt ?? trip.startTime) },
              { label: 'Est. Duration', val: trip.estimatedDuration ? `${trip.estimatedDuration}h` : '—' },
            ].map(({ label, val, mono }) => (
              <div key={label} className="flex justify-between items-center text-sm">
                <span className="text-gray-400">{label}</span>
                <span className={`text-gray-700 font-medium truncate max-w-[200px] ${mono ? 'font-mono text-xs' : ''}`}>
                  {val || '—'}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Advance trip — truck owner or assigned driver */}
        {trip && canAdvanceTrip && currentStep.nextStatus && (
          <div className="card p-5 space-y-3">
            <h2 className="text-sm font-semibold text-gray-700">Trip actions</h2>
            <p className="text-sm text-gray-500">
              Next step: advance trip to{' '}
              <span className="font-semibold text-gray-800">
                {currentStep.nextStatus.replace('_', ' ')}
              </span>
            </p>
            <button
              onClick={handleAdvanceStatus}
              disabled={updating}
              className="btn-primary w-full py-2.5"
            >
              {updating ? 'Updating…' : `${currentStep.nextLabel} →`}
            </button>

            {trip.status === 'IN_TRANSIT' && (
              <button
                onClick={() => navigate(`/tracking/${bookingId}`)}
                className="btn-secondary w-full"
              >
                📍 Open Live Map
              </button>
            )}
          </div>
        )}

        <div className="flex gap-3">
          <button onClick={refetch} className="btn-secondary flex-1">
            ↻ Refresh
          </button>
          <button onClick={() => navigate('/bookings')} className="btn-secondary flex-1">
            ← Bookings
          </button>
        </div>
      </div>
    </Layout>
  );
}
