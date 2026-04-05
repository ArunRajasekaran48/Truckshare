import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Common/Layout';
import { StatCard } from '@/components/Dashboard/StatCard';
import { TruckCard } from '@/components/Truck/TruckCard';
import { BookingCard } from '@/components/Booking/BookingCard';
import { PaymentModal } from '@/components/Booking/PaymentModal';
import { DriverAssignmentModal } from '@/components/Truck/DriverAssignmentModal';
import { ConfirmModal } from '@/components/Common/ConfirmModal';
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
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, truckId: null });
  const [unassignConfirm, setUnassignConfirm] = useState({ isOpen: false, truckId: null });

  const { data: trucks = [], isLoading: trucksLoading } = useTrucksByOwner();
  const { data: bookings = [], isLoading: bookingsLoading } = useBookings();
  const { mutate: deleteTruck } = useDeleteTruck();
  const { mutate: ackPayment, isPending: ackLoading } = useAcknowledgePayment();
  const { mutate: assignDriver, isPending: assignLoading } = useAssignDriver();
  const { mutate: unassignDriver, isPending: unassignLoading } = useUnassignDriver();

  const pendingBookings = bookings.filter((b) => !b.paymentConfirmed);
  const confirmedBookings = bookings.filter((b) => b.paymentConfirmed);

  const handleDeleteTruck = (id) => {
    setDeleteConfirm({ isOpen: true, truckId: id });
  };

  const confirmDeleteTruck = () => {
    deleteTruck(deleteConfirm.truckId, {
      onSuccess: () => toast.success('Truck deleted'),
      onError: (e) => toast.error(e.message),
    });
    setDeleteConfirm({ isOpen: false, truckId: null });
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
    setUnassignConfirm({ isOpen: true, truckId });
  };

  const confirmUnassignDriver = () => {
    unassignDriver(unassignConfirm.truckId, {
      onSuccess: () => toast.success('Driver unassigned'),
      onError: (e) => toast.error(e.message),
    });
    setUnassignConfirm({ isOpen: false, truckId: null });
  };

  return (
    <Layout>
      <div className="space-y-8">
        {/* Page header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Truck Owner Dashboard</h1>
            <p className="text-sm text-slate-600 mt-2">Manage your fleet and bookings</p>
          </div>
          <button onClick={() => navigate('/trucks/add')} className="btn-primary">
            + Add Truck
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total Trucks" value={trucks.length} icon="🚛" color="teal" />
          <StatCard label="Active Trucks" value={trucks.filter((t) => t.status === 'AVAILABLE').length} icon="✅" color="green" />
          <StatCard label="Pending Bookings" value={pendingBookings.length} icon="📋" color="amber" />
          <StatCard label="Confirmed Bookings" value={confirmedBookings.length} icon="💰" color="blue" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Trucks */}
          <div className="lg:col-span-2 space-y-5">
            <h2 className="text-xl font-bold text-slate-900">My Trucks</h2>
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

      {/* Delete truck confirmation */}
      <ConfirmModal
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, truckId: null })}
        onConfirm={confirmDeleteTruck}
        title="Delete Truck"
        message="Are you sure you want to permanently delete this truck? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        isDanger
      />

      {/* Unassign driver confirmation */}
      <ConfirmModal
        isOpen={unassignConfirm.isOpen}
        onClose={() => setUnassignConfirm({ isOpen: false, truckId: null })}
        onConfirm={confirmUnassignDriver}
        title="Unassign Driver"
        message="Are you sure you want to unassign this driver from the truck?"
        confirmText="Unassign"
        cancelText="Cancel"
      />
    </Layout>
  );
}
