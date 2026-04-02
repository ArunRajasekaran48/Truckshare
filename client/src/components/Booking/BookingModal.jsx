import { useMemo } from 'react';
import { Modal } from '@/components/Common/Modal';
import { PointPicker } from '@/components/Booking/PointPicker';
import { formatCurrency, calcBookingCost, truncateId } from '@/utils/formatters';

/**
 * BookingModal
 * Shows a summary of selected trucks + allocated capacity + estimated cost.
 * Used as the final confirmation step before calling POST /bookings.
 *
 * @prop {boolean}  isOpen
 * @prop {Function} onClose
 * @prop {Object}   shipment    - shipment being booked
 * @prop {Array}    trucks      - selected truck objects
 * @prop {Object}   allocation  - { [truckId]: { weight, volume, length } }
 * @prop {Function} onConfirm   - called when user confirms
 * @prop {boolean}  isLoading
 * @prop {Record<string, { boardingPointId?: string, droppingPointId?: string }>} pointSelections
 * @prop {Function} setPointSelections
 */
export function BookingModal({
  isOpen,
  onClose,
  shipment,
  trucks = [],
  allocation = {},
  onConfirm,
  isLoading,
  pointSelections = {},
  setPointSelections,
}) {
  const totalCost = useMemo(() => {
    return trucks.reduce((sum, t) => sum + calcBookingCost(t, allocation[t.id]), 0);
  }, [trucks, allocation]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Confirm Booking" size="lg">
      <div className="space-y-5">
        {/* Shipment summary */}
        {shipment && (
          <div className="bg-gray-50 rounded-xl p-4 text-sm space-y-1">
            <p className="font-semibold text-gray-800">
              {shipment.fromLocation} → {shipment.toLocation}
            </p>
            <p className="text-gray-400 font-mono text-xs">#{truncateId(shipment.id)}</p>
            {shipment.isSplit && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-purple-100 text-purple-700">
                Split shipment
              </span>
            )}
          </div>
        )}

        {/* Per-truck breakdown */}
        <div className="space-y-3">
          <p className="text-sm font-semibold text-gray-700">Selected Trucks</p>
          {trucks.map((truck) => {
            const alloc = allocation[truck.id] || {};
            const cost = calcBookingCost(truck, alloc);
            return (
              <div key={truck.id} className="card p-4 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{truck.model}</p>
                    <p className="text-xs text-gray-400 font-mono">{truck.licensePlate}</p>
                    <p className="text-xs text-gray-400">{truck.fromLocation} → {truck.toLocation}</p>
                  </div>
                  <p className="font-bold text-teal-700">{formatCurrency(cost)}</p>
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs text-center">
                  {[
                    { label: 'Weight', val: alloc.weight, unit: 'kg' },
                    { label: 'Volume', val: alloc.volume, unit: 'm³' },
                    { label: 'Length', val: alloc.length, unit: 'm' },
                  ].map(({ label, val, unit }) => (
                    <div key={label} className="bg-gray-50 rounded-lg py-1.5">
                      <p className="text-gray-400">{label}</p>
                      <p className="font-semibold text-gray-800">{(val || 0).toLocaleString()} {unit}</p>
                    </div>
                  ))}
                </div>

                {setPointSelections && (
                  <PointPicker
                    truck={truck}
                    value={pointSelections[truck.id] || {}}
                    onChange={(next) =>
                      setPointSelections((prev) => ({
                        ...prev,
                        [truck.id]: { ...prev[truck.id], ...next },
                      }))
                    }
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Total */}
        <div className="flex justify-between items-center px-4 py-3 bg-teal-50 rounded-xl border border-teal-200">
          <span className="font-semibold text-gray-900">Estimated Total</span>
          <span className="text-xl font-bold text-teal-700">{formatCurrency(totalCost)}</span>
        </div>

        <p className="text-xs text-gray-400 text-center">
          Bookings are pending until the truck owner acknowledges payment.
        </p>

        {/* Actions */}
        <div className="flex gap-3">
          <button onClick={onConfirm} disabled={isLoading} className="btn-primary flex-1 py-2.5">
            {isLoading
              ? 'Creating…'
              : `✓ Confirm ${trucks.length > 1 ? `${trucks.length} Bookings` : 'Booking'}`}
          </button>
          <button onClick={onClose} className="btn-secondary">Cancel</button>
        </div>
      </div>
    </Modal>
  );
}
