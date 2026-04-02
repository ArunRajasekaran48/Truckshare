import { useContext, useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Layout } from '@/components/Common/Layout';
import { BookingModal } from '@/components/Booking/BookingModal';
import { TruckSelector } from '@/components/Booking/TruckSelector';
import { CapacityAllocator } from '@/components/Booking/CapacityAllocator';
import { LoadingSpinner } from '@/components/Common/LoadingSpinner';
import { useShipment } from '@/hooks/useShipment';
import { useMatching } from '@/hooks/useMatching';
import { useCreateBooking } from '@/hooks/useBooking';
import { UIContext } from '@/context/UIContext';
import { validateTruckPointSelections } from '@/utils/truckPoints';

/**
 * BookingPage
 * Dedicated page for creating bookings — alternative entry point to MatchingPage.
 * Reads shipmentId from URL params; trucks come from the matching service.
 */
export function BookingPage() {
  const { shipmentId } = useParams();
  const navigate = useNavigate();
  const { toast } = useContext(UIContext);

  const { data: shipment, isLoading: shipmentLoading } = useShipment(shipmentId);
  const { data: matches = [], isLoading: matchesLoading } = useMatching(shipmentId);
  const { mutate: createBooking, isPending } = useCreateBooking();

  const [selectedIds, setSelectedIds] = useState([]);
  const [allocation, setAllocation] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [pointSelections, setPointSelections] = useState({});

  const selectedTrucks = useMemo(
    () => matches.filter((t) => selectedIds.includes(t.id)),
    [matches, selectedIds]
  );

  const isSplit = shipment?.isSplit;

  // For non-split: auto-populate allocation from required capacity
  const effectiveAllocation = useMemo(() => {
    if (!isSplit && selectedTrucks.length === 1 && shipment) {
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

  const handleConfirm = () => {
    const err = validateTruckPointSelections(selectedTrucks, pointSelections);
    if (err) {
      toast.error(err);
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

    let done = 0;
    bookings.forEach((b) => {
      createBooking(b, {
        onSuccess: () => {
          done++;
          if (done === bookings.length) {
            toast.success('Booking(s) created successfully!');
            navigate('/bookings');
          }
        },
        onError: (err) => {
          toast.error(err.message || 'Booking failed');
          setModalOpen(false);
        },
      });
    });
  };

  if (shipmentLoading || matchesLoading) return <Layout><LoadingSpinner fullPage /></Layout>;

  return (
    <Layout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <button onClick={() => navigate(-1)} className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1 mb-3">
            ← Back
          </button>
          <h1 className="text-xl font-bold text-gray-900">Book Truck</h1>
          {shipment && (
            <p className="text-sm text-gray-500 mt-1">
              {shipment.fromLocation} → {shipment.toLocation} · {shipment.requiredWeight?.toLocaleString()} kg
            </p>
          )}
        </div>

        {/* Truck selection */}
        <div className="space-y-3">
          <h2 className="font-semibold text-gray-900">Select Truck{isSplit ? 's' : ''}</h2>
          <TruckSelector
            trucks={matches}
            selectedIds={selectedIds}
            onToggle={setSelectedIds}
            splittable={isSplit}
          />
        </div>

        {/* Capacity allocation (split only) */}
        {isSplit && selectedTrucks.length > 0 && (
          <div className="space-y-3">
            <h2 className="font-semibold text-gray-900">Allocate Capacity</h2>
            <CapacityAllocator
              trucks={selectedTrucks}
              required={{
                weight: shipment.requiredWeight,
                volume: shipment.requiredVolume,
                length: shipment.requiredLength,
              }}
              onChange={setAllocation}
            />
          </div>
        )}

        {/* Sticky footer CTA */}
        {selectedIds.length > 0 && (
          <div className="sticky bottom-4 bg-white border border-gray-200 rounded-xl p-4 shadow-lg flex items-center justify-between gap-4">
            <p className="text-sm text-gray-600">
              {selectedIds.length} truck{selectedIds.length > 1 ? 's' : ''} selected
            </p>
            <button onClick={() => setModalOpen(true)} className="btn-primary">
              Review & Confirm →
            </button>
          </div>
        )}
      </div>

      <BookingModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        shipment={shipment}
        trucks={selectedTrucks}
        allocation={effectiveAllocation}
        onConfirm={handleConfirm}
        isLoading={isPending}
        pointSelections={pointSelections}
        setPointSelections={setPointSelections}
      />
    </Layout>
  );
}
