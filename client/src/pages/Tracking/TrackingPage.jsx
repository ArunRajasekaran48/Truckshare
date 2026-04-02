import { useContext, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Layout } from '@/components/Common/Layout';
import { Map } from '@/components/Tracking/Map';
import { TrackingInfo } from '@/components/Tracking/TrackingInfo';
import { DriverLocationSharePanel } from '@/components/Tracking/DriverLocationSharePanel';
import { LoadingSpinner } from '@/components/Common/LoadingSpinner';
import { EmptyState } from '@/components/Common/EmptyState';
import { useTracking } from '@/hooks/useTracking';
import { useAuth } from '@/hooks/useAuth';
import { shipmentService } from '@/services/shipmentService';
import { useDestinationGeocode } from '@/hooks/useDestinationGeocode';
import { trackingService } from '@/services/trackingService';
import { UIContext } from '@/context/UIContext';

// Default center: India
const INDIA_CENTER = [20.5937, 78.9629];

export function TrackingPage() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const { isDriver } = useAuth();
  const { toast } = useContext(UIContext);
  const { trip, location, isLoading, error, coordinates, refetch, refetchLocation } = useTracking(bookingId);
  const [nextStatus, setNextStatus] = useState('');

  const statusOptions = useMemo(
    () => ['PLANNED', 'LOADING', 'IN_TRANSIT', 'COMPLETED', 'CANCELLED'],
    []
  );

  const updateStatus = useMutation({
    mutationFn: (status) => trackingService.updateStatusByBooking(bookingId, status),
    onSuccess: (_, status) => {
      toast.success(`Trip status updated to ${status.replace('_', ' ')}`);
      refetch();
    },
    onError: (e) => toast.error(e.message || 'Failed to update status'),
  });

  const { data: shipment } = useQuery({
    queryKey: ['shipments', trip?.shipmentId],
    queryFn: () => shipmentService.getById(trip.shipmentId),
    enabled: !!trip?.shipmentId,
  });

  const { data: destGeo, isLoading: routeGeoLoading } = useDestinationGeocode(shipment?.toLocation);

  const routePolyline = useMemo(() => {
    if (!coordinates || !destGeo?.to) return null;
    return [coordinates, destGeo.to];
  }, [coordinates, destGeo?.to]);

  const mapMarkers = useMemo(() => {
    const list = [];
    if (destGeo?.to) {
      list.push({
        id: 'route-end',
        position: destGeo.to,
        type: 'dropoff',
        label: `Destination: ${shipment?.toLocation}`,
      });
    }
    if (coordinates) {
      list.push({ id: 'truck', position: coordinates, label: 'Truck (live GPS)', type: 'truck' });
    }
    return list;
  }, [destGeo, coordinates, shipment?.toLocation]);

  if (isLoading) return <Layout><LoadingSpinner fullPage /></Layout>;

  if (error || !trip) {
    return (
      <Layout>
        <EmptyState
          icon="🗺️"
          title="Trip not found"
          description={error || 'No trip data available for this booking'}
          action="Go to Bookings"
          onAction={() => navigate('/bookings')}
        />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="text-sm text-gray-500 hover:text-gray-700">
            ← Back
          </button>
          <h1 className="text-xl font-bold text-gray-900">Live Tracking</h1>
          {trip.status === 'IN_TRANSIT' && (
            <span className="flex items-center gap-1.5 text-xs text-teal-700 bg-teal-50 border border-teal-200 rounded-full px-2.5 py-1 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
              Live
            </span>
          )}
        </div>

        <DriverLocationSharePanel
          tripId={trip?.id}
          tripStatus={trip?.status}
          isDriver={isDriver}
          onPulseSent={refetchLocation}
        />

        {/* Driver: change trip status here (not on dashboard) */}
        {isDriver && trip?.status && (
          <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <p className="font-semibold text-slate-900 text-sm">Trip status</p>
                <p className="text-xs text-slate-500 mt-0.5">
                  Update the trip status to match what’s happening on the road.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <select
                  className="input-field text-sm max-w-[220px]"
                  value={nextStatus || trip.status}
                  onChange={(e) => setNextStatus(e.target.value)}
                >
                  {statusOptions.map((s) => (
                    <option key={s} value={s}>
                      {s.replace('_', ' ')}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  className="btn-primary"
                  disabled={updateStatus.isPending || (nextStatus || trip.status) === trip.status}
                  onClick={() => updateStatus.mutate(nextStatus || trip.status)}
                >
                  {updateStatus.isPending ? 'Updating…' : 'Update'}
                </button>
              </div>
            </div>
            <p className="text-[11px] text-slate-500 mt-2">
              Live GPS sharing becomes available when status is <strong>IN TRANSIT</strong>.
            </p>
          </div>
        )}

        {shipment?.toLocation && (
          <p className="text-sm text-gray-600">
            {isDriver ? (
              <>
                Map: <span className="font-medium text-gray-900">your shared GPS</span> →{' '}
                <span className="font-medium text-gray-900">{shipment.toLocation}</span>
              </>
            ) : (
              <>
                Map: <span className="font-medium text-gray-900">truck’s last reported position</span> →{' '}
                <span className="font-medium text-gray-900">{shipment.toLocation}</span>{' '}
                <span className="text-gray-500">(destination)</span>
              </>
            )}
            {routeGeoLoading && <span className="text-gray-400 text-xs ml-2">(loading destination…)</span>}
            {!routeGeoLoading && !coordinates && (
              <span className="text-amber-700 text-xs ml-2">Waiting for live GPS from the driver…</span>
            )}
          </p>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4" style={{ height: 'calc(100vh - 200px)', minHeight: 500 }}>
          {/* Map */}
          <div className="lg:col-span-2 h-64 lg:h-full relative">
            {routeGeoLoading && (
              <div className="absolute inset-0 z-[500] bg-white/70 flex items-center justify-center rounded-xl pointer-events-none">
                <span className="text-sm text-gray-600">Plotting route…</span>
              </div>
            )}
            <Map
              center={coordinates || destGeo?.to || INDIA_CENTER}
              zoom={coordinates ? 12 : destGeo?.to ? 8 : 5}
              markers={mapMarkers}
              polyline={routePolyline}
            />
          </div>

          {/* Info panel */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 overflow-y-auto">
            <TrackingInfo trip={trip} location={location} />

            <div className="mt-5 pt-4 border-t border-gray-100 space-y-2">
              <button onClick={refetch} className="btn-secondary w-full text-sm">
                ↻ Refresh Status
              </button>
              <button onClick={() => navigate('/bookings')} className="btn-secondary w-full text-sm">
                ← Back to Bookings
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
