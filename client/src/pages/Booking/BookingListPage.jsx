import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Common/Layout';
import { BookingCard } from '@/components/Booking/BookingCard';
import { PaymentModal } from '@/components/Booking/PaymentModal';
import { LoadingSpinner } from '@/components/Common/LoadingSpinner';
import { EmptyState } from '@/components/Common/EmptyState';
import { useBookings, useAcknowledgePayment, useCancelBooking } from '@/hooks/useBooking';
import { useAuth } from '@/hooks/useAuth';
import { TripRoutePreview } from '@/components/Tracking/TripRoutePreview';
import { UIContext } from '@/context/UIContext';

export function BookingListPage() {
  const navigate = useNavigate();
  const { toast } = useContext(UIContext);
  const { isTruckOwner, isBusinessUser, isDriver } = useAuth();

  const { data: bookings = [], isLoading } = useBookings();
  const { mutate: ackPayment, isPending: ackPending } = useAcknowledgePayment();
  const { mutate: cancelBooking } = useCancelBooking();

  const [selectedBooking, setSelectedBooking] = useState(null);
  const [filter, setFilter] = useState('ALL');

  const isPendingBooking = (b) => b?.status === 'PROPOSED' || !b?.paymentConfirmed;
  const isConfirmedBooking = (b) => !isPendingBooking(b);

  const filtered = filter === 'ALL'
    ? bookings
    : filter === 'PENDING'
    ? bookings.filter(isPendingBooking)
    : bookings.filter(isConfirmedBooking);

  const handleAckPayment = (bookingId, ref) => {
    ackPayment(
      { id: bookingId, paymentReference: ref },
      {
        onSuccess: () => { toast.success('Payment acknowledged!'); setSelectedBooking(null); },
        onError: (e) => toast.error(e.message),
      }
    );
  };

  const handleCancel = (id) => {
    if (!confirm('Cancel this booking?')) return;
    cancelBooking(id, {
      onSuccess: () => toast.success('Booking cancelled'),
      onError: (e) => toast.error(e.message),
    });
  };

  return (
    <Layout>
      <div className="space-y-5">
        <h1 className="text-xl font-bold text-gray-900">Bookings</h1>

        {/* Filter tabs */}
        <div className="flex gap-2">
          {['ALL', 'PENDING', 'CONFIRMED'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                filter === f
                  ? 'bg-teal-600 text-white border-teal-600'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
              }`}
            >
              {f === 'ALL'
                ? `All (${bookings.length})`
                : f === 'PENDING'
                  ? `Pending (${bookings.filter(isPendingBooking).length})`
                  : `Confirmed (${bookings.filter(isConfirmedBooking).length})`}
            </button>
          ))}
        </div>

        {/* Grid */}
        {isLoading ? (
          <LoadingSpinner text="Loading bookings…" />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon="📋"
            title="No bookings found"
            description={
              isTruckOwner
                ? 'Bookings for your trucks will appear here'
                : isDriver
                  ? 'Trips appear when your truck is booked. Ask your fleet owner to assign you to a truck.'
                  : 'Book a truck from the matching page'
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((b) => (
              <BookingCard
                key={b.id}
                booking={b}
                isTruckOwner={isTruckOwner}
                trackLabel={isDriver ? '🚛 Trip & live map' : '📍 Track'}
                routePreview={
                  isDriver ? (
                    <TripRoutePreview
                      bookingId={b.id}
                      shipmentId={b.shipmentId}
                      paymentConfirmed={b.paymentConfirmed}
                    />
                  ) : undefined
                }
                onAcknowledge={isTruckOwner ? setSelectedBooking : undefined}
                onCancel={isBusinessUser ? handleCancel : undefined}
                onTrack={
                  isBusinessUser || isDriver ? (id) => navigate(`/tracking/${id}`) : undefined
                }
              />
            ))}
          </div>
        )}
      </div>

      <PaymentModal
        isOpen={!!selectedBooking}
        booking={selectedBooking}
        onClose={() => setSelectedBooking(null)}
        onConfirm={handleAckPayment}
        isLoading={ackPending}
      />
    </Layout>
  );
}
