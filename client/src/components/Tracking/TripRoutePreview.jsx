import { useTripByBooking } from '@/hooks/useTripByBooking';
import { useShipment } from '@/hooks/useShipment';
import { estimateDeliveryDisplay } from '@/utils/tripEta';

/**
 * ETA-only snippet for booking cards (route lives on the Leaflet map, not on the card).
 */
export function TripRoutePreview({ bookingId, shipmentId, paymentConfirmed }) {
  const { data: shipment, isLoading: shipLoading } = useShipment(shipmentId);
  const { data: trip } = useTripByBooking(bookingId, !!paymentConfirmed);
  const eta = estimateDeliveryDisplay(trip);

  if (!shipmentId) return null;

  if (shipLoading) {
    return <div className="text-[11px] text-gray-400 py-1">Loading trip info…</div>;
  }

  if (!shipment || !paymentConfirmed) return null;

  if (!eta) return null;

  return (
    <div className="space-y-1 pt-0.5">
      {eta.kind === 'eta' && (
        <p className="text-[11px] text-gray-600 leading-snug">
          Est. delivery by <span className="font-semibold text-teal-800">{eta.text}</span>
          <span className="text-gray-400"> · {eta.subtext}</span>
        </p>
      )}
      {eta.kind === 'pending' && <p className="text-[11px] text-gray-500">{eta.subtext}</p>}
      {eta.kind === 'done' && <p className="text-[11px] font-medium text-emerald-700">{eta.text}</p>}
    </div>
  );
}
