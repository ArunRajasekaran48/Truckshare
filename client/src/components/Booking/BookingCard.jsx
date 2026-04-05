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
    <div className="card p-5 flex flex-col gap-4 transition-all duration-200 hover:shadow-lg">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs text-slate-500 font-mono uppercase tracking-wide">Booking #{truncateId(booking.id)}</p>
          <p className="text-xs text-slate-500 mt-1.5">Shipment #{truncateId(booking.shipmentId)}</p>
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
          <div key={label} className="bg-slate-50 rounded-lg py-3 border border-slate-200">
            <p className="text-xs text-slate-500 font-semibold">{label}</p>
            <p className="text-sm font-bold text-slate-900 mt-1">
              {val?.toLocaleString()} <span className="text-xs font-normal text-slate-500">{unit}</span>
            </p>
          </div>
        ))}
      </div>

      {/* Payment status */}
      <div className="flex items-center justify-between text-xs text-slate-600 border-t border-slate-200 pt-3">
        <span>{formatDate(booking.createdAt)}</span>
        {booking.paymentConfirmed ? (
          <span className="text-emerald-600 font-bold">✓ Payment confirmed</span>
        ) : (
          <span className="text-amber-600 font-bold">⏳ Awaiting payment</span>
        )}
      </div>

      {booking.paymentReference && (
        <p className="text-xs text-slate-500">Ref: {booking.paymentReference}</p>
      )}

      {routePreview && <div className="pt-1">{routePreview}</div>}

      {(booking.boardingPointId || booking.droppingPointId) && (
        <div className="text-xs text-slate-600 space-y-1.5 pt-2 bg-slate-50 rounded-lg p-3 border border-slate-200">
          {booking.boardingPointId && (
            <p>
              <span className="text-slate-500 font-medium">Boarding:</span>{' '}
              <span className="text-slate-900 font-semibold">
                {boardingLabel ?? (truckForPoints ? truncateId(booking.boardingPointId) : '…')}
              </span>
            </p>
          )}
          {booking.droppingPointId && (
            <p>
              <span className="text-slate-500 font-medium">Dropping:</span>{' '}
              <span className="text-slate-900 font-semibold">
                {droppingLabel ?? (truckForPoints ? truncateId(booking.droppingPointId) : '…')}
              </span>
            </p>
          )}
        </div>
      )}

      {/* Actions */}
      {hasActions && (
        <div className="flex gap-2 pt-2 mt-auto flex-wrap">
          {isTruckOwner && !booking.paymentConfirmed && onAcknowledge && (
            <button onClick={() => onAcknowledge(booking)} className="btn-primary text-xs py-2 px-3 flex-1">
              ✓ Acknowledge Payment
            </button>
          )}
          {!isTruckOwner && !booking.paymentConfirmed && onCancel && (
            <button onClick={() => onCancel(booking.id)} className="btn-danger text-xs py-2 px-3">
              Cancel
            </button>
          )}
          {onTrack && booking.paymentConfirmed && (
            <button onClick={() => onTrack(booking.id)} className="btn-secondary text-xs py-2 px-3 ml-auto">
              {trackLabel}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
