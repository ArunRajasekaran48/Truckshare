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
    <div className="card p-6 flex flex-col gap-4 transition-all duration-200 hover:shadow-2xl bg-gradient-to-br from-white via-orange-50 to-yellow-50 border-2 border-orange-200">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs text-orange-600 font-mono uppercase tracking-widest font-bold">🎫 Booking #{truncateId(booking.id)}</p>
          <p className="text-xs text-orange-600 mt-2 font-semibold">📦 Shipment #{truncateId(booking.shipmentId)}</p>
        </div>
        <StatusBadge status={booking.status ?? (booking.paymentConfirmed ? 'BOOKED' : 'PENDING')} />
      </div>

      {/* Capacity */}
      <div className="grid grid-cols-3 gap-3 text-center">
        {[
          { label: 'Weight', val: booking.allocatedWeight, unit: 'kg', icon: '⚖️' },
          { label: 'Volume', val: booking.allocatedVolume, unit: 'm³', icon: '📦' },
          { label: 'Length', val: booking.allocatedLength, unit: 'm', icon: '📏' },
        ].map(({ label, val, unit, icon }) => (
          <div key={label} className="bg-gradient-to-br from-orange-100 to-yellow-100 rounded-lg py-3 border-2 border-orange-300">
            <p className="text-lg mb-1">{icon}</p>
            <p className="text-xs text-orange-600 font-bold uppercase">{label}</p>
            <p className="text-base font-black text-orange-900 mt-1">
              {val?.toLocaleString()} <span className="text-xs font-bold text-orange-600">{unit}</span>
            </p>
          </div>
        ))}
      </div>

      {/* Payment status */}
      <div className="flex items-center justify-between text-xs text-slate-700 border-t-2 border-orange-200 pt-3">
        <span className="font-bold">📅 {formatDate(booking.createdAt)}</span>
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
