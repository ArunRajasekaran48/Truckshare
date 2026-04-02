import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Common/Layout';
import { StatCard } from '@/components/Dashboard/StatCard';
import { ShipmentCard } from '@/components/Shipment/ShipmentCard';
import { BookingCard } from '@/components/Booking/BookingCard';
import { LoadingSpinner } from '@/components/Common/LoadingSpinner';
import { EmptyState } from '@/components/Common/EmptyState';
import { useShipments } from '@/hooks/useShipment';
import { useBookings, useCancelBooking } from '@/hooks/useBooking';
import { UIContext } from '@/context/UIContext';

export function BusinessDashboard() {
  const navigate = useNavigate();
  const { toast } = useContext(UIContext);

  const { data: shipments = [], isLoading: shipmentsLoading } = useShipments();
  const { data: bookings = [], isLoading: bookingsLoading } = useBookings();
  const { mutate: cancelBooking } = useCancelBooking();

  const activeShipments = shipments.filter((s) =>
    ['PENDING', 'MATCHED', 'PARTIALLY_BOOKED', 'BOOKED', 'IN_TRANSIT'].includes(s.status)
  );
  const confirmedBookings = bookings.filter((b) => b.paymentConfirmed);

  const handleCancel = (id) => {
    if (!confirm('Cancel this booking?')) return;
    cancelBooking(id, {
      onSuccess: () => toast.success('Booking cancelled'),
      onError: (e) => toast.error(e.message),
    });
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Business Dashboard</h1>
            <p className="text-sm text-gray-500 mt-0.5">Track your shipments and bookings</p>
          </div>
          <button onClick={() => navigate('/shipments/create')} className="btn-primary">
            + New Shipment
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total Shipments" value={shipments.length} icon="📦" color="blue" />
          <StatCard label="Active Shipments" value={activeShipments.length} icon="🚛" color="teal" />
          <StatCard label="Total Bookings" value={bookings.length} icon="📋" color="amber" />
          <StatCard label="Confirmed" value={confirmedBookings.length} icon="✅" color="green" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Shipments */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-gray-900">My Shipments</h2>
              <button onClick={() => navigate('/shipments')} className="text-sm text-teal-600 hover:underline">
                View all →
              </button>
            </div>

            {shipmentsLoading ? (
              <LoadingSpinner text="Loading shipments…" />
            ) : shipments.length === 0 ? (
              <EmptyState
                icon="📦"
                title="No shipments yet"
                description="Create your first shipment to get started"
                action="Create Shipment"
                onAction={() => navigate('/shipments/create')}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {shipments.slice(0, 6).map((s) => (
                  <ShipmentCard
                    key={s.id}
                    shipment={s}
                    onClick={() => navigate(`/shipments/${s.id}`)}
                    actions={
                      s.status === 'MATCHED'
                        ? [{ label: '🔍 Find Trucks', onClick: () => navigate(`/shipments/${s.id}/match`) }]
                        : []
                    }
                  />
                ))}
              </div>
            )}
          </div>

          {/* Bookings */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-gray-900">Bookings</h2>
              <button onClick={() => navigate('/bookings')} className="text-sm text-teal-600 hover:underline">
                View all →
              </button>
            </div>

            {bookingsLoading ? (
              <LoadingSpinner />
            ) : bookings.length === 0 ? (
              <EmptyState icon="📋" title="No bookings" description="Your bookings will appear here" />
            ) : (
              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                {bookings.slice(0, 5).map((b) => (
                  <BookingCard
                    key={b.id}
                    booking={b}
                    isTruckOwner={false}
                    onCancel={handleCancel}
                    onTrack={(id) => navigate(`/tracking/${id}`)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
