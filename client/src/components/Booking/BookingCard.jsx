import { StatusBadge } from '@/components/Common/StatusBadge';
import { truncateId, formatDate } from '@/utils/formatters';
import { useTruck } from '@/hooks/useTruck';
import { pointLabelForId } from '@/utils/truckPoints';

export function BookingCard({
  booking,
  onAcknowledge,
  onCancel,
  onTrack,
  isTruckOwner,
  /** e.g. drivers: "Trip & live map" — shippers: "Track" */
  trackLabel = '📍 Track',
  /** Optional route strip (driver dashboard / list) */
  routePreview,
}) {
  const needsPointLabels = !!(booking.boardingPointId || booking.droppingPointId);
  const { data: truckForPoints } = useTruck(booking.truckId, {
    enabled: !!booking.truckId && needsPointLabels,
  });
  const boardingLabel = pointLabelForId(truckForPoints, booking.boardingPointId);
  const droppingLabel = pointLabelForId(truckForPoints, booking.droppingPointId);

  // Determine if any action buttons will render
  const hasActions =
    (isTruckOwner && !booking.paymentConfirmed && !!onAcknowledge) ||
    (!isTruckOwner && !booking.paymentConfirmed && !!onCancel) ||
    (!!onTrack && booking.paymentConfirmed);

  return (
    <div className="card p-4 flex flex-col gap-3 transition-shadow hover:shadow-md">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-xs text-gray-400 font-mono">Booking #{truncateId(booking.id)}</p>
          <p className="text-xs text-gray-500 mt-0.5">Shipment #{truncateId(booking.shipmentId)}</p>
        </div>
        <StatusBadge status={booking.status ?? (booking.paymentConfirmed ? 'BOOKED' : 'PENDING')} />
      </div>

      {/* Capacity */}
      <div className="grid grid-cols-3 gap-2 text-center">
        {[
          { label: 'Weight', val: booking.allocatedWeight, unit: 'kg' },
          { label: 'Volume', val: booking.allocatedVolume, unit: 'm³' },
          { label: 'Length', val: booking.allocatedLength, unit: 'm' },
        ].map(({ label, val, unit }) => (
          <div key={label} className="bg-gray-50 rounded-lg py-2">
            <p className="text-xs text-gray-400">{label}</p>
            <p className="text-sm font-semibold text-gray-800">
              {val?.toLocaleString()} <span className="text-xs font-normal text-gray-500">{unit}</span>
            </p>
          </div>
        ))}
      </div>

      {/* Payment status */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>{formatDate(booking.createdAt)}</span>
        {booking.paymentConfirmed ? (
          <span className="text-emerald-600 font-medium">✓ Payment confirmed</span>
        ) : (
          <span className="text-amber-600 font-medium">⏳ Awaiting payment</span>
        )}
      </div>

      {booking.paymentReference && (
        <p className="text-xs text-gray-400">Ref: {booking.paymentReference}</p>
      )}

      {routePreview && <div className="pt-1">{routePreview}</div>}

      {(booking.boardingPointId || booking.droppingPointId) && (
        <div className="text-xs text-gray-500 space-y-0.5 pt-1">
          {booking.boardingPointId && (
            <p>
              <span className="text-gray-400">Boarding:</span>{' '}
              <span className="text-gray-800">
                {boardingLabel ?? (truckForPoints ? truncateId(booking.boardingPointId) : '…')}
              </span>
            </p>
          )}
          {booking.droppingPointId && (
            <p>
              <span className="text-gray-400">Dropping:</span>{' '}
              <span className="text-gray-800">
                {droppingLabel ?? (truckForPoints ? truncateId(booking.droppingPointId) : '…')}
              </span>
            </p>
          )}
        </div>
      )}

      {/* Actions */}
      {hasActions && (
        <div className="flex gap-2 pt-1 mt-auto border-t border-gray-100 flex-wrap">
          {isTruckOwner && !booking.paymentConfirmed && onAcknowledge && (
            <button onClick={() => onAcknowledge(booking)} className="btn-primary text-xs py-1.5 px-3 flex-1">
              ✓ Acknowledge Payment
            </button>
          )}
          {!isTruckOwner && !booking.paymentConfirmed && onCancel && (
            <button onClick={() => onCancel(booking.id)} className="btn-danger text-xs py-1.5 px-3">
              Cancel
            </button>
          )}
          {onTrack && booking.paymentConfirmed && (
            <button onClick={() => onTrack(booking.id)} className="btn-secondary text-xs py-1.5 px-3 ml-auto">
              {trackLabel}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
