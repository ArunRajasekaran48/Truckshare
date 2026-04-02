import { useTracking } from '@/hooks/useTracking';
import { useAuth } from '@/hooks/useAuth';
import { Map } from './Map';
import { TrackingInfo } from './TrackingInfo';
import { DriverLocationSharePanel } from './DriverLocationSharePanel';
import { LoadingSpinner } from '@/components/Common/LoadingSpinner';

const INDIA_CENTER = [20.5937, 78.9629];

/**
 * LiveTracking
 * Self-contained real-time tracking widget.
 * Combines map + info panel; subscribes internally via useTracking hook.
 *
 * @prop {string} bookingId
 * @prop {Object} shipment  - optional, for context display
 */
export function LiveTracking({ bookingId, shipment }) {
  const { isDriver } = useAuth();
  const { trip, location, isLoading, coordinates, refetchLocation } = useTracking(bookingId);

  const mapMarkers = [];
  if (coordinates) {
    mapMarkers.push({ id: 'truck', position: coordinates, label: 'Truck Location', type: 'truck' });
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner text="Loading tracking data…" />
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400 text-sm">
        No trip data available yet.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <DriverLocationSharePanel
        tripId={trip?.id}
        tripStatus={trip?.status}
        isDriver={isDriver}
        onPulseSent={refetchLocation}
      />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4" style={{ minHeight: 400 }}>
        {/* Map */}
        <div className="lg:col-span-2 h-64 lg:h-auto">
          <Map
            center={coordinates || INDIA_CENTER}
            zoom={coordinates ? 13 : 5}
            markers={mapMarkers}
          />
        </div>

        {/* Info panel */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 overflow-y-auto">
          {trip.status === 'IN_TRANSIT' && (
            <div className="flex items-center gap-2 mb-4 text-sm text-teal-700 bg-teal-50 border border-teal-200 rounded-lg px-3 py-2">
              <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
              {isDriver
                ? 'You are sharing GPS when the toggle above is on.'
                : 'Map refreshes every 10s from the server.'}
            </div>
          )}
          <TrackingInfo trip={trip} location={location} />
        </div>
      </div>
    </div>
  );
}
