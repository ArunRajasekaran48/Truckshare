import { useState, useContext, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Layout } from '@/components/Common/Layout';
import { TruckSelector } from '@/components/Booking/TruckSelector';
import { CapacityAllocator } from '@/components/Booking/CapacityAllocator';
import { LoadingSpinner } from '@/components/Common/LoadingSpinner';
import { EmptyState } from '@/components/Common/EmptyState';
import { useShipment } from '@/hooks/useShipment';
import { useMatching } from '@/hooks/useMatching';
import { useCreateBooking } from '@/hooks/useBooking';
import { UIContext } from '@/context/UIContext';
import { formatCurrency, calcBookingCost } from '@/utils/formatters';
import { PointPicker } from '@/components/Booking/PointPicker';
import { validateTruckPointSelections } from '@/utils/truckPoints';

export function MatchingPage() {
  const { shipmentId } = useParams();
  const navigate = useNavigate();
  const { toast } = useContext(UIContext);

  const { data: shipment, isLoading: shipmentLoading } = useShipment(shipmentId);
  const { data: matches = [], isLoading: matchesLoading, refetch } = useMatching(shipmentId);
  const { mutate: createBooking, isPending: bookingPending } = useCreateBooking();

  const [selectedIds, setSelectedIds] = useState([]);
  const [allocation, setAllocation] = useState({});
  const [step, setStep] = useState('select'); // 'select' | 'allocate' | 'confirm'
  const [pointSelections, setPointSelections] = useState({});

  const selectedTrucks = useMemo(
    () => matches.filter((t) => selectedIds.includes(t.id)),
    [matches, selectedIds]
  );

  const isSplit = shipment?.isSplit;

  // For non-split: auto-fill allocation from first selected truck
  const effectiveAllocation = useMemo(() => {
    if (!isSplit && selectedTrucks.length === 1) {
      const t = selectedTrucks[0];
      return {
        [t.id]: {
          weight: shipment.requiredWeight,
          volume: shipment.requiredVolume,
          length: shipment.requiredLength,
        },
      };
    }
    return allocation;
  }, [isSplit, selectedTrucks, allocation, shipment]);

  const totalCost = useMemo(() => {
    return selectedTrucks.reduce((sum, t) => {
      const alloc = effectiveAllocation[t.id];
      return sum + calcBookingCost(t, alloc);
    }, 0);
  }, [selectedTrucks, effectiveAllocation]);

  const handleNext = () => {
    if (selectedIds.length === 0) { toast.warning('Select at least one truck'); return; }
    if (isSplit) setStep('allocate');
    else setStep('confirm');
  };

  const handleBook = () => {
    const err = validateTruckPointSelections(selectedTrucks, pointSelections);
    if (err) {
      toast.warning(err);
      return;
    }
    const bookings = selectedTrucks.map((t) => ({
      shipmentId,
      truckId: t.id,
      allocatedWeight: effectiveAllocation[t.id]?.weight || 0,
      allocatedVolume: effectiveAllocation[t.id]?.volume || 0,
      allocatedLength: effectiveAllocation[t.id]?.length || 0,
      boardingPointId: pointSelections[t.id]?.boardingPointId || null,
      droppingPointId: pointSelections[t.id]?.droppingPointId || null,
    }));

    let completed = 0;
    let failed = false;

    bookings.forEach((b) => {
      createBooking(b, {
        onSuccess: () => {
          completed++;
          if (completed === bookings.length && !failed) {
            toast.success(`${bookings.length} booking${bookings.length > 1 ? 's' : ''} created!`);
            navigate('/bookings');
          }
        },
        onError: (err) => {
          failed = true;
          toast.error(err.message || 'Booking failed');
        },
      });
    });
  };

  if (shipmentLoading) return <Layout><LoadingSpinner fullPage /></Layout>;

  return (
    <Layout>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <button onClick={() => navigate(-1)} className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1 mb-3">
            ← Back
          </button>
          <h1 className="text-xl font-bold text-gray-900">Find Trucks</h1>
          {shipment && (
            <p className="text-sm text-gray-500 mt-1">
              {shipment.fromLocation} → {shipment.toLocation} ·{' '}
              {shipment.requiredWeight?.toLocaleString()} kg ·{' '}
              {shipment.isSplit ? 'Splittable' : 'Single truck'}
            </p>
          )}
        </div>

        {/* Step: SELECT */}
        {step === 'select' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-gray-900">
                Matching Trucks
                {matches.length > 0 && (
                  <span className="ml-2 text-sm font-normal text-gray-400">({matches.length} found)</span>
                )}
              </h2>
              <button onClick={() => refetch()} className="text-sm text-teal-600 hover:underline">
                Refresh
              </button>
            </div>

            {matchesLoading ? (
              <LoadingSpinner text="Finding matching trucks…" />
            ) : matches.length === 0 ? (
              <EmptyState
                icon="🔍"
                title="No matches found"
                description="No trucks available for this shipment right now. Try again later."
                action="Refresh"
                onAction={() => refetch()}
              />
            ) : (
              <>
                <TruckSelector
                  trucks={matches}
                  selectedIds={selectedIds}
                  onToggle={setSelectedIds}
                  splittable={isSplit}
                />

                {selectedIds.length > 0 && (
                  <div className="sticky bottom-4 bg-white border border-gray-200 rounded-xl p-4 shadow-lg flex items-center justify-between gap-4">
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold text-gray-900">{selectedIds.length}</span> truck{selectedIds.length > 1 ? 's' : ''} selected
                    </p>
                    <button onClick={handleNext} className="btn-primary">
                      {isSplit ? 'Allocate Capacity →' : 'Review Booking →'}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Step: ALLOCATE (split only) */}
        {step === 'allocate' && (
          <div className="space-y-4">
            <h2 className="font-semibold text-gray-900">Allocate Capacity</h2>
            <p className="text-sm text-gray-500">
              Distribute your shipment capacity across the selected trucks.
            </p>

            <CapacityAllocator
              trucks={selectedTrucks}
              required={{
                weight: shipment.requiredWeight,
                volume: shipment.requiredVolume,
                length: shipment.requiredLength,
              }}
              onChange={setAllocation}
            />

            <div className="flex gap-3">
              <button onClick={() => setStep('confirm')} className="btn-primary flex-1">
                Review Booking →
              </button>
              <button onClick={() => setStep('select')} className="btn-secondary">
                ← Back
              </button>
            </div>
          </div>
        )}

        {/* Step: CONFIRM */}
        {step === 'confirm' && (
          <div className="space-y-4">
            <h2 className="font-semibold text-gray-900">Confirm Booking</h2>

            {/* Booking summary */}
            <div className="space-y-3">
              {selectedTrucks.map((t) => {
                const alloc = effectiveAllocation[t.id];
                const cost = calcBookingCost(t, alloc);
                return (
                  <div key={t.id} className="card p-4 space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-gray-900">{t.model}</p>
                        <p className="text-xs text-gray-400 font-mono">{t.licensePlate}</p>
                      </div>
                      <p className="font-bold text-teal-700">{formatCurrency(cost)}</p>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs text-center">
                      {[
                        { label: 'Weight', val: alloc?.weight, unit: 'kg' },
                        { label: 'Volume', val: alloc?.volume, unit: 'm³' },
                        { label: 'Length', val: alloc?.length, unit: 'm' },
                      ].map(({ label, val, unit }) => (
                        <div key={label} className="bg-gray-50 rounded-lg py-1.5">
                          <p className="text-gray-400">{label}</p>
                          <p className="font-semibold text-gray-800">{val?.toLocaleString()} {unit}</p>
                        </div>
                      ))}
                    </div>

                    <PointPicker
                      truck={t}
                      value={pointSelections[t.id] || {}}
                      onChange={(next) =>
                        setPointSelections((prev) => ({
                          ...prev,
                          [t.id]: { ...prev[t.id], ...next },
                        }))
                      }
                    />
                  </div>
                );
              })}
            </div>

            {/* Total */}
            <div className="flex justify-between items-center p-4 bg-teal-50 rounded-xl border border-teal-200">
              <span className="font-semibold text-gray-900">Estimated Total</span>
              <span className="text-xl font-bold text-teal-700">{formatCurrency(totalCost)}</span>
            </div>

            <p className="text-xs text-gray-400 text-center">
              Booking will be pending until the truck owner acknowledges payment.
            </p>

            <div className="flex gap-3">
              <button
                onClick={handleBook}
                disabled={bookingPending}
                className="btn-primary flex-1 py-2.5"
              >
                {bookingPending ? 'Creating bookings…' : `✓ Confirm ${selectedTrucks.length > 1 ? `${selectedTrucks.length} Bookings` : 'Booking'}`}
              </button>
              <button onClick={() => setStep(isSplit ? 'allocate' : 'select')} className="btn-secondary">
                ← Back
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
