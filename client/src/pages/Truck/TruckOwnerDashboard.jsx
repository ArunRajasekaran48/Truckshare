import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Common/Layout';
import { StatCard } from '@/components/Dashboard/StatCard';
import { TruckCard } from '@/components/Truck/TruckCard';
import { BookingCard } from '@/components/Booking/BookingCard';
import { PaymentModal } from '@/components/Booking/PaymentModal';
import { DriverAssignmentModal } from '@/components/Truck/DriverAssignmentModal';
import { LoadingSpinner } from '@/components/Common/LoadingSpinner';
import { EmptyState } from '@/components/Common/EmptyState';
import { useTrucksByOwner, useDeleteTruck, useAssignDriver, useUnassignDriver } from '@/hooks/useTruck';
import { useBookings, useAcknowledgePayment } from '@/hooks/useBooking';
import { UIContext } from '@/context/UIContext';

export function TruckOwnerDashboard() {
  const navigate = useNavigate();
  const { toast } = useContext(UIContext);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [assigningTruckId, setAssigningTruckId] = useState(null);

  const { data: trucks = [], isLoading: trucksLoading } = useTrucksByOwner();
  const { data: bookings = [], isLoading: bookingsLoading } = useBookings();
  const { mutate: deleteTruck } = useDeleteTruck();
  const { mutate: ackPayment, isPending: ackLoading } = useAcknowledgePayment();
  const { mutate: assignDriver, isPending: assignLoading } = useAssignDriver();
  const { mutate: unassignDriver, isPending: unassignLoading } = useUnassignDriver();

  const pendingBookings = bookings.filter((b) => !b.paymentConfirmed);
  const confirmedBookings = bookings.filter((b) => b.paymentConfirmed);

  const handleDeleteTruck = (id) => {
    if (!confirm('Delete this truck?')) return;
    deleteTruck(id, {
      onSuccess: () => toast.success('Truck deleted'),
      onError: (e) => toast.error(e.message),
    });
  };

  const handleAckPayment = (bookingId, paymentReference) => {
    ackPayment(
      { id: bookingId, paymentReference },
      {
        onSuccess: () => { toast.success('Payment acknowledged!'); setSelectedBooking(null); },
        onError: (e) => toast.error(e.message),
      }
    );
  };

  const handleAssignDriver = (driver) => {
    assignDriver(
      { truckId: assigningTruckId, driverId: driver.userId, driverName: driver.name || driver.userId },
      {
        onSuccess: () => {
          toast.success(`Driver ${driver.name || driver.userId} assigned!`);
          setAssigningTruckId(null);
        },
        onError: (e) => toast.error(e.message),
      }
    );
  };

  const handleUnassignDriver = (truckId) => {
    if (!confirm('Unassign driver from this truck?')) return;
    unassignDriver(truckId, {
      onSuccess: () => toast.success('Driver unassigned'),
      onError: (e) => toast.error(e.message),
    });
  };

  return (
    <Layout>
      <div className="space-y-8">
        {/* Page header */}
        <div className="flex items-center justify-between gap-6 bg-gradient-to-r from-cyan-600 to-blue-600 text-white p-8 rounded-2xl shadow-xl border-2 border-cyan-400">
          <div>
            <h1 className="text-5xl font-black">🚚 Fleet Manager</h1>
            <p className="text-cyan-100 text-lg mt-2 font-semibold">Control your entire fleet</p>
          </div>
          <button onClick={() => navigate('/trucks/add')} className="btn-primary whitespace-nowrap">
            ➕ Add Truck
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard label="Total Trucks" value={trucks.length} icon="🚛" color="blue" />
          <StatCard label="Active Trucks" value={trucks.filter((t) => t.status === 'AVAILABLE').length} icon="✅" color="green" />
          <StatCard label="Pending Bookings" value={pendingBookings.length} icon="📋" color="amber" />
          <StatCard label="Confirmed Bookings" value={confirmedBookings.length} icon="💰" color="purple" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Trucks */}
          <div className="lg:col-span-2 space-y-5">
            <h2 className="text-2xl font-black bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">My Trucks</h2>
            {trucksLoading ? (
              <LoadingSpinner text="Loading trucks…" />
            ) : trucks.length === 0 ? (
              <EmptyState
                icon="🚛"
                title="No trucks yet"
                description="Register your first truck to start accepting shipments"
                action="Add Truck"
                onAction={() => navigate('/trucks/add')}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {trucks.map((truck) => (
                  <TruckCard
                    key={truck.id}
                    truck={truck}
                    onClick={() => navigate(`/trucks/${truck.id}`)}
                    actions={[
                      truck.driverId 
                        ? { label: '👤 Unassign', variant: 'secondary', onClick: () => handleUnassignDriver(truck.id) }
                        : { label: '👤 Assign Driver', variant: 'primary', onClick: () => setAssigningTruckId(truck.id) },
                      { label: 'Edit', variant: 'secondary', onClick: () => navigate(`/trucks/${truck.id}/edit`) },
                      { label: 'Delete', variant: 'danger', onClick: () => handleDeleteTruck(truck.id) },
                    ]}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Bookings */}
          <div className="space-y-5">
            <h2 className="text-xl font-bold text-slate-900">
              Bookings
              {pendingBookings.length > 0 && (
                <span className="ml-3 inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-500 text-white text-xs font-bold">
                  {pendingBookings.length}
                </span>
              )}
            </h2>
            {bookingsLoading ? (
              <LoadingSpinner />
            ) : bookings.length === 0 ? (
              <EmptyState icon="📋" title="No bookings yet" description="Bookings for your trucks will appear here" />
            ) : (
              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                {bookings.map((booking) => (
                  <BookingCard
                    key={booking.id}
                    booking={booking}
                    isTruckOwner
                    onAcknowledge={setSelectedBooking}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Payment modal */}
      <PaymentModal
        isOpen={!!selectedBooking}
        booking={selectedBooking}
        onClose={() => setSelectedBooking(null)}
        onConfirm={handleAckPayment}
        isLoading={ackLoading}
      />

      {/* Driver assignment modal */}
      <DriverAssignmentModal
        isOpen={!!assigningTruckId}
        onClose={() => setAssigningTruckId(null)}
        onAssign={handleAssignDriver}
        isLoading={assignLoading}
        currentDriverId={trucks.find(t => t.id === assigningTruckId)?.driverId}
      />
    </Layout>
  );
}
